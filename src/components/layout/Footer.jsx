import { Link } from 'react-router-dom'
import { NAV_ITEMS, CONTACT_INFO } from '../../utils/constants'
import { projectsData } from '../../data/projects'

const Footer = () => {
  return (
    <footer className="border-t border-brand-primary/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="font-playfair text-2xl font-bold text-white">
              ARTI<span className="text-brand-blue">MMO</span>
            </span>
            <p className="text-brand-sage text-sm mt-4">
              L'habitation d'exception élevée au rang d'art.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map(item => (
                <li key={item.id}>
                  <Link 
                    to={item.path} 
                    className="text-brand-sage text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Nos résidences</h4>
            <ul className="space-y-2">
              {projectsData.map(project => (
                <li key={project.id}>
                  <Link 
                    to={`/nos-signatures/${project.slug}`}
                    className="text-brand-sage text-sm hover:text-white transition-colors"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-brand-sage text-sm">
              <li>{CONTACT_INFO.address}</li>
              <li>{CONTACT_INFO.phone}</li>
              <li>{CONTACT_INFO.email}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-primary/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-sage text-xs">
            © {new Date().getFullYear()} ARTIMMO Promotion Immobilière. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {['facebook', 'instagram', 'linkedin'].map(social => (
              <a 
                key={social} 
                href="#" 
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-brand-sage hover:text-white transition-colors"
                aria-label={social}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer