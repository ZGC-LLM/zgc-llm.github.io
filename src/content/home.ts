import type { ValueProposition } from '@/types/content'

export const HOME_VALUE_PROPOSITIONS: readonly ValueProposition[] = [
  {
    description: '坚持核心基座模型开源共享，连接模型、芯片、算力、数据、平台及行业应用力量，构建开放协作网络。',
    id: 'open',
    title: '开放协作',
  },
  {
    description:
      '围绕安全大模型、网络安全智能体、能力评测与治理，推动黑盒系统向透明可解释系统演进，构建自主可控、可信可靠的安全能力体系。',
    id: 'trustworthy',
    title: '安全可信',
  },
  {
    description: '保持长期主义，集中资源攻坚长程任务与自治智能体系统，推动自主大模型持续迈向能力新高峰。',
    id: 'longterm',
    title: '长期主义',
  },
] as const

export const HOME_DIRECTIONS = [
  '自主大模型核心技术创新',
  '产业链上下游协同发展',
  '行业场景与高质量数据共建',
  '模型与智能体联合评测',
  '安全大模型与可信智能体建设',
  '人工智能企业国际化发展',
] as const

export const HOME_ACTION_SLOGANS = [
  '从示范智能体走向生产级自治系统',
  '从短期速赢走向长期技术攀登',
  '从封闭黑盒走向透明可信',
  '从单点能力突破走向长程任务落地',
] as const
