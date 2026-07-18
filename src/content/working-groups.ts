import { type Locale } from '@/i18n/locales'
import type { WorkingGroupSummary } from '@/types/content'

export const WORKING_GROUPS: readonly WorkingGroupSummary[] = [
  {
    description:
      '汇聚可信的防御者与真实攻防需求，联合安全企业、高校实验室与一线研究人员，把专业用户、真实场景、深度数据与能力评测沉淀为持续运行的自主大模型网络安全生态，诚邀专业力量共建。',
    ecosystemHref: '/cybersecurity',
    ecosystemLabel: '网络安全生态 · 重点专项',
    id: 'cybersecurity',
    kind: 'working-group',
    leads: [
      {
        description:
          '提供组织平台与行业公信力，协调各方资源，审议建设方向与成果发布，承担平台与统筹角色。',
        name: '中关村自主大模型产业联盟',
        named: true,
        role: '统筹协调与生态承载',
      },
      {
        description:
          '作为技术牵引方，支持新模型专项测试、发布与能力迭代；生态对不同基础模型厂商对等开放。',
        name: '智谱',
        named: true,
        role: '模型与技术牵引',
      },
      {
        description:
          '指导技术方向与评测方法，推动技术规范、科研课题与人才培养，提升成果的专业性与中立性。',
        name: '清华大学',
        named: true,
        role: '学术指导',
      },
      {
        description:
          '承担产业研究与生态连接的日常执行：跟踪产业趋势与需求、对接安全企业与专业伙伴、运营网络安全人员开放计划，收集需求、沉淀优秀案例并推动成果专业传播。',
        name: '数说安全',
        named: true,
        role: '产业研究与生态连接',
      },
      {
        description: '承担技术平台与项目运营的日常执行：搭建并维护模型接入与测试平台，建设深度数据与结构化任务体系，推进 Benchmark／动态靶场测试与真实场景落地。',
        name: '云起无垠',
        named: true,
        role: '技术平台与项目运营',
      },
      {
        description:
          '安全企业、高校、实验室与专业研究人员按自身优势，通过数据、任务、专家、产品或场景参与共建。',
        name: '生态共建伙伴',
        named: false,
        role: '生态伙伴',
      },
    ],
    outcomes: [],
    responsibilities: [
      '运营“网络安全人员开放计划”与生态共建计划，作为专业用户入口，连接安全企业、实验室、高校与专业研究人员',
      '建设可训练、可评测、可验证的网络安全深度数据与任务体系（真实攻防、赛事、网络测绘、动态靶场）',
      '建立自主大模型面向网络安全行业的验证与应用机制（可信内测、专业验证与场景落地）',
      '在数据合规与高风险能力治理事项上，主动接受主管部门指导',
    ],
    researchDirections: [
      '代码审计与漏洞挖掘',
      '安全研发与渗透测试',
      '网络测绘与威胁情报',
    ],
    slug: 'cybersecurity',
    title: '网络安全工作组',
  },
] as const

export function getWorkingGroupSlugs(): string[] {
  return WORKING_GROUPS.map(({ slug }) => slug)
}

export function getWorkingGroupBySlug(slug: string): WorkingGroupSummary | undefined {
  return WORKING_GROUPS.find((group) => group.slug === slug)
}

// 英文初稿覆盖层（enDraft，待人工校对）：按 slug 覆写可翻译文本字段。
// 中文常量保持权威，路由 slug 与结构不变。
type WorkingGroupOverlay = Partial<
  Pick<
    WorkingGroupSummary,
    | 'title'
    | 'description'
    | 'ecosystemLabel'
    | 'leads'
    | 'outcomes'
    | 'responsibilities'
    | 'researchDirections'
  >
>

const WORKING_GROUPS_EN: Readonly<Record<string, WorkingGroupOverlay>> = {
  cybersecurity: {
    description:
      'Bringing together trusted defenders and real offense-defense needs, and uniting security enterprises, university labs and frontline researchers to turn professional users, real scenarios, in-depth data and capability evaluation into a continuously running self-reliant large-model cybersecurity ecosystem. Professional forces are cordially invited to co-build.',
    ecosystemLabel: 'Cybersecurity Ecosystem · Priority Initiative',
    leads: [
      {
        description:
          'Provides the organisational platform and industry credibility, coordinates resources across parties, reviews build directions and result releases, and takes on the platform and coordination role.',
        name: 'ZGC Self-Reliant Large Model Industry Alliance',
        named: true,
        role: 'Coordination and ecosystem hosting',
      },
      {
        description:
          'As technical lead, supports dedicated testing, release and capability iteration of new models; the ecosystem is equally open to different foundation-model vendors.',
        name: 'Zhipu',
        named: true,
        role: 'Model and technical lead',
      },
      {
        description:
          'Guides technical direction and evaluation methods, advances technical standards, research topics and talent development, and improves the professionalism and neutrality of results.',
        name: 'Tsinghua University',
        named: true,
        role: 'Academic guidance',
      },
      {
        description:
          'Handles day-to-day execution of industry research and ecosystem connection: tracking industry trends and needs, connecting security enterprises and professional partners, running the Cybersecurity Professionals Open Program, collecting needs, accumulating outstanding cases and promoting professional outreach of results.',
        name: 'Datainsecurity',
        named: true,
        role: 'Industry research and ecosystem connection',
      },
      {
        description:
          'Handles day-to-day execution of the technology platform and project operations: building and maintaining model-access and testing platforms, building the in-depth data and structured-task system, and advancing benchmark/dynamic-range testing and real-scenario deployment.',
        name: 'CloudInfinite',
        named: true,
        role: 'Technology platform and project operations',
      },
      {
        description:
          'Security enterprises, universities, labs and professional researchers contribute through data, tasks, experts, products or scenarios according to their strengths.',
        name: 'Ecosystem co-building partners',
        named: false,
        role: 'Ecosystem partners',
      },
    ],
    outcomes: [],
    researchDirections: [
      'Code auditing and vulnerability discovery',
      'Secure development and penetration testing',
      'Cyber mapping and threat intelligence',
    ],
    responsibilities: [
      'Operate the “Cybersecurity Professionals Open Program” and ecosystem co-building program as the entry for professional users, connecting security enterprises, labs, universities and professional researchers',
      'Build a system of in-depth cybersecurity data and tasks that is trainable, evaluable and verifiable (real offense-defense, competitions, cyber mapping, dynamic ranges)',
      'Establish validation and application mechanisms of self-reliant large models for the cybersecurity industry (trusted closed testing, professional validation and scenario deployment)',
      'Proactively accept guidance from authorities on data compliance and governance of high-risk capabilities',
    ],
    title: 'Cybersecurity Working Group',
  },
}

/** 按 locale 解析工作组：en 覆盖存在则替换文本字段，否则回退中文。 */
export function localizeWorkingGroup(
  group: WorkingGroupSummary,
  locale: Locale,
): WorkingGroupSummary {
  if (locale === 'zh') return group

  const overlay = WORKING_GROUPS_EN[group.slug]

  return overlay ? { ...group, ...overlay } : group
}
