import { NextRequest, NextResponse } from "next/server";
import { GIFTS } from "@/lib/gifts";
import { generatePixPayload } from "@/lib/pix";

export async function GET(request: NextRequest) {
  const giftId = request.nextUrl.searchParams.get("giftId");
  const gift = GIFTS.find((g) => g.id === giftId);

  if (!gift) {
    return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
  }

  try {
    const { brCode } = generatePixPayload(gift.price, gift.txid);
    return NextResponse.json({ brCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar o código Pix.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
