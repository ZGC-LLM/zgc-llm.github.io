import Link from 'next/link'
import type { ReactElement } from 'react'

import { SectionHeading } from '@/components/site/section-heading'
import { SITE_NAME } from '@/config/site'
import { getHomeActionSlogans, getHomeDirections, getHomeValuePropositions } from '@/content/home'
import { MEMBERS } from '@/content/members'
import { getPublishedNews } from '@/content/news'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

// 页面级双语文案。成员单位名与新闻标题/摘要属尚未迁移的内容模块，英文页暂回退中文。
interface HomeStrings {
  heroTitle: string
  heroLead: string
  heroCta: string
  glass1Key: string
  glass1Value: string
  glass1Tags: string[]
  glass2Key: string
  glass2Value: string
  glass2Tags: string[]
  valueEyebrow: string
  valueTitle: string
  valueDescription: string
  directionsEyebrow: string
  directionsTitle: string
  directionsDescription: string
  actionEyebrow: string
  actionTitle: string
  actionDescription: string
  cyberEyebrow: string
  cyberTitle: string
  cyberBody: string
  cyberAction: string
  membersEyebrow: string
  membersTitle: string
  membersDescription: string
  membersAction: string
  membersEmptyTitle: string
  membersEmptyBody: string
  newsEyebrow: string
  newsTitle: string
  newsDescription: string
  newsAction: string
  newsEmptyTitle: string
  newsEmptyBody: string
  endTitle: string
  endBody: string
  endAction: string
}

const STRINGS: Record<Locale, HomeStrings> = {
  en: {
    actionDescription:
      'Along a clear path, moving the Alliance from capability building toward industrial value.',
    actionEyebrow: 'Action Path',
    actionTitle: 'A sustained leap from capability to ecosystem',
    cyberAction: 'Explore the cybersecurity ecosystem',
    cyberBody:
      'The Alliance hosts a Cybersecurity Working Group focused on security-oriented large models and cybersecurity agents, connecting professional users, real scenarios, in-depth tasks and capability validation to keep advancing priority projects.',
    cyberEyebrow: 'Security Working Group',
    cyberTitle: 'Cybersecurity Ecosystem',
    directionsDescription:
      "Advancing continuously around self-reliant large models' core technology, industrial collaboration, scenario data, evaluation, security and internationalisation.",
    directionsEyebrow: 'Focus Areas',
    directionsTitle: 'Six priority workstreams',
    endAction: 'Apply to become an ecosystem partner',
    endBody:
      'We invite institutional partners to join the Alliance and build an open, secure and collaborative industry ecosystem together.',
    endTitle: 'Build the self-reliant large-model industry ecosystem',
    glass1Key: 'Positioning',
    glass1Value:
      'A self-reliant large-model industry ecosystem platform connecting models, chips, computing power, data, platforms and industry applications',
    glass1Tags: ['Models', 'Chips', 'Compute', 'Data', 'Platforms', 'Applications'],
    glass2Key: 'Core Topics',
    glass2Value:
      'Technology innovation, industrial collaboration, real-world deployment and building secure, trustworthy capabilities',
    glass2Tags: ['Tech Innovation', 'Collaboration', 'Deployment', 'Security & Trust'],
    heroCta: 'Partner with Us',
    heroLead:
      'The Alliance brings together universities, research institutions and industry partners to advance technology innovation, industrial collaboration, real-world deployment and international cooperation around self-reliant large models, while continually strengthening security-oriented large models, trustworthy agents and AI security governance.',
    heroTitle:
      'Uniting self-reliant large-model strength to build an open, secure and collaborative industry ecosystem',
    membersAction: 'View members',
    membersDescription:
      'The Alliance works with all parties to build an open and collaborative industry ecosystem.',
    membersEmptyBody:
      'Member information will be released gradually after public authorization. Please stay tuned.',
    membersEmptyTitle: 'Member information is being prepared',
    membersEyebrow: 'Ecosystem Partners',
    membersTitle: 'Connecting diverse industry strengths',
    newsAction: 'View news',
    newsDescription:
      'Publishing Alliance updates, event notices, industry observations and confirmed stage results.',
    newsEmptyBody:
      'News, events and results confirmed by the Alliance will be updated here. Please stay tuned.',
    newsEmptyTitle: 'Latest updates coming soon',
    newsEyebrow: 'Latest',
    newsTitle: 'Follow the Alliance',
    valueDescription:
      'Connecting all industry parties on the pillars of open sharing, security and trust, and collaborative effort.',
    valueEyebrow: 'Alliance Values',
    valueTitle: 'An open, secure and collaborative industry ecosystem',
  },
  zh: {
    actionDescription: '沿清晰路径，推动联盟从能力建设走向产业价值。',
    actionEyebrow: '行动路径',
    actionTitle: '从能力到生态的持续跃迁',
    cyberAction: '了解网络安全生态',
    cyberBody:
      '联盟下设网络安全工作组，聚焦安全大模型与网络安全智能体，连接专业用户、真实场景、深度任务与能力验证，持续推进重点项目落地。',
    cyberEyebrow: '安全工作组',
    cyberTitle: '网络安全生态',
    directionsDescription: '围绕自主大模型的核心技术、产业协同、场景数据、评测、安全与国际化持续推进。',
    directionsEyebrow: '重点方向',
    directionsTitle: '六项重点工作',
    endAction: '申请成为生态伙伴',
    endBody: '诚邀机构伙伴加入联盟，携手共建开放、安全、协同的产业生态。',
    endTitle: '共建自主大模型产业生态',
    glass1Key: '联盟定位',
    glass1Value: '连接模型、芯片、算力、数据、平台及行业应用的自主大模型产业生态平台',
    glass1Tags: ['模型', '芯片', '算力', '数据', '平台', '行业应用'],
    glass2Key: '核心议题',
    glass2Value: '技术创新、产业协同、场景落地与安全可信能力建设',
    glass2Tags: ['技术创新', '产业协同', '场景落地', '安全可信'],
    heroCta: '机构合作申请',
    heroLead:
      '联盟汇聚高校、科研机构与产业伙伴，围绕自主大模型推动技术创新、产业协同、场景落地与国际合作，持续强化安全大模型、可信智能体与人工智能安全治理能力。',
    heroTitle: '汇聚自主大模型力量，共建开放、安全、协同的产业生态',
    membersAction: '查看成员伙伴',
    membersDescription: '联盟携手各方共建开放、协同的产业生态。',
    membersEmptyBody: '成员信息将在完成公开授权后陆续发布，敬请关注。',
    membersEmptyTitle: '成员信息整理中',
    membersEyebrow: '生态伙伴',
    membersTitle: '连接多元产业力量',
    newsAction: '查看新闻动态',
    newsDescription: '发布联盟动态、活动通知、行业观察与经确认的阶段成果。',
    newsEmptyBody: '经联盟确认的新闻、活动与成果将陆续在此更新，敬请关注。',
    newsEmptyTitle: '最新动态即将发布',
    newsEyebrow: '最新动态',
    newsTitle: '关注联盟进展',
    valueDescription: '以开放共享、安全可信、协同攻坚为支柱，连接产业各方力量。',
    valueEyebrow: '联盟价值',
    valueTitle: '开放、安全、协同的产业生态',
  },
}

