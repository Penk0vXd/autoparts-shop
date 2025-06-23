'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { MAIN_NAV } from '@/config/main-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/store/searchStore'
import { useCartStore } from '@/store/cartStore'
import { CartIcon } from '@/components/ui/CartIcon'
import { OrderDrawer } from '@/components/OrderDrawer/OrderDrawer'
import { useHydration } from '@/hooks/useHydration'

/**
 * Main application header with responsive navigation
 * Features sticky positioning, mobile sheet menu, and user auth integration
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const hydrated = useHydration()
  const selectedSegment = useSelectedLayoutSegment()
  const { open: openSearch } = useSearchStore()
  const { getTotalItems, isDrawerOpen, openDrawer, closeDrawer } = useCartStore()
  
  const cartItemsCount = hydrated ? getTotalItems() : 0

  const isActiveLink = (href: string) => {
    const segment = href.replace('/', '')
    return selectedSegment === segment || (href === '/' && !selectedSegment)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" aria-label="Начална страница">
          <div className="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">AC</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">Авточасти</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 font-medium text-sm transition-colors hover:text-primary ${
                isActiveLink(item.href)
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Отвори меню"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AC</span>
                  </div>
                  <span className="font-bold text-lg">Авточасти</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Затвори меню"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                {MAIN_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 font-medium text-base transition-colors hover:text-primary rounded-md ${
                      isActiveLink(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                

              </nav>
            </SheetContent>
          </Sheet>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            aria-label="Търсене (Ctrl+K)"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openDrawer}
            aria-label={`Количка с ${cartItemsCount} артикула`}
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <CartIcon />
          </Button>

          {/* User Dropdown - Replace with Makerkit UserDropdown */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Потребителски профил"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">У</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Order Drawer */}
      <OrderDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => open ? openDrawer() : closeDrawer()}
      />
    </header>
  )
} 