import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/motion'

// Image uncovered from the bottom up while it settles from a slight zoom.
// The viewport trigger sits on the unclipped outer box: a fully clipped
// element never registers as intersecting.
const RevealImage = ({ src, alt, className = '', imgClassName = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
    <motion.div
      className="overflow-hidden h-full"
      style={{ borderRadius: 'inherit' }}
      variants={{
        hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
        visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: EASE_OUT, delay } }
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        variants={{
          hidden: { scale: 1.2 },
          visible: { scale: 1, transition: { duration: 1.4, ease: EASE_OUT, delay } }
        }}
      />
    </motion.div>
  </motion.div>
)

export default RevealImage
