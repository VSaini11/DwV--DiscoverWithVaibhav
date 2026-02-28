import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DwV - Men\'s Style & Fragrance Discovery',
  description: 'DwV is a curated men’s style discovery platform for trending outfits and fragrances. Handpicked aesthetic styles to help you find the best fashion in one place.',
  keywords: ['DwV', 'DiscoverWithVaibhav', 'men\'s style discovery', 'trending outfits for men', 'men\'s fragrance curation', 'menswear trends', 'fashion discovery platform', 'curated fashion outfits', 'best fragrances for men', 'Pinterest fashion for men', 'aesthetic outfits for guys'],
  authors: [{ name: 'Vaibhav' }],
  metadataBase: new URL('https://dwv-brand.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'DwV - Men\'s Style & Fragrance Discovery',
    description: 'DwV is a curated men’s style discovery platform for trending outfits and fragrances. Handpicked aesthetic styles to help you find the best fashion in one place.',
    url: 'https://dwv-brand.vercel.app/',
    siteName: 'DiscoverWithVaibhav',
    images: [
      {
        url: '/hero-image.png',
        width: 1200,
        height: 630,
        alt: 'DiscoverWithVaibhav - Viral Fashion Finds',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DwV - Men\'s Style & Fragrance Discovery',
    description: 'DwV is a curated men’s style discovery platform for trending outfits and fragrances.',
    images: ['/hero-image.png'],
  },
  verification: {
    google: 'VrEmnNqA7SezugBRvYNegJyz__fvvrpT83slChVPMRo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
