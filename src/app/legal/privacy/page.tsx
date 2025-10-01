'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      {/* Header */}
      <div className="border-b border-secondary/20 bg-navy/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-secondary hover:text-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl">
          <iframe
            src="/legal/privacy-policy.html"
            title="Privacy Policy"
            className="w-full border-0 rounded-lg"
            style={{ minHeight: '80vh' }}
          />
        </div>
      </motion.div>
    </div>
  )
}