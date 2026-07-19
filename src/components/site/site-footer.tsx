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
          <nav aria-label={f.sectionUnderstand}>
            <h2 className="footer__heading">{f.sectionUnderstand}</h2>
            <ul className="footer__links">
              {SITE_NAVIGATION.slice(0, 3)
                .filter((item): item is NavigationItem & { href: string } => Boolean(item.href))
                .map((item) => {
                  const labelKey = NAV_LABEL_KEYS[item.href]

                  return (
                    <li key={item.href}>
                      <Link href={localizePath(item.href, locale)}>
                        {labelKey ? nav[labelKey] : item.label}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </nav>
          <nav aria-label={f.sectionParticipate}>
            <h2 className="footer__heading">{f.sectionParticipate}</h2>
            <ul className="footer__links">
              <li>
                <Link href={localizePath('/join', locale)}>{f.linkEcosystem}</Link>
              </li>
              <li>
                <Link href={localizePath('/members', locale)}>{f.linkMembers}</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label={f.sectionMore}>
            <h2 className="footer__heading">{f.sectionMore}</h2>
            <ul className="footer__links">
              <li>
                <Link href={localizePath('/news', locale)}>{f.linkNews}</Link>
              </li>
              <li>
                <Link href={localizePath('/privacy', locale)}>{f.linkPrivacy}</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
