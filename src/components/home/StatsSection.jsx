import { motion } from 'framer-motion'
import AnimatedCounter from '../common/AnimatedCounter'
import { EASE_OUT, riseInView } from '../../utils/motion'

const stats = [
  { value: 12, suffix: '+', label: 'Projets livrés' },
  { value: 450, suffix: '', label: 'Logements' },
  { value: 16, suffix: '', label: "Ans d'expertise" },
  { value: 98, suffix: '%', label: 'Satisfaction client' }
]

// Figures set like an architect's legend: a ruled line drawn across the
// page, then each figure rising beside its own vertical hairline.
const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="h-px bg-white/15 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`pt-8 pb-2 pr-4 ${i > 0 ? 'md:border-l md:border-white/10 md:pl-8' : ''} ${i % 2 === 1 ? 'border-l border-white/10 pl-6 md:pl-8' : ''}`}
              {...riseInView(0.15 + i * 0.08, 0.5)}
            >
              <div className="text-5xl md:text-6xl xl:text-7xl font-extralight text-white tracking-tight tabular-nums">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-brand-sage text-[11px] uppercase tracking-[0.3em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
