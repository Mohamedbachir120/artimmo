import { useEffect } from "react";
import { motion } from "framer-motion";
import { markIntroDone } from "../../hooks/useIntroDone";
import { EASE_OUT, EASE_RISE } from "../../utils/motion";

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      markIntroDone();
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "#0d1721" }}
      initial={{ opacity: 1 }}
      // Dissolves into the closed louvres of the opening scene, which then
      // pivot open: one continuous reveal instead of two curtains
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <motion.div
        initial={{ opacity: 0.001, y: 52 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.6, ease: EASE_RISE }}
      >
        <div className="text-5xl font-bold text-white tracking-wider">
          <span
            style={{ fontFamily: "'Aesthetic Romance', serif" }}
            className="text-6xl"
          >
            ARTI
          </span>
          <span
            className="text-brand-blue"
            style={{ fontFamily: "'Aesthetic Romance', serif" }}
          >
            MMO
          </span>
        </div>
        <motion.div
          className="mt-4 h-px bg-brand-blue origin-left"
          style={{ width: 200 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: EASE_OUT, delay: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;
