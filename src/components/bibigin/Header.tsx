'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  cartItemsCount?: number
  onCartOpen?: () => void
}

export function Header({ cartItemsCount = 0, onCartOpen }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Il Gin', href: '#product' },
    { name: 'Storia', href: '#story' },
    { name: 'Contatti', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-navy/10 backdrop-blur-md supports-[backdrop-filter]:bg-navy/10">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="BibiGin Logo"
              width={44}
              height={44}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-playfair text-2xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
            BibiGin
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-cream hover:text-gold transition-all duration-300 group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCartOpen}
            className="relative border-cream/40 text-cream hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-sm"
          >
            <ShoppingBag className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            {cartItemsCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gold text-navy border-0 animate-pulse"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-cream hover:text-gold hover:bg-gold/10 transition-all duration-300"
              >
                <Menu className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[280px] sm:w-[300px] bg-navy/95 backdrop-blur-md border-secondary/20 text-secondary px-6"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-secondary">
                  <Image
                    src="/logo.png"
                    alt="BibiGin Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-playfair text-xl font-bold">
                    BibiGin
                  </span>
                </SheetTitle>
                <SheetDescription className="text-secondary/70">
                  Naviga nel mondo del gin artigianale
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-secondary hover:text-gold transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-gold/10"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}