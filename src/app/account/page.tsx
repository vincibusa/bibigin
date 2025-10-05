'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Settings, Calendar, Mail, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { Header, Footer } from '@/components/bibigin'

function AccountContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [recentOrders] = useState(0)

  const getUserInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.firstName?.charAt(0) || ''
    const lastInitial = user.lastName?.charAt(0) || ''
    return (firstInitial + lastInitial).toUpperCase() || 'U'
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const quickActions = [
    {
      title: 'I Miei Ordini',
      description: 'Traccia i tuoi acquisti',
      icon: Package,
      href: '/account/orders',
      color: 'gold'
    },
    {
      title: 'Indirizzi',
      description: 'Gestisci le tue spedizioni',
      icon: MapPin,
      href: '/account/addresses',
      color: 'gold'
    },
    {
      title: 'Impostazioni',
      description: 'Modifica i tuoi dati',
      icon: Settings,
      href: '/account/settings',
      color: 'gold'
    }
  ]

  return (
    <div className="min-h-screen bg-cosmic-gradient flex flex-col">
      <Header cartItemsCount={0} />

      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <Card className="bg-navy/40 backdrop-blur-md border-gold/30 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <Avatar className="w-24 h-24 border-4 border-gold shadow-lg shadow-gold/20">
                      <AvatarFallback className="bg-gold text-navy font-bold text-3xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gold mb-2">
                        Benvenuto, {user?.firstName}!
                      </h1>
                      <p className="text-secondary/80 text-lg mb-4">
                        Gestisci il tuo account e monitora i tuoi ordini
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gold">{recentOrders}</div>
                          <div className="text-xs text-secondary/70">Ordini Totali</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gold">
                            {user?.emailVerified ? '✓' : '✗'}
                          </div>
                          <div className="text-xs text-secondary/70">Email Verificata</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gold">
                            {user?.createdAt ? new Date(user.createdAt).getFullYear() : '-'}
                          </div>
                          <div className="text-xs text-secondary/70">Membro Dal</div>
                        </div>
                      </div>
                    </div>

                    {/* Account Badge */}
                    <div className="hidden lg:block">
                      <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2 text-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Account Verificato
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-bold text-gold mb-4">
                Azioni Rapide
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      onClick={() => router.push(action.href)}
                      className="bg-navy/40 backdrop-blur-md border-gold/30 hover:border-gold hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 cursor-pointer group"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-all">
                            <action.icon className="w-6 h-6 text-gold" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gold group-hover:text-gold/90 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-secondary/70">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-navy/40 backdrop-blur-md border-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gold">
                      <User className="w-5 h-5 mr-2" />
                      Informazioni Personali
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center text-secondary/70 text-sm mb-1">
                        <User className="w-4 h-4 mr-2" />
                        Nome Completo
                      </div>
                      <p className="text-secondary font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>

                    <Separator className="bg-gold/20" />

                    <div>
                      <div className="flex items-center text-secondary/70 text-sm mb-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </div>
                      <p className="text-secondary font-medium">
                        {user?.email}
                      </p>
                    </div>

                    <Separator className="bg-gold/20" />

                    <div>
                      <div className="flex items-center text-secondary/70 text-sm mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Membro Dal
                      </div>
                      <p className="text-secondary font-medium">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>

                    <Button
                      onClick={() => router.push('/account/settings')}
                      className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold mt-4"
                    >
                      Modifica Dati
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-navy/40 backdrop-blur-md border-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gold">
                      <Package className="w-5 h-5 mr-2" />
                      Attività Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentOrders === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                        <p className="text-secondary/70 mb-4">
                          Non hai ancora effettuato ordini
                        </p>
                        <Button
                          onClick={() => router.push('/')}
                          variant="outline"
                          className="border-gold/30 text-gold hover:bg-gold/10"
                        >
                          Scopri i Prodotti
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Order items would go here */}
                        <p className="text-secondary/70 text-center py-4">
                          Caricamento ordini...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function AccountPage() {
  return (
    <AuthGuard message="Devi essere autenticato per accedere al tuo account">
      <AccountContent />
    </AuthGuard>
  )
}