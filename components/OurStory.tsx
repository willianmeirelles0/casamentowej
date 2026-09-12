import BranchDivider from "@/components/icons/BranchDivider";
import FramedImage from "@/components/FramedImage";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reveal from "@/components/Reveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { COUPLE_GALLERY } from "@/lib/gallery";

const PROPOSAL_VIDEO_ID = "zSEhNpHGfhI";

export default function OurStory() {
  return (
    <section id="historia" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal className="flex flex-col items-center text-center">
        <p className="font-script text-3xl text-gold">Nossa história</p>
        <BranchDivider className="mt-3" />
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Reveal className="order-2 grid grid-cols-1 items-start gap-4 sm:grid-cols-3 lg:order-1">
          <figure className="flex flex-col gap-2 sm:col-span-2">
            <PhotoCarousel images={COUPLE_GALLERY} alt="Jéssica e Willian" />
            <figcaption className="text-center font-script text-lg text-gold">
              Jéssica &amp; Willian
            </figcaption>
          </figure>
          <figure className="flex flex-col gap-2">
            <FramedImage src="/images/pedido-de-namoro.jpg" alt="O pedido de namoro" />
            <figcaption className="text-center font-script text-lg text-gold">
              O pedido de namoro
            </figcaption>
          </figure>
          <figure className="flex flex-col gap-2">
            <YouTubeEmbed videoId={PROPOSAL_VIDEO_ID} title="O pedido de casamento" />
            <figcaption className="text-center font-script text-lg text-gold">
              O pedido de casamento
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delayMs={120} className="order-1 space-y-5 font-sans text-base leading-relaxed text-brown-dark sm:text-lg lg:order-2">
          <p>
            Jéssica e Willian se conheceram através do trabalho, os dois do marketing, e o que
            começou como parceria profissional virou amizade sólida por seis meses antes de
            qualquer coisa acontecer. Foi só questão de tempo até a amizade virar certeza: em 24
            de julho de 2025, Willian pediu Jéssica em namoro. Menos de um ano depois, em 12 de
            junho de 2026, veio o pedido de casamento.
          </p>
          <p>
            Hoje são parceiros de verdade, dentro e fora de casa. Servem juntos à Igreja
            Católica, mantêm viva a tradição da &quot;quarta-love&quot; e nunca dispensam um bom
            motivo para sair pra comer. Como empresários, vivem com o coração acelerado entre
            sonhos grandes e aquele frio na barriga de quem se arrisca sempre. E é com essa mesma
            coragem que agora se preparam para o próximo grande passo: construir uma família
            juntos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
