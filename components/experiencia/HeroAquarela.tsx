"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import { useAudioExperiencia } from "@/components/experiencia/AudioContext";
import { COUPLE, WEDDING_DATE_ISO } from "@/lib/wedding";

type Gsap = typeof import("gsap").gsap;
type Modo = "aguardando" | "cheio" | "simplificado" | "pronto";

const CHAVE_PINTADO = "cwj_hero_pintado";

const dataNumerica = (() => {
  const d = new Date(WEDDING_DATE_ISO);
  const dia = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Sao_Paulo" }).format(d);
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "2-digit", timeZone: "America/Sao_Paulo" }).format(d);
  const ano = new Intl.DateTimeFormat("pt-BR", { year: "2-digit", timeZone: "America/Sao_Paulo" }).format(d);
  return `${dia}.${mes}.${ano}`;
})();

/** Mede alguns quadros reais antes de decidir se o aparelho aguenta a animação completa. */
function medirDesempenho(): Promise<boolean> {
  return new Promise((resolve) => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (navigator.hardwareConcurrency ?? 8) <= 4) {
      resolve(false);
      return;
    }
    let quadros = 0;
    const inicio = performance.now();
    const passo = () => {
      quadros++;
      if (performance.now() - inicio < 200) {
        requestAnimationFrame(passo);
      } else {
        const fps = (quadros / (performance.now() - inicio)) * 1000;
        resolve(fps >= 48);
      }
    };
    requestAnimationFrame(passo);
  });
}

// Faixa de pincel (borda direita irregular) usada como máscara de revelação. O
// feTurbulence/feDisplacementMap é "assado" uma única vez em build time
// (scripts/gerar-camadas-aquarela.mjs), virando um PNG estático: recalcular esse filtro ao
// vivo dentro de um mask-image, com mask-size animado, tem recortes retos em alguns
// navegadores quando a máscara é ampliada. Com um raster pronto, o componente só anima
// mask-size (a largura da faixa, da esquerda para a direita) por cima dele.
const MASCARA_LAVAGEM = 'url("/images/aquarela/mascara-lavagem.png")';
const MASCARA_FINAL = 'url("/images/aquarela/mascara-final.png")';
// A faixa fica ancorada na borda esquerda (0%) e centralizada na vertical; só a largura
// (primeiro valor do mask-size) cresce, pintando da esquerda para a direita como um pincel.
const ORIGEM_MANCHA = "0% 50%";
const LARGURA_INICIAL = "3% 400%";
const LARGURA_FINAL = "190% 400%";

type TextoRevelavelProps = {
  className?: string;
  children: React.ReactNode;
  revelado: boolean;
  setRef: (el: HTMLSpanElement | null) => void;
};

