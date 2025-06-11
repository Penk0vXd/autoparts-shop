export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          description: string | null
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          sku: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          brand_id: string | null
          price: number
          compare_price: number | null
          cost_price: number | null
          stock: number
          min_stock_level: number
          weight: number | null
          dimensions: Json | null
          image_url: string | null
          images: Json | null
          specifications: Json | null
          compatibility: Json | null
          is_active: boolean
          is_featured: boolean
          is_deleted: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          brand_id?: string | null
          price: number
          compare_price?: number | null
          cost_price?: number | null
          stock?: number
          min_stock_level?: number
          weight?: number | null
          dimensions?: Json | null
          image_url?: string | null
          images?: Json | null
          specifications?: Json | null
          compatibility?: Json | null
          is_active?: boolean
          is_featured?: boolean
          is_deleted?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          brand_id?: string | null
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          stock?: number
          min_stock_level?: number
          weight?: number | null
          dimensions?: Json | null
          image_url?: string | null
          images?: Json | null
          specifications?: Json | null
          compatibility?: Json | null
          is_active?: boolean
          is_featured?: boolean
          is_deleted?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_method: string | null
          stripe_payment_id: string | null
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total: number
          currency: string
          billing_address: Json | null
          shipping_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_method?: string | null
          stripe_payment_id?: string | null
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total: number
          currency?: string
          billing_address?: Json | null
          shipping_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_method?: string | null
          stripe_payment_id?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total?: number
          currency?: string
          billing_address?: Json | null
          shipping_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          qty: number
          price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          qty: number
          price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          qty?: number
          price?: number
          total_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: "pending" | "paid" | "shipped" | "completed" | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Brand = Database['public']['Tables']['brands']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
  updated_at: string
}

export type ProductWithRelations = Product & {
  brand: Brand | null
  category: Category | null
  images?: ProductImage[]
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

export type CreateProduct = Database['public']['Tables']['products']['Insert']
export type UpdateProduct = Database['public']['Tables']['products']['Update']
export type CreateOrder = Database['public']['Tables']['orders']['Insert']
export type CreateOrderItem = Database['public']['Tables']['order_items']['Insert'] 