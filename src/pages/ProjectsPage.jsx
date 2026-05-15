import { useState, useMemo } from 'react'
import SEOHead from '../seo/SEOHead'
import SectionTitle from '../components/common/SectionTitle'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectCard from '../components/projects/ProjectCard'
import { filterProjects } from '../data/projects'

const ProjectsPage = () => {
  const [filters, setFilters] = useState({
    city: 'all',
    type: 'all',
    status: 'all'
  })

  const filteredProjects = useMemo(() => filterProjects(filters), [filters])

  const seoData = {
    title: "Nos Résidences Haut Standing",
    description: "Découvrez toutes les résidences ARTIMMO à Alger. Appartements F3, F4, F5 et duplex premium à Ouled Fayet, Chéraga et Draria.",
    keywords: [
      "residences alger",
      "appartement neuf alger",
      "duplex haut standing",
      "promotion immobiliere alger",
      "logement neuf"
    ],
    path: '/nos-signatures'
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="page-content pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            tag="Catalogue" 
            title="Nos réalisations" 
            subtitle="L'excellence livrée clé en main" 
          />

          <ProjectFilters filters={filters} onFilterChange={setFilters} />

          <p className="text-brand-sage text-sm mb-6">
            {filteredProjects.length} résidence(s) trouvée(s)
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brand-sage">Aucune résidence ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProjectsPage