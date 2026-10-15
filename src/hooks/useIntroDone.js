import { useSyncExternalStore } from 'react'

// Tracks whether the opening loader has left, so first-screen animations
// play once the page is actually visible instead of underneath the loader.
let introDone = false
const listeners = new Set()

export const markIntroDone = () => {
  introDone = true
  listeners.forEach((fn) => fn())
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const useIntroDone = () => useSyncExternalStore(subscribe, () => introDone)
