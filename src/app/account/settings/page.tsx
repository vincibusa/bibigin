'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Phone, Save, Shield, Calendar, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { Header, Footer } from '@/components/bibigin'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const settingsSchema = z.object({
  firstName: z.string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(50, 'Il nome non può superare i 50 caratteri'),
  lastName: z.string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(50, 'Il cognome non può superare i 50 caratteri'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s]{10,}$/.test(val), {
      message: 'Numero di telefono non valido'
    })
})

type SettingsFormData = z.infer<typeof settingsSchema>

function SettingsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: ''
    }
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data: SettingsFormData) => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      // Update customer document in Firestore
      await updateDoc(doc(db, 'customers', user.id), {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        updatedAt: new Date()
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Update error:', err)
      setError('Errore durante l\'aggiornamento dei dati')
    } finally {
      setIsLoading(false)
    }
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
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
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
                    Impostazioni Account
                  </h1>
                  <p className="text-secondary/80">
                    Gestisci le informazioni del tuo account
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <Card className="bg-navy/40 backdrop-blur-md border-gold/30 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gold">
                  <User className="w-5 h-5 mr-2" />
                  Informazioni Personali
                </CardTitle>
                <CardDescription className="text-secondary/70">
                  Aggiorna i tuoi dati personali. Questi dati verranno utilizzati per la spedizione degli ordini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-secondary">
                        Nome *
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
                        Cognome *
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

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-secondary">
                      Telefono (opzionale)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+39 123 456 7890"
                      className="bg-card/50 border-secondary/30 text-secondary"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                    <p className="text-xs text-secondary/60">
                      Numero di telefono per eventuali comunicazioni sulla spedizione
                    </p>
                  </div>

                  {/* Success/Error Messages */}
                  {success && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <p className="text-green-500 text-sm font-medium">
                        Dati aggiornati con successo!
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                      <p className="text-red-500 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin mr-2"></div>
                        Salvataggio...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Salva Modifiche
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card className="bg-navy/40 backdrop-blur-md border-gold/30 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gold">
                  <Mail className="w-5 h-5 mr-2" />
                  Informazioni Account
                </CardTitle>
                <CardDescription className="text-secondary/70">
                  Informazioni del tuo account BibiGin (sola lettura)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-gold/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-xs text-secondary/70">Email</p>
                      <p className="text-secondary font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      user?.emailVerified
                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                    }
                  >
                    {user?.emailVerified ? 'Verificata' : 'Non Verificata'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-gold/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-xs text-secondary/70">Membro dal</p>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Acceptance Card */}
            <Card className="bg-navy/40 backdrop-blur-md border-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center text-gold">
                  <Shield className="w-5 h-5 mr-2" />
                  Accettazioni Legali
                </CardTitle>
                <CardDescription className="text-secondary/70">
                  Documenti accettati durante la registrazione
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-secondary text-sm">Termini e Condizioni</span>
                  </div>
                  <a
                    href="/legal/terms"
                    target="_blank"
                    className="text-gold text-xs hover:underline"
                  >
                    Visualizza
                  </a>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-secondary text-sm">Privacy Policy</span>
                  </div>
                  <a
                    href="/legal/privacy"
                    target="_blank"
                    className="text-gold text-xs hover:underline"
                  >
                    Visualizza
                  </a>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-secondary text-sm">Maggiore Età (18+)</span>
                  </div>
                  <span className="text-gold text-xs">🔞 Confermato</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard message="Devi essere autenticato per accedere alle impostazioni">
      <SettingsContent />
    </AuthGuard>
  )
}