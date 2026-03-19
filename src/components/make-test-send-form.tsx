"use client";

import { useState, useTransition } from "react";

type ResponseState = {
  ok: boolean;
  message: string;
  response?: string;
} | null;

export function MakeTestSendForm() {
  const [result, setResult] = useState<ResponseState>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/make/test-send", {
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
      <form action={handleSubmit} className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Testadresse</span>
          <input
            name="empfaenger"
            type="email"
            required
            placeholder="info@deinedomain.de"
            className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Kampagnenname</span>
          <input
            name="kampagne"
            type="text"
            required
            defaultValue="Frühlingskampagne 2026"
            className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium">Betreff</span>
          <input
            name="betreff"
            type="text"
            required
            defaultValue="Kurzer Testversand aus Briefwerk"
            className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium">Notiz für Make</span>
          <textarea
            name="notiz"
            rows={4}
            defaultValue="Bitte als Testversand markieren, HTML aus aktiver Vorlage nehmen und keinen Tracking-Lauf starten."
            className="rounded-3xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Wird an Make gesendet..." : "Testversand auslösen"}
          </button>
          <span className="text-sm text-[rgba(24,33,28,0.6)]">
            Erwartet `MAKE_TEST_SEND_WEBHOOK_URL` in `.env.local`.
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
