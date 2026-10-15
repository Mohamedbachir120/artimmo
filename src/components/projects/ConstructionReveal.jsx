import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Card cover that comes alive on hover (or tap on touch screens) as a short
// construction film: land → foundations → structure → facades → delivery.
// Plays a real video when one exists, otherwise real stage photos blended into
// one continuous take. Without media it stays the plain cover image.

const STAGE_HOLD = 2.4 // seconds each stage photo stays fully visible
const STAGE_BLEND = 1.1 // seconds of cross-dissolve between stages
const FADE_MS = 700

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pickSources = (video) => {
  if (!video) return []
  const small = typeof window !== 'undefined' && window.innerWidth < 768
  if (small && video.mp4Mobile) return [{ src: video.mp4Mobile, type: 'video/mp4' }]
  return [
    video.webm && { src: video.webm, type: 'video/webm' },
    video.mp4 && { src: video.mp4, type: 'video/mp4' }
  ].filter(Boolean)
}

const chapterAt = (chapters, t) => {
  let idx = 0
  chapters.forEach((c, i) => { if (t >= c.at) idx = i })
  return idx
}

const ConstructionReveal = ({ href, cover, alt, media, name }) => {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const stageRefs = useRef([])
  const stageTrackRef = useRef(null)
  const progressRef = useRef(null)
  const rafRef = useRef(0)
  const stopTimer = useRef(0)
  const lastPointer = useRef('mouse')

  const [near, setNear] = useState(false)
  // null | 'hover' (mouse over the image) | 'manual' (tap, button, keyboard)
  const [mode, setMode] = useState(null)
  const active = mode !== null
  const activeRef = useRef(false)
  useEffect(() => { activeRef.current = active }, [active])
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [primed, setPrimed] = useState(false) // stage photos mounted after first play
  const [isTouch, setIsTouch] = useState(false)

  const hasVideo = Boolean(media?.video)
  const stages = useMemo(() => (hasVideo ? [] : media?.stages ?? []), [hasVideo, media])
  const hasMedia = !failed && (hasVideo || stages.length > 1)
  const chapters = hasVideo
    ? media.chapters ?? []
    : stages.map((s, i) => ({ at: i * (STAGE_HOLD + STAGE_BLEND), label: s.label }))
  const showFilm = active && ready
  if (active && !primed) setPrimed(true)

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Load media only once the card approaches the viewport, and stop the film
  // if the card scrolls away while playing.
  useEffect(() => {
    if (!hasMedia || !rootRef.current) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true)
      else { setReady(false); setMode(null) }
    }, { rootMargin: '300px 0px' })
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [hasMedia])

  useEffect(() => {
    if (near && hasVideo) videoRef.current?.load()
  }, [near, hasVideo])

  // Video playback
  useEffect(() => {
    const v = videoRef.current
    if (!hasVideo || !v) return
    clearTimeout(stopTimer.current)
    if (active) {
      v.preload = 'auto'
      if (v.ended || v.currentTime > 0) v.currentTime = 0
      const tryPlay = () => {
        if (!activeRef.current) return
        v.play()?.catch((err) => {
          // A source swap (lazy load) interrupts play(): retry once data is in
          if (err?.name === 'AbortError') v.addEventListener('loadeddata', tryPlay, { once: true })
          // Autoplay refused: stay on the cover, the visitor can retry
          else if (err?.name === 'NotAllowedError') setMode(null)
          else setFailed(true)
        })
      }
      tryPlay()
    } else {
      // Let the film fade out over the cover before rewinding it
      stopTimer.current = setTimeout(() => {
        v.pause()
        v.currentTime = 0
        if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)'
      }, FADE_MS)
    }
    return () => clearTimeout(stopTimer.current)
  }, [active, hasVideo])

  // Stage photos: decode them all before starting so the take never stutters
  useEffect(() => {
    if (hasVideo || !active || stages.length < 2) return
    let cancelled = false
    Promise.all(stages.map((s) => {
      const img = new Image()
      img.src = s.src
      return img.decode()
    }))
      .then(() => { if (!cancelled) setReady(true) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [active, hasVideo, stages])

  // Frame loop: progress bar, chapter labels, stage blending
  useEffect(() => {
    if (!showFilm) return
    const reduced = prefersReducedMotion()
    const total = hasVideo ? 0 : stages.length * (STAGE_HOLD + STAGE_BLEND) - STAGE_BLEND
    const start = performance.now()
    let lastChapter = -1

    const tick = (now) => {
      let t, duration
      if (hasVideo) {
        const v = videoRef.current
        t = v?.currentTime ?? 0
        duration = v?.duration || 1
      } else {
        t = Math.min((now - start) / 1000, total)
        duration = total
        stageRefs.current.forEach((el, i) => {
          if (!el) return
          const begin = i * (STAGE_HOLD + STAGE_BLEND)
          const o = i === 0 ? 1 : Math.min(Math.max((t - begin + STAGE_BLEND) / STAGE_BLEND, 0), 1)
          el.style.opacity = o
        })
        if (stageTrackRef.current && !reduced) {
          const k = t / total
          stageTrackRef.current.style.transform = `scale(${1.02 + 0.07 * k}) translate3d(0, ${-1.2 * k}%, 0)`
        }
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(t / duration, 1)})`
      const c = chapterAt(chapters, t)
      if (c !== lastChapter) { lastChapter = c; setChapter(c) }
      if (hasVideo || t < total) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // chapters/stages derive from media, which is static per card
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilm, hasVideo])

  // Every start begins from the cover: the film fades in once it truly plays
  const start = (m) => {
    setNear(true) // a tap can come before the observer reports the card
    setReady(false)
    setChapter(0)
    setMode(m)
  }
  const stop = () => {
    setReady(false)
    setMode(null)
  }
  const toggle = () => (active ? stop() : start('manual'))

  const onPointerEnter = (e) => {
    lastPointer.current = e.pointerType
    if (e.pointerType === 'mouse' && hasMedia && !active && !prefersReducedMotion()) start('hover')
  }
  const onPointerLeave = (e) => {
    if (e.pointerType === 'mouse' && mode === 'hover') stop()
  }
  const onPointerDown = (e) => { lastPointer.current = e.pointerType }

  // On touch screens the first tap on the image plays the film instead of
  // opening the project; tapping again (or the close button) restores the cover.
  const onImageClick = (e) => {
    if (!hasMedia || lastPointer.current === 'mouse') return
    e.preventDefault()
    toggle()
  }

  const onButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  return (
    <div
      ref={rootRef}
      className="absolute inset-0"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      <Link to={href} onClick={onImageClick} tabIndex={-1} aria-hidden="true" className="block absolute inset-0">
        <img
          src={cover}
          alt={alt}
          className={`project-card-img w-full h-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] motion-reduce:transition-none ${showFilm ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />

        {hasVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showFilm ? 'opacity-100' : 'opacity-0'}`}
            muted
            playsInline
            disablePictureInPicture
            preload={near ? 'metadata' : 'none'}
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setReady(true)}
          >
            {near && pickSources(media.video).map((s, i, all) => (
              // Only the last source failing means no playable format
              <source key={s.src} src={s.src} type={s.type} onError={i === all.length - 1 ? () => setFailed(true) : undefined} />
            ))}
          </video>
        )}

        {stages.length > 1 && primed && (
          <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${showFilm ? 'opacity-100' : 'opacity-0'}`}>
            <div ref={stageTrackRef} className="absolute inset-0 will-change-transform">
              {stages.map((s, i) => (
                <img
                  key={s.src}
                  ref={(el) => { stageRefs.current[i] = el }}
                  src={s.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        )}
      </Link>

      <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-transparent to-transparent pointer-events-none" />

      {hasMedia && (
        <>
          {/* Buffering hint */}
          {active && !ready && (
            <div className="absolute left-0 right-0 bottom-0 h-[2px] overflow-hidden pointer-events-none">
              <div className="h-full w-1/3 bg-brand-blue/70 animate-[reveal-buffer_1.1s_ease-in-out_infinite]" />
            </div>
          )}

          {media.demo && (
            <span className={`absolute top-4 left-14 right-24 px-2 py-1 rounded border border-dashed border-amber-300/70 bg-black/55 text-[10px] leading-tight text-amber-100 pointer-events-none transition-opacity duration-500 ${showFilm ? 'opacity-100' : 'opacity-0'}`}>
              Démo : chantier sans lien avec ce projet
            </span>
          )}

          {/* Scrim so the caption reads over any footage */}
          <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none transition-opacity duration-700 ${showFilm ? 'opacity-100' : 'opacity-0'}`} />

          {/* Chapter caption + progress */}
          <div
            className={`absolute left-4 right-4 bottom-4 pointer-events-none transition-opacity duration-500 ${showFilm ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!showFilm}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-sage/80 mb-1">Du terrain à la livraison</p>
            <p key={chapter} className="font-playfair text-lg text-white leading-tight animate-[reveal-caption_0.6s_cubic-bezier(0.16,1,0.3,1)]">
              {chapters[chapter]?.label}
            </p>
            <div className="mt-2 h-[2px] bg-white/15 rounded-full overflow-hidden">
              <div ref={progressRef} className="h-full bg-brand-blue origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
            {media.credit && <p className="mt-1 text-[10px] text-white/50 text-right">{media.credit}</p>}
          </div>

          {/* Touch / keyboard control. Hidden for mouse users unless focused. */}
          <button
            type="button"
            onClick={onButtonClick}
            aria-pressed={active}
            aria-label={active ? `Fermer le film du chantier de ${name}` : `Voir le film du chantier de ${name}`}
            className={`absolute z-10 rounded-md text-xs font-medium backdrop-blur-md bg-brand-primary/60 text-white border border-white/15 transition-opacity duration-300 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${
              active ? 'top-4 left-4 w-8 h-8 grid place-items-center' : 'left-4 bottom-4 px-3 py-1.5 inline-flex items-center gap-2'
            } ${isTouch || mode === 'manual' ? 'opacity-100' : 'opacity-0 motion-reduce:group-hover:opacity-100'} ${mode === 'hover' ? 'pointer-events-none' : ''}`}
          >
            {active ? (
              <span aria-hidden="true" className="text-base leading-none">×</span>
            ) : (
              <>
                <span aria-hidden="true" className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white" />
                Voir le chantier
              </>
            )}
          </button>
        </>
      )}

      {!hasMedia && import.meta.env.DEV && (
        <span className="absolute left-4 bottom-4 px-2 py-1 rounded border border-dashed border-amber-300/60 text-[10px] text-amber-200/90 bg-black/40 pointer-events-none">
          Dev : aucun média de chantier réel
        </span>
      )}
    </div>
  )
}

export default ConstructionReveal
