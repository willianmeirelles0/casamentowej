type IconProps = {
  className?: string;
};

export function ChurchIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 5 L24 12" />
      <path d="M20 8 L28 8" />
      <path d="M24 12 L12 20 L12 41 L36 41 L36 20 Z" />
      <path d="M24 12 L24 41" opacity="0" />
      <path d="M18 41 V29 C18 26 20.5 24 24 24 C27.5 24 30 26 30 29 V41" />
      <path d="M12 20 L36 20" />
      <path d="M8 41 H40" />
      <path d="M15 34 H20" />
      <path d="M28 34 H33" />
    </svg>
  );
}

export function PartyIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 41 L18 17 L38 30 Z" />
      <path d="M18 17 L20 10" />
      <path d="M12 36 L6 42" />
      <circle cx="30" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="38" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="34" cy="8" r="1" fill="currentColor" stroke="none" />
      <path d="M23 26 L27 26" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12 H20" />
      <path d="M14 6 L20 12 L14 18" />
    </svg>
  );
}

export function MapPinIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21 C12 21 5 13.8 5 9 a7 7 0 0 1 14 0 c0 4.8 -7 12 -7 12 Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C11.1 9 10.5 7.6 10.3 7c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 L12 13 L20.5 6.5" />
    </svg>
  );
}