export function HomeView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]
  const publishedNews = getPublishedNews()

  return (
    <main id="main-content">
      <section className="hero page-hero">
        <div className="container hero__inner">
          <div>
            <p className="eyebrow">{SITE_NAME}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero__lead">{t.heroLead}</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" href={localizePath('/join', locale)}>
                {t.heroCta}
              </Link>
            </div>
          </div>

          <div className="hero__cards">
            <div className="glass">
              <p className="glass__k">{t.glass1Key}</p>
              <p className="glass__v">{t.glass1Value}</p>
              <ul className="glass__tags">
                {t.glass1Tags.map((tag) => (
                  <li className="glass__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass">
              <p className="glass__k">{t.glass2Key}</p>
              <p className="glass__v">{t.glass2Value}</p>
              <ul className="glass__tags">
                {t.glass2Tags.map((tag) => (
                  <li className="glass__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            description={t.valueDescription}
            eyebrow={t.valueEyebrow}
            title={t.valueTitle}
          />
          <div className="grid-3">
            {getHomeValuePropositions(locale).map((item, index) => (
              <article className="card" key={item.id}>
                <p className="card__num">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="container split">
          <SectionHeading
            description={t.directionsDescription}
            eyebrow={t.directionsEyebrow}
            title={t.directionsTitle}
          />
          <div className="dir-list">
            {getHomeDirections(locale).map((direction, index) => (
              <div className="dir-item" key={direction}>
                <span className="n">{index + 1}</span>
                <b>{direction}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            description={t.actionDescription}
            eyebrow={t.actionEyebrow}
            title={t.actionTitle}
          />
          <div className="grid-4">
            {getHomeActionSlogans(locale).map((slogan) => (
              <article className="card" key={slogan}>
                <b>{slogan}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="cta-band">
            <div>
              <p className="eyebrow">{t.cyberEyebrow}</p>
              <h2>{t.cyberTitle}</h2>
              <p>{t.cyberBody}</p>
            </div>
            <Link className="btn btn--primary" href={localizePath('/cybersecurity', locale)}>
              {t.cyberAction}
            </Link>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="container">
          <SectionHeading
            action={
              <Link className="text-link" href={localizePath('/members', locale)}>
                {t.membersAction}
              </Link>
            }
            description={t.membersDescription}
            eyebrow={t.membersEyebrow}
            title={t.membersTitle}
          />
          {MEMBERS.length > 0 ? (
            <div className="grid-4">
              {MEMBERS.slice(0, 4).map((member) => (
                <article className="card" key={member.id}>
                  <h3>{member.name}</h3>
                  {member.description ? <p>{member.description}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>{t.membersEmptyTitle}</h3>
              <p>{t.membersEmptyBody}</p>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            action={
              <Link className="text-link" href={localizePath('/news', locale)}>
                {t.newsAction}
              </Link>
            }
            description={t.newsDescription}
            eyebrow={t.newsEyebrow}
            title={t.newsTitle}
          />
          {publishedNews.length > 0 ? (
            <div className="grid-3 news">
              {publishedNews.slice(0, 3).map((entry) => (
                <article className="card" key={entry.slug}>
                  <div className="news__meta">
                    <span className="news__date">{entry.date}</span>
                  </div>
                  <h3>
                    <Link href={localizePath(`/news/${entry.slug}`, locale)}>{entry.title}</Link>
                  </h3>
                  <p>{entry.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>{t.newsEmptyTitle}</h3>
              <p>{t.newsEmptyBody}</p>
            </div>
          )}
        </div>
      </section>

      <section className="container">
        <div className="end-cta">
          <div>
            <h2>{t.endTitle}</h2>
            <p>{t.endBody}</p>
          </div>
          <Link className="btn btn--primary" href={localizePath('/join', locale)}>
            {t.endAction}
          </Link>
        </div>
      </section>
    </main>
  )
}
