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

        <section className="mt-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.4089447187445!2d23.31918871544596!3d42.69751307916844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8682cb317bf5%3A0x400a01269bf5e60!2sSofia%2C%20Bulgaria!5e0!3m2!1sen!2s!4v1647856789123!5m2!1sen!2s"
            className="w-full aspect-video rounded-xl border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Местоположение на офиса"
          />
        </section>
      </div>
    </main>
  )
} 