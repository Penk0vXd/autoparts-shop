import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addToast } from '@/components/ui/Toast'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  stock: number
  sku?: string
}

export interface DeliveryInfo {
  method: 'address' | 'office' | 'pickup'
  address?: {
    street: string
    city: string
    postalCode: string
    phone: string
  }
  office?: {
    city: string
    office: string
    phone: string
  }
}

export interface PaymentInfo {
  method: 'card' | 'cash' | 'digital'
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  isDrawerOpen: boolean
  deliveryInfo: DeliveryInfo
  paymentInfo: PaymentInfo
  couponCode: string
  couponDiscount: number
  
  // Actions
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getOrderSummary: () => OrderSummary
  
  // Drawer actions
  openDrawer: () => void
  closeDrawer: () => void
  setDeliveryInfo: (info: DeliveryInfo) => void
  setPaymentInfo: (info: PaymentInfo) => void
  setCouponCode: (code: string) => void
  applyCoupon: (discount: number) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isDrawerOpen: false,
      deliveryInfo: { method: 'address' },
      paymentInfo: { method: 'card' },
      couponCode: '',
      couponDiscount: 0,

      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          // Update quantity if item exists and doesn't exceed stock
          const newQuantity = existingItem.quantity + 1
          if (newQuantity <= product.stock) {
            set({
              items: items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            })
            addToast({
              type: 'success',
              title: 'Продуктът е добавен!',
              description: `${product.name} (${newQuantity} бр.)`,
              duration: 3000
            })
          } else {
            addToast({
              type: 'error',
              title: 'Няма достатъчно наличност',
              description: `Налични са само ${product.stock} бр.`,
              duration: 3000
            })
          }
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity: 1 }]
          })
          addToast({
            type: 'success',
            title: 'Продуктът е добавен в количката!',
            description: product.name,
            duration: 3000
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getOrderSummary: () => {
        const subtotal = get().getTotalPrice()
        const deliveryFee = subtotal > 100 ? 0 : (get().deliveryInfo.method === 'pickup' ? 0 : 10)
        const discount = get().couponDiscount
        const total = subtotal + deliveryFee - discount
        
        return {
          subtotal,
          deliveryFee,
          discount,
          total: Math.max(0, total)
        }
      },

      // Drawer actions
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      
      setDeliveryInfo: (info) => set({ deliveryInfo: info }),
      setPaymentInfo: (info) => set({ paymentInfo: info }),
      setCouponCode: (code) => set({ couponCode: code }),
      applyCoupon: (discount) => set({ couponDiscount: discount })
    }),
    {
      name: 'cart-storage',
      version: 2,
    }
  )
) 