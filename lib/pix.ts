import { createStaticPix } from "pix-utils";

export type PixPayload = {
  brCode: string;
};

/**
 * Builds a static Pix BR Code (EMV) payload, no payment gateway or fees involved. Requires
 * PIX_KEY (and optionally PIX_MERCHANT_NAME / PIX_MERCHANT_CITY) in env.
 *
 * `amount` null (or <= 0) omits the value from the BR Code, so the payer picks the amount
 * themselves in their banking app.
 */
export function generatePixPayload(amount: number | null, txid: string): PixPayload {
  const pixKey = process.env.PIX_KEY;
  if (!pixKey) {
    throw new Error("PIX_KEY não configurada nas variáveis de ambiente.");
  }

  const merchantName = (process.env.PIX_MERCHANT_NAME ?? "JESSICA E WILLIAN").slice(0, 25);
  const merchantCity = (process.env.PIX_MERCHANT_CITY ?? "BENTO GONCALVES").slice(0, 15);

  const pix = createStaticPix({
    merchantName,
    merchantCity,
    pixKey,
    transactionAmount: amount ?? 0,
    txid: txid.slice(0, 25),
    infoAdicional: "Presente de casamento",
  }).throwIfError();

  return { brCode: pix.toBRCode() };
}
