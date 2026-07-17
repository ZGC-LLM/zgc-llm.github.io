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
      { name: '中关村自主大模型产业联盟', named: true, role: '统筹协调与生态承载' },
      { name: '智谱', named: true, role: '模型与技术支持' },
      { name: '清华大学', named: true, role: '学术与技术指导' },
      { name: '数说安全', named: true, role: '产业研究与生态连接' },
      { name: '云起无垠', named: true, role: '技术平台与项目运营' },
      {
        name: '安全企业 / 高校 / 实验室 / 专业研究人员（按角色参与）',
        named: false,
        role: '生态伙伴',
      },
    ],
    outcomes: [
      '持续运营“网络安全人员开放计划”，面向网络安全企业、科研机构、高校团队与专业研究人员开放受控访问，汇聚可信防御者与真实需求',
    ],
    responsibilities: [
      '运营“网络安全人员开放计划”，作为生态的专业用户入口',
      '发起网络安全生态共建计划，连接安全企业、实验室、高校与专业研究人员',
      '建设可训练、可评测、可验证的网络安全深度数据与任务体系（真实攻防、赛事、网络测绘、动态靶场）',
      '建立自主大模型面向网络安全行业的验证与应用机制（可信内测、专业验证与场景落地）',
      '在数据合规与高风险能力治理事项上，主动接受主管部门指导',
    ],
    researchDirections: [
      '安全大模型与网络安全智能体',
      '深度数据与任务体系',
      '能力评测与动态靶场',
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
