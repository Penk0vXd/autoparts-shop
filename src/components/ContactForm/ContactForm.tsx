'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Send } from 'lucide-react'
import { sendContactEmail } from '@/app/actions/sendContactEmail'

const contactSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа').max(100, 'Името е твърде дълго'),
  email: z.string().email('Невалиден email адрес'),
  subject: z.string().min(3, 'Темата трябва да е поне 3 символа').max(200, 'Темата е твърде дълга').optional(),
  message: z.string().min(10, 'Съобщението трябва да е поне 10 символа').max(2000, 'Съобщението е твърде дълго')
})

type ContactFormData = z.infer<typeof contactSchema>

/**
 * ContactForm component with validation and email sending
 * Used on the contact page for customer inquiries
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      await sendContactEmail(data)
      setSubmitMessage({
        type: 'success',
        text: 'Благодарим ви! Ще се свържем с вас скоро.'
      })
      reset()
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Възникна грешка при изпращане. Моля, опитайте отново.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Изпратете ни съобщение
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Име *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            aria-label="Вашето име"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Вашето име"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            aria-label="Вашият email адрес"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="example@domain.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Тема
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            aria-label="Тема на съобщението"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Кратко описание на въпроса (по желание)"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Съобщение *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={5}
            aria-label="Вашето съобщение"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Детайлно описание на вашия въпрос или запитване..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {submitMessage && (
          <div className={`p-4 rounded-lg ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Изпраща се...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Изпрати съобщение
            </>
          )}
        </button>
      </form>
    </div>
  )
} 