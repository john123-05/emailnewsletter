import { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type TemplateRecord = {
  id: string;
  name: string;
};

type CampaignBaseRecord = {
  id: string;
  name: string;
  status: string;
  scheduled_at: string | null;
  created_at: string | null;
  target_lists: unknown;
  template_id: string | null;
};

type WebhookLogRecord = {
  id: string;
  source: string;
  event_name: string | null;
  status: string;
  received_at: string | null;
};

type AutomationRunRecord = {
  id: string;
  status: string;
  output_payload: {
    title?: string | null;
    subject?: string | null;
    preview_text?: string | null;
    text?: string | null;
    html?: string | null;
    raw?: unknown;
  } | null;
  started_at: string | null;
  finished_at: string | null;
};

type ContactRecord = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  locale: string;
  status: string;
  source: string | null;
  notes: string | null;
  custom_fields: {
    attraktionstyp?: string | null;
    land?: string | null;
  } | null;
  consent_at: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  bounce_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CampaignSummary = CampaignBaseRecord & {
  template_name: string;
};

export type TemplateSummary = {
  id: string;
  name: string;
  subject: string;
  mode: string;
  updated_at: string | null;
  html_content: string;
  preview_text: string | null;
};

export type WorkspaceSummary = {
  workspace_name: string | null;
  default_from_name: string | null;
  default_from_email: string | null;
  sender_mode: string | null;
};

async function attachTemplateNames(
  supabase: ServerSupabaseClient,
  campaigns: CampaignBaseRecord[],
): Promise<CampaignSummary[]> {
  const templateIds = campaigns
    .map((campaign) => campaign.template_id)
    .filter((value): value is string => Boolean(value));

  if (templateIds.length === 0) {
    return campaigns.map((campaign) => ({
      ...campaign,
      template_name: "Keine Vorlage",
    }));
  }

  const { data: templates } = await supabase
    .from("templates")
    .select("id, name")
    .in("id", templateIds);

  const templateById = new Map(
    ((templates ?? []) as TemplateRecord[]).map((template) => [
      template.id,
      template.name,
    ]),
  );

  return campaigns.map((campaign) => ({
    ...campaign,
    template_name: campaign.template_id
      ? templateById.get(campaign.template_id) ?? "Keine Vorlage"
      : "Keine Vorlage",
  }));
}

export async function getDashboardData(supabase: ServerSupabaseClient) {
  const [
    activeContacts,
    pendingContacts,
    unsubscribedContacts,
    templateCount,
    recentCampaignsResult,
    recentWebhookLogs,
    latestIdeaRun,
  ] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "subscribed"),
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "unsubscribed"),
    supabase.from("templates").select("id", { count: "exact", head: true }),
    supabase
      .from("campaigns")
      .select("id, name, status, scheduled_at, created_at, target_lists, template_id")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("webhook_logs")
      .select("id, source, event_name, status, received_at")
      .order("received_at", { ascending: false })
      .limit(4),
    supabase
      .from("automation_runs")
      .select("id, status, output_payload, started_at, finished_at")
      .eq("run_type", "newsletter_idea")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const recentCampaigns = await attachTemplateNames(supabase, (recentCampaignsResult.data ?? []) as CampaignBaseRecord[]);

  return {
    stats: [
      {
        label: "Aktive Kontakte",
        value: String(activeContacts.count ?? 0),
        detail: "Kontakte mit Status `subscribed`",
      },
      {
        label: "Wartende Kontakte",
        value: String(pendingContacts.count ?? 0),
        detail: "Noch nicht freigegeben oder unbestätigt",
      },
      {
        label: "Abmeldungen",
        value: String(unsubscribedContacts.count ?? 0),
        detail: "Kontakte auf der Suppression-/Unsubscribe-Stufe",
      },
      {
        label: "Vorlagen",
        value: String(templateCount.count ?? 0),
        detail: "Aktive gespeicherte E-Mail-Templates",
      },
    ],
    recentCampaigns,
    webhookLogs: (recentWebhookLogs.data ?? []) as WebhookLogRecord[],
    latestIdea: (latestIdeaRun.data ?? null) as AutomationRunRecord | null,
  };
}

export async function getContactsData(supabase: ServerSupabaseClient) {
  const { data: contacts } = await supabase
    .from("contacts")
    .select(
      "id, email, first_name, last_name, company, locale, status, source, notes, custom_fields, consent_at, confirmed_at, unsubscribed_at, bounce_reason, created_at, updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return {
    contacts: (contacts ?? []) as ContactRecord[],
  };
}

export async function getCampaignsData(supabase: ServerSupabaseClient) {
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, name, status, scheduled_at, created_at, target_lists, template_id")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    campaigns: await attachTemplateNames(
      supabase,
      (campaigns ?? []) as CampaignBaseRecord[],
    ),
  };
}

export async function getTemplatesData(supabase: ServerSupabaseClient) {
  const { data: templates } = await supabase
    .from("templates")
    .select("id, name, subject, mode, updated_at, html_content, preview_text")
    .order("updated_at", { ascending: false })
    .limit(20);

  return {
    templates: (templates ?? []) as TemplateSummary[],
  };
}

export async function getSettingsData(supabase: ServerSupabaseClient) {
  const [{ data: workspace }, { count: contactCount }, { count: campaignCount }, { count: templateCount }] =
    await Promise.all([
      supabase
        .from("workspace_settings")
        .select("workspace_name, default_from_name, default_from_email, sender_mode")
        .limit(1)
        .maybeSingle(),
      supabase.from("contacts").select("id", { count: "exact", head: true }),
      supabase.from("campaigns").select("id", { count: "exact", head: true }),
      supabase.from("templates").select("id", { count: "exact", head: true }),
    ]);

  return {
    workspace: (workspace ?? null) as WorkspaceSummary | null,
    counts: {
      contacts: contactCount ?? 0,
      campaigns: campaignCount ?? 0,
      templates: templateCount ?? 0,
    },
  };
}
