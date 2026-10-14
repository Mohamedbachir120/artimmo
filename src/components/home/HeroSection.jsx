import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import verdonina from './../../assets/3D/v2/verdonia vue de nuit.webp'
import { useIntroDone } from "../../hooks/useIntroDone";
import { EASE_OUT, EASE_RISE, EASE_SOFT } from "../../utils/motion";

const riseIn = (play, delay) => ({
  initial: { opacity: 0.001, y: 52 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.5, ease: EASE_RISE, delay }
})

const HeroSection = () => {
  const introDone = useIntroDone()
  const [imgReady, setImgReady] = useState(false)
  const play = introDone && imgReady

  // Background drifts slower than the page while the hero scrolls out
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 900], [0, 180])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <motion.img
          src={verdonina}
          alt="Résidences haut standing Alger"
          className="w-full h-full object-cover"
          ref={(el) => { if (el?.complete && el.naturalWidth) setImgReady(true) }}
          onLoad={() => setImgReady(true)}
          onError={() => setImgReady(true)}
          initial={{ scale: 1.45 }}
          animate={play ? { scale: 1 } : undefined}
          transition={{ duration: 1, ease: EASE_SOFT }}
        />
        {/* Overlay neutre (noir) pour la lisibilité du texte, sans teinte bleue ni flou */}
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl leading-none"
          style={{ fontFamily: "Blacksword, cursive" }}
          {...riseIn(play, 0.4)}
        >
          Verdonia
        </motion.h1>

        <motion.p
          className="mt-2 text-lg md:text-2xl tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif" }}
          {...riseIn(play, 0.5)}
        >
          Résidence by ARTIMMO
        </motion.p>

        <motion.h2
          className="mt-8 md:mt-12 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif" }}
          {...riseIn(play, 0.6)}
        >
          COMING SOON
        </motion.h2>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-10"
        initial={{ opacity: 0, scale: 0.72 }}
        animate={play ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
