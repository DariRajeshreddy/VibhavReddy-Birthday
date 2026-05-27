"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EmotionalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      let triggerInstance: ScrollTrigger | null = null;

      const triggerAutoScroll = () => {
        if (isAutoScrollingRef.current) return;
        isAutoScrollingRef.current = true;

        if (!triggerInstance) return;
        const startPos = triggerInstance.start;
        const endPos = triggerInstance.end;
        const currentY = window.scrollY;

        // Only trigger if they are at or near the start of the pinned section
        if (currentY >= startPos - 100 && currentY < endPos - 100) {
          console.log("[EmotionalSection] Starting automatic quote scroll...");
          
          if ((window as any).lenis) {
            try { (window as any).lenis.stop(); } catch (e) {}
          }

          const scrollProxy = { y: window.scrollY };
          
          activeTweenRef.current = gsap.to(scrollProxy, {
            y: endPos,
            duration: 12,
            ease: "none",
            onUpdate: () => {
              window.scrollTo(0, scrollProxy.y);
            },
            onComplete: () => {
              isAutoScrollingRef.current = false;
              removeListeners();
            }
          });
        }
      };

      const killScroll = () => {
        if (activeTweenRef.current) {
          activeTweenRef.current.kill();
          activeTweenRef.current = null;
        }
        isAutoScrollingRef.current = false;
        if ((window as any).lenis) {
          try { (window as any).lenis.start(); } catch (e) {}
        }
        removeListeners();
      };

      const interactionEvents = ["wheel", "touchmove", "pointerdown"];
      
      const removeListeners = () => {
        interactionEvents.forEach(event => {
          window.removeEventListener(event, killScroll);
        });
      };

      const addListeners = () => {
        interactionEvents.forEach(event => {
          window.addEventListener(event, killScroll, { passive: true });
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          onEnter: (self) => {
            triggerInstance = self;
            // Delay by 1.5s so the enter transition settles
            setTimeout(() => {
              addListeners();
              triggerAutoScroll();
            }, 1500);
          }
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
        .to(".bg-overlay", { opacity: 1, duration: 1 });

    }, containerRef);

    return () => {
      ctx.revert();
      if (activeTweenRef.current) activeTweenRef.current.kill();
    };
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
