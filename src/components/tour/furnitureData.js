import * as THREE from 'three'

// Shared helpers and data for Furniture.jsx (kept apart so that file only
// exports components).

const geoCache = new Map()
export const cached = (key, make) => {
  if (!geoCache.has(key)) geoCache.set(key, make())
  return geoCache.get(key)
}
export const cyl = (rt, rb, h, seg = 20) =>
  cached(`c${rt}|${rb}|${h}|${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg))
export const sphere = (r, seg = 24) => cached(`s${r}|${seg}`, () => new THREE.SphereGeometry(r, seg, seg / 2))

export const disposeFurnitureGeometry = () => {
  geoCache.forEach((g) => g.dispose())
  geoCache.clear()
}

// Deterministic generator so decor looks identical on every visit
export const seededRandom = (seed) => {
  const state = { t: Math.max(1, Math.floor(seed * 9301)) % 2147483647 }
  return () => {
    state.t = (state.t * 16807) % 2147483647
    return state.t / 2147483647
  }
}

// Evening light sources (positions match the lamps below)
export const lampLights = [
  { position: [3.7, 1.75, 2.4], intensity: 3.2, distance: 6 },
  { position: [2.1, 1.65, 5.4], intensity: 3.2, distance: 6 },
  { position: [7.45, 1.45, 4.42], intensity: 2.6, distance: 6 },
  { position: [9.7, 0.85, 3.4], intensity: 1.4, distance: 4 },
  { position: [12.2, 0.85, 3.4], intensity: 1.4, distance: 4 },
  { position: [10.6, 1.95, 0.45], intensity: 1.8, distance: 4.5 },
]
