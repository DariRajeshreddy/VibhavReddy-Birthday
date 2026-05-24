"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { CalendarHeart } from "lucide-react";

interface MonthSectionProps {
  month: number;
  title: string;
  caption: string;
  image: string;
  accent: string;
  reversed?: boolean;
}

const accentStyles: Record<string, { chip: string; glow: string; line: string }> = {
  rose: { chip: "bg-rose-100 text-rose-700", glow: "from-rose-200/75", line: "bg-rose-300" },
  sky: { chip: "bg-sky-100 text-sky-700", glow: "from-sky-200/75", line: "bg-sky-300" },
  amber: { chip: "bg-amber-100 text-amber-800", glow: "from-amber-200/75", line: "bg-amber-300" },
  emerald: { chip: "bg-emerald-100 text-emerald-700", glow: "from-emerald-200/75", line: "bg-emerald-300" },
  violet: { chip: "bg-violet-100 text-violet-700", glow: "from-violet-200/75", line: "bg-violet-300" },
  cyan: { chip: "bg-cyan-100 text-cyan-700", glow: "from-cyan-200/75", line: "bg-cyan-300" },
  pink: { chip: "bg-pink-100 text-pink-700", glow: "from-pink-200/75", line: "bg-pink-300" },
  teal: { chip: "bg-teal-100 text-teal-700", glow: "from-teal-200/75", line: "bg-teal-300" },
  orange: { chip: "bg-orange-100 text-orange-800", glow: "from-orange-200/75", line: "bg-orange-300" },
  blue: { chip: "bg-blue-100 text-blue-700", glow: "from-blue-200/75", line: "bg-blue-300" },
  fuchsia: { chip: "bg-fuchsia-100 text-fuchsia-700", glow: "from-fuchsia-200/75", line: "bg-fuchsia-300" },
  gold: { chip: "bg-yellow-100 text-yellow-800", glow: "from-yellow-200/75", line: "bg-yellow-300" },
};

export default function MonthSection({
  month,
  title,
  caption,
  image,
  accent,
  reversed = false,
}: MonthSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);
  const styles = accentStyles[accent] ?? accentStyles.rose;

  return (
    <section
      ref={containerRef}
      className="relative isolate min-h-screen overflow-hidden px-5 py-20 sm:px-10 lg:py-28"
    >
      <div className={`absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b ${styles.glow} to-transparent opacity-70`} />
      <div className="absolute left-1/2 top-0 -z-10 hidden h-full w-px -translate-x-1/2 bg-slate-200 lg:block" />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 ${
          reversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-white p-3 shadow-dreamy"
        >
          <div className="relative h-full overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={`${title} birthday memory`}
              fill
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              priority={month <= 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-white/5" />
          </div>
          <div className="absolute bottom-8 left-8 rounded-lg bg-white/88 px-4 py-3 shadow-soft backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Chapter</p>
            <p className="text-3xl font-semibold text-slate-950">{String(month).padStart(2, "0")}</p>
          </div>
        </motion.div>

        <motion.div style={{ y: textY }} className="relative">
          <div className={`mb-7 h-1.5 w-20 rounded-full ${styles.line}`} />
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] ${styles.chip}`}>
            <CalendarHeart className="h-4 w-4" />
            {title}
          </span>
          <h2 className="mt-7 max-w-xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {caption}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            A small moment became a forever memory, saved here as one bright step in a first-year story.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
