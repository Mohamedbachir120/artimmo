import SectionTitle from '../common/SectionTitle'
import GlassCard from '../common/GlassCard'

const values = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Excellence",
    desc: "Des matériaux d'exception sélectionnés avec rigueur, pour des finitions qui défient le temps."
  },
  {
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Pérennité",
    desc: "Une architecture pensée pour durer, alliant performance énergétique et responsabilité environnementale."
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Engagement",
    desc: "Un accompagnement exclusif et sur-mesure, de la première esquisse jusqu'à la remise des clés."
  }
]

const Values = () => {
  return (
    <>
      <SectionTitle tag="Notre signature" title="Ce qui forge notre identité" />
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {values.map((value, i) => (
          <GlassCard key={i} className="p-6 text-center" hover={false}>
            <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
            <p className="text-brand-sage text-sm">{value.desc}</p>
          </GlassCard>
        ))}
      </div>
    </>
  )
}

export default Values