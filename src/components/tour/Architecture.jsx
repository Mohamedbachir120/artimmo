import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { CEILING_HEIGHT, rooms, terraceRailing } from './apartment'
import { worldBox } from './materials'

const H = CEILING_HEIGHT
const noRaycast = () => null

const Box = ({ size, position, material, cast = true, receive = true, ...rest }) => (
  <mesh
    geometry={worldBox(...size)}
    material={material}
    position={position}
    castShadow={cast}
    receiveShadow={receive}
    {...rest}
  />
)

// Many static boxes sharing one finish, merged into a single draw call
const MergedBoxes = ({ boxes, material, cast = true, receive = true }) => {
  const geometry = useMemo(() => {
    const parts = boxes.map(({ size, position }) => worldBox(...size).clone().translate(...position))
    const merged = mergeGeometries(parts)
    parts.forEach((g) => g.dispose())
    return merged
  }, [boxes])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} material={material} castShadow={cast} receiveShadow={receive} />
}

// Planar floor with UVs in meters
const Floor = ({ rect: [x0, z0, x1, z1], material, y = 0 }) => {
  const geometry = useMemo(() => {
    const w = x1 - x0
    const d = z1 - z0
    const g = new THREE.PlaneGeometry(w, d)
    const uv = g.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w + x0, uv.getY(i) * d + z0)
    g.rotateX(-Math.PI / 2)
    return g
  }, [x0, z0, x1, z1])
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[(x0 + x1) / 2, y, (z0 + z1) / 2]}
      receiveShadow
      userData={{ walkable: true }}
    />
  )
}

// Aluminium frame + glass for windows, bay glazing and the sliding door
const Glazing = ({ opening, m }) => {
  const { position, size, horizontal, type, frosted } = opening
  const [cx, cy, cz] = position
  const len = horizontal ? size[0] : size[2]
  const height = size[1]
  const frame = 0.055
  const depth = 0.07
  const along = (offset) => (horizontal ? [cx + offset, 0, cz] : [cx, 0, cz + offset])
  const bar = (offset, y, l, vertical) => {
    const [px, , pz] = along(offset)
    const s = vertical
      ? horizontal ? [frame, l, depth] : [depth, l, frame]
      : horizontal ? [l, frame, depth] : [depth, frame, l]
    return <Box key={`${offset}-${y}-${vertical}`} size={s} position={[px, y, pz]} material={m.aluminium} receive={false} />
  }
  const glassMat = frosted ? m.frosted : m.glass
  const pane = (offset, w, z = 0, key) => {
    const [px, , pz] = along(offset)
    return (
      <mesh
        key={key ?? offset}
        geometry={worldBox(horizontal ? w : 0.012, height - frame * 2, horizontal ? 0.012 : w)}
        material={glassMat}
        position={horizontal ? [px, cy, pz + z] : [px + z, cy, pz]}
        renderOrder={2}
        raycast={noRaycast}
      />
    )
  }
  const bottom = cy - height / 2
  const top = cy + height / 2
  const parts = [
    bar(0, top - frame / 2, len, false),
    bar(0, bottom + frame / 2, len, false),
    bar(-len / 2 + frame / 2, cy, height, true),
    bar(len / 2 - frame / 2, cy, height, true),
  ]
  if (type === 'slider') {
    // Fixed pane on one half, the sliding leaf parked in front of it: open half
    parts.push(pane(-len / 4, len / 2 - frame, 0, 'fixed'))
    parts.push(pane(-len / 4 + 0.05, len / 2 - frame, -0.05, 'leaf'))
    parts.push(bar(0, cy, height, true))
    return <group>{parts}</group>
  }
  // Mullions every ~1.35 m
  const panels = Math.max(1, Math.round(len / 1.35))
  for (let i = 1; i < panels; i++) parts.push(bar(-len / 2 + (len / panels) * i, cy, height, true))
  for (let i = 0; i < panels; i++) {
    parts.push(pane(-len / 2 + (len / panels) * (i + 0.5), len / panels - frame, 0, `p${i}`))
  }
  return <group>{parts}</group>
}

const FrontDoor = ({ opening, m }) => {
  const [cx, cy, cz] = opening.position
  const height = opening.size[1]
  const width = opening.size[2]
  return (
    <group position={[cx + 0.1, 0, cz]}>
      <Box size={[0.06, height, width]} position={[0.02, cy, 0]} material={m.walnut} />
      <Box size={[0.03, 0.02, 0.16]} position={[0.08, 1.05, width / 2 - 0.12]} material={m.brass} receive={false} />
      <Box size={[0.06, height + 0.06, 0.04]} position={[0.03, cy + 0.03, width / 2 + 0.02]} material={m.lacquerDark} />
      <Box size={[0.06, height + 0.06, 0.04]} position={[0.03, cy + 0.03, -width / 2 - 0.02]} material={m.lacquerDark} />
      <Box size={[0.06, 0.04, width + 0.08]} position={[0.03, height + 0.02, 0]} material={m.lacquerDark} />
    </group>
  )
}

// Door casings for interior openings
const DoorCasing = ({ opening, m }) => {
  const { position: [cx, , cz], size, horizontal } = opening
  const len = horizontal ? size[0] : size[2]
  const top = opening.top
  const t = (horizontal ? size[2] : size[0]) + 0.02
  const side = (offset) => (
    <Box
      key={offset}
      size={horizontal ? [0.04, top, t] : [t, top, 0.04]}
      position={horizontal ? [cx + offset, top / 2, cz] : [cx, top / 2, cz + offset]}
      material={m.skirting}
    />
  )
  return (
    <group>
      {side(-len / 2 + 0.02)}
      {side(len / 2 - 0.02)}
      <Box
        size={horizontal ? [len, 0.04, t] : [t, 0.04, len]}
        position={[cx, top + 0.02, cz]}
        material={m.skirting}
      />
    </group>
  )
}

