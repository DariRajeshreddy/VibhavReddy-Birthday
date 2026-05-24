"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function CartoonSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      tl.fromTo(".sticker", 
        { scale: 0, rotation: -45, y: 100 }, 
        { scale: 1, rotation: () => gsap.utils.random(-15, 15), y: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)" }
      );
      
      tl.to(".main-character", {
        y: -20,
        rotation: 5,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 to-pink-100 py-20 flex flex-col items-center justify-center">
      {/* CSS Grid Background (replacing missing grid.svg) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
      
      <div className="text-center z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-6 py-2 rounded-full bg-white/60 border border-white backdrop-blur-md shadow-sm mb-4"
        >
          <span className="text-pink-500 font-bold tracking-wider uppercase text-sm">Playtime & Giggles</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-800 drop-shadow-sm">
          Welcome to Vibhav's World!
        </h2>
      </div>

      <div className="relative w-full max-w-4xl aspect-video mx-auto flex items-center justify-center">
        {/* Main character cartoon */}
        <div className="main-character z-20 w-64 h-80 md:w-80 md:h-[400px] bg-white rounded-3xl shadow-dreamy border-8 border-white flex items-center justify-center overflow-hidden relative">
           <Image 
             src="/images/image.png" 
             alt="Cartoon Vibhav" 
             fill 
             className="object-cover object-center"
             sizes="(max-width: 768px) 256px, 320px"
             priority
           />
        </div>

        {/* Floating stickers / Emojis */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="sticker absolute w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center text-4xl"
            suppressHydrationWarning={true}
            style={{
              left: `${10 + (i * 15) + Math.abs(Math.sin(i * 1.1)) * 10}%`,
              top: `${10 + (i % 2 === 0 ? 10 : 60) + Math.abs(Math.cos(i * 1.3)) * 20}%`,
              zIndex: 10 + i
            }}
          >
            {['🎉', '🎈', '🧸', '🍼', '✨', '🌈'][i]}
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
