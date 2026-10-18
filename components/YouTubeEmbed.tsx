"use client";

import { useEffect, useId, useRef } from "react";
import { useAudioExperiencia } from "@/components/experiencia/AudioContext";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
};

type LeitorYouTube = {
  destroy?: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        opts: { events: { onStateChange: (evento: { data: number }) => void } },
      ) => LeitorYouTube;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let promessaApi: Promise<void> | null = null;

function carregarApiYouTube(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!promessaApi) {
    promessaApi = new Promise((resolve) => {
      const callbackAnterior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        callbackAnterior?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return promessaApi;
}

export default function YouTubeEmbed({ videoId, title, className = "" }: YouTubeEmbedProps) {
  const idBase = useId();
  const idIframe = `yt-${idBase.replace(/[^a-zA-Z0-9]/g, "")}`;
  const motivo = `video-${idIframe}`;
  const { pausarAutomaticamente, retomarAutomaticamente } = useAudioExperiencia();
  const leitor = useRef<LeitorYouTube | null>(null);

  useEffect(() => {
    let cancelado = false;
    void carregarApiYouTube().then(() => {
      if (cancelado || !window.YT) return;
      leitor.current = new window.YT.Player(idIframe, {
        events: {
          onStateChange: (evento) => {
            if (!window.YT) return;
            if (evento.data === window.YT.PlayerState.PLAYING) {
              pausarAutomaticamente(motivo);
            } else if (evento.data === window.YT.PlayerState.PAUSED || evento.data === window.YT.PlayerState.ENDED) {
              retomarAutomaticamente(motivo);
            }
          },
        },
      });
    });
    return () => {
      cancelado = true;
      retomarAutomaticamente(motivo);
      leitor.current?.destroy?.();
    };
  }, [idIframe, motivo, pausarAutomaticamente, retomarAutomaticamente]);

  return (
    <div className={`watercolor-frame relative aspect-[9/16] overflow-hidden bg-brown-dark ${className}`}>
      <iframe
        id={idIframe}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
