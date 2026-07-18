'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type ReactElement } from 'react'

import { SiteNavigationLink } from './site-navigation-link'

interface NavGroupChild {
  href: string
  label: string
}

interface NavGroupProps {
  /** 已本地化的分组标题 */
  label: string
  /** 已本地化 + localizePath 的子项 */
  items: readonly NavGroupChild[]
  /** 桌面下拉 vs 移动内联折叠 */
  variant: 'desktop' | 'mobile'
}

/**
 * 二级导航分组（disclosure）。桌面为绝对定位下拉、hover/focus 展开；
 * 移动为内联折叠。键盘可达：点击/Enter/Space 切换，Escape 关闭并把焦点还给触发器。
 * SSR 首帧默认收起（aria-expanded=false、面板 hidden），静态导出下无水合告警。
 */
export function NavGroup({ label, items, variant }: NavGroupProps): ReactElement {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // 任一子项路由命中 → 触发器呈激活态（与 SiteNavigationLink 同源判定）。
  const isCurrent = items.some(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  )

  // 路由变化时收起（render 阶段调整状态，React 官方推荐模式，避免 effect 内同步 setState）。
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // 展开时：外部指针按下关闭；Escape 关闭并归还焦点。
  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event: PointerEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const isDesktop = variant === 'desktop'

  return (
    <div
      className={`nav-group nav-group--${variant}`}
      onBlur={
        isDesktop
          ? (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setOpen(false)
              }
            }
          : undefined
      }
      onMouseEnter={isDesktop ? () => setOpen(true) : undefined}
      onMouseLeave={isDesktop ? () => setOpen(false) : undefined}
      ref={containerRef}
    >
      <button
        aria-controls={panelId}
        aria-current={isCurrent ? 'page' : undefined}
        aria-expanded={open}
        className="site-nav-link nav-group__trigger"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        {label}
      </button>
      <ul className="nav-group__panel" hidden={!open} id={panelId}>
        {items.map((item) => (
          <li key={item.href}>
            <SiteNavigationLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </div>
  )
}
