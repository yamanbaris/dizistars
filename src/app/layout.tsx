import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap' // Optimize font loading
})

export const metadata: Metadata = {
  title: 'DiziStars - Turkish Entertainment Platform',
  description: 'Your ultimate destination for Turkish entertainment, featuring actors, actresses, TV series, and the latest industry news.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#1E1E1E',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DiziStars'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-dark text-light antialiased overscroll-none">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
