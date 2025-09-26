'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onAddToCart?: () => void
  onScrollToProduct?: () => void
}

export function Hero({ onAddToCart, onScrollToProduct }: HeroProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="relative min-h-screen bg-cosmic-gradient overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-star rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-8 text-center lg:text-left"
          >
      


            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-playfair font-bold text-secondary leading-tight"
            >
              BibiGin
              <br />
              <span className="text-gold text-3xl md:text-5xl block mt-2">
                Gin delle Fasi Lunari
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-secondary max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Un gin artigianale premium che cattura l&apos;essenza delle fasi lunari. 
              Distillato con botanici selezionati sotto il cielo stellato per un sapore celestiale unico.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={onAddToCart}
                className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/30"
              >
                Acquista Ora - €89
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onScrollToProduct}
                className="border-secondary text-secondary hover:bg-secondary hover:text-navy px-8 py-4 text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Scopri di Più
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">43°</div>
                <div className="text-secondary/60 text-sm">Vol. Alcolico</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">750ml</div>
                <div className="text-secondary/60 text-sm">Bottiglia</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">12</div>
                <div className="text-secondary/60 text-sm">Botanici</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottle Image */}
          <motion.div 
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gold/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Placeholder for Bottle Image - Replace with actual bottle image */}
            <div className="relative w-64 h-96 bg-gradient-to-b from-secondary/20 to-secondary/40 rounded-lg flex items-center justify-center backdrop-blur-sm border border-secondary/30">
              <div className="text-center text-secondary">
                <div className="text-6xl mb-4">🍶</div>
                <div className="text-sm opacity-80">Immagine Bottiglia BibiGin</div>
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}