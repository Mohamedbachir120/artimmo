import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { EASE_OUT } from '../../utils/motion'

// ARTIMMO's signature reveal: a row of vertical brise-soleil slats in the
// page colour that pivot open on their axis, uncovering the architecture
// behind them, from the centre of the frame outwards.
//
// Timed:  <Louvres play={bool} />            opens once when `play` turns true
// Scroll: <Louvres progress={motionValue} /> follows a 0 → 1 motion value

const SLAT_COLOR = '#0d1721'

const order = (i, count) => Math.abs(i - (count - 1) / 2) / ((count - 1) / 2 || 1)

const ScrollSlat = ({ progress, i, count }) => {
  // Centre slats start turning first; each one needs 45% of the travel
  const start = order(i, count) * 0.55
  const rotateY = useTransform(progress, [start, start + 0.45], [0, 90])
  const opacity = useTransform(progress, [start + 0.3, start + 0.45], [1, 0])
  // Opacity goes through a CSS variable: a scroll-linked `opacity` is handed to
  // a native ScrollTimeline that tracks the whole page, not this section
  return <motion.div className="h-full flex-1 opacity-(--o)" style={{ background: SLAT_COLOR, rotateY, '--o': opacity, marginRight: -1 }} />
}

const Louvres = ({ play, progress, count = 9, delay = 0, duration = 1.1, className = '' }) => {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-20 flex pointer-events-none ${className}`}
      style={{ perspective: 1400 }}
    >
      {Array.from({ length: count }, (_, i) =>
        progress ? (
          <ScrollSlat key={i} progress={progress} i={i} count={count} />
        ) : (
          <motion.div
            key={i}
            className="h-full flex-1"
            style={{ background: SLAT_COLOR, marginRight: -1 }}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={play ? { rotateY: 90, opacity: 0 } : undefined}
            transition={{
              rotateY: { duration, ease: EASE_OUT, delay: delay + order(i, count) * 0.32 },
              opacity: { duration: 0.25, delay: delay + order(i, count) * 0.32 + duration * 0.55 }
            }}
          />
        )
      )}
    </div>
  )
}

export default Louvres
