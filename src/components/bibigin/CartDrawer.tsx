'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Minus, Plus, X, ShoppingBag, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { calculateShippingCost } from '@/lib/shipping'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const shippingCost = calculateShippingCost(totalItems)
  const totalPrice = subtotal + shippingCost

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] bg-navy/95 backdrop-blur-md border-secondary/20 text-secondary px-6"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center space-x-2 text-secondary">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <span className="font-playfair text-xl">Carrello</span>
            {totalItems > 0 && (
              <Badge className="bg-gold text-navy border-0">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-secondary/70">
            {totalItems === 0 ? 'Il tuo carrello è vuoto' : `${totalItems} ${totalItems === 1 ? 'prodotto' : 'prodotti'} nel carrello`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <motion.div 
            {...fadeInUp}
            className="flex flex-col items-center justify-center h-96 space-y-6"
          >
            <div className="text-6xl opacity-50">🛒</div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-secondary">
                Il tuo carrello è vuoto
              </h3>
              <p className="text-secondary/70">
                Aggiungi BibiGin per iniziare il tuo viaggio celestiale
              </p>
            </div>
            <Button 
              onClick={onClose}
              className="bg-gold hover:bg-gold/90 text-navy"
            >
              Continua lo Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card/10 backdrop-blur-sm border border-secondary/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-20 bg-gradient-to-b from-secondary/20 to-secondary/40 rounded-lg overflow-hidden border border-secondary/30">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">🍶</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-secondary">{item.name}</h3>
                          <p className="text-sm text-secondary/70">750ml - 43° Vol.</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-secondary/50 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 p-0 border-secondary/30 text-secondary hover:bg-gold/10 hover:border-gold"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium text-secondary">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 border-secondary/30 text-secondary hover:bg-gold/10 hover:border-gold"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gold">€{item.price}</div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-secondary/70">
                              €{item.price * item.quantity} totale
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator className="my-6 bg-secondary/20" />

            {/* Order Summary */}
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-secondary">
                  <span>Subtotale</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-secondary/70">
                  <span>Spedizione ({totalItems} {totalItems === 1 ? 'bottiglia' : 'bottiglie'})</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
                <Separator className="bg-secondary/20" />
                <div className="flex items-center justify-between text-lg font-bold text-secondary">
                  <span>Totale</span>
                  <span className="text-gold">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-navy/10 border border-navy/30 rounded-lg p-3">
                <p className="text-sm text-secondary/80">
                  🚚 Spedizione in tutta Italia - Consegna in 5-7 giorni lavorativi
                </p>
              </div>

              {/* Checkout Button */}
              <Button 
                onClick={onCheckout}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-4 text-lg transition-all duration-300 hover:scale-105"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Procedi al Checkout
              </Button>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-xs text-secondary/50 mb-2">Metodi di pagamento sicuri</p>
                <div className="flex justify-center space-x-2">
                  <span className="text-lg">💳</span>
                  <span className="text-lg">🍎</span>
                  <span className="text-lg">📱</span>
                  <span className="text-lg">🔒</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}