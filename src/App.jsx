import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useScrollPosition } from './hooks/useScrollPosition'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AmbientBackground from './components/layout/AmbientBackground'
import Loader from './components/common/Loader'
import SmoothScroll from './components/layout/SmoothScroll'
import PageTransition from './components/layout/PageTransition'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

const App = () => {
  const [loading, setLoading] = useState(true)
  const scrolled = useScrollPosition(50)
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <AmbientBackground />
      <Navbar scrolled={scrolled} />
      <PageTransition />

      <main>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/nos-signatures" element={<ProjectsPage />} />
          <Route path="/nos-signatures/:slug" element={<ProjectDetailPage />} />
          <Route path="/artimmo" element={<AboutPage />} />
          <Route path="/parlons-en" element={<ContactPage />} />
        </Routes>
        <Footer />
      </main>
    </MotionConfig>
  )
}

export default App