"use client";

import { useState, useTransition } from "react";

type ResponseState = {
  ok: boolean;
  message: string;
  runId?: string;
} | null;

export function NewsletterIdeaButton() {
  const [result, setResult] = useState<ResponseState>(null);
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    const response = await fetch("/api/make/newsletter-idea", {
      method: "POST",
    });

    const json = (await response.json()) as ResponseState;

    startTransition(() => {
      setResult(json);
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        style={{ color: "#ffffff" }}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Wird gestartet..." : "Newsletter Idee generieren"}
      </button>
      {result ? (
        <div
          className={[
            "text-sm",
            result.ok ? "text-[var(--success)]" : "text-[var(--danger)]",
          ].join(" ")}
        >
          {result.message}
        </div>
      ) : null}
    </div>
  );
}
