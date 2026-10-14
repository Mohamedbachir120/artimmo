import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { worldBox } from './materials'

// Furniture and decor for the show apartment. Footprints used for collision
// live in furnitureObstacles.js; keep both in sync when moving a piece.

import { cyl, sphere, cached, seededRandom } from './furnitureData'

const B = ({ s, p, m, r, cast = true }) => (
  <mesh geometry={worldBox(...s)} material={m} position={p} rotation={r} castShadow={cast} receiveShadow />
)
const C = ({ args, p, m, r, cast = true }) => (
  <mesh geometry={cyl(...args)} material={m} position={p} rotation={r} castShadow={cast} receiveShadow />
)
const Soft = ({ s, p, m, radius = 0.05, r }) => (
  <RoundedBox args={s} radius={radius} smoothness={4} position={p} rotation={r} material={m} castShadow receiveShadow />
)

// ─── Plants ─────────────────────────────────────────────────────────────────

const leafGeometry = (w, l) =>
  cached(`leaf${w}|${l}`, () => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.quadraticCurveTo(w, l * 0.45, 0, l)
    s.quadraticCurveTo(-w, l * 0.45, 0, 0)
    const g = new THREE.ShapeGeometry(s, 6)
    return g
  })

const Plant = ({ position, height = 1.6, count = 60, leaf = [0.09, 0.32], spread = 0.45, seed = 1, m, olive = false }) => {
  const ref = useRef()
  useLayoutEffect(() => {
    const rand = seededRandom(seed)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const h = height * (0.35 + 0.65 * Math.sqrt(rand()))
      const a = rand() * Math.PI * 2
      const r = spread * (olive ? 0.4 + 0.6 * rand() : (h / height) * rand())
      dummy.position.set(Math.cos(a) * r, h, Math.sin(a) * r)
      dummy.rotation.set(0, -a + Math.PI / 2, 0)
      dummy.rotateX(olive ? (rand() - 0.5) * 2.4 : 0.4 + rand() * 0.9)
      dummy.rotateZ((rand() - 0.5) * 0.8)
      const sc = 0.7 + rand() * 0.5
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [count, height, spread, seed, olive])
  return (
    <group position={position}>
      <C args={[0.2, 0.16, 0.42, 28]} p={[0, 0.21, 0]} m={m.planter} />
      <C args={[0.185, 0.185, 0.02, 28]} p={[0, 0.41, 0]} m={m.soil} cast={false} />
      <C args={[0.018, 0.026, height * 0.85, 8]} p={[0, height * 0.42 + 0.4, 0]} m={m.bark} />
      <group position={[0, 0.4, 0]}>
        <instancedMesh
          ref={ref}
          args={[leafGeometry(...leaf), olive ? m.leafLight : m.leaf, count]}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}

// ─── Decor ──────────────────────────────────────────────────────────────────

// True planar mirror. Three's Reflector only re-renders the reflection when the
// mirror itself is on screen, so it costs nothing in the other rooms.
const Mirror = ({ geometry, position, rotation, resolution = 512 }) => {
  const mirror = useMemo(() => {
    const aspect = geometry.parameters.width ? geometry.parameters.width / geometry.parameters.height : 1
    return new Reflector(geometry, {
      textureWidth: resolution * Math.max(1, aspect),
      textureHeight: resolution,
      color: 0xc9cccd,
      clipBias: 0.003,
    })
  }, [geometry, resolution])
  useEffect(() => () => {
    mirror.getRenderTarget().dispose()
    mirror.material.dispose()
  }, [mirror])
  return <primitive object={mirror} position={position} rotation={rotation} />
}

// Hollow oval bathtub: an extruded rounded ring plus a basin floor
const roundedRectShape = (w, d, r, target = new THREE.Shape()) => {
  const x = -w / 2
  const y = -d / 2
  target.moveTo(x + r, y)
  target.lineTo(x + w - r, y)
  target.quadraticCurveTo(x + w, y, x + w, y + r)
  target.lineTo(x + w, y + d - r)
  target.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  target.lineTo(x + r, y + d)
  target.quadraticCurveTo(x, y + d, x, y + d - r)
  target.lineTo(x, y + r)
  target.quadraticCurveTo(x, y, x + r, y)
  return target
}

const Bathtub = ({ position, m }) => {
  const [shell, basin] = useMemo(() => {
    const outer = roundedRectShape(0.8, 1.78, 0.38)
    outer.holes.push(roundedRectShape(0.66, 1.64, 0.31, new THREE.Path()))
    const s = new THREE.ExtrudeGeometry(outer, {
      depth: 0.5, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 4, curveSegments: 24,
    })
    s.rotateX(-Math.PI / 2)
    const b = new THREE.ShapeGeometry(roundedRectShape(0.68, 1.66, 0.31), 24)
    b.rotateX(-Math.PI / 2)
    return [s, b]
  }, [])
  useEffect(() => () => {
    shell.dispose()
    basin.dispose()
  }, [shell, basin])
  return (
    <group position={position}>
      <mesh geometry={shell} material={m.ceramic} position={[0, 0.03, 0]} castShadow receiveShadow />
      <mesh geometry={basin} material={m.ceramic} position={[0, 0.12, 0]} receiveShadow />
    </group>
  )
}


const Vase = ({ position, m, scale = 1 }) => {
  const geometry = useMemo(() => {
    const pts = [[0, 0], [0.07, 0], [0.1, 0.06], [0.11, 0.16], [0.07, 0.27], [0.045, 0.31], [0.05, 0.34]]
    return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 32)
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} material={m} position={position} scale={scale} castShadow receiveShadow />
}

// Abstract canvas in the ARTIMMO palette (procedural, no image download)
const Artwork = ({ position, rotation, size = [1.2, 0.9], seed = 1, m }) => {
  const material = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = Math.round((512 * size[1]) / size[0])
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#ebe5da'
    ctx.fillRect(0, 0, c.width, c.height)
    const palette = ['#26405B', '#6AA0AE', '#BACBC1', '#608874', '#c9a46a', '#d9cfc0']
    const rand = seededRandom(seed)
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = 0.55 + rand() * 0.35
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)]
      ctx.beginPath()
      const x = rand() * c.width
      const y = rand() * c.height
      ctx.ellipse(x, y, 60 + rand() * 160, 40 + rand() * 120, rand() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 0.9
    ctx.strokeStyle = '#1f2a33'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(c.width * 0.15, c.height * (0.3 + rand() * 0.4))
    ctx.bezierCurveTo(c.width * 0.4, c.height * rand(), c.width * 0.6, c.height * rand(), c.width * 0.88, c.height * (0.3 + rand() * 0.4))
    ctx.stroke()
    const texture = new THREE.CanvasTexture(c)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 })
  }, [seed, size])
  useEffect(() => () => {
    material.map.dispose()
    material.dispose()
  }, [material])
  return (
    <group position={position} rotation={rotation}>
      <B s={[size[0] + 0.06, size[1] + 0.06, 0.04]} p={[0, 0, 0]} m={m.walnut} />
      <mesh geometry={worldBox(size[0], size[1], 0.01)} material={material} position={[0, 0, 0.022]} />
    </group>
  )
}

