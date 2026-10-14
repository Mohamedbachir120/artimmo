import { useCallback, useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import PropertyTour from '../components/tour/PropertyTour'
import { getProjectBySlug } from '../data/projects'

const PropertyTourPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = getProjectBySlug(slug)

  // The tour is a full-screen experience: freeze the page behind it
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const onExit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    navigate(`/nos-signatures/${slug}`)
  }, [navigate, slug])

  if (!project) return <Navigate to="/nos-signatures" replace />

  return (
    <>
      <SEOHead
        title={`Visite immersive 3D | ${project.name}`}
        description={`Visitez en 3D un appartement témoin de la ${project.name} à ${project.city} : séjour, cuisine, suite parentale, salle de bain et terrasse.`}
        path={`/nos-signatures/${project.slug}/visite-3d`}
        image={project.images[0].src}
      />
      <PropertyTour project={project} onExit={onExit} />
    </>
  )
}

export default PropertyTourPage
