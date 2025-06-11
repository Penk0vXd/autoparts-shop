export type User = {
  id: string;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  category: 'car' | 'accessory' | 'parts';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  brand_id?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock: number;
  min_stock_level: number;
  weight?: number;
  dimensions?: Record<string, unknown>;
  images?: string[];
  specifications?: Record<string, unknown>;
  compatibility?: Record<string, unknown>;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  brand?: Brand;
};

export type Order = {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  stripe_payment_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  billing_address?: Address;
  shipping_address?: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  // Relations
  product?: Product;
};

export type Address = {
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}; 