import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function normalizePayload(payload: FormData | Record<string, unknown>) {
  if (payload instanceof FormData) {
    return Object.fromEntries(payload.entries());
  }

  return payload;
}

export async function POST(request: Request) {
  const { userId, userEmail } = await getOptionalUser();

  if (!userId) {
    return NextResponse.json(
      {
        ok: false,
        message: "Nicht autorisiert. Bitte zuerst anmelden.",
      },
      { status: 401 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  const payload = contentType.includes("application/json")
    ? normalizePayload((await request.json()) as Record<string, unknown>)
    : normalizePayload(await request.formData());

  const webhookUrl = process.env.MAKE_TEMPLATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "MAKE_TEMPLATE_WEBHOOK_URL fehlt. Bitte zuerst in `.env.local` setzen.",
      },
      { status: 400 },
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "briefwerk-admin",
      type: "template_draft",
      createdAt: new Date().toISOString(),
      requestedBy: userEmail,
      payload,
    }),
  });

  const responseText = await response.text();

  return NextResponse.json({
    ok: response.ok,
    message: response.ok
      ? "Template-Briefing wurde an Make.com übergeben."
      : "Make.com hat den Template-Request nicht bestätigt.",
    response: responseText.slice(0, 3000),
  });
}
