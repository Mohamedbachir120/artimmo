import { useRef, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import verdonina from './../../assets/3D/v2/verdonia vue de nuit.webp'
import { useIntroDone } from "../../hooks/useIntroDone";
import { EASE_OUT } from "../../utils/motion";
import Louvres from "../common/Louvres";

// A line of text that rises from behind its own mask
const MaskLine = ({ play, delay, children, className = "", maskClassName = "", style }) => (
  <span className={`block overflow-hidden pb-[0.12em] ${maskClassName}`}>
    <motion.span
      className={`block ${className}`}
      style={style}
      initial={{ y: "105%" }}
      animate={play ? { y: "0%" } : undefined}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.span>
  </span>
)

// Opening scene: the façade appears as the louvres pivot open, while the
// camera keeps a slow push-in and drift. On scroll the image recedes into a
// framed window and hands over to the next scene.
const HeroSection = () => {
  const introDone = useIntroDone()
  const reduced = useReducedMotion()
  const [imgReady, setImgReady] = useState(false)
  const play = introDone && imgReady
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const inset = useTransform(scrollYProgress, [0, 0.7], [0, reduced ? 0 : 7])
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round 6px)`
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"])
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", reduced ? "0%" : "-35%"])
  const fadeOut = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <motion.img
            src={verdonina}
            alt="Résidences haut standing Alger"
            className="w-full h-full object-cover"
            ref={(el) => { if (el?.complete && el.naturalWidth) setImgReady(true) }}
            onLoad={() => setImgReady(true)}
            onError={() => setImgReady(true)}
            // Camera push-in with a slight lateral drift, slower than the reveal
            initial={{ scale: 1.22, x: "-2.5%" }}
            animate={play ? { scale: 1.04, x: "0%" } : undefined}
            transition={{ duration: 3.2, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </motion.div>
        {/* Reading gradient: dark at the foot where the title sits */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1721] via-black/25 to-black/20" />
        <Louvres play={play} count={11} duration={1.25} />
      </motion.div>

      <motion.div
        className="relative z-30 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-24 md:pb-20 text-white opacity-(--o)"
        // CSS variable rather than `opacity`, see Louvres
        style={{ y: textY, '--o': fadeOut }}
      >
        <MaskLine play={play} delay={0.75} className="text-[11px] md:text-xs uppercase tracking-[0.45em] text-brand-sage" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Résidence by ARTIMMO
        </MaskLine>

        <h1 className="mt-2 leading-[0.85]" style={{ fontFamily: "Blacksword, cursive" }}>
          <MaskLine play={play} delay={0.9} maskClassName="-ml-8 pl-8 pt-4" className="text-[22vw] md:text-[13vw] lg:text-[11rem]">
            Verdonia
          </MaskLine>
        </h1>

        <div className="mt-6 md:mt-8 flex items-center gap-5">
          <motion.span
            className="h-px w-16 md:w-28 bg-brand-blue origin-left"
            initial={{ scaleX: 0 }}
            animate={play ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.25 }}
          />
          <h2 className="text-xl md:text-3xl font-light tracking-[0.35em]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <MaskLine play={play} delay={1.35}>COMING SOON</MaskLine>
          </h2>
        </div>
      </motion.div>

      {/* Scroll cue: a line that keeps drawing downward */}
      <motion.div className="hidden md:block absolute z-30 bottom-6 right-10 opacity-(--o)" style={{ '--o': fadeOut }} aria-hidden="true">
        <motion.div
          className="flex flex-col items-center gap-3 text-white/70"
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.35em] [writing-mode:vertical-rl]">Défiler</span>
          <span className="relative block h-14 w-px bg-white/20 overflow-hidden">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-white"
              animate={reduced ? undefined : { y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
