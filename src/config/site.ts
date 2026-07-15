export const SITE_NAME = '中关村自主大模型产业联盟'
export const SITE_DESCRIPTION =
  '中关村自主大模型产业联盟官方网站，发布联盟动态、工作组信息、成员名录及入盟申请服务。'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.zgcllm.org.cn'

export interface CoreModule {
  description: string
  path: string
  slug: string
  title: string
}

export const CORE_MODULES: readonly CoreModule[] = [
  {
    description: '展示联盟宗旨、发展历程、组织架构与重点方向。',
    path: '/alliance',
    slug: 'alliance',
    title: '联盟介绍',
  },
  {
    description: '提供结构化入盟申请、材料上传和进度管理。',
    path: '/alliance/join',
    slug: 'alliance-application',
    title: '加入联盟',
  },
  {
    description: '介绍工作组职责、研究方向、负责人及工作成果。',
    path: '/working-groups/[slug]',
    slug: 'working-group',
    title: '工作组介绍',
  },
  {
    description: '按照成员类型展示单位信息、品牌标识与简介。',
    path: '/working-groups/[slug]/members',
    slug: 'working-group-members',
    title: '工作组成员',
  },
  {
    description: '接收加入工作组的申请并支持后台审核流转。',
    path: '/working-groups/[slug]/join',
    slug: 'working-group-application',
    title: '加入工作组',
  },
  {
    description: '发布联盟新闻、活动通知、行业观察与成果动态。',
    path: '/news',
    slug: 'news',
    title: '新闻板块',
  },
] as const
