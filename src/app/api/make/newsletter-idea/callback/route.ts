import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  hasIdeaContent,
  normalizeNewsletterIdeaPayload,
  parseWebhookBody,
} from "@/lib/newsletter-ideas";

export const dynamic = "force-dynamic";

function getRunId(request: Request, payload: unknown) {
  const url = new URL(request.url);
  const queryRunId = url.searchParams.get("run_id");

  if (queryRunId) {
    return queryRunId;
  }

  const headerRunId = request.headers.get("x-briefwerk-run-id");

  if (headerRunId) {
    return headerRunId;
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    const payloadRunId =
      record.run_id ?? record.runId ?? record.automation_run_id ?? null;

    return typeof payloadRunId === "string" ? payloadRunId : null;
  }

  return null;
}

export async function POST(request: Request) {
  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      {
        ok: false,
        message: "SUPABASE_SERVICE_ROLE_KEY fehlt.",
      },
      { status: 500 },
    );
  }

  const rawText = await request.text();
  const parsedBody = parseWebhookBody(rawText, request.headers.get("content-type"));
  const normalizedIdea = normalizeNewsletterIdeaPayload(parsedBody);
  const runId = getRunId(request, parsedBody);
  const finishedAt = new Date().toISOString();

  if (runId) {
    await admin
      .from("automation_runs")
      .update({
        status: hasIdeaContent(normalizedIdea) ? "completed" : "received",
        output_payload: normalizedIdea,
        finished_at: finishedAt,
      })
      .eq("id", runId);
  } else {
    await admin.from("automation_runs").insert({
      run_type: "newsletter_idea",
      status: hasIdeaContent(normalizedIdea) ? "completed" : "received",
      output_payload: normalizedIdea,
      finished_at: finishedAt,
    });
  }

  await admin.from("webhook_logs").insert({
    source: "make-newsletter-idea-callback",
    event_name: "newsletter_idea_callback",
    status: "received",
    payload: {
      run_id: runId,
      body: parsedBody,
    },
    processed_at: finishedAt,
  });

  return NextResponse.json({
    ok: true,
    message: "Newsletter-Idee gespeichert.",
    runId,
  });
}
