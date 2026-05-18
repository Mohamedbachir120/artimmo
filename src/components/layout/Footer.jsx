import { Link } from 'react-router-dom'
import { NAV_ITEMS, CONTACT_INFO } from '../../utils/constants'
import { projectsData } from '../../data/projects'
import LogoWhite from "./../../assets/artimmo-white.png"

export const GoogleMap = () => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
        <span className="text-white text-sm font-medium">Notre Emplacement</span>
      </div>
      <div className="relative group">
        <iframe
          title="ARTIMMO Promotion Immobilière"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3197.609495173752!2d2.9661866!3d36.7319388!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128faf5c8a292f85%3A0x2a94e036d282856!2sARTIMMO%20Promotion%20Immobili%C3%A8re!5e0!3m2!1sfr!2sdz!4v1779124982465!5m2!1sfr!2sdz"
          width="100%"
          height="180"
         // Inside your iframe style:
          style={{ 
            border: 0,
            /* ✅ Grayscale removes red, then invert makes it dark grey/blue */

          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}


const Footer = () => {
  return (
    <footer className="border-t border-brand-primary/30 pt-12 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <img src={LogoWhite} alt="logo artimmo" width={180} className="mt-4" />
             
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
              <li className="flex items-start gap-2">
                <span className="text-brand-blue mt-0.5">📍</span>
                {CONTACT_INFO.address}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-blue">📞</span>
                {CONTACT_INFO.phone}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-blue">✉️</span>
                {CONTACT_INFO.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <GoogleMap />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-primary/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-sage text-xs">
            © {new Date().getFullYear()} ARTIMMO Promotion Immobilière. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {['facebook', 'instagram', 'linkedin'].map(social => (
              <a 
                key={social} 
                href="#" 
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-brand-sage hover:text-white hover:border-brand-blue/50 transition-all"
                aria-label={social}
              >
                {/* ✅ YOUR ORIGINAL SVG — no missing component */}
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

