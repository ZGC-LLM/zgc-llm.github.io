import { describe, expect, it } from 'vitest'

import {
  contentErrors,
  validateAllContent,
  validateContent,
  type ContentBundle,
} from '@/lib/content-validation'

// 一个最小合法内容束，各用例在其基础上注入坏数据。
function validBundle(): ContentBundle {
  return {
    members: [{ id: 'a', name: '甲单位', type: 'research' }],
    news: [
      {
        body: [{ text: '正文', type: 'paragraph' }],
        category: 'news',
        date: '2026-07-18',
        description: '描述',
        published: true,
        slug: 'hello',
        title: '标题',
      },
    ],
    workingGroups: [
      {
        description: '描述',
        id: 'wg',
        kind: 'working-group',
        leads: [{ name: '牵头方', named: true, role: '统筹' }],
        outcomes: [],
        researchDirections: ['方向'],
        responsibilities: ['职责'],
        slug: 'wg',
        title: '工作组',
      },
    ],
    workingGroupMembers: { wg: [] },
  }
}

function errorCodes(bundle: ContentBundle): string[] {
  return validateContent(bundle)
    .filter((issue) => issue.severity === 'error')
    .map((issue) => issue.code)
}

describe('validateAllContent（真实内容）', () => {
  it('仓库内真实内容无 error 级问题', () => {
    expect(contentErrors()).toEqual([])
  })

  it('返回结构化 issue 列表', () => {
    for (const issue of validateAllContent()) {
      expect(issue).toHaveProperty('severity')
      expect(issue).toHaveProperty('code')
      expect(issue).toHaveProperty('where')
      expect(issue).toHaveProperty('message')
    }
  })
})

describe('validateContent（坏数据捕获）', () => {
  it('合法束零 error', () => {
    expect(errorCodes(validBundle())).toEqual([])
  })

  it('捕获必填缺失', () => {
    const b = validBundle()
    b.members = [{ id: '', name: '', type: 'research' }]
    expect(errorCodes(b)).toContain('required')
  })

  it('捕获 member id 重复', () => {
    const b = validBundle()
    b.members = [
      { id: 'dup', name: '甲', type: 'research' },
      { id: 'dup', name: '乙', type: 'institution' },
    ]
    expect(errorCodes(b)).toContain('unique')
  })

  it('捕获 news slug 重复', () => {
    const b = validBundle()
    b.news = [
      { ...b.news[0], slug: 'same' },
      { ...b.news[0], slug: 'same', title: '另一条' },
    ]
    expect(errorCodes(b)).toContain('unique')
  })

  it('捕获非法日期格式', () => {
    const b = validBundle()
    b.news = [{ ...b.news[0], date: '2026/7/1' }]
    expect(errorCodes(b)).toContain('date')
  })

  it('捕获非 https 外链', () => {
    const b = validBundle()
    b.news = [{ ...b.news[0], ctaHref: 'http://insecure.example', ctaLabel: '申请' }]
    expect(errorCodes(b)).toContain('https')
  })

  it('捕获 cta 不成对', () => {
    const b = validBundle()
    b.news = [{ ...b.news[0], ctaHref: 'https://ok.example', ctaLabel: undefined }]
    expect(errorCodes(b)).toContain('cta')
  })

  it('捕获非法 member type', () => {
    const b = validBundle()
    // @ts-expect-error 故意注入非法枚举值
    b.members = [{ id: 'x', name: '甲', type: 'unknown' }]
    expect(errorCodes(b)).toContain('enum')
  })

  it('捕获 lead named 非布尔', () => {
    const b = validBundle()
    // @ts-expect-error 故意注入非法 named
    b.workingGroups[0].leads = [{ name: '牵头', named: 'yes', role: '统筹' }]
    expect(errorCodes(b)).toContain('type')
  })

  it('未授权空态（wg-members 为空）不判 error', () => {
    const b = validBundle()
    b.workingGroupMembers = { wg: [] }
    expect(errorCodes(b)).toEqual([])
  })
})
