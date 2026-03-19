type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getNestedRecord(value: unknown, key: string) {
  if (!isRecord(value)) {
    return null;
  }

  const nested = value[key];
  return isRecord(nested) ? nested : null;
}

function findString(value: unknown, keys: string[]): string | null {
  if (!isRecord(value)) {
    return null;
  }

  for (const key of keys) {
    const match = getString(value[key]);

    if (match) {
      return match;
    }
  }

  for (const key of ["payload", "data", "result", "idea"]) {
    const nested = getNestedRecord(value, key);

    if (!nested) {
      continue;
    }

    const nestedMatch: string | null = findString(nested, keys);

    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

export function parseWebhookBody(rawText: string, contentType?: string | null) {
  const trimmed = rawText.trim();

  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(trimmed || "{}") as unknown;
    } catch {
      return { raw_text: rawText };
    }
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return { raw_text: rawText };
    }
  }

  return { raw_text: rawText };
}

export function normalizeNewsletterIdeaPayload(payload: unknown) {
  const title = findString(payload, ["title", "headline", "name"]);
  const subject = findString(payload, ["subject", "betreff"]);
  const previewText = findString(payload, ["preview_text", "previewText"]);
  const html = findString(payload, ["html", "html_content", "content_html"]);
  const text = findString(payload, ["text", "content", "idea", "beschreibung"]);

  return {
    title,
    subject,
    preview_text: previewText,
    html,
    text,
    raw: payload,
  };
}

export function hasIdeaContent(payload: ReturnType<typeof normalizeNewsletterIdeaPayload>) {
  return Boolean(payload.title || payload.subject || payload.html || payload.text);
}