const Books = ({ position, m, rotation }) => (
  <group position={position} rotation={rotation}>
    <B s={[0.3, 0.04, 0.22]} p={[0, 0.02, 0]} m={m.book} />
    <B s={[0.28, 0.035, 0.2]} p={[0.01, 0.0575, 0]} m={m.bookAlt} />
    <B s={[0.26, 0.03, 0.19]} p={[-0.01, 0.09, 0.005]} m={m.ceramicMatte} />
  </group>
)

// ─── Seating ────────────────────────────────────────────────────────────────

// Dining chair, facing +Z by default
const Chair = ({ position, rotation = 0, m }) => (
  <group position={position} rotation-y={rotation}>
    <Soft s={[0.46, 0.07, 0.46]} p={[0, 0.46, 0]} m={m.sofa} radius={0.025} />
    <Soft s={[0.46, 0.42, 0.05]} p={[0, 0.72, -0.21]} m={m.walnut} radius={0.02} />
    {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z]) => (
      <C key={`${x}${z}`} args={[0.016, 0.013, 0.43, 10]} p={[x, 0.215, z]} m={m.blackMetal} />
    ))}
  </group>
)

const Stool = ({ position, m }) => (
  <group position={position}>
    <C args={[0.19, 0.19, 0.05, 28]} p={[0, 0.68, 0]} m={m.leather} />
    <C args={[0.022, 0.022, 0.66, 12]} p={[0, 0.33, 0]} m={m.brass} />
    <C args={[0.18, 0.18, 0.015, 28]} p={[0, 0.0075, 0]} m={m.brass} />
    <mesh position={[0, 0.25, 0]} rotation-x={Math.PI / 2} material={m.brass} castShadow>
      <torusGeometry args={[0.15, 0.008, 8, 32]} />
    </mesh>
  </group>
)

