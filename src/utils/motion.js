// Shared motion language: soft expo-out curves, short rises, word-by-word reveals.

export const EASE_OUT = [0.16, 1, 0.3, 1]
export const EASE_RISE = [0.25, 1, 0.5, 1]
export const EASE_SOFT = [0, 0, 0.2, 1]

// Fade + 52px rise, used for blocks entering the viewport
export const rise = {
  hidden: { opacity: 0.001, y: 52 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_RISE, delay }
  })
}

// Props for a block that rises once when scrolled into view
export const riseInView = (delay = 0, amount = 0.3) => ({
  variants: rise,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount },
  custom: delay
})

export const stagger = (step = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren } }
})
