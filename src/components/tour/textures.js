import * as THREE from 'three'

// Procedural PBR maps (albedo, roughness, normal) generated on the client.
// They stand in for scanned material libraries: no network, a few MB of GPU
// memory, and every map is sized in real-world meters so it tiles at the
// correct scale on any surface (see `worldSize`).

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0))

// Deterministic PRNG so the apartment looks the same on every visit
const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// Tileable value noise on a `period`-sized lattice
const makeNoise = (seed, period) => {
  const rand = mulberry32(seed)
  const grid = new Float32Array(period * period).map(() => rand())
  const at = (x, y) => grid[((y % period + period) % period) * period + ((x % period + period) % period)]
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const tx = smooth(x - xi)
    const ty = smooth(y - yi)
    const a = at(xi, yi)
    const b = at(xi + 1, yi)
    const c = at(xi, yi + 1)
    const d = at(xi + 1, yi + 1)
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
  }
}

const fbm = (noise, x, y, octaves) => {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq)
    freq *= 2
    amp *= 0.5
  }
  return sum
}

const createCanvas = (size) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return canvas
}

// Height field (0..1) → tangent-space normal map
const normalFromHeight = (height, size, strength) => {
  const canvas = createCanvas(size)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  const h = (x, y) => height[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength
      const dy = (h(x, y + 1) - h(x, y - 1)) * strength
      const len = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

const fieldToCanvas = (field, size, map) => {
  const canvas = createCanvas(size)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let p = 0; p < size * size; p++) {
    const [r, g, b] = map(field[p], p)
    img.data[p * 4] = r
    img.data[p * 4 + 1] = g
    img.data[p * 4 + 2] = b
    img.data[p * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

const toTexture = (canvas, { srgb = false, worldSize = 1 } = {}) => {
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 8
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.repeat.set(1 / worldSize, 1 / worldSize)
  texture.userData.worldSize = worldSize
  return texture
}

const pbrSet = ({ albedo, roughness, normal }, worldSize) => {
  const set = {}
  if (albedo) set.map = toTexture(albedo, { srgb: true, worldSize })
  if (roughness) set.roughnessMap = toTexture(roughness, { worldSize })
  if (normal) set.normalMap = toTexture(normal, { worldSize })
  return set
}

// Wide oak planks, English (staggered) pattern. Covers 2.4 m × 2.4 m.
const oak = async (size = 1024) => {
  const worldSize = 2.4
  const pxPerM = size / worldSize
  const plankW = Math.round(0.2 * pxPerM)
  const plankL = size / 2
  const rows = Math.round(size / plankW)
  const rand = mulberry32(7)
  const grain = makeNoise(11, 64)
  const height = new Float32Array(size * size)
  const albedoField = new Float32Array(size * size)
  const tone = []
  for (let r = 0; r < rows; r++) tone.push([rand(), rand(), rand()])
  for (let y = 0; y < size; y++) {
    const row = Math.min(rows - 1, Math.floor(y / plankW))
    const offset = (row % 3) * (plankL / 3)
    const inRowY = y - row * plankW
    for (let x = 0; x < size; x++) {
      const xs = (x + offset) % size
      const plank = Math.floor(xs / plankL)
      const inPlankX = xs - plank * plankL
      const seed = tone[row][plank]
      const p = y * size + x
      // Long flowing grain stretched along the plank
      const g = fbm(grain, xs / 90 + seed * 40, inRowY / 6 + row * 13.1, 4)
      const rings = Math.sin((inRowY / plankW) * 9 + g * 9 + seed * 6) * 0.5 + 0.5
      albedoField[p] = 0.55 * g + 0.25 * rings + seed * 0.35
      const seam = inRowY < 1.5 || inPlankX < 1.5 ? 0 : 1
      height[p] = seam * (0.85 + 0.15 * rings)
    }
    if (y % 128 === 0) await yieldToBrowser()
  }
  const albedo = fieldToCanvas(albedoField, size, (v, p) => {
    const seam = height[p] === 0 ? 0.55 : 1
    const t = Math.min(1, Math.max(0, v))
    return [(176 - 46 * t) * seam, (134 - 40 * t) * seam, (92 - 34 * t) * seam]
  })
  const roughness = fieldToCanvas(albedoField, size, (v, p) => {
    const r = height[p] === 0 ? 235 : 150 + v * 50
    return [r, r, r]
  })
  const normal = normalFromHeight(height, size, 2.2)
  return pbrSet({ albedo, roughness, normal }, worldSize)
}

// Calacatta-style marble: warm white with soft grey veins. Covers 1.6 m.
const marble = async (size = 1024) => {
  const worldSize = 1.6
  const noise = makeNoise(23, 32)
  const field = new Float32Array(size * size)
  const smoothstep = (a, b, t) => {
    const k = Math.min(1, Math.max(0, (t - a) / (b - a)))
    return k * k * (3 - 2 * k)
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 32
      const v = (y / size) * 32
      const warp = fbm(noise, u * 0.18, v * 0.18, 5)
      const detail = fbm(noise, u * 0.9 + 7, v * 0.9 + 3, 4)
      // Main veins: thin, branching lines following a warped diagonal
      const main = Math.abs(Math.sin((u * 0.09 + v * 0.06) * Math.PI * 2 + warp * 7))
      const fine = Math.abs(Math.sin((u * 0.21 - v * 0.13) * Math.PI * 2 + detail * 9))
      const veins = (1 - smoothstep(0.0, 0.05 + warp * 0.05, main)) * 0.75 + (1 - smoothstep(0.0, 0.025, fine)) * 0.25 * detail
      const cloud = (fbm(noise, u * 0.35, v * 0.35, 4) - 0.5) * 0.12
      field[y * size + x] = Math.min(1, veins) - cloud
    }
    if (y % 128 === 0) await yieldToBrowser()
  }
  const albedo = fieldToCanvas(field, size, (v) => {
    const k = Math.max(0, Math.min(1, v))
    return [246 - 96 * k, 244 - 98 * k, 240 - 104 * k]
  })
  return pbrSet({ albedo }, worldSize)
}

// Large-format natural stone tiles (60 × 120 cm) with thin grout lines.
const stone = async (size = 1024, { warm = false, worldSize = 2.4, seed = 31 } = {}) => {
  const pxPerM = size / worldSize
  const tileW = 1.2 * pxPerM
  const tileH = 0.6 * pxPerM
  const grout = Math.max(1.5, 0.004 * pxPerM)
  const noise = makeNoise(seed, 32)
  const rand = mulberry32(seed)
  const tones = Array.from({ length: 64 }, () => rand())
  const field = new Float32Array(size * size)
  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    const row = Math.floor(y / tileH)
    const offset = row % 2 ? tileW / 2 : 0
    for (let x = 0; x < size; x++) {
      const xs = (x + offset) % size
      const col = Math.floor(xs / tileW)
      const inX = xs - col * tileW
      const inY = y - row * tileH
      const p = y * size + x
      const isGrout = inX < grout || inY < grout
      const tone = tones[(row * 7 + col) % tones.length]
      const u = (x / size) * 32
      const v = (y / size) * 32
      field[p] = 0.6 * fbm(noise, u * 0.5, v * 0.5, 5) + 0.25 * tone
      height[p] = isGrout ? 0 : 0.9 + 0.1 * fbm(noise, u * 4, v * 4, 2)
    }
    if (y % 128 === 0) await yieldToBrowser()
  }
  const base = warm ? [214, 202, 184] : [196, 192, 186]
  const albedo = fieldToCanvas(field, size, (v, p) => {
    if (height[p] === 0) return [150, 144, 136]
    const k = 0.86 + v * 0.22
    return [base[0] * k, base[1] * k, base[2] * k]
  })
  const roughness = fieldToCanvas(field, size, (v, p) => {
    const r = height[p] === 0 ? 245 : (warm ? 200 : 120) + v * 40
    return [r, r, r]
  })
  const normal = normalFromHeight(height, size, 3)
  return pbrSet({ albedo, roughness, normal }, worldSize)
}

// Lime plaster: almost flat, but breaks up specular highlights on walls.
const plaster = async (size = 512) => {
  const worldSize = 1.5
  const noise = makeNoise(41, 32)
  const field = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      field[y * size + x] = fbm(noise, (x / size) * 32, (y / size) * 32, 5)
    }
  }
  await yieldToBrowser()
  const roughness = fieldToCanvas(field, size, (v) => {
    const r = 210 + v * 40
    return [r, r, r]
  })
  const normal = normalFromHeight(field, size, 0.25)
  return pbrSet({ roughness, normal }, worldSize)
}

