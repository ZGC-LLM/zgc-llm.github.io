import { ImageResponse } from 'next/og'

const SOCIAL_PREVIEW_SIZE = { height: 630, width: 1200 }

export const dynamic = 'force-static'

// Provisional neutral text identity; this is not an official or inferred Alliance logo.
export function GET(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'flex-start',
        background: '#0a2239',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        height: '100%',
        justifyContent: 'center',
        padding: '88px 96px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: '-3px',
          lineHeight: 1,
        }}
      >
        ZGCLLM
      </div>
      <div
        style={{
          color: '#b8d8ee',
          display: 'flex',
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: '1px',
          lineHeight: 1.4,
          marginTop: 36,
        }}
      >
        www.zgc-llm.org.cn
      </div>
    </div>,
    SOCIAL_PREVIEW_SIZE,
  )
}
