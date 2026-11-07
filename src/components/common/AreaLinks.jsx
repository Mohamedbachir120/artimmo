import { Link } from 'react-router-dom'
import { localPages } from '../../data/localPages'

// Links to the "promotion immobilière <commune>" landing pages.
const AreaLinks = ({ exclude, linkClassName = 'text-brand-sage text-sm hover:text-white', className = '' }) => (
  <nav aria-label="Promotion immobilière par commune" className={className}>
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {localPages
        .filter((page) => page.slug !== exclude)
        .map((page) => (
          <li key={page.slug}>
            <Link to={`/${page.slug}`} className={linkClassName}>
              {page.h1}
            </Link>
          </li>
        ))}
    </ul>
  </nav>
)

export default AreaLinks