// Tight linen weave, tinted by each material's colour.
const linen = async (size = 256) => {
  const worldSize = 0.12
  const noise = makeNoise(53, 16)
  const field = new Float32Array(size * size)
  const threads = 24
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * threads * Math.PI * 2
      const v = (y / size) * threads * Math.PI * 2
      const warp = Math.sin(u) * 0.5 + 0.5
      const weft = Math.sin(v) * 0.5 + 0.5
      const over = (Math.floor((x / size) * threads) + Math.floor((y / size) * threads)) % 2
      field[y * size + x] = (over ? warp : weft) * 0.8 + 0.2 * noise((x / size) * 16, (y / size) * 16)
    }
  }
  await yieldToBrowser()
  const albedo = fieldToCanvas(field, size, (v) => {
    const c = 205 + v * 50
    return [c, c, c]
  })
  const normal = normalFromHeight(field, size, 1.2)
  return pbrSet({ albedo, normal }, worldSize)
}

// Quarter-sawn walnut veneer for joinery. Covers 1.2 m.
const walnut = async (size = 512) => {
  const worldSize = 1.2
  const noise = makeNoise(67, 32)
  const field = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 32
      const v = (y / size) * 32
      const g = fbm(noise, u * 0.08, v * 1.6, 4)
      field[y * size + x] = Math.sin(v * 2.2 + g * 10) * 0.25 + g * 0.75
    }
    if (y % 128 === 0) await yieldToBrowser()
  }
  const albedo = fieldToCanvas(field, size, (v) => [96 + 50 * v, 64 + 34 * v, 44 + 22 * v])
  const roughness = fieldToCanvas(field, size, (v) => {
    const r = 120 + v * 50
    return [r, r, r]
  })
  return pbrSet({ albedo, roughness }, worldSize)
}

