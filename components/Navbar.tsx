"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#historia", label: "Nossa história" },
  { href: "#grande-dia", label: "O grande dia" },
  { href: "#local", label: "Local" },
  { href: "#presentes", label: "Presentes" },
  { href: "#confirmar-presenca", label: "Confirmar presença" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/90 shadow-[0_1px_0_rgba(176,141,87,0.3)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#topo" className="font-script text-2xl text-brown">
          J &amp; W
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <span className="h-px w-6 bg-brown transition-transform" style={open ? { transform: "translateY(6px) rotate(45deg)" } : undefined} />
          <span className="h-px w-6 bg-brown transition-opacity" style={open ? { opacity: 0 } : undefined} />
          <span className="h-px w-6 bg-brown transition-transform" style={open ? { transform: "translateY(-6px) rotate(-45deg)" } : undefined} />
        </button>

        <ul className="hidden items-center gap-7 font-sans text-sm tracking-wide text-brown-dark sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-gold">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <ul className="flex flex-col items-center gap-4 bg-cream/95 pb-6 pt-2 font-sans text-sm text-brown-dark sm:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className="hover:text-gold">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
