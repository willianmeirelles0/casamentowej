import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/sheets";

type RsvpBody = {
  fullName?: string;
  attending?: "sim" | "nao";
  guestCount?: number;
  guestNames?: string;
  dietaryRestriction?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as RsvpBody | null;

  if (!body) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const attending = body.attending;
  const dietaryRestriction = body.dietaryRestriction?.trim();

  if (!fullName || (attending !== "sim" && attending !== "nao") || !dietaryRestriction) {
    return NextResponse.json(
      { error: "Preencha nome completo, presença e restrição alimentar." },
      { status: 400 }
    );
  }

  const guestCount = Number.isFinite(body.guestCount) ? Number(body.guestCount) : 0;

  try {
    await appendRow("RSVP", [
      new Date().toISOString(),
      fullName,
      attending === "sim" ? "Sim" : "Não",
      guestCount,
      body.guestNames?.trim() ?? "",
      dietaryRestriction,
      body.message?.trim() ?? "",
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gravar confirmação.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
