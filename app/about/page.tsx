import type { Metadata } from 'next'
import { AboutContent } from '@/components/sections/about-content'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return <AboutContent />
}
