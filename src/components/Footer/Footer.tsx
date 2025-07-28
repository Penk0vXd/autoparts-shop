'use client'

import Link from 'next/link'

interface FooterLink {
  title: string
  href: string
}

interface FooterProps {
  className?: string
}

/**
 * FooterSection Component
 * 
 * Displays footer with company links, contact info, and copyright
 * TODO: Add social media links, newsletter signup, and dynamic content
 */
export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  // TODO: Move to external data file or API
  const footerLinks = {
    services: [
      { title: 'Авточасти', href: '/catalog' },
      { title: 'Заявка за части', href: '/request' },
      { title: 'Консултация', href: '/contact' },
      { title: 'Доставка', href: '/delivery' }
    ],
    company: [
      { title: 'За нас', href: '/about' },
      { title: 'Контакти', href: '/contact' },
      { title: 'Условия за ползване', href: '/terms' },
      { title: 'Политика за поверителност', href: '/privacy' }
    ],
    support: [
      { title: 'Помощ', href: '/help' },
      { title: 'FAQ', href: '/faq' },
      { title: 'Гаранция', href: '/warranty' },
      { title: 'Връщане', href: '/returns' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'YouTube', href: '#', icon: '📺' }
  ]

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                AutoParts Store
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Вашият надежден партньор за автомобилни части в България. 
                Професионална консултация и бърза доставка.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+359 888 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>info@autoparts.bg</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>София, България</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Услуги
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Компания
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Поддръжка
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              Абонирайте се за новини
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Получете най-новите оферти и промоции
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                Абонирай се
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-300 text-sm">
              © {currentYear} AutoParts Store. Всички права запазени.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6 text-sm text-gray-300">
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Условия
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Поверителност
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors duration-200">
                Бисквитки
              </Link>
            </div>
          </div>
        </div>

        {/* TODO: Add interactive elements like:
            - Newsletter signup functionality
            - Social media sharing
            - Back to top button
            - Language switcher
            - Mobile app download links
        */}
      </div>
    </footer>
  )
} 