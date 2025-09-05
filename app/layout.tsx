import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Audito - Análise de Interface com IA",
    template: "%s | Audito"
  },
  description: "Analise e melhore suas interfaces com inteligência artificial. Obtenha insights instantâneos sobre usabilidade, acessibilidade e design com IA avançada.",
  keywords: [
    "análise de interface",
    "design UX",
    "usabilidade",
    "acessibilidade",
    "inteligência artificial",
    "auditoria de design",
    "UI/UX",
    "análise de produto"
  ],
  authors: [{ name: "Audito Team" }],
  creator: "Audito",
  publisher: "Audito",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://audito.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://audito.app',
    title: 'Audito - Análise de Interface com IA',
    description: 'Analise e melhore suas interfaces com inteligência artificial. Obtenha insights instantâneos sobre usabilidade, acessibilidade e design.',
    siteName: 'Audito',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Audito - Análise de Interface com IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audito - Análise de Interface com IA',
    description: 'Analise e melhore suas interfaces com inteligência artificial.',
    images: ['/og-image.png'],
    creator: '@audito',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} antialiased dark`}>
      <body className="dark">{children}</body>
    </html>
  )
}
