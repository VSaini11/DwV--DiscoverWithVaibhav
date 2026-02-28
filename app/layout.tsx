import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DiscoverWithVaibhav - Viral Fashion Finds',
  description: 'Discover viral fashion finds before everyone else. Handpicked trending styles curated from Pinterest. Explore our collection of women\'s, men\'s, streetwear, and accessories.',
  keywords: ['Trending fashion', 'Pinterest finds', 'viral styles', 'aesthetic outfit ideas', 'DiscoverWithVaibhav', 'streetwear', 'curated fashion'],
  authors: [{ name: 'Vaibhav' }],
  metadataBase: new URL('https://dwv-brand.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DiscoverWithVaibhav - Viral Fashion Finds',
    description: 'Discover viral fashion finds before everyone else. Handpicked trending styles curated from Pinterest.',
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
    title: 'DiscoverWithVaibhav - Viral Fashion Finds',
    description: 'Discover viral fashion finds before everyone else. Handpicked trending styles curated from Pinterest.',
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
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.svg',
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
