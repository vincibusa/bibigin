'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuth } from '@/contexts/auth-context'

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { signIn, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/'
      sessionStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    }
  }, [isAuthenticated, authLoading, router])

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await signIn(data.email, data.password)
      
      // Redirect will be handled by useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il login')
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center p-4">
      <motion.div
        {...fadeInUp}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-secondary hover:text-gold p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Homepage
          </Button>
        </div>

        <Card className="bg-card/10 backdrop-blur-sm border-secondary/20">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl font-playfair font-bold text-gold">B</span>
            </div>
            
            <div>
              <CardTitle className="text-3xl font-playfair text-secondary">
                Benvenuto
              </CardTitle>
              <p className="text-secondary/70 mt-2">
                Accedi al tuo account BibiGin
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="la-tua-email@esempio.com"
                  className="bg-card/50 border-secondary/30 text-secondary"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-secondary">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="La tua password"
                    className="bg-card/50 border-secondary/30 text-secondary pr-10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-secondary/70" />
                    ) : (
                      <Eye className="w-4 h-4 text-secondary/70" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin mr-2"></div>
                    Accesso in corso...
                  </div>
                ) : (
                  'Accedi'
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-secondary/70 text-sm">
                  Non hai un account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/register')}
                    className="text-gold hover:underline font-medium"
                  >
                    Registrati
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}