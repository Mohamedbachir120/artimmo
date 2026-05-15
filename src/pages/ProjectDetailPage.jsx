import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SEOHead from '../seo/SEOHead'
import Button from '../components/common/Button'
import GlassCard from '../components/common/GlassCard'
import ThreeViewer from '../components/projects/ThreeViewer'
import { getProjectBySlug } from '../data/projects'
import { formatPrice, getStatusColor } from '../utils/formatters'

const ProjectDetailPage = () => {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const [show3DFullscreen, setShow3DFullscreen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  if (!project) {
    return (
      <div className="page-content pt-28 pb-20 px-4 text-center">
        <p className="text-brand-sage">Résidence non trouvée.</p>
        <Link to="/nos-signatures" className="text-brand-blue mt-4 inline-block">
          Retour aux résidences
        </Link>
      </div>
    )
  }

  const seoData = {
    title: project.seo.title,
    description: project.seo.metaDescription,
    keywords: [
      project.name.toLowerCase(),
      project.city.toLowerCase(),
      project.type.toLowerCase(),
      "immobilier",
      "alger"
    ],
    path: `/nos-signatures/${project.slug}`,
    image: project.images[0],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Residence",
      "name": project.name,
      "description": project.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": project.city,
        "addressRegion": "Alger",
        "addressCountry": "DZ"
      },
      "offers": {
        "@type": "Offer",
        "price": project.price,
        "priceCurrency": "DZD"
      }
    }
  }

  return (
    <>
      <SEOHead {...seoData} />
      <AnimatePresence>
        {show3DFullscreen && (
          <ThreeViewer isFullscreen={true} onClose={() => setShow3DFullscreen(false)} />
        )}
      </AnimatePresence>

      <div className="page-content">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[500px]">
          <motion.img 
            key={activeImage} 
            src={project.images[activeImage]} 
            alt={`${project.name} - ${project.city}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <span 
                  className="inline-block px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ backgroundColor: project.badgeColor }}
                >
                  {project.badge}
                </span>
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">
                  {project.seo.h1}
                </h1>
                <p className="text-brand-sage flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex gap-2">
            {project.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-brand-blue' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-playfair text-2xl text-white mb-6">Description</h2>
                  <p className="text-brand-sage leading-relaxed mb-8">{project.description}</p>

                  <h3 className="font-playfair text-xl text-white mb-4">Caractéristiques</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {project.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-brand-sage">
                        <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <h3 className="font-playfair text-xl text-white mb-4">Visite Virtuelle 3D</h3>
                  <div className="relative rounded-2xl overflow-hidden border border-brand-primary/30">
                    <ThreeViewer />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-4 right-4"
                      onClick={() => setShow3DFullscreen(true)}
                    >
                      Plein écran
                    </Button>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <GlassCard variant="strong" className="p-6 sticky top-28" hover={false}>
                  <div className="text-center mb-6">
                    <p className="text-brand-sage text-xs uppercase tracking-wider">À partir de</p>
                    <p className="font-playfair text-3xl text-white font-bold">
                      {formatPrice(project.price)}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b border-brand-primary/30">
                      <span className="text-brand-sage">Surface</span>
                      <span className="text-white font-semibold">{project.surface} m²</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-brand-primary/30">
                      <span className="text-brand-sage">Type</span>
                      <span className="text-white font-semibold">{project.type}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-brand-primary/30">
                      <span className="text-brand-sage">Statut</span>
                      <span className={`font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-brand-primary/30">
                      <span className="text-brand-sage">Livraison</span>
                      <span className="text-white font-semibold">{project.year}</span>
                    </div>
                  </div>

                  <Link to="/parlons-en">
                    <Button variant="primary" size="lg" className="w-full mb-3">
                      Réserver ce bien
                    </Button>
                  </Link>
                  <Button variant="secondary" size="lg" className="w-full">
                    Télécharger la brochure
                  </Button>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ProjectDetailPage