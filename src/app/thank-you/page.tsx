import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Благодарим за заявката | Авточасти',
  description: 'Вашата заявка е получена успешно. Ще се свържем с вас в най-скоро време.',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Заявката е изпратена!
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Благодарим ви за доверието! Получихме вашата заявка и ще се свържем с вас 
          до <strong className="text-green-600">2 часа в работни дни</strong>.
        </p>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Какво следва?
          </h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Нашите специалисти ще разгледат вашата заявка
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Ще намерим най-подходящата част за вашия автомобил
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Ще ви предоставим цена и срок за доставка
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Ще получите отговор по телефона или имейла
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Към началната страница
          </a>
          
          <p className="text-sm text-gray-500">
            За спешни случаи се обадете на{' '}
            <a
              href="tel:+359888123456"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              +359 888 123 456
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Работно време: Понedelnik - Петък, 9:00 - 18:00 часа
          </p>
        </div>
      </div>
    </div>
  )
} 