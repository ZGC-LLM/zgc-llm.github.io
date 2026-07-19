import type { Locale } from '@/i18n/locales'
import type { FactReference } from '@/types/content'

const REVIEWED_AT = '2026-07-19'
const CONTENT_REVIEWER = 'T-001 repository release audit'

export const PRIVACY_FACTS: readonly FactReference[] = [
  {
    authorizedScopes: ['commitment'],
    evidenceStatus: 'project-decision',
    factId: 'FACT-038',
    publication: 'publish',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
  },
  {
    authorizedScopes: [],
    evidenceStatus: 'unverified',
    factId: 'FACT-039',
    publication: 'neutralize',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
  },
  {
    authorizedScopes: [],
    evidenceStatus: 'conflict',
    factId: 'FACT-040',
    publication: 'neutralize',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
  },
] as const

export interface PrivacyPageCopy {
  beforeDescription: string
  beforeEyebrow: string
  beforeItems: readonly string[]
  beforeTitle: string
  boundaryDescription: string
  boundaryEyebrow: string
  boundaryTitle: string
  externalCardBody: string
  externalCardTitle: string
  heroDescription: string
  heroEyebrow: string
  heroTitle: string
  metadataDescription: string
  metadataTitle: string
  recoveryAction: string
  recoveryDescription: string
  recoveryEyebrow: string
  recoveryTitle: string
  siteCardBody: string
  siteCardTitle: string
}

export const PRIVACY_PAGE_COPY: Readonly<Record<Locale, PrivacyPageCopy>> = {
  en: {
    beforeDescription:
      'Stop before submitting if the destination requires an unexpected login, names a different program or does not explain how the requested information will be used.',
    beforeEyebrow: 'Before submitting',
    beforeItems: [
      'Confirm that the form name and applicant group match the program you selected.',
      'Read the information-handling notice shown on the destination form.',
      'Provide only the information needed for that application.',
      'Do not submit if the destination or its notice is unclear.',
    ],
    beforeTitle: 'Check the destination form',
    boundaryDescription:
      'Selecting an application entry takes you away from this site. The statements below cover this website only and do not replace the notice on the destination form.',
    boundaryEyebrow: 'Processing boundary',
    boundaryTitle: 'This site and external forms have separate roles',
    externalCardBody:
      'Information entered in a Feishu form leaves this website and is submitted through the destination service. This site has not verified which party is identified there, or whether the form states its purpose, retention period and contact route. Review what the form actually shows and do not submit if those details are missing or unclear.',
    externalCardTitle: 'Destination form',
    heroDescription:
      'This site publishes Alliance information and links to external application forms. It does not receive or store the information entered in those forms. Read the notice shown on the destination form before submitting.',
    heroEyebrow: 'Application information',
    heroTitle: 'Application information notice',
    metadataDescription:
      'The boundary between this static website and external application forms, plus the checks to make before submitting information.',
    metadataTitle: 'Application information notice',
    recoveryAction: 'View participation routes',
    recoveryDescription:
      'Application routes are enabled separately. Return to the participation page to check the current status and destination notice for each route.',
    recoveryEyebrow: 'Application status',
    recoveryTitle: 'Continue from the relevant participation page',
    siteCardBody:
      'This static website has no on-site application form, application endpoint or applicant database. It does not receive or store content entered on an external form. Hosting providers may process access logs under their own terms.',
    siteCardTitle: 'This website',
  },
  zh: {
    beforeDescription:
      '如果目标页面要求未预期的登录、显示的申请项目不一致，或没有说明所需信息的用途，请暂停提交。',
    beforeEyebrow: '提交前',
    beforeItems: [
      '核对表单名称、申请对象与所选项目是否一致。',
      '阅读目标表单实际展示的信息处理说明。',
      '只填写完成该申请所需的信息。',
      '目标页面或说明不清晰时，不要继续提交。',
    ],
    beforeTitle: '请先核对目标表单',
    boundaryDescription:
      '点击申请入口后会离开本站。下列说明只覆盖官网本身，不替代目标表单展示的说明。',
    boundaryEyebrow: '处理边界',
    boundaryTitle: '官网与外部表单的作用范围不同',
    externalCardBody:
      '您在飞书表单中填写的信息会离开本站，并通过目标服务提交。本站尚未核验目标表单标示的相关主体，也未确认表单是否说明用途、保留期限与联系渠道；请以页面实际展示为准，信息缺失或不清晰时不要提交。',
    externalCardTitle: '目标表单',
    heroDescription:
      '本站展示联盟信息并提供外部申请入口。申请表中填写的信息不在本站接收或保存；提交前请查看目标表单实际展示的处理说明。',
    heroEyebrow: '申请信息',
    heroTitle: '申请信息处理说明',
    metadataDescription: '说明静态官网与外部申请表单的处理边界，以及提交信息前需要核对的事项。',
    metadataTitle: '申请信息处理说明',
    recoveryAction: '查看参与方式',
    recoveryDescription:
      '各类申请入口会分别启用。返回参与页面，可查看对应入口的当前状态与离站说明。',
    recoveryEyebrow: '入口状态',
    recoveryTitle: '从对应参与页面继续',
    siteCardBody:
      '本站为静态信息页面，不提供站内申请表单、申请接口或申请人数据库，也不接收、落库或保存您在外部申请表中填写的内容。托管服务如产生访问日志，按相应基础设施的规则处理。',
    siteCardTitle: '本站',
  },
}
