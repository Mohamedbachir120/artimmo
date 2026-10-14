// Floor footprints [minX, minZ, maxX, maxZ] of furniture the visitor walks around.
// Kept next to Furniture.jsx placements: update both together.
export const furnitureObstacles = [
  // Entrance console
  [1.38, 0.4, 1.73, 1.6],
  // Kitchen: tall units + worktop run, island, stools
  [1.87, 0.15, 6.0, 0.8],
  [2.5, 1.9, 4.9, 2.9],
  [2.8, 3.0, 4.6, 3.4],
  // Dining table and chairs
  [0.75, 4.3, 3.45, 6.5],
  // Living: sofa, coffee table, lounge chair + lamp, sideboard, plants
  [4.4, 4.0, 7.0, 4.95],
  [5.2, 5.4, 6.2, 6.4],
  [6.9, 5.75, 7.75, 6.75],
  [7.25, 4.2, 7.65, 4.65],
  [7.45, 0.6, 7.93, 2.8],
  [0.25, 7.2, 0.8, 7.75],
  // Bedroom: bed with nightstands and bench, wardrobe, reading chair
  [9.4, 3.07, 12.5, 5.85],
  [8.07, 5.0, 8.67, 7.6],
  [11.75, 6.55, 12.65, 7.45],
  // Bathroom: shower, vanity, bathtub
  [8.07, 0.15, 9.1, 1.45],
  [9.7, 0.15, 11.5, 0.7],
  [11.9, 0.55, 12.8, 2.45],
  // Terrace: planter, sun loungers, potted tree
  [0.08, 8.4, 0.62, 10.3],
  [4.75, 8.85, 6.85, 10.15],
  [7.2, 8.3, 7.8, 8.9],
]
