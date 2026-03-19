import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/env";
import {
  hasIdeaContent,
  normalizeNewsletterIdeaPayload,
  parseWebhookBody,
} from "@/lib/newsletter-ideas";

export const dynamic = "force-dynamic";

const webhookUrl =
  "https://hook.eu2.make.com/5k65ojyfan49ow5jfg2x95s8h18jtw2i";

export async function POST() {
  const { supabase, userId, userEmail } = await getOptionalUser();

  if (!userId) {
    return NextResponse.json(
      {
        ok: false,
        message: "Nicht autorisiert. Bitte zuerst anmelden.",
      },
      { status: 401 },
    );
  }

  const { data: run, error: createError } = await supabase
    .from("automation_runs")
    .insert({
      run_type: "newsletter_idea",
      status: "queued",
      input_payload: {
        trigger: "start",
        requested_by: userEmail,
      },
    })
    .select("id")
    .single();

  if (createError || !run) {
    return NextResponse.json(
      {
        ok: false,
        message: createError?.message ?? "Automation-Run konnte nicht angelegt werden.",
      },
      { status: 500 },
    );
  }

  const callbackUrl = `${getAppUrl()}/api/make/newsletter-idea/callback?run_id=${run.id}`;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "X-Briefwerk-Run-Id": run.id,
      "X-Briefwerk-Callback-Url": callbackUrl,
    },
    body: "start",
  });

  const responseText = await response.text();
  const parsedBody = parseWebhookBody(
    responseText,
    response.headers.get("content-type"),
  );
  const normalizedIdea = normalizeNewsletterIdeaPayload(parsedBody);
  const completed = response.ok && hasIdeaContent(normalizedIdea);

  await supabase
    .from("automation_runs")
    .update({
      status: response.ok ? (completed ? "completed" : "started") : "failed",
      output_payload: {
        ...normalizedIdea,
        callback_url: callbackUrl,
        response_status: response.status,
      },
      finished_at: completed || !response.ok ? new Date().toISOString() : null,
    })
    .eq("id", run.id);

  await supabase.from("webhook_logs").insert({
    source: "make-newsletter-idea-start",
    event_name: "newsletter_idea_start",
    status: response.ok ? "received" : "failed",
    payload: {
      run_id: run.id,
      callback_url: callbackUrl,
      response_status: response.status,
      body: parsedBody,
    },
    processed_at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: response.ok,
    message: response.ok
      ? completed
        ? "Idee empfangen und gespeichert."
        : "Webhook gestartet. Warte auf Make-Antwort oder Callback."
      : "Webhook für Newsletter-Idee hat nicht bestätigt.",
    runId: run.id,
    callbackUrl,
    response: responseText.slice(0, 3000),
  });
}
