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
  description?: string | null;
  parent_id?: string | null;
  image_url?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  description?: string | null;
  website_url?: string;
  category: 'car' | 'accessory' | 'parts';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt?: string | null;
  placeholder?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  original_price?: number | null;
  discount_percent?: number | null;
  part_number?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  warranty_months?: number | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
};

// Product with related data for API responses
export type ProductWithRelations = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  original_price?: number | null;
  discount_percent?: number | null;
  part_number?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  warranty_months?: number | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: string | null;
    image_url?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  images?: ProductImage[];
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