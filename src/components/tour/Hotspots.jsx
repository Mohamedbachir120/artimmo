import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { hotspots } from './apartment'
import { sweep } from './layout'
import { useTourState } from './tourStore'

const MAX_DISTANCE = 7

// Info markers anchored in 3D. Only markers in view range with a clear line of
// sight (no wall in between) are shown, so they never float through walls.
export default function Hotspots({ store, wallRects }) {
  const [visible, setVisible] = useState(() => new Set())
  const active = useTourState(store, (s) => s.hotspot)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current < 0.25) return
    elapsed.current = 0
    const { x, z } = store.pose
    const next = new Set()
    hotspots.forEach((h) => {
      const hx = h.position[0]
      const hz = h.position[2]
      if (Math.hypot(hx - x, hz - z) > MAX_DISTANCE) return
      if (sweep(wallRects, [x, z], [hx, hz], 0.02).clear) next.add(h.id)
    })
    const same = next.size === visible.size && [...next].every((id) => visible.has(id))
    if (!same) setVisible(next)
  })

  return hotspots.map((h) =>
    visible.has(h.id) ? (
      <Html key={h.id} position={h.position} center zIndexRange={[30, 10]}>
        <button
          type="button"
          data-tour-ui
          onClick={() => store.set({ hotspot: active === h.id ? null : h.id })}
          className={`tour-hotspot group ${active === h.id ? 'is-active' : ''}`}
          aria-label={`${h.title} : afficher les détails`}
          aria-expanded={active === h.id}
        >
          <span className="tour-hotspot__dot" aria-hidden="true" />
          <span className="tour-hotspot__label">{h.title}</span>
        </button>
      </Html>
    ) : null
  )
}
