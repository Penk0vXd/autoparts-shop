'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RequestForm from '@/components/RequestForm'

export default function RequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 📋 Form submission handler - UNCHANGED
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Create FormData from the form element
    const formData = new FormData(e.currentTarget)

    // Add file if selected (use the correct field name 'attachment')
    if (selectedFile) {
      formData.append('attachment', selectedFile)
    }

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        // Don't set Content-Type manually - let the browser set it with boundary
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        router.push('/thank-you')
      } else {
        if (result.details) {
          // Handle Zod validation errors
          const fieldErrors: Record<string, string> = {}
          result.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: result.error || 'Възникна грешка' })
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({ general: 'Грешка в мрежата. Моля опитайте отново.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 📎 File selection handler - UNCHANGED
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Client-side validation
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      
      if (file.size > maxSize) {
        setErrors({ file: 'Файлът трябва да е под 5MB' })
        e.target.value = '' // Clear input
        setSelectedFile(null)
        return
      }
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Разрешени са само JPG, PNG и PDF файлове' })
        e.target.value = '' // Clear input
        setSelectedFile(null)
        return
      }
      
      setSelectedFile(file)
      setErrors({ ...errors, file: '' })
    } else {
      setSelectedFile(null)
    }
  }

  return (
    <RequestForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      selectedFile={selectedFile}
      onFileChange={handleFileChange}
    />
  )
} 