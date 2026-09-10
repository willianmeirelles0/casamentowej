import { MailIcon, WhatsAppIcon } from "@/components/icons/EventIcons";
import Monogram from "@/components/Monogram";
import { CONTACT } from "@/lib/wedding";

export default function Footer() {
  return (
    <footer className="bg-brown-dark py-14 text-cream">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 text-center">
        <Monogram className="text-gold-light" />
        <p className="font-script text-2xl">Com amor, Jéssica &amp; Willian</p>
        <p className="font-sans text-sm text-cream/80">
          Dúvidas? Fale com a gente.
        </p>
        <div className="flex flex-col items-center gap-3 font-sans text-sm sm:flex-row sm:gap-6">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 text-cream/90 transition-colors hover:text-gold-light"
          >
            <MailIcon className="h-4 w-4" />
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cream/90 transition-colors hover:text-gold-light"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {CONTACT.whatsapp}
          </a>
        </div>
        <p className="mt-4 font-sans text-xs text-cream/50">24 de abril de 2027 &middot; Bento Gonçalves, RS</p>
      </div>
    </footer>
  );
}
