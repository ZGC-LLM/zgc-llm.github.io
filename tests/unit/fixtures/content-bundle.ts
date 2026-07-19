import type { ContentBundle } from '@/lib/content-validation'
import type { FactAuthorizationScope, FactReference } from '@/types/content'

export function publishedFact(
  factId: string,
  authorizedScopes: readonly FactAuthorizationScope[],
  overrides: Partial<FactReference> = {},
): FactReference {
  return {
    authorizedScopes,
    evidenceStatus: 'project-decision',
    factId,
    publication: 'publish',
    reviewedAt: '2026-07-19',
    reviewer: 'content test fixture',
    ...overrides,
  }
}

/**
 * A complete, mutable content bundle whose baseline is intentionally free of
 * both errors and warnings. Tests clone it before introducing one bad boundary.
 */
export function createValidContentBundle(): ContentBundle {
  return {
    members: [
      {
        description: '公开角色',
        facts: [publishedFact('FACT-101', ['display-name', 'role'])],
        id: 'member-one',
        logo: 'https://assets.example.test/member-one.svg',
        name: '已核验成员甲',
        type: 'research',
      },
    ],
    news: [
      {
        applicationTargetId: 'alliance',
        body: [
          { text: '已核验正文', type: 'paragraph' },
          { text: '信息要点', type: 'heading' },
          { items: ['第一项'], type: 'list' },
        ],
        category: 'news',
        ctaLabel: '了解申请条件',
        date: '2024-02-29',
        description: '已核验描述',
        facts: [publishedFact('FACT-102', ['result'])],
        published: true,
        slug: 'verified-update',
        title: '已核验动态',
      },
    ],
    workingGroupMembers: {
      'working-group-one': [
        {
          description: '参与公开议题',
          facts: [publishedFact('FACT-104', ['display-name', 'role'])],
          id: 'working-group-member-one',
          logo: 'https://assets.example.test/working-group-member-one.svg',
          name: '已核验共建伙伴甲',
          role: '共建伙伴',
        },
      ],
    },
    workingGroups: [
      {
        applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
        description: '已核验工作范围',
        facts: [publishedFact('FACT-103', ['commitment'])],
        id: 'working-group-one',
        kind: 'working-group',
        leads: [
          {
            description: '角色化协作说明',
            name: '未具名协调角色',
            named: false,
            role: '协调',
          },
        ],
        outcomes: [],
        researchDirections: ['研究方向'],
        responsibilities: ['工作职责'],
        slug: 'working-group-one',
        title: '已核验工作组',
      },
    ],
  }
}

export function cloneContentBundle(bundle: ContentBundle = createValidContentBundle()): ContentBundle {
  return structuredClone(bundle)
}
