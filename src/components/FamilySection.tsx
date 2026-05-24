"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    YT: any;
  }
}

export default function FamilySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    let checkYt: NodeJS.Timeout;
    
    const initYoutubePlayer = () => {
      if (!ytContainerRef.current || ytPlayerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '200',
        width: '100%',
        videoId: '8PNMVX4O6YA',
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: '8PNMVX4O6YA',
          mute: 0
        },
        events: {
          onReady: (event: any) => {
            ytReadyRef.current = true;
            event.target.setVolume(30);
            event.target.setLoop(true);
            
            // Auto-play if GSAP already told us to play but we weren't ready
            if (playingRef.current && !userInteracted) {
               event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 0) { // ENDED
              event.target.playVideo(); // loop fallback
            }
          }
        }
      });
    };

    // Delay initialization slightly to prevent YouTube from mutating the DOM while React is hydrating
    const startDelay = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initYoutubePlayer();
      } else {
        checkYt = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYt);
            initYoutubePlayer();
          }
        }, 500);
      }
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (checkYt) clearInterval(checkYt);
    };
  }, [userInteracted]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Audio playback logic
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          if (!userInteracted) {
            setPlaying(true);
            playingRef.current = true;
            if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
              try { ytPlayerRef.current.playVideo(); } catch (e) {}
            }
          }
        },
        onLeave: () => {
          setPlaying(false);
          playingRef.current = false;
          if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
            try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
          }
        },
        onEnterBack: () => {
          if (!userInteracted) {
            setPlaying(true);
            playingRef.current = true;
            if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
              try { ytPlayerRef.current.playVideo(); } catch (e) {}
            }
          }
        },
        onLeaveBack: () => {
          setPlaying(false);
          playingRef.current = false;
          if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
            try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
          }
        },
      });

      // Setup parallax on photos
      gsap.utils.toArray('.family-photo').forEach((photo: any) => {
        gsap.fromTo(photo, 
          { y: 50 },
          { 
            y: -50, 
            ease: "none",
            scrollTrigger: {
              trigger: photo,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      });

      // Reveal titles
      gsap.utils.toArray('.family-title').forEach((title: any) => {
        gsap.fromTo(title,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.5,
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
            }
          }
        );
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [userInteracted]);

  const toggleAudio = () => {
    setUserInteracted(true);
    if (ytPlayerRef.current && ytReadyRef.current) {
      if (playing) {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
        setPlaying(false);
      } else {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
        setPlaying(true);
      }
    }
  };

  return (
    <section ref={containerRef} className="relative w-full bg-slate-950 py-32 overflow-hidden text-amber-50 font-serif">
      {/* Sound Toggle Button */}
      <button
        onClick={toggleAudio}
        className="absolute top-8 right-8 z-50 group grid h-14 w-14 place-items-center rounded-full border border-amber-500/50 bg-slate-900/50 shadow-[0_0_20px_rgba(251,191,36,0.2)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
        aria-label={playing ? "Pause music" : "Play music"}
        title={playing ? "Pause music" : "Play music"}
      >
        <Volume2 className={`absolute h-6 w-6 text-amber-400 transition-all duration-300 group-hover:scale-110 ${playing ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 pointer-events-none'}`} />
        <VolumeX className={`absolute h-6 w-6 text-slate-400 transition-all duration-300 group-hover:scale-110 ${!playing ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50 pointer-events-none'}`} />
      </button>

      {/* Stable container for YouTube player */}
      <div className="absolute top-0 left-0 w-full h-[200px] -z-10 opacity-0 pointer-events-none overflow-hidden">
        <div ref={ytContainerRef} />
      </div>

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[800px] bg-gradient-radial from-amber-600/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[800px] bg-gradient-radial from-amber-600/20 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8">

        {/* Nanna Family */}
        <div className="mb-40 relative z-10">
          <div className="text-center mb-16">
            <h2 className="family-title text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              Nanna's World
            </h2>
            <p className="mt-4 text-amber-200/70 text-xl tracking-widest uppercase">The Roots of Love</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            <div className="family-photo md:col-span-1 aspect-[4/3] md:aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group cursor-pointer" onClick={() => setSelectedImage("/images/family/nanna/DSC_3772.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/nanna/DSC_3772.JPG" alt="Nanna Family 1" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
            <div className="family-photo md:col-span-1 aspect-[4/3] md:aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group md:translate-y-12 cursor-pointer" onClick={() => setSelectedImage("/images/family/nanna/DSC_3782.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/nanna/DSC_3782.JPG" alt="Nanna Family 2" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
            <div className="family-photo md:col-span-1 aspect-[4/3] md:aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group md:-translate-y-8 cursor-pointer" onClick={() => setSelectedImage("/images/family/nanna/DSC_3798.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/nanna/DSC_3798.JPG" alt="Nanna Family 3" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
          </div>
        </div>

        {/* Amma Family */}
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="family-title text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              Amma's Heart
            </h2>
            <p className="mt-4 text-amber-200/70 text-xl tracking-widest uppercase">The Warmth of Home</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            <div className="family-photo md:col-span-1 aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group md:translate-y-8 cursor-pointer" onClick={() => setSelectedImage("/images/family/amma/DSC_3922.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/amma/DSC_3922.JPG" alt="Amma Family 1" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
            <div className="family-photo md:col-span-1 aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group md:-translate-y-12 cursor-pointer" onClick={() => setSelectedImage("/images/family/amma/DSC_3928.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/amma/DSC_3928.JPG" alt="Amma Family 2" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
            <div className="family-photo md:col-span-1 aspect-[4/3] relative rounded-lg border border-amber-500/30 p-2 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.1)] group md:translate-y-4 cursor-pointer" onClick={() => setSelectedImage("/images/family/amma/DSC_3931.JPG")}>
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden relative">
                <Image src="/images/family/amma/DSC_3931.JPG" alt="Amma Family 3" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-12 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-amber-400 transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Full size family photo"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
