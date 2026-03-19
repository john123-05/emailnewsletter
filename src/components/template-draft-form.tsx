"use client";

import { useState, useTransition } from "react";

type ResponseState = {
  ok: boolean;
  message: string;
  response?: string;
} | null;

export function TemplateDraftForm() {
  const [result, setResult] = useState<ResponseState>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/make/template-draft", {
      method: "POST",
      body: formData,
    });

    const json = (await response.json()) as ResponseState;

    startTransition(() => {
      setResult(json);
    });
  }

  return (
    <div className="rounded-[26px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-4">
      <form action={handleSubmit} className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Thema</span>
          <input
            name="thema"
            type="text"
            defaultValue="Frühlingskampagne mit Produktneuheiten und Event-Hinweis"
            className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tonality</span>
          <select
            name="tonalitaet"
            defaultValue="wertig, ruhig, nahbar"
            className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          >
            <option>wertig, ruhig, nahbar</option>
            <option>verkaufsstark, klar, direkt</option>
            <option>redaktionell, inspirierend, weich</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Stichpunkte oder Inhalte</span>
          <textarea
            name="inhalte"
            rows={7}
            defaultValue={`- Neue Produkteinführung am 25. März
- Zwei Bilder aus dem neuen Shooting einbauen
- CTA zur Landingpage
- kurzer persönlicher Intro-Absatz
- Footer mit Impressum und Abmeldelink`}
            className="rounded-3xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Briefing wird an Make gesendet..." : "HTML-Entwurf anfordern"}
          </button>
          <span className="text-sm text-[rgba(24,33,28,0.6)]">
            Erwartet `MAKE_TEMPLATE_WEBHOOK_URL`.
          </span>
        </div>
      </form>

      {result ? (
        <div
          className={[
            "mt-4 rounded-[22px] border px-4 py-3 text-sm leading-6",
            result.ok
              ? "border-[rgba(45,107,87,0.18)] bg-[rgba(45,107,87,0.1)] text-[var(--success)]"
              : "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.1)] text-[var(--danger)]",
          ].join(" ")}
        >
          <div className="font-semibold">{result.message}</div>
          {result.response ? (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
              {result.response}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
