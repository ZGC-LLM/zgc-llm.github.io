import { ImageResponse } from 'next/og'

const ICON_SIZE = { height: 64, width: 64 }

export const dynamic = 'force-static'

// Provisional neutral text identity; this is not an official or inferred Alliance logo.
export function GET(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#0a2239',
        color: '#ffffff',
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fontWeight: 700,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: '-1px',
        width: '100%',
      }}
    >
      ZG
    </div>,
    ICON_SIZE,
  )
}
