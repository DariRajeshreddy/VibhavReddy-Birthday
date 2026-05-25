"use client";

import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "react-use";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

gsap.registerPlugin(ScrollTrigger);

export default function ScratchCardSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const { width, height } = useWindowSize();
  
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const ytVolProxy = useRef({ vol: 0 });
  const ytId = "Nlc7IISbEe8";

  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number, y: number } | null>(null);

  const additionalPhotos = [
    "/images/months/scratchcard/2.webp",
    "/images/months/scratchcard/3.webp",
    "/images/months/scratchcard/4.webp"
  ];

  useEffect(() => {
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
        height: '0',
        width: '0',
        videoId: ytId,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: ytId, mute: 0 },
        events: {
          onReady: (event: any) => {
            ytReadyRef.current = true;
            event.target.setVolume(0);
            event.target.setLoop(true);
          },
          onStateChange: (event: any) => {
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
  }, []);

  const playYtWithFade = () => {
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        ytPlayerRef.current.playVideo();
        gsap.killTweensOf(ytVolProxy.current);
        ytVolProxy.current.vol = ytPlayerRef.current.getVolume() || 0;
        gsap.to(ytVolProxy.current, {
          vol: 30, duration: 2,
          onUpdate: () => {
            if (ytPlayerRef.current?.setVolume) ytPlayerRef.current.setVolume(ytVolProxy.current.vol);
          }
        });
      } catch (e) {}
    }
  };

  const pauseYtWithFade = () => {
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        gsap.killTweensOf(ytVolProxy.current);
        ytVolProxy.current.vol = ytPlayerRef.current.getVolume();
        gsap.to(ytVolProxy.current, {
          vol: 0, duration: 1,
          onUpdate: () => {
            if (ytPlayerRef.current?.setVolume) ytPlayerRef.current.setVolume(ytVolProxy.current.vol);
          },
          onComplete: () => {
            if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo();
          }
        });
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: pauseYtWithFade,
        onLeaveBack: pauseYtWithFade,
        onEnter: () => { if (isRevealed) playYtWithFade(); },
        onEnterBack: () => { if (isRevealed) playYtWithFade(); }
      });
    }
  }, [isRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Setup canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with glittery metallic texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#D4AF37"); // Gold
    gradient.addColorStop(0.5, "#F3E5AB"); // Light Gold
    gradient.addColorStop(1, "#AA6C39"); // Dark Gold
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text over the scratch layer
    ctx.font = "bold 20px 'Roboto', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to Reveal Surprise!", canvas.width / 2, canvas.height / 2);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 45;
    ctx.globalCompositeOperation = "destination-out";

    const preventScroll = (e: TouchEvent) => {
      if (!isRevealed) e.preventDefault();
    };
    
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchmove', preventScroll);
    };

  }, [isRevealed]);

  const getPointerPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e: any) => {
    if (isRevealed) return;
    isDrawing.current = true;
    lastPoint.current = getPointerPos(e);
  };

  const handleMove = (e: any) => {
    if (!isDrawing.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPoint.current) return;

    const currentPoint = getPointerPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    lastPoint.current = currentPoint;
    checkReveal();
  };

  const handleEnd = () => {
    isDrawing.current = false;
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percent = (transparentPixels / totalPixels) * 100;
    setScratchPercent(percent);

    if (percent > 50 && !isRevealed) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      playYtWithFade();
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      <div className="absolute -z-50 opacity-0 pointer-events-none">
        <div ref={ytContainerRef} />
      </div>

      {isRevealed && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      
      <div className="text-center z-10 mb-12">
        <h2 className="text-4xl md:text-6xl font-roboto font-black text-amber-200 tracking-tighter uppercase">A Final Surprise</h2>
        <p className="text-white/60 mt-4 font-roboto font-light tracking-widest uppercase text-xs md:text-sm">Vibhav's First Birthday Celebration</p>
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.2)] mx-auto border-4 border-white/10 group">
        
        {/* The Hidden Image underneath */}
        <motion.div 
          className="absolute inset-0 bg-slate-900"
          animate={isRevealed ? { 
            scale: [1, 1.05, 1],
            transition: { duration: 10, repeat: Infinity, ease: "linear" }
          } : {}}
        >
          <Image 
            src="/images/months/scratchcard/1.webp" 
            alt="Surprise"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
            loading="lazy"
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        {/* Scratchable Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full cursor-crosshair transition-all duration-1000 ${isRevealed ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
          style={{ touchAction: 'none' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="mt-16 text-center z-10 max-w-2xl"
          >
            <h3 className="text-2xl md:text-4xl font-roboto font-bold text-white mb-8 px-4">
              Thank You For Being Part of Vibhav's Journey ❤️
            </h3>

            {!showGallery ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGallery(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-200 to-yellow-500 text-slate-950 font-roboto font-black uppercase tracking-tighter rounded-full shadow-[0_10px_40px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_50px_rgba(251,191,36,0.5)] transition-all"
              >
                Reveal More Memories
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mt-8"
              >
                {additionalPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-500"
                  >
                    <Image src={photo} alt={`Memory ${i+2}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" quality={60} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
