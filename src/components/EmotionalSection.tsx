"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EmotionalSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
        }
      });

      tl.to(".bg-overlay", { opacity: 0.8, duration: 1 })
        .fromTo(".text-1", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2 })
        .to(".text-1", { opacity: 0, scale: 1.1, duration: 1 })
        .to(".bg-img-2", { opacity: 1, duration: 1 }, "<")
        .fromTo(".text-2", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2 })
        .to(".text-2", { opacity: 0, scale: 1.1, duration: 1 })
        .to(".bg-img-3", { opacity: 1, duration: 1 }, "<")
        .fromTo(".text-3", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2 })
        .to(".text-3", { opacity: 0, scale: 1.1, duration: 1 })
        .to(".bg-overlay", { opacity: 1, duration: 1 }); // Fade to full black/dark before next section

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-[url('/images/months/month1/1.webp')] bg-cover bg-top md:bg-center" style={{ filter: "grayscale(30%) sepia(20%)" }}></div>
        <div className="bg-img-2 absolute inset-0 opacity-0 bg-[url('/images/months/month2/1.webp')] bg-cover bg-top md:bg-center" style={{ filter: "grayscale(30%) sepia(20%)" }}></div>
        <div className="bg-img-3 absolute inset-0 opacity-0 bg-[url('/images/months/DSC_3700.webp')] bg-cover bg-[position:25%_top] sm:bg-center" style={{ filter: "grayscale(30%) sepia(20%)" }}></div>
      </div>

      <div className="bg-overlay absolute inset-0 bg-slate-950/40 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
        <h2 className="text-1 text-5xl md:text-7xl lg:text-9xl font-serif font-light text-white drop-shadow-2xl absolute">
          365 Days of Happiness
        </h2>
        <h2 className="text-2 text-5xl md:text-7xl lg:text-9xl font-serif font-light text-white drop-shadow-2xl absolute opacity-0">
          Infinite Memories
        </h2>
        <h2 className="text-3 text-5xl md:text-7xl lg:text-9xl font-serif font-light text-white drop-shadow-2xl absolute opacity-0">
          A Gift to Our Hearts
        </h2>
      </div>

      {/* Soft Particles */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            suppressHydrationWarning={true}
            style={{
              width: Math.abs(Math.sin(i * 1.1)) * 4 + 1 + 'px',
              height: Math.abs(Math.sin(i * 1.1)) * 4 + 1 + 'px',
              left: Math.abs(Math.cos(i * 1.3)) * 100 + '%',
              top: Math.abs(Math.sin(i * 1.7)) * 100 + '%',
              animation: `float-up ${Math.abs(Math.cos(i * 1.9)) * 10 + 10}s linear infinite`,
              animationDelay: `-${Math.abs(Math.sin(i * 2.3)) * 10}s`
            }}
          />
        ))}
      </div>
    </section>
  );
}
