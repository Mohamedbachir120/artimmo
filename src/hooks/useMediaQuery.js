import { useSyncExternalStore } from 'react'

export const useMediaQuery = (query) =>
  useSyncExternalStore(
    (fn) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', fn)
      return () => mq.removeEventListener('change', fn)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
