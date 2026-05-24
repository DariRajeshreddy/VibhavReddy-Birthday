"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Gift, PartyPopper, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const floatingShapes = [
  { size: 72, left: "8%", top: "20%", delay: 0, drift: 22 },
  { size: 118, left: "82%", top: "18%", delay: 0.4, drift: -18 },
  { size: 92, left: "14%", top: "70%", delay: 0.8, drift: -26 },
  { size: 138, left: "74%", top: "68%", delay: 1.2, drift: 20 },
  { size: 54, left: "46%", top: "14%", delay: 1.6, drift: 14 },
  { size: 66, left: "56%", top: "78%", delay: 2, drift: -12 },
];

export default function CelebrationSection({ name = "Little One" }: { name?: string }) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 1000);
    
    // Stop all other audio when entering celebration
    const stopAllMusic = () => {
      document.querySelectorAll('audio').forEach(audio => {
        gsap.to(audio, { volume: 0, duration: 1, onComplete: () => audio.pause() });
      });
    };

    ScrollTrigger.create({
      trigger: "section",
      start: "top center",
      onEnter: () => {
        (window as any).isBdayCelebrationActive = true;
        stopAllMusic();
      },
      onEnterBack: () => {
        (window as any).isBdayCelebrationActive = true;
        stopAllMusic();
      },
      onLeaveBack: () => {
        (window as any).isBdayCelebrationActive = false;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  // Auto-close Genie after 4 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isRevealed) {
      timeout = setTimeout(() => {
        setIsRevealed(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [isRevealed]);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-slate-950 px-5 py-20">
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle
          numberOfPieces={180}
          gravity={0.055}
          colors={["#fb7185", "#fbbf24", "#38bdf8", "#34d399", "#c084fc", "#ffffff"]}
        />
      )}

      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Shapes */}
        {floatingShapes.map((shape) => (
          <motion.div
            key={`${shape.left}-${shape.top}`}
            className="absolute rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.left,
              top: shape.top,
            }}
            animate={{
              y: [0, -28, 0],
              x: [0, shape.drift, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 7 + shape.delay,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center w-full max-w-4xl">
        {/* Magic Reveal Lamp */}
        <motion.div
          className="relative z-30 w-52 h-52 md:w-72 md:h-72 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.3)] border-4 border-amber-200/40 cursor-pointer mb-12 pointer-events-auto"
          initial={{ rotate: -5, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          whileHover={{ 
            scale: 1.05, 
            rotate: 0, 
            boxShadow: "0 0 100px rgba(212,175,55,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          onTap={() => {
            setIsRevealed(!isRevealed);
            const audio = new Audio("/audio/fahhhhh.mp3");
            audio.volume = 0.9;
            audio.play().catch(() => {});
            
            gsap.to(".celebration-heading", {
              scale: 1.1,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              ease: "back.out(2)"
            });
          }}
        >
          {/* Genie GIF - Only shown after reveal */}
          <motion.div 
            className="absolute inset-0 z-10 p-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isRevealed ? 1 : 0,
              scale: isRevealed ? 1 : 0.5
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {isRevealed && (
              <img 
                src="/images/months/rentpay.gif" 
                alt="Genie" 
                className="w-full h-full object-contain brightness-110"
              />
            )}
          </motion.div>

          {/* Lamp Placeholder - Shown before reveal */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md p-8 text-center"
            animate={{ opacity: isRevealed ? 0 : 1 }}
          >
            <div className="relative">
              <Star className="h-16 w-16 text-amber-300 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
              <div className="absolute -inset-4 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200/80">
              Tap the lamp
            </p>
          </motion.div>
        </motion.div>
      
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400">
            <PartyPopper className="h-3.5 w-3.5" />
            The Journey Continues
          </div>

          <motion.h1
            className="celebration-heading text-4xl font-bold leading-tight text-white sm:text-6xl drop-shadow-2xl mb-6"
          >
            Happy 1st Birthday, <br />
            <span className="text-amber-200">{name}!</span>
          </motion.h1>
          
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg font-light italic">
            "A whole year of magic, giggles, and love. <br />
            Our beautiful journey has only just begun..."
          </p>

          {/* Icon Grid */}
          <div className="mx-auto mt-10 grid grid-cols-3 gap-3 md:gap-6">
            {[
              { icon: Star, label: "Wonder" },
              { icon: Gift, label: "Love" },
              { icon: PartyPopper, label: "Magic" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] py-4 md:p-6"
              >
                <item.icon className="mx-auto h-6 w-6 text-rose-400/80" />
                <p className="mt-2 text-[8px] font-bold uppercase tracking-widest text-white/30">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
    </div>
  </section>
);
}
