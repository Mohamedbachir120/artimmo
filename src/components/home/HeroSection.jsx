import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../common/Button'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" 
          alt="Résidences haut standing Alger" 
          className="w-full h-full object-cover brightness-[0.25]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50" />
      </div>

      <motion.div 
        className="relative z-10 glass-strong rounded-3xl p-8 md:p-12 max-w-3xl mx-4 text-center"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green bg-brand-green/10 text-brand-sage text-xs uppercase tracking-wider mb-6"
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5 }}
        >
          <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          Des propriétés d'exception réservées à l'élite algérienne
        </motion.div>

        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          ARTIMMO Promotion
        </h1>
        <p className="font-playfair text-xl md:text-2xl text-brand-blue  mb-8">
          Redéfinir l'habitat moderne
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/nos-signatures">
            <Button variant="primary" size="lg">
              Découvrir nos résidences
            </Button>
          </Link>
          <Link to="/parlons-en">
            <Button variant="secondary" size="lg">
              Prendre contact
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-sage"
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}

export default HeroSection