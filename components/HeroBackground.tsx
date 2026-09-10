/**
 * Painterly stand-in for the couple's Save the Date photo (sunflower field), built purely
 * from gradients/SVG so the site renders fully without external image assets.
 * Swap for the real photo: see README "Fotos do casal e dos locais".
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #cfe0ea 0%, #dcE7d9 32%, #e9dfb8 55%, #d9b96a 78%, #b08d57 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.5), transparent 60%)",
        }}
      />
      {/* sunflower field silhouette */}
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[45%] w-full text-brown-dark/80"
        aria-hidden="true"
      >
        <path
          d="M0 160 C 60 130, 120 150, 180 140 C 240 130, 300 150, 400 130 L400 200 L0 200 Z"
          fill="currentColor"
          opacity="0.25"
        />
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 400) / 26 + (i % 2 === 0 ? 4 : 14);
          const y = 150 + ((i * 7) % 20);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <line x1="0" y1="0" x2="0" y2="26" stroke="#5b6b3f" strokeWidth="2" />
              <circle cx="0" cy="-3" r="6.5" fill="#e8b93a" stroke="#8a6a1f" strokeWidth="0.6" />
              <circle cx="0" cy="-3" r="2.6" fill="#6b4a2f" />
            </g>
          );
        })}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,239,228,0) 55%, rgba(245,239,228,0.55) 82%, rgba(245,239,228,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 140px 40px rgba(107,74,47,0.25)" }}
      />
    </div>
  );
}
