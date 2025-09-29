'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Hero, ProductShowcase, Story, Reviews, CartDrawer, Footer } from '@/components/bibigin'
import { useMainProduct } from '@/hooks/use-products'
import { getProductDisplayInfo } from '@/lib/products'
import { useAuth } from '@/contexts/auth-context'
import { CartItem } from '@/lib/types'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Load main product from database
  const { product, loading, error, isAvailable } = useMainProduct()

  const handleAddToCart = () => {
    if (!product || !isAvailable) return
    
    const productInfo = getProductDisplayInfo(product)
    const newItem: CartItem = {
      id: `cart-${product.id}`,
      productId: product.id,
      name: productInfo.name,
      price: productInfo.price,
      quantity: 1,
      image: productInfo.image
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, newItem]
    })
  }

  const handleCartOpen = () => {
    setIsCartOpen(true)
  }

  const handleCartClose = () => {
    setIsCartOpen(false)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Il carrello è vuoto!')
      return
    }
    
    if (!isAuthenticated) {
      // Save cart to localStorage before redirecting to login
      localStorage.setItem('bibigin-cart', JSON.stringify(cartItems))
      
      // Save intended destination
      sessionStorage.setItem('redirectAfterLogin', '/checkout')
      
      // Close cart drawer
      setIsCartOpen(false)
      
      // Navigate to login
      router.push('/auth/login')
      return
    }
    
    // Save cart to localStorage for checkout page
    localStorage.setItem('bibigin-cart', JSON.stringify(cartItems))
    
    // Close cart drawer
    setIsCartOpen(false)
    
    // Navigate to checkout
    router.push('/checkout')
  }

  const handleScrollToProduct = () => {
    const productElement = document.getElementById('product')
    productElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary">Caricamento BibiGin...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90"
          >
            Riprova
          </button>
        </div>
      </div>
    )
  }

  // Show not available state
  if (!product || !isAvailable) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-secondary">🍶 Prodotto non disponibile al momento</p>
          <p className="text-secondary/70">Torna presto per gustare BibiGin!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header 
        cartItemsCount={totalItems} 
        onCartOpen={handleCartOpen} 
      />
      <main className="lg:-mt-20">
        <Hero 
          product={product}
          onAddToCart={handleAddToCart}
          onScrollToProduct={handleScrollToProduct}
          isAvailable={isAvailable}
        />
        <ProductShowcase 
          product={product}
          onAddToCart={handleAddToCart} 
          isAvailable={isAvailable}
        />
        <Story />
        <Reviews />
      </main>
      <Footer />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCartClose}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </>
  )
}
