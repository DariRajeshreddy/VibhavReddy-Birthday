import HeroSection from "@/components/HeroSection";
import MonthJourney from "@/components/MonthJourney";
import CartoonSection from "@/components/CartoonSection";
import FamilySection from "@/components/FamilySection";
import EmotionalSection from "@/components/EmotionalSection";
import ScratchCardSection from "@/components/ScratchCardSection";
import CelebrationSection from "@/components/CelebrationSection";
import FootprintTrail from "@/components/FootprintTrail";
import WelcomeOverlay from "@/components/WelcomeOverlay";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-900 selection:bg-pink-200">
      <WelcomeOverlay />
      <FootprintTrail />

      <HeroSection />
      <MonthJourney />
      <CartoonSection />
      <FamilySection />
      <EmotionalSection />
      <ScratchCardSection />
      <CelebrationSection name="Vibhav Reddy" />

      {/* Special Developer Footer */}
      <footer className="relative z-50 bg-slate-950 py-8 border-t border-white/5 text-center flex flex-col items-center justify-center space-y-2 pb-12">
        <p className="text-slate-400 font-serif italic text-sm md:text-base flex items-center gap-2">
          Made with <span className="text-red-500 animate-pulse text-lg">❤️</span> for Vibhav
        </p>
        <p className="text-slate-500 text-xs tracking-widest uppercase font-medium">
          Designed & Developed by <span className="text-amber-200/80 font-bold">Rajesh Reddy</span>
        </p>
      </footer>
    </main>
  );
}
