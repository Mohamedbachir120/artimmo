import { motion } from 'framer-motion'
import GlassCard from '../common/GlassCard'
import AnimatedCounter from '../common/AnimatedCounter'

const stats = [
  { value: 12, suffix: '+', label: 'Projets livrés' },
  { value: 450, suffix: '', label: 'Logements' },
  { value: 16, suffix: '', label: "Ans d'expertise" },
  { value: 98, suffix: '%', label: 'Satisfaction client' }
]

const StatsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <GlassCard variant="strong" className="p-8 md:p-12" hover={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-playfair text-4xl md:text-5xl font-bold text-brand-blue mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-brand-sage text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

export default StatsSection