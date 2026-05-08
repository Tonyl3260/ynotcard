import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ynotcard - TCG Portfolio Analytics'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BARS = [42, 58, 47, 72, 55, 84, 68, 78, 62, 88, 74, 95]

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080E1A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow - top right */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Ambient glow - bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            width: 72,
            height: 4,
            background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#F1F5F9',
              letterSpacing: '-4px',
              lineHeight: 1,
            }}
          >
            ynotcard
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#64748B',
              fontWeight: 400,
              letterSpacing: '0.3px',
            }}
          >
            TCG Portfolio Analytics Dashboard
          </div>
        </div>

        {/* Mini bar chart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 7,
            height: 110,
            marginTop: 40,
          }}
        >
          {BARS.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: `rgba(59,130,246,${0.18 + (h / 100) * 0.62})`,
                borderRadius: '4px 4px 0 0',
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 28,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ fontSize: 22, color: '#3B82F6', fontWeight: 600 }}>
            ynotcard.vercel.app
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Revenue', 'Inventory', 'Market', 'Analytics'].map(tag => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  background: 'rgba(59,130,246,0.10)',
                  border: '1px solid rgba(59,130,246,0.22)',
                  color: '#60A5FA',
                  fontSize: 17,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
