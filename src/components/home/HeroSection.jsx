import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import verdonina from './../../assets/3D/verdonia-residence-facade-nocturne-appartement-haut-standing-alger.webp'
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
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1
          style={{ fontFamily: "'Aesthetic Romance', serif" }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          VERDONIA
        </h1>

        <p className="text-xl md:text-2xl uppercase tracking-[0.3em] text-white/90">
          Bientôt disponible
        </p>
      </motion.div>

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

