import { ProductCardBG } from '@/types/product-card-bg'

/**
 * Comprehensive Product Examples for Bulgarian Auto Parts Store
 * 
 * Includes edge cases to demonstrate bulletproof handling:
 * - Null/undefined prices
 * - Missing images
 * - Different stock statuses
 * - Various product types
 * - Sale products
 * - New/featured products
 */

export const bulgarianProductExamples: ProductCardBG[] = [
  // 1. Perfect product with all data
  {
    id: 'brake-pads-bmw-premium',
    name: 'Накладки предни спирачки BMW F30',
    slug: 'brake-pads-bmw-premium',
    brand: {
      name: 'Bosch',
      logo: '/logos/bosch.png'
    },
    image: {
      url: '/api/placeholder/400/400?text=BMW+Brake+Pads',
      alt: 'Накладки предни спирачки BMW F30 - Bosch',
      placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
    },
    price: {
      amount: 89.99,
      originalAmount: 119.99,
      currency: 'BGN',
      isOnSale: true,
      discountPercent: 25
    },
    stock: {
      isInStock: true,
      quantity: 15,
      status: 'in_stock',
      deliveryText: 'Доставка до 24 часа в София'
    },
    warranty: {
      included: true,
      duration: '24 месеца'
    },
    category: 'Спирачна система',
    partNumber: 'BP-BMW-F30-001',
    isNew: false,
    isFeatured: true
  },

  // 2. Product with NULL price (should show "Цена при запитване")
  {
    id: 'oil-filter-rare-part',
    name: 'Маслен филтър Audi A8 (рядка част)',
    slug: 'oil-filter-rare-part',
    brand: {
      name: 'Mann Filter',
      logo: '/logos/mann-filter.png'
    },
    image: {
      url: '/api/placeholder/400/400?text=Audi+Oil+Filter',
      alt: 'Маслен филтър Audi A8 - Mann Filter'
    },
    price: {
      amount: null, // NULL price - should show "Цена при запитване"
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      status: 'in_stock',
      deliveryText: 'Доставка 3-5 работни дни'
    },
    warranty: {
      included: true
    },
    category: 'Филтри',
    partNumber: 'OF-AUDI-A8-RARE',
    isNew: false,
    isFeatured: false
  },

  // 3. Product with undefined price (edge case)
  {
    id: 'engine-part-custom',
    name: 'Специална част за двигател Mercedes',
    slug: 'engine-part-custom',
    brand: {
      name: 'Mercedes-Benz Original'
    },
    image: {
      url: '/api/placeholder/400/400?text=Mercedes+Engine+Part',
      alt: 'Специална част за двигател Mercedes'
    },
    price: {
      amount: undefined, // Undefined price - should show "Цена при запитване"
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      status: 'in_stock',
      deliveryText: 'По заявка'
    },
    warranty: {
      included: true,
      duration: '12 месеца'
    },
    category: 'Двигател',
    partNumber: 'EP-MERC-CUSTOM-001',
    isNew: true,
    isFeatured: false
  },

  // 4. Out of stock product
  {
    id: 'headlight-volkswagen-out',
    name: 'Фар преден Volkswagen Golf 7',
    slug: 'headlight-volkswagen-out',
    brand: {
      name: 'Hella',
      logo: '/logos/hella.png'
    },
    image: {
      url: '/api/placeholder/400/400?text=VW+Headlight',
      alt: 'Фар преден Volkswagen Golf 7 - Hella'
    },
    price: {
      amount: 450.00,
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: false,
      quantity: 0,
      status: 'out_of_stock',
      deliveryText: 'Очаква се доставка'
    },
    warranty: {
      included: true,
      duration: '24 месеца'
    },
    category: 'Осветление',
    partNumber: 'HL-VW-G7-001',
    isNew: false,
    isFeatured: false
  },

  // 5. Product with missing image
  {
    id: 'timing-belt-ford-no-image',
    name: 'Ремък за газораспределение Ford Focus',
    slug: 'timing-belt-ford-no-image',
    brand: {
      name: 'Gates'
    },
    // No image property - should show placeholder
    price: {
      amount: 85.50,
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      status: 'in_stock',
      deliveryText: 'Доставка до 24 часа'
    },
    warranty: {
      included: true,
      duration: '18 месеца'
    },
    category: 'Двигател',
    partNumber: 'TB-FORD-FOCUS-001',
    isNew: false,
    isFeatured: false
  },

  // 6. Low stock product
  {
    id: 'radiator-bmw-low-stock',
    name: 'Радиатор охлаждане BMW X5',
    slug: 'radiator-bmw-low-stock',
    brand: {
      name: 'Valeo',
      logo: '/logos/valeo.png'
    },
    image: {
      url: '/api/placeholder/400/400?text=BMW+Radiator',
      alt: 'Радиатор охлаждане BMW X5 - Valeo'
    },
    price: {
      amount: 320.00,
      originalAmount: 380.00,
      currency: 'BGN',
      isOnSale: true,
      discountPercent: 16
    },
    stock: {
      isInStock: true,
      quantity: 2,
      status: 'low_stock',
      deliveryText: 'Доставка до 24 часа'
    },
    warranty: {
      included: true,
      duration: '24 месеца'
    },
    category: 'Охлаждане',
    partNumber: 'RAD-BMW-X5-001',
    isNew: false,
    isFeatured: true
  },

  // 7. Product with NaN price (should be handled gracefully)
  {
    id: 'clutch-kit-opel-nan',
    name: 'Комплект съединител Opel Astra',
    slug: 'clutch-kit-opel-nan',
    brand: {
      name: 'Sachs'
    },
    image: {
      url: '/api/placeholder/400/400?text=Opel+Clutch',
      alt: 'Комплект съединител Opel Astra - Sachs'
    },
    price: {
      amount: NaN, // NaN price - should show "Цена при запитване"
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      status: 'in_stock',
      deliveryText: 'Доставка 2-3 работни дни'
    },
    warranty: {
      included: true,
      duration: '12 месеца'
    },
    category: 'Съединител',
    partNumber: 'CK-OPEL-ASTRA-001',
    isNew: false,
    isFeatured: false
  },

  // 8. Premium product with all features
  {
    id: 'shock-absorber-audi-premium',
    name: 'Амортисьор преден Audi A4 (спортна серия)',
    slug: 'shock-absorber-audi-premium',
    brand: {
      name: 'Bilstein',
      logo: '/logos/bilstein.png'
    },
    image: {
      url: '/api/placeholder/400/400?text=Audi+Shock+Absorber',
      alt: 'Амортисьор преден Audi A4 - Bilstein спортна серия'
    },
    price: {
      amount: 280.00,
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      quantity: 8,
      status: 'in_stock',
      deliveryText: 'Експресна доставка до 24 часа'
    },
    warranty: {
      included: true,
      duration: '36 месеца'
    },
    category: 'Окачване',
    partNumber: 'SA-AUDI-A4-SPORT-001',
    isNew: true,
    isFeatured: true
  }
]

