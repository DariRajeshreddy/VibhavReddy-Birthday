"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when overlay is active
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleEnter = () => {
    // Unlock all audio contexts globally
    document.querySelectorAll('audio').forEach(audio => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    });
    
    setIsOpen(true);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onClick={handleEnter}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-amber-50 cursor-pointer"
        >
          {/* Grain Background Effect (replacing missing noise.png) */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-center px-4"
          >
            <span className="text-4xl md:text-6xl mb-6">🎁</span>
            <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase mb-4">
              Vibhav's Journey
            </h1>
            <p className="text-xs md:text-sm tracking-[0.4em] text-white/50 animate-pulse mt-4">
              TAP ANYWHERE TO ENTER
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
