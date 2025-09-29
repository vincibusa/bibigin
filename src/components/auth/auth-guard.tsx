'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  message?: string
}

export function AuthGuard({ 
  children, 
  redirectTo = '/auth/login',
  message = 'Devi essere autenticato per accedere a questa pagina'
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Save the intended destination
      sessionStorage.setItem('redirectAfterLogin', pathname)
    }
  }, [user, loading, pathname])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary">Verificando autenticazione...</p>
        </div>
      </div>
    )
  }

  // Show login required message
  if (!user) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <CardTitle className="text-2xl font-playfair text-secondary">
                Accesso Richiesto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-secondary/80">
                {message}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(redirectTo)}
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Accedi
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth/register')}
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                >
                  Registrati
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="w-full text-secondary/70 hover:text-secondary"
                >
                  Torna alla Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}