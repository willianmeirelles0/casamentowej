import Image from "next/image";
import Countdown from "@/components/Countdown";

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-10 overflow-hidden py-16 text-center sm:py-20"
    >
      <div className="relative w-full">
        <Image
          src="/images/hero-aquarela.jpg"
          alt="Save the date: Jéssica Andrioli e Willian Meirelles, 24 de abril de 2027"
          width={1240}
          height={941}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="flex flex-col items-center gap-7 px-5">
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
