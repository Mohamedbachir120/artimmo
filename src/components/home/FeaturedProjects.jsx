import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projectsData } from '../../data/projects'
import SectionTitle from '../common/SectionTitle'
import ProjectCard from '../projects/ProjectCard'

const FeaturedProjects = () => {
  const featured = projectsData.slice(0, 3)

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <SectionTitle 
          tag="Réalisations" 
          title="Nos Résidences d'Exception" 
          subtitle="Découvrez nos projets qui redéfinissent l'art de vivre à Alger" 
        />

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <motion.div 
          className="text-center mt-10" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          <Link 
            to="/nos-signatures" 
            className="text-brand-blue hover:text-white transition-colors inline-flex items-center gap-2"
          >
            Voir toutes nos résidences
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProjects