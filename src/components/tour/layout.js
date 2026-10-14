import { CEILING_HEIGHT, walls, terraceRailing } from './apartment'
import { furnitureObstacles } from './furnitureObstacles'

// Turns the wall list into solid boxes (with sills / lintels around openings),
// glass panes, and the 2D collision rectangles the first-person controls use.

const H = CEILING_HEIGHT
// Walls continue into the slab above so the wall/ceiling junction is sealed for shadows
const TOP = CEILING_HEIGHT + 0.28

const segmentBox = (wall, s0, s1, y0, y1, extra = {}) => {
  const [ax, az] = wall.a
  const [bx, bz] = wall.b
  const horizontal = az === bz
  const sign = horizontal ? Math.sign(bx - ax) : Math.sign(bz - az)
  const mid = (s0 + s1) / 2
  const len = s1 - s0
  return {
    position: horizontal
      ? [ax + sign * mid, (y0 + y1) / 2, az]
      : [ax, (y0 + y1) / 2, az + sign * mid],
    size: horizontal ? [len, y1 - y0, wall.t] : [wall.t, y1 - y0, len],
    horizontal,
    ...extra,
  }
}

export const buildWalls = () => {
  const solids = []
  const openings = []
  walls.forEach((wall, wi) => {
    const [ax, az] = wall.a
    const [bx, bz] = wall.b
    const length = Math.hypot(bx - ax, bz - az)
    // Extend each wall by half its thickness so corners close cleanly
    const start = -wall.t / 2
    const end = length + wall.t / 2
    const ops = [...(wall.openings ?? [])].sort((p, q) => p.from - q.from)
    let cursor = start
    ops.forEach((op, oi) => {
      if (op.from > cursor) solids.push(segmentBox(wall, cursor, op.from, 0, TOP, { kind: 'wall', wall: wi }))
      if (op.bottom > 0) solids.push(segmentBox(wall, op.from, op.to, 0, op.bottom, { kind: 'sill', wall: wi }))
      if (op.top < H) solids.push(segmentBox(wall, op.from, op.to, op.top, TOP, { kind: 'lintel', wall: wi }))
      openings.push({ ...segmentBox(wall, op.from, op.to, op.bottom, op.top), ...op, id: `${wi}-${oi}`, wall })
      cursor = op.to
    })
    if (end > cursor) solids.push(segmentBox(wall, cursor, end, 0, TOP, { kind: 'wall', wall: wi }))
  })
  return { solids, openings }
}

const rectFromBox = ({ position: [x, , z], size: [sx, , sz] }) => [x - sx / 2, z - sz / 2, x + sx / 2, z + sz / 2]

// Every rectangle the visitor's body (a circle) may not enter. `walls` holds
// the architectural subset, used for line-of-sight checks on hotspots.
export const buildColliders = ({ solids, openings }) => {
  const rects = []
  solids.forEach((s) => {
    // Lintels hang above head height: they never block walking
    if (s.kind !== 'lintel') rects.push(rectFromBox(s))
  })
  openings.forEach((o) => {
    if (o.type === 'door') return
    if (o.type === 'slider') {
      // Half of the sliding bay is open onto the terrace
      const r = rectFromBox(o)
      rects.push([r[0], r[1], (r[0] + r[2]) / 2, r[3]])
      return
    }
    rects.push(rectFromBox(o))
  })
  terraceRailing.forEach(({ a, b }) => {
    const t = 0.08
    rects.push([Math.min(a[0], b[0]) - t, Math.min(a[1], b[1]) - t, Math.max(a[0], b[0]) + t, Math.max(a[1], b[1]) + t])
  })
  const walls = [...rects]
  furnitureObstacles.forEach((r) => rects.push(r))
  return { all: rects, walls }
}

// Circle (x, z, radius) against rectangles: true when overlapping
export const hitsAny = (rects, x, z, radius) =>
  rects.some(([x0, z0, x1, z1]) => {
    const cx = Math.max(x0, Math.min(x, x1))
    const cz = Math.max(z0, Math.min(z, z1))
    return (x - cx) ** 2 + (z - cz) ** 2 < radius * radius
  })

// Walks a straight line in small steps; returns the furthest free point.
export const sweep = (rects, from, to, radius) => {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const dist = Math.hypot(dx, dz)
  const steps = Math.max(1, Math.ceil(dist / 0.05))
  let last = from
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const p = [from[0] + dx * t, from[1] + dz * t]
    if (hitsAny(rects, p[0], p[1], radius)) return { point: last, clear: false }
    last = p
  }
  return { point: last, clear: true }
}

// Slide along obstacles: try the full move, then each axis separately.
export const resolveMove = (rects, x, z, nx, nz, radius) => {
  if (!hitsAny(rects, nx, nz, radius)) return [nx, nz]
  if (!hitsAny(rects, nx, z, radius)) return [nx, z]
  if (!hitsAny(rects, x, nz, radius)) return [x, nz]
  return [x, z]
}
