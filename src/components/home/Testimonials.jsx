import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { testimonials } from '../../data/testimonials'
import SectionTitle from '../common/SectionTitle'
import { EASE_OUT, riseInView } from '../../utils/motion'

// One voice at a time, set large; the other owners are listed beside it and
// bring their words forward when chosen.
const Testimonials = () => {
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  return (
    <section className="py-20 md:py-32 px-5 md:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionTitle
            tag="Témoignages"
            title="Ce que disent nos clients"
            subtitle="La satisfaction de nos clients est notre plus grande récompense"
            center={false}
          />
          <motion.ul className="border-t border-white/10" role="tablist" aria-label="Témoignages" {...riseInView(0.2)}>
            {testimonials.map((t, i) => (
              <li key={t.id} className="border-b border-white/10">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className="w-full text-left py-4 flex items-center gap-4 cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
                >
                  <span className={`h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === active ? 'w-10 bg-brand-blue' : 'w-4 bg-white/30 group-hover:w-6'}`} />
                  <span>
                    <span className={`block transition-colors duration-500 ${i === active ? 'text-white' : 'text-brand-sage group-hover:text-white'}`}>{t.name}</span>
                    <span className="block text-xs text-brand-sage/70">{t.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 relative min-h-[18rem] flex items-center" role="tabpanel">
          <span aria-hidden="true" className="absolute -top-10 -left-2 text-[10rem] leading-none text-brand-blue/20 select-none" style={{ fontFamily: 'Blacksword, cursive' }}>“</span>
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <blockquote className="text-2xl md:text-4xl font-light text-white leading-snug tracking-tight">
                {current.text}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-sm">
                <span className="text-white">{current.name}</span>
                <span className="h-px w-8 bg-white/20" />
                <span className="text-brand-sage">{current.role}</span>
                <span className="ml-auto text-brand-blue tracking-[0.2em]" aria-label={`${current.rating} sur 5`}>{'★'.repeat(current.rating)}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
