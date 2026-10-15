import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const WIPE_MS = 350

const scrollTop = () => {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

// Freezes a copy of the current page over the screen right before an internal
// navigation, lets the new page render underneath, then wipes the copy away
// with a soft gradient mask travelling from the bottom to the top.
const PageTransition = () => {
  const { pathname } = useLocation()
  const snapshot = useRef(null)
  const frame = useRef(null)
  const timeout = useRef(null)
  const isPop = useRef(false)

  const cleanup = () => {
    snapshot.current?.remove()
    snapshot.current = null
    cancelAnimationFrame(frame.current)
    clearTimeout(timeout.current)
  }

  useEffect(() => {
    const onPop = () => { isPop.current = true }

    // Capture phase runs before React Router's own click handler navigates
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return

      const main = document.querySelector('main')
      if (!main) return
      cleanup()

      const layer = document.createElement('div')
      layer.className = 'page-transition-snapshot'
      layer.setAttribute('aria-hidden', 'true')
      const copy = main.cloneNode(true)
      copy.classList.add('page-transition-snapshot-content')
      copy.style.top = `${-window.scrollY}px`
      copy.querySelectorAll('script, canvas').forEach((n) => n.remove())

      // Replace far off-screen sections with empty blocks to keep the copy light
      const vh = window.innerHeight
      Array.from(main.children).forEach((child, i) => {
        const r = child.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) {
          const spacer = document.createElement('div')
          spacer.style.height = `${r.height}px`
          copy.children[i]?.replaceWith(spacer)
        }
      })

      layer.appendChild(copy)
      document.body.appendChild(layer)
      snapshot.current = layer
      timeout.current = setTimeout(cleanup, 2600)
    }

    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick, true)
      cleanup()
    }
  }, [])

  useLayoutEffect(() => {
    if (isPop.current) isPop.current = false
    else scrollTop()

    const layer = snapshot.current
    if (!layer) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return cleanup()

    // Two frames so the new page has painted before the wipe starts
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {
        let start = null
        const step = (t) => {
          if (snapshot.current !== layer) return
          if (start === null) start = t
          const p = Math.min(1, (t - start) / WIPE_MS)
          const i = 136 * (0.5 - Math.cos(Math.PI * p) / 2)
          const mask = `linear-gradient(to bottom, #000 0%, #000 ${100 - i}%, transparent ${136 - i}%, transparent 100%)`
          layer.style.webkitMaskImage = mask
          layer.style.maskImage = mask
          if (p < 1) frame.current = requestAnimationFrame(step)
          else cleanup()
        }
        frame.current = requestAnimationFrame(step)
      })
    })
    clearTimeout(timeout.current)
    timeout.current = setTimeout(cleanup, 850)
  }, [pathname])

  return null
}

export default PageTransition
