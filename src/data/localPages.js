// Landing pages for "promotion immobilière <area>" searches.
// Plain data (no imports) so scripts/prerender-seo.mjs can read it at build time.
// Each page has its own text: near-identical pages would be treated as doorway pages.

export const localPages = [
  {
    slug: 'promotion-immobiliere-alger',
    city: null, // every residence
    area: 'Alger',
    title: 'Promotion immobilière à Alger – Appartements haut standing',
    description:
      "ARTIMMO Promotion, promotion immobilière à Alger : 722 logements haut standing livrés à Ouled Fayet, Chéraga et Draria. Appartements F3, F4, F5 et duplex.",
    h1: 'Promotion immobilière à Alger',
    intro: [
      "ARTIMMO Promotion est une société de promotion immobilière basée à Ouled Fayet, dans le Grand Alger. Nos quatre programmes résidentiels haut standing livrés représentent 722 logements, dans trois communes de l'ouest algérois : Ouled Fayet, Chéraga et Draria.",
      "Chaque programme est pensé comme un ensemble cohérent : architecture contemporaine, volumes généreux, lumière naturelle et finitions durables. Nos appartements vont du F3 au F5, avec des duplex sur certaines résidences, et des surfaces de 100 à 350 m².",
      "Vous cherchez un appartement neuf auprès d'un promoteur immobilier à Alger ? Découvrez nos résidences ci-dessous ou prenez rendez-vous avec un conseiller pour une visite sur site.",
    ],
  },
  {
    slug: 'promotion-immobiliere-ouled-fayet',
    city: 'Ouled Fayet',
    area: 'Ouled Fayet',
    title: 'Promotion immobilière à Ouled Fayet – Résidence OXYGÈNE',
    description:
      "Promotion immobilière à Ouled Fayet, Alger : la Résidence OXYGÈNE, 155 appartements F3, F4, F5 et duplex de 120 à 250 m². Promoteur ARTIMMO, siège à Ouled Fayet.",
    h1: 'Promotion immobilière à Ouled Fayet',
    intro: [
      "Ouled Fayet est la commune d'origine d'ARTIMMO Promotion : notre siège s'y trouve, et c'est là que nous avons livré la Résidence OXYGÈNE, sur le Boulevard des Grands Vents.",
      "OXYGÈNE compte 155 logements répartis en immeubles R+5 : des F3, F4, F5 et duplex de 120 à 250 m², avec des commerces en pied d'immeuble. La commune offre un cadre verdoyant et calme, tout en restant proche du centre d'Alger.",
    ],
  },
  {
    slug: 'promotion-immobiliere-cheraga',
    city: 'Chéraga',
    area: 'Chéraga',
    title: 'Promotion immobilière à Chéraga – SOLARIUM et SPLENDIA',
    description:
      "Promotion immobilière à Chéraga, Alger : Résidences SOLARIUM (318 logements, 3 tours R+15) et Résidence SPLENDIA (166 logements). Appartements F3 à F5 par ARTIMMO.",
    h1: 'Promotion immobilière à Chéraga',
    intro: [
      "À Chéraga, ARTIMMO Promotion a livré deux programmes aux identités très différentes, pour un total de 484 logements.",
      "Les Résidences SOLARIUM réunissent 318 logements dans trois tours R+15 avec attique, organisées autour d'une esplanade centrale, avec des espaces professionnels au rez-de-chaussée et des vues dégagées sur Alger. Appartements F3, F4 et F5 de 100 à 180 m².",
      "La Résidence SPLENDIA est une résidence basse de 166 logements à l'architecture homogène, avec des F3, F4 et F5 de 110 à 200 m².",
    ],
  },
  {
    slug: 'promotion-immobiliere-draria',
    city: 'Draria',
    area: 'Draria',
    title: 'Promotion immobilière à Draria – Résidence ATMOSPHÈRE',
    description:
      "Promotion immobilière à Draria, Alger : la Résidence ATMOSPHÈRE, 83 logements F4, F5 et duplex de 150 à 350 m², faible densité, spa et hammam. Par ARTIMMO.",
    h1: 'Promotion immobilière à Draria',
    intro: [
      "À Draria, ARTIMMO Promotion a fait le choix de la faible densité avec la Résidence ATMOSPHÈRE : 83 logements seulement, répartis sur 9 immeubles en R+5.",
      "Les appartements, du F4 au F5 et en duplex, offrent de 150 à 350 m². La résidence dispose d'un spa et d'un hammam. Ici, le luxe tient moins à la hauteur des bâtiments qu'à la qualité de vie au quotidien.",
    ],
  },
]

export const getLocalPage = (slug) => localPages.find((p) => p.slug === slug)
