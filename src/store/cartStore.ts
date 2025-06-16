import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  image_url: string
  qty: number
  stock: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.id === item.id 
                ? { ...i, qty: Math.min(i.qty + 1, item.stock) }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...item, qty: 1 }] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },
      
      updateQty: (id, qty) => {
        const { items } = get()
        const item = items.find(i => i.id === id)
        
        if (!item) return
        
        set({
          items: items.map(i => 
            i.id === id 
              ? { ...i, qty: Math.min(Math.max(1, qty), item.stock) }
              : i
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
) 