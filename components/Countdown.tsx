"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe, type TimeLeft } from "@/lib/countdownStore";

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "dias" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "minutos" },
  { key: "seconds", label: "segundos" },
];

export default function Countdown() {
  const timeLeft = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6" role="timer" aria-live="off">
      {UNITS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <span className="font-serif text-3xl font-semibold text-brown sm:text-5xl tabular-nums">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-brown-dark/70 sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
