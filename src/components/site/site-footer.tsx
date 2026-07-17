import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'

export function SiteFooter(): ReactElement {
  return (
    <footer className="footer">
      <div className="site-container">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="text-lg font-semibold text-white">{SITE_NAME}</p>
            <p>汇聚自主大模型产业创新力量，连接技术、场景、人才与生态资源。</p>
            <p>联系信息将在正式发布前补充</p>
          </div>
          <div>
            <h4>了解联盟</h4>
            {SITE_NAVIGATION.slice(0, 3).map((item, index) => (
              <Link href={item.href} key={item.href}>
                {item.label}
                {index < 2 ? <br /> : null}
              </Link>
            ))}
          </div>
          <div>
            <h4>参与联盟</h4>
            <Link href="/join">
              生态共建
              <br />
            </Link>
            <Link href="/professionals">
              专业用户
              <br />
            </Link>
            <Link href="/members">成员伙伴</Link>
          </div>
          <div>
            <h4>更多</h4>
            <Link href="/news">
              新闻动态
              <br />
            </Link>
            <Link href="/privacy">隐私说明</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p>备案信息将在正式发布前补充</p>
        </div>
      </div>
    </footer>
  )
}
