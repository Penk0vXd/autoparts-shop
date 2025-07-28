import { Metadata } from 'next'
import { Hero } from '@/components/Hero/Hero'
import FeaturesSection from '@/components/FeaturesSection/FeaturesSection'
import HowItWorksSection from '@/components/HowItWorksSection/HowItWorksSection'
import TestimonialsSection from '@/components/TestimonialsSection/TestimonialsSection'
import CTASection from '@/components/CTASection/CTASection'
import ContactFormSection from '@/components/ContactFormSection/ContactFormSection'

export const metadata: Metadata = {
  title: 'Авточасти | Заявка за части',
  description: 'Професионална услуга за намиране на авточасти. Изпратете заявка и ще намерим точно това, което търсите.',
  keywords: 'авточасти, заявка за части, автомобилни части, България',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🎯 Beautiful Hero Section - UNTOUCHED */}
      <Hero />

      {/* ✨ Features Section */}
      <FeaturesSection />

      {/* 🔧 How It Works Section */}
      <HowItWorksSection />

      {/* 💬 Testimonials Section */}
      <TestimonialsSection />

      {/* 🚀 Call to Action Section */}
      <CTASection />

      {/* 📞 Contact Form Section */}
      <ContactFormSection />
    </div>
  )
}  