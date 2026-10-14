// Médias de chantier affichés au survol des cartes projet (ConstructionReveal).
//
// ⚠️ Uniquement des médias RÉELS du projet concerné : jamais d'images d'un autre
// immeuble ni de chantier « reconstitué ». Sans entrée ici, la carte garde sa
// photo de couverture (léger zoom au survol) — rien n'est simulé.
//
// Deux formats possibles par projet (clé = slug) :
//
// 1. Vidéo (préféré) — fichiers dans /public/construction/<slug>/,
//    encodés avec scripts/encode-construction-video.sh :
//    'residence-oxygene': {
//      video: {
//        webm: '/construction/residence-oxygene/reveal-1280.webm',
//        mp4: '/construction/residence-oxygene/reveal-1280.mp4',
//        mp4Mobile: '/construction/residence-oxygene/reveal-720.mp4', // optionnel
//      },
//      // Repères affichés en surimpression (secondes dans la vidéo)
//      chapters: [
//        { at: 0, label: 'Terrain' },
//        { at: 2.5, label: 'Fondations' },
//        { at: 5, label: 'Gros œuvre' },
//        { at: 8, label: 'Façades & finitions' },
//        { at: 11, label: 'Livraison' },
//      ],
//      credit: 'Drone chantier ARTIMMO, 2014–2016',
//    },
//
// 2. Photos réelles du chantier (même cadrage, du terrain à la livraison),
//    enchaînées en fondu continu façon film :
//    'residence-splendia': {
//      stages: [
//        { src: '/construction/residence-splendia/01-terrain.webp', label: 'Terrain' },
//        { src: '/construction/residence-splendia/02-fondations.webp', label: 'Fondations' },
//        ...
//      ],
//      credit: 'Photos chantier ARTIMMO',
//    },
//
// Aucun projet n'a encore de média de chantier réel dans le dépôt.
export const constructionMedia = {}

export const getConstructionMedia = (slug) => constructionMedia[slug] ?? null

// ─── Aperçu en développement uniquement ─────────────────────────────────────
// Film de démonstration pour tester le survol tant que les vrais médias
// manquent. Ce chantier (SPIE, France) n'a AUCUN lien avec les résidences
// ARTIMMO : la carte l'indique pendant la lecture, et ni ces entrées ni les
// fichiers /construction/_demo n'existent dans le build de production.
// Source : « Construction Timelapse - SPIE », MELKARTIS, CC BY 3.0, Wikimedia Commons.
if (import.meta.env.DEV) {
  const credit = 'Démo : MELKARTIS, CC BY 3.0 (Wikimedia Commons)'
  const demoVideo = {
    video: {
      webm: '/construction/_demo/reveal-1280.webm',
      mp4: '/construction/_demo/reveal-1280.mp4',
      mp4Mobile: '/construction/_demo/reveal-720.mp4'
    },
    chapters: [
      { at: 0, label: 'Terrain' },
      { at: 2.6, label: 'Fondations' },
      { at: 4.6, label: 'Gros œuvre' },
      { at: 6.7, label: 'Façades & finitions' },
      { at: 7.9, label: 'Livraison' }
    ],
    credit,
    demo: true
  }
  const demoStages = {
    stages: ['Terrain', 'Fondations', 'Gros œuvre', 'Façades & finitions', 'Livraison']
      .map((label, i) => ({ src: `/construction/_demo/stage-${i + 1}.webp`, label })),
    credit,
    demo: true
  }
  for (const slug of ['residence-oxygene', 'residences-solarium', 'residence-atmosphere']) {
    constructionMedia[slug] ??= demoVideo
  }
  // Une carte en mode photos pour prévisualiser ce rendu aussi
  constructionMedia['residence-splendia'] ??= demoStages
}
