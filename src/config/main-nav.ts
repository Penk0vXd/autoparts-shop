export const MAIN_NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/categories", label: "Категории" },
  { href: "/brands", label: "Марки" },
  { href: "/contact", label: "Контакт" },
  { href: "/about", label: "За нас" },
] as const

export type MainNavItem = typeof MAIN_NAV[number] 