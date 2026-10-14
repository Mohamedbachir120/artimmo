import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sky } from '@react-three/drei'
import { lampLights, seededRandom } from './furnitureData'

// Sun direction per mood. Azimuth is measured from south (+Z); negative swings west (−X).
const MOODS = {
  day: { elevation: 27, azimuth: -32, sun: 0xfff1de, intensity: 5.5, hemi: 0.3, env: 0.55, exposure: 1.0, turbidity: 3, rayleigh: 1.2 },
  evening: { elevation: 5, azimuth: -62, sun: 0xff9a5c, intensity: 2.2, hemi: 0.08, env: 0.3, exposure: 0.95, turbidity: 8, rayleigh: 2.6 },
}

const sunVector = (elevation, azimuth) => {
  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const theta = THREE.MathUtils.degToRad(azimuth)
  return new THREE.Vector3().setFromSphericalCoords(1, phi, theta)
}

// Low-rise city and hills in the distance, so the windows frame a real view
const Surroundings = ({ m }) => {
  const ref = useRef()
  const count = 650
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    const rand = seededRandom(4)
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.25 + rand() * Math.PI * 1.5
      const dist = 150 + Math.pow(rand(), 1.3) * 1300
      const tower = rand() < 0.06
      const w = 10 + rand() * 18
      const h = tower ? 30 + rand() * 30 : 5 + rand() * 16
      dummy.position.set(Math.cos(angle) * dist + 6, -18 + h / 2, Math.sin(angle) * dist + 5)
      dummy.rotation.set(0, rand() * Math.PI, 0)
      dummy.scale.set(w, h, w * (0.6 + rand() * 0.8))
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  // Façade texture on the sides, plain roofs on top/bottom (stable array: R3F
  // rebuilds the mesh when `args` change)
  const faces = useMemo(() => [m.distant, m.distant, m.roof, m.roof, m.distant, m.distant], [m])
  useEffect(() => () => box.dispose(), [box])
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[6, -18, 5]} material={m.ground}>
        <circleGeometry args={[3000, 48]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[6, -17.9, 2600]} material={m.sea}>
        <planeGeometry args={[8000, 2000]} />
      </mesh>
      {[[-1400, 300, 520], [-900, -1300, 640], [600, -1500, 700], [1500, -200, 560]].map(([x, z, r], i) => (
        <mesh key={i} position={[x, -18 - r * 0.78, z]} scale={[1, 1, 1]} material={m.ground}>
          <sphereGeometry args={[r, 32, 16]} />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[box, faces, count]} />
    </group>
  )
}

export default function Lighting({ mood = 'day', quality = 'high', m }) {
  const cfg = MOODS[mood]
  const get = useThree((s) => s.get)
  const sunRef = useRef()
  const sunDir = useMemo(() => sunVector(cfg.elevation, cfg.azimuth), [cfg])
  const center = useMemo(() => new THREE.Vector3(6.5, 0, 5), [])
  const evening = mood === 'evening'
  const shadowSize = quality === 'high' ? 4096 : 2048

  useLayoutEffect(() => {
    get().gl.toneMappingExposure = cfg.exposure
  }, [get, cfg])

  // A new map size only takes effect once the old shadow render target is gone
  useEffect(() => {
    const light = sunRef.current
    light.shadow.map?.dispose()
    light.shadow.map = null
  }, [shadowSize])

  // Nothing in the apartment moves, so shadows are rendered once per change.
  // Other passes (environment capture, AO) also render, so the flag is held
  // for a few frames to make sure the main scene pass picks it up.
  const shadowFrames = useRef(0)
  useEffect(() => {
    get().gl.shadowMap.autoUpdate = false
    shadowFrames.current = 8
  }, [get, mood, quality, shadowSize])
  useFrame(({ gl }) => {
    if (shadowFrames.current <= 0) return
    shadowFrames.current -= 1
    gl.shadowMap.needsUpdate = true
  })

  // Fit the shadow camera tightly around the apartment for maximum texel density
  useLayoutEffect(() => {
    const light = sunRef.current
    light.position.copy(center).addScaledVector(sunDir, 40)
    light.target.position.copy(center)
    light.target.updateMatrixWorld()
    const view = new THREE.Matrix4().lookAt(light.position, center, new THREE.Vector3(0, 1, 0))
    view.setPosition(light.position).invert()
    const box = new THREE.Box3()
    const p = new THREE.Vector3()
    for (const x of [-0.5, 13.5]) for (const y of [-0.5, 3.2]) for (const z of [-0.5, 10.6]) box.expandByPoint(p.set(x, y, z).applyMatrix4(view))
    const cam = light.shadow.camera
    cam.left = box.min.x
    cam.right = box.max.x
    cam.bottom = box.min.y
    cam.top = box.max.y
    cam.near = Math.max(0.5, -box.max.z - 2)
    cam.far = -box.min.z + 2
    cam.updateProjectionMatrix()
    shadowFrames.current = 8
  }, [sunDir, center])

  return (
    <>
      <Sky
        distance={4500}
        sunPosition={sunDir.clone().multiplyScalar(100)}
        turbidity={cfg.turbidity}
        rayleigh={cfg.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />
      <fog attach="fog" args={[evening ? '#9c7f78' : '#d3dde3', 250, 2200]} />
      <Surroundings m={m} />

      <directionalLight
        ref={sunRef}
        color={cfg.sun}
        intensity={cfg.intensity}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.012}
        shadow-radius={quality === 'low' ? 1 : 4}
      />
      <hemisphereLight args={[evening ? '#f1c7a8' : '#dfe9f2', '#a08d78', cfg.hemi]} />

      {/* Image-based lighting built from local light panels (no HDR download):
          a bright sky panel behind the south glazing and soft bounce from the room */}
      <Environment resolution={256} frames={1} key={mood} environmentIntensity={cfg.env}>
        <color attach="background" args={[evening ? '#3a2d2a' : '#cfc8bf']} />
        <Lightformer form="rect" intensity={evening ? 1.2 : 3.2} color={evening ? '#ffb27a' : '#f4f8ff'} position={[4, 1.4, 14]} scale={[16, 4, 1]} />
        <Lightformer form="rect" intensity={evening ? 0.4 : 1.2} color="#fff3e6" position={[20, 2, 5]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={evening ? 0.5 : 0.8} color="#fff1dc" position={[6, 6, 5]} rotation-x={Math.PI / 2} scale={[12, 9, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#d8c7b0" position={[6, -2, 5]} rotation-x={-Math.PI / 2} scale={[12, 9, 1]} />
      </Environment>

      {/* Interior lamps only exist in the evening: unused lights still cost per pixel */}
      {evening &&
        lampLights.map((l, i) => (
          <pointLight key={i} position={l.position} intensity={l.intensity} distance={l.distance} decay={2} color="#ffcf96" />
        ))}
    </>
  )
}
