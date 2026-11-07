import { Link } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ProjectCard from '../components/projects/ProjectCard'
import { projectsData } from '../data/projects'
import AreaLinks from '../components/common/AreaLinks'

const LocalLandingPage = ({ page }) => {
  const projects = page.city
    ? projectsData.filter((p) => p.city === page.city)
    : projectsData

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.description}
        path={`/${page.slug}`}
        keywords={[
          `promotion immobilière ${page.area.toLowerCase()}`,
          `promoteur immobilier ${page.area.toLowerCase()}`,
          `appartement haut standing ${page.area.toLowerCase()}`,
        ]}
      />
      <div className="page-content pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-blue uppercase tracking-[3px] text-xs font-medium">
            ARTIMMO Promotion
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl text-white mt-3 mb-6">
            {page.h1}
          </h1>
          <div className="max-w-3xl space-y-4 mb-12">
            {page.intro.map((text) => (
              <p key={text.slice(0, 32)} className="text-brand-sage leading-relaxed">
                {text}
              </p>
            ))}
          </div>

          <h2 className="font-playfair text-2xl md:text-3xl text-white mb-6">
            Nos résidences {page.city ? `à ${page.area}` : 'à Alger'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <Link
            to="/parlons-en"
            className="inline-block px-6 py-3 rounded-lg bg-brand-primary text-white font-medium mb-12"
          >
            Prendre rendez-vous
          </Link>

          <div className="border-t border-brand-primary/30 pt-6">
            <p className="text-white font-semibold mb-3">Promotion immobilière par commune</p>
            <AreaLinks exclude={page.slug} />
          </div>
        </div>
      </div>
    </>
  )
}

export default LocalLandingPage
