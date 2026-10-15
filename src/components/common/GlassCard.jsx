import { motion } from 'framer-motion'
import { riseInView } from '../../utils/motion'

const GlassCard = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  as = 'div',
  delay = 0
}) => {
  const variants = {
    default: 'glass',
    strong: 'glass-strong'
  }

  const Component = as === 'div' ? motion.div : motion.article

  const motionProps = {
    className: `${variants[variant]} rounded-2xl ${className}`,
    onClick,
    ...(hover && onClick ? { whileHover: { y: -4 } } : {}),
    ...riseInView(delay, 0.2)
  }

  return (
    <Component {...motionProps}>
      {children}
    </Component>
  )
}

export default GlassCard