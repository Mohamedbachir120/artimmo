import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE_OUT, riseInView } from '../../utils/motion'
import { formatPrice, getStatusColor } from '../../utils/formatters'
import { getConstructionMedia } from '../../data/constructionMedia'
import ConstructionReveal from './ConstructionReveal'

const ProjectCard = ({ project, index = 0 }) => {
  const href = `/nos-signatures/${project.slug}`

  return (
    <motion.article
      className="project-card glass rounded-2xl overflow-hidden cursor-pointer group"
      {...riseInView(index * 0.08, 0.2)}
      whileHover={{ y: -4, transition: { duration: 0.9, ease: EASE_OUT } }}
    >
      <div className="relative h-56 overflow-hidden">
        <ConstructionReveal
          href={href}
          cover={project.images[0].src}
          alt={`${project.name} - ${project.city}`}
          media={getConstructionMedia(project.slug)}
          name={project.name}
        />

        {/* <span
          className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider"
          style={{ backgroundColor: project.badgeColor }}
        >
          {project.badge}
        </span> */}

        <span className={`absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-medium pointer-events-none ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <Link to={href}>
        <div className="p-5">
          <h3 className="font-playfair text-xl font-semibold text-white mb-1 transition-colors duration-500 group-hover:text-brand-blue">
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
