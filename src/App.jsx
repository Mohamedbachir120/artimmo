import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollPosition } from './hooks/useScrollPosition'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AmbientBackground from './components/layout/AmbientBackground'
import Loader from './components/common/Loader'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
)

const ScrollToTop = () => {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

const App = () => {
  const [loading, setLoading] = useState(true)
  const scrolled = useScrollPosition(50)
  const location = useLocation()

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <AmbientBackground />
      <Navbar scrolled={scrolled} />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            } 
          />
          <Route 
            path="/nos-signatures" 
            element={
              <PageTransition>
                <ProjectsPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/nos-signatures/:slug" 
            element={
              <PageTransition>
                <ProjectDetailPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/artimmo" 
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/parlons-en" 
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            } 
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  )
}




export default App