'use client'

import Link from 'next/link'
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
  /** 父级落点（点击标题跳转，已 localizePath） */
  href: string
  /** 已本地化 + localizePath 的子项 */
  items: readonly NavGroupChild[]
  /** 桌面下拉 vs 移动内联折叠 */
  variant: 'desktop' | 'mobile'
  /** 展开按钮的无障碍标签（已本地化） */
  expandLabel: string
}

/**
 * 二级导航分组：标题为可跳转链接（点击进入 href），旁附一个 caret 展开按钮，
 * 展开「联盟成员 / 工作组成员」子项。桌面 hover/focus 展开为绝对定位下拉、
 * 移动内联折叠。键盘可达：Tab 到标题可跳转、Tab 到 caret 按钮可展开，
 * Escape 关闭并把焦点还给按钮，外部点击/路由变化关闭。
 * SSR 首帧收起（aria-expanded=false、面板 hidden），静态导出无水合告警。
 */
export function NavGroup({
  label,
  href,
  items,
  variant,
  expandLabel,
}: NavGroupProps): ReactElement {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // 分组只代表自身落点。子项与顶层导航存在重复目的地，不再让一个页面同时
  // 出现两个 aria-current；子项仍可访问，但由唯一的顶层/分组项表达当前页。
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`)

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
        toggleRef.current?.focus()
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
      <div className="nav-group__header">
        {isDesktop ? (
          // 桌面：标题即展开触发器，点击切换下拉（不跳转），hover 也展开。
          // 去掉「父级跳 /members 而首个子项也是 /members」的父子重复与 hover 不可靠问题。
          <button
            aria-controls={panelId}
            aria-current={isCurrent ? 'page' : undefined}
            aria-expanded={open}
            className="site-nav-link nav-group__link nav-group__trigger"
            onClick={() => setOpen((value) => !value)}
            ref={toggleRef}
            type="button"
          >
            {label}
            <span aria-hidden="true" className="nav-group__caret" />
          </button>
        ) : (
          <>
            <Link
              aria-current={isCurrent ? 'page' : undefined}
              className="site-nav-link nav-group__link"
              href={href}
            >
              {label}
            </Link>
            <button
              aria-controls={panelId}
              aria-expanded={open}
              aria-label={expandLabel}
              className="nav-group__toggle"
              onClick={() => setOpen((value) => !value)}
              ref={toggleRef}
              type="button"
            >
              <span aria-hidden="true" className="nav-group__caret" />
            </button>
          </>
        )}
      </div>
      <ul className="nav-group__panel" hidden={!open} id={panelId}>
        {items.map((item) => (
          <li key={item.href}>
            <SiteNavigationLink href={item.href} label={item.label} showCurrent={false} />
          </li>
        ))}
      </ul>
    </div>
  )
}
