import type { Metadata } from 'next'
import { Shell } from '@/components/nav/shell'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ynotcard.vercel.app'),
  title: {
    default: 'ynotcard',
    template: '%s | ynotcard',
  },
  description: 'TCG portfolio analytics dashboard. Track revenue, inventory, and market trends for your trading card business.',
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  openGraph: {
    type: 'website',
    url: 'https://ynotcard.vercel.app',
    siteName: 'ynotcard',
    title: 'ynotcard | TCG Portfolio Analytics',
    description: 'Track revenue, inventory, and market trends for your trading card business.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'ynotcard dashboard preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ynotcard | TCG Portfolio Analytics',
    description: 'Track revenue, inventory, and market trends for your trading card business.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas-950 text-slate-100 antialiased font-sans" suppressHydrationWarning>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
