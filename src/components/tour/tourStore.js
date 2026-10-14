import { useSyncExternalStore } from 'react'

// Tiny store shared by the 3D scene and the DOM overlay. React state only
// changes on discrete events (room change, panel open); the per-frame camera
// pose goes through `pose` listeners so the minimap updates without renders.

export const createTourStore = (initial) => {
  let state = { ...initial }
  const listeners = new Set()
  const poseListeners = new Set()
  let controls = null

  const store = {
    get: () => state,
    set: (patch) => {
      const next = typeof patch === 'function' ? patch(state) : patch
      if (Object.keys(next).every((k) => Object.is(state[k], next[k]))) return
      state = { ...state, ...next }
      listeners.forEach((l) => l())
    },
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    // Camera pose (x, z, yaw), pushed by the controls a few times per second
    pose: { x: 0, z: 0, yaw: 0 },
    publishPose: (x, z, yaw) => {
      store.pose = { x, z, yaw }
      poseListeners.forEach((l) => l(store.pose))
    },
    subscribePose: (l) => {
      poseListeners.add(l)
      l(store.pose)
      return () => poseListeners.delete(l)
    },
    // Imperative navigation, provided by the first-person controls
    registerControls: (c) => {
      controls = c
      return () => {
        if (controls === c) controls = null
      }
    },
    goToRoom: (id) => controls?.goToView(id),
    walkTo: (x, z) => controls?.walkTo(x, z),
  }
  return store
}

export const useTourState = (store, selector) =>
  useSyncExternalStore(store.subscribe, () => selector(store.get()))
