import { isFeatureEnabled } from './features'

export const MAIN_NAV = [
  // Product-related navigation - conditionally hidden
  ...(isFeatureEnabled('productCatalog') ? [{ href: "/catalog", label: "Каталог" }] : []),
  ...(isFeatureEnabled('productCategories') ? [{ href: "/categories", label: "Категории" }] : []),
  
  // Core MVP navigation - always shown
  { href: "/brands", label: "Марки" },
  { href: "/inquiry", label: "Заявка за част" },
  { href: "/contact", label: "Контакт" },
  { href: "/about", label: "За нас" },
] as const

export type MainNavItem = typeof MAIN_NAV[number] 