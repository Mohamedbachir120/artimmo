import { motion } from 'framer-motion'

const SectionTitle = ({ 
  tag, 
  title, 
  subtitle, 
  center = true,
  className = '' 
}) => {
  return (
    <motion.div 
      className={`${center ? 'text-center' : ''} mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
    >
      {tag && (
        <span className="text-brand-blue uppercase tracking-[3px] text-xs font-medium">
          {tag}
        </span>
      )}
      <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mt-3 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-brand-sage max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  )
}

export default SectionTitle