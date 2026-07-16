import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { SectionHeading } from '@/components/site/section-heading'
import { HOME_DIRECTIONS, HOME_VALUE_PROPOSITIONS } from '@/content/home'
import { MEMBERS } from '@/content/members'
import { getPublishedNews } from '@/content/news'
import { SITE_NAME } from '@/config/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  description: '汇聚自主大模型产业力量，连接技术、场景、人才与生态资源，面向机构伙伴开展生态共建。',
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
            <h1>汇聚自主大模型产业力量，连接开放协作生态</h1>
            <p className="hero__lead">
              连接基础模型厂商、科研机构、产业伙伴与专业用户，围绕真实场景推动联合创新、能力验证与产业落地。
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary" href="/join">
                申请生态共建
              </Link>
              <Link className="btn btn--ghost" href="/professionals">
                专业用户加入
              </Link>
            </div>
          </div>

          <div className="hero__cards">
            <div className="glass">
              <p className="glass__k">联盟定位</p>
              <p className="glass__v">面向自主大模型产业的开放协作与生态连接平台</p>
            </div>
            <div className="glass">
              <p className="glass__k">重点行动</p>
              <p className="glass__v">组织联合研究、场景共建、能力验证与成果交流</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionHeading
            description="以开放连接形成协作网络，以真实需求组织联合创新，以可验证实践推动成果落地。"
            eyebrow="联盟价值"
            title="让产业力量更好地协同"
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
            description="从技术协同到行业实践，持续连接可参与、可验证、可分享的产业议题。"
            eyebrow="重点方向"
            title="围绕产业共同需求展开协作"
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
          <div className="cta-band">
            <div>
              <p className="eyebrow">重点专项</p>
              <h2>网络安全生态</h2>
              <p>
                连接专业用户、真实场景、深度任务与能力验证，推动不同基础模型厂商、科研机构和产业伙伴共同参与网络安全生态建设。
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
            description="仅展示已经确认公开授权的成员信息，不使用示例名称或标识代替。"
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
              <p>联盟将在完成公开授权确认后发布成员信息。</p>
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
              <p>经联盟确认的新闻、活动与成果将在这里持续更新。</p>
            </div>
          )}
        </div>
      </section>

      <section className="container">
        <div className="end-cta">
          <div>
            <h2>共建自主大模型产业生态</h2>
            <p>了解联盟参与方式，选择适合机构或专业用户的参与路径。</p>
          </div>
          <Link className="btn btn--primary" href="/join">
            了解生态共建
          </Link>
        </div>
      </section>
    </main>
  )
}
