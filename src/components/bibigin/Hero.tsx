'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'

interface HeroProps {
  product: Product
  onAddToCart?: () => void
  onScrollToProduct?: () => void
  isAvailable?: boolean
}

export function Hero({ product, onAddToCart, onScrollToProduct, isAvailable = true }: HeroProps) {
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

  // Generate deterministic star positions to avoid hydration mismatch
  const generateStarPositions = (count: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      // Use deterministic calculation based on index
      const x = (i * 17 + 23) % 100
      const y = (i * 31 + 47) % 100
      const duration = 2 + (i % 3)
      const delay = (i * 0.3) % 2
      positions.push({ x, y, duration, delay })
    }
    return positions
  }

  const starPositions = generateStarPositions(50)

  return (
    <section className="relative min-h-screen bg-cosmic-gradient overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {starPositions.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-star rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
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
              {product.name}
              <br />
              <span className="text-gold text-3xl md:text-5xl block mt-2">
                Gin delle Fasi Lunari
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-secondary max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {product.description || 'Un gin artigianale premium che cattura l\'essenza delle fasi lunari. Distillato con botanici selezionati sotto il cielo stellato per un sapore celestiale unico.'}
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={onAddToCart}
                disabled={!isAvailable}
                className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAvailable ? `Acquista Ora - €${product.price}` : 'Non Disponibile'}
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
                <div className="text-gold text-2xl font-bold">{product.alcoholContent}°</div>
                <div className="text-secondary/60 text-sm">Vol. Alcolico</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">{product.bottleSize}L</div>
                <div className="text-secondary/60 text-sm">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">{product.stock}</div>
                <div className="text-secondary/60 text-sm">Disponibili</div>
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
            
            {/* Product Bottle Image */}
            <div className="relative w-64 h-96 rounded-lg overflow-hidden backdrop-blur-sm border border-secondary/30">
              {product.imageUrl || (product.images && product.images.length > 0) ? (
                <Image
                  src={product.imageUrl || product.images[0]} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-secondary/20 to-secondary/40 flex items-center justify-center">
                  <div className="text-center text-secondary">
                    <div className="text-6xl mb-4">🍶</div>
                    <div className="text-sm opacity-80">Immagine Bottiglia BibiGin</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}