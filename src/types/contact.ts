export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  ip_address?: string
  created_at: string
  updated_at: string
}

export interface ContactSubmissionCreate {
  name: string
  email: string
  subject?: string
  message: string
  ip_address?: string
} 