function TextoRevelavel({ className = "", children, revelado, setRef }: TextoRevelavelProps) {
  return (
    <span
      ref={setRef}
      className={`inline-block ${className}`}
      style={{ clipPath: revelado ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
    >
      {children}
    </span>
  );
}

export default function HeroAquarela() {
  const { convitePronto } = useAudioExperiencia();
  const [modo, setModo] = useState<Modo>("aguardando");
  const esboco = useRef<HTMLDivElement>(null);
  const lavagem = useRef<HTMLDivElement>(null);
  const final = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const areaTexto = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLSpanElement | null)[]>([]);
  const iniciado = useRef(false);

  // Os textos usam font-size em função da largura real da área da imagem (--lw), não do
  // viewport: no mobile essa área é mais larga que a tela (o excesso fica escondido pelo
  // corte do object-cover), então vw puro faria o texto estourar para fora da Hero.
  useEffect(() => {
    const el = areaTexto.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entradas) => {
      const largura = entradas[0]?.contentRect.width;
      if (largura) el.style.setProperty("--lw", `${largura}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!convitePronto || iniciado.current) return;
    iniciado.current = true;

    let jaPintado = false;
    try {
      jaPintado = sessionStorage.getItem(CHAVE_PINTADO) === "1";
    } catch {}

    const reduzMovimento =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (jaPintado || reduzMovimento) {
      setModo("pronto");
      return;
    }

    void (async () => {
      const aguentaCompleta = await medirDesempenho();
      setModo(aguentaCompleta ? "cheio" : "simplificado");
    })();
  }, [convitePronto]);

  useEffect(() => {
    if (modo !== "cheio" && modo !== "simplificado") return;

    void (async () => {
      const gsap: Gsap = (await import("gsap")).gsap;
      const marcar = () => {
        try {
          sessionStorage.setItem(CHAVE_PINTADO, "1");
        } catch {}
      };
      const textosValidos = textos.current.filter((t): t is HTMLSpanElement => Boolean(t));

      const tl = gsap.timeline({ onComplete: marcar });

      tl.to(esboco.current, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0);

      if (modo === "cheio") {
        tl.fromTo(
          lavagem.current,
          { maskSize: LARGURA_INICIAL, WebkitMaskSize: LARGURA_INICIAL, opacity: 1 },
          { maskSize: LARGURA_FINAL, WebkitMaskSize: LARGURA_FINAL, duration: 1.6, ease: "power1.inOut" },
          0.35,
        )
          .fromTo(
            final.current,
            { maskSize: LARGURA_INICIAL, WebkitMaskSize: LARGURA_INICIAL },
            { maskSize: LARGURA_FINAL, WebkitMaskSize: LARGURA_FINAL, duration: 1.9, ease: "power1.inOut" },
            1.1,
          )
          .to(final.current, { opacity: 1, duration: 0.1 }, 1.1)
          .fromTo(
            final.current,
            { filter: "saturate(0.9) contrast(0.96)" },
            { filter: "saturate(1) contrast(1)", duration: 0.6, ease: "power1.out" },
            2.85,
          );
      } else {
        tl.fromTo(
          final.current,
          { maskSize: LARGURA_INICIAL, WebkitMaskSize: LARGURA_INICIAL },
          { maskSize: LARGURA_FINAL, WebkitMaskSize: LARGURA_FINAL, duration: 1.3, ease: "power1.inOut" },
          0.4,
        ).to(final.current, { opacity: 1, duration: 0.1 }, 0.4);
      }

      const inicioTextos = modo === "cheio" ? 3.1 : 1.5;
      textosValidos.forEach((el, i) => {
        tl.to(el, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power2.out" }, inicioTextos + i * 0.18);
      });

      tl.to(
        conteudo.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        inicioTextos + textosValidos.length * 0.18 + 0.1,
      );
    })();
  }, [modo]);

  const pronto = modo === "pronto";
  const mostrarEsboco = modo === "cheio" || modo === "simplificado";
  const mostrarLavagem = modo === "cheio";

  const estiloMascara = (imagem: string): React.CSSProperties => ({
    WebkitMaskImage: imagem,
    maskImage: imagem,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: ORIGEM_MANCHA,
    maskPosition: ORIGEM_MANCHA,
    WebkitMaskSize: LARGURA_INICIAL,
    maskSize: LARGURA_INICIAL,
  });

  return (
    <section
      id="topo"
      tabIndex={-1}
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden py-14 text-center outline-none sm:gap-10 sm:py-20"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[2/1]">
        {/* esboço a lápis: base, aparece primeiro (não existe fora dos modos animados) */}
        {mostrarEsboco && (
          <div ref={esboco} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/images/aquarela/esboco.webp" alt="" fill sizes="100vw" className="object-cover" aria-hidden="true" />
          </div>
        )}

        {/* lavagem de cor: some sobre o esboço, só no modo completo */}
        {mostrarLavagem && (
          <div ref={lavagem} className="absolute inset-0" style={{ opacity: 0, ...estiloMascara(MASCARA_LAVAGEM) }}>
            <Image src="/images/aquarela/lavagem.webp" alt="" fill sizes="100vw" className="object-cover" aria-hidden="true" />
          </div>
        )}

        {/* arte final: sempre no HTML (garante o preload/LCP), só escondida pela máscara até pintar */}
        <div
          ref={final}
          className={`absolute inset-0 ${pronto ? "transition-opacity duration-700 ease-out" : ""}`}
          style={pronto ? { opacity: 1 } : { opacity: 0, ...estiloMascara(MASCARA_FINAL) }}
        >
          <Image
            src="/images/aquarela/final.webp"
            alt={`Save the date: ${COUPLE.bride} e ${COUPLE.groom}, ${dataNumerica.replaceAll(".", "/")}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* véu de grão de papel por cima de tudo, para unificar as camadas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            mixBlendMode: "multiply",
            opacity: 0.18,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='matrix' values='0 0 0 0 0.96 0 0 0 0 0.93 0 0 0 0 0.85 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>\")",
            backgroundSize: "180px 180px",
          }}
        />

        {/* textos que antes ficavam chapados na arte: desenhados em HTML, com as fontes do
            site, revelados da esquerda para a direita como uma caligrafia. O tamanho usa
            variável --lw (medida via ResizeObserver) para acompanhar a largura real da área
            da imagem, não a da tela, senão o texto sai do lugar quando a Hero é recortada no
            mobile. */}
        <div
          ref={areaTexto}
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ aspectRatio: "1774 / 887", height: "100%", ["--lw" as string]: "390px" }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 px-[2%] text-center"
            style={{ top: "6.6%", width: "60%" }}
          >
            <TextoRevelavel
              revelado={pronto}
              setRef={(el) => {
                textos.current[0] = el;
              }}
              className="font-serif font-semibold uppercase tracking-[0.3em] text-brown-dark"
            >
              <span style={{ fontSize: "clamp(0.55rem, calc(var(--lw) * 0.036), 1.2rem)" }}>
                Save <em className="font-script not-italic lowercase tracking-normal text-gold">the</em> Date
              </span>
            </TextoRevelavel>
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 px-[2%] text-center"
            style={{ top: "73.5%", width: "72%" }}
          >
            <TextoRevelavel
              revelado={pronto}
              setRef={(el) => {
                textos.current[1] = el;
              }}
              className="font-serif uppercase tracking-[0.14em] text-brown-dark"
            >
              <span style={{ fontSize: "clamp(0.4rem, calc(var(--lw) * 0.017), 0.72rem)" }}>
                Prepare-se para o nosso grande dia!
              </span>
            </TextoRevelavel>
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 px-[2%] text-center"
            style={{ top: "79%", width: "55%" }}
          >
            <TextoRevelavel
              revelado={pronto}
              setRef={(el) => {
                textos.current[2] = el;
              }}
              className="font-serif font-semibold tracking-[0.18em] text-brown-dark"
            >
              <span style={{ fontSize: "clamp(0.8rem, calc(var(--lw) * 0.034), 1.5rem)" }}>{dataNumerica}</span>
            </TextoRevelavel>
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 px-[2%] text-center"
            style={{ top: "90.5%", width: "80%" }}
          >
            <TextoRevelavel
              revelado={pronto}
              setRef={(el) => {
                textos.current[3] = el;
              }}
              className="font-serif uppercase tracking-[0.1em] text-brown-dark"
            >
              <span style={{ fontSize: "clamp(0.4rem, calc(var(--lw) * 0.0185), 0.78rem)" }}>
                {COUPLE.bride} <span className="font-script normal-case tracking-normal text-gold">&amp;</span>{" "}
                {COUPLE.groom}
              </span>
            </TextoRevelavel>
          </div>
        </div>
      </div>

      <div
        ref={conteudo}
        className={`flex flex-col items-center gap-7 px-5 ${pronto ? "transition-opacity duration-700 ease-out" : ""}`}
        style={{ opacity: pronto ? 1 : 0, transform: pronto ? "none" : "translateY(16px)" }}
      >
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
