import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { EYE_HEIGHT, findRoomAt, viewpoints } from './apartment'
import { hitsAny, resolveMove, sweep } from './layout'

// First-person navigation: drag to look, click/tap the floor to walk there,
// WASD / ZQSD / arrow keys to move, room shortcuts from the overlay.
// Movement is collision-checked against walls, glass and furniture footprints.

const RADIUS = 0.28
const WALK_SPEED = 1.35
const RUN_SPEED = 2.4
const TURN_SPEED = 1.6
const LOOK_SENSITIVITY = 0.0042
const PITCH_LIMIT = 1.2
const FADE_MS = 320

const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2
const shortestAngle = (from, to) => {
  let d = (to - from) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

export default function FirstPersonControls({ store, colliders, startView, reducedMotion }) {
  const camera = useThree((s) => s.camera)
  const get = useThree((s) => s.get)
  const invalidate = useThree((s) => s.invalidate)

  const start = viewpoints[startView]
  const pose = useRef({ x: start.position[0], z: start.position[1] })
  const look = useRef({ yaw: start.yaw, pitch: start.pitch, targetYaw: start.yaw, targetPitch: start.pitch })
  const glide = useRef(null)
  const keys = useRef(new Set())
  const lastPublish = useRef(0)
  const fadeTimer = useRef(null)
  const drag = useRef(null)

  // Imperative API used by the overlay (room list, minimap) and floor clicks
  useEffect(() => {
    const rects = colliders.all

    const teleport = (x, z, yaw, pitch) => {
      glide.current = null
      store.set({ fading: true })
      clearTimeout(fadeTimer.current)
      fadeTimer.current = setTimeout(() => {
        pose.current.x = x
        pose.current.z = z
        if (yaw !== undefined) {
          look.current.yaw = look.current.targetYaw = yaw
          look.current.pitch = look.current.targetPitch = pitch ?? 0
        }
        store.set({ fading: false })
        invalidate()
      }, reducedMotion ? 120 : FADE_MS)
    }

    const travel = (x, z, yaw, pitch) => {
      const from = [pose.current.x, pose.current.z]
      const path = sweep(rects, from, [x, z], RADIUS)
      const dist = Math.hypot(x - from[0], z - from[1])
      if (!path.clear || reducedMotion || dist > 9) {
        teleport(x, z, yaw, pitch)
        return
      }
      glide.current = {
        from,
        to: [x, z],
        fromYaw: look.current.yaw,
        deltaYaw: yaw === undefined ? 0 : shortestAngle(look.current.yaw, yaw),
        fromPitch: look.current.pitch,
        toPitch: pitch ?? look.current.pitch,
        t: 0,
        duration: THREE.MathUtils.clamp(dist / 1.5, 0.7, 2.6),
      }
    }

    const api = {
      goToView: (id) => {
        const v = viewpoints[id]
        if (v) travel(v.position[0], v.position[1], v.yaw, v.pitch)
      },
      walkTo: (x, z) => {
        if (!findRoomAt(x, z)) return
        // Stop just short of an obstacle along the line of travel
        const [tx, tz] = hitsAny(rects, x, z, RADIUS)
          ? sweep(rects, [pose.current.x, pose.current.z], [x, z], RADIUS).point
          : [x, z]
        if (Math.hypot(tx - pose.current.x, tz - pose.current.z) < 0.15) return
        travel(tx, tz)
      },
    }
    const unregister = store.registerControls(api)
    return () => {
      unregister()
      clearTimeout(fadeTimer.current)
    }
  }, [store, colliders, reducedMotion, invalidate])

  // Pointer drag to look around (mouse, pen and touch)
  useEffect(() => {
    const el = get().gl.domElement
    el.style.touchAction = 'none'
    const down = (e) => {
      if (e.button !== undefined && e.button > 0) return
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 }
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      const active = drag.current
      if (!active || e.pointerId !== active.id) return
      const dx = e.clientX - active.x
      const dy = e.clientY - active.y
      active.x = e.clientX
      active.y = e.clientY
      active.moved += Math.abs(dx) + Math.abs(dy)
      if (active.moved < 4) return
      el.style.cursor = 'grabbing'
      look.current.targetYaw += dx * LOOK_SENSITIVITY
      look.current.targetPitch = THREE.MathUtils.clamp(
        look.current.targetPitch + dy * LOOK_SENSITIVITY,
        -PITCH_LIMIT,
        PITCH_LIMIT
      )
      glide.current = glide.current && { ...glide.current, deltaYaw: 0, fromYaw: look.current.yaw }
    }
    const up = (e) => {
      if (drag.current && e.pointerId === drag.current.id) {
        el.releasePointerCapture?.(e.pointerId)
        drag.current = null
        el.style.cursor = ''
      }
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [get])

  // Keyboard: physical key codes, so ZQSD on AZERTY and WASD on QWERTY both work
  useEffect(() => {
    const tracked = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'])
    const isTyping = (e) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)
    const down = (e) => {
      if (isTyping(e) || !tracked.has(e.code) || e.metaKey || e.ctrlKey) return
      // Arrow keys scroll focused overlay lists; leave them alone there
      if (e.target?.closest?.('[data-tour-ui]') && e.code.startsWith('Arrow')) return
      keys.current.add(e.code)
      glide.current = null
      e.preventDefault()
    }
    const up = (e) => keys.current.delete(e.code)
    const clear = () => keys.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const p = pose.current
    const l = look.current
    const k = keys.current

    if (glide.current) {
      const g = glide.current
      g.t = Math.min(1, g.t + delta / g.duration)
      const e = easeInOut(g.t)
      p.x = g.from[0] + (g.to[0] - g.from[0]) * e
      p.z = g.from[1] + (g.to[1] - g.from[1]) * e
      if (g.deltaYaw) {
        l.yaw = l.targetYaw = g.fromYaw + g.deltaYaw * e
        l.pitch = l.targetPitch = g.fromPitch + (g.toPitch - g.fromPitch) * e
      }
      if (g.t >= 1) glide.current = null
    } else if (k.size) {
      const turn = (k.has('ArrowRight') ? 1 : 0) - (k.has('ArrowLeft') ? 1 : 0)
      l.targetYaw -= turn * TURN_SPEED * delta
      const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0)
      const strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0)
      if (fwd || strafe) {
        const speed = (k.has('ShiftLeft') || k.has('ShiftRight') ? RUN_SPEED : WALK_SPEED) * delta
        const sin = Math.sin(l.yaw)
        const cos = Math.cos(l.yaw)
        const len = Math.hypot(fwd, strafe)
        const dx = ((-sin * fwd + cos * strafe) / len) * speed
        const dz = ((-cos * fwd - sin * strafe) / len) * speed
        ;[p.x, p.z] = resolveMove(colliders.all, p.x, p.z, p.x + dx, p.z + dz, RADIUS)
      }
    }

    // Damped look for a natural head-turn feel (instant with reduced motion)
    const lambda = reducedMotion ? 60 : 14
    l.yaw = THREE.MathUtils.damp(l.yaw, l.targetYaw, lambda, delta)
    l.pitch = THREE.MathUtils.damp(l.pitch, l.targetPitch, lambda, delta)

    camera.position.set(p.x, EYE_HEIGHT, p.z)
    camera.rotation.set(l.pitch, l.yaw, 0, 'YXZ')

    if (state.clock.elapsedTime - lastPublish.current > 0.1) {
      lastPublish.current = state.clock.elapsedTime
      store.publishPose(p.x, p.z, l.yaw)
      const room = findRoomAt(p.x, p.z)
      if (room && room !== store.get().room) store.set({ room })
    }
  })

  return null
}
