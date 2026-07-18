import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'
import { dict, type Dictionary } from '@/i18n/dictionary'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'
import type { NavigationItem } from '@/types/content'

const NAV_LABEL_KEYS: Readonly<Record<string, keyof Dictionary['nav']>> = {
  '/alliance': 'alliance',
  '/cybersecurity': 'cybersecurity',
  '/members': 'members',
  '/news': 'news',
  '/working-groups': 'workingGroups',
}

export function SiteFooter({ locale }: { locale: Locale }): ReactElement {
  const t = dict(locale)
  const nav = t.nav
  const f = t.footer

  return (
    <footer className="footer">
      <div className="site-container">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="text-lg font-semibold text-white">{SITE_NAME}</p>
            <p>{f.tagline}</p>
            <p>
              {f.contactLabel}
              <a href="mailto:contact@zgc-llm.org.cn">contact@zgc-llm.org.cn</a>
            </p>
          </div>
          <div>
            <h4>{f.sectionUnderstand}</h4>
            {SITE_NAVIGATION.slice(0, 3)
              .filter((item): item is NavigationItem & { href: string } => Boolean(item.href))
              .map((item, index) => {
                const labelKey = NAV_LABEL_KEYS[item.href]

                return (
                  <Link href={localizePath(item.href, locale)} key={item.href}>
                    {labelKey ? nav[labelKey] : item.label}
                    {index < 2 ? <br /> : null}
                  </Link>
                )
              })}
          </div>
          <div>
            <h4>{f.sectionParticipate}</h4>
            <Link href={localizePath('/join', locale)}>
              {f.linkEcosystem}
              <br />
            </Link>
            <Link href={localizePath('/members', locale)}>{f.linkMembers}</Link>
          </div>
          <div>
            <h4>{f.sectionMore}</h4>
            <Link href={localizePath('/news', locale)}>
              {f.linkNews}
              <br />
            </Link>
            <Link href={localizePath('/privacy', locale)}>{f.linkPrivacy}</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
              京ICP备2025000000号-1
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
