import Monogram from "@/components/Monogram";

export default function Footer() {
  return (
    <footer className="bg-brown-dark py-14 text-cream">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 text-center">
        <Monogram className="text-gold-light" />
        <p className="font-script text-2xl">Com amor, Jéssica &amp; Willian</p>
        <p className="font-sans text-sm text-cream/80">
          Dúvidas? Fale com a gente.
        </p>
        <p className="mt-4 font-sans text-xs text-cream/50">24 de abril de 2027 &middot; Bento Gonçalves, RS</p>
      </div>
    </footer>
  );
}
