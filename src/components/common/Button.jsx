import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  className = '',
  icon,
  type = 'button',
  disabled = false,
  href
}) => {
  const baseClasses = 'rounded-xl font-semibold btn-shine transition-all inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue/90',
    secondary: 'border border-brand-sage text-white hover:bg-white/5',
    green: 'bg-brand-green text-white hover:bg-brand-green/90',
    ghost: 'text-brand-blue hover:text-white hover:bg-white/5'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 }
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...motionProps}
      >
        {icon && <span className="w-5 h-5">{icon}</span>}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      {...motionProps}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </motion.button>
  )
}

export default Button