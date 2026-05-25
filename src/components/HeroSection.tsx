"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const ytVolProxy = useRef({ vol: 0 });
  const hasInteractedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const ytId = "MmOZtiIqH-w";

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    isMutedRef.current = newMutedState;
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        if (newMutedState) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          if (ytPlayerRef.current.getPlayerState() !== 1) {
            ytPlayerRef.current.playVideo();
          }
        }
      } catch (e) {}
    }
  };

  const playYtWithFade = () => {
    // Only play if we are still within the Hero Section
    const st = ScrollTrigger.getById("hero-pin");
    if (st && !st.isActive && window.scrollY > 100) return;

    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        ytPlayerRef.current.unMute();
        if (ytPlayerRef.current.getPlayerState() !== 1) {
           ytPlayerRef.current.playVideo();
        }
        if (!isMutedRef.current) {
          gsap.killTweensOf(ytVolProxy.current);
          if (ytPlayerRef.current.setVolume) ytPlayerRef.current.setVolume(30);
        }
      } catch (e) {}
    }
  };

  const pauseYtWithFade = () => {
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        gsap.killTweensOf(ytVolProxy.current);
        let currentVol = 30;
        try { currentVol = ytPlayerRef.current.getVolume() || 30; } catch(e) {}
        ytVolProxy.current.vol = currentVol;
        gsap.to(ytVolProxy.current, {
          vol: 0, duration: 1,
          onUpdate: () => {
            try { if (ytPlayerRef.current?.setVolume) ytPlayerRef.current.setVolume(ytVolProxy.current.vol); } catch(e) {}
          },
          onComplete: () => {
            try { if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo(); } catch(e) {}
          }
        });
      } catch (e) {}
    }
  };

  useEffect(() => {
    // Register global interaction handler for reliable audio playback
    const handleGlobalInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        playYtWithFade();
      }
    };
    
    // Expose directly to window to preserve user gesture token during onClick
    (window as any).playHeroMusic = handleGlobalInteraction;

    window.addEventListener("click", handleGlobalInteraction, { once: true });
    window.addEventListener("wheel", handleGlobalInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleGlobalInteraction, { once: true, passive: true });
    window.addEventListener("keydown", handleGlobalInteraction, { once: true });

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initYoutubePlayer = () => {
      if (!ytContainerRef.current || ytPlayerRef.current) return;
      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '200', width: '200', videoId: ytId,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: ytId, mute: 1, playsinline: 1 },
        events: {
          onReady: (event: any) => {
            ytReadyRef.current = true;
            event.target.setLoop(true);
            (window as any).heroYtReady = true;
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              window.dispatchEvent(new CustomEvent('heroYtPlaying'));
            }
            if (event.data === 0) event.target.playVideo();
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initYoutubePlayer();
    } else {
      const oldOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (oldOnReady) oldOnReady();
        initYoutubePlayer();
      };
    }
    
    return () => {
      window.removeEventListener("click", handleGlobalInteraction);
      window.removeEventListener("wheel", handleGlobalInteraction);
      window.removeEventListener("touchstart", handleGlobalInteraction);
      window.removeEventListener("keydown", handleGlobalInteraction);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Background stars animation
      gsap.to(".star", {
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 0.5 + 0.8,
        duration: "random(1, 3)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.1, from: "random" },
      });

      // 2. The pinned intro timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "hero-pin",
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: true, // Use instant scrub to remove delay/lag
          onLeave: pauseYtWithFade,
          onEnterBack: playYtWithFade,
        }
      });

      tl
        // First intro text
        .to(".intro-text-1", { opacity: 1, y: 0, duration: 1 })
        .to(".intro-text-1", { opacity: 0, y: -50, duration: 1 }, "+=2")

        // Second intro text
        .fromTo(".intro-text-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to(".intro-text-2", { opacity: 0, y: -50, duration: 1 }, "+=2")

        // Final Title Reveal
        .fromTo(".main-title", { opacity: 0, scale: 0.5, filter: "blur(20px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2 })
        .fromTo(".number-1", { opacity: 0, y: 100, rotationX: 90 }, { opacity: 1, y: 0, rotationX: 0, duration: 2 }, "-=1.5")
        .fromTo(".continue-btn", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=1")
        .fromTo(".scroll-indicator", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")

        // Final fade out of the whole section
        .to(".hero-content", { opacity: 0, y: -100, duration: 3, ease: "power2.in" }, "+=2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const startJourney = () => {
    playYtWithFade();
    // Smooth scroll to finish the intro and move to next section
    // 1500 (pin distance) + viewport height + small buffer
    gsap.to(window, {
      scrollTo: 1500 + window.innerHeight + 50,
      duration: 2,
      ease: "power2.inOut"
    });
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none w-[200px] h-[200px] overflow-hidden">
        <div ref={ytContainerRef} />
      </div>
      {/* Scroll Hint Note */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-8 left-8 z-[100] max-w-[220px]"
      >
        <div className="bg-slate-900/40 border border-amber-200/20 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-2xl transition-all hover:border-amber-200/50 hover:bg-slate-900/60">
          <p className="text-amber-100/80 font-serif text-sm leading-snug italic">
            ✨ Scroll down for Vibhav's photo gallery
          </p>
        </div>
      </motion.div>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-8 right-8 z-[100] w-12 h-12 bg-slate-900/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors shadow-lg group"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-amber-100/70 group-hover:text-amber-100" />
        ) : (
          <Volume2 className="w-5 h-5 text-amber-100/70 group-hover:text-amber-100" />
        )}
      </button>



      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-white opacity-0"
            suppressHydrationWarning={true}
            style={{
              top: `${Math.abs(Math.sin(i * 1.1)) * 100}%`,
              left: `${Math.abs(Math.cos(i * 1.3)) * 100}%`,
              width: `${Math.abs(Math.sin(i * 1.7)) * 2 + 1}px`,
              height: `${Math.abs(Math.sin(i * 1.7)) * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      <div className="hero-content relative z-10 flex flex-col items-center justify-center h-full w-full">
        {/* Intro Messages */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="intro-text-1 text-2xl md:text-4xl lg:text-6xl font-serif text-amber-100/90 font-light tracking-widest opacity-100 absolute text-center px-4">
            A Year Full of Smiles...
          </h2>
          <h2 className="intro-text-2 text-2xl md:text-4xl lg:text-6xl font-serif text-sky-100/90 font-light tracking-widest opacity-0 absolute text-center px-4">
            A Journey of Pure Happiness...
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center absolute z-20">
          <h1 className="main-title text-5xl md:text-7xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 font-bold text-center tracking-tight opacity-0 drop-shadow-2xl pb-4">
            Vibhav Reddy Turns One
          </h1>
          <div className="number-1 text-[14rem] md:text-[20rem] lg:text-[28rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 opacity-0 relative" style={{ perspective: "1000px" }}>
            1
            <div className="absolute inset-0 blur-3xl bg-white/20 rounded-full -z-10 mix-blend-screen" />
          </div>

          <button
            onClick={startJourney}
            className="continue-btn mt-12 px-10 py-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-medium tracking-[0.3em] uppercase text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95 opacity-0 relative overflow-hidden group"
          >
            <span className="relative z-10">Start the Journey</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </button>
        </div>

        {/* Minimalist Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 opacity-0 scroll-indicator">
          <span className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-light">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/80 -translate-y-full animate-scroll-line" />
          </div>
        </div>
      </div>
      {/* Floating Balloons */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {[
          { color: "bg-pink-400/40", left: "10%", size: "w-24 h-32", delay: 0, duration: 15 },
          { color: "bg-blue-400/40", left: "25%", size: "w-20 h-28", delay: 2, duration: 18 },
          { color: "bg-yellow-400/40", left: "40%", size: "w-28 h-36", delay: 1, duration: 20 },
          { color: "bg-purple-400/40", left: "60%", size: "w-22 h-30", delay: 3, duration: 16 },
          { color: "bg-green-400/40", left: "75%", size: "w-26 h-34", delay: 0.5, duration: 19 },
          { color: "bg-orange-400/40", left: "90%", size: "w-20 h-28", delay: 4, duration: 17 },
          { color: "bg-rose-400/40", left: "15%", size: "w-22 h-30", delay: 5, duration: 22 },
          { color: "bg-cyan-400/40", left: "85%", size: "w-24 h-32", delay: 1.5, duration: 14 },
        ].map((balloon, i) => (
          <div
            key={i}
            className={`balloon absolute bottom-[-20%] ${balloon.size} ${balloon.color} rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.1)]`}
            style={{
              left: balloon.left,
              animation: `floatUp ${balloon.duration}s linear infinite`,
              animationDelay: `${balloon.delay}s`
            }}
          >
            {/* Balloon String */}
            <div className="absolute top-full left-1/2 w-px h-64 bg-white/20 -translate-x-1/2" />
            {/* Shiny Highlight */}
            <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-[2px]" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) rotate(10deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
