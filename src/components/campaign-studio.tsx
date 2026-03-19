"use client";

import { useState, useTransition } from "react";

type TemplateOption = {
  id: string;
  name: string;
  subject: string;
  html_content: string;
};

type StudioMode = "text" | "make" | "html";

type CampaignStudioProps = {
  templates: TemplateOption[];
};

function textToHtml(value: string) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;line-height:1.7;color:#1f2a24;font-size:16px;">${paragraph.replace(/\n/g, "<br />")}</p>`,
    )
    .join("");

  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#fffaf2;padding:32px;color:#1f2a24;">${paragraphs || "<p style='color:#7b7b74;'>Noch kein Inhalt.</p>"}</div>`;
}

export function CampaignStudio({ templates }: CampaignStudioProps) {
  const firstTemplate = templates[0];
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState(firstTemplate?.subject ?? "");
  const [mode, setMode] = useState<StudioMode>("text");
  const [textBody, setTextBody] = useState("");
  const [makeHtml, setMakeHtml] = useState(firstTemplate?.html_content ?? "");
  const [manualHtml, setManualHtml] = useState(firstTemplate?.html_content ?? "");
  const [selectedTemplateId, setSelectedTemplateId] = useState(firstTemplate?.id ?? "");
  const [testEmail, setTestEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const preview =
    mode === "text" ? textToHtml(textBody) : mode === "make" ? makeHtml : manualHtml;

  function handleTemplateSelect(templateId: string) {
    setSelectedTemplateId(templateId);
    const template = templates.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    setSubject(template.subject);
    setMakeHtml(template.html_content);
    setManualHtml(template.html_content);
  }

  async function handleTestSend() {
    if (!testEmail) {
      setResponseMessage("Bitte zuerst eine Testadresse eingeben.");
      return;
    }

    const formData = new FormData();
    formData.set("empfaenger", testEmail);
    formData.set("kampagne", campaignName || "Neue Kampagne");
    formData.set("betreff", subject || "Ohne Betreff");
    formData.set("notiz", "Test aus dem Kampagnen-Studio");

    const response = await fetch("/api/make/test-send", {
      method: "POST",
      body: formData,
    });

    const json = (await response.json()) as { message?: string };

    startTransition(() => {
      setResponseMessage(json.message ?? "Testsendung wurde abgeschickt.");
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Kampagne</span>
            <input
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              placeholder="Frühlingsaktion"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Betreff</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Newsletter Betreff"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: "text", label: "Text" },
            { id: "make", label: "HTML von Make" },
            { id: "html", label: "Eigenes HTML" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id as StudioMode)}
              style={mode === item.id ? { color: "#ffffff" } : undefined}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                mode === item.id
                  ? "bg-[var(--foreground)] !text-white"
                  : "border border-[var(--line-strong)] bg-white/60 text-[rgba(24,33,28,0.72)]",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Vorlage laden</span>
            <select
              value={selectedTemplateId}
              onChange={(event) => handleTemplateSelect(event.target.value)}
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">Keine Vorlage</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {mode === "text" ? (
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-medium">Text</span>
            <textarea
              value={textBody}
              onChange={(event) => setTextBody(event.target.value)}
              rows={18}
              placeholder="Hier den reinen Text schreiben ..."
              className="rounded-[24px] border border-[var(--line-strong)] bg-white/80 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        ) : null}

        {mode === "make" ? (
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-medium">HTML von Make</span>
            <textarea
              value={makeHtml}
              onChange={(event) => setMakeHtml(event.target.value)}
              rows={18}
              placeholder="<table>...</table>"
              className="rounded-[24px] border border-[var(--line-strong)] bg-white/80 px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        ) : null}

        {mode === "html" ? (
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-medium">Eigenes HTML</span>
            <textarea
              value={manualHtml}
              onChange={(event) => setManualHtml(event.target.value)}
              rows={18}
              placeholder="<table>...</table>"
              className="rounded-[24px] border border-[var(--line-strong)] bg-white/80 px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] p-4">
          <div className="mb-3 text-sm font-medium">Live-Vorschau</div>
          <div className="min-h-[520px] overflow-hidden rounded-[20px] border border-[var(--line)] bg-white">
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
              type="email"
              placeholder="test@deinedomain.de"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={handleTestSend}
              disabled={isPending}
              className="rounded-full border border-[var(--line-strong)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--foreground)] disabled:opacity-60"
            >
              Testmail senden
            </button>
            <button
              type="button"
              style={{ color: "#ffffff" }}
              className="rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92"
            >
              Kampagne starten
            </button>
          </div>
          {responseMessage ? (
            <div className="mt-3 text-sm text-[rgba(24,33,28,0.68)]">
              {responseMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
