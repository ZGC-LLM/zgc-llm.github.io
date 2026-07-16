'use client'

import { useState, type ReactElement } from 'react'

export function LanguageToggle(): ReactElement {
  const [showHint, setShowHint] = useState(false)

  function handleClick(): void {
    setShowHint(true)
    window.setTimeout(() => setShowHint(false), 1500)
  }

  return (
    <button
      aria-label="切换语言 / Switch language"
      className="toggle toggle--seg"
      onClick={handleClick}
      title={showHint ? '即将支持' : undefined}
      type="button"
    >
      <span className="on">中</span>
      <span>EN</span>
    </button>
  )
}
