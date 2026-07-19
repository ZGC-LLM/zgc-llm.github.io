import { type Locale, LOCALES } from './locales'

/**
 * UI chrome 字典（页头/页脚/导航/语言切换等**框架文案**，非页面正文内容）。
 * 中文为权威；英文为本轮初稿（chrome 文案简单，直接给定稿级译文）。
 * 页面正文内容不走字典，走 `src/content/*` 的 `getXxx(locale)` 访问器。
 */
export interface Dictionary {
  skipToContent: string
  nav: {
    alliance: string
    workingGroups: string
    cybersecurity: string
    members: string
    allianceMembers: string
    workingGroupMembers: string
    news: string
  }
  header: {
    mainNav: string
    mobileNav: string
    openNav: string
    menu: string
    institutionApply: string
    joinWorkingGroup: string
    expandSubmenu: string
  }
  languageToggle: {
    label: string
    zh: string
    en: string
  }
  footer: {
    tagline: string
    sectionUnderstand: string
    sectionParticipate: string
    sectionMore: string
    linkEcosystem: string
    linkMembers: string
    linkNews: string
    linkPrivacy: string
  }
}

const zh: Dictionary = {
  footer: {
    linkEcosystem: '生态共建',
    linkMembers: '成员伙伴',
    linkNews: '新闻动态',
    linkPrivacy: '隐私说明',
    sectionMore: '更多',
    sectionParticipate: '参与协作',
    sectionUnderstand: '了解联盟',
    tagline: '汇聚自主大模型产业创新力量，连接技术、场景、人才与生态资源。',
  },
  header: {
    institutionApply: '参与联盟协作',
    joinWorkingGroup: '参与工作组',
    mainNav: '主导航',
    menu: '菜单',
    mobileNav: '移动导航',
    openNav: '打开网站导航',
    expandSubmenu: '展开子菜单',
  },
  languageToggle: {
    en: 'EN',
    label: '切换语言 / Switch language',
    zh: '中文',
  },
  nav: {
    alliance: '联盟介绍',
    cybersecurity: '网络安全生态',
    members: '成员伙伴',
    allianceMembers: '联盟成员',
    workingGroupMembers: '工作组成员',
    news: '新闻动态',
    workingGroups: '工作组',
  },
  skipToContent: '跳到主要内容',
}

const en: Dictionary = {
  footer: {
    linkEcosystem: 'Ecosystem',
    linkMembers: 'Members',
    linkNews: 'News',
    linkPrivacy: 'Privacy',
    sectionMore: 'More',
    sectionParticipate: 'Participate',
    sectionUnderstand: 'About the Alliance',
    tagline:
      'Connecting organizations, technology, real-world needs and expertise through open industry collaboration.',
  },
  header: {
    institutionApply: 'Work with the Alliance',
    joinWorkingGroup: 'Contribute to a working group',
    mainNav: 'Main navigation',
    menu: 'Menu',
    mobileNav: 'Mobile navigation',
    openNav: 'Open site navigation',
    expandSubmenu: 'Expand submenu',
  },
  languageToggle: {
    en: 'EN',
    label: '切换语言 / Switch language',
    zh: '中文',
  },
  nav: {
    alliance: 'About',
    cybersecurity: 'Cybersecurity',
    members: 'Members',
    allianceMembers: 'Alliance Members',
    workingGroupMembers: 'Working Group Members',
    news: 'News',
    workingGroups: 'Working Groups',
  },
  skipToContent: 'Skip to main content',
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, zh }

export function dict(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

/** 供测试/校验枚举全部字典。 */
export function allDictionaries(): ReadonlyArray<{ locale: Locale; dictionary: Dictionary }> {
  return LOCALES.map((locale) => ({ dictionary: DICTIONARIES[locale], locale }))
}
