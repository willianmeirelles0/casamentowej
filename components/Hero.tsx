import Image from "next/image";
import Countdown from "@/components/Countdown";

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-10 overflow-hidden px-5 py-28 text-center"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_25px_60px_-25px_rgba(107,74,47,0.45)] ring-1 ring-gold/30">
        <Image
          src="/images/hero-aquarela.jpg"
          alt="Save the date: Jéssica Andrioli e Willian Meirelles, 24 de abril de 2027"
          width={1672}
          height={941}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
      </div>

      <div className="flex flex-col items-center gap-7">
        <div className="rounded-2xl bg-cream/70 px-6 py-5 backdrop-blur-sm sm:px-10">
          <Countdown />
        </div>

        <a
          href="#historia"
          className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-brown-dark/70 transition-colors hover:text-gold"
        >
          Explore o site
          <span className="h-8 w-px animate-pulse bg-brown-dark/50" />
        </a>
      </div>
    </section>
  );
}
