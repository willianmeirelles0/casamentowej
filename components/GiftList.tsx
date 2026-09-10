"use client";

import { useSyncExternalStore } from "react";
import BranchDivider from "@/components/icons/BranchDivider";
import GiftCard from "@/components/GiftCard";
import Reveal from "@/components/Reveal";
import { GIFTS } from "@/lib/gifts";
import { getServerSnapshot, getSnapshot, markGiftGiven, subscribe } from "@/lib/givenGiftsStore";

export default function GiftList() {
  const givenIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section id="presentes" className="bg-cream-dark/40 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-script text-3xl text-gold">Lista de presentes</p>
          <BranchDivider className="mt-3" />
          <p className="mx-auto mt-6 max-w-xl font-sans text-brown-dark/90">
            Sua presença já é o maior presente. Mas se quiser nos ajudar a começar essa nova
            fase com o pé direito (e com bom humor), separamos algumas cotas especiais. Pix
            direto, sem taxas.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GIFTS.map((gift, i) => (
            <Reveal key={gift.id} delayMs={(i % 4) * 90}>
              <GiftCard gift={gift} given={givenIds.includes(gift.id)} onMarkGiven={markGiftGiven} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
