import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '../../utils/constants'
import Button from '../common/Button'
import LogoWhite from "./../../assets/artimmo-white.png"

const Navbar = ({ scrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: scrolled 
          ? 'rgba(8, 47, 73, 0.85)' 
          : 'rgba(8, 47, 73, 0.4)'
      }}
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/">
          <motion.img 
            src={LogoWhite} 
            alt="ARTIMMO" 
            animate={{ 
              width: scrolled ? 110 : 150,
              opacity: scrolled ? 0.9 : 1
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="object-contain"
          />
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