const floorMaterial = (m, key) => ({ oak: m.oak, stone: m.stone, terrace: m.terrace }[key])

// Thin stone cladding on the bathroom walls (inside faces only)
const bathCladding = [
  { size: [4.78, H, 0.012], position: [10.46, H / 2, 0.157] },
  { size: [0.012, H, 2.78], position: [8.077, H / 2, 1.54] },
  { size: [0.28, 2.2, 0.012], position: [8.21, 1.1, 2.923] },
  { size: [3.7, H, 0.012], position: [11.0, H / 2, 2.923] },
  { size: [0.8, H - 2.2, 0.012], position: [8.75, 2.2 + (H - 2.2) / 2, 2.923] },
  { size: [0.012, 1.25, 2.78], position: [12.843, 0.625, 1.54] },
]

export default function Architecture({ m, solids, openings }) {
  const skirting = useMemo(() => {
    // Skirting boards along the inner faces of walls in oak-floored rooms
    const list = []
    solids.forEach((s, i) => {
      if (s.kind !== 'wall') return
      const [x, , z] = s.position
      const [sx, , sz] = s.size
      if (s.horizontal) {
        list.push({ key: `${i}a`, size: [sx, 0.08, 0.014], position: [x, 0.04, z - sz / 2 - 0.0075] })
        list.push({ key: `${i}b`, size: [sx, 0.08, 0.014], position: [x, 0.04, z + sz / 2 + 0.0075] })
      } else {
        list.push({ key: `${i}a`, size: [0.014, 0.08, sz], position: [x - sx / 2 - 0.0075, 0.04, z] })
        list.push({ key: `${i}b`, size: [0.014, 0.08, sz], position: [x + sx / 2 + 0.0075, 0.04, z] })
      }
    })
    // Keep only skirting that lands inside the apartment footprint
    return list.filter(({ position: [x, , z] }) => x > 0.1 && x < 12.9 && z > 0.1 && z < 7.9)
  }, [solids])

  return (
    <group name="architecture">
      {rooms.map((r) => (
        <Floor key={r.id} rect={r.rect} material={floorMaterial(m, r.floor)} />
      ))}

      <MergedBoxes boxes={solids} material={m.wall} />
      <MergedBoxes boxes={skirting} material={m.skirting} cast={false} receive={false} />

      {openings.map((o) => {
        if (o.type === 'frontdoor') return <FrontDoor key={o.id} opening={o} m={m} />
        if (o.type === 'door') return <DoorCasing key={o.id} opening={o} m={m} />
        return <Glazing key={o.id} opening={o} m={m} />
      })}

      <MergedBoxes boxes={bathCladding} material={m.bathWall} cast={false} />

      {/* Ceiling slab, extending over the terrace as a sun-shading overhang */}
      <Box size={[13.6, 0.3, 10.7]} position={[6.5, H + 0.15, 5.05]} material={m.ceiling} />
      {/* Slab edge band seen from the terrace */}
      <Box size={[8.3, 0.32, 0.02]} position={[4, H + 0.15, 10.41]} material={m.wallExterior} />

      {/* Building mass below the apartment floor */}
      <Box size={[13.6, 18, 10.7]} position={[6.5, -9.03, 5.05]} material={m.wallExterior} cast={false} />
      {/* Terrace upstand under the balustrade */}
      <Box size={[8.2, 0.12, 0.16]} position={[4, 0.06, 10.4]} material={m.wallExterior} />

      {/* Glass balustrade with a slim steel handrail */}
      {terraceRailing.map(({ a, b }, i) => {
        const horizontal = a[1] === b[1]
        const len = Math.hypot(b[0] - a[0], b[1] - a[1])
        const cx = (a[0] + b[0]) / 2
        const cz = (a[1] + b[1]) / 2
        return (
          <group key={`rail${i}`}>
            <mesh
              geometry={worldBox(horizontal ? len : 0.015, 1.0, horizontal ? 0.015 : len)}
              material={m.glass}
              position={[cx, 0.6, cz]}
              renderOrder={2}
              raycast={noRaycast}
            />
            <Box
              size={horizontal ? [len, 0.03, 0.035] : [0.035, 0.03, len]}
              position={[cx, 1.11, cz]}
              material={m.aluminium}
            />
          </group>
        )
      })}

      {/* Flush ceiling downlights */}
      {[
        [0.9, 1.6], [0.9, 2.8], [2.2, 4.4], [2.2, 6.6], [4.8, 4.5], [6.6, 4.5], [4.8, 6.9], [6.6, 6.9],
        [7.0, 1.0], [7.0, 2.6], [9.5, 6.4], [11.5, 6.4], [9.4, 4.4], [9.6, 1.8], [11.4, 1.8],
        [2.0, 9.2], [4.0, 9.2], [6.0, 9.2],
      ].map(([x, z], i) => (
        <mesh key={`dl${i}`} position={[x, H - 0.002, z]} rotation-x={Math.PI / 2} material={m.downlight}>
          <circleGeometry args={[0.045, 24]} />
        </mesh>
      ))}
    </group>
  )
}
