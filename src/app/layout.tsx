import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/Header/Header'
import { SearchDialog } from '@/components/SearchDialog/SearchDialog'
import { GlobalKeyboardShortcuts } from '@/components/GlobalKeyboardShortcuts'
import Footer from '@/components/Footer/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Авточасти - Вашият надежден партньор за авточасти',
  description: 'Открийте хиляди качествени авточасти за всички марки автомобили на най-добрите цени',
  keywords: 'авточасти, резервни части, автомобилни части, България',
  authors: [{ name: 'Auto Parts Store' }],
  openGraph: {
    title: 'Авточасти - Вашият надежден партньор за авточасти',
    description: 'Открийте хиляди качествени авточасти за всички марки автомобили на най-добрите цени',
    type: 'website',
    locale: 'bg_BG',
  },
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang="bg">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-background">
            <Header />
            <SearchDialog />
            <GlobalKeyboardShortcuts />

            <main>
              {children}
            </main>

            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 