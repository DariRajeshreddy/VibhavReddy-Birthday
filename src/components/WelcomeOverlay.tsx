"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Poll for YT ready state set by HeroSection
    const checkInterval = setInterval(() => {
      if ((window as any).heroYtReady) {
        setIsReady(true);
        clearInterval(checkInterval);
      }
    }, 500);

    // Fallback if YT never fires ready
    const timer = setTimeout(() => {
      setIsReady(true);
      clearInterval(checkInterval);
    }, 4000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timer);
    };
  }, []);

  // Prevent scrolling when overlay is active and disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!isOpen) {
      document.body.style.overflow = "hidden";
      // Force scrollTo(0,0) immediately and again in a short timeout to bypass browser scroll-restoration races
      window.scrollTo(0, 0);
      const resetScrollTimeout = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      return () => clearTimeout(resetScrollTimeout);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleEnter = () => {
    if (!isReady && !isEntering) return;
    
    // Synchronous direct call to HeroSection to preserve user gesture
    if (typeof (window as any).playHeroMusic === 'function') {
      (window as any).playHeroMusic();
    }
    
    // Dispatch event to start the hero cinematic animation
    (window as any).heroAnimationStarted = true;
    window.dispatchEvent(new Event("startHeroAnimation"));
    
    // Close the overlay immediately so the cinematic sequence starts seamlessly
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
              {isEntering ? (
                <span className="animate-pulse text-rose-300 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SYNCING MUSIC...
                </span>
              ) : isReady ? (
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
