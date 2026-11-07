import { motion } from 'framer-motion'
import { timeline } from '../../data/timeline'
import SectionTitle from '../common/SectionTitle'

const Timeline = () => {
  return (
    <>
      <SectionTitle tag="L'ascension" title="Une décennie d'ambition" />
      <div className="relative mb-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-primary/50 -translate-x-1/2" />
        
        {timeline.map((item, i) => (
          <motion.div 
            key={i} 
            className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
              <span className="text-brand-blue font-playfair text-2xl font-bold">{item.year}</span>
              <h4 className="text-white font-semibold">{item.title}</h4>
              <p className="text-brand-sage text-sm">{item.desc}</p>
            </div>
            <div className="w-4 h-4 bg-brand-blue rounded-full border-4 border-brand-dark z-10" />
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default Timeline