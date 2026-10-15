import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import Architecture from './Architecture'
import Furniture from './Furniture'
import Lighting from './Lighting'
import Hotspots from './Hotspots'
import FirstPersonControls from './FirstPersonControls'
import { applyLightingMode } from './materials'
import { useTourState } from './tourStore'

// Floor ring that previews where a click will take the visitor
const WalkCursor = ({ cursorRef }) => (
  <mesh ref={cursorRef} rotation-x={-Math.PI / 2} visible={false} renderOrder={3}>
    <ringGeometry args={[0.16, 0.2, 48]} />
    <meshBasicMaterial color="#ffffff" transparent opacity={0.75} depthWrite={false} />
  </mesh>
)

export default function TourScene({ store, materials, layout, colliders, startView, reducedMotion, onFirstFrame }) {
  const mood = useTourState(store, (s) => s.mood)
  const quality = useTourState(store, (s) => s.quality)
  const cursor = useRef()
  const get = useThree((s) => s.get)
  const hasHover = useMemo(() => window.matchMedia('(hover: hover)').matches, [])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    window.__r3f = get
    return () => delete window.__r3f
  }, [get])

  useEffect(() => {
    applyLightingMode(materials, mood === 'evening')
  }, [materials, mood])

  // Report once the first frame with shadows is on screen
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onFirstFrame))
    return () => cancelAnimationFrame(id)
  }, [onFirstFrame])

  const onClick = (e) => {
    e.stopPropagation()
    if (e.delta > 6 || !e.object.userData.walkable) return
    store.set({ hotspot: null })
    store.walkTo(e.point.x, e.point.z)
  }

  const onPointerMove = (e) => {
    e.stopPropagation()
    if (!cursor.current) return
    const walkable = e.object.userData.walkable
    cursor.current.visible = walkable
    if (walkable) cursor.current.position.set(e.point.x, e.point.y + 0.004, e.point.z)
    get().gl.domElement.style.cursor = walkable ? 'pointer' : ''
  }

  const onPointerOut = () => {
    if (cursor.current) cursor.current.visible = false
  }

  return (
    <>
      <Lighting mood={mood} quality={quality} m={materials} />
      <group
        onClick={onClick}
        onPointerMove={hasHover ? onPointerMove : undefined}
        onPointerOut={hasHover ? onPointerOut : undefined}
      >
        <Architecture m={materials} solids={layout.solids} openings={layout.openings} />
        <Furniture m={materials} />
      </group>
      {hasHover && <WalkCursor cursorRef={cursor} />}
      <Hotspots store={store} wallRects={colliders.walls} />
      <FirstPersonControls store={store} colliders={colliders} startView={startView} reducedMotion={reducedMotion} />

      {quality !== 'low' && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <N8AO
            aoRadius={0.55}
            distanceFalloff={0.6}
            intensity={quality === 'high' ? 2.2 : 1.8}
            aoSamples={quality === 'high' ? 16 : 8}
            denoiseSamples={quality === 'high' ? 8 : 4}
            halfRes={quality !== 'high'}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  )
}
