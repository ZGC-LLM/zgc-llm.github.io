export const CANONICAL_ORIGIN = 'https://www.zgc-llm.org.cn'

export interface LocalizedRoute {
  readonly en: string
  readonly id: string
  readonly zh: string
}

export interface HtmlRoute {
  readonly counterpart: string
  readonly locale: 'en' | 'zh'
  readonly path: string
  readonly routeId: string
}

export const LOCALIZED_ROUTES: readonly LocalizedRoute[] = [
  { en: '/en', id: 'home', zh: '/' },
  { en: '/en/alliance', id: 'alliance', zh: '/alliance' },
  { en: '/en/working-groups', id: 'working-groups', zh: '/working-groups' },
  {
    en: '/en/working-groups/cybersecurity',
    id: 'working-group-detail',
    zh: '/working-groups/cybersecurity',
  },
  {
    en: '/en/working-groups/cybersecurity/members',
    id: 'working-group-members',
    zh: '/working-groups/cybersecurity/members',
  },
  {
    en: '/en/working-groups/cybersecurity/join',
    id: 'working-group-join',
    zh: '/working-groups/cybersecurity/join',
  },
  { en: '/en/cybersecurity', id: 'cybersecurity', zh: '/cybersecurity' },
  { en: '/en/members', id: 'members', zh: '/members' },
  { en: '/en/news', id: 'news', zh: '/news' },
  {
    en: '/en/news/cybersecurity-open-program',
    id: 'news-detail',
    zh: '/news/cybersecurity-open-program',
  },
  { en: '/en/join', id: 'join', zh: '/join' },
  { en: '/en/privacy', id: 'privacy', zh: '/privacy' },
] as const

export const HTML_ROUTES: readonly HtmlRoute[] = LOCALIZED_ROUTES.flatMap(({ en, id, zh }) => [
  { counterpart: en, locale: 'zh' as const, path: zh, routeId: id },
  { counterpart: zh, locale: 'en' as const, path: en, routeId: id },
])

export const RESOURCE_ROUTES = ['/robots.txt', '/sitemap.xml'] as const

export const PUBLIC_ROUTES = [...HTML_ROUTES.map(({ path }) => path), ...RESOURCE_ROUTES] as const

export function canonicalUrl(path: string): string {
  const directoryPath = path === '/' ? '/' : `${path.replace(/\/$/u, '')}/`

  return new URL(directoryPath, `${CANONICAL_ORIGIN}/`).toString()
}
