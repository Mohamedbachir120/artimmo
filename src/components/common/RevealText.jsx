import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/motion'

const word = {
  hidden: { opacity: 0, y: '110%', filter: 'blur(5px)' },
  visible: { opacity: 1, y: '0%', filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE_OUT } }
}

// Splits text into words that slide up from behind a mask, one after another
const RevealText = ({ as = 'p', text, className = '', style, delay = 0, amount = 0.8, inView = true }) => {
  const Tag = motion[as]
  const trigger = inView
    ? { whileInView: 'visible', viewport: { once: true, amount } }
    : { animate: 'visible' }
  const words = String(text).split(' ')

  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden="true">
            <motion.span className="inline-block" variants={word}>{w}</motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

export default RevealText
