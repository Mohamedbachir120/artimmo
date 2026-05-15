import { motion } from 'framer-motion'
import { LOCALITIES, TYPES, STATUSES } from '../../utils/constants'
import GlassCard from '../common/GlassCard'

const ProjectFilters = ({ filters, onFilterChange }) => {
  const selectClasses = "w-full bg-brand-dark border border-brand-primary/30 rounded-lg p-3 text-white focus:border-brand-blue outline-none transition-colors"

  return (
    <GlassCard variant="default" className="p-6 mb-10" hover={false}>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
            Localité
          </label>
          <select 
            value={filters.city} 
            onChange={(e) => onFilterChange({...filters, city: e.target.value})}
            className={selectClasses}
            aria-label="Filtrer par localité"
          >
            <option value="all">Toutes les localités</option>
            {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
            Type
          </label>
          <select 
            value={filters.type} 
            onChange={(e) => onFilterChange({...filters, type: e.target.value})}
            className={selectClasses}
            aria-label="Filtrer par type"
          >
            <option value="all">Tous les types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
            Statut
          </label>
          <select 
            value={filters.status} 
            onChange={(e) => onFilterChange({...filters, status: e.target.value})}
            className={selectClasses}
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les projets</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </GlassCard>
  )
}

export default ProjectFilters