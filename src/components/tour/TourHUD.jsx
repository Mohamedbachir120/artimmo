import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { areaOf, hotspots, rooms, tourRooms } from './apartment'
import { useTourState } from './tourStore'

const PLAN_BOUNDS = [-0.4, -0.4, 13.4, 10.8]
const fmtArea = (id) => `${Math.round(areaOf(id))} m²`

const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
)
const ICONS = {
  close: 'M6 18L18 6M6 6l12 12',
  back: 'M10 19l-7-7m0 0l7-7m-7 7h18',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  expand: 'M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4',
  plan: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  help: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const HudButton = ({ label, onClick, icon, active = false, children, className = '' }) => (
  <button
    type="button"
    data-tour-ui
    onClick={onClick}
    aria-label={label}
    aria-pressed={active}
    title={label}
    className={`glass-strong inline-flex items-center justify-center gap-2 rounded-full text-white transition-colors hover:bg-brand-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${children ? 'px-4 h-11 text-sm' : 'w-11 h-11'} ${active ? 'bg-brand-blue/40' : ''} ${className}`}
  >
    {icon && <Icon d={icon} />}
    {children}
  </button>
)

// Floor plan with a live position marker; click a room to go there
const MiniPlan = ({ store, current }) => {
  const marker = useRef()
  useEffect(
    () =>
      store.subscribePose(({ x, z, yaw }) => {
        if (!marker.current) return
        const deg = (-yaw * 180) / Math.PI
        marker.current.setAttribute('transform', `translate(${x} ${z}) rotate(${deg})`)
      }),
    [store]
  )
  const [x0, z0, x1, z1] = PLAN_BOUNDS
  return (
    <svg viewBox={`${x0} ${z0} ${x1 - x0} ${z1 - z0}`} className="w-full h-auto" role="group" aria-label="Plan de l'appartement">
      {rooms.map((r) => {
        const id = r.parent ?? r.id
        const [rx0, rz0, rx1, rz1] = r.rect
        const isCurrent = id === current
        return (
          <rect
            key={r.id}
            x={rx0}
            y={rz0}
            width={rx1 - rx0}
            height={rz1 - rz0}
            className="cursor-pointer transition-colors"
            fill={isCurrent ? 'rgba(106,160,174,0.45)' : r.outdoor ? 'rgba(96,136,116,0.18)' : 'rgba(255,255,255,0.08)'}
            stroke="rgba(186,203,193,0.55)"
            strokeWidth={0.06}
            onClick={() => store.goToRoom(id)}
          >
            <title>{tourRooms.find((t) => t.id === id)?.name}</title>
          </rect>
        )
      })}
      <g ref={marker} pointerEvents="none">
        <path d="M0 0 L-1.1 -2.2 A2.4 2.4 0 0 1 1.1 -2.2 Z" fill="rgba(255,255,255,0.28)" />
        <circle r={0.32} fill="#fff" stroke="#26405B" strokeWidth={0.1} />
      </g>
    </svg>
  )
}

export default function TourHUD({ store, project, onExit }) {
  const room = useTourState(store, (s) => s.room)
  const mood = useTourState(store, (s) => s.mood)
  const fading = useTourState(store, (s) => s.fading)
  const hotspotId = useTourState(store, (s) => s.hotspot)
  const [showHelp, setShowHelp] = useState(true)
  const [showPlan, setShowPlan] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hotspot = hotspots.find((h) => h.id === hotspotId)
  const currentRoom = tourRooms.find((r) => r.id === room)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (store.get().hotspot) store.set({ hotspot: null })
      else if (!document.fullscreenElement) onExit()
    }
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFs)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFs)
    }
  }, [store, onExit])

  // The help card fades by itself once the visitor starts exploring
  useEffect(() => {
    if (!showHelp) return
    const t = setTimeout(() => setShowHelp(false), 9000)
    return () => clearTimeout(t)
  }, [showHelp])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }
  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none font-inter">
      {/* Fade used when moving between rooms out of direct sight */}
      <div
        className="absolute inset-0 bg-[#0d1721] transition-opacity duration-300 ease-out"
        style={{ opacity: fading ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <div className="pointer-events-auto absolute top-0 inset-x-0 flex items-start justify-between gap-3 p-3 md:p-5 bg-gradient-to-b from-[#0d1721]/70 to-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <HudButton label="Retour à la fiche du bien" onClick={onExit} icon={ICONS.back} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-sage/80 truncate">Visite immersive · {project.name}</p>
            <p className="text-white text-base md:text-lg font-semibold truncate" aria-live="polite">
              {currentRoom?.name}
              {currentRoom && <span className="ml-2 text-brand-sage font-normal text-sm">{fmtArea(currentRoom.id)}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <HudButton
            label={mood === 'day' ? 'Passer en ambiance soirée' : 'Passer en lumière du jour'}
            onClick={() => store.set({ mood: mood === 'day' ? 'evening' : 'day' })}
            icon={mood === 'day' ? ICONS.moon : ICONS.sun}
          />
          <HudButton label="Afficher le plan" onClick={() => setShowPlan((v) => !v)} icon={ICONS.plan} active={showPlan} />
          <HudButton label="Aide à la navigation" onClick={() => setShowHelp((v) => !v)} icon={ICONS.help} active={showHelp} className="max-sm:hidden" />
          {canFullscreen && (
            <HudButton label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'} onClick={toggleFullscreen} icon={ICONS.expand} className="max-sm:hidden" />
          )}
          <HudButton label="Quitter la visite" onClick={onExit} icon={ICONS.close} />
        </div>
      </div>

      {/* Help card */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-auto absolute left-1/2 top-20 md:top-24 -translate-x-1/2 w-[min(92vw,440px)] glass-strong rounded-2xl p-4 text-sm text-brand-sage"
            role="note"
          >
            <ul className="space-y-1.5">
              <li><span className="text-white">Glissez</span> pour regarder autour de vous</li>
              <li><span className="text-white">Cliquez ou touchez le sol</span> pour vous y rendre</li>
              <li className="hidden md:list-item"><span className="text-white">ZQSD / WASD</span> ou flèches pour marcher, Maj pour accélérer</li>
              <li><span className="text-white">Points lumineux</span> : détails des prestations</li>
            </ul>
            <button type="button" data-tour-ui onClick={() => setShowHelp(false)} className="mt-3 text-brand-blue hover:text-white text-sm font-semibold">
              Commencer la visite
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspot detail */}
      <AnimatePresence>
        {hotspot && (
          <motion.aside
            key={hotspot.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto absolute right-3 md:right-5 top-20 md:top-24 w-[min(92vw,340px)] z-10 glass-strong rounded-2xl p-5"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-white text-lg font-semibold">{hotspot.title}</h2>
              <button type="button" data-tour-ui onClick={() => store.set({ hotspot: null })} className="text-brand-sage hover:text-white" aria-label="Fermer le détail">
                <Icon d={ICONS.close} />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-brand-sage">{hotspot.body}</p>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bottom: room navigation + plan */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-3 p-3 md:p-5 bg-gradient-to-t from-[#0d1721]/75 to-transparent">
        <nav aria-label="Pièces" className="pointer-events-auto min-w-0 flex-1">
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {tourRooms.map((r) => (
              <li key={r.id} className="shrink-0">
                <button
                  type="button"
                  data-tour-ui
                  onClick={() => store.goToRoom(r.id)}
                  aria-current={room === r.id ? 'location' : undefined}
                  className={`rounded-full px-4 h-10 text-sm whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${
                    room === r.id ? 'bg-brand-blue text-white' : 'glass text-brand-sage hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-brand-sage/70 max-w-xl">
            Appartement témoin représentatif. Agencement, mobilier et finitions sont indicatifs et non contractuels.
          </p>
        </nav>
        <AnimatePresence>
          {showPlan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="pointer-events-auto glass-strong rounded-2xl p-3 w-40 md:w-56 shrink-0 max-md:absolute max-md:right-3 max-md:bottom-28"
            >
              <MiniPlan store={store} current={room} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
