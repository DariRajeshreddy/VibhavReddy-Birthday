"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-8 sm:right-8">
      <button
        onClick={toggleMusic}
        className="group grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-white/70 shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-rose-200"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="h-6 w-6 text-rose-500 transition group-hover:scale-110" />
        ) : (
          <VolumeX className="h-6 w-6 text-slate-500 transition group-hover:scale-110" />
        )}
      </button>
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/audio/2022/03/15/audio_735c0d28d0.mp3" // Placeholder soft track
      />
    </div>
  );
}
