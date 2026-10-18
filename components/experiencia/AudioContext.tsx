"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ContextoAudio = {
  tocando: boolean;
  audioOk: boolean;
  convitePronto: boolean;
  iniciarMusica: () => void;
  alternarMusica: () => void;
  pausarAutomaticamente: (motivo: string) => void;
  retomarAutomaticamente: (motivo: string) => void;
  marcarConvitePronto: () => void;
};

const Ctx = createContext<ContextoAudio | null>(null);

export function useAudioExperiencia() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudioExperiencia precisa estar dentro de <ExperienciaProvider>");
  return ctx;
}

const VOLUME = 0.3;
const CHAVE_PAUSA = "cwj_musica_pausada";

function aplicarFade(audio: HTMLAudioElement, para: number, ms: number, aoFinal?: () => void) {
  const de = audio.volume;
  const inicio = performance.now();
  const passo = (agora: number) => {
    const k = Math.min(1, (agora - inicio) / ms);
    audio.volume = Math.max(0, Math.min(1, de + (para - de) * k));
    if (k < 1) requestAnimationFrame(passo);
    else aoFinal?.();
  };
  requestAnimationFrame(passo);
}

export function ExperienciaProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tocando, setTocando] = useState(false);
  const [audioOk, setAudioOk] = useState(true);
  const [convitePronto, setConvitePronto] = useState(false);
  const pausadoManualmente = useRef(false);
  const motivosPausa = useRef<Set<string>>(new Set());
  const tocandoAntesDaPausa = useRef(false);
  const tocandoRef = useRef(false);

  useEffect(() => {
    tocandoRef.current = tocando;
  }, [tocando]);

  useEffect(() => {
    try {
      pausadoManualmente.current = localStorage.getItem(CHAVE_PAUSA) === "1";
    } catch {}
  }, []);

  const tocar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0;
      const promessa = audio.play();
      setTocando(true);
      aplicarFade(audio, VOLUME, 2000);
      promessa?.catch(() => {
        setTocando(false);
        setAudioOk(false);
      });
    } catch {
      setAudioOk(false);
    }
  }, []);

  const pausar = useCallback((rapido = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    setTocando(false);
    if (rapido) audio.pause();
    else aplicarFade(audio, 0, 900, () => audio.pause());
  }, []);

  const iniciarMusica = useCallback(() => {
    if (pausadoManualmente.current) return;
    tocar();
  }, [tocar]);

  const alternarMusica = useCallback(() => {
    if (tocando) {
      pausadoManualmente.current = true;
      try {
        localStorage.setItem(CHAVE_PAUSA, "1");
      } catch {}
      pausar();
    } else {
      pausadoManualmente.current = false;
      try {
        localStorage.setItem(CHAVE_PAUSA, "0");
      } catch {}
      tocar();
    }
  }, [tocando, tocar, pausar]);

  // Lê tocandoRef (não o estado tocando) de propósito: assim a função mantém a mesma
  // identidade entre renders e não derruba efeitos que dependem dela (como o player do
  // YouTube, que destruiria e recriaria o iframe toda vez que a música começasse/parasse).
  const pausarAutomaticamente = useCallback(
    (motivo: string) => {
      const jaHaviaMotivo = motivosPausa.current.size > 0;
      motivosPausa.current.add(motivo);
      if (!jaHaviaMotivo && tocandoRef.current) {
        tocandoAntesDaPausa.current = true;
        pausar(true);
      }
    },
    [pausar],
  );

  const retomarAutomaticamente = useCallback(
    (motivo: string) => {
      motivosPausa.current.delete(motivo);
      if (motivosPausa.current.size === 0 && tocandoAntesDaPausa.current && !pausadoManualmente.current) {
        tocandoAntesDaPausa.current = false;
        tocar();
      }
    },
    [tocar],
  );

  // pausa a trilha quando a aba fica oculta e retoma ao voltar, se estava tocando
  useEffect(() => {
    const aoMudarVisibilidade = () => {
      if (document.hidden) pausarAutomaticamente("aba-oculta");
      else retomarAutomaticamente("aba-oculta");
    };
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => document.removeEventListener("visibilitychange", aoMudarVisibilidade);
  }, [pausarAutomaticamente, retomarAutomaticamente]);

  const marcarConvitePronto = useCallback(() => setConvitePronto(true), []);

  const valor = useMemo<ContextoAudio>(
    () => ({
      tocando,
      audioOk,
      convitePronto,
      iniciarMusica,
      alternarMusica,
      pausarAutomaticamente,
      retomarAutomaticamente,
      marcarConvitePronto,
    }),
    [
      tocando,
      audioOk,
      convitePronto,
      iniciarMusica,
      alternarMusica,
      pausarAutomaticamente,
      retomarAutomaticamente,
      marcarConvitePronto,
    ],
  );

  return (
    <Ctx.Provider value={valor}>
      <audio
        ref={audioRef}
        src="/audio/trilha.mp3"
        preload="none"
        loop
        onError={() => {
          setAudioOk(false);
          setTocando(false);
        }}
      />
      {children}
    </Ctx.Provider>
  );
}
