"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function FootprintTrail() {
  const { scrollYProgress } = useScroll();
  const footprintCount = 40;

  return (
    <div className="pointer-events-none fixed left-4 top-0 bottom-0 z-20 hidden w-8 sm:block md:left-12">
      <div className="relative flex h-full w-full flex-col items-center justify-around py-20">
        {[...Array(footprintCount)].map((_, i) => (
          <Footprint key={i} index={i} total={footprintCount} scrollProgress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

function Footprint({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const threshold = index / total;
  const [active, setActive] = useState(false);

  useEffect(() => {
    return scrollProgress.on("change", (latest: number) => {
      if (latest >= threshold && !active) {
        setActive(true);
      } else if (latest < threshold && active) {
        setActive(false);
      }
    });
  }, [scrollProgress, threshold, active]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: active ? 0.4 : 0, 
        scale: active ? 1 : 0.5,
        x: index % 2 === 0 ? 10 : -10 
      }}
      transition={{ duration: 0.35 }}
      className="text-rose-300"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM16 6C14.9 6 14 6.9 14 8C14 9.1 14.9 10 16 10C17.1 10 18 9.1 18 8C18 6.9 17.1 6 16 6ZM12 12C9 12 7 14 7 17C7 18.5 8.5 20 10.5 20C11.5 20 12 19.5 12 19C12 19.5 12.5 20 13.5 20C15.5 20 17 18.5 17 17C17 14 15 12 12 12Z" />
      </svg>
    </motion.div>
  );
}
