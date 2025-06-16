import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShippingDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export type BillingDetails = {
  companyName?: string
  vatNumber?: string
}

export type CheckoutForm = {
  shipping: ShippingDetails
  billing: BillingDetails
}

type CheckoutStore = {
  form: CheckoutForm
  setShippingDetails: (details: ShippingDetails) => void
  setBillingDetails: (details: BillingDetails) => void
  clearForm: () => void
}

const initialForm: CheckoutForm = {
  shipping: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  },
  billing: {}
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      form: initialForm,
      
      setShippingDetails: (details) => {
        set((state) => ({
          form: {
            ...state.form,
            shipping: details
          }
        }))
      },
      
      setBillingDetails: (details) => {
        set((state) => ({
          form: {
            ...state.form,
            billing: details
          }
        }))
      },
      
      clearForm: () => {
        set({ form: initialForm })
      }
    }),
    {
      name: 'checkout-storage'
    }
  )
) 