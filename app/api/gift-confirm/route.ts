import { NextRequest, NextResponse } from "next/server";
import { GIFTS } from "@/lib/gifts";
import { appendRow } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const giftId = body?.giftId as string | undefined;
  const guestName = (body?.guestName as string | undefined)?.trim() ?? "";

  const gift = GIFTS.find((g) => g.id === giftId);
  if (!gift) {
    return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
  }

  try {
    await appendRow("Presentes", [
      new Date().toISOString(),
      gift.name,
      gift.price === null ? "Valor livre" : `R$ ${gift.price.toFixed(2)}`,
      guestName || "Não informado",
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao registrar presente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
