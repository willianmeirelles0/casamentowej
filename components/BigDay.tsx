import Image from "next/image";
import BranchDivider from "@/components/icons/BranchDivider";
import { ChurchIcon, PartyIcon } from "@/components/icons/EventIcons";
import Reveal from "@/components/Reveal";
import { CEREMONY } from "@/lib/wedding";

export default function BigDay() {
  return (
    <section id="grande-dia" className="bg-cream-dark/40 py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-script text-3xl text-gold">O grande dia</p>
          <BranchDivider className="mt-3" />
        </Reveal>
      </div>

      {/* Full-bleed, como na hero: aspect mais alto no mobile para o conteúdo não ficar
          minúsculo, 2:1 (proporção original da arte) em telas sm+. */}
      <Reveal delayMs={80} className="relative mt-12 aspect-[4/3] w-full sm:aspect-[2/1]">
        <Image
          src="/images/grande-dia.jpg"
          alt="Igreja São Bento e mesa preparada para a recepção"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Reveal>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal
          delayMs={150}
          className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10"
        >
          <div className="flex flex-col items-center gap-3 text-brown-dark">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-cream text-gold">
              <ChurchIcon />
            </span>
            <div className="text-center">
              <p className="font-serif text-lg font-semibold">Cerimônia</p>
              <p className="font-sans text-sm">{CEREMONY.time} &middot; {CEREMONY.venueName}</p>
            </div>
          </div>

          <span className="h-8 w-px bg-gold/50 sm:hidden" aria-hidden="true" />

          <div className="flex flex-col items-center gap-3 text-brown-dark">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-cream text-gold">
              <PartyIcon />
            </span>
            <div className="text-center">
              <p className="font-serif text-lg font-semibold">Festa</p>
              <p className="font-sans text-sm">Logo após a cerimônia</p>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={220}>
          <p className="mx-auto mt-10 max-w-2xl text-center font-sans text-base leading-relaxed text-brown-dark sm:text-lg">
            Logo após a cerimônia, sigam para a Casa da Serra Restaurante, a cerca de 12km da
            igreja, para celebrarmos juntos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
