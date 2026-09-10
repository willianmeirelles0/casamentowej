type CornerFlourishProps = {
  className?: string;
};

/** Thin gold botanical corner ornament, meant to be rotated per-corner via className. */
export default function CornerFlourish({ className = "" }: CornerFlourishProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4 C 4 40, 4 60, 4 90" opacity="0" />
      <path d="M6 6 C 26 10, 40 24, 44 44" />
      <path d="M6 6 C 10 26, 24 40, 44 44" />
      <path d="M18 12 C 24 16, 26 20, 24 26" />
      <ellipse cx="26" cy="15" rx="5" ry="2.4" transform="rotate(35 26 15)" />
      <path d="M12 22 C 18 24, 22 28, 22 34" />
      <ellipse cx="14" cy="27" rx="4.5" ry="2.2" transform="rotate(60 14 27)" />
      <circle cx="44" cy="44" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
