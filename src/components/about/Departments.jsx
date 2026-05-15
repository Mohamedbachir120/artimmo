import { departments } from '../../data/departments'
import SectionTitle from '../common/SectionTitle'
import GlassCard from '../common/GlassCard'

const Departments = () => {
  return (
    <>
      <SectionTitle tag="Équipe" title="Nos départements" />
      <div className="grid md:grid-cols-3 gap-6">
        {departments.map((dept, i) => (
          <GlassCard key={dept.id} className="p-8 text-center group" hover={false}>
            <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-blue/30 transition-colors">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={dept.icon} />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-3">{dept.name}</h3>
            <p className="text-brand-sage text-sm leading-relaxed">{dept.desc}</p>
          </GlassCard>
        ))}
      </div>
    </>
  )
}

export default Departments