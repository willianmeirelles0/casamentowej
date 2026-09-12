import type { ReactNode } from "react";
import BranchDivider from "@/components/icons/BranchDivider";
import { ChurchIcon, PartyIcon } from "@/components/icons/EventIcons";
import Reveal from "@/components/Reveal";
import { CEREMONY } from "@/lib/wedding";

type EventPanelProps = {
  bgImage?: string;
  gradient: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  roundedClass: string;
};

/**
 * Full-bleed background panel. Proporção esperada da foto: 3:4 (retrato), ex.: 1200x1600px.
 * Duas dessas lado a lado formam uma faixa 3:2; sem gap entre elas por design (ver BigDay).
 * Para usar uma foto real, adicione o arquivo em public/images/grande-dia/ e passe `bgImage`.
 */
function EventPanel({ bgImage, gradient, icon, title, subtitle, roundedClass }: EventPanelProps) {
  return (
    <div
      className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden sm:aspect-[3/4] ${roundedClass}`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : gradient,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-brown-dark/35" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center text-cream">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/60 bg-brown-dark/30 backdrop-blur-sm">
          {icon}
        </span>
        <p className="font-serif text-2xl font-semibold sm:text-3xl">{title}</p>
        <p className="font-sans text-sm sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}

export default function BigDay() {
  return (
    <section id="grande-dia" className="bg-cream-dark/40 py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-script text-3xl text-gold">O grande dia</p>
          <BranchDivider className="mt-3" />
        </Reveal>

        <Reveal delayMs={100} className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-2">
          <EventPanel
            gradient="linear-gradient(160deg, var(--color-sky) 0%, var(--color-cream-dark) 55%, var(--color-gold-light) 100%)"
            icon={<ChurchIcon className="h-8 w-8 text-cream" />}
            title="Cerimônia"
            subtitle={`${CEREMONY.time} · ${CEREMONY.venueName}`}
            roundedClass="rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
          />
          <EventPanel
            gradient="linear-gradient(200deg, var(--color-gold-light) 0%, var(--color-cream-dark) 55%, var(--color-sage) 100%)"
            icon={<PartyIcon className="h-8 w-8 text-cream" />}
            title="Festa"
            subtitle="Logo após a cerimônia"
            roundedClass="rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none"
          />
        </Reveal>

        <Reveal delayMs={200}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-sans text-base leading-relaxed text-brown-dark sm:text-lg">
            Logo após a cerimônia, sigam para a Casa da Serra Restaurante, a cerca de 12km da
            igreja, para celebrarmos juntos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
