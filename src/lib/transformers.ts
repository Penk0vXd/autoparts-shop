import { ProductWithRelations } from '@/types/db'
import { ProductCardBG } from '@/types/product-card-bg'

/**
 * Transforms a product from the database schema to the format required for the ProductCardBG component.
 * This ensures consistency across the application and handles data mapping in one central place.
 *
 * @param product - The product data fetched from the database (Supabase).
 * @returns The transformed product data ready for the UI component.
 */
export function transformToProductCardBG(product: ProductWithRelations): ProductCardBG {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand
      ? {
          name: product.brand.name,
          logo: product.brand.logo_url || undefined,
        }
      : undefined,
    image:
      product.images && product.images.length > 0
        ? {
            url: product.images[0].url,
            alt: product.images[0].alt || product.name,
            placeholder: product.images[0].placeholder,
          }
        : undefined,
    price: {
      amount: product.price ?? null,
      currency: 'BGN' as const,
      isOnSale: product.is_on_sale || false,
      originalAmount: product.original_price ?? null,
      discountPercent: product.discount_percent ?? undefined,
    },
    stock: {
      isInStock: (product.stock_quantity ?? 0) > 0,
      quantity: product.stock_quantity ?? 0,
      status:
        (product.stock_quantity ?? 0) > 10
          ? 'in_stock'
          : (product.stock_quantity ?? 0) > 0
          ? 'low_stock'
          : 'out_of_stock',
      deliveryText: 'Доставка до 24 часа',
    },
    warranty: {
      included: true,
      duration: '24 месеца',
    },
    category: product.category?.name,
    partNumber: product.part_number || product.sku,
    isNew: product.is_new || false,
    isFeatured: product.is_featured || false,
  }
} 