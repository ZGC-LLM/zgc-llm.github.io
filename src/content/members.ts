import type { MemberSummary } from '@/types/content'

// 来源：中关村自主大模型产业联盟第一次会员大会公示（zhipuai.cn/zh/news/97）。
// 联盟共 32 家单位会员，此处仅收录已公开具名的理事会与监事会成员单位；
// 其余会员单位在获得公开授权后再补充，未授权前不以名单填充页面。
// type 按机构性质映射（高校/科研院所→research，企业→institution）；成员页按 type 分组渲染，
// 组内按本数组顺序排列。首页只取本数组前 4 位做预览，故理事长/秘书长/监事长单位置于数组最前。
// 仅对理事长/秘书长/监事长单位标注职务，普通成员不加下缀；品牌标识须获授权后再加。
export const MEMBERS: readonly MemberSummary[] = [
  // 理事长单位（科研）——数组首位，兼作首页预览首张
  {
    description: '理事长单位',
    id: 'tsinghua',
    name: '清华大学',
    type: 'research',
  },
  // 机构成员（企业）：秘书长、监事长单位置顶，其余按公示顺序
  {
    description: '秘书长单位',
    id: 'zhipu',
    name: '北京智谱华章科技股份有限公司',
    type: 'institution',
  },
  {
    description: '监事长单位',
    id: 'paratera',
    name: '北京并行科技股份有限公司',
    type: 'institution',
  },
  {
    id: 'didi',
    name: '北京嘀嘀无限科技发展有限公司',
    type: 'institution',
  },
  {
    id: 'jingneng-digital',
    name: '京能数字产业有限公司',
    type: 'institution',
  },
  {
    id: 'moore-threads',
    name: '摩尔线程智能科技（北京）股份有限公司',
    type: 'institution',
  },
  {
    id: 'shengshu',
    name: '北京生数科技有限公司',
    type: 'institution',
  },
  {
    id: 'caizhi',
    name: '北京彩智科技有限公司',
    type: 'institution',
  },
  // 科研伙伴（其余高校 / 科研院所）
  {
    id: 'baai',
    name: '北京智源人工智能研究院',
    type: 'research',
  },
  {
    id: 'ict-cas',
    name: '中国科学院计算技术研究所',
    type: 'research',
  },
] as const
