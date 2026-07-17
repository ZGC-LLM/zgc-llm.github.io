'use client'

import { useSyncExternalStore, type ReactElement } from 'react'

import { THEME_STORAGE_KEY } from '@/config/site'

type Theme = 'dark' | 'light'

const themeListeners = new Set<() => void>()

function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener)

  return () => {
    themeListeners.delete(listener)
  }
}

function emitThemeChange(): void {
  themeListeners.forEach((listener) => {
    listener()
  })
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle(): ReactElement {
  // useSyncExternalStore 在 SSR/首帧用 getServerSnapshot('light')，mount 后自动
  // 用客户端快照（内联脚本已设定的实际 data-theme）校正图标，避免 hydration mismatch，
  // 同时规避 set-state-in-effect 反模式。
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => 'light')

  function handleToggle(): void {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // 隐私模式下 localStorage 可能抛错，忽略即可（不影响本次切换）。
    }

    emitThemeChange()
  }

  return (
    <button
      aria-label="切换深浅色主题 / Toggle theme"
      className="toggle"
      onClick={handleToggle}
      type="button"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☀︎'}</span>
    </button>
  )
}
