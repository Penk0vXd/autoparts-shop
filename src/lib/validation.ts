import { z } from 'zod'

// Request form validation schema
export const requestFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Името трябва да е поне 2 символа')
    .max(100, 'Името трябва да е под 100 символа')
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, 'Името трябва да съдържа само букви'),
  
  phone: z
    .string()
    .min(6, 'Телефонният номер трябва да е поне 6 символа')
    .max(20, 'Телефонният номер трябва да е под 20 символа')
    .regex(/^[\+]?[0-9\s\-\(\)\.]+$/, 'Невалиден формат на телефонен номер'),
  
  car_details: z
    .string()
    .min(3, 'Детайлите за автомобила трябва да са поне 3 символа')
    .max(200, 'Детайлите за автомобила трябва да са под 200 символа'),
  
  message: z
    .string()
    .min(10, 'Съобщението трябва да е поне 10 символа')
    .max(1000, 'Съобщението трябва да е под 1000 символа'),
  
  file: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true
      const maxSize = 5 * 1024 * 1024 // 5MB
      return file.size <= maxSize
    }, 'Файлът трябва да е под 5MB')
    .refine((file) => {
      if (!file) return true
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      return allowedTypes.includes(file.type)
    }, 'Разрешени са само JPG, PNG и PDF файлове')
})

// Type for the validated form data
export type RequestFormData = z.infer<typeof requestFormSchema>

// Validation error type
export type ValidationError = {
  path: string[]
  message: string
}

// Validate form data and return errors
export function validateRequestForm(data: any): { success: boolean; errors?: ValidationError[] } {
  try {
    requestFormSchema.parse(data)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path,
          message: err.message
        }))
      }
    }
    return {
      success: false,
      errors: [{ path: ['general'], message: 'Валидационна грешка' }]
    }
  }
} 