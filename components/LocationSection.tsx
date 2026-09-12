import type { ReactNode } from "react";
import BranchDivider from "@/components/icons/BranchDivider";
import { ChurchIcon, MapPinIcon, PartyIcon } from "@/components/icons/EventIcons";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import { CEREMONY, RECEPTION } from "@/lib/wedding";

function mapEmbedSrc(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

type VenueCardProps = {
  title: string;
  venueName: string;
  address: string;
  reference?: string;
  mapQuery: string;
  icon: ReactNode;
  photoLabel: string;
};

function VenueCard({ title, venueName, address, reference, mapQuery, icon, photoLabel }: VenueCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream">
      <PhotoFrame label={photoLabel} icon={icon} className="aspect-[16/10] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
        <p className="font-script text-2xl text-gold">{title}</p>
        <p className="font-serif text-xl font-semibold text-brown-dark">{venueName}</p>
        <p className="flex items-start gap-2 font-sans text-sm text-brown-dark/90">
          <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
          <span>
            {address}
            {reference ? (
              <>
                <br />
                <span className="text-brown-dark/70">({reference})</span>
              </>
            ) : null}
          </span>
        </p>
        <div className="mt-2 min-h-[230px] flex-1 overflow-hidden rounded-xl border border-gold/20">
          <iframe
            title={`Mapa: ${venueName}`}
            src={mapEmbedSrc(mapQuery)}
            className="h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

export default function LocationSection() {
  return (
    <section id="local" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal className="flex flex-col items-center text-center">
        <p className="font-script text-3xl text-gold">Local</p>
        <BranchDivider className="mt-3" />
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <Reveal className="h-full">
          <VenueCard
            title="Cerimônia"
            venueName={CEREMONY.venueName}
            address={CEREMONY.address}
            mapQuery={CEREMONY.mapQuery}
            icon={<ChurchIcon className="h-10 w-10" />}
            photoLabel="Igreja São Bento"
          />
        </Reveal>
        <Reveal delayMs={120} className="h-full">
          <VenueCard
            title="Recepção"
            venueName={RECEPTION.venueName}
            address={RECEPTION.address}
            reference={RECEPTION.reference}
            mapQuery={RECEPTION.mapQuery}
            icon={<PartyIcon className="h-10 w-10" />}
            photoLabel="Casa da Serra Restaurante"
          />
        </Reveal>
      </div>
    </section>
  );
}
