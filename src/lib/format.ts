const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const contactStatusMap: Record<string, string> = {
  pending: "wartend",
  subscribed: "aktiv",
  unsubscribed: "abgemeldet",
  bounced: "gebounced",
  suppressed: "gesperrt",
};

const campaignStatusMap: Record<string, string> = {
  draft: "entwurf",
  scheduled: "geplant",
  queued: "in queue",
  sending: "versendet gerade",
  sent: "gesendet",
  paused: "pausiert",
  failed: "fehlgeschlagen",
  cancelled: "abgebrochen",
};

const templateModeMap: Record<string, string> = {
  manual: "manuell",
  hybrid: "hybrid",
  make_generated: "make-generiert",
};

export function formatDate(value?: string | null) {
  if (!value) {
    return "Noch offen";
  }

  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Noch offen";
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatContactStatus(status?: string | null) {
  if (!status) {
    return "unbekannt";
  }

  return contactStatusMap[status] ?? status;
}

export function formatCampaignStatus(status?: string | null) {
  if (!status) {
    return "unbekannt";
  }

  return campaignStatusMap[status] ?? status;
}

export function formatTemplateMode(mode?: string | null) {
  if (!mode) {
    return "unbekannt";
  }

  return templateModeMap[mode] ?? mode;
}

export function formatContactName(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName;
  }

  return email ?? "Unbekannter Kontakt";
}

export function formatListTargets(targetLists?: unknown) {
  if (Array.isArray(targetLists) && targetLists.length > 0) {
    return targetLists.join(", ");
  }

  return "Noch nicht definiert";
}
