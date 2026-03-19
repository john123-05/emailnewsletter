"use client";

import { useState } from "react";

export function ContactUploadPanel() {
  const [fileName, setFileName] = useState<string>("Noch keine Datei gewählt");
  const [defaultStatus, setDefaultStatus] = useState<string>("subscribed");

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--line-strong)] bg-[rgba(255,255,255,0.52)] px-6 py-8 text-center transition hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.72)]">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? "Noch keine Datei gewählt");
          }}
        />
        <span className="text-[11px] uppercase tracking-[0.22em] text-[rgba(24,33,28,0.45)]">
          CSV-Import
        </span>
        <span className="mt-3 text-xl font-semibold tracking-[-0.02em]">
          Kontakte hochladen
        </span>
        <span className="mt-5 rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[#fffaf2]">
          Datei wählen
        </span>
        <span className="mt-4 text-sm text-[rgba(24,33,28,0.58)]">
          {fileName}
        </span>
      </label>

      <div className="rounded-[28px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[rgba(24,33,28,0.45)]">
          Status
        </div>
        <div className="mt-4 grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Standardstatus</span>
            <select
              value={defaultStatus}
              onChange={(event) => setDefaultStatus(event.target.value)}
              className="rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            >
              <option value="subscribed">subscribed</option>
              <option value="pending">pending</option>
              <option value="suppressed">suppressed</option>
            </select>
          </label>

          <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(242,231,215,0.7)] px-4 py-3 text-sm leading-6 text-[rgba(24,33,28,0.72)]">
            Gewählter Importstatus: <strong>{defaultStatus}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
