'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('bibigin-cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    localStorage.setItem('bibigin-cookie-consent', JSON.stringify(consentData))

    // Here you would initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      // Initialize Google Analytics or similar
      console.log('Analytics cookies enabled')
    }
    if (prefs.marketing) {
      // Initialize marketing/advertising scripts
      console.log('Marketing cookies enabled')
    }

    setIsVisible(false)
  }

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    savePreferences(allPreferences)
  }

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false
    })
  }

  const saveCustomPreferences = () => {
    savePreferences(preferences)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40"
            onClick={() => !showSettings && acceptNecessary()}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <Card className="max-w-4xl mx-auto bg-navy/95 backdrop-blur-md border-gold/30 shadow-2xl shadow-gold/20">
              <CardContent className="p-6">
                {!showSettings ? (
                  // Main Banner
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Cookie className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-gold">
                            Utilizziamo i Cookie
                          </h3>
                          <p className="text-sm text-secondary/90 mt-1">
                            Per migliorare la tua esperienza di navigazione
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={acceptNecessary}
                        className="text-secondary/70 hover:text-gold flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-secondary/80 leading-relaxed">
                      Utilizziamo cookie tecnici necessari per il funzionamento del sito
                      (autenticazione, carrello) e cookie analitici per migliorare i nostri
                      servizi. Puoi gestire le tue preferenze o accettare tutti i cookie.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={acceptAll}
                        className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold shadow-lg shadow-gold/20"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accetta Tutti
                      </Button>
                      <Button
                        onClick={acceptNecessary}
                        variant="outline"
                        className="flex-1 border-gold/30 text-secondary hover:bg-gold/10 hover:border-gold"
                      >
                        Solo Necessari
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="flex-1 text-secondary hover:bg-gold/10 hover:text-gold"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Personalizza
                      </Button>
                    </div>

                    <p className="text-xs text-secondary/70 text-center">
                      Consulta la nostra{' '}
                      <a
                        href="/legal/cookies"
                        className="text-gold hover:underline font-semibold"
                        target="_blank"
                      >
                        Cookie Policy
                      </a>{' '}
                      e{' '}
                      <a
                        href="/legal/privacy"
                        className="text-gold hover:underline font-semibold"
                        target="_blank"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                ) : (
                  // Settings Panel
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/30 rounded-full flex items-center justify-center">
                          <Settings className="w-5 h-5 text-gold" />
                        </div>
                        <h3 className="font-playfair text-xl font-bold text-gold">
                          Gestisci Preferenze Cookie
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(false)}
                        className="text-secondary/70 hover:text-gold"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Separator className="bg-gold/20" />

                    {/* Cookie Categories */}
                    <div className="space-y-4">
                      {/* Necessary Cookies */}
                      <div className="flex items-start justify-between gap-4 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gold">
                              Cookie Necessari
                            </h4>
                            <span className="px-2 py-0.5 bg-gold/30 text-gold text-xs rounded-full font-semibold">
                              Sempre Attivi
                            </span>
                          </div>
                          <p className="text-sm text-secondary/80">
                            Essenziali per il funzionamento del sito. Gestiscono
                            autenticazione, carrello e sicurezza. Non possono essere
                            disabilitati.
                          </p>
                        </div>
                        <div className="w-12 h-6 bg-gold rounded-full flex items-center justify-end p-1 cursor-not-allowed opacity-70">
                          <div className="w-4 h-4 bg-navy rounded-full shadow-sm" />
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start justify-between gap-4 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gold mb-2">
                            Cookie Analitici
                          </h4>
                          <p className="text-sm text-secondary/80">
                            Ci aiutano a capire come i visitatori interagiscono con il
                            sito. Raccolgono informazioni anonime per migliorare i nostri
                            servizi (Google Analytics).
                          </p>
                        </div>
                        <button
                          onClick={() => setPreferences(prev => ({
                            ...prev,
                            analytics: !prev.analytics
                          }))}
                          className={`w-12 h-6 rounded-full flex items-center p-1 transition-all ${
                            preferences.analytics
                              ? 'bg-gold justify-end shadow-lg shadow-gold/30'
                              : 'bg-secondary/30 justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 bg-navy rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="flex items-start justify-between gap-4 p-4 bg-gold/5 border border-gold/20 rounded-lg opacity-60">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gold mb-2">
                            Cookie di Marketing
                          </h4>
                          <p className="text-sm text-secondary/80">
                            Utilizzati per tracciare i visitatori e mostrare annunci
                            personalizzati. Attualmente non utilizziamo cookie di marketing.
                          </p>
                        </div>
                        <button
                          onClick={() => setPreferences(prev => ({
                            ...prev,
                            marketing: !prev.marketing
                          }))}
                          className={`w-12 h-6 rounded-full flex items-center p-1 transition-all ${
                            preferences.marketing
                              ? 'bg-gold justify-end'
                              : 'bg-secondary/30 justify-start'
                          }`}
                          disabled
                        >
                          <div className="w-4 h-4 bg-navy rounded-full shadow-sm" />
                        </button>
                      </div>
                    </div>

                    <Separator className="bg-gold/20" />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={saveCustomPreferences}
                        className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold shadow-lg shadow-gold/20"
                      >
                        Salva Preferenze
                      </Button>
                      <Button
                        onClick={() => setShowSettings(false)}
                        variant="outline"
                        className="flex-1 border-gold/30 text-secondary hover:bg-gold/10 hover:border-gold"
                      >
                        Annulla
                      </Button>
                    </div>

                    <p className="text-xs text-secondary/70 text-center">
                      Per maggiori informazioni:{' '}
                      <a
                        href="/legal/cookies"
                        className="text-gold hover:underline font-semibold"
                        target="_blank"
                      >
                        Cookie Policy
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}