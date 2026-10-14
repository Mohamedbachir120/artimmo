import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import RevealText from '../common/RevealText'
import { riseInView } from '../../utils/motion'
import Button from '../common/Button'
import Louvres from '../common/Louvres'
import { CONTACT_INFO } from '../../utils/constants'
import facade from './../../assets/3D/v2/verdonia vue de nuit.webp'

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Closing scene, a bookend to the opening: the louvres open again on the same
// night view of Verdonia as the visitor arrives, and the invitation sits inside the building.
const CTASection = () => {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.2, 1])

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.img src={facade} alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ scale }} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1721] via-[#0d1721]/55 to-[#0d1721]" />
        <Louvres progress={enter} count={11} />
      </div>

      <div className="relative z-30 max-w-4xl mx-auto px-5 md:px-10 py-24 text-center">
        <RevealText
          as="h2"
          text="Chaque acquisition mérite une attention particulière"
          className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight mb-6"
        />
        <motion.p className="text-brand-sage mb-10 max-w-xl mx-auto" {...riseInView(0.2)}>
          Nos conseillers immobiliers vous offrent un accompagnement sur-mesure, à la hauteur de vos ambitions.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" {...riseInView(0.3)}>
          <Button variant="primary" size="lg" to="/parlons-en">
            Réserver un moment pour ma visite privée
          </Button>
          <Button
            variant="green"
            size="lg"
            href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
            icon={<WhatsAppIcon />}
          >
            WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
