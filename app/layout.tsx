import type { Metadata, Viewport } from 'next'
import { Martian_Mono, Mona_Sans, Newsreader } from 'next/font/google'
import '../styles/globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'
import Cursor from '@/components/cursor/Cursor'
import { meta } from '@/content/content'

const sans = Mona_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  axes: ['wdth'],
  display: 'swap',
})

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic'],
  axes: ['opsz'],
  display: 'swap',
})

const mono = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  axes: ['wdth'],
  display: 'swap',
})

const description =
  'Senior Technical Analyst at Gainsight: nine years of production support, SQL and root-cause analysis, now paired with Claude-powered agents — and design-led websites.'

export const metadata: Metadata = {
  // Set SITE_URL to the deployed domain so social previews resolve absolute image URLs
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: `${meta.name} — ${meta.role}`,
  description,
  keywords: [
    'AI Support Analyst', 'Gainsight', 'Claude AI', 'MCP', 'Customer Success',
    'Technical Support', 'Automation Engineering', 'Web Design', 'GSAP', 'Hyderabad',
  ],
  authors: [{ name: meta.name }],
  openGraph: {
    title: `${meta.name} — ${meta.role}`,
    description,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/portrait.webp', width: 1200, height: 1381, alt: `Portrait of ${meta.name}` }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0b0c0c',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: meta.name,
  jobTitle: meta.role,
  worksFor: { '@type': 'Organization', name: 'Gainsight' },
  address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
  email: meta.email,
  sameAs: [meta.linkedin],
  knowsAbout: ['Gainsight', 'Technical Support', 'Root Cause Analysis', 'SQL', 'REST APIs', 'Production Support', 'AI Automation', 'Claude API', 'MCP', 'Web Design'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="ink"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint so motion-only initial states never flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <LenisProvider>
          <Cursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
