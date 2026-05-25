"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleReady = () => setIsReady(true);
    window.addEventListener('heroYtReady', handleReady);
    
    // Fallback: If YT takes more than 4s to load, allow the user to enter anyway
    const timer = setTimeout(() => setIsReady(true), 4000);

    return () => {
      window.removeEventListener('heroYtReady', handleReady);
      clearTimeout(timer);
    };
  }, []);

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
    
    // Dispatch synchronous event so HeroSection can play YT inside this click handler
    window.dispatchEvent(new CustomEvent('heroPlayMusic'));
    
    setIsOpen(true);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onClick={isReady ? handleEnter : undefined}
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-amber-50 transition-opacity ${isReady ? 'cursor-pointer opacity-100' : 'cursor-wait opacity-90'}`}
        >

          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-center px-4"
          >
            <span className="text-4xl md:text-6xl mb-6">🎁</span>
            <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase mb-4">
              Vibhav's Journey
            </h1>
            <p className="text-xs md:text-sm tracking-[0.4em] text-white/50 mt-4 h-6">
              {isReady ? (
                <span className="animate-pulse text-amber-200/80">TAP ANYWHERE TO ENTER</span>
              ) : (
                <span className="animate-pulse">LOADING EXPERIENCE...</span>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
