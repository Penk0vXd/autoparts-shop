import { Metadata } from 'next'
import { ContactInfo } from '@/components/ContactInfo/ContactInfo'
import { ContactForm } from '@/components/ContactForm/ContactForm'

export const metadata: Metadata = {
  title: 'Контакт | Авточасти',
  description: 'Свържете се с нас за консултация и поръчки на авточасти. Телефон, email и адрес за контакт.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Свържете се с нас
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Имате въпроси за продуктите ни? Нуждаете се от консултация? Ние сме тук да ви помогнем!
          </p>
        </div>

        <section className="grid lg:grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
        </section>
      </div>
    </main>
  )
} 