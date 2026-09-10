import type { ReactNode } from "react";

type PhotoFrameProps = {
  className?: string;
  gradient?: string;
  label: string;
  icon?: ReactNode;
};

/**
 * Placeholder photo slot with an irregular watercolor-style frame. Once real photos are
 * available, drop them in /public/images and swap this for a Next <Image> inside the same
 * `watercolor-frame` wrapper, see README "Fotos do casal e dos locais".
 */
export default function PhotoFrame({ className = "", gradient, label, icon }: PhotoFrameProps) {
  return (
    <div
      className={`watercolor-frame flex aspect-[4/5] items-center justify-center overflow-hidden ${className}`}
      style={{
        background:
          gradient ??
          "linear-gradient(160deg, var(--color-sky) 0%, var(--color-cream-dark) 55%, var(--color-gold-light) 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center text-brown-dark/70">
        {icon}
        <span className="font-sans text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
