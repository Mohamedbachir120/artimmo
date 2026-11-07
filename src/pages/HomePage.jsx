import SEOHead from '../seo/SEOHead'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import AboutPreview from '../components/home/AboutPreview'
import FeaturedProjects from '../components/home/FeaturedProjects'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'

const HomePage = () => {
  const seoData = {
    title: "Promotion immobilière à Alger – Appartements haut standing",
    description: "ARTIMMO Promotion, promotion immobilière à Alger. Appartements et duplex haut standing à Ouled Fayet, Draria et Chéraga. Investissez dans l'immobilier d'exception.",
    keywords: [
      "immobilier alger",
      "promotion immobiliere",
      "appartement haut standing",
      "duplex alger",
      "ouled fayet",
      "draria",
      "cheraga",
      "investissement immobilier alger"
    ],
    path: '/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "ARTIMMO Promotion",
      "description": "Promoteur immobilier de référence à Alger",
      "url": "https://artimmo.dz",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Alger",
        "addressCountry": "DZ"
      },
      "telephone": "+213 559 29 29 29",
      "email": "contact@artimmo.dz"
    }
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="page-content">
        <HeroSection />
        <StatsSection />
        <AboutPreview />
        <FeaturedProjects />
        <Testimonials />
        <CTASection />
      </div>
    </>
  )
}

export default HomePage