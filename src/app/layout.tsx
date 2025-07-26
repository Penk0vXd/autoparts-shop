import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/Header/Header'
// import { SearchDialog } from '@/components/SearchDialog/SearchDialog' // Removed for request-only MVP
import { GlobalKeyboardShortcuts } from '@/components/GlobalKeyboardShortcuts'
import Footer from '@/components/Footer/Footer'
import { ToastContainer } from '@/components/ui/Toast'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
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
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen bg-background">
              <ErrorBoundary fallback={
                <div className="h-16 bg-white border-b flex items-center justify-center">
                  <span className="text-gray-600">Грешка при зареждането на хедъра</span>
                </div>
              }>
                <Header />
              </ErrorBoundary>

              {/* SearchDialog removed for request-only MVP */}

              <ErrorBoundary>
                <GlobalKeyboardShortcuts />
              </ErrorBoundary>

              <main>
                <ErrorBoundary fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">Възникна грешка</h1>
                      <p className="text-gray-600">Моля, презаредете страницата или се опитайте отново.</p>
                    </div>
                  </div>
                }>
                  {children}
                </ErrorBoundary>
              </main>

              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </div>
            
            <ErrorBoundary>
              <ToastContainer />
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 