// ─── Lighting fixtures ──────────────────────────────────────────────────────

const Pendant = ({ position, m, drop = 0.7, radius = 0.17 }) => (
  <group position={position}>
    <C args={[0.004, 0.004, drop, 6]} p={[0, -drop / 2, 0]} m={m.blackMetal} cast={false} />
    <mesh geometry={cyl(radius * 0.25, radius, radius * 0.9, 32)} position={[0, -drop - radius * 0.4, 0]} castShadow>
      <meshStandardMaterial color={0x1f2124} metalness={0.6} roughness={0.35} side={THREE.DoubleSide} />
    </mesh>
    <mesh geometry={sphere(0.045)} material={m.bulb} position={[0, -drop - radius * 0.8, 0]} />
  </group>
)

const FloorLamp = ({ position, m }) => (
  <group position={position}>
    <C args={[0.15, 0.15, 0.02, 28]} p={[0, 0.01, 0]} m={m.brass} />
    <C args={[0.012, 0.012, 1.3, 8]} p={[0, 0.66, 0]} m={m.brass} />
    <mesh geometry={cyl(0.18, 0.22, 0.3, 32)} material={m.shadeLinen} position={[0, 1.45, 0]} castShadow />
    <mesh geometry={sphere(0.04)} material={m.bulb} position={[0, 1.4, 0]} />
  </group>
)

const BedsideLamp = ({ position, m }) => (
  <group position={position}>
    <C args={[0.07, 0.09, 0.22, 24]} p={[0, 0.11, 0]} m={m.ceramicMatte} />
    <mesh geometry={cyl(0.11, 0.14, 0.18, 28)} material={m.shadeLinen} position={[0, 0.32, 0]} castShadow />
    <mesh geometry={sphere(0.03)} material={m.bulb} position={[0, 0.28, 0]} />
  </group>
)

// ─── Rooms ──────────────────────────────────────────────────────────────────

const entranceMirror = new THREE.CircleGeometry(0.38, 48)
const vanityMirror = new THREE.PlaneGeometry(1.7, 0.9)

const Entrance = ({ m }) => (
  <group>
    {/* Console against the kitchen partition */}
    <B s={[0.35, 0.05, 1.2]} p={[1.555, 0.8, 1.0]} m={m.walnut} />
    <B s={[0.33, 0.02, 1.16]} p={[1.555, 0.28, 1.0]} m={m.walnut} />
    {[[1.41, 0.43], [1.41, 1.57], [1.7, 0.43], [1.7, 1.57]].map(([x, z]) => (
      <B key={`${x}${z}`} s={[0.025, 0.78, 0.025]} p={[x, 0.39, z]} m={m.blackMetal} />
    ))}
    <Mirror geometry={entranceMirror} position={[1.715, 1.55, 1.0]} rotation={[0, -Math.PI / 2, 0]} resolution={512} />
    <mesh position={[1.725, 1.55, 1.0]} rotation-y={-Math.PI / 2} material={m.brass}>
      <ringGeometry args={[0.38, 0.4, 48]} />
    </mesh>
    <Vase position={[1.55, 0.825, 0.62]} m={m.ceramicMatte} scale={1.1} />
    <Books position={[1.55, 0.825, 1.3]} m={m} rotation={[0, 0.3, 0]} />
  </group>
)

