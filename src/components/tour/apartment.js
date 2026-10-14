// Representative show apartment ("appartement témoin") used by the 3D tour.
// Units are meters. X runs west → east, Z runs north → south, Y is up.
// The plan is data-driven so another layout can be added without touching the
// rendering code: rooms, walls (with openings), viewpoints and hotspots.

export const CEILING_HEIGHT = 2.8
export const EYE_HEIGHT = 1.62

const INT = 0.14 // interior partition thickness
const EXT = 0.3 // façade thickness

// Room rectangles: [minX, minZ, maxX, maxZ]
export const rooms = [
  {
    id: 'entree',
    name: 'Entrée',
    rect: [0, 0, 1.8, 3.4],
    floor: 'stone',
    surfaceIncluded: false,
  },
  {
    id: 'cuisine',
    name: 'Cuisine ouverte',
    rect: [1.8, 0, 7.2, 3.4],
    floor: 'oak',
  },
  {
    id: 'sejour',
    name: 'Séjour & salle à manger',
    rect: [0, 3.4, 8, 8],
    floor: 'oak',
  },
  {
    id: 'chambre',
    name: 'Suite parentale',
    rect: [8, 3, 13, 8],
    floor: 'oak',
  },
  {
    id: 'bain',
    name: 'Salle de bain',
    rect: [8, 0, 13, 3],
    floor: 'stone',
  },
  {
    id: 'terrasse',
    name: 'Terrasse',
    rect: [0, 8, 8, 10.4],
    floor: 'terrace',
    outdoor: true,
  },
]

// The alcove strip [7.2..8] x [0..3.4] by the sideboard belongs to the living space.
rooms.push({ id: 'sejour-nord', parent: 'sejour', name: 'Séjour & salle à manger', rect: [7.2, 0, 8, 3.4], floor: 'oak' })

export const roomArea = (room) => {
  const [x0, z0, x1, z1] = room.rect
  return (x1 - x0) * (z1 - z0)
}

// Visible rooms (merges sub-rectangles under their parent)
export const tourRooms = rooms.filter((r) => !r.parent)

export const areaOf = (id) =>
  rooms.filter((r) => r.id === id || r.parent === id).reduce((sum, r) => sum + roomArea(r), 0)

export const findRoomAt = (x, z) => {
  const hit = rooms.find(({ rect: [x0, z0, x1, z1] }) => x >= x0 && x <= x1 && z >= z0 && z <= z1)
  if (!hit) return null
  return hit.parent ?? hit.id
}

// Walls: axis-aligned segments. Openings are measured along the wall from `a`.
// type: door (walkable gap) | window (sill + glass) | glazing (floor-to-ceiling glass)
export const walls = [
  // North façade
  { a: [0, 0], b: [8, 0], t: EXT, exterior: true },
  { a: [8, 0], b: [13, 0], t: EXT, exterior: true },
  // West façade with the front door
  {
    a: [0, 0], b: [0, 8], t: EXT, exterior: true,
    openings: [{ from: 0.55, to: 1.55, bottom: 0, top: 2.25, type: 'frontdoor' }],
  },
  // East façade: bathroom and bedroom windows
  {
    a: [13, 0], b: [13, 8], t: EXT, exterior: true,
    openings: [
      { from: 0.7, to: 2.3, bottom: 1.25, top: 2.35, type: 'window', frosted: true },
      { from: 4.4, to: 7.2, bottom: 0.45, top: 2.45, type: 'window' },
    ],
  },
  // South façade of the living room: sliding bay window onto the terrace
  {
    a: [0, 8], b: [8, 8], t: EXT, exterior: true,
    openings: [
      { from: 0.5, to: 3.2, bottom: 0, top: 2.55, type: 'glazing' },
      { from: 3.2, to: 5.0, bottom: 0, top: 2.55, type: 'slider' },
      { from: 5.0, to: 7.5, bottom: 0, top: 2.55, type: 'glazing' },
    ],
  },
  // South façade of the bedroom
  {
    a: [8, 8], b: [13, 8], t: EXT, exterior: true,
    openings: [{ from: 1.0, to: 4.0, bottom: 0.45, top: 2.45, type: 'window' }],
  },
  // Entrance hall / kitchen partition, open towards the living room
  { a: [1.8, 0], b: [1.8, 1.9], t: INT },
  // Partition between living space and the bedroom suite
  {
    a: [8, 0], b: [8, 8], t: INT,
    openings: [{ from: 3.55, to: 4.45, bottom: 0, top: 2.2, type: 'door' }],
  },
  // Bathroom / bedroom partition with the en-suite door
  {
    a: [8, 3], b: [13, 3], t: INT,
    openings: [{ from: 0.35, to: 1.15, bottom: 0, top: 2.2, type: 'door' }],
  },
]

