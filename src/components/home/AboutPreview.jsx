import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import Louvres from '../common/Louvres'
import { EASE_OUT, riseInView } from '../../utils/motion'
import oxygen from './../../assets/3D/v2/residence-oxygene-appartement-haut-standing-ouled-fayet-alger.webp'
import solariumTowers from './../../assets/3D/v2/residences-solarium-tours-residentielles-premium-cheraga-alger.webp'

const highlights = [
  {
    title: "L'Adresse",
    description: "Chaque résidence ARTIMMO est implantée dans l'un des quartiers les plus convoités de la capitale algérienne."
  },
  {
    title: "Le Détail",
    description: "Des matériaux choisis avec rigueur et des finitions soignées qui font la différence entre un logement et une résidence d'exception."
  },
  {
    title: "La Confiance",
    description: "De l'achat sur plan jusqu'à la remise des clés, un accompagnement complet en toute transparence."
  }
]

// Two buildings composed like a spread: a tall frame that drifts against the
// scroll, and a second view that opens through the louvres as it overlaps it.
const AboutPreview = () => {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const mainY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%'])
  const overlapY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['18%', '-18%'])

  return (
    <section ref={ref} className="py-20 md:py-32 px-5 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        <div className="relative lg:col-span-6 pb-24 md:pb-32">
          {/* Viewport trigger on the unclipped box: a fully clipped element never intersects */}
          <motion.div
            className="relative w-[82%] aspect-[4/5]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-sm"
              variants={{
                hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
                visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.3, ease: EASE_OUT } }
              }}
            >
              <motion.img
                src={oxygen}
                alt="Architecture résidentielle haut standing"
                className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
                style={{ y: mainY }}
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute right-0 bottom-0 w-[50%] aspect-[3/4] overflow-hidden rounded-sm ring-8 ring-[#0d1721]"
            style={{ y: overlapY }}
            onViewportEnter={() => setSeen(true)}
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.img
              src={solariumTowers}
              alt="Tours résidentielles SOLARIUM à Chéraga"
              className="w-full h-full object-cover"
              initial={{ scale: 1.25 }}
              animate={seen ? { scale: 1 } : undefined}
              transition={{ duration: 1.8, ease: EASE_OUT }}
              loading="lazy"
            />
            <Louvres play={seen} count={5} duration={1} />
          </motion.div>

          <motion.div className="absolute left-0 bottom-0 md:bottom-10 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3" {...riseInView(0.4)}>
            <span className="text-5xl md:text-7xl font-extralight text-white tracking-tight">16+</span>
            <span className="text-brand-sage text-[11px] uppercase tracking-[0.3em] max-w-[7rem] leading-snug">Ans d'expertise</span>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <SectionTitle tag="Notre Vision" title="L'exigence, ancrée dans chaque pierre" center={false} />

          <motion.p className="text-brand-sage mb-10 leading-relaxed" {...riseInView(0.1)}>
            ARTIMMO est le promoteur immobilier de référence à Alger. Chaque résidence haut standing que nous livrons est le fruit d'une démarche rigoureuse — celle d'un acteur fiable qui ne dissocie jamais la qualité architecturale du bien-être de ses acquéreurs. Que vous souhaitiez acheter un appartement neuf à Alger ou investir dans l'immobilier, nos programmes résidentiels sont conçus pour ceux qui exigent le meilleur.
          </motion.p>

          <ol className="border-t border-white/10">
            {highlights.map((item, i) => (
              <motion.li key={item.title} className="grid grid-cols-[3rem_1fr] gap-2 py-5 border-b border-white/10" {...riseInView(i * 0.08, 0.6)}>
                <span className="text-brand-blue text-xs tracking-[0.25em] pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-brand-sage text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
