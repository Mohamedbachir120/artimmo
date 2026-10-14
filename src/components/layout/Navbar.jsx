import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { NAV_ITEMS } from '../../utils/constants'
import { EASE_RISE, EASE_SOFT } from '../../utils/motion'
import Button from '../common/Button'
import LogoWhite from "./../../assets/artimmo-white.png"

const Navbar = ({ scrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  const isActive = (path) => location.pathname === path

  // Slide away while scrolling down, come back as soon as the visitor scrolls up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 140 && !mobileOpen)
  })

  useEffect(() => {
    const lenis = window.__lenis
    if (mobileOpen) lenis?.stop()
    else lenis?.start()
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 ${mobileOpen ? 'z-[70]' : 'z-50'} transition-[padding,background-color] duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          backgroundColor: scrolled
            ? 'rgba(8, 47, 73, 0.85)'
            : 'rgba(8, 47, 73, 0.4)'
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? '-110%' : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_SOFT }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <motion.img
              src={LogoWhite}
              alt="ARTIMMO"
              animate={{
                width: scrolled ? 110 : 120,
                opacity: scrolled ? 0.9 : 1
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_SOFT, delay: 0.35 + 0.08 * i }}
              >
                <Link
                  to={item.path}
                  className={`nav-underline text-sm uppercase tracking-widest transition-colors duration-500 ${
                    isActive(item.path) ? 'is-active text-brand-blue' : 'text-brand-sage hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_SOFT, delay: 0.35 + 0.08 * NAV_ITEMS.length }}
          >
            <Button variant="primary" size="sm" to="/parlons-en">
              Acquérir un bien
            </Button>
          </motion.div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="relative block w-6 h-4">
              <motion.span
                className="absolute left-0 right-0 h-0.5 bg-current rounded"
                animate={mobileOpen ? { top: '50%', rotate: 45 } : { top: '0%', rotate: 0 }}
                transition={{ duration: 0.35, ease: EASE_SOFT }}
              />
              <motion.span
                className="absolute left-0 right-0 top-1/2 h-0.5 bg-current rounded"
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 right-0 h-0.5 bg-current rounded"
                animate={mobileOpen ? { top: '50%', rotate: -45 } : { top: '100%', rotate: 0 }}
                transition={{ duration: 0.35, ease: EASE_SOFT }}
              />
            </span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden bg-[#0d1721]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_SOFT }}
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0.001, y: 52 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_RISE, delay: 0.15 + 0.08 * i }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-3xl uppercase tracking-widest transition-opacity hover:opacity-65 ${
                      isActive(item.path) ? 'text-brand-blue' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0.001, y: 52 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_RISE, delay: 0.15 + 0.08 * NAV_ITEMS.length }}
              >
                <Button variant="primary" size="md" className="mt-6" to="/parlons-en" onClick={() => setMobileOpen(false)}>
                  Acquérir un bien
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