// Glass balustrade around the terrace
export const terraceRailing = [
  { a: [0, 10.4], b: [8, 10.4] },
  { a: [0, 8], b: [0, 10.4] },
  { a: [8, 8], b: [8, 10.4] },
]

// Viewpoints the tour can glide to: where the visitor stands and what they face.
const view = (position, lookAt, pitch = -0.06) => ({
  position,
  yaw: Math.atan2(-(lookAt[0] - position[0]), -(lookAt[1] - position[1])),
  pitch,
})

export const viewpoints = {
  entree: view([0.9, 2.3], [5.0, 7.2], -0.05),
  cuisine: view([6.9, 1.5], [2.0, 2.3], -0.13),
  sejour: view([1.3, 3.9], [6.5, 7.6], -0.07),
  chambre: view([9.0, 7.3], [11.6, 3.4], -0.1),
  bain: view([9.0, 2.4], [12.2, 1.0], -0.12),
  terrasse: view([1.6, 9.5], [7.5, 11.5], -0.03),
}

export const START_VIEW = 'entree'

// Points of interest. `position` is [x, y, z] in meters.
export const hotspots = [
  {
    id: 'baie',
    room: 'sejour',
    position: [4.1, 1.5, 7.75],
    title: 'Baie vitrée coulissante',
    body: "Près de 7 m de vitrage toute hauteur sur la terrasse. La lumière du sud baigne le séjour du matin au soir.",
  },
  {
    id: 'sejour-volume',
    room: 'sejour',
    position: [6.2, 2.3, 5.4],
    title: 'Séjour traversant',
    body: `Un volume ouvert de ${Math.round(areaOf('sejour'))} m² sous 2,80 m de hauteur libre, qui réunit salon et salle à manger.`,
  },
  {
    id: 'ilot',
    room: 'cuisine',
    position: [3.5, 1.2, 2.45],
    title: 'Îlot central en marbre',
    body: "Plan de travail en pierre naturelle veinée, électroménager intégré et rangements toute hauteur sur le mur nord.",
  },
  {
    id: 'parquet',
    room: 'sejour',
    position: [2.2, 0.15, 6.4],
    title: 'Parquet en chêne',
    body: "Lames larges en chêne posées à l'anglaise dans les pièces de vie et la suite parentale.",
  },
  {
    id: 'suite',
    room: 'chambre',
    position: [10.9, 1.4, 3.3],
    title: 'Suite parentale',
    body: `Chambre de ${Math.round(areaOf('chambre'))} m² avec dressing, double exposition sud et est, et salle de bain attenante.`,
  },
  {
    id: 'dressing',
    room: 'chambre',
    position: [8.45, 1.6, 6.4],
    title: 'Dressing intégré',
    body: "Placards toute hauteur en façade laquée, avec éclairage intérieur.",
  },
  {
    id: 'baignoire',
    room: 'bain',
    position: [12.35, 0.9, 1.5],
    title: 'Baignoire îlot',
    body: "Baignoire posée au sol sous la fenêtre, douche à l'italienne vitrée et double vasque.",
  },
  {
    id: 'terrasse-info',
    room: 'terrasse',
    position: [6.4, 1.3, 9.9],
    title: 'Terrasse filante',
    body: `${Math.round(areaOf('terrasse'))} m² abrités par le débord de la dalle supérieure, garde-corps en verre pour préserver la vue.`,
  },
]
