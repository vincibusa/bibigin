'use client'

import { useState } from 'react'
import { Header, Hero, ProductShowcase, Story, Reviews, CartDrawer, Footer } from '@/components/bibigin'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: 'bibigin-750ml',
      name: 'BibiGin - Gin delle Fasi Lunari',
      price: 89,
      quantity: 1,
      image: '/logo.png'
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id 
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
    // TODO: Implement checkout logic
    console.log('Proceed to checkout with items:', cartItems)
    alert('Funzionalità checkout in arrivo! 🚀')
  }

  const handleScrollToProduct = () => {
    const productElement = document.getElementById('product')
    productElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Header 
        cartItemsCount={totalItems} 
        onCartOpen={handleCartOpen} 
      />
      <main className="lg:-mt-20">
        <Hero 
          onAddToCart={handleAddToCart}
          onScrollToProduct={handleScrollToProduct}
        />
        <ProductShowcase onAddToCart={handleAddToCart} />
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
