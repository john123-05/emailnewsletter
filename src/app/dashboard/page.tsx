import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { NewsletterIdeaButton } from "@/components/newsletter-idea-button";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCampaignStatus, formatDateTime, formatListTargets } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, userEmail, workspaceName } = await requireAuthenticatedUser();
  const { stats, recentCampaigns, latestIdea } = await getDashboardData(supabase);

  return (
    <AppShell
      title="Start"
      userEmail={userEmail}
      workspaceName={workspaceName}
      actions={
        <>
          <NewsletterIdeaButton />
          <Link
            href="/kampagnen"
            style={{ color: "#ffffff" }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-92"
          >
            Neue Kampagne
          </Link>
          <Link
            href="/kontakte"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]"
          >
            Kontakte
          </Link>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <SectionCard title="Letzte Newsletter-Idee">
        {latestIdea ? (
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.56)] p-4">
              <div className="text-sm font-semibold">
                {latestIdea.output_payload?.title ?? "Ohne Titel"}
              </div>
              <div className="mt-2 text-sm text-[rgba(24,33,28,0.72)]">
                {latestIdea.output_payload?.subject ?? "Ohne Betreff"}
              </div>
              <div className="mt-4 text-sm leading-6 text-[rgba(24,33,28,0.68)] whitespace-pre-wrap">
                {latestIdea.output_payload?.text ?? "Noch kein Text zurückgegeben."}
              </div>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-white">
              {latestIdea.output_payload?.html ? (
                <div dangerouslySetInnerHTML={{ __html: latestIdea.output_payload.html }} />
              ) : (
                <div className="p-6 text-sm text-[rgba(24,33,28,0.62)]">
                  Noch keine HTML-Vorschau vorhanden.
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Noch keine Idee gespeichert"
            description="Starte oben die Ideen-Generierung. Antworten von Make werden automatisch gespeichert."
          />
        )}
      </SectionCard>

      <SectionCard title="Letzte Kampagnen">
        {recentCampaigns.length === 0 ? (
          <EmptyState
            title="Noch keine Kampagne"
            description="Lege zuerst Kontakte und dann eine Kampagne an."
            action={
              <Link
                href="/kampagnen"
                style={{ color: "#ffffff" }}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold !text-white"
              >
                Kampagne erstellen
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.56)] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-[rgba(24,33,28,0.68)]">
                      {campaign.template_name}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      campaign.status === "sent"
                        ? "success"
                        : campaign.status === "scheduled"
                          ? "warning"
                          : "info"
                    }
                  >
                    {formatCampaignStatus(campaign.status)}
                  </StatusPill>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-[rgba(24,33,28,0.68)] lg:grid-cols-2">
                  <div>{formatListTargets(campaign.target_lists)}</div>
                  <div>{formatDateTime(campaign.scheduled_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4">
        <SectionCard title="Schnellzugriff">
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/kontakte"
              className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.56)] px-4 py-5 text-sm font-semibold transition hover:border-[var(--foreground)]"
            >
              Kontakte
            </Link>
            <Link
              href="/kampagnen"
              className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.56)] px-4 py-5 text-sm font-semibold transition hover:border-[var(--foreground)]"
            >
              Kampagnen
            </Link>
            <Link
              href="/vorlagen"
              className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.56)] px-4 py-5 text-sm font-semibold transition hover:border-[var(--foreground)]"
            >
              Vorlagen
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
