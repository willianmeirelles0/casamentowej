"use client";

import { useAudioExperiencia } from "@/components/experiencia/AudioContext";

export default function PlayerMusica() {
  const { tocando, audioOk, convitePronto, alternarMusica } = useAudioExperiencia();

  if (!convitePronto || !audioOk) return null;

  return (
    <button
      type="button"
      onClick={alternarMusica}
      aria-label={tocando ? "Pausar música" : "Tocar música"}
      aria-pressed={tocando}
      className="fixed z-50 grid h-12 w-12 place-items-center rounded-full bg-sage/90 text-cream shadow-[0_8px_24px_-8px_rgba(74,51,31,0.5)] ring-1 ring-gold-light/60 transition-transform hover:scale-105"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom))",
        left: "max(16px, env(safe-area-inset-left))",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-6 w-6 ${tocando ? "nota-balanca" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    </button>
  );
}
