import type { ReactElement } from 'react'

/**
 * 首帧无闪烁主题脚本：在 <body> 绘制前同步设定 html[data-theme]。
 * 主题跟随系统 prefers-color-scheme（已移除深浅切换 UI）。
 * 顺带清理历史遗留的 localStorage['zgcllm-theme']，
 * 避免老访客被此前的手动选择永久锁定、无法回到跟随系统。
 * try/catch 兜底隐私模式 localStorage 抛错。
 * 放在两个根布局的 <head>，中英一致。
 */
export function ThemeScript(): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{localStorage.removeItem('zgcllm-theme')}catch(e){}document.documentElement.dataset.theme=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'})();`,
      }}
    />
  )
}
