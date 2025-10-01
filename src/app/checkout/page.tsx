'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { AuthGuard } from '@/components/auth/auth-guard'

import { useAuth } from '@/contexts/auth-context'
import { useCreateOrder, useOrderCalculations } from '@/hooks/use-orders'
import { CartItem } from '@/lib/types'
import { checkoutFormSchema, CheckoutFormData, defaultCheckoutForm } from '@/lib/validation-checkout'
import { sendOrderEmails } from '@/lib/email-api'

function CheckoutContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { createNewOrder, loading, error, clearError } = useCreateOrder()
  const { calculateTotals } = useOrderCalculations()

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('bibigin-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        setCartItems(items)
      } catch (error) {
        console.error('Error loading cart:', error)
        router.push('/')
      }
    } else {
      // No cart items, redirect to home
      router.push('/')
    }
  }, [router])

  // Form setup with user email pre-filled
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      ...defaultCheckoutForm,
      email: user?.email || ''
    }
  })

  // Set email when user is loaded
  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email)
    }
  }, [user, setValue])

  // Calculate order totals
  const { subtotal, shipping_cost, total } = calculateTotals(cartItems)

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      clearError()
      
      if (!user?.id) {
        throw new Error('Utente non autenticato')
      }
      
      const orderId = await createNewOrder(
        cartItems,
        data.shipping,
        data.email,
        user.id,
        data.notes
      )

      // Send order confirmation and admin notification emails
      try {
        await sendOrderEmails({
          orderId,
          customer: {
            firstName: data.shipping.firstName,
            lastName: data.shipping.lastName,
            email: data.email,
            phone: data.shipping.phone
          }
        })
        console.log('Order emails sent successfully')
      } catch (emailError) {
        // Don't fail the whole checkout if emails fail
        console.error('Failed to send order emails:', emailError)
      }

      // Clear cart from localStorage
      localStorage.removeItem('bibigin-cart')
      
      // Redirect to success page
      router.push(`/checkout/success?order=${orderId}`)
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Caricamento checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      {/* Header */}
      <div className="border-b border-secondary/20 bg-navy/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-secondary hover:text-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna al carrello
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-playfair font-bold text-secondary">
                Checkout
              </h1>
            </div>
            <Badge variant="outline" className="border-gold text-gold">
              <Shield className="w-4 h-4 mr-1" />
              Pagamento sicuro
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <motion.div {...fadeInUp} className="lg:order-2">
            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Riepilogo Ordine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary">{item.name}</h4>
                      <p className="text-sm text-secondary/70">Quantità: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotale</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      Spedizione
                    </span>
                    <span>€{shipping_cost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-secondary">
                    <span>Totale</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-gold/10 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-secondary/80">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Pagamento: Bonifico bancario (dettagli via email)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Checkout Form */}
          <motion.div {...fadeInUp} className="lg:order-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-secondary">Informazioni di Contatto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-secondary">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="la-tua-email@esempio.com"
                      className="bg-card/50 border-secondary/30 text-secondary cursor-not-allowed"
                      readOnly
                      {...register('email')}
                    />
                    <p className="text-xs text-secondary/60 mt-1">
                      Email dell'account utilizzato per l'accesso
                    </p>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-secondary">Indirizzo di Spedizione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-secondary">Nome *</Label>
                      <Input
                        id="firstName"
                        placeholder="Mario"
                        className="bg-card/50 border-secondary/30 text-secondary"
                        {...register('shipping.firstName')}
                      />
                      {errors.shipping?.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.shipping.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-secondary">Cognome *</Label>
                      <Input
                        id="lastName"
                        placeholder="Rossi"
                        className="bg-card/50 border-secondary/30 text-secondary"
                        {...register('shipping.lastName')}
                      />
                      {errors.shipping?.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.shipping.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="street" className="text-secondary">Indirizzo *</Label>
                    <Input
                      id="street"
                      placeholder="Via Roma, 123"
                      className="bg-card/50 border-secondary/30 text-secondary"
                      {...register('shipping.street')}
                    />
                    {errors.shipping?.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-secondary">Città *</Label>
                      <Input
                        id="city"
                        placeholder="Milano"
                        className="bg-card/50 border-secondary/30 text-secondary"
                        {...register('shipping.city')}
                      />
                      {errors.shipping?.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.shipping.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-secondary">CAP *</Label>
                      <Input
                        id="postalCode"
                        placeholder="20100"
                        className="bg-card/50 border-secondary/30 text-secondary"
                        {...register('shipping.postalCode')}
                      />
                      {errors.shipping?.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.shipping.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-secondary">Telefono</Label>
                    <Input
                      id="phone"
                      placeholder="+39 123 456 7890"
                      className="bg-card/50 border-secondary/30 text-secondary"
                      {...register('shipping.phone')}
                    />
                    {errors.shipping?.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping.phone.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-secondary">Note Aggiuntive</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="notes" className="text-secondary">Note per l'ordine (opzionale)</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Istruzioni speciali per la consegna..."
                    className="w-full mt-1 p-3 bg-card/50 border border-secondary/30 rounded-md text-secondary placeholder:text-secondary/50 focus:border-gold focus:ring-1 focus:ring-gold"
                    {...register('notes')}
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        className="mt-1 h-4 w-4 text-gold focus:ring-gold border-secondary/30 rounded"
                        {...register('acceptTerms')}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm text-secondary cursor-pointer">
                        Accetto i{' '}
                        <a href="/terms" className="text-gold hover:underline">
                          termini e condizioni
                        </a>{' '}
                        *
                      </Label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptPrivacy"
                        className="mt-1 h-4 w-4 text-gold focus:ring-gold border-secondary/30 rounded"
                        {...register('acceptPrivacy')}
                      />
                      <Label htmlFor="acceptPrivacy" className="text-sm text-secondary cursor-pointer">
                        Accetto la{' '}
                        <a href="/privacy" className="text-gold hover:underline">
                          privacy policy
                        </a>{' '}
                        *
                      </Label>
                    </div>
                    {errors.acceptPrivacy && (
                      <p className="text-red-500 text-sm">{errors.acceptPrivacy.message}</p>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
                    >
                      {loading || isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin mr-2"></div>
                          Elaborazione...
                        </div>
                      ) : (
                        `Completa Ordine - €${total.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <AuthGuard message="Devi essere autenticato per procedere al checkout">
      <CheckoutContent />
    </AuthGuard>
  )
}