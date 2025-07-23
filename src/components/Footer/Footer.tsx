import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { isFeatureEnabled } from '@/config/features'

interface Category {
  id: string
  name: string
  slug: string
}

interface FooterProps {
  categories?: Category[]
}

/**
 * Polished, responsive footer component with red-and-white theme
 * Four-column layout on desktop, stacked on mobile with proper accessibility
 * MVP mode: Hides product categories and promotes inquiry flow
 */
export default function Footer({ categories = [] }: FooterProps) {
  // Fallback sample categories if none provided (only shown if products feature is enabled)
  const defaultCategories = [
    { id: '1', name: 'Двигатели', slug: 'dvigateli' },
    { id: '2', name: 'Спирачки', slug: 'spirachki' },
    { id: '3', name: 'Окачване', slug: 'okachvane' },
    { id: '4', name: 'Електрика', slug: 'elektrika' },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <footer className="bg-footer text-white">
      <div className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Brand Column */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                <div className="h-10 w-10 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AC</span>
                </div>
                <span className="text-xl font-bold text-white/90">Авточасти</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Вашият надежден партньор за качествени авточасти и бърза доставка
              </p>
            </div>

            {/* Categories Column - Hidden in MVP mode, replaced with services */}
            <div className="text-center sm:text-left">
              {isFeatureEnabled('productCategories') ? (
                <>
                  <h3 className="mb-4 text-lg font-semibold tracking-wide text-white/90">Категории</h3>
                  <ul className="space-y-3">
                    {displayCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/catalog?category=${category.slug}`}
                          className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                          aria-label={`Разгледай категория ${category.name}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="mb-4 text-lg font-semibold tracking-wide text-white/90">Услуги</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/inquiry"
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                        aria-label="Заявете част"
                      >
                        Заявка за част
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/brands"
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                        aria-label="Разгледай марки"
                      >
                        Всички марки
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                        aria-label="Консултации"
                      >
                        Консултации
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                        aria-label="Нашият екип"
                      >
                        Нашият екип
                      </Link>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Information Column */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold tracking-wide text-white/90">Информация</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Научете повече за нас"
                  >
                    За нас
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Свържете се с нас"
                  >
                    Контакти
                  </Link>
                </li>
                <li>
                  <Link
                    href="/delivery"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Информация за доставка"
                  >
                    Доставка
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Условия за поверителност"
                  >
                    Поверителност
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold tracking-wide text-white/90">Контакти</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <FiPhone className="w-4 h-4 text-primary" aria-hidden="true" />
                  <a
                    href="tel:+359888123456"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Обадете се на +359 888 123 456"
                  >
                    +359 888 123 456
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <FiMail className="w-4 h-4 text-primary" aria-hidden="true" />
                  <a
                    href="mailto:info@autoparts.bg"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Изпратете имейл до info@autoparts.bg"
                  >
                    info@autoparts.bg
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <FiMapPin className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-white/70 text-sm">София, България</span>
                </div>
              </div>
              
              {/* CTA for inquiry in MVP mode */}
              {!isFeatureEnabled('productCategories') && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href="/inquiry"
                    className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Заявете част →
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Авточасти. Всички права запазени.</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 