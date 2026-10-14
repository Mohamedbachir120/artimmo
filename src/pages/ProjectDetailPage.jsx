import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '../seo/SEOHead'
import Button from '../components/common/Button'
import GlassCard from '../components/common/GlassCard'
import { getProjectBySlug } from '../data/projects'
import { getStatusColor } from '../utils/formatters'
import { EASE_RISE, EASE_SOFT } from '../utils/motion'

// Warm the 3D tour chunk as soon as the visitor shows intent
const prefetchTour = () => import('./PropertyTourPage')

const ProjectDetailPage = () => {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
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
      'immobilier',
      'alger'
    ],
    path: `/nos-signatures/${project.slug}`,
    image: project.images[0].src,
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

      <div className="page-content">
        {/* Hero */}
               {/* Hero */}
               <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <motion.img 
            key={activeImage} 
            src={project.images[activeImage].src} 
            alt={`${project.name} - ${project.city}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.2 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ opacity: { duration: 0.5 }, scale: { duration: 1, ease: EASE_SOFT } }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0.001, y: 52 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, ease: EASE_RISE, delay: 0.4 }}
              >
                <h1 
                  className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2"
                  style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3), 0 4px 30px rgba(0,0,0,0.3)' }}
                >
                  {project.seo.h1}
                </h1>
                <p 
                  className="text-brand-sage flex items-center gap-2"
                  style={{ textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </p>
                <Link
                  to={`/nos-signatures/${project.slug}/visite-3d`}
                  onMouseEnter={prefetchTour}
                  onFocus={prefetchTour}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl glass-strong px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue/40 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
                  </svg>
                  Visite immersive 3D
                </Link>
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
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2">
                <motion.div 
                  initial={{ opacity: 0.001, y: 52 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, ease: EASE_RISE }}
                >
                  <Link
                    to={`/nos-signatures/${project.slug}/visite-3d`}
                    onMouseEnter={prefetchTour}
                    onFocus={prefetchTour}
                    className="group relative mb-10 block overflow-hidden rounded-2xl border border-brand-blue/20"
                  >
                    <img
                      src={project.images[0].src}
                      alt=""
                      className="h-56 md:h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1721]/90 via-[#0d1721]/60 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 max-w-md">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-brand-blue mb-2">Visite immersive</span>
                      <span className="font-playfair text-2xl text-white mb-2">Entrez dans l'appartement témoin</span>
                      <span className="text-sm text-brand-sage mb-4">
                        Parcourez le séjour, la cuisine, la suite parentale et la terrasse comme si vous y étiez, de jour comme en soirée.
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                        Commencer la visite
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>

                  <h2 className="font-playfair text-2xl text-white mb-6">Description</h2>
                  <p className="text-brand-sage leading-relaxed mb-8">{project.description}</p>

                  <h3 className="font-playfair text-xl text-white mb-4">Caractéristiques du programme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {project.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-brand-sage">
                        <svg className="w-5 h-5 text-brand-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Détails du programme */}
                  {project.projectInfo && (
                    <>
                      <h3 className="font-playfair text-xl text-white mb-4 mt-8">Détails du programme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {project.projectInfo.totalLogements && (
                          <div className="bg-brand-primary/10 rounded-lg p-4">
                            <span className="text-brand-sage text-sm">Logements</span>
                            <p className="text-white text-lg font-semibold">{project.projectInfo.totalLogements}</p>
                          </div>
                        )}
                        <div className="bg-brand-primary/10 rounded-lg p-4">
                          <span className="text-brand-sage text-sm">Types</span>
                          <p className="text-white text-lg font-semibold">{project.projectInfo.types.join(', ')}</p>
                        </div>
                        <div className="bg-brand-primary/10 rounded-lg p-4">
                          <span className="text-brand-sage text-sm">Surfaces</span>
                          <p className="text-white text-lg font-semibold">{project.projectInfo.surfaces}</p>
                        </div>
                        <div className="bg-brand-primary/10 rounded-lg p-4">
                          <span className="text-brand-sage text-sm">Configuration</span>
                          <p className="text-white text-lg font-semibold">{project.projectInfo.configuration}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <GlassCard variant="strong" className="p-6 sticky top-28" hover={false}>
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
                      <span className="text-brand-sage">Étage</span>
                      <span className="text-white font-semibold">{project.etage}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-brand-primary/30">
                      <span className="text-brand-sage">Bloc</span>
                      <span className="text-white font-semibold">{project.bloc}</span>
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

                  <Button variant="primary" size="lg" className="w-full mb-3" to="/parlons-en">
                    {project.status === 'En cours' ? 'Être informé' : 'Réserver ce bien'}
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