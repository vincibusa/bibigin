'use client'

import { motion } from 'framer-motion'
import { Star, Award, Leaf, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Product } from '@/lib/types'

interface ProductShowcaseProps {
  product: Product
  onAddToCart?: () => void
  isAvailable?: boolean
}

export function ProductShowcase({ product, onAddToCart, isAvailable = true }: ProductShowcaseProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  // Generate deterministic star positions
  const generateStarPositions = (count: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const x = (i * 23 + 13) % 100
      const y = (i * 29 + 37) % 100  
      const duration = 3 + (i % 2)
      const delay = (i * 0.4) % 2
      positions.push({ x, y, duration, delay })
    }
    return positions
  }

  const starPositions = generateStarPositions(30)

  // Use botanicals from product or fallback to default
  const botanicals = product.botanicals || [
    'Ginepro Toscano', 'Coriandolo', 'Angelica', 'Iris',
    'Cardamomo', 'Cannella', 'Scorza di Limone', 'Lavanda',
    'Rosmarino', 'Timo', 'Bacche di Rosa', 'Stelle Alpine'
  ]

  // Use tasting notes from product or fallback to default
  const tastingNotes = product.tastingNotes || [
    { phase: 'Luna Nuova', note: 'Note fresche di ginepro e agrumi' },
    { phase: 'Primo Quarto', note: 'Spezie delicate, coriandolo e cardamomo' },
    { phase: 'Luna Piena', note: 'Complessità erbacea, lavanda e rosmarino' },
    { phase: 'Ultimo Quarto', note: 'Finale persistente con iris e bacche di rosa' }
  ]

  return (
    <section id="product" className="py-20 bg-cosmic-gradient relative overflow-hidden">
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
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
          {/* Product Image */}
          <motion.div 
            className="sticky top-24"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Main Product Image */}
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-secondary/30 backdrop-blur-sm">
                {product.imageUrl || (product.images && product.images.length > 0) ? (
                  <img 
                    src={product.imageUrl || product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-secondary/20 to-secondary/40 flex items-center justify-center">
                    <div className="text-center text-secondary">
                      <div className="text-8xl mb-4">🍶</div>
                      <div className="text-lg">BibiGin - Bottiglia Premium</div>
                      <div className="text-sm opacity-70">Gin delle Fasi Lunari</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4">
                <Badge className="bg-gold text-navy px-4 py-2 text-sm font-semibold border-0">
                  <Award className="w-4 h-4 mr-2" />
                  Edizione Limitata
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-secondary">
                {product.name}
                <span className="block text-2xl text-gold font-medium mt-2">
                  Gin delle Fasi Lunari
                </span>
              </h2>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-sm text-secondary/70">(47 recensioni)</span>
              </div>

              <p className="text-lg text-secondary leading-relaxed">
                {product.description || "Un gin artigianale premium che cattura l'essenza delle fasi lunari attraverso una selezione di 12 botanici pregiati, distillati con metodi tradizionali sotto il cielo stellato toscano."}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-4">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-secondary">€{product.price}</span>
              </div>
              
              <Button 
                size="lg" 
                onClick={onAddToCart}
                disabled={!isAvailable}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAvailable ? 'Aggiungi al Carrello' : 'Non Disponibile'}
              </Button>
            </div>

            <Separator />

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, label: 'Stock', value: `${product.stock} disponibili` },
                { icon: Leaf, label: 'Volume', value: `${product.bottleSize}L` },
                { icon: Award, label: 'Peso', value: `${product.weight}kg` },
                { icon: Star, label: 'Gradazione', value: `${product.alcoholContent}° Vol.` }
              ].map((feature, idx) => (
                <motion.div
                  key={feature.label}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center space-x-3"
                >
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">{feature.value}</div>
                    <div className="text-sm text-secondary">{feature.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator />



          

            {/* Tasting Notes */}
            <div>
              <h3 className="text-xl font-playfair font-semibold text-secondary mb-6">
                Note di Degustazione
              </h3>
              <div className="space-y-4">
                {tastingNotes.map((note, idx) => (
                  <motion.div
                    key={note.phase}
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 hover:border-gold/40 transition-all duration-300 hover:bg-card/20">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-secondary">{note.phase}</h4>
                            <p className="text-sm text-secondary/70 mt-1">{note.note}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}