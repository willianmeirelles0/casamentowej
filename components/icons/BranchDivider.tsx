type BranchDividerProps = {
  className?: string;
  flip?: boolean;
};

export default function BranchDivider({ className = "", flip = false }: BranchDividerProps) {
  return (
    <svg
      viewBox="0 0 240 40"
      className={`h-8 w-40 text-gold ${flip ? "-scale-x-100" : ""} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 20 C 60 20, 60 20, 120 20" />
      <path d="M120 20 C 150 20, 180 20, 238 20" opacity="0" />
      <path d="M20 20 C 35 8, 45 6, 58 14" />
      <path d="M20 20 C 35 32, 45 34, 58 26" />
      <ellipse cx="60" cy="12" rx="6" ry="3" transform="rotate(-20 60 12)" />
      <ellipse cx="60" cy="28" rx="6" ry="3" transform="rotate(20 60 28)" />
      <path d="M45 20 C 60 10, 70 8, 84 16" />
      <path d="M45 20 C 60 30, 70 32, 84 24" />
      <ellipse cx="86" cy="14" rx="5" ry="2.6" transform="rotate(-15 86 14)" />
      <ellipse cx="86" cy="26" rx="5" ry="2.6" transform="rotate(15 86 26)" />
      <circle cx="120" cy="20" r="3.2" fill="currentColor" stroke="none" />
      <path d="M156 20 C 141 8, 131 6, 118 14" />
      <path d="M156 20 C 141 32, 131 34, 118 26" />
      <ellipse cx="116" cy="12" rx="6" ry="3" transform="rotate(20 116 12)" />
      <ellipse cx="116" cy="28" rx="6" ry="3" transform="rotate(-20 116 28)" />
      <path d="M181 20 C 166 10, 156 8, 142 16" />
      <path d="M181 20 C 166 30, 156 32, 142 24" />
      <ellipse cx="140" cy="14" rx="5" ry="2.6" transform="rotate(15 140 14)" />
      <ellipse cx="140" cy="26" rx="5" ry="2.6" transform="rotate(-15 140 26)" />
      <path d="M120 20 C 178 20, 178 20, 220 20" />
    </svg>
  );
}
