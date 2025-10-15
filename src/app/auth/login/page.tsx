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
  const { signIn, signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
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

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)
      
      await signInWithGoogle()
      
      // Redirect will be handled by useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il login con Google')
    } finally {
      setIsGoogleLoading(false)
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
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 border border-gray-300 transition-all duration-300 hover:scale-105"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Accesso in corso...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continua con Google
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-secondary/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/10 px-2 text-secondary/70">Oppure</span>
                </div>
              </div>

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