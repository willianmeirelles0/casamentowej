"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import type { Gift } from "@/lib/gifts";

type GiftCardProps = {
  gift: Gift;
  given: boolean;
  onMarkGiven: (giftId: string) => void;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function GiftCard({ gift, given, onMarkGiven }: GiftCardProps) {
  const [open, setOpen] = useState(false);
  const [brCode, setBrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [marking, setMarking] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (brCode || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pix?giftId=${gift.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar o código Pix.");
      setBrCode(data.brCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar o código Pix.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!brCode) return;
    try {
      await navigator.clipboard.writeText(brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Não foi possível copiar automaticamente. Selecione o código manualmente.");
    }
  }

  async function handleMarkGiven() {
    setMarking(true);
    try {
      await fetch("/api/gift-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: gift.id }),
      });
    } catch {
      // Local marking still succeeds even if the optional sheet log fails.
    } finally {
      onMarkGiven(gift.id);
      setMarking(false);
    }
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-gold/30 bg-cream p-6 transition-shadow hover:shadow-lg ${
        given ? "opacity-60" : ""
      }`}
    >
      <div>
        {gift.image && (
          <div className="relative -mx-6 -mt-6 mb-4 h-36 overflow-hidden rounded-t-2xl sm:h-40">
            <Image
              src={gift.image}
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, 320px"
              className="object-cover object-bottom"
            />
          </div>
        )}
        <p className="font-serif text-lg font-semibold leading-snug text-brown-dark">{gift.name}</p>
        <p className="mt-2 font-sans text-sm italic text-brown-dark/80">&ldquo;{gift.description}&rdquo;</p>
        <p className="mt-4 font-serif text-2xl font-semibold text-gold">{currency.format(gift.price)}</p>
      </div>

      {given ? (
        <p className="mt-5 rounded-full border border-sage bg-sage/20 px-4 py-2 text-center font-sans text-sm text-brown-dark">
          Presenteado com carinho ✓
        </p>
      ) : !open ? (
        <button
          type="button"
          onClick={handleOpen}
          className="mt-5 rounded-full bg-brown px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-brown-dark"
        >
          Presentear
        </button>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-3 border-t border-gold/20 pt-5">
          {loading && <p className="font-sans text-sm text-brown-dark/70">Gerando QR code Pix...</p>}
          {error && <p className="font-sans text-sm text-red-700">{error}</p>}
          {brCode && (
            <>
              <div className="rounded-xl border border-gold/30 bg-white p-3">
                <QRCodeSVG value={brCode} size={168} level="M" />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full rounded-full border border-gold px-4 py-2 font-sans text-xs font-medium text-brown-dark transition-colors hover:bg-gold/10"
              >
                {copied ? "Código copiado!" : "Copiar código Pix (copia e cola)"}
              </button>
              <button
                type="button"
                onClick={handleMarkGiven}
                disabled={marking}
                className="w-full rounded-full bg-sage px-4 py-2 font-sans text-xs font-medium text-brown-dark transition-colors hover:bg-sage/80 disabled:opacity-60"
              >
                {marking ? "Registrando..." : "Já presenteei"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
