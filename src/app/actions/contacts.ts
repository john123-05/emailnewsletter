"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithMessage(
  path: string,
  status: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    status,
    message,
  });

  redirect(`${path}?${params.toString()}`);
}

export async function createContactAction(formData: FormData) {
  const name = getTextValue(formData, "name");
  const email = getTextValue(formData, "email").toLowerCase();
  const company = getTextValue(formData, "company");
  const attractionType = getTextValue(formData, "attraktionstyp");
  const locale = getTextValue(formData, "sprache") || "de";
  const country = getTextValue(formData, "land");
  const status = getTextValue(formData, "status") || "subscribed";

  const [firstName, ...lastNameParts] = name.split(/\s+/).filter(Boolean);
  const lastName = lastNameParts.join(" ");

  if (!email) {
    redirectWithMessage("/kontakte", "error", "Bitte eine E-Mail-Adresse eingeben.");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contacts").insert({
    email,
    first_name: firstName || null,
    last_name: lastName || null,
    company: company || null,
    locale,
    status,
    source: "manuell",
    custom_fields: {
      attraktionstyp: attractionType || null,
      land: country || null,
    },
    consent_at: status === "subscribed" ? new Date().toISOString() : null,
  });

  if (error) {
    redirectWithMessage(
      "/kontakte",
      "error",
      error.message === 'duplicate key value violates unique constraint "contacts_email_key"'
        ? "Diese E-Mail-Adresse existiert bereits."
        : error.message,
    );
  }

  revalidatePath("/kontakte");
  revalidatePath("/dashboard");
  redirectWithMessage("/kontakte", "success", "Kontakt wurde angelegt.");
}

export async function updateContactStatusAction(formData: FormData) {
  const contactId = getTextValue(formData, "contact_id");
  const status = getTextValue(formData, "status");

  if (!contactId || !status) {
    redirectWithMessage("/kontakte", "error", "Status konnte nicht aktualisiert werden.");
  }

  const supabase = await createClient();
  const timestamp = new Date().toISOString();

  const { error } = await supabase
    .from("contacts")
    .update({
      status,
      consent_at: status === "subscribed" ? timestamp : null,
      unsubscribed_at:
        status === "unsubscribed" || status === "suppressed" ? timestamp : null,
    })
    .eq("id", contactId);

  if (error) {
    redirectWithMessage("/kontakte", "error", error.message);
  }

  revalidatePath("/kontakte");
  revalidatePath("/dashboard");
}
