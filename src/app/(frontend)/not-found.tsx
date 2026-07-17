import Link from 'next/link'
import type { ReactElement } from 'react'

export default function NotFound(): ReactElement {
  return (
    <main className="site-container" id="main-content">
      <div className="notfound">
        <p className="eyebrow">404</p>
        <h1>页面未找到</h1>
        <p>抱歉，你访问的页面不存在、已移动，或暂未公开。</p>
        <div style={{ marginTop: '34px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link className="btn btn--primary" href="/">
            返回首页
          </Link>
          <Link className="btn btn--ghost" href="/news">
            查看新闻动态
          </Link>
        </div>
      </div>
    </main>
  )
}