// Distant façades: light render with a grid of windows (+ an emissive mask lit
// in the evening). Tiny: it is only ever seen far away.
const facade = async () => {
  const size = 256
  const rand = mulberry32(91)
  const draw = (lit) => {
    const c = createCanvas(size)
    const ctx = c.getContext('2d')
    ctx.fillStyle = lit ? '#000' : '#e9e2d6'
    ctx.fillRect(0, 0, size, size)
    const cols = 12
    const rows = 16
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const on = rand() < 0.35
        if (lit && !on) continue
        const shade = 78 + rand() * 26
        ctx.fillStyle = lit ? `rgba(255, ${190 + rand() * 40}, ${120 + rand() * 50}, 1)` : `rgb(${shade}, ${shade + 6}, ${shade + 12})`
        ctx.fillRect(col * (size / cols) + 5, r * (size / rows) + 4, size / cols - 10, size / rows - 8)
      }
    }
    return c
  }
  const map = toTexture(draw(false), { srgb: true })
  const emissiveMap = toTexture(draw(true), { srgb: true })
  return { map, emissiveMap }
}

const STEPS = [
  ['oak', () => oak()],
  ['marble', () => marble()],
  ['stone', () => stone(1024, { worldSize: 2.4 })],
  ['terrace', () => stone(512, { warm: true, worldSize: 2.4, seed: 77 })],
  ['plaster', () => plaster()],
  ['linen', () => linen()],
  ['walnut', () => walnut()],
  ['facade', () => facade()],
]

// Mobile / low tier renders the same materials at half resolution
export const generateTextures = async (onProgress, { lowRes = false } = {}) => {
  const out = {}
  for (let i = 0; i < STEPS.length; i++) {
    const [key, make] = STEPS[i]
    if (lowRes && key === 'oak') out[key] = await oak(512)
    else if (lowRes && key === 'marble') out[key] = await marble(512)
    else if (lowRes && key === 'stone') out[key] = await stone(512, { worldSize: 2.4 })
    else out[key] = await make()
    onProgress?.((i + 1) / STEPS.length)
    await yieldToBrowser()
  }
  return out
}

export const disposeTextures = (set) => {
  Object.values(set ?? {}).forEach((group) =>
    Object.values(group).forEach((texture) => texture?.dispose?.())
  )
}
