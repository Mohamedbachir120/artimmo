import { Component, useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import TourScene from './TourScene'
import TourHUD from './TourHUD'
import { START_VIEW } from './apartment'
import { buildColliders, buildWalls } from './layout'
import { createMaterials, disposeGeometryCache, disposeMaterials } from './materials'
import { disposeFurnitureGeometry } from './furnitureData'
import { disposeTextures, generateTextures } from './textures'
import { createTourStore } from './tourStore'

const QUALITY_STEPS = ['low', 'medium', 'high']

const detectWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const isConstrainedDevice = () =>
  window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4

class SceneErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error) {
    console.error('Visite 3D indisponible :', error)
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children
  }
}

// Shown when WebGL is missing or the scene fails: the listing stays usable
const Fallback = ({ project, onExit, reason }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    {project.images?.[0] && (
      <img src={project.images[0].src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
    )}
    <div className="relative glass-strong rounded-2xl p-6 md:p-8 max-w-md text-center">
      <h2 className="text-white text-xl font-semibold mb-3">Visite 3D indisponible sur cet appareil</h2>
      <p className="text-brand-sage text-sm leading-relaxed mb-6">{reason}</p>
      <button
        type="button"
        onClick={onExit}
        className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue/90"
      >
        Revenir à la fiche du bien
      </button>
    </div>
  </div>
)

const TourLoader = ({ progress, label }) => (
  <motion.div
    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0d1721]"
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
    role="status"
    aria-live="polite"
  >
    <p className="text-[11px] uppercase tracking-[0.3em] text-brand-sage/80 mb-3">Visite immersive</p>
    <p className="text-white text-2xl md:text-3xl font-semibold mb-8 text-center px-6">{label}</p>
    <div className="w-56 h-px bg-white/10 overflow-hidden rounded-full">
      <div className="h-full bg-brand-blue transition-[width] duration-300 ease-out" style={{ width: `${Math.round(progress * 100)}%` }} />
    </div>
    <p className="mt-3 text-xs text-brand-sage/70 tabular-nums">
      {progress < 1 ? `Préparation des matériaux · ${Math.round(progress * 100)} %` : "Mise en lumière de l'appartement…"}
    </p>
  </motion.div>
)

export default function PropertyTour({ project, onExit }) {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const constrained = useMemo(() => isConstrainedDevice(), [])
  const webgl = useMemo(() => detectWebGL(), [])
  const store = useMemo(
    () => createTourStore({ room: START_VIEW, mood: 'day', quality: constrained ? 'medium' : 'high', hotspot: null, fading: false }),
    [constrained]
  )
  // Handy for inspecting the tour from the devtools console during development
  useEffect(() => {
    if (!import.meta.env.DEV) return
    window.__tour = store
    return () => delete window.__tour
  }, [store])
  const layout = useMemo(() => buildWalls(), [])
  const colliders = useMemo(() => buildColliders(layout), [layout])
  const [progress, setProgress] = useState(0)
  const [materials, setMaterials] = useState(null)
  const [visible, setVisible] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const quality = useMemo(() => store.get().quality, [store])
  const [dpr, setDpr] = useState(constrained ? 1.25 : Math.min(window.devicePixelRatio, 2))

  // Generate the PBR textures progressively, then build the materials
  useEffect(() => {
    if (!webgl) return
    let cancelled = false
    let textures
    let mats
    generateTextures((p) => !cancelled && setProgress(p), { lowRes: constrained }).then((t) => {
      textures = t
      if (cancelled) {
        disposeTextures(t)
        return
      }
      mats = createMaterials(t)
      setMaterials(mats)
    })
    return () => {
      cancelled = true
      disposeMaterials(mats)
      disposeTextures(textures)
      disposeGeometryCache()
      disposeFurnitureGeometry()
    }
  }, [webgl, constrained])

  const onFirstFrame = useCallback(() => setVisible(true), [])

  // Drop one quality step when the frame rate cannot hold
  const onDecline = useCallback(() => {
    const q = store.get().quality
    const i = QUALITY_STEPS.indexOf(q)
    if (i > 0) store.set({ quality: QUALITY_STEPS[i - 1] })
    setDpr((d) => Math.max(1, d - 0.25))
  }, [store])

  const fallback = (reason) => <Fallback project={project} onExit={onExit} reason={reason} />

  return (
    <div className="fixed inset-0 z-[200] bg-[#0d1721] text-white overflow-hidden" role="dialog" aria-modal="true" aria-label={`Visite immersive : ${project.name}`}>
      {!webgl ? (
        fallback("Votre navigateur ne prend pas en charge l'affichage 3D (WebGL). Les photos et le descriptif du bien restent disponibles sur la fiche.")
      ) : contextLost ? (
        fallback("L'affichage 3D a été interrompu par l'appareil, souvent par manque de mémoire graphique. Fermez d'autres onglets puis réessayez.")
      ) : (
        <SceneErrorBoundary fallback={fallback("Un problème est survenu lors du chargement de la scène 3D. Les photos et le descriptif du bien restent disponibles sur la fiche.")}>
          {materials && (
            <Canvas
              className="!absolute inset-0"
              shadows={{ type: THREE.PCFShadowMap }}
              dpr={dpr}
              camera={{ fov: window.innerWidth < window.innerHeight ? 74 : 62, near: 0.05, far: 6000, position: [0, 1.6, 0] }}
              gl={{ antialias: quality === 'low', powerPreference: 'high-performance', stencil: false }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault()
                  setContextLost(true)
                })
              }}
              aria-label="Vue 3D de l'appartement témoin. Glissez pour regarder, cliquez au sol pour vous déplacer."
            >
              <PerformanceMonitor onDecline={onDecline} flipflops={2} />
              <TourScene
                store={store}
                materials={materials}
                layout={layout}
                colliders={colliders}
                startView={START_VIEW}
                reducedMotion={reducedMotion}
                onFirstFrame={onFirstFrame}
              />
            </Canvas>
          )}
          {visible && <TourHUD store={store} project={project} onExit={onExit} />}
        </SceneErrorBoundary>
      )}
      <AnimatePresence>
        {webgl && !contextLost && !visible && <TourLoader key="loader" progress={progress} label={project.name} />}
      </AnimatePresence>
    </div>
  )
}