// Utility function to simulate different data scenarios
export const createTestProduct = (overrides: Partial<ProductCardBG> = {}): ProductCardBG => {
  return {
    id: 'test-product-' + Date.now(),
    name: 'Тестов продукт',
    slug: 'test-product',
    price: {
      amount: 99.99,
      currency: 'BGN',
      isOnSale: false
    },
    stock: {
      isInStock: true,
      status: 'in_stock'
    },
    ...overrides
  }
}

// Edge case test data
export const edgeCaseTests = {
  nullPrice: createTestProduct({
    name: 'Продукт с null цена',
    price: { amount: null, currency: 'BGN', isOnSale: false }
  }),
  
  undefinedPrice: createTestProduct({
    name: 'Продукт с undefined цена',
    price: { amount: undefined, currency: 'BGN', isOnSale: false }
  }),
  
  nanPrice: createTestProduct({
    name: 'Продукт с NaN цена',
    price: { amount: NaN, currency: 'BGN', isOnSale: false }
  }),
  
  negativePrice: createTestProduct({
    name: 'Продукт с отрицателна цена',
    price: { amount: -50, currency: 'BGN', isOnSale: false }
  }),
  
  zeroPrice: createTestProduct({
    name: 'Продукт с нулева цена',
    price: { amount: 0, currency: 'BGN', isOnSale: false }
  }),
  
  outOfStock: createTestProduct({
    name: 'Изчерпан продукт',
    stock: { isInStock: false, status: 'out_of_stock' }
  }),
  
  noImage: createTestProduct({
    name: 'Продукт без изображение'
    // No image property
  }),
  
  emptyBrand: createTestProduct({
    name: 'Продукт без марка',
    brand: undefined
  })
} 