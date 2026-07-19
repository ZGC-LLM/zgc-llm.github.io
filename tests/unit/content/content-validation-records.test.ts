import { validateContent, type ContentBundle, type ValidationIssue } from '@/lib/content-validation'
import type {
  MemberSummary,
  NewsEntry,
  WorkingGroupMember,
  WorkingGroupSummary,
} from '@/types/content'
import { cloneContentBundle, publishedFact } from '../fixtures/content-bundle'
import { afterEach, describe, expect, it, vi } from 'vitest'

function issues(bundle: ContentBundle): ValidationIssue[] {
  return validateContent(bundle)
}

function expectIssue(
  bundle: ContentBundle,
  code: string,
  where: string,
  severity: ValidationIssue['severity'] = 'error',
): void {
  expect(issues(bundle)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code,
        severity,
        where: expect.stringContaining(where),
      }),
    ]),
  )
}

function asRuntimeValue<T>(value: unknown): T {
  return value as T
}

describe('member record validation', () => {
  it('rejects missing fields, unsupported types and unsafe logos', () => {
    const bundle = cloneContentBundle()
    bundle.members = [
      {
        ...bundle.members[0],
        id: '',
        logo: 'http://assets.example.test/member.svg',
        name: '',
        type: asRuntimeValue<MemberSummary['type']>('unsupported'),
      },
    ]

    expectIssue(bundle, 'required', 'members[0]')
    expectIssue(bundle, 'enum', 'members[0]')
    expectIssue(bundle, 'https', 'members[0]')
    expect(issues(bundle).filter(({ code }) => code === 'required')).toHaveLength(2)
  })

  it('requires lowercase kebab-case identifiers', () => {
    const bundle = cloneContentBundle()
    bundle.members = [{ ...bundle.members[0], id: 'Member_One' }]

    expectIssue(bundle, 'identifier', 'members[0] #Member_One')
  })

  it('rejects duplicate member identifiers and display names independently', () => {
    const bundle = cloneContentBundle()
    const first = bundle.members[0]
    bundle.members = [
      first,
      {
        ...first,
        facts: [publishedFact('FACT-105', ['display-name'])],
      },
    ]

    expect(issues(bundle).filter(({ code }) => code === 'unique')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('member id 重复') }),
        expect.objectContaining({ message: expect.stringContaining('member name 重复') }),
      ]),
    )
  })

  it('accepts every registered member category and a missing optional logo', () => {
    const bundle = cloneContentBundle()
    const categories: readonly MemberSummary['type'][] = [
      'founding',
      'institution',
      'research',
      'ecosystem',
    ]
    bundle.members = categories.map((type, index) => ({
      facts: [publishedFact(`FACT-${110 + index}`, ['display-name'])],
      id: `member-${index + 1}`,
      name: `已核验成员${index + 1}`,
      type,
    }))

    expect(issues(bundle)).toEqual([])
  })
})

