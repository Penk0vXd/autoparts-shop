'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10)
})

/**
 * Server action to send contact form emails via Resend
 * @param formData - Contact form data
 */
export async function sendContactEmail(formData: unknown) {
  try {
    const data = contactSchema.parse(formData)

    const resend = new Resend(process.env.RESEND_API_KEY!)
    
    const result = await resend.emails.send({
      from: 'Авточасти <no-reply@example.com>',
      to: 'support@example.com',
      subject: `Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
            Ново съобщение от контактната форма
          </h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Име:</strong> ${data.name}</p>
            <p><strong>E-mail:</strong> ${data.email}</p>
            <p><strong>Тема:</strong> ${data.subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <p><strong>Съобщение:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
              <pre style="white-space: pre-wrap; margin: 0; font-family: Arial, sans-serif;">${data.message}</pre>
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
          <p style="color: #666; font-size: 12px;">
            Това съобщение е изпратено от контактната форма на сайта.
          </p>
        </div>
      `
    })

    if (result.error) {
      throw new Error(`Failed to send email: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    throw new Error('Failed to send contact email')
  }
} 