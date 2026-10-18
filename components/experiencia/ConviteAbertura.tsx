"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAudioExperiencia } from "@/components/experiencia/AudioContext";
import { COUPLE, WEDDING_DATE_ISO } from "@/lib/wedding";

type Gsap = typeof import("gsap").gsap;
type Decisao = "indefinido" | "mostrar" | "pular";

const CHAVE_SESSAO = "cwj_convite_aberto";

const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
}).format(new Date(WEDDING_DATE_ISO));

// Decide, de forma segura para hidratação (servidor não tem sessionStorage/matchMedia), se o
// convite deve aparecer. No servidor e na primeira pintura do cliente a decisão fica
// "indefinido" (nada é mostrado); logo depois o React troca para o valor real do cliente.
function inscrever() {
  return () => {};
}
function obterInstantaneoServidor(): Decisao {
  return "indefinido";
}
function obterInstantaneo(): Decisao {
  let jaAbriu = false;
  try {
    jaAbriu = sessionStorage.getItem(CHAVE_SESSAO) === "1";
  } catch {}
  const temAncora = window.location.hash.length > 1;
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return jaAbriu || temAncora || reduzMovimento ? "pular" : "mostrar";
}

export default function ConviteAbertura() {
  const { iniciarMusica, marcarConvitePronto } = useAudioExperiencia();
  const decisao = useSyncExternalStore(inscrever, obterInstantaneo, obterInstantaneoServidor);
  const [fechado, setFechado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const envelope = useRef<HTMLSpanElement>(null);
  const toque = useRef<HTMLSpanElement>(null);
  const seloEsq = useRef<HTMLSpanElement>(null);
  const seloDir = useRef<HTMLSpanElement>(null);
  const aba = useRef<HTMLSpanElement>(null);
  const cartao = useRef<HTMLSpanElement>(null);
  const faceClara = useRef<HTMLSpanElement>(null);
  const gsapRef = useRef<Gsap | null>(null);
  const ocupado = useRef(false);
  const concluido = useRef(false);

  const concluir = () => {
    if (concluido.current) return;
    concluido.current = true;
    marcarConvitePronto();
    document.getElementById("topo")?.focus();
  };

  const finalizar = () => {
    setFechado(true);
    document.documentElement.style.overflow = "";
    try {
      sessionStorage.setItem(CHAVE_SESSAO, "1");
    } catch {}
    concluir();
  };

  useEffect(() => {
    if (decisao === "indefinido") return;
    if (decisao === "pular") {
      concluir();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    import("gsap")
      .then((m) => (gsapRef.current = m.gsap))
      .catch(() => {});

    return () => {
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisao]);

  const sair = async (rapido: boolean) => {
    const gsap = gsapRef.current ?? (await import("gsap")).gsap;
    gsapRef.current = gsap;
    gsap.to(raiz.current, { opacity: 0, duration: rapido ? 0.25 : 0.35, onComplete: finalizar });
  };

  const abrir = () => {
    if (ocupado.current) return;
    ocupado.current = true;
    iniciarMusica();

    void (async () => {
      const gsap = gsapRef.current ?? (await import("gsap")).gsap;
      gsapRef.current = gsap;
      const alturaEnvelope = envelope.current?.offsetHeight ?? 220;
      const alvo = () => {
        const retangulo = cartao.current!.getBoundingClientRect();
        const escala =
          Math.max(window.innerWidth / retangulo.width, window.innerHeight / retangulo.height) * 1.04;
        return {
          dx: window.innerWidth / 2 - (retangulo.left + retangulo.width / 2),
          dy: window.innerHeight / 2 - (retangulo.top + retangulo.height / 2),
          escala,
        };
      };

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finalizar });
      tl.to(toque.current, { opacity: 0, duration: 0.25 }, 0)
        .to(seloEsq.current, { x: -16, y: 38, rotation: -18, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
        .to(seloDir.current, { x: 16, y: 38, rotation: 18, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
        .to(aba.current, { rotateX: 180, duration: 0.5 }, 0.1)
        .set(aba.current, { zIndex: 1 }, 0.4)
        .to(cartao.current, { y: -alturaEnvelope * 0.74, duration: 0.45, ease: "power2.out" }, 0.45)
        .to(
          cartao.current,
          {
            x: () => Number(gsap.getProperty(cartao.current, "x")) + alvo().dx,
            y: () => Number(gsap.getProperty(cartao.current, "y")) + alvo().dy,
            scale: () => alvo().escala,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0.9,
        )
        .to(faceClara.current, { opacity: 0, duration: 0.45 }, 0.95)
        .to(envelope.current, { opacity: 0, duration: 0.4 }, 0.9)
        .add(concluir, 1.7)
        .to(raiz.current, { opacity: 0, duration: 0.45, ease: "power1.out" }, 1.75);
    })();
  };

  if (decisao !== "mostrar" || fechado) return null;

  return (
    <div
      ref={raiz}
      role="dialog"
      aria-label="Convite de casamento de Jéssica e Willian"
      className="fixed inset-0 z-[100] grid h-[100svh] place-items-center overflow-hidden bg-cream"
    >
      <button
        type="button"
        onClick={() => {
          if (ocupado.current) return;
          ocupado.current = true;
          iniciarMusica();
          void sair(true);
        }}
        className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] z-10 min-h-11 px-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-brown-dark/70"
      >
        Pular
      </button>

      <button
        type="button"
        onClick={abrir}
        aria-label="Toque para abrir o convite"
        className="flex flex-col items-center gap-9 px-5 outline-none"
      >
        <span
          ref={envelope}
          className="relative block"
          style={{ width: "min(80vw, 340px)", aspectRatio: "100 / 68", perspective: 1100 }}
        >
          <span className="absolute inset-0 block rounded-[2px] bg-cream-dark" style={{ zIndex: 0 }} />

          <span
            ref={cartao}
            className="absolute block overflow-hidden rounded-[2px] border border-gold/50 bg-cream"
            style={{ zIndex: 2, left: "7%", top: "9%", width: "86%", height: "86%" }}
          >
            <span ref={faceClara} className="absolute inset-0 block bg-cream">
              <span className="absolute inset-[7px] block border border-gold/40" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
                <span className="font-script text-2xl text-gold">
                  {COUPLE.bride.split(" ")[0]} &amp; {COUPLE.groom.split(" ")[0]}
                </span>
                <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-brown-dark">
                  {dataFormatada}
                </span>
              </span>
            </span>
          </span>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            style={{ zIndex: 3 }}
            aria-hidden="true"
          >
            <g stroke="#d7bd8d" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <polygon points="0,0 50,52 0,100" fill="#ece2d0" vectorEffect="non-scaling-stroke" />
              <polygon points="100,0 50,52 100,100" fill="#ece2d0" vectorEffect="non-scaling-stroke" />
              <polygon points="0,100 50,52 100,100" fill="#f5efe4" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          <span
            ref={aba}
            className="absolute left-0 top-0 block w-full"
            style={{ height: "52%", zIndex: 4, transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{ backfaceVisibility: "hidden" }}
              aria-hidden="true"
            >
              <polygon points="0,0 100,0 50,100" fill="#f3ece0" stroke="#d7bd8d" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
              aria-hidden="true"
            >
              <polygon points="0,0 100,0 50,100" fill="#e4dacb" stroke="#d7bd8d" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>

          <span
            className="absolute block"
            style={{ zIndex: 5, left: "calc(50% - 26px)", top: "calc(52% - 26px)", width: 52, height: 52 }}
          >
            {(["esq", "dir"] as const).map((lado) => (
              <span
                key={lado}
                ref={lado === "esq" ? seloEsq : seloDir}
                className="absolute inset-0 block"
                style={{ clipPath: lado === "esq" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
              >
                <span className="absolute inset-0 grid place-items-center rounded-full bg-brown-dark ring-1 ring-inset ring-gold/50">
                  <span className="absolute inset-[5px] rounded-full border border-gold/40" />
                  <span className="relative whitespace-nowrap font-script text-lg text-gold-light">J&amp;W</span>
                </span>
              </span>
            ))}
          </span>
        </span>

        <span ref={toque} className="block animate-pulse font-sans text-[12px] font-medium uppercase tracking-[0.3em] text-brown-dark/80">
          Toque para abrir
        </span>
      </button>
    </div>
  );
}
