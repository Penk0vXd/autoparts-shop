'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">
            За нас
          </h1>

          <div className="prose prose-lg prose-gray max-w-none space-y-12">
            
            {/* Кои сме ние */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-6">
                Кои сме ние
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Когато автомобилът ви спре, времето спира. Животът спира. 
                  Ние разбираме това чувство. Затова сме тук.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  С 12+ години опит знаем какво означава доверие. 
                  <strong className="text-red-600">Не продаваме части – решаваме проблеми.</strong>
                </p>
              </div>
            </section>

            {/* Как работим */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-6">
                Как работим
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Кажете ни</h3>
                  <p className="text-gray-700">
                    Марка, модел, година. Или просто опишете проблема. 
                    Ние ще разберем останалото.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Ние търсим</h3>
                  <p className="text-gray-700">
                    Проверяваме мрежата от доверени доставчици. 
                    <strong className="text-red-600">Нови или използвани</strong> – намираме най-добрия вариант.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Получавате оферта</h3>
                  <p className="text-gray-700">
                    Цена, срок, гаранция. Без скрити такси. 
                    Без изненади.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Доставяме</h3>
                  <p className="text-gray-700">
                    Частта пристига до вас. 
                    <strong className="text-red-600">Бързо. Сигурно. Ясно.</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Нашите ценности */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-6">
                Нашите ценности
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Честност</h3>
                  <p className="text-gray-700 text-sm">
                    Говорим ясно. Цените са прозрачни. 
                    Обещаваме само това, което можем да доставим.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Бързина</h3>
                  <p className="text-gray-700 text-sm">
                    Отговор до 30 минути. Доставка в най-кратки срокове. 
                    Защото знаем – времето е пари.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Лично отношение</h3>
                  <p className="text-gray-700 text-sm">
                    Всеки автомобил е уникален. Затова всеки клиент 
                    получава индивидуално внимание.
                  </p>
                </div>
              </div>
            </section>

            {/* Защо да изберете нас */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-6">
                Защо да изберете нас
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <span className="text-red-600">30-минутен отговор</span>
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Обязваме се да отговорим на всяко запитване в рамките на 30 минути. 
                    Без изключения.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <span className="text-red-600">Проверени доставчици</span>
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Работим само с доверени партньори. 
                    Проверяваме наличността преди да обещаем.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <span className="text-red-600">Редки части</span>
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Специализирани сме в намирането на трудни части. 
                    Ако съществува – ще я намерим.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <span className="text-red-600">Доверие</span>
                  </h3>
                  <p className="text-gray-700 text-sm">
                    От София до Бургас – автомобилистите ни доверяват 
                    своите автомобили. И ние не ги разочароваме.
                  </p>
                </div>
              </div>
            </section>

            {/* Нашата мисия */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-6">
                Нашата мисия
              </h2>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-8 rounded-lg border border-red-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Автомобилът не е просто машина. Той е вашата свобода. Вашата независимост. 
                  Когато той не работи, всичко спира. Затова нашата мисия е да бъдем вашият 
                  <strong className="text-red-600">надежден партньор</strong> в най-неприятния момент. 
                  Не просто да продадем част – да върнем живота ви към нормала. 
                  Защото за нас това не е търговия. Това е кауза.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-red-600 p-8 rounded-lg text-white">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Готови ли сте да намерим точната част?
              </h2>
              <p className="text-red-100 leading-relaxed mb-6 text-lg">
                Изпратете запитване сега. Обязваме се – ще отговорим в рамките на 30 минути.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                Изпратете запитване сега
              </a>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
} 