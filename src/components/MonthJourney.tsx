"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
if (typeof window !== 'undefined') {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const monthsData = [
  {
    month: 1,
    title: "A Shower of Love",
    bg: "from-blue-600/20 to-indigo-600/20",
    accent: "text-white",
    bgm: "https://music.youtube.com/watch?v=IMb_PVtW5G0&si=dPdgaZ_FCYbDWKfZ",
    bgImage: "/images/months/month1/1.webp",
    mainPhoto: "/images/months/month1/1.webp",
    photos: [
      "/images/months/month1/1.webp",
      "/images/months/month1/2.webp",
      "/images/months/month1/3.webp",
      "/images/months/month1/4.webp",
      "/images/months/month1/5.webp"
    ]
  },
  {
    month: 2,
    title: "My Furry Friends",
    bg: "from-indigo-900 to-purple-900",
    accent: "text-purple-200",
    bgm: "https://music.youtube.com/watch?v=15cl2BjUNKk&si=Xw31cED63L3lc_Jq",
    bgImage: "/images/months/month2/1.webp",
    mainPhoto: "/images/months/month2/1.webp",
    photos: [
      "/images/months/month2/1.webp",
      "/images/months/month2/2.webp",
      "/images/months/month2/3.webp",
      "/images/months/month2/4.webp"
    ]
  },
  {
    month: 3,
    title: "Blessed by Ganesha",
    bg: "from-purple-900 to-fuchsia-900",
    accent: "text-fuchsia-200",
    bgm: "https://music.youtube.com/watch?v=CxjtCLDhqYs&si=xbMIhyhvFdDxLmoo",
    bgImage: "/images/months/month3/1.webp",
    mainPhoto: "/images/months/month3/1.webp",
    photos: [
      "/images/months/month3/1.webp",
      "/images/months/month3/2.webp",
      "/images/months/month3/3.webp",
      "/images/months/month3/4.webp",
      "/images/months/month3/5.webp"
    ]
  },
  {
    month: 4,
    title: "Soundtrack Of Home",
    bg: "from-fuchsia-900 to-rose-900",
    accent: "text-rose-200",
    bgm: "https://music.youtube.com/watch?v=SjmH9Hz4mOM&si=oxIMnLRHB31bk0Cp",
    bgImage: "/images/months/month4/2.webp",
    mainPhoto: "/images/months/month4/1.webp",
    photos: [
      "/images/months/month4/1.webp",
      "/images/months/month4/2.webp",
      "/images/months/month4/3.webp",
      "/images/months/month4/4.webp",
      "/images/months/month4/5.webp"
    ]
  },
  {
    month: 5,
    title: "Little Boss",
    bg: "from-rose-900 to-orange-900",
    accent: "text-orange-200",
    bgm: "https://music.youtube.com/watch?v=PIaVDzkb-Nc&si=TQKpmBFezpaVYp_l",
    bgImage: "/images/months/month5/3.webp",
    mainPhoto: "/images/months/month5/1.webp",
    photos: [
      "/images/months/month5/1.webp",
      "/images/months/month5/2.webp",
      "/images/months/month5/3.webp",
      "/images/months/month5/4.webp",
      "/images/months/month5/5.webp"
    ]
  },
  {
    month: 6,
    title: "Starting Solids",
    bg: "from-orange-900 to-amber-900",
    accent: "text-amber-200",
    bgm: "https://youtube.com/shorts/8IOU4q3Cq4Y?si=1_G1pfjBKkBmKORs",
    bgImage: "/images/months/month6/1.webp",
    mainPhoto: "/images/months/month6/1.webp",
    photos: [
      "/images/months/month6/1.webp",
      "/images/months/month6/2.webp",
      "/images/months/month6/3.webp",
      "/images/months/month6/4.webp",
      "/images/months/month6/5.webp"
    ]
  },
  {
    month: 7,
    title: "Like Father, Like Son",
    bg: "from-amber-900 to-yellow-900",
    accent: "text-yellow-200",
    bgm: "https://music.youtube.com/watch?v=uOeLCNqTkWA&si=O0sp2VurKFL3fEyQ",
    bgImage: "/images/months/month7/1.webp",
    mainPhoto: "/images/months/month7/1.webp",
    photos: [
      "/images/months/month7/1.webp",
      "/images/months/month7/2.webp",
      "/images/months/month7/3.webp",
      "/images/months/month7/4.webp",
      "/images/months/month7/5.webp"
    ]
  },
  {
    month: 8,
    title: "Up, Up and Away!",
    bg: "from-yellow-900 to-lime-900",
    accent: "text-lime-200",
    bgm: "https://youtube.com/shorts/BAxXFBnY4lI?si=lfayHq3xNB655Pvc",
    bgImage: "/images/months/month8/1.webp",
    mainPhoto: "/images/months/month8/1.webp",
    photos: [
      "/images/months/month8/1.webp",
      "/images/months/month8/2.webp",
      "/images/months/month8/3.webp",
      "/images/months/month8/4.webp",
      "/images/months/month8/5.webp"
    ]
  },
  {
    month: 9,
    title: "Our Little Farmer",
    bg: "from-lime-900 to-emerald-900",
    accent: "text-emerald-200",
    bgm: "https://music.youtube.com/watch?v=xnAzGW-Nmds&si=jtcOLy4_2V0piRBv",
    bgImage: "/images/months/month9/1.webp",
    mainPhoto: "/images/months/month9/1.webp",
    photos: [
      "/images/months/month9/1.webp",
      "/images/months/month9/2.webp",
      "/images/months/month9/3.webp",
      "/images/months/month9/4.webp",
      "/images/months/month9/5.webp"
    ]
  },
  {
    month: 10,
    title: "Little Master Chef",
    bg: "from-emerald-900 to-teal-900",
    accent: "text-teal-200",
    bgm: "https://music.youtube.com/watch?v=eXV98TzczBU&si=rIN10xcxXyBkfQmg",
    bgImage: "/images/months/month10/1.webp",
    mainPhoto: "/images/months/month10/1.webp",
    photos: [
      "/images/months/month10/1.webp",
      "/images/months/month10/2.webp",
      "/images/months/month10/3.webp",
      "/images/months/month10/4.webp",
      "/images/months/month10/5.webp"
    ]
  },
  {
    month: 11,
    title: "My First Tooth",
    bg: "from-teal-900 to-cyan-900",
    accent: "text-cyan-200",
    bgm: "https://music.youtube.com/watch?v=hTFDt-L26h4&si=ayJtxqZ8TKtg3Nwh",
    bgImage: "/images/months/month11/1.webp",
    mainPhoto: "/images/months/month11/1.webp",
    photos: [
      "/images/months/month11/1.webp",
      "/images/months/month11/2.webp",
      "/images/months/month11/3.webp",
      "/images/months/month11/4.webp",
      "/images/months/month11/5.webp"
    ]
  },
];

export default function MonthJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const [currentBgm, setCurrentBgm] = useState(monthsData[0].bgm);
  const currentBgmRef = useRef(monthsData[0].bgm);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const currentMonthRef = useRef(0);
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const ytVolProxy = useRef({ vol: 0 }); // Proxy object to handle YouTube volume animations
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAutoScrollingRef = useRef(false);
  const targetMonthRef = useRef(0);
  const interruptedMonthsRef = useRef<{ [key: number]: boolean }>({});
  const snapDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const atCollageRef = useRef<number>(-1);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const scrollIntentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const killActiveScrollRef = useRef<(() => void) | null>(null);
  const idleTransitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startIdleTransitionTimer = (currentIndex: number) => {
    if (idleTransitionTimeoutRef.current) clearTimeout(idleTransitionTimeoutRef.current);
    
    if (currentIndex < monthsData.length - 1) {
      console.log(`[IdleTransition] Starting 10s idle timer for month ${currentIndex + 1}`);
      idleTransitionTimeoutRef.current = setTimeout(() => {
        if (!isAutoScrollingRef.current) {
          const nextMonthIndex = currentIndex + 1;
          console.log("[IdleTransition] 10s idle elapsed. Auto-scrolling to next month:", nextMonthIndex);
          interruptedMonthsRef.current[nextMonthIndex] = false;
          targetMonthRef.current = nextMonthIndex;
          triggerAutoScroll(nextMonthIndex);
        }
      }, 10000);
    }
  };

  const clearIdleTransitionTimer = () => {
    if (idleTransitionTimeoutRef.current) {
      console.log("[IdleTransition] User activity detected. Clearing 10s idle timer.");
      clearTimeout(idleTransitionTimeoutRef.current);
      idleTransitionTimeoutRef.current = null;
    }
  };


  const triggerAutoScroll = (targetIndex: number, interruptDelay = 500) => {
    if (isAutoScrollingRef.current) {
      console.log("[AutoScroll] Already active, ignoring request for index:", targetIndex);
      return;
    }

    const st = stRef.current || ScrollTrigger.getById("journey-pin");
    const tl = tlRef.current;
    if (!st || !tl) {
      console.warn("[AutoScroll] st or tl not initialized yet. st:", st, "tl:", tl);
      return;
    }
    
    // Scroll all the way to the end of the month's timeline to show the built-in hint
    const label = `end-${targetIndex}`;
    const labelTime = tl.labels[label];
    
    if (labelTime === undefined) {
      console.warn("[AutoScroll] Label not found:", label);
      return;
    }
    
    const progress = labelTime / tl.duration();
    const targetScroll = Math.round(st.start + (st.end - st.start) * progress);
    
    console.log("[AutoScroll] Calculations:", {
      targetIndex,
      label,
      labelTime,
      duration: tl.duration(),
      progress,
      stStart: st.start,
      stEnd: st.end,
      targetScroll,
      currentScroll: window.scrollY
    });
    
    if (targetScroll && window.scrollY < targetScroll - 20) {
      isAutoScrollingRef.current = true;
      
      const preventDefault = (e: Event) => {
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      const blockNativeScroll = () => {
        window.addEventListener("wheel", preventDefault, { passive: false });
        window.addEventListener("touchmove", preventDefault, { passive: false });
      };

      const unblockNativeScroll = () => {
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
      };

      blockNativeScroll();

      const dist = targetScroll - window.scrollY;
      const dur = Math.max(2, dist / 100); // Cinematic 100px per sec
      
      console.log(`[AutoScroll] Starting proxy scroll. Target: ${targetScroll}, Duration: ${dur}s`);

      // 1. Temporarily pause Lenis and instantly clear any scroll momentum!
      if ((window as any).lenis) {
        try { 
          (window as any).lenis.stop(); 
          (window as any).lenis.scrollTo(window.scrollY, { immediate: true });
        } catch (e) {}
      }
      window.scrollTo(0, window.scrollY);

      // Kill any currently active scroll and listeners first
      if (killActiveScrollRef.current) {
        killActiveScrollRef.current();
      }

      const safetyTimeout = setTimeout(() => {
        if (isAutoScrollingRef.current) {
          console.log("[AutoScroll] Safety timeout triggered. Resetting scroll lock.");
          isAutoScrollingRef.current = false;
          removeInteractionListeners();
        }
      }, (dur + 4) * 1000); // 4 seconds padding to cover the bounce animation
      
      const scrollProxy = { y: window.scrollY };
      let activeTween: gsap.core.Tween | gsap.core.Timeline | null = null;
      
      const tween = gsap.to(scrollProxy, {
        y: targetScroll,
        duration: dur,
        ease: "none",
        onUpdate: () => {
          window.scrollTo(0, scrollProxy.y);
        },
        onComplete: () => {
          console.log("[AutoScroll] Proxy scroll complete. Triggering physical screen container bounce.");
          clearTimeout(safetyTimeout);
          
          if (containerRef.current) {
            const bounceTimeline = gsap.timeline({
              onComplete: () => {
                isAutoScrollingRef.current = false;
                removeInteractionListeners();
                startIdleTransitionTimer(targetIndex);
              }
            });
            
            activeTween = bounceTimeline;

            bounceTimeline
              .to(containerRef.current, {
                y: -45,
                duration: 0.35,
                ease: "power1.out"
              })
              .to(containerRef.current, {
                y: 0,
                duration: 0.65,
                ease: "bounce.out"
              });
          } else {
            isAutoScrollingRef.current = false;
            removeInteractionListeners();
          }
        }
      });

      activeTween = tween;

      const killScroll = () => {
        console.log("[AutoScroll] Scroll stopped by user interaction.");
        clearIdleTransitionTimer();
        interruptedMonthsRef.current[targetIndex] = true;
        if (activeTween) {
          activeTween.kill();
        }
        isAutoScrollingRef.current = false;
        clearTimeout(safetyTimeout);
        removeInteractionListeners();
      };

      const interactionEvents = ["pointerdown"];
      const addListenersTimeout = setTimeout(() => {
        interactionEvents.forEach(event => {
          window.addEventListener(event, killScroll, { passive: true });
        });
      }, interruptDelay);

      const removeInteractionListeners = () => {
        clearTimeout(addListenersTimeout);
        unblockNativeScroll();
        interactionEvents.forEach(event => {
          window.removeEventListener(event, killScroll);
        });
        killActiveScrollRef.current = null;
        // Resume Lenis smooth scroll engine
        if ((window as any).lenis) {
          try { (window as any).lenis.start(); } catch (e) {}
        }
      };

      killActiveScrollRef.current = killScroll;

    } else {
      console.log("[AutoScroll] Target scroll already reached or invalid. scrollY:", window.scrollY, "targetScroll:", targetScroll);
    }
  };

  useEffect(() => {
    // Only used as a fallback if the user triggers the event manually via console or if onEnter fails
    const handleStartAutoScroll = () => {
       targetMonthRef.current = 0;
       // Added a 1.5s delay to sync with the Hero transition in case this fires simultaneously
       setTimeout(() => triggerAutoScroll(0), 1500);
    };
    window.addEventListener("startMonthAutoScroll", handleStartAutoScroll);
    return () => window.removeEventListener("startMonthAutoScroll", handleStartAutoScroll);
  }, []);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initYoutubePlayer = () => {
      if (!ytContainerRef.current || ytPlayerRef.current) return;
      const ytId = getYoutubeId(monthsData[0].bgm);
      if (!ytId) return;

      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '0',
        width: '0',
        videoId: ytId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: ytId,
          mute: 1
        },
        events: {
          onReady: (event: any) => {
            ytReadyRef.current = true;
            event.target.setLoop(true);
            // Silent pre-buffering handled by autoplay:1 and mute:1
            // syncMusic(onEnter) will unmute it instantly when user scrolls here.
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              event.target.playVideo();
            }
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

  const syncMusic = (nextBgm: string) => {
    const audioEl = audioRef.current;
    const nextIsYoutube = getYoutubeId(nextBgm) !== null;
    const nextYtId = getYoutubeId(nextBgm);

    if (nextIsYoutube) {
      // Transition to YouTube
      if (audioEl) audioEl.pause();
      if (ytPlayerRef.current?.loadVideoById && nextYtId && ytReadyRef.current) {
        try {
          let loadedId = null;
          try {
            loadedId = getYoutubeId(ytPlayerRef.current.getVideoUrl());
          } catch (e) { }

          if (loadedId === nextYtId) {
            ytPlayerRef.current.seekTo(0, true);
            ytPlayerRef.current.unMute();
            if (ytPlayerRef.current.getPlayerState() !== 1) {
              ytPlayerRef.current.playVideo();
            }
            if (!isMutedRef.current) ytPlayerRef.current.setVolume(30);
            return;
          }
          ytPlayerRef.current.loadVideoById({
            videoId: nextYtId,
            playlist: nextYtId,
            suggestedQuality: 'small'
          });
          ytPlayerRef.current.setLoop(true);
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.playVideo();
          gsap.killTweensOf(ytVolProxy.current);
          if (!isMutedRef.current) {
             ytPlayerRef.current.setVolume(30);
          }
        } catch (e) {
          console.error("YT transition failed", e);
        }
      }
    } else {
      // Transition to local HTML5 Audio
      if (ytPlayerRef.current?.pauseVideo && ytReadyRef.current) {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) { }
      }
      if (audioEl) {
        try {
          audioEl.src = nextBgm;
          audioEl.load();
          audioEl.play().catch(e => console.log("Audio play blocked by browser gesture policy. Will retry on user gesture.", e));
          gsap.killTweensOf(audioEl);
          audioEl.volume = isMutedRef.current ? 0 : 0.3;
        } catch (e) {
          console.error("Local audio transition failed", e);
        }
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;

    if (nextMuted) {
      // Kill any active volume tweens to prevent them from unmuting
      gsap.killTweensOf(ytVolProxy.current);
      if (audioRef.current) gsap.killTweensOf(audioRef.current);

      if (ytPlayerRef.current?.setVolume && ytReadyRef.current) ytPlayerRef.current.setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      if (ytPlayerRef.current?.setVolume && ytReadyRef.current) ytPlayerRef.current.setVolume(30);
      if (audioRef.current) audioRef.current.volume = 0.3;

      // Force play if user explicitly unmuted
      syncMusic(currentBgmRef.current);
    }
  };

  // Removed fragile global interaction listener

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".month-panel") as HTMLElement[];

      // Pin the container and create a horizontal scroll effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          id: "journey-pin",
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=60000",
          onUpdate: (self) => {
            const numMonths = monthsData.length;
            const tlAnim = tlRef.current;
            const currentScroll = window.scrollY;
            let currentIndex = currentMonthRef.current;

            // --- Determine current month index from scroll position ---
            if (tlAnim) {
              for (let i = 0; i < numMonths; i++) {
                const lTime = tlAnim.labels[`start-${i}`];
                if (lTime !== undefined) {
                  const lProg = lTime / tlAnim.duration();
                  const startScroll = self.start + (self.end - self.start) * lProg;
                  if (currentScroll >= startScroll - 50) {
                    currentIndex = i;
                  }
                }
              }
            } else {
              currentIndex = Math.min(
                numMonths - 1,
                Math.max(0, Math.floor(self.progress * numMonths))
              );
            }

            // Auto-unmute when transitioning to a new month
            if (currentIndex !== currentMonthRef.current) {
              currentMonthRef.current = currentIndex;
              if (isMutedRef.current) {
                setIsMuted(false);
                isMutedRef.current = false;
              }
            }

            const nextBgm = monthsData[currentIndex]?.bgm;
            if (nextBgm && nextBgm !== currentBgmRef.current) {
              currentBgmRef.current = nextBgm;
              setCurrentBgm(nextBgm);
              if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
              musicTimeoutRef.current = setTimeout(() => {
                syncMusic(nextBgm);
              }, 1000);
            }

            // Skip auto-scroll logic if we are currently in a programmatic scroll
            if (isAutoScrollingRef.current) return;

            if (tlAnim) {
               let activeMonth = 0;
               for (let i = 0; i < numMonths; i++) {
                  const lTime = tlAnim.labels[`start-${i}`];
                  if (lTime !== undefined) {
                     const lProg = lTime / tlAnim.duration();
                     const startScroll = self.start + (self.end - self.start) * lProg;
                     if (currentScroll >= startScroll - 50) activeMonth = i;
                  }
               }

               // --- COLLAGE ZONE: One-scroll snap to next month ---
               const collageTime = tlAnim.labels[`collage-${activeMonth}`];
               const endTime = tlAnim.labels[`end-${activeMonth}`];
               if (collageTime !== undefined && endTime !== undefined) {
                  const collageProg = collageTime / tlAnim.duration();
                  const endProg = endTime / tlAnim.duration();
                  const collageScroll = self.start + (self.end - self.start) * collageProg;
                  const endScroll = self.start + (self.end - self.start) * endProg;
                  const inCollageZone = currentScroll >= collageScroll - 100 && currentScroll <= endScroll + 500;

                  if (inCollageZone) {
                     // Track that we are at this collage
                     if (atCollageRef.current !== activeMonth) {
                        atCollageRef.current = activeMonth;
                        console.log(`[Collage] Entered collage zone for month ${activeMonth + 1}`);
                     }

                     // If scrolling forward, immediately snap to the START of next month,
                     // then let the PHOTO ZONE auto-scroll kick in automatically.
                     if (self.direction > 0) {
                        const nextMonthIndex = activeMonth + 1;
                        if (nextMonthIndex < numMonths) {
                           if (snapDebounceRef.current) clearTimeout(snapDebounceRef.current);
                           snapDebounceRef.current = setTimeout(() => {
                              if (!isAutoScrollingRef.current) {
                                 const st2 = stRef.current || ScrollTrigger.getById("journey-pin");
                                 const tl2 = tlRef.current;
                                 if (!st2 || !tl2) return;
                                 const startLabelTime = tl2.labels[`start-${nextMonthIndex}`];
                                 if (startLabelTime === undefined) return;
                                 const startProg = startLabelTime / tl2.duration();
                                 const snapTarget = Math.round(st2.start + (st2.end - st2.start) * startProg) + 50;

                                 console.log(`[OneScroll] Snapping to start of month ${nextMonthIndex + 1} (scroll: ${snapTarget})`);
                                 isAutoScrollingRef.current = true;

                                 // Block native scroll during snap
                                 const snapPreventDefault = (e: Event) => { if (e.cancelable) e.preventDefault(); };
                                 window.addEventListener("wheel", snapPreventDefault, { passive: false });
                                 window.addEventListener("touchmove", snapPreventDefault, { passive: false });
                                 if ((window as any).lenis) { try { (window as any).lenis.stop(); } catch(e) {} }

                                 const snapProxy = { y: window.scrollY };
                                 gsap.to(snapProxy, {
                                    y: snapTarget,
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    onUpdate: () => window.scrollTo(0, snapProxy.y),
                                    onComplete: () => {
                                       window.removeEventListener("wheel", snapPreventDefault);
                                       window.removeEventListener("touchmove", snapPreventDefault);
                                       if ((window as any).lenis) { try { (window as any).lenis.start(); } catch(e) {} }
                                       isAutoScrollingRef.current = false;
                                       // Reset target so PHOTO ZONE sees this as a new month and auto-scrolls
                                       interruptedMonthsRef.current[nextMonthIndex] = false;
                                       targetMonthRef.current = nextMonthIndex - 1;
                                       console.log(`[OneScroll] Landed at month ${nextMonthIndex + 1} start. PHOTO ZONE will engage.`);
                                    }
                                 });
                              }
                           }, 50);
                        }
                     }
                  } else {
                     if (atCollageRef.current === activeMonth) atCollageRef.current = -1;
                  }
               }

               // --- PHOTO ZONE: Auto-scroll through photos if entering a new month ---
               if (activeMonth !== targetMonthRef.current && !interruptedMonthsRef.current[activeMonth]) {
                  const lTime = tlAnim.labels[`start-${activeMonth}`];
                  if (lTime !== undefined) {
                     const lProg = lTime / tlAnim.duration();
                     const startScroll = self.start + (self.end - self.start) * lProg;
                     const isGoingForward = activeMonth > targetMonthRef.current;
                     const isGoingBackward = activeMonth < targetMonthRef.current && self.direction < 0;
                     const shouldTrigger = isGoingForward
                        ? currentScroll > startScroll + 20
                        : isGoingBackward;

                     if (shouldTrigger) {
                        targetMonthRef.current = activeMonth;
                        if (scrollIntentTimeoutRef.current) clearTimeout(scrollIntentTimeoutRef.current);
                        scrollIntentTimeoutRef.current = setTimeout(() => {
                           if (!isAutoScrollingRef.current) {
                              triggerAutoScroll(activeMonth);
                           }
                        }, 800);
                     }
                  }
               }
            }
          },
          onEnter: () => {
            syncMusic(currentBgmRef.current);
            if (targetMonthRef.current === 0 && !isAutoScrollingRef.current) {
               // Wait 1.5s for HeroSection's scroll transition to fully complete!
               setTimeout(() => triggerAutoScroll(0), 1500);
            }
          },
          onLeave: () => {
            if (ytPlayerRef.current?.pauseVideo && ytReadyRef.current) {
              try { ytPlayerRef.current.pauseVideo(); } catch (e) { }
            }
            if (audioRef.current) audioRef.current.pause();
          },
          onEnterBack: () => {
            syncMusic(currentBgmRef.current);
          },
          onLeaveBack: () => {
            if (ytPlayerRef.current?.pauseVideo && ytReadyRef.current) {
              try { ytPlayerRef.current.pauseVideo(); } catch (e) { }
            }
            if (audioRef.current) audioRef.current.pause();
          }
        }
      });
      
      tlRef.current = tl;
      stRef.current = ScrollTrigger.getById("journey-pin") || tl.scrollTrigger || null;

      sections.forEach((section, index) => {
        tl.add(`start-${index}`);
        // Entrance animation for the month panel
        if (index === 0) {
          tl.to(section, { autoAlpha: 1, duration: 1 });
        } else {
          tl.fromTo(section,
            { xPercent: 100, scale: 0.9, autoAlpha: 0 },
            { xPercent: 0, scale: 1, autoAlpha: 1, ease: "power2.inOut", duration: 1.5 },
            "+=0.5"
          );
        }

        // Animate elements inside the section
        const photoContainers = section.querySelectorAll('.photo-container');
        const title = section.querySelector('.month-title');

        if (index > 0) {
          tl.fromTo(title, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, "<0.2");
        } else {
          tl.fromTo(title, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 });
        }

        // Photos flying in one by one centered
        photoContainers.forEach((container, j) => {
          const photo = container.querySelector('.month-photo');
          const animePhoto = container.querySelector('.anime-photo');

          // Pick a random direction for this photo to come from
          const directions = [
            { x: -1000, y: 0 }, // left
            { x: 1000, y: 0 },  // right
            { x: 0, y: -1000 }, // top
            { x: 0, y: 1000 },  // bottom
          ];
          const dir = directions[Math.floor(Math.abs(Math.sin(index * 10 + j)) * directions.length)];

          // 1. Container flies in
          tl.fromTo(container,
            {
              x: dir.x,
              y: dir.y,
              xPercent: -50,
              yPercent: -50,
              rotation: (Math.abs(Math.sin(index + j)) * 90) - 45,
              scale: 0.2,
              autoAlpha: 0
            },
            {
              x: 0,
              y: 0,
              xPercent: -50,
              yPercent: -50,
              rotation: (Math.abs(Math.cos(index + j)) * 20) - 10,
              scale: 1,
              autoAlpha: 1,
              duration: 1,
              ease: "back.out(1.2)"
            }
          );

          // 2. Add a pause to enjoy the moment (Removed morph to anime versions)
          tl.to({}, { duration: 3 });

          // 4. Fly out to make room for the next photo
          tl.to(container, {
            scale: 1.5,
            autoAlpha: 0,
            duration: 1.2,
            ease: "power2.in"
          });
        });

        // 5. Show only the last 5 images together in a collage
        const collageLabel = `collage-${index}`;
        tl.add(collageLabel);

        const numPhotos = photoContainers.length;
        const collageStartIdx = Math.max(0, numPhotos - 5);

        photoContainers.forEach((container, j) => {
          if (j >= collageStartIdx) {
            const collagePosIdx = j - collageStartIdx;
            const pos = [
              { x: "-25vw", y: "-15vh", rot: -12 },
              { x: "-15vw", y: "20vh", rot: 8 },
              { x: "25vw", y: "-10vh", rot: 15 },
              { x: "15vw", y: "20vh", rot: -5 },
              { x: "0vw", y: "0vh", rot: 5 },
            ][collagePosIdx];

            tl.to(container, {
              x: pos.x,
              y: pos.y,
              rotation: pos.rot,
              scale: 0.6,
              autoAlpha: 1,
              duration: 1,
              ease: "back.out(1.2)"
            }, collageLabel);
          }
        });

        // 6. Show the "moving to next month" text
        const nextMonthText = section.querySelector('.next-month-text');
        if (nextMonthText) {
          tl.fromTo(nextMonthText,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 2 },
            `${collageLabel}+=1`
          );
          
          // Physically bounce the entire screen container up and down to guide the user!
          tl.add(() => {
            if (containerRef.current) {
              gsap.timeline()
                .to(containerRef.current, { y: -45, duration: 0.35, ease: "power1.out" })
                .to(containerRef.current, { y: 0, duration: 0.65, ease: "bounce.out" });
            }
          }, `${collageLabel}+=3`);
        }

        // Add a long pause at the end of the month before transitioning
        tl.to({}, { duration: 5 });

        tl.add(`end-${index}`);

        // Fade everything out before next month slides in (if not the last month)
        if (index < sections.length - 1) {
          const fadeTargets: Element[] = [];
          photoContainers.forEach(c => fadeTargets.push(c));
          if (nextMonthText) fadeTargets.push(nextMonthText);
          if (title) fadeTargets.push(title);

          tl.to(fadeTargets, {
            autoAlpha: 0,
            y: -50,
            duration: 1.5,
            stagger: 0.1
          });
        } else {
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-[1000] group w-14 h-14 flex items-center justify-center transition-all duration-500"
        title={isMuted ? "Unmute" : "Mute"}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 group-active:scale-95" />

        <div className="relative text-white/80 transition-all duration-500 group-hover:text-white">
          {isMuted ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2V15H6L11 19V5z"></path>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </div>

        {/* Subtle decorative ring */}
        <div className="absolute inset-[-4px] rounded-full border border-white/5 scale-75 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 pointer-events-none" />
      </button>

      {/* Stable container for YouTube player */}
      <div className="absolute -z-50 opacity-0 pointer-events-none">
        <div ref={ytContainerRef} />
      </div>

      {/* Audio element for playing different Telugu BGMs per month */}
      <audio ref={audioRef} id="month-bgm-player" loop className="hidden" />

      {monthsData.map((data, i) => (
        <div
          key={data.month}
          className={`month-panel absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${data.bg} ${data.month === 1 ? 'text-slate-900' : 'text-white'}`}
          style={{ zIndex: i, visibility: i === 0 ? 'visible' : 'hidden' }}
        >
          {/* Background Image Backdrop */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={(data as any).bgImage || `/images/months/month-${data.month}.webp`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-80 scale-100"
            />
            <div className={`absolute inset-0 bg-black/40`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${data.bg} opacity-30`} />
            <div className="absolute inset-0 bg-white/5" />
          </div>

          <div className="absolute top-12 md:top-20 left-0 right-0 text-center z-[100] px-6 pointer-events-none flex flex-col items-center float-slow">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-1"
            >
              <h3 className="text-[10px] md:text-xs font-[family-name:var(--font-roboto)] font-light text-white/70 uppercase tracking-[0.5em] drop-shadow-md">Month {data.month}</h3>
            </motion.div>

            <div className="relative">
              <h2
                className={`month-title text-2xl md:text-2xl lg:text-3xl font-[family-name:var(--font-roboto)] font-black leading-tight uppercase tracking-tighter flex flex-wrap justify-center gap-x-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]`}
              >
                {data.title.split(' ').map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="text-shimmer"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5, ease: "circInOut" }}
                className="h-[2px] w-32 md:w-64 mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_15px_rgba(250,204,21,0.5)]"
              />
            </div>
          </div>

          <div className="relative w-full max-w-5xl h-screen flex items-center justify-center perspective-[2000px]">
            {Array.from({ length: (data as any).photos?.length || 5 }).map((_, j) => {
              const zIndex = 10 + j;

              return (
                <div
                  key={`photo-${j}`}
                  className="photo-container absolute shadow-[0_50px_100px_rgba(0,0,0,0.7)] rounded-sm p-4 md:p-6 bg-white border border-slate-200 overflow-hidden w-[320px] h-[450px] md:w-[500px] md:h-[700px] group"
                  style={{ zIndex, left: "50%", top: "60%" }}
                >
                  <div className="month-photo relative w-full h-full shadow-inner bg-slate-50 overflow-hidden">
                    <img
                      src={(data as any).photos?.[j] || (data as any).mainPhoto || `/images/months/month-${data.month}.webp`}
                      alt={`Month ${data.month} photo ${j + 1}`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="next-month-text absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 opacity-0 pointer-events-none">
            <div className="flex flex-col items-center gap-2 animate-bounce-slow">
              <span className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-roboto font-light">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/80 -translate-y-full animate-scroll-line" />
              </div>
            </div>
          </div>

          {/* Sparkles / Particles for this month */}
          {Array.from({ length: 15 }).map((_, p) => {
            const seed = i * 15 + p;
            return (
              <div
                key={`sparkle-${p}`}
                className="absolute rounded-full bg-white opacity-50"
                style={{
                  width: Math.abs(Math.sin(seed * 1.1)) * 6 + 2 + 'px',
                  height: Math.abs(Math.sin(seed * 1.1)) * 6 + 2 + 'px',
                  top: Math.abs(Math.cos(seed * 2.3)) * 100 + '%',
                  left: Math.abs(Math.sin(seed * 3.7)) * 100 + '%',
                  opacity: Math.abs(Math.cos(seed * 4.1)) * 0.5 + 0.2,
                  animation: `pulse ${Math.abs(Math.sin(seed * 5.3)) * 2 + 1}s infinite alternate`
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}




