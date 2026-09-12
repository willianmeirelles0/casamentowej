"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PhotoCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
};

export default function PhotoCarousel({
  images,
  alt,
  className = "",
  intervalMs = 4500,
}: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setLoaded(false);
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  function goTo(next: number) {
    setLoaded(false);
    setIndex(((next % images.length) + images.length) % images.length);
  }

  return (
    <div className={`watercolor-frame relative aspect-[4/5] overflow-hidden bg-cream-dark ${className}`}>
      <Image
        key={images[index]}
        src={images[index]}
        alt={`${alt} (${index + 1} de ${images.length})`}
        fill
        sizes="(max-width: 640px) 90vw, 480px"
        priority={index === 0}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-lg text-brown-dark backdrop-blur-sm transition-colors hover:bg-cream"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-lg text-brown-dark backdrop-blur-sm transition-colors hover:bg-cream"
          >
            ›
          </button>
          <span className="absolute bottom-2 right-2 rounded-full bg-cream/80 px-2.5 py-0.5 font-sans text-[11px] text-brown-dark backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
