import { NextResponse } from "next/server";
import { readRows } from "@/lib/sheets";

export type Guest = {
  name: string;
  companions: string[];
};

// Evita bater no Google Sheets a cada visitante; a lista de convidados muda raramente.
export const revalidate = 300;

export async function GET() {
  try {
    const rows = await readRows("Convidados");

    const guests: Guest[] = rows
      .map(([name, companionsRaw]) => ({
        name: (name ?? "").trim(),
        companions: (companionsRaw ?? "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      }))
      .filter((guest) => guest.name.length > 0);

    return NextResponse.json({ guests });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao carregar convidados.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
