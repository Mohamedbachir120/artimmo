import { motion } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import RevealImage from '../common/RevealImage'
import { riseInView } from '../../utils/motion'
import oxygen from './../../assets/3D/v2/residence-oxygene-appartement-haut-standing-ouled-fayet-alger.webp'

const AboutPreview = () => {
  const highlights = [
    {
      title: "L'Adresse",
      description: "Chaque résidence ARTIMMO est implantée dans l'un des quartiers les plus convoités de la capitale algérienne.",
      color: 'border-brand-blue'
    },
    {
      title: "Le Détail",
      description: "Des matériaux choisis avec rigueur et des finitions soignées qui font la différence entre un logement et une résidence d'exception.",
      color: 'border-brand-green'
    },
    {
      title: "La Confiance",
      description: "De l'achat sur plan jusqu'à la remise des clés, un accompagnement complet en toute transparence.",
      color: 'border-brand-blue'
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionTitle tag="Notre Vision" title="L'exigence, ancrée dans chaque pierre" center={false} />
          
          <motion.p className="text-brand-sage mb-8 leading-relaxed" {...riseInView(0.1)}>
            ARTIMMO est le promoteur immobilier de référence à Alger. Chaque résidence haut standing que nous livrons est le fruit d'une démarche rigoureuse — celle d'un acteur fiable qui ne dissocie jamais la qualité architecturale du bien-être de ses acquéreurs. Que vous souhaitiez acheter un appartement neuf à Alger ou investir dans l'immobilier, nos programmes résidentiels sont conçus pour ceux qui exigent le meilleur.
          </motion.p>

          <div className="grid grid-cols-1 gap-4">
            {highlights.map((item, i) => (
              <motion.div key={i} className={`border-l-2 ${item.color} pl-4`} {...riseInView(i * 0.08, 0.6)}>
                <h4 className="text-white font-semibold">{item.title}</h4>
                <p className="text-brand-sage text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <RevealImage
            src={oxygen}
            alt="Architecture résidentielle haut standing"
            className="rounded-2xl border border-brand-primary/30"
          />
          <motion.div className="absolute -bottom-6 -left-6 glass-strong rounded-xl p-4" {...riseInView(0.5)}>
            <div className="text-brand-blue font-playfair text-2xl font-bold">16+</div>
            <div className="text-brand-sage text-xs">Ans d'expertise</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview