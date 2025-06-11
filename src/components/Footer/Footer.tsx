import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

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
 */
export default function Footer({ categories = [] }: FooterProps) {
  // Fallback sample categories if none provided
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

            {/* Categories Column */}
            <div className="text-center sm:text-left">
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
                    href="/shipping"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Информация за доставка"
                  >
                    Доставка
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    aria-label="Условия за връщане"
                  >
                    Връщане
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