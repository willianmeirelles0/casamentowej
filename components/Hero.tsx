import Countdown from "@/components/Countdown";
import HeroBackground from "@/components/HeroBackground";
import { COUPLE } from "@/lib/wedding";

export default function Hero() {
  return (
    <section id="topo" className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden pb-12 pt-28 text-center">
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center px-5">
        <p className="font-script text-2xl text-brown sm:text-3xl">Nós vamos casar</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-wide text-brown-dark sm:text-6xl">
          {COUPLE.bride.split(" ")[0]} <span className="font-script text-4xl text-gold sm:text-6xl">&amp;</span>{" "}
          {COUPLE.groom.split(" ")[0]}
        </h1>

        <span className="gold-divider mt-5 w-24" />

        <p className="mt-5 font-sans text-sm uppercase tracking-[0.35em] text-brown-dark/80 sm:text-base">
          24 de abril de 2027
        </p>

        <div className="mt-8 rounded-2xl bg-cream/70 px-5 py-5 backdrop-blur-sm sm:px-10">
          <Countdown />
        </div>

        <a
          href="#historia"
          className="mt-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-brown-dark/70 transition-colors hover:text-gold"
        >
          Explore o site
          <span className="h-8 w-px animate-pulse bg-brown-dark/50" />
        </a>
      </div>
    </section>
  );
}
