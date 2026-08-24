import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice, getStatusColor } from '../../utils/formatters'

const ProjectCard = ({ project }) => {
  return (
    <motion.article 
      className="project-card glass rounded-2xl overflow-hidden cursor-pointer group"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/nos-signatures/${project.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <img 
            src={project.images[0].src} 
            alt={`${project.name} - ${project.city}`}
            className="project-card-img w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-transparent to-transparent" />
          
          {/* <span 
            className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider" 
            style={{ backgroundColor: project.badgeColor }}
          >
            {project.badge}
          </span> */}
          
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-playfair text-xl font-semibold text-white mb-1">
            {project.name}
          </h3>
          <p className="text-brand-sage text-sm mb-3">{project.location}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-brand-blue font-semibold">{project.surface} m²</span>
              <span className="text-brand-sage ml-2">| {project.type}</span>
            </div>
           
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProjectCard
