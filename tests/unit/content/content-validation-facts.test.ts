import { validateContent, type ContentBundle, type ValidationIssue } from '@/lib/content-validation'
import type { FactReference, FactSource } from '@/types/content'
import { cloneContentBundle, publishedFact } from '../fixtures/content-bundle'
import { describe, expect, it } from 'vitest'

const VALID_SOURCE: FactSource = {
  publishedAt: '2026-07-01',
  reviewedAt: '2026-07-19',
  title: '已复核公开来源',
  url: 'https://source.example.test/public-record',
}

function asRuntimeValue<T>(value: unknown): T {
  return value as T
}

function validateMemberFacts(facts: unknown): ValidationIssue[] {
  const bundle = cloneContentBundle()
  bundle.members = [
    {
      ...bundle.members[0],
      facts: asRuntimeValue<readonly FactReference[] | undefined>(facts),
    },
  ]

  return validateContent(bundle).filter(({ where }) => where.startsWith('members[0]'))
}

function codes(issues: readonly ValidationIssue[]): string[] {
  return issues.map(({ code }) => code)
}

describe('fact evidence readiness', () => {
  it('warns when evidence-required records omit or empty their fact ledger', () => {
    expect(validateMemberFacts(undefined)).toEqual([
      expect.objectContaining({ code: 'fact-unreviewed', severity: 'warning' }),
    ])
    expect(validateMemberFacts([])).toEqual([
      expect.objectContaining({ code: 'fact-unreviewed', severity: 'warning' }),
    ])
  })

  it('requires evidence for published records but not unpublished or role-only records', () => {
    const bundle = cloneContentBundle()
    bundle.news = [{ ...bundle.news[0], facts: undefined, published: false }]
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        leads: [{ name: '角色化参与方', named: false, role: '协作' }],
      },
    ]
    bundle.workingGroupMembers = { 'working-group-one': [] }

    expect(validateContent(bundle)).toEqual([])

    const publishedNews = cloneContentBundle(bundle)
    publishedNews.news = [{ ...publishedNews.news[0], published: true }]
    expect(codes(validateContent(publishedNews))).toContain('fact-unreviewed')

    const namedLead = cloneContentBundle(bundle)
    namedLead.workingGroups = [
      {
        ...namedLead.workingGroups[0],
        leads: [{ name: '已具名牵头方', named: true, role: '牵头' }],
      },
    ]
    expect(validateContent(namedLead)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'fact-unreviewed',
          where: expect.stringContaining('leads[0]'),
        }),
      ]),
    )
  })

  it('always requires a valid published fact for the working-group record itself', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [{ ...bundle.workingGroups[0], facts: undefined }]

    expect(validateContent(bundle)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'fact-unreviewed',
          where: expect.stringContaining('working-groups[0]'),
        }),
      ]),
    )
  })

  it('requires evidence for a publicly named working-group collaborator', () => {
    const bundle = cloneContentBundle()
    const member = bundle.workingGroupMembers['working-group-one'][0]
    bundle.workingGroupMembers = {
      'working-group-one': [{ ...member, facts: undefined }],
    }

    expect(validateContent(bundle)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'fact-unreviewed',
          where: expect.stringContaining('working-group-members.working-group-one[0]'),
        }),
      ]),
    )
  })

  it('rejects a non-array ledger and keeps the readiness warning', () => {
    const result = validateMemberFacts({ factId: 'FACT-201' })

    expect(codes(result)).toEqual(['fact-type', 'fact-unreviewed'])
  })

  it('rejects primitive, null and array entries as non-object facts', () => {
    const result = validateMemberFacts([null, 'FACT-201', []])

    expect(result.filter(({ code }) => code === 'fact-type')).toHaveLength(3)
    expect(codes(result)).toContain('fact-unreviewed')
  })

  it('does not treat block-only or neutralized facts as publication evidence', () => {
    const result = validateMemberFacts([
      {
        authorizedScopes: [],
        evidenceStatus: 'editorial',
        factId: 'FACT-201',
        publication: 'block',
        reviewedAt: '2026-07-19',
      },
      {
        authorizedScopes: [],
        evidenceStatus: 'conflict',
        factId: 'FACT-202',
        publication: 'neutralize',
        reviewedAt: '2026-07-19',
      },
    ] satisfies readonly FactReference[])

    expect(result).toEqual([
      expect.objectContaining({ code: 'fact-unreviewed', severity: 'warning' }),
    ])
  })

  it('accepts a valid project decision without demanding a public source', () => {
    expect(validateMemberFacts([publishedFact('FACT-201', ['display-name'])])).toEqual([])
  })

  it.each(['partial', 'public-source'] as const)(
    'accepts %s publication evidence when a complete source is attached',
    (evidenceStatus) => {
      expect(
        validateMemberFacts([
          publishedFact('FACT-201', ['display-name'], {
            evidenceStatus,
            source: VALID_SOURCE,
          }),
        ]),
      ).toEqual([])
    },
  )
})

