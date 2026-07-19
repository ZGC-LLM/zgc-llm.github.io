import { ImageResponse } from 'next/og'

const APPLE_ICON_SIZE = { height: 180, width: 180 }

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
        fontSize: 64,
        fontWeight: 700,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: '-2px',
        width: '100%',
      }}
    >
      ZG
    </div>,
    APPLE_ICON_SIZE,
  )
}
