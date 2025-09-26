'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
// Avatar components removed as they're not used

export function Reviews() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  // Generate deterministic star positions
  const generateStarPositions = (count: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const x = (i * 41 + 7) % 100
      const y = (i * 23 + 59) % 100
      const duration = 4 + (i % 2)
      const delay = (i * 0.6) % 2
      positions.push({ x, y, duration, delay })
    }
    return positions
  }

  const starPositions = generateStarPositions(40)

  const reviews = [
    {
      id: 1,
      name: 'Marco Rossi',
      role: 'Sommelier',
      avatar: '👨‍🍳',
      rating: 5,
      text: 'Un gin straordinario che cattura davvero l\'essenza delle fasi lunari. I botanici sono perfettamente bilanciati e creano un\'esperienza di degustazione unica.',
      date: '15 giorni fa'
    },
    {
      id: 2,
      name: 'Elena Bianchi',
      role: 'Appassionata di Gin',
      avatar: '👩‍💼',
      rating: 5,
      text: 'Ho provato molti gin premium, ma BibiGin è davvero speciale. Il sapore evolve nel bicchiere come le fasi lunari stesse. Consigliatissimo!',
      date: '1 mese fa'
    },
    {
      id: 3,
      name: 'Andrea Conti',
      role: 'Bartender',
      avatar: '🧑‍🎨',
      rating: 5,
      text: 'Perfetto per i cocktail più raffinati. La complessità aromatica permette di creare drink stellari. I miei clienti lo adorano.',
      date: '2 mesi fa'
    },
    {
      id: 4,
      name: 'Giulia Verdi',
      role: 'Food Blogger',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'BibiGin non è solo un distillato, è un\'esperienza sensoriale. Ogni sorso racconta la storia delle stelle e della passione artigianale.',
      date: '3 mesi fa'
    }
  ]

  const stats = [
    { label: 'Recensioni Positive', value: '98%', icon: '⭐' },
    { label: 'Clienti Soddisfatti', value: '1.2k+', icon: '😊' },
    { label: 'Premi Ricevuti', value: '5', icon: '🏆' },
    { label: 'Paesi Esportazione', value: '12', icon: '🌍' }
  ]

  return (
    <section id="reviews" className="py-20 bg-cosmic-gradient relative overflow-hidden">
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
              opacity: [0.1, 0.6, 0.1],
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
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center space-x-2 text-gold">
              <Star className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">Testimonianze</span>
              <Star className="w-6 h-6" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-secondary">
              Cosa Dicono di Noi
            </h2>
            
            <p className="text-xl text-secondary/80 leading-relaxed max-w-3xl mx-auto">
              Le parole di chi ha già scoperto il sapore celestiale di BibiGin
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                transition={{ delay: 0.1 * idx }}
                className="text-center"
              >
                <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 hover:border-gold/40 transition-all duration-300 hover:bg-card/20">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                    <div className="text-sm text-secondary/70">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Reviews Grid */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                variants={fadeInUp}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 hover:border-gold/40 transition-all duration-300 hover:bg-card/20 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="text-4xl">{review.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-secondary">{review.name}</h4>
                          <span className="text-sm text-gold">•</span>
                          <span className="text-sm text-secondary/70">{review.date}</span>
                        </div>
                        <p className="text-sm text-gold mb-2">{review.role}</p>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                      </div>
                      <Quote className="w-8 h-8 text-gold/30 flex-shrink-0" />
                    </div>
                    <p className="text-secondary/80 leading-relaxed italic">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={fadeInUp} className="text-center mt-16">
            <Card className="bg-card/10 backdrop-blur-sm border-gold/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-playfair font-bold text-secondary mb-4">
                  Unisciti alla Community
                </h3>
                <p className="text-secondary/80 mb-6">
                  Condividi la tua esperienza con BibiGin e scopri i segreti della distillazione lunare
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:info@bibigin.it" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-semibold rounded-md transition-all duration-300 hover:scale-105"
                  >
                    Scrivi una Recensione
                  </a>
                  <a 
                    href="#contact" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-secondary hover:bg-secondary hover:text-navy font-semibold rounded-md transition-all duration-300"
                  >
                    Contattaci
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}