describe('fact reference fields', () => {
  it('rejects malformed identity, date and enum fields', () => {
    const malformed = asRuntimeValue<FactReference>({
      authorizedScopes: ['display-name'],
      evidenceStatus: 'rumour',
      factId: 'fact-1',
      publication: 'maybe',
      reviewedAt: '2026-02-29',
    })
    const result = validateMemberFacts([malformed])

    expect(codes(result)).toEqual(
      expect.arrayContaining(['fact-id', 'fact-date', 'fact-enum', 'fact-unreviewed']),
    )
    expect(result.filter(({ code }) => code === 'fact-enum')).toHaveLength(2)
  })

  it('requires a non-empty scope list for publication decisions', () => {
    const emptyScopes = publishedFact('FACT-210', [])
    const result = validateMemberFacts([emptyScopes])

    expect(codes(result)).toEqual(expect.arrayContaining(['fact-scope', 'fact-unreviewed']))
  })

  it('rejects a non-array scope collection', () => {
    const fact = publishedFact('FACT-211', ['display-name'])
    const malformed = {
      ...fact,
      authorizedScopes: asRuntimeValue<FactReference['authorizedScopes']>('display-name'),
    }
    const result = validateMemberFacts([malformed])

    expect(codes(result)).toEqual(expect.arrayContaining(['fact-scope', 'fact-unreviewed']))
  })

  it('rejects unsupported and duplicate authorization scopes', () => {
    const fact = publishedFact('FACT-212', ['display-name'])
    const malformed = {
      ...fact,
      authorizedScopes: asRuntimeValue<FactReference['authorizedScopes']>([
        'display-name',
        'display-name',
        'unregistered-scope',
      ]),
    }
    const result = validateMemberFacts([malformed])

    expect(result.filter(({ code }) => code === 'fact-scope')).toHaveLength(2)
    expect(codes(result)).toContain('fact-unreviewed')
  })

  it.each(['conflict', 'unverified'] as const)(
    'forbids publishing %s evidence',
    (evidenceStatus) => {
      const result = validateMemberFacts([
        publishedFact('FACT-213', ['display-name'], { evidenceStatus }),
      ])

      expect(codes(result)).toEqual(expect.arrayContaining(['fact-publication', 'fact-unreviewed']))
    },
  )

  it('requires authoritative evidence for an official English name scope', () => {
    const result = validateMemberFacts([
      publishedFact('FACT-214', ['official-english-name'], {
        evidenceStatus: 'editorial',
      }),
    ])

    expect(codes(result)).toEqual(expect.arrayContaining(['fact-scope', 'fact-unreviewed']))
  })

  it.each(['project-decision', 'public-source'] as const)(
    'accepts official English name authorization backed by %s evidence',
    (evidenceStatus) => {
      const overrides: Partial<FactReference> =
        evidenceStatus === 'public-source'
          ? { evidenceStatus, source: VALID_SOURCE }
          : { evidenceStatus }

      expect(
        validateMemberFacts([publishedFact('FACT-215', ['official-english-name'], overrides)]),
      ).toEqual([])
    },
  )

  it('requires a non-blank reviewer for every publish decision', () => {
    const missing = publishedFact('FACT-216', ['display-name'], { reviewer: undefined })
    const blank = publishedFact('FACT-217', ['display-name'], { reviewer: '  ' })

    expect(codes(validateMemberFacts([missing]))).toEqual(
      expect.arrayContaining(['fact-reviewer', 'fact-unreviewed']),
    )
    expect(codes(validateMemberFacts([blank]))).toEqual(
      expect.arrayContaining(['fact-reviewer', 'fact-unreviewed']),
    )
  })

  it.each(['partial', 'public-source'] as const)(
    'requires a source for a published %s fact',
    (evidenceStatus) => {
      const result = validateMemberFacts([
        publishedFact('FACT-218', ['display-name'], { evidenceStatus, source: undefined }),
      ])

      expect(codes(result)).toEqual(expect.arrayContaining(['fact-source', 'fact-unreviewed']))
    },
  )

  it('rejects a source that is not a non-array object', () => {
    const result = validateMemberFacts([
      publishedFact('FACT-219', ['display-name'], {
        evidenceStatus: 'public-source',
        source: asRuntimeValue<FactSource>([]),
      }),
    ])

    expect(codes(result)).toEqual(expect.arrayContaining(['fact-type', 'fact-unreviewed']))
  })

  it('validates every required and optional source field', () => {
    const result = validateMemberFacts([
      publishedFact('FACT-220', ['display-name'], {
        evidenceStatus: 'public-source',
        source: asRuntimeValue<FactSource>({
          publishedAt: '2026-02-29',
          reviewedAt: 'not-a-date',
          title: '  ',
          url: 'http://source.example.test/public-record',
        }),
      }),
    ])

    expect(result.filter(({ code }) => code === 'fact-source')).toHaveLength(2)
    expect(result.filter(({ code }) => code === 'fact-date')).toHaveLength(2)
    expect(codes(result)).toContain('fact-unreviewed')
  })

  it('allows a source without an optional publication date', () => {
    const { publishedAt: _publishedAt, ...sourceWithoutPublishedAt } = VALID_SOURCE

    expect(
      validateMemberFacts([
        publishedFact('FACT-221', ['display-name'], {
          evidenceStatus: 'public-source',
          source: sourceWithoutPublishedAt,
        }),
      ]),
    ).toEqual([])
  })

  it('rejects duplicate fact IDs and does not count either duplicate as publishable evidence', () => {
    const result = validateMemberFacts([
      publishedFact('FACT-222', ['display-name']),
      publishedFact('FACT-222', ['role']),
    ])

    expect(codes(result)).toEqual(expect.arrayContaining(['fact-unique', 'fact-unreviewed']))
  })

  it('keeps record errors but suppresses the readiness warning when another fact is publishable', () => {
    const result = validateMemberFacts([
      publishedFact('FACT-223', ['display-name']),
      publishedFact('invalid-id', ['role']),
    ])

    expect(codes(result)).toContain('fact-id')
    expect(codes(result)).not.toContain('fact-unreviewed')
  })
})

describe('fact validation across bundle record types', () => {
  it('applies the same fact contract to news, groups, leads and collaborators', () => {
    const bundle: ContentBundle = cloneContentBundle()
    bundle.news = [{ ...bundle.news[0], facts: [] }]
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        facts: [],
        leads: [{ facts: [], name: '已具名牵头方', named: true, role: '牵头' }],
      },
    ]
    const member = bundle.workingGroupMembers['working-group-one'][0]
    bundle.workingGroupMembers = {
      'working-group-one': [{ ...member, facts: [] }],
    }

    const unreviewed = validateContent(bundle).filter(({ code }) => code === 'fact-unreviewed')

    expect(unreviewed).toHaveLength(4)
    expect(unreviewed.map(({ where }) => where)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('news[0]'),
        expect.stringContaining('working-groups[0]'),
        expect.stringContaining('leads[0]'),
        expect.stringContaining('working-group-members.working-group-one[0]'),
      ]),
    )
  })
})
