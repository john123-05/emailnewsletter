"use client";

import { useState } from "react";
import { saveTemplateAction } from "@/app/actions/templates";
import type { TemplateSummary } from "@/lib/data";

type TemplateEditorProps = {
  templates: TemplateSummary[];
};

export function TemplateEditor({ templates }: TemplateEditorProps) {
  const firstTemplate = templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(firstTemplate?.id ?? "");
  const [name, setName] = useState(firstTemplate?.name ?? "");
  const [subject, setSubject] = useState(firstTemplate?.subject ?? "");
  const [previewText, setPreviewText] = useState(firstTemplate?.preview_text ?? "");
  const [htmlContent, setHtmlContent] = useState(firstTemplate?.html_content ?? "");

  function loadTemplate(templateId: string) {
    setSelectedTemplateId(templateId);

    if (!templateId) {
      setName("");
      setSubject("");
      setPreviewText("");
      setHtmlContent("");
      return;
    }

    const template = templates.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    setName(template.name);
    setSubject(template.subject);
    setPreviewText(template.preview_text ?? "");
    setHtmlContent(template.html_content);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <form action={saveTemplateAction} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-4">
        <input type="hidden" name="template_id" value={selectedTemplateId} />

        <div className="grid gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Gespeicherte Vorlage laden</span>
            <select
              value={selectedTemplateId}
              onChange={(event) => loadTemplate(event.target.value)}
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">Neue Vorlage</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Frühlingskampagne"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Betreff</span>
            <input
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Dein Newsletter-Betreff"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Preview Text</span>
            <input
              name="preview_text"
              value={previewText}
              onChange={(event) => setPreviewText(event.target.value)}
              placeholder="Kurzer Vorschautext"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">HTML</span>
            <textarea
              name="html_content"
              value={htmlContent}
              onChange={(event) => setHtmlContent(event.target.value)}
              rows={18}
              placeholder="<table>...</table>"
              className="rounded-[24px] border border-[var(--line-strong)] bg-white/80 px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <button
            type="submit"
            style={{ color: "#ffffff" }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-92"
          >
            Vorlage speichern
          </button>
        </div>
      </form>

      <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-4">
        <div className="mb-3 text-sm font-medium">Live-Vorschau</div>
        <div className="min-h-[640px] overflow-hidden rounded-[20px] border border-[var(--line)] bg-white">
          <div dangerouslySetInnerHTML={{ __html: htmlContent || "<div style='padding:32px;color:#7b7b74;'>Noch kein HTML eingefügt.</div>" }} />
        </div>
      </div>
    </div>
  );
}
