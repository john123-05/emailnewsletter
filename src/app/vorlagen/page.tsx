import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { TemplateEditor } from "@/components/template-editor";
import { TemplateDraftForm } from "@/components/template-draft-form";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getTemplatesData } from "@/lib/data";
import { formatDateTime, formatTemplateMode } from "@/lib/format";

export const dynamic = "force-dynamic";

type VorlagenPageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function VorlagenPage({ searchParams }: VorlagenPageProps) {
  const { supabase, userEmail, workspaceName } = await requireAuthenticatedUser();
  const [{ templates }, params] = await Promise.all([
    getTemplatesData(supabase),
    searchParams,
  ]);
  const message = params.message;
  const status = params.status ?? "info";

  return (
    <AppShell
      title="Vorlagen"
      userEmail={userEmail}
      workspaceName={workspaceName}
    >
      {message ? (
        <div
          className={[
            "rounded-[22px] border px-4 py-3 text-sm leading-6",
            status === "error"
              ? "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.1)] text-[var(--danger)]"
              : "border-[rgba(45,107,87,0.18)] bg-[rgba(45,107,87,0.1)] text-[var(--success)]",
          ].join(" ")}
        >
          {message}
        </div>
      ) : null}

      <SectionCard title="Editor">
        <TemplateEditor templates={templates} />
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title="Gespeicherte Vorlagen">
          {templates.length === 0 ? (
            <EmptyState
              title="Noch keine Vorlage"
              description="Lege eine Vorlage an oder übernimm HTML aus Make."
            />
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-base font-semibold">{template.name}</h3>
                      <p className="mt-1 text-sm text-[rgba(24,33,28,0.68)]">
                        {template.subject}
                      </p>
                    </div>
                    <StatusPill tone="info">
                      {formatTemplateMode(template.mode)}
                    </StatusPill>
                  </div>
                  <div className="mt-3 text-sm text-[rgba(24,33,28,0.6)]">
                    Zuletzt bearbeitet: {formatDateTime(template.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="HTML von Make">
          <TemplateDraftForm />
        </SectionCard>
      </div>
    </AppShell>
  );
}
