import { ProductCardBG } from './product-card-bg'

/**
 * Category Page Types for Bulgarian Auto Parts Store
 * Production-ready with bulletproof handling
 */

export interface CategoryPage {
  id: string
  name: string
  slug: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  parentCategory?: {
    id: string
    name: string
    slug: string
  }
  subcategories?: CategoryPage[]
  productCount: number
  isActive: boolean
  image?: {
    url: string
    alt: string
  }
  icon?: string
  order: number
}

export interface CategoryFilter {
  brands: string[]
  priceRange: {
    min: number | null
    max: number | null
  }
  stockStatus: 'all' | 'in_stock' | 'out_of_stock'
  isOnSale: boolean
  isNew: boolean
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

export interface CategoryFilterOptions {
  brands: {
    value: string
    label: string
    count: number
  }[]
  priceRange: {
    min: number
    max: number
  }
  stockCounts: {
    inStock: number
    outOfStock: number
  }
  saleCounts: {
    onSale: number
    new: number
  }
}

export interface CategoryPageData {
  category: CategoryPage
  products: ProductCardBG[]
  filters: CategoryFilterOptions
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  breadcrumbs: {
    label: string
    href: string
  }[]
}

export interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    brand?: string | string[]
    minPrice?: string
    maxPrice?: string
    stock?: string
    sale?: string
    new?: string
    sort?: string
    page?: string
  }
}

// Bulgarian localization constants
export const CategoryLocalization = {
  titles: {
    category: 'Категория',
    filters: 'Филтри',
    products: 'Продукти',
    results: 'Резултати',
    noResults: 'Няма резултати'
  },
  filters: {
    brand: 'Марка',
    priceRange: 'Ценова гама',
    stockStatus: 'Наличност',
    sortBy: 'Сортирай по',
    applyFilters: 'Приложи филтри',
    clearFilters: 'Изчисти филтри',
    showResults: 'Покажи резултати'
  },
  stock: {
    all: 'Всички',
    inStock: 'В наличност',
    outOfStock: 'Изчерпан'
  },
  sort: {
    name: 'Име',
    priceAsc: 'Цена (възходяща)',
    priceDesc: 'Цена (низходяща)',
    newest: 'Най-нови',
    popular: 'Най-популярни'
  },
  messages: {
    noProducts: 'Няма намерени продукти. Моля, опитайте други филтри.',
    loading: 'Зареждане...',
    error: 'Възникна грешка. Моля, опитайте отново.',
    showingResults: 'Показани са {{count}} от {{total}} резултата',
    itemsFound: '{{count}} продукта намерени'
  },
  actions: {
    viewDetails: 'Виж детайли',
    addToCart: 'Добави в количката',
    quickView: 'Бърз преглед',
    compare: 'Сравни'
  }
} as const

// Category definitions for Bulgarian auto parts
export const BulgarianCategories: CategoryPage[] = [
  {
    id: 'brakes',
    name: 'Спирачки',
    slug: 'spirachki',
    description: 'Спирачни накладки, дискове, барабани и всички компоненти за спирачната система',
    seoTitle: 'Спирачки и спирачни части за автомобили | AutoParts BG',
    seoDescription: 'Качествени спирачни накладки, дискове и части за всички марки автомобили. Бърза доставка в цялата страна.',
    productCount: 389,
    isActive: true,
    icon: '🛑',
    order: 1
  },
  {
    id: 'engine',
    name: 'Двигател',
    slug: 'dvigatel',
    description: 'Масла, филтри, свещи и всички части за двигателя',
    seoTitle: 'Части за двигател - масла, филтри, свещи | AutoParts BG',
    seoDescription: 'Оригинални части за двигател, масла, филтри и свещи за всички марки автомобили. Гарантирано качество.',
    productCount: 542,
    isActive: true,
    icon: '🔧',
    order: 2
  },
  {
    id: 'suspension',
    name: 'Окачване',
    slug: 'okachvane',
    description: 'Амортисьори, пружини, стабилизатори и части за окачването',
    seoTitle: 'Окачване - амортисьори, пружини, стабилизатори | AutoParts BG',
    seoDescription: 'Професионални части за окачване - амортисьори, пружини, стабилизатори за комфорт и безопасност.',
    productCount: 287,
    isActive: true,
    icon: '⚙️',
    order: 3
  },
  {
    id: 'electrical',
    name: 'Електрика',
    slug: 'elektrika',
    description: 'Батерии, генератори, стартери и електрически компоненти',
    seoTitle: 'Електрически части - батерии, генератори, стартери | AutoParts BG',
    seoDescription: 'Надеждни електрически части и компоненти за автомобили. Батерии, генератори, стартери с гаранция.',
    productCount: 356,
    isActive: true,
    icon: '⚡',
    order: 4
  },
  {
    id: 'body',
    name: 'Каросерия',
    slug: 'karoseriya',
    description: 'Фарове, стопове, огледала и части за каросерията',
    seoTitle: 'Каросерия - фарове, стопове, огледала | AutoParts BG',
    seoDescription: 'Качествени части за каросерия - фарове, стопове, огледала и аксесоари за всички марки автомобили.',
    productCount: 234,
    isActive: true,
    icon: '🚗',
    order: 5
  },
  {
    id: 'interior',
    name: 'Интериор',
    slug: 'interior',
    description: 'Седалки, волани, килимчета и аксесоари за интериора',
    seoTitle: 'Интериор - седалки, волани, килимчета | AutoParts BG',
    seoDescription: 'Комфортни и стилни части за интериора - седалки, волани, килимчета и аксесоари.',
    productCount: 178,
    isActive: true,
    icon: '🪑',
    order: 6
  }
] 