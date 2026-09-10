"use client";

import { useState, type FormEvent } from "react";
import BranchDivider from "@/components/icons/BranchDivider";
import Reveal from "@/components/Reveal";

type Status = "idle" | "submitting" | "success" | "error";

export default function RsvpForm() {
  const [attending, setAttending] = useState<"sim" | "nao">("sim");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      attending,
      guestCount: Number(formData.get("guestCount") ?? 0),
      guestNames: String(formData.get("guestNames") ?? ""),
      dietaryRestriction: String(formData.get("dietaryRestriction") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar confirmação.");

      setStatus("success");
      form.reset();
      setAttending("sim");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erro ao enviar confirmação.");
    }
  }

  if (status === "success") {
    return (
      <section id="confirmar-presenca" className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="font-script text-3xl text-gold">Obrigado!</p>
        <p className="mt-4 font-serif text-xl text-brown-dark">
          Recebemos sua confirmação! Mal podemos esperar para celebrar com você.
        </p>
      </section>
    );
  }

  return (
    <section id="confirmar-presenca" className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <Reveal className="flex flex-col items-center text-center">
        <p className="font-script text-3xl text-gold">Confirmação de presença</p>
        <BranchDivider className="mt-3" />
        <p className="mt-6 font-sans text-brown-dark/90">
          Contamos com você para celebrar esse dia. Por favor, confirme até a data combinada.
        </p>
      </Reveal>

      <Reveal delayMs={100}>
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="font-sans text-sm font-medium text-brown-dark">
              Nome completo *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-sans text-sm font-medium text-brown-dark">Vai comparecer? *</legend>
            <div className="flex gap-4">
              {(["sim", "nao"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-center font-sans text-sm transition-colors ${
                    attending === option
                      ? "border-gold bg-gold/15 text-brown-dark"
                      : "border-gold/30 text-brown-dark/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={option}
                    checked={attending === option}
                    onChange={() => setAttending(option)}
                    className="sr-only"
                  />
                  {option === "sim" ? "Sim, estarei lá" : "Não poderei ir"}
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "sim" && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="guestCount" className="font-sans text-sm font-medium text-brown-dark">
                  Quantidade de acompanhantes
                </label>
                <input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="guestNames" className="font-sans text-sm font-medium text-brown-dark">
                  Nome dos acompanhantes (opcional)
                </label>
                <input
                  id="guestNames"
                  name="guestNames"
                  type="text"
                  placeholder="Ex.: Maria Silva, João Silva"
                  className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="dietaryRestriction" className="font-sans text-sm font-medium text-brown-dark">
              Restrição alimentar *
            </label>
            <input
              id="dietaryRestriction"
              name="dietaryRestriction"
              type="text"
              required
              placeholder="Se não houver, digite &quot;Nenhuma&quot;"
              className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-sans text-sm font-medium text-brown-dark">
              Mensagem para os noivos (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
            />
          </div>

          {status === "error" && (
            <p className="font-sans text-sm text-red-700">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 rounded-full bg-brown px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-brown-dark disabled:opacity-60"
          >
            {status === "submitting" ? "Enviando..." : "Confirmar presença"}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
