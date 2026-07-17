import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { SectionHeading } from '@/components/site/section-heading'
import { HOME_ACTION_SLOGANS, HOME_DIRECTIONS, HOME_VALUE_PROPOSITIONS } from '@/content/home'
import { MEMBERS } from '@/content/members'
import { getPublishedNews } from '@/content/news'
import { SITE_NAME } from '@/config/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  description: '汇聚自主大模型力量，共建开放、安全、协同的产业生态，推动技术创新、产业协同、场景落地与国际合作。',
  title: { absolute: `首页｜${SITE_NAME}` },
}

export default function HomePage(): ReactElement {
  const publishedNews = getPublishedNews()

  return (
    <main id="main-content">
      <section className="hero page-hero">
        <div className="container hero__inner">
          <div>
            <p className="eyebrow">{SITE_NAME}</p>
            <h1>汇聚自主大模型力量，共建开放、安全、协同的产业生态</h1>
            <p className="hero__lead">
              联盟汇聚高校、科研机构与产业伙伴，围绕自主大模型推动技术创新、产业协同、场景落地与国际合作，持续强化安全大模型、可信智能体与人工智能安全治理能力。
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary" href="/join">
                机构合作申请
              </Link>
            </div>
          </div>

          <div className="hero__cards">
            <div className="glass">
              <p className="glass__k">联盟定位</p>
              <p className="glass__v">连接模型、芯片、算力、数据、平台及行业应用的自主大模型产业生态平台</p>
            </div>
            <div className="glass">
              <p className="glass__k">核心议题</p>
              <p className="glass__v">技术创新、产业协同、场景落地与安全可信能力建设</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            description="以自主创新、开放协作、安全可信、产业共建为原则，连接产业各方力量。"
            eyebrow="联盟价值"
            title="开放、安全、协同的产业生态"
          />
          <div className="grid-3">
            {HOME_VALUE_PROPOSITIONS.map((item, index) => (
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
            description="围绕自主大模型的核心技术、产业协同、场景数据、评测、安全与国际化持续推进。"
            eyebrow="重点方向"
            title="六项重点工作"
          />
          <div className="dir-list">
            {HOME_DIRECTIONS.map((direction, index) => (
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
            description="以清晰路径推动联盟从能力建设走向产业价值。"
            eyebrow="行动口号"
            title="从能力到生态的持续跃迁"
          />
          <div className="grid-4">
            {HOME_ACTION_SLOGANS.map((slogan) => (
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
              <p className="eyebrow">安全工作组</p>
              <h2>网络安全生态</h2>
              <p>
                联盟下设网络安全工作组，聚焦安全大模型与网络安全智能体，连接专业用户、真实场景、深度任务与能力验证，持续推进重点项目落地。
              </p>
            </div>
            <Link className="btn btn--primary" href="/cybersecurity">
              了解网络安全生态
            </Link>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="container">
          <SectionHeading
            action={
              <Link className="text-link" href="/members">
                查看成员伙伴
              </Link>
            }
            description="联盟成员信息均经公开授权后发布，携手各方共建开放、协同的产业生态。"
            eyebrow="生态伙伴"
            title="连接多元产业力量"
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
              <h3>成员信息整理中</h3>
              <p>成员信息将在完成公开授权后陆续发布，敬请关注。</p>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            action={
              <Link className="text-link" href="/news">
                查看新闻动态
              </Link>
            }
            description="发布联盟动态、活动通知、行业观察与经确认的阶段成果。"
            eyebrow="最新动态"
            title="关注联盟进展"
          />
          {publishedNews.length > 0 ? (
            <div className="grid-3 news">
              {publishedNews.slice(0, 3).map((entry) => (
                <article className="card" key={entry.slug}>
                  <div className="news__meta">
                    <span className="news__date">{entry.date}</span>
                  </div>
                  <h3>
                    <Link href={`/news/${entry.slug}`}>{entry.title}</Link>
                  </h3>
                  <p>{entry.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>最新动态即将发布</h3>
              <p>经联盟确认的新闻、活动与成果将陆续在此更新，敬请关注。</p>
            </div>
          )}
        </div>
      </section>

      <section className="container">
        <div className="end-cta">
          <div>
            <h2>共建自主大模型产业生态</h2>
            <p>了解联盟参与方式，携手机构伙伴共建产业生态。</p>
          </div>
          <Link className="btn btn--primary" href="/join">
            了解生态共建
          </Link>
        </div>
      </section>
    </main>
  )
}
