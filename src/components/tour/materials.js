import * as THREE from 'three'

// One shared material per finish keeps draw state small and lets every mesh
// that uses the same finish batch on the GPU.
export const createMaterials = (tex) => {
  const std = (params) => new THREE.MeshStandardMaterial(params)
  const phys = (params) => new THREE.MeshPhysicalMaterial(params)

  const m = {
    oak: std({ ...tex.oak, roughness: 1, color: 0xffffff, envMapIntensity: 0.9 }),
    stone: std({ ...tex.stone, roughness: 1, envMapIntensity: 0.9 }),
    terrace: std({ ...tex.terrace, roughness: 1, envMapIntensity: 0.7 }),
    wall: std({ ...tex.plaster, color: 0xefeae2, roughness: 1, envMapIntensity: 0.6, shadowSide: THREE.FrontSide }),
    wallExterior: std({ ...tex.plaster, color: 0xe6dfd3, roughness: 1, envMapIntensity: 0.5 }),
    accentWall: std({ ...tex.plaster, color: 0x5d6b66, roughness: 1, envMapIntensity: 0.5 }),
    // Front-face shadows on walls and slab: rendering back faces (three's default)
    // lets a thin band of sunlight leak along every wall/ceiling/floor junction
    ceiling: std({ color: 0xf6f3ee, roughness: 0.95, envMapIntensity: 0.5, shadowSide: THREE.FrontSide }),
    bathWall: std({ ...tex.stone, color: 0xf2efe9, roughness: 1, envMapIntensity: 0.9 }),
    marble: phys({ ...tex.marble, roughness: 0.12, clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 1 }),
    walnut: std({ ...tex.walnut, roughness: 1, envMapIntensity: 0.8 }),
    lacquer: phys({ color: 0xe9e4dc, roughness: 0.35, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    lacquerDark: phys({ color: 0x2b3236, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
    brass: std({ color: 0xc9a46a, metalness: 1, roughness: 0.28 }),
    blackMetal: std({ color: 0x1d1f21, metalness: 0.8, roughness: 0.45 }),
    chrome: std({ color: 0xdedede, metalness: 1, roughness: 0.08 }),
    aluminium: std({ color: 0x3a3c3e, metalness: 0.85, roughness: 0.38 }),
    skirting: std({ color: 0xf1ede6, roughness: 0.55 }),
    glass: phys({
      color: 0xffffff, roughness: 0.02, metalness: 0, transparent: true, opacity: 0.14,
      envMapIntensity: 1.4, depthWrite: false, side: THREE.DoubleSide,
    }),
    frosted: phys({ color: 0xf4f6f7, roughness: 0.6, transparent: true, opacity: 0.78, depthWrite: false }),
    showerGlass: phys({
      color: 0xe8f0f0, roughness: 0.03, transparent: true, opacity: 0.18,
      envMapIntensity: 1.2, depthWrite: false, side: THREE.DoubleSide,
    }),
    mirror: std({ color: 0xd9dcdd, metalness: 1, roughness: 0.02, envMapIntensity: 1.3 }),
    sofa: std({ ...tex.linen, color: 0xc9c0b2, roughness: 0.92, envMapIntensity: 0.6 }),
    cushionSage: std({ ...tex.linen, color: 0x9fb2a7, roughness: 0.95, envMapIntensity: 0.6 }),
    cushionNavy: std({ ...tex.linen, color: 0x31475e, roughness: 0.95, envMapIntensity: 0.6 }),
    bedLinen: std({ ...tex.linen, color: 0xf3f0ea, roughness: 0.95, envMapIntensity: 0.6 }),
    throwBlanket: std({ ...tex.linen, color: 0x8a9c90, roughness: 0.97, envMapIntensity: 0.5 }),
    headboard: std({ ...tex.linen, color: 0x7a6e60, roughness: 0.96, envMapIntensity: 0.5 }),
    leather: std({ color: 0x6b4a33, roughness: 0.5, envMapIntensity: 0.8 }),
    rug: std({ ...tex.linen, color: 0xd8d0c2, roughness: 1, envMapIntensity: 0.4 }),
    rugBedroom: std({ ...tex.linen, color: 0xb9b2a4, roughness: 1, envMapIntensity: 0.4 }),
    ceramic: phys({ color: 0xfbfbf9, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    ceramicMatte: std({ color: 0xece7df, roughness: 0.6 }),
    terracotta: std({ color: 0xa8664a, roughness: 0.85 }),
    planter: std({ color: 0x4a4b48, roughness: 0.75 }),
    soil: std({ color: 0x2e241d, roughness: 1 }),
    leaf: std({ color: 0x4f6b47, roughness: 0.75, side: THREE.DoubleSide }),
    leafLight: std({ color: 0x6f8c5a, roughness: 0.7, side: THREE.DoubleSide }),
    bark: std({ color: 0x5a4a3c, roughness: 0.95 }),
    screen: std({ color: 0x050607, roughness: 0.15, metalness: 0.3 }),
    book: std({ color: 0x8b7a66, roughness: 0.8 }),
    bookAlt: std({ color: 0x3e4d57, roughness: 0.8 }),
    teak: std({ ...tex.walnut, color: 0xd9b48a, roughness: 1, envMapIntensity: 0.6 }),
    outdoorFabric: std({ ...tex.linen, color: 0xe7e1d6, roughness: 0.95 }),
    shadeLinen: std({ color: 0xf2e8d8, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffd9a0, emissiveIntensity: 0 }),
    bulb: std({ color: 0xfff4e0, emissive: 0xffd7a0, emissiveIntensity: 0 }),
    downlight: std({ color: 0xffffff, emissive: 0xfff1dc, emissiveIntensity: 0.4 }),
    ground: std({ color: 0x9c9784, roughness: 1 }),
    roof: std({ color: 0xbdb6aa, roughness: 0.95 }),
    distant: std({ ...tex.facade, color: 0xffffff, roughness: 0.9, emissive: 0xffffff, emissiveIntensity: 0 }),
    distantShade: std({ color: 0xc9c1b2, roughness: 0.9 }),
    sea: std({ color: 0x5f8ea0, roughness: 0.25, metalness: 0.1 }),
  }
  return m
}

// Lamp materials glow in the evening and stay neutral in daylight
export const applyLightingMode = (m, evening) => {
  m.shadeLinen.emissiveIntensity = evening ? 0.9 : 0
  m.bulb.emissiveIntensity = evening ? 6 : 0
  m.downlight.emissiveIntensity = evening ? 3 : 0.4
  m.distant.emissiveIntensity = evening ? 1.4 : 0
}

export const disposeMaterials = (m) => Object.values(m ?? {}).forEach((mat) => mat.dispose())

// Box geometry whose UVs are expressed in meters, so tiled textures keep a
// constant real-world scale on every face regardless of the box size.
const boxCache = new Map()
export const worldBox = (w, h, d) => {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`
  if (boxCache.has(key)) return boxCache.get(key)
  const geometry = new THREE.BoxGeometry(w, h, d)
  const uv = geometry.attributes.uv
  // Face order: +x, -x, +y, -y, +z, -z (4 vertices each)
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
  for (let face = 0; face < 6; face++) {
    const [su, sv] = dims[face]
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v
      uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    }
  }
  boxCache.set(key, geometry)
  return geometry
}

export const disposeGeometryCache = () => {
  boxCache.forEach((g) => g.dispose())
  boxCache.clear()
}
