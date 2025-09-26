'use client'

import { motion } from 'framer-motion'
import { Moon, Stars, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Story() {
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
      const x = (i * 19 + 11) % 100
      const y = (i * 37 + 53) % 100
      const duration = 3 + (i % 2)
      const delay = (i * 0.5) % 2
      positions.push({ x, y, duration, delay })
    }
    return positions
  }

  const starPositions = generateStarPositions(30)

  const moonPhases = [
    { name: 'Luna Nuova', icon: '🌑', description: 'Inizio del processo, raccolta dei botanici' },
    { name: 'Primo Quarto', icon: '🌓', description: 'Macerazione delle erbe aromatiche' },
    { name: 'Luna Piena', icon: '🌕', description: 'Distillazione sotto la luna piena' },
    { name: 'Ultimo Quarto', icon: '🌗', description: 'Affinamento e imbottigliamento' }
  ]

  return (
    <section id="story" className="py-20 bg-navy-gradient relative overflow-hidden">
      {/* Background Effects */}
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
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-gold">
              <Stars className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">La Nostra Storia</span>
              <Stars className="w-6 h-6" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-cream">
              Nato dalle Stelle,
              <br />
              <span className="text-gold">Distillato dalla Luna</span>
            </h2>
            
            <p className="text-xl text-cream/80 leading-relaxed max-w-3xl mx-auto">
              BibiGin nasce da una passione profonda per l&apos;astronomia e l&apos;arte della distillazione. 
              Ogni bottiglia cattura l&apos;essenza delle fasi lunari attraverso un processo artigianale 
              che rispetta i ritmi celesti.
            </p>
          </motion.div>

          {/* Story Cards */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Moon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-secondary mb-4">
                  Ispirazione Celeste
                </h3>
                <p className="text-secondary/70 leading-relaxed">
                  Ogni fase lunare influenza il carattere del nostro gin. La distillazione avviene 
                  seguendo il calendario lunare, permettendo ai botanici di esprimere al meglio 
                  le loro proprietà aromatiche.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 backdrop-blur-sm border-secondary/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-secondary mb-4">
                  Processo Artigianale
                </h3>
                <p className="text-secondary/70 leading-relaxed">
                  Utilizziamo metodi tradizionali di distillazione in piccoli lotti, 
                  selezionando personalmente ogni botanico dalle migliori regioni d&apos;Italia 
                  per garantire un sapore unico e inconfondibile.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Moon Phases Process */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <h3 className="text-3xl font-playfair font-bold text-secondary">
              Il Processo delle Quattro Lune
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {moonPhases.map((phase, idx) => (
                <motion.div
                  key={phase.name}
                  variants={fadeInUp}
                  transition={{ delay: 0.1 * idx }}
                  className="text-center space-y-4"
                >
                  <div className="text-6xl">{phase.icon}</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gold">{phase.name}</h4>
                    <p className="text-sm text-secondary/70 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote 
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-playfair italic text-secondary/90 max-w-3xl mx-auto leading-relaxed"
          >
            &ldquo;Come le fasi lunari influenzano le maree, così il nostro gin cattura 
            l&apos;essenza di ogni momento celeste in ogni sorso.&rdquo;
            <footer className="text-lg text-gold mt-6 not-italic">
              — Maestro Distillatore BibiGin
            </footer>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}