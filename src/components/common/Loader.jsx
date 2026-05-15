import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-brand-dark to-brand-primary"
      exit={{ opacity: 0 }} 
      style={{ background: '#0d1721' }}  // ← solid, no gradient bleed

      transition={{ duration: 0.5 }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="font-playfair text-5xl font-bold text-white tracking-wider">
          ARTI<span className="text-brand-blue">MMO</span>
        </div>
        <motion.div 
          className="mt-4 h-0.5 bg-brand-blue rounded-full overflow-hidden" 
          initial={{ width: 0 }} 
          animate={{ width: 200 }} 
          transition={{ duration: 1.5, ease: "easeInOut" }} 
        />
      </motion.div>
    </motion.div>
  )
}

export default Loader