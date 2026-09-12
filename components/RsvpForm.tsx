"use client";

import { useEffect, useState, type FormEvent } from "react";
import BranchDivider from "@/components/icons/BranchDivider";
import Reveal from "@/components/Reveal";
import type { Guest } from "@/app/api/guests/route";

type Status = "idle" | "submitting" | "success" | "error";

export default function RsvpForm() {
  const [attending, setAttending] = useState<"sim" | "nao">("sim");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [guests, setGuests] = useState<Guest[]>([]);
  const [fullNameInput, setFullNameInput] = useState("");
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const [selectedCompanions, setSelectedCompanions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch("/api/guests")
      .then((res) => (res.ok ? res.json() : { guests: [] }))
      .then((data) => setGuests(data.guests ?? []))
      .catch(() => setGuests([]));
  }, []);

  const suggestions =
    fullNameInput.trim().length > 0 && !matchedGuest
      ? guests
          .filter((g) => g.name.toLowerCase().includes(fullNameInput.trim().toLowerCase()))
          .slice(0, 6)
      : [];

  function handleNameChange(value: string) {
    setFullNameInput(value);
    if (matchedGuest && value !== matchedGuest.name) {
      setMatchedGuest(null);
      setSelectedCompanions([]);
    }
  }

  function handleSelectGuest(guest: Guest) {
    setFullNameInput(guest.name);
    setMatchedGuest(guest);
    setSelectedCompanions([]);
    setShowSuggestions(false);
  }

  function toggleCompanion(companion: string) {
    setSelectedCompanions((prev) =>
      prev.includes(companion) ? prev.filter((c) => c !== companion) : [...prev, companion]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: fullNameInput.trim(),
      attending,
      guestCount: attending === "sim" ? selectedCompanions.length : 0,
      guestNames: attending === "sim" ? selectedCompanions.join(", ") : "",
      dietaryRestriction:
        attending === "sim" ? String(formData.get("dietaryRestriction") ?? "") : "",
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
      setFullNameInput("");
      setMatchedGuest(null);
      setSelectedCompanions([]);
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
          <div className="relative flex flex-col gap-2">
            <label htmlFor="fullName" className="font-sans text-sm font-medium text-brown-dark">
              Nome completo*
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="off"
              value={fullNameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-gold/40 bg-white shadow-lg">
                {suggestions.map((guest) => (
                  <li key={guest.name}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectGuest(guest)}
                      className="w-full px-4 py-2.5 text-left font-sans text-sm text-brown-dark hover:bg-gold/10"
                    >
                      {guest.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-sans text-sm font-medium text-brown-dark">Vai comparecer?*</legend>
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
              <fieldset className="flex flex-col gap-2">
                <legend className="font-sans text-sm font-medium text-brown-dark">Acompanhantes</legend>
                {matchedGuest && matchedGuest.companions.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {matchedGuest.companions.map((companion) => (
                      <label
                        key={companion}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-sm text-brown-dark"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCompanions.includes(companion)}
                          onChange={() => toggleCompanion(companion)}
                          className="h-4 w-4 accent-gold"
                        />
                        {companion}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-gold/20 bg-cream-dark/40 px-4 py-2.5 font-sans text-sm text-brown-dark/50">
                    {matchedGuest
                      ? "Nenhum acompanhante cadastrado para esse nome."
                      : "Selecione seu nome acima para ver os acompanhantes disponíveis."}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="dietaryRestriction" className="font-sans text-sm font-medium text-brown-dark">
                  Restrição alimentar*
                </label>
                <input
                  id="dietaryRestriction"
                  name="dietaryRestriction"
                  type="text"
                  required={attending === "sim"}
                  placeholder="Se não houver, digite &quot;Nenhuma&quot;"
                  className="rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 font-sans text-brown-dark outline-none focus:border-gold"
                />
              </div>
            </>
          )}

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
