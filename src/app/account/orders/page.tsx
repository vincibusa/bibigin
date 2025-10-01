'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Calendar, Euro } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { Header, Footer } from '@/components/bibigin'
import { useOrders } from '@/hooks/use-orders'
import { Order } from '@/lib/types'

function OrdersContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders, loading } = useOrders(user?.id || '')

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      shipped: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
      delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-500 border-red-500/30'
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    }
    return icons[status] || Clock
  }

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'In Attesa',
      confirmed: 'Confermato',
      processing: 'In Preparazione',
      shipped: 'Spedito',
      delivered: 'Consegnato',
      cancelled: 'Annullato'
    }
    return labels[status] || status
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient flex flex-col">
      <Header cartItemsCount={0} />

      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.push('/account')}
                className="text-secondary hover:text-gold mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna all'Account
              </Button>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gold mb-2">
                    I Miei Ordini
                  </h1>
                  <p className="text-secondary/80">
                    Traccia e gestisci i tuoi acquisti
                  </p>
                </div>
                <Package className="w-12 h-12 text-gold/30" />
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Caricamento ordini...</p>
              </div>
            ) : orders.length === 0 ? (
              <Card className="bg-navy/40 backdrop-blur-md border-gold/30">
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-playfair text-xl font-bold text-gold mb-2">
                    Nessun ordine trovato
                  </h3>
                  <p className="text-secondary/70 mb-6">
                    Non hai ancora effettuato ordini. Scopri i nostri prodotti!
                  </p>
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                  >
                    Vai allo Shop
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-navy/40 backdrop-blur-md border-gold/30 hover:border-gold hover:shadow-lg hover:shadow-gold/10 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gold" />
                              </div>
                              <div>
                                <CardTitle className="text-gold text-lg">
                                  Ordine #{order.id.slice(-8).toUpperCase()}
                                </CardTitle>
                                <p className="text-xs text-secondary/60 flex items-center mt-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(order.createdAt).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={`${getStatusColor(order.status)} border px-3 py-1`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Separator className="bg-gold/20 mb-4" />

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            {order.items.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between py-2"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 object-cover rounded"
                                      onError={(e) => {
                                        e.currentTarget.src = '/logo.png'
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-secondary font-medium text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-secondary/60 text-xs">
                                      Quantità: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-gold font-semibold">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>

                          <Separator className="bg-gold/20 mb-4" />

                          {/* Order Summary */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-secondary/70 text-sm">
                                Indirizzo di spedizione:
                              </p>
                              <p className="text-secondary text-sm font-medium">
                                {order.shipping.street}, {order.shipping.city}
                              </p>
                              <p className="text-secondary text-sm">
                                {order.shipping.postalCode}, {order.shipping.country}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-secondary/70 text-sm mb-1">
                                Totale Ordine
                              </p>
                              <p className="text-2xl font-bold text-gold flex items-center justify-end">
                                <Euro className="w-5 h-5 mr-1" />
                                {order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button
                            onClick={() => router.push(`/account/orders/${order.id}`)}
                            variant="outline"
                            className="w-full mt-4 border-gold/30 text-gold hover:bg-gold/10 hover:border-gold"
                          >
                            Vedi Dettagli
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <AuthGuard message="Devi essere autenticato per visualizzare i tuoi ordini">
      <OrdersContent />
    </AuthGuard>
  )
}