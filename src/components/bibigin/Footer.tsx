'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  // Generate deterministic star positions
  const generateStarPositions = (count: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const x = (i * 13 + 67) % 100
      const y = (i * 43 + 17) % 100
      const duration = 5 + (i % 3)
      const delay = (i * 0.7) % 3
      positions.push({ x, y, duration, delay })
    }
    return positions
  }

  const starPositions = generateStarPositions(20)

  const socialLinks = [
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' }
  ]

  const quickLinks = [
    { name: 'Il Gin', href: '#product' },
    { name: 'La Storia', href: '#story' },
    { name: 'Recensioni', href: '#reviews' }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Termini e Condizioni', href: '/legal/terms' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Info Vendita Alcol', href: '/legal/alcohol' }
  ]

  return (
    <footer id="contact" className="bg-cosmic-gradient relative overflow-hidden">
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
              opacity: [0.1, 0.5, 0.1],
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

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/logo.png"
                alt="BibiGin Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="font-playfair text-3xl font-bold text-secondary">
                BibiGin
              </span>
            </div>

            <p className="text-secondary/80 leading-relaxed mb-6 max-w-md">
              Gin delle Fasi Lunari - Un distillato artigianale premium che cattura
              l&apos;essenza dell&apos;astronomia in ogni sorso. Prodotto con passione sotto
              il cielo stellato siciliano.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-secondary/70">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:bibiginlacorte@gmail.com" className="hover:text-gold transition-colors">
                  bibiginlacorte@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-secondary/70">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:+393288583910" className="hover:text-gold transition-colors">
                  +39 328 858 3910
                </a>
              </div>
              <div className="flex items-center space-x-3 text-secondary/70">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Palermo, Italia</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-playfair text-xl font-bold text-secondary mb-6">
              Link Rapidi
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-secondary/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-playfair text-xl font-bold text-secondary mb-6">
              Informazioni Legali
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-secondary/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-playfair text-xl font-bold text-secondary mb-6">
              Seguici
            </h3>

            <p className="text-secondary/70 mb-6">
              Resta aggiornato sulle novità celestiali di BibiGin
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-secondary/10 border border-secondary/30 rounded-full flex items-center justify-center text-secondary hover:bg-gold/20 hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Quality Badges */}
            <div className="space-y-2">
              <div className="text-xs text-secondary/50">Certificazioni:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-secondary/10 text-xs text-secondary/70 rounded">🌿 BIO</span>
                <span className="px-2 py-1 bg-secondary/10 text-xs text-secondary/70 rounded">🇮🇹 Made in Italy</span>
                <span className="px-2 py-1 bg-secondary/10 text-xs text-secondary/70 rounded">⭐ Premium</span>
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="bg-secondary/20 mb-8" />

        {/* Bottom Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="flex flex-wrap justify-center gap-4 text-xs text-secondary/60">
            <a href="/legal/privacy" className="hover:text-gold transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="/legal/terms" className="hover:text-gold transition-colors">
              Termini
            </a>
            <span>•</span>
            <a href="/legal/cookies" className="hover:text-gold transition-colors">
              Cookie
            </a>
            <span>•</span>
            <a href="/legal/alcohol" className="hover:text-gold transition-colors">
              🔞 Info Alcol
            </a>
          </div>

          <div className="text-secondary/60 text-sm text-center">
            © 2024 BibiGin. Tutti i diritti riservati. | P.IVA: IT12345678901
          </div>

          <div className="text-secondary/60 text-sm text-center font-semibold">
            🔞 Bevi responsabilmente | Vietato ai minori di 18 anni
          </div>
        </motion.div>

        {/* Moon Phase Decoration */}
        <div className="absolute bottom-4 right-4 text-4xl opacity-20">
          🌙
        </div>
      </div>
    </footer>
  )
}