'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, CreditCard, Clock, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { useOrder } from '@/hooks/use-orders'
import { formatOrderNumber, getEstimatedDelivery } from '@/lib/orders'

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  
  const { order, loading, error, fetchOrder } = useOrder()

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    } else {
      // No order ID, redirect to home
      router.push('/')
    }
  }, [orderId, fetchOrder, router])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary">Caricamento dettagli ordine...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-playfair font-bold text-secondary">
            Errore nel caricamento
          </h1>
          <p className="text-secondary/70">
            {error || 'Ordine non trovato'}
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gold hover:bg-gold/90 text-navy"
          >
            Torna alla Homepage
          </Button>
        </div>
      </div>
    )
  }

  const estimatedDelivery = getEstimatedDelivery()

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Success Header */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-secondary mb-4">
              Ordine Confermato!
            </h1>
            <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
              Grazie per il tuo acquisto. Il tuo ordine è stato ricevuto e sarà processato a breve.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Order Summary */}
            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary">
                  <Package className="w-5 h-5 mr-2" />
                  Dettagli Ordine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Numero Ordine:</span>
                  <Badge variant="outline" className="border-gold text-gold font-mono">
                    {formatOrderNumber(order.id)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Data:</span>
                  <span className="text-secondary">
                    {order.createdAt.toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondary/70">Email:</span>
                  <span className="text-secondary">{order.customerEmail}</span>
                </div>

                <Separator />

                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary">{item.name}</p>
                      <p className="text-sm text-secondary/70">Quantità: {item.quantity}</p>
                    </div>
                    <div className="text-secondary font-semibold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotale:</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Spedizione:</span>
                    <span>€{order.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary">
                    <span>Totale:</span>
                    <span>€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Informazioni Spedizione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-secondary/70 text-sm">Indirizzo di consegna:</p>
                  <div className="text-secondary">
                    <p className="font-medium">
                      {order.shipping?.firstName || 'N/A'} {order.shipping?.lastName || ''}
                    </p>
                    <p>{order.shipping?.street || order.shippingAddress?.street || 'N/A'}</p>
                    <p>
                      {order.shipping?.postalCode || order.shippingAddress?.postalCode || 'N/A'} {order.shipping?.city || order.shippingAddress?.city || 'N/A'}
                    </p>
                    <p>{order.shipping?.country || order.shippingAddress?.country || 'N/A'}</p>
                    {(order.shipping?.phone || order.billing?.phone) && (
                      <p className="text-secondary/70 text-sm mt-1">
                        Tel: {order.shipping?.phone || order.billing?.phone}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Consegna stimata:</p>
                    <p className="text-sm text-secondary/70">{estimatedDelivery}</p>
                  </div>
                </div>

                <div className="bg-navy/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-secondary mb-2">Metodo di Pagamento</h4>
                  <p className="text-sm text-secondary/80">
                    <strong>Bonifico Bancario</strong>
                  </p>
                  <p className="text-sm text-secondary/70 mt-1">
                    Riceverai le istruzioni per il pagamento via email entro pochi minuti.
                  </p>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-secondary/70 text-sm">Note ordine:</p>
                    <p className="text-secondary text-sm bg-secondary/5 p-3 rounded-lg">
                      {order.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
              <CardHeader>
                <CardTitle className="text-secondary">Prossimi Passi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-gold">1</span>
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">Conferma Email</h3>
                    <p className="text-sm text-secondary/70">
                      Riceverai una email di conferma con i dettagli dell&apos;ordine e le istruzioni per il pagamento.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-gold">2</span>
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">Effettua Pagamento</h3>
                    <p className="text-sm text-secondary/70">
                      Completa il bonifico bancario utilizzando i dati forniti nella email.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-gold">3</span>
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">Spedizione</h3>
                    <p className="text-sm text-secondary/70">
                      Una volta confermato il pagamento, spediremo il tuo BibiGin entro 24-48 ore.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => router.push('/')}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-3 transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Torna alla Homepage
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-3"
            >
              Stampa Ricevuta
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary">Caricamento...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}