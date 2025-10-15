'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuth } from '@/contexts/auth-context'

// Register form schema
const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(50, 'Il nome non può superare i 50 caratteri'),
  lastName: z.string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(50, 'Il cognome non può superare i 50 caratteri'),
  email: z.string()
    .email('Inserisci un indirizzo email valido'),
  password: z.string()
    .min(6, 'La password deve essere di almeno 6 caratteri')
    .regex(/(?=.*[0-9])/, 'La password deve contenere almeno un numero'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean()
    .refine((val) => val === true, {
      message: 'Devi accettare i Termini e Condizioni'
    }),
  acceptPrivacy: z.boolean()
    .refine((val) => val === true, {
      message: 'Devi accettare la Privacy Policy'
    }),
  acceptAge: z.boolean()
    .refine((val) => val === true, {
      message: 'Devi confermare di avere almeno 18 anni'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.acceptTerms,
        data.acceptPrivacy,
        data.acceptAge
      )

      // Redirect will be handled by useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la registrazione')
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
      setError(err instanceof Error ? err.message : 'Errore durante la registrazione con Google')
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
                Registrazione
              </CardTitle>
              <p className="text-secondary/70 mt-2">
                Crea il tuo account BibiGin
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
                    Registrazione in corso...
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-secondary">
                    Nome
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Mario"
                    className="bg-card/50 border-secondary/30 text-secondary"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-secondary">
                    Cognome
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Rossi"
                    className="bg-card/50 border-secondary/30 text-secondary"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
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
                    placeholder="Almeno 6 caratteri con un numero"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-secondary">
                  Conferma Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ripeti la password"
                    className="bg-card/50 border-secondary/30 text-secondary pr-10"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-secondary/70" />
                    ) : (
                      <Eye className="w-4 h-4 text-secondary/70" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-4 pt-2 border-t border-secondary/20">
                {/* Age Confirmation */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptAge"
                    className="mt-1 h-4 w-4 text-gold focus:ring-gold border-secondary/30 rounded"
                    {...register('acceptAge')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="acceptAge" className="text-sm text-secondary cursor-pointer font-semibold">
                      🔞 Dichiaro di avere almeno 18 anni *
                    </Label>
                    <p className="text-xs text-secondary/60 mt-1">
                      La vendita di bevande alcoliche è vietata ai minori
                    </p>
                    {errors.acceptAge && (
                      <p className="text-red-500 text-xs mt-1">{errors.acceptAge.message}</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    className="mt-1 h-4 w-4 text-gold focus:ring-gold border-secondary/30 rounded"
                    {...register('acceptTerms')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="acceptTerms" className="text-sm text-secondary cursor-pointer">
                      Accetto i{' '}
                      <a
                        href="/legal/terms"
                        target="_blank"
                        className="text-gold hover:underline font-semibold"
                      >
                        Termini e Condizioni
                      </a>{' '}
                      *
                    </Label>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    className="mt-1 h-4 w-4 text-gold focus:ring-gold border-secondary/30 rounded"
                    {...register('acceptPrivacy')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="acceptPrivacy" className="text-sm text-secondary cursor-pointer">
                      Accetto la{' '}
                      <a
                        href="/legal/privacy"
                        target="_blank"
                        className="text-gold hover:underline font-semibold"
                      >
                        Privacy Policy
                      </a>{' '}
                      e autorizzo il trattamento dei miei dati personali *
                    </Label>
                    {errors.acceptPrivacy && (
                      <p className="text-red-500 text-xs mt-1">{errors.acceptPrivacy.message}</p>
                    )}
                  </div>
                </div>
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
                    Registrazione in corso...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crea Account
                  </div>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-secondary/70 text-sm">
                  Hai già un account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="text-gold hover:underline font-medium"
                  >
                    Accedi
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