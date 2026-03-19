import { AppShell } from "@/components/app-shell";
import { CampaignStudio } from "@/components/campaign-studio";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getCampaignsData, getTemplatesData } from "@/lib/data";
import { formatCampaignStatus, formatDateTime, formatListTargets } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function KampagnenPage() {
  const { supabase, userEmail, workspaceName } = await requireAuthenticatedUser();
  const [{ campaigns }, { templates }] = await Promise.all([
    getCampaignsData(supabase),
    getTemplatesData(supabase),
  ]);

  return (
    <AppShell
      title="Kampagnen"
      userEmail={userEmail}
      workspaceName={workspaceName}
    >
      <CampaignStudio templates={templates} />

      <SectionCard title="Vorhandene Kampagnen">
        {campaigns.length === 0 ? (
          <EmptyState
            title="Noch keine Kampagne"
            description="Sobald du eine Kampagne speicherst oder startest, erscheint sie hier."
          />
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-base font-semibold">{campaign.name}</div>
                    <div className="mt-1 text-sm text-[rgba(24,33,28,0.68)]">
                      {campaign.template_name}
                    </div>
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
    </AppShell>
  );
}