const Kitchen = ({ m }) => {
  const runX0 = 3.07
  const runX1 = 6.0
  const runW = runX1 - runX0
  const runCx = (runX0 + runX1) / 2
  return (
    <group>
      {/* Tall column: integrated fridge + ovens */}
      <B s={[1.2, 2.4, 0.62]} p={[2.47, 1.2, 0.46]} m={m.lacquer} />
      <B s={[0.56, 0.58, 0.01]} p={[2.77, 1.2, 0.775]} m={m.screen} />
      <B s={[0.56, 0.46, 0.01]} p={[2.77, 0.62, 0.775]} m={m.screen} />
      {[[2.3, 1.2], [2.3, 0.7]].map(([x, y]) => (
        <B key={y} s={[0.015, 0.4, 0.02]} p={[x + 0.2, y + 0.5, 0.79]} m={m.brass} />
      ))}
      {/* Base run */}
      <B s={[runW, 0.8, 0.6]} p={[runCx, 0.44, 0.45]} m={m.lacquerDark} />
      <B s={[runW, 0.08, 0.56]} p={[runCx, 0.04, 0.43]} m={m.blackMetal} cast={false} />
      <B s={[runW, 0.04, 0.65]} p={[runCx, 0.88, 0.475]} m={m.marble} />
      {/* Drawer lines + brass pulls */}
      {[0, 1, 2, 3].map((i) => (
        <B key={i} s={[0.3, 0.012, 0.02]} p={[runX0 + 0.37 + i * 0.73, 0.78, 0.76]} m={m.brass} />
      ))}
      {[1, 2, 3].map((i) => (
        <B key={`g${i}`} s={[0.004, 0.76, 0.004]} p={[runX0 + i * 0.73, 0.46, 0.752]} m={m.blackMetal} cast={false} />
      ))}
      {/* Backsplash and wall cabinets */}
      <B s={[runW, 0.62, 0.02]} p={[runCx, 1.21, 0.16]} m={m.marble} />
      <B s={[runW - 0.6, 0.7, 0.36]} p={[runCx + 0.3, 1.92, 0.33]} m={m.lacquer} />
      <B s={[runW - 0.6, 0.015, 0.3]} p={[runCx + 0.3, 1.56, 0.33]} m={m.brass} cast={false} />
      {/* Induction hob + sink with tap */}
      <B s={[0.6, 0.006, 0.5]} p={[5.25, 0.903, 0.48]} m={m.screen} />
      <B s={[0.7, 0.012, 0.42]} p={[3.85, 0.896, 0.48]} m={m.chrome} />
      <C args={[0.014, 0.014, 0.32, 12]} p={[3.85, 1.06, 0.26]} m={m.chrome} />
      <C args={[0.012, 0.012, 0.22, 12]} p={[3.85, 1.21, 0.36]} r={[Math.PI / 2, 0, 0]} m={m.chrome} />
      {/* Island with waterfall marble ends */}
      <B s={[2.4, 0.04, 1.0]} p={[3.7, 0.9, 2.4]} m={m.marble} />
      <B s={[0.04, 0.88, 1.0]} p={[2.52, 0.44, 2.4]} m={m.marble} />
      <B s={[0.04, 0.88, 1.0]} p={[4.88, 0.44, 2.4]} m={m.marble} />
      <B s={[2.3, 0.84, 0.66]} p={[3.7, 0.42, 2.24]} m={m.walnut} />
      <Vase position={[4.4, 0.92, 2.25]} m={m.ceramic} />
      <mesh position={[3.1, 0.95, 2.45]} castShadow material={m.ceramicMatte}>
        <sphereGeometry args={[0.16, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      </mesh>
      {[3.0, 3.7, 4.4].map((x) => (
        <Stool key={x} position={[x, 0, 3.2]} m={m} />
      ))}
      {[3.05, 3.7, 4.35].map((x) => (
        <Pendant key={`p${x}`} position={[x, 2.8, 2.4]} m={m} drop={0.62} radius={0.14} />
      ))}
    </group>
  )
}

const Dining = ({ m }) => (
  <group>
    <B s={[2.2, 0.05, 1.0]} p={[2.1, 0.74, 5.4]} m={m.walnut} />
    {[[1.15, 5.0], [3.05, 5.0], [1.15, 5.8], [3.05, 5.8]].map(([x, z]) => (
      <B key={`${x}${z}`} s={[0.05, 0.72, 0.05]} p={[x, 0.36, z]} m={m.blackMetal} />
    ))}
    {[1.4, 2.1, 2.8].map((x) => (
      <group key={x}>
        <Chair position={[x, 0, 4.62]} m={m} />
        <Chair position={[x, 0, 6.18]} rotation={Math.PI} m={m} />
      </group>
    ))}
    <Vase position={[2.1, 0.765, 5.4]} m={m.ceramicMatte} scale={0.9} />
    <Pendant position={[2.1, 2.8, 5.4]} m={m} drop={0.9} radius={0.24} />
    <Artwork position={[0.16, 1.55, 5.4]} rotation={[0, Math.PI / 2, 0]} size={[1.5, 1.0]} seed={11} m={m} />
  </group>
)

const Living = ({ m }) => (
  <group>
    {/* Rug */}
    <B s={[3.2, 0.012, 2.5]} p={[5.7, 0.006, 5.6]} m={m.rug} cast={false} />
    {/* Sofa facing the bay window */}
    <Soft s={[2.6, 0.38, 0.95]} p={[5.7, 0.24, 4.47]} m={m.sofa} radius={0.06} />
    {[-0.62, 0.62].map((x) => (
      <Soft key={x} s={[1.22, 0.16, 0.7]} p={[5.7 + x, 0.5, 4.6]} m={m.sofa} radius={0.07} />
    ))}
    <Soft s={[2.6, 0.5, 0.22]} p={[5.7, 0.68, 4.1]} m={m.sofa} radius={0.08} />
    <Soft s={[0.2, 0.32, 0.95]} p={[4.5, 0.55, 4.47]} m={m.sofa} radius={0.08} />
    <Soft s={[0.2, 0.32, 0.95]} p={[6.9, 0.55, 4.47]} m={m.sofa} radius={0.08} />
    <Soft s={[0.45, 0.42, 0.14]} p={[4.95, 0.78, 4.3]} r={[-0.25, 0.15, 0.08]} m={m.cushionSage} radius={0.06} />
    <Soft s={[0.45, 0.42, 0.14]} p={[6.45, 0.78, 4.3]} r={[-0.25, -0.15, -0.06]} m={m.cushionNavy} radius={0.06} />
    {/* Travertine coffee table */}
    <C args={[0.5, 0.5, 0.06, 48]} p={[5.7, 0.36, 5.9]} m={m.terrace} />
    <C args={[0.32, 0.36, 0.33, 48]} p={[5.7, 0.165, 5.9]} m={m.terrace} />
    <Books position={[5.55, 0.39, 5.85]} m={m} rotation={[0, -0.4, 0]} />
    <Vase position={[5.95, 0.39, 6.0]} m={m.ceramic} scale={0.6} />
    {/* Leather lounge chair, angled towards the sofa */}
    <group position={[7.3, 0, 6.25]} rotation-y={-Math.PI / 2 - 0.4}>
      <Soft s={[0.78, 0.12, 0.72]} p={[0, 0.38, 0]} m={m.leather} radius={0.05} />
      <Soft s={[0.78, 0.55, 0.1]} p={[0, 0.66, -0.34]} r={[-0.18, 0, 0]} m={m.leather} radius={0.05} />
      <B s={[0.05, 0.5, 0.72]} p={[-0.38, 0.25, 0]} m={m.walnut} />
      <B s={[0.05, 0.5, 0.72]} p={[0.38, 0.25, 0]} m={m.walnut} />
    </group>
    <FloorLamp position={[7.45, 0, 4.42]} m={m} />
    {/* Sideboard and art in the north alcove */}
    <B s={[0.46, 0.62, 2.2]} p={[7.69, 0.33, 1.7]} m={m.walnut} />
    <B s={[0.44, 0.02, 2.18]} p={[7.69, 0.02, 1.7]} m={m.blackMetal} cast={false} />
    <Artwork position={[7.91, 1.55, 1.7]} rotation={[0, -Math.PI / 2, 0]} size={[1.6, 1.1]} seed={5} m={m} />
    <Vase position={[7.7, 0.64, 1.0]} m={m.terracotta} scale={1.3} />
    <Books position={[7.7, 0.64, 2.3]} m={m} rotation={[0, 1.2, 0]} />
    <Plant position={[0.52, 0, 7.48]} height={1.75} count={90} spread={0.5} seed={3} m={m} />
  </group>
)

const Bedroom = ({ m }) => (
  <group>
    <B s={[3.4, 0.012, 2.6]} p={[10.95, 0.006, 4.6]} m={m.rugBedroom} cast={false} />
    {/* Upholstered headboard wall panel */}
    <Soft s={[3.1, 1.25, 0.09]} p={[10.95, 0.72, 3.12]} m={m.headboard} radius={0.04} />
    {/* Bed: frame, mattress, duvet, pillows, throw */}
    <Soft s={[1.9, 0.28, 2.15]} p={[10.95, 0.2, 4.2]} m={m.walnut} radius={0.03} />
    <Soft s={[1.8, 0.22, 2.05]} p={[10.95, 0.44, 4.2]} m={m.bedLinen} radius={0.08} />
    <Soft s={[1.84, 0.07, 1.5]} p={[10.95, 0.57, 4.5]} m={m.bedLinen} radius={0.035} />
    <Soft s={[1.86, 0.05, 0.5]} p={[10.95, 0.62, 4.95]} m={m.throwBlanket} radius={0.025} />
    {[10.5, 11.4].map((x) => (
      <Soft key={x} s={[0.75, 0.16, 0.38]} p={[x, 0.66, 3.42]} r={[-0.35, 0, 0]} m={m.bedLinen} radius={0.08} />
    ))}
    <Soft s={[0.5, 0.3, 0.12]} p={[10.95, 0.68, 3.62]} r={[-0.2, 0, 0]} m={m.cushionSage} radius={0.05} />
    {/* Nightstands with lamps */}
    {[9.7, 12.2].map((x) => (
      <group key={x}>
        <B s={[0.5, 0.45, 0.42]} p={[x, 0.3, 3.36]} m={m.walnut} />
        <B s={[0.36, 0.012, 0.02]} p={[x, 0.38, 3.58]} m={m.brass} />
        <BedsideLamp position={[x, 0.525, 3.36]} m={m} />
      </group>
    ))}
    {/* Bench at the foot of the bed */}
    <Soft s={[1.4, 0.1, 0.4]} p={[10.95, 0.43, 5.6]} m={m.headboard} radius={0.04} />
    {[10.35, 11.55].map((x) => (
      <B key={x} s={[0.04, 0.38, 0.36]} p={[x, 0.19, 5.6]} m={m.brass} />
    ))}
    {/* Wardrobe along the west wall */}
    <B s={[0.6, 2.5, 2.6]} p={[8.37, 1.25, 6.3]} m={m.lacquer} />
    {[5.65, 6.3, 6.95].map((z) => (
      <B key={z} s={[0.004, 2.4, 0.004]} p={[8.672, 1.25, z]} m={m.blackMetal} cast={false} />
    ))}
    {[5.6, 6.0, 6.6, 7.0].map((z) => (
      <B key={`h${z}`} s={[0.02, 0.5, 0.015]} p={[8.685, 1.1, z]} m={m.brass} />
    ))}
    {/* Reading corner */}
    <group position={[12.2, 0, 7.0]} rotation-y={Math.PI + 0.7}>
      <Soft s={[0.75, 0.38, 0.75]} p={[0, 0.24, 0]} m={m.cushionSage} radius={0.08} />
      <Soft s={[0.75, 0.5, 0.16]} p={[0, 0.62, -0.3]} m={m.cushionSage} radius={0.07} />
    </group>
    <Artwork position={[10.95, 1.85, 3.18]} size={[1.4, 0.6]} seed={21} m={m} />
  </group>
)

const Bathroom = ({ m }) => (
  <group>
    {/* Walk-in shower */}
    <mesh geometry={worldBox(1.0, 2.1, 0.01)} material={m.showerGlass} position={[8.58, 1.05, 1.42]} renderOrder={2} />
    <B s={[0.02, 2.1, 0.02]} p={[9.08, 1.05, 1.42]} m={m.blackMetal} />
    <C args={[0.12, 0.12, 0.012, 32]} p={[8.6, 2.25, 0.7]} m={m.blackMetal} />
    <C args={[0.01, 0.01, 0.55, 8]} p={[8.6, 2.5, 0.42]} r={[Math.PI / 2, 0, 0]} m={m.blackMetal} />
    <B s={[0.5, 0.01, 0.06]} p={[8.6, 0.004, 1.2]} m={m.blackMetal} cast={false} />
    {/* Double vanity, mirror, wall lights */}
    <B s={[1.8, 0.4, 0.5]} p={[10.6, 0.68, 0.42]} m={m.walnut} />
    <B s={[1.8, 0.03, 0.52]} p={[10.6, 0.895, 0.43]} m={m.marble} />
    {[10.15, 11.05].map((x) => (
      <group key={x}>
        <mesh geometry={cyl(0.2, 0.15, 0.12, 40)} material={m.ceramic} position={[x, 0.97, 0.45]} castShadow receiveShadow />
        <C args={[0.012, 0.012, 0.22, 12]} p={[x, 1.02, 0.2]} m={m.blackMetal} />
        <C args={[0.009, 0.009, 0.14, 12]} p={[x, 1.12, 0.26]} r={[Math.PI / 2, 0, 0]} m={m.blackMetal} />
      </group>
    ))}
    <Mirror geometry={vanityMirror} position={[10.6, 1.65, 0.172]} resolution={640} />
    <B s={[1.5, 0.03, 0.05]} p={[10.6, 2.14, 0.2]} m={m.bulb} cast={false} />
    {/* Freestanding bathtub under the window */}
    <Bathtub position={[12.35, 0, 1.5]} m={m} />
    <group position={[12.35, 0, 1.5]}>
      <C args={[0.014, 0.014, 0.9, 12]} p={[-0.5, 0.45, 0.78]} m={m.blackMetal} />
      <C args={[0.01, 0.01, 0.2, 12]} p={[-0.42, 0.89, 0.78]} r={[0, 0, Math.PI / 2]} m={m.blackMetal} />
    </group>
    {/* Towel ladder + plant */}
    <group position={[12.75, 0, 2.75]}>
      {[0.3, 0.7, 1.1, 1.5].map((y) => (
        <B key={y} s={[0.02, 0.02, 0.4]} p={[0, y, 0]} m={m.brass} />
      ))}
      <B s={[0.03, 1.6, 0.03]} p={[0, 0.8, -0.2]} m={m.brass} />
      <B s={[0.03, 1.6, 0.03]} p={[0, 0.8, 0.2]} m={m.brass} />
      <Soft s={[0.06, 0.55, 0.36]} p={[-0.02, 1.2, 0]} m={m.bedLinen} radius={0.02} />
    </group>
    <Plant position={[9.5, 0, 2.55]} height={0.9} count={40} spread={0.3} leaf={[0.06, 0.24]} seed={8} m={m} />
  </group>
)

const Lounger = ({ position, m }) => (
  <group position={position}>
    <B s={[0.7, 0.06, 1.9]} p={[0, 0.3, 0]} m={m.teak} />
    <Soft s={[0.66, 0.08, 1.35]} p={[0, 0.37, 0.25]} m={m.outdoorFabric} radius={0.035} />
    <Soft s={[0.66, 0.08, 0.6]} p={[0, 0.52, -0.6]} r={[0.6, 0, 0]} m={m.outdoorFabric} radius={0.035} />
    {[[-0.3, -0.85], [0.3, -0.85], [-0.3, 0.85], [0.3, 0.85]].map(([x, z]) => (
      <B key={`${x}${z}`} s={[0.05, 0.27, 0.05]} p={[x, 0.135, z]} m={m.teak} />
    ))}
  </group>
)

const Terrace = ({ m }) => (
  <group>
    <B s={[0.5, 0.55, 1.9]} p={[0.35, 0.275, 9.35]} m={m.planter} />
    <B s={[0.44, 0.02, 1.84]} p={[0.35, 0.54, 9.35]} m={m.soil} cast={false} />
    <Plant position={[0.35, 0.15, 8.8]} height={0.9} count={45} spread={0.25} leaf={[0.05, 0.28]} seed={12} m={m} />
    <Plant position={[0.35, 0.15, 9.9]} height={0.8} count={45} spread={0.25} leaf={[0.05, 0.28]} seed={14} m={m} />
    <Lounger position={[5.2, 0, 9.5]} m={m} />
    <Lounger position={[6.45, 0, 9.5]} m={m} />
    <C args={[0.22, 0.22, 0.03, 32]} p={[5.82, 0.45, 9.0]} m={m.teak} />
    <C args={[0.02, 0.02, 0.44, 8]} p={[5.82, 0.22, 9.0]} m={m.blackMetal} />
    <Plant position={[7.5, 0, 8.6]} height={1.9} count={260} leaf={[0.025, 0.11]} spread={0.55} seed={17} olive m={m} />
  </group>
)

export default function Furniture({ m }) {
  return (
    <group name="furniture">
      <Entrance m={m} />
      <Kitchen m={m} />
      <Dining m={m} />
      <Living m={m} />
      <Bedroom m={m} />
      <Bathroom m={m} />
      <Terrace m={m} />
    </group>
  )
}
