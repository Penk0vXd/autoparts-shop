'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">
            За нас
          </h1>

          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mt-4">
              Ние сме водещ доставчик на качествени авточасти в България. С повече от 15 години опит в автомобилната индустрия, 
              ние предлагаме широка гама от части за всички популярни марки автомобили. Нашата мисия е да предоставим на 
              клиентите си най-доброто съотношение между качество и цена.
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12 mb-6">
              Нашата мисия
            </h2>

            <p className="text-gray-600 leading-relaxed mt-4">
              Да предоставим на автомобилистите в България лесен достъп до качествени авточасти на конкурентни цени. 
              Стремим се да бъдем вашият доверен партньор за всички нужди от резервни части, като предлагаме 
              професионални съвети и отлично обслужване.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 