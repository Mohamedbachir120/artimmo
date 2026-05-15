import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '../../utils/constants'
import Button from '../common/Button'

const Navbar = ({ scrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5'}`}
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/">
          <motion.span 
            className="font-playfair text-2xl md:text-3xl font-bold text-white tracking-wider cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            ARTI<span className="text-brand-blue">MMO</span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`relative text-sm uppercase tracking-widest transition-colors nav-link ${
                isActive(item.path) ? 'text-brand-blue' : 'text-brand-sage hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button variant="primary" size="sm" onClick={() => window.location.href = '/parlons-en'}>
            Acquérir un bien
          </Button>
        </div>

        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-left py-2 transition-colors ${
                    isActive(item.path) ? 'text-brand-blue' : 'text-brand-sage hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="primary" size="md" className="mt-2" onClick={() => {
                setMobileOpen(false)
                window.location.href = '/parlons-en'
              }}>
                Acquérir un bien
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar