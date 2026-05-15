import { motion } from 'framer-motion'

const GlassCard = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  as = 'div'
}) => {
  const variants = {
    default: 'glass',
    strong: 'glass-strong'
  }

  const Component = as === 'div' ? motion.div : motion.article

  const motionProps = {
    className: `${variants[variant]} rounded-2xl ${className}`,
    onClick,
    ...(hover && onClick ? { whileHover: { y: -10 } } : {}),
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  }

  return (
    <Component {...motionProps}>
      {children}
    </Component>
  )
}

export default GlassCard