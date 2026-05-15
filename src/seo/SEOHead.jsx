import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../utils/constants'

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  path = '',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  structuredData = null
}) => {
  const fullTitle = `${title} | ${SITE_NAME}`
  const fullUrl = `${SITE_URL}${path}`

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead