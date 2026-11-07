import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import verdonina from './../../assets/3D/v2/verdonia vue de nuit.webp'
import Button from "../common/Button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={verdonina}
          alt="Résidences haut standing Alger"
          className="w-full h-full object-cover"
        />
        {/* Overlay neutre (noir) pour la lisibilité du texte, sans teinte bleue ni flou */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl leading-none"
          style={{ fontFamily: "Blacksword, cursive" }}
        >
          Verdonia
        </h1>

        <p
          className="mt-2 text-lg md:text-2xl tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Résidence by ARTIMMO
        </p>

        <h2
          className="mt-8 md:mt-12 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          COMING SOON
        </h2>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;