import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 })

  useEffect(() => {
    if (!isVisible) return

    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, (duration * 1000) / steps)

    return () => clearInterval(timer)
  }, [isVisible, value, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default AnimatedCounter