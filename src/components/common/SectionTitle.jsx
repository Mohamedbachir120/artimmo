import { motion } from 'framer-motion'
import RevealText from './RevealText'
import { riseInView } from '../../utils/motion'

const SectionTitle = ({ 
  tag, 
  title, 
  subtitle, 
  center = true,
  className = '' 
}) => {
  return (
    <div className={`${center ? 'text-center' : ''} mb-12 ${className}`}>
      {tag && (
        <motion.span
          className="inline-block text-brand-blue uppercase tracking-[3px] text-xs font-medium"
          {...riseInView(0)}
        >
          {tag}
        </motion.span>
      )}
      <RevealText
        as="h2"
        text={title}
        className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mt-3 mb-4"
        delay={0.1}
      />
      {subtitle && (
        <motion.p className={`text-brand-sage max-w-2xl ${center ? 'mx-auto' : ''}`} {...riseInView(0.3)}>
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export default SectionTitle
