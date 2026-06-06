import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import { LenisProvider } from '@/components/providers/LenisProvider'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne-var',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Siddharth B — Full-stack & AI Engineer',
  description:
    'Engineer who thinks beyond the code. Builder who understands your business model, your users, and your market — then ships the product to serve all three.',
  keywords: ['Full-stack Engineer', 'AI Engineer', 'Founding Engineer', 'Coimbatore', 'India'],
  openGraph: {
    title: 'Siddharth B — Full-stack & AI Engineer',
    description: 'Engineer who thinks beyond the code.',
    url: 'https://sidintech.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-ink antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
