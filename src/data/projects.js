// Fichiers déjà renommés en .webp via rename.sh — voir /assets/3D

import oxygene1 from '../assets/3D/v2/residence-oxygene-appartement-haut-standing-ouled-fayet-alger.webp'

import solarium1 from '../assets/3D/v2/residences-solarium-appartements-lumineux-cheraga-alger.webp'
import solarium2 from '../assets/3D/v2/residences-solarium-investissement-immobilier-cheraga-alger.webp'
import solarium2b from '../assets/3D/v2/residences-solarium-tours-residentielles-premium-cheraga-alger.webp'

import splendia1 from '../assets/3D/v2/residence-splendia-appartement-haut-standing-cheraga-alger.webp'

import atmosphere from '../assets/3D/v2/residence-atmosphere-immobilier-haut-standing-draria-alger.webp'

// ⚠️ Utilise encore le placeholder partagé avec SPLENDIA — à remplacer
// dès que le vrai visuel VERDONIA sera prêt et converti en webp.
import verdonia from '../assets/3D/v2/verdonia-residence-facade-nocturne-appartement-haut-standing-alger.webp'

export const projectsData = [
  // {
  //   id: 1,
  //   slug: 'residence-verdonia',
  //   name: "Résidence VERDONIA",
  //   location: "Chéraga — Grand Alger",
  //   city: "Chéraga",
  //   type: "F4",
  //   status: "En cours",
  //   surface: 165,
  //   etage: 3,
  //   bloc: 20,
  //   projectInfo: {
  //     totalLogements: null,
  //     types: ["À définir"],
  //     surfaces: "À définir",
  //     configuration: "En cours de conception"
  //   },
  //   images: [
  //     {
  //       src: verdonia,
  //       // ⚠️ Pas de recommandation SEO fournie pour VERDONIA : ALT provisoire,
  //       // à remplacer une fois l'audit SEO étendu à ce projet.
  //       alt: "Résidence VERDONIA à Chéraga, futur programme immobilier haut standing signé ARTIMMO"
  //     }
  //   ],
  //   badge: "Nouveau",
  //   badgeColor: "#608874",
  //   seo: {
  //     title: "Résidence VERDONIA — En cours de construction",
  //     metaDescription: "Nouvelle résidence premium ARTIMMO actuellement en construction à Chéraga.",
  //     h1: "VERDONIA : la prochaine adresse d'exception signée ARTIMMO"
  //   },
  //   description: "Résidence actuellement en cours de construction à Chéraga. VERDONIA perpétue l'exigence ARTIMMO avec des finitions premium et des espaces communs soignés.",
  //   features: [
  //     "En cours de construction",
  //     "Finitions premium",
  //     "Espaces communs soignés",
  //     "Parking sécurisé",
  //     "Livraison prévue 2026"
  //   ],
  //   year: 2026
  // },
  {
    id: 5,
    slug: 'residence-oxygene',
    name: "Résidence OXYGÈNE",
    location: "Ouled Fayet — Boulevard des Grands Vents",
    city: "Ouled Fayet",
    type: "F4",
    status: "Livré",
    surface: 180,
    etage: 5,
    bloc: 3,
    projectInfo: {
      totalLogements: 155,
      types: ["F3", "F4", "F5", "Duplex"],
      surfaces: "de 120 à 250 m²",
      configuration: "Immeubles R+5"
    },
    images: [
      {
        src: oxygene1,
        alt: "Résidence OXYGÈNE à Ouled Fayet avec appartements haut standing et architecture contemporaine à Alger"
      }
    ],
    badge: "Luxe",
    badgeColor: "#608874",
    seo: {
      title: "Résidence OXYGÈNE | Appartement haut standing Ouled Fayet",
      metaDescription: "Appartements et duplex premium à Ouled Fayet. Investissez dans une promotion immobilière de luxe à Alger.",
      h1: "Résidence OXYGÈNE : l'excellence de l'appartement haut standing à Ouled Fayet",
      keywords: [
        "appartement haut standing Ouled Fayet",
        "résidence OXYGÈNE",
        "promotion immobilière de luxe Alger",
        "duplex premium Alger",
        "immobilier neuf Ouled Fayet",
        "programme immobilier Alger",
        "investissement immobilier premium",
        "résidence de standing Alger"
      ]
    },
    description: "Nichée au cœur d'Ouled Fayet, l'un des quartiers résidentiels les plus convoités du Grand Alger, la Résidence OXYGÈNE s'impose comme une référence de l'appartement haut standing. Ici, la tranquillité d'un cadre verdoyant se conjugue avec l'accessibilité immédiate d'une commune en pleine renaissance urbaine.",
    features: [
      "155 logements (F3, F4, F5, Duplex)",
      "Volumes généreux optimisés",
      "Commerces en pied d'immeuble",
      "Finitions haut de gamme durables",
      "Lumière naturelle optimisée"
    ],
    year: 2016
  },
  {
    id: 2,
    slug: 'residences-solarium',
    name: "Résidences SOLARIUM",
    location: "Chéraga — Grand Alger",
    city: "Chéraga",
    type: "F3",
    status: "Livré",
    surface: 140,
    etage: 6,
    bloc: 2,
    projectInfo: {
      totalLogements: 318,
      types: ["F3", "F4", "F5"],
      surfaces: "de 100 à 180 m²",
      configuration: "3 tours R+15 + attique"
    },
    images: [
      {
        src: solarium1,
        alt: "Résidences SOLARIUM à Chéraga, tour résidentielle moderne avec appartements haut standing et vue dégagée"
      },
      {
        src: solarium2,
        alt: "Tour des Résidences SOLARIUM conçue pour offrir des appartements lumineux avec vues dégagées sur Alger"
      },
      {
        src: solarium2b,
        alt: "Tour des Résidences SOLARIUM intégrée dans un programme immobilier contemporain à forte valeur patrimoniale"
      },
     
    ],
    badge: "Signature",
    badgeColor: "#6AA0AE",
    seo: {
      title: "Résidences SOLARIUM à Chéraga, Tours résidentielles d'exception",
      metaDescription: "Trois tours à Chéraga avec une esplanade centrale. Un projet immobilier premium de référence à Alger.",
      h1: "SOLARIUM : une signature architecturale majeure à Chéraga",
      keywords: [
        "Résidences SOLARIUM",
        "immobilier premium Chéraga",
        "tour résidentielle Alger",
        "appartement haut standing Chéraga",
        "programme immobilier Alger",
        "résidence de standing",
        "investissement immobilier Chéraga",
        "immobilier neuf Alger"
      ]
    },
    description: "SOLARIUM s'organise autour de trois tours distinctes, conçues comme un ensemble cohérent plutôt que comme des entités isolées. Cette verticalité assumée apporte une réelle valeur d'usage, en renforçant la luminosité et l'ouverture des logements.",
    features: [
      "318 logements sur 3 tours",
      "Tours R+15 avec attique",
      "Esplanade centrale structurante",
      "Espaces professionnels en RDC",
      "Perspectives dégagées sur Alger"
    ],
    year: 2017
  },
  {
    id: 3,
    slug: 'residence-splendia',
    name: "Résidence SPLENDIA",
    location: "Chéraga — Grand Alger",
    city: "Chéraga",
    type: "F4",
    status: "Livré",
    surface: 220,
    etage: 4,
    bloc: 10,
    projectInfo: {
      totalLogements: 166,
      types: ["F3", "F4", "F5"],
      surfaces: "de 110 à 200 m²",
      configuration: "Résidence basse"
    },
    // ✅ Corrigé : utilisait l'image "verdonia" par erreur (placeholder).
    // Remplacez splendia1 par le vrai visuel dès qu'il est disponible.
    images: [
      {
        src: splendia1,
        alt: "Résidence SPLENDIA, programme immobilier haut standing avec appartements premium et architecture contemporaine"
      }
    ],
    badge: "Premium",
    badgeColor: "#608874",
    seo: {
      title: "Résidence SPLENDIA Chéraga, Appartement haut standing Alger",
      metaDescription: "Résidence premium à Chéraga avec 166 logements. Un projet immobilier haut standing pensé pour optimiser le confort à Alger.",
      h1: "SPLENDIA : l'élégance résidentielle affirmée à Chéraga",
      keywords: [
        "Résidence SPLENDIA",
        "appartement haut standing Chéraga",
        "immobilier premium Alger",
        "programme immobilier Chéraga",
        "résidence de standing Alger",
        "immobilier neuf Chéraga",
        "investissement immobilier Alger",
        "appartements premium Alger"
      ]
    },
    description: "SPLENDIA se compose de 166 logements pensés dans une logique d'équilibre et de cohérence, où chaque espace participe à une même exigence de qualité. L'ensemble se distingue par une identité architecturale homogène, lisible et maîtrisée.",
    features: [
      "166 logements",
      "Architecture harmonieuse",
      "Esplanade centrale",
      "Finitions durables et élégantes",
      "Volumes généreux étudiés"
    ],
    year: 2018
  },
  {
    id: 4,
    slug: 'residence-atmosphere',
    name: "Résidence ATMOSPHÈRE",
    location: "Draria — Grand Alger",
    city: "Draria",
    type: "F5",
    status: "Livré",
    surface: 350,
    etage: 5,
    bloc: 3,
    projectInfo: {
      totalLogements: 83,
      types: ["F4", "F5", "Duplex"],
      surfaces: "de 150 à 350 m²",
      configuration: "9 immeubles R+5"
    },
    images: [
      {
        src: atmosphere,
        alt: "Façade contemporaine de la Résidence ATMOSPHÈRE, programme immobilier haut standing avec espaces résidentiels premium"
      }
    ],
    badge: "Exclusif",
    badgeColor: "#6AA0AE",
    seo: {
      title: "Résidence ATMOSPHÈRE à Draria, immobilier haut standing Alger",
      metaDescription: "Résidence premium à Draria avec spa, hammam et faible densité. Un investissement immobilier haut standing à forte valeur sur Alger.",
      h1: "ATMOSPHÈRE : quand l'espace devient le véritable luxe à Draria",
      keywords: [
        "résidence ATMOSPHÈRE",
        "immobilier haut standing Draria",
        "résidence premium Alger",
        "appartement neuf Draria",
        "investissement immobilier Alger",
        "programme immobilier haut standing",
        "résidence sécurisée Alger",
        "immobilier neuf Draria"
      ]
    },
    description: "83 logements répartis sur 9 immeubles en R+5 à Draria. Une faible densité assumée pour une qualité de vie supérieure, où le véritable luxe ne réside pas dans la hauteur des bâtiments, mais dans la qualité de vie au quotidien.",
    features: [
      "83 logements / 9 immeubles R+5",
      "Faible densité assumée",
      "Spa & Hammam intégrés",
      "Salle de sport",
      "Parking sous-sol sécurisé"
    ],
    year: 2018
  }
  
]

export const getProjectBySlug = (slug) => projectsData.find(p => p.slug === slug)

export const filterProjects = (filters) => {
  let result = projectsData
  if (filters.city !== 'all') result = result.filter(p => p.city === filters.city)
  if (filters.type !== 'all') result = result.filter(p => p.type === filters.type)
  if (filters.status !== 'all') result = result.filter(p => p.status === filters.status)
  return result
}