'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Menu, User, Package, Settings, LogOut, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth-context'

interface HeaderProps {
  cartItemsCount?: number
  onCartOpen?: () => void
}

export function Header({ cartItemsCount = 0, onCartOpen }: HeaderProps) {
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navItems = [
    { name: 'Il Gin', href: '#product' },
    { name: 'Storia', href: '#story' },
    { name: 'Contatti', href: '#contact' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.firstName?.charAt(0) || ''
    const lastInitial = user.lastName?.charAt(0) || ''
    return (firstInitial + lastInitial).toUpperCase() || 'U'
  }

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
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* User Menu */}
          {isAuthenticated ? (
            <HoverCard open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-0 w-10 h-10 rounded-full hover:bg-gold/20 transition-all duration-300"
                >
                  <Avatar className="w-10 h-10 border-2 border-gold/30 hover:border-gold transition-all duration-300">
                    <AvatarFallback className="bg-gold/20 text-gold font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                className="w-64 bg-navy/95 backdrop-blur-md border-gold/30 text-secondary p-0 overflow-hidden"
                align="end"
              >
                {/* User Info */}
                <div className="p-4 bg-gold/10">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-gold">
                      <AvatarFallback className="bg-gold text-navy font-bold text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-secondary/70 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gold/20" />

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      router.push('/account')
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Il Mio Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      router.push('/account/orders')
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>I Miei Ordini</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      router.push('/account/settings')
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Impostazioni</span>
                  </button>
                </div>

                <Separator className="bg-gold/20" />

                {/* Logout */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      handleSignOut()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Esci</span>
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/auth/login')}
              className="text-cream hover:text-gold hover:bg-gold/10 transition-all duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Accedi</span>
            </Button>
          )}

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