import { motion } from 'framer-motion'
import SEOHead from '../seo/SEOHead'
import SectionTitle from '../components/common/SectionTitle'
import Values from '../components/about/Values'
import Timeline from '../components/about/Timeline'
import Departments from '../components/about/Departments'
import oxygen from './../assets/3D/residence-oxygene-appartement-haut-standing-ouled-fayet-alger.webp'

const AboutPage = () => {
  const seoData = {
    title: "À Propos d'ARTIMMO - Promoteur Immobilier Algérie",
    description: "16 ans d'expertise en promotion immobilière haut standing à Alger. Découvrez notre vision, nos valeurs et notre engagement pour l'excellence.",
    keywords: [
      "promoteur immobilier alger",
      "artimmo",
      "immobilier haut standing",
      "expertise immobiliere",
      "algerie"
    ],
    path: '/artimmo'
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="page-content pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-brand-blue uppercase tracking-[3px] text-xs font-medium">
              Notre Histoire
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white mt-3 mb-6">
              l'habitation d'exception élevée au rang d'art
            </h1>
            <p className="text-brand-sage max-w-2xl mx-auto">
              16 ans à redéfinir les standards du haut standing à Alger.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-3xl text-white mb-6">Une Vision, Une Mission</h2>
              <p className="text-brand-sage leading-relaxed">
                Chez ARTIMMO, acquérir un appartement à Alger représente bien plus qu'une simple démarche immobilière : c'est un choix stratégique, un projet de vie, ou une décision patrimoniale mûrement réfléchie. En tant que promoteur immobilier de référence en Algérie, ARTIMMO accompagne ses clients avec des programmes immobiliers neufs, structurés et cohérents, implantés dans des adresses à fort potentiel, dont les secteurs les plus prisés de la wilaya d'Alger incluant Ouled Fayet, Draria ou encore Chéraga, et offrant des Simplex haut standing et des duplex premium aux finitions nobles, des espaces communs soignés, des parkings sécurisés et des commerces sélectionnés en pied d'immeuble, ce luxe de proximité qui transforme le quotidien. Chaque acquisition est pensée comme une opportunité de croissance patrimoniale à long terme, soutenue par un accompagnement juridique et administratif complet, des délais contractuels tenus et une vision orientée valorisation et sécurité, que vous souhaitiez habiter, transmettre ou investir.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <img 
                src={oxygen}
                alt="ARTIMMO Promotion Immobilier" 
                className="rounded-2xl w-full" 
              />
            </motion.div>
          </div>

          <Values />
          <Timeline />
          <Departments />
        </div>
      </div>
    </>
  )
}

export default AboutPage