describe('news record validation', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects missing text fields, malformed slugs and invalid scalar types', () => {
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        category: asRuntimeValue<NewsEntry['category']>('press-release'),
        description: '',
        published: asRuntimeValue<boolean>('yes'),
        slug: 'Invalid_Slug',
        title: '',
      },
    ]

    expect(issues(bundle)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'required', message: expect.stringContaining('title') }),
        expect.objectContaining({ code: 'required', message: expect.stringContaining('description') }),
        expect.objectContaining({ code: 'identifier' }),
        expect.objectContaining({ code: 'enum' }),
        expect.objectContaining({ code: 'type' }),
      ]),
    )
  })

  it('rejects an impossible calendar date and an empty body', () => {
    const bundle = cloneContentBundle()
    bundle.news = [{ ...bundle.news[0], body: [], date: '2026-02-29' }]

    expectIssue(bundle, 'date', 'news[0]')
    expectIssue(bundle, 'required', 'news[0]')
  })

  it('rejects duplicate news slugs', () => {
    const bundle = cloneContentBundle()
    bundle.news = [
      bundle.news[0],
      {
        ...bundle.news[0],
        facts: [publishedFact('FACT-120', ['result'])],
        title: '另一条动态',
      },
    ]

    expectIssue(bundle, 'unique', 'news[1] #verified-update')
  })

  it('rejects non-object and unknown content blocks', () => {
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        body: asRuntimeValue<NewsEntry['body']>([
          null,
          [],
          { text: '未知内容', type: 'quote' },
        ]),
      },
    ]

    expect(issues(bundle).filter(({ code }) => code === 'block-type')).toHaveLength(3)
  })

  it.each([
    { block: { items: [], type: 'list' }, label: 'empty list' },
    { block: { items: ['有效项', '  '], type: 'list' }, label: 'blank list item' },
    { block: { items: ['有效项', 7], type: 'list' }, label: 'non-string list item' },
    { block: { text: '', type: 'heading' }, label: 'empty heading' },
    { block: { text: 7, type: 'heading' }, label: 'non-string heading' },
    { block: { text: '\t', type: 'paragraph' }, label: 'blank paragraph' },
    { block: { text: null, type: 'paragraph' }, label: 'non-string paragraph' },
  ] satisfies readonly { block: unknown; label: string }[])(
    'rejects a $label block',
    ({ block }) => {
      const bundle = cloneContentBundle()
      bundle.news = [
        {
          ...bundle.news[0],
          body: asRuntimeValue<NewsEntry['body']>([block]),
        },
      ]

      expectIssue(bundle, 'empty-block', 'news[0] #verified-update.body[0]')
    },
  )

  it('requires exactly one action target paired with a label', () => {
    const bothTargets = cloneContentBundle()
    bothTargets.news = [
      {
        ...bothTargets.news[0],
        ctaHref: 'https://resources.example.test/guide',
      },
    ]
    expectIssue(bothTargets, 'cta', 'news[0]')

    const missingLabel = cloneContentBundle()
    missingLabel.news = [
      {
        ...missingLabel.news[0],
        applicationTargetId: undefined,
        ctaHref: 'https://resources.example.test/guide',
        ctaLabel: undefined,
      },
    ]
    expectIssue(missingLabel, 'cta', 'news[0]')

    const missingTarget = cloneContentBundle()
    missingTarget.news = [
      {
        ...missingTarget.news[0],
        applicationTargetId: undefined,
        ctaLabel: '查看指南',
      },
    ]
    expectIssue(missingTarget, 'cta', 'news[0]')
  })

  it('rejects an unknown application target and an insecure ordinary link', () => {
    const unknownTarget = cloneContentBundle()
    unknownTarget.news = [
      {
        ...unknownTarget.news[0],
        applicationTargetId: asRuntimeValue<NewsEntry['applicationTargetId']>('unknown-target'),
      },
    ]
    expectIssue(unknownTarget, 'application-target', 'news[0]')

    const insecureHref = cloneContentBundle()
    insecureHref.news = [
      {
        ...insecureHref.news[0],
        applicationTargetId: undefined,
        ctaHref: 'http://resources.example.test/guide',
      },
    ]
    expectIssue(insecureHref, 'https', 'news[0]')
  })

  it('accepts an ordinary safe HTTPS resource without treating it as an application form', () => {
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        applicationTargetId: undefined,
        ctaHref: 'https://resources.example.test/guide?lang=zh#scope',
        ctaLabel: '查看公开资料',
      },
    ]

    expect(issues(bundle)).toEqual([])
  })

  it('blocks a Feishu-looking URL outside the exact application allowlist', () => {
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        applicationTargetId: undefined,
        ctaHref: 'https://unapproved.feishu.cn/share/base/form/not-approved',
        ctaLabel: '打开申请表',
      },
    ]

    expectIssue(bundle, 'application-url', 'news[0]')
    expectIssue(bundle, 'application-target-migration', 'news[0]', 'warning')
  })

  it('warns when an approved legacy form has not been enabled by its explicit environment key', () => {
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL', '')
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY', '')
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM', '')
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        applicationTargetId: undefined,
        ctaHref: 'https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb',
        ctaLabel: '打开申请表',
      },
    ]

    expectIssue(bundle, 'application-unconfigured', 'news[0]', 'warning')
    expectIssue(bundle, 'application-target-migration', 'news[0]', 'warning')
  })

  it('keeps only the migration warning when the exact legacy form is explicitly enabled', () => {
    const href = 'https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb'
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL', href)
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY', '')
    vi.stubEnv('NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM', '')
    const bundle = cloneContentBundle()
    bundle.news = [
      {
        ...bundle.news[0],
        applicationTargetId: undefined,
        ctaHref: href,
        ctaLabel: '打开申请表',
      },
    ]

    expect(issues(bundle)).toEqual([
      expect.objectContaining({
        code: 'application-target-migration',
        severity: 'warning',
      }),
    ])
  })
})

describe('working-group record validation', () => {
  it('rejects missing required fields, malformed identifiers and unsupported kinds', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        description: '',
        id: 'Invalid_Id',
        kind: asRuntimeValue<WorkingGroupSummary['kind']>('committee'),
        slug: '',
        title: '',
      },
    ]
    bundle.workingGroupMembers = { '': [] }

    expect(issues(bundle)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'required', message: expect.stringContaining('slug') }),
        expect.objectContaining({ code: 'required', message: expect.stringContaining('title') }),
        expect.objectContaining({ code: 'required', message: expect.stringContaining('description') }),
        expect.objectContaining({ code: 'identifier', message: expect.stringContaining('id') }),
        expect.objectContaining({ code: 'enum' }),
      ]),
    )
  })

  it('rejects duplicate group identifiers and slugs', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [bundle.workingGroups[0], { ...bundle.workingGroups[0] }]

    expect(issues(bundle).filter(({ code }) => code === 'unique')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('id 重复') }),
        expect.objectContaining({ message: expect.stringContaining('slug 重复') }),
      ]),
    )
  })

  it('reports a missing group identifier without emitting a redundant format error', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [{ ...bundle.workingGroups[0], id: '' }]

    expectIssue(bundle, 'required', 'working-groups[0] #working-group-one')
    expect(
      issues(bundle).some(
        ({ code, where }) => code === 'identifier' && where.startsWith('working-groups[0]'),
      ),
    ).toBe(false)
  })

  it('rejects an unregistered group application environment key', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_UNKNOWN',
      },
    ]

    expectIssue(bundle, 'application-env', 'working-groups[0]')
  })

  it('reports empty leads and empty responsibility collections as readiness warnings', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        leads: [],
        researchDirections: [],
        responsibilities: [],
      },
    ]

    const emptyWarnings = issues(bundle).filter(
      ({ code, severity }) => code === 'empty' && severity === 'warning',
    )
    expect(emptyWarnings).toHaveLength(3)
  })

  it('rejects blank items inside otherwise present responsibility collections', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        researchDirections: ['\t'],
        responsibilities: [''],
      },
    ]

    expect(issues(bundle).filter(({ code }) => code === 'empty-block')).toHaveLength(2)
  })

  it('rejects malformed and duplicate lead records', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroups = [
      {
        ...bundle.workingGroups[0],
        leads: [
          {
            name: '',
            named: asRuntimeValue<boolean>('yes'),
            role: '',
          },
          {
            name: '重复角色',
            named: false,
            role: '协调',
          },
          {
            name: '重复角色',
            named: false,
            role: '复核',
          },
        ],
      },
    ]

    expect(issues(bundle)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'required', where: expect.stringContaining('leads[0]') }),
        expect.objectContaining({ code: 'type', where: expect.stringContaining('leads[0]') }),
        expect.objectContaining({ code: 'unique', where: expect.stringContaining('leads[2]') }),
      ]),
    )
    expect(issues(bundle).filter(({ code }) => code === 'required')).toHaveLength(2)
  })
})

describe('working-group member record validation', () => {
  it('accepts an explicitly empty collaborator list', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroupMembers = { 'working-group-one': [] }

    expect(issues(bundle)).toEqual([])
  })

  it('rejects member lists that refer to an unknown working-group slug', () => {
    const bundle = cloneContentBundle()
    bundle.workingGroupMembers = {
      'unknown-working-group': bundle.workingGroupMembers['working-group-one'],
    }

    expectIssue(bundle, 'ref', 'working-group-members.unknown-working-group')
  })

  it('rejects missing fields, malformed identifiers and unsafe logos', () => {
    const bundle = cloneContentBundle()
    const member = bundle.workingGroupMembers['working-group-one'][0]
    bundle.workingGroupMembers = {
      'working-group-one': [
        {
          ...member,
          id: '',
          logo: 'javascript:alert(1)',
          name: '',
        },
        {
          ...member,
          facts: [publishedFact('FACT-133', ['display-name'])],
          id: 'Invalid_Id',
          logo: undefined,
          name: '另一共建伙伴',
        },
      ],
    }

    expectIssue(bundle, 'required', 'working-group-members.working-group-one[0]')
    expectIssue(bundle, 'identifier', 'working-group-members.working-group-one[1]')
    expectIssue(bundle, 'https', 'working-group-members.working-group-one[0]')
    expect(issues(bundle).filter(({ code }) => code === 'required')).toHaveLength(2)
  })

  it('enforces globally unique IDs and per-group unique display names', () => {
    const bundle = cloneContentBundle()
    const baseGroup = bundle.workingGroups[0]
    const baseMember = bundle.workingGroupMembers['working-group-one'][0]
    const duplicateName: WorkingGroupMember = {
      ...baseMember,
      facts: [publishedFact('FACT-130', ['display-name'])],
      id: 'working-group-member-two',
    }
    const duplicateId: WorkingGroupMember = {
      ...baseMember,
      facts: [publishedFact('FACT-131', ['display-name'])],
      name: '另一共建伙伴',
    }
    bundle.workingGroups = [
      baseGroup,
      {
        ...baseGroup,
        facts: [publishedFact('FACT-132', ['commitment'])],
        id: 'working-group-two',
        slug: 'working-group-two',
        title: '另一个工作组',
      },
    ]
    bundle.workingGroupMembers = {
      'working-group-one': [baseMember, duplicateName],
      'working-group-two': [duplicateId],
    }

    expect(issues(bundle).filter(({ code }) => code === 'unique')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('name 重复') }),
        expect.objectContaining({ message: expect.stringContaining('id 重复') }),
      ]),
    )
  })
})
