"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  templateId?: string,
) {
  const baseSlug = slugify(name) || "vorlage";
  let slug = baseSlug;
  let attempt = 1;

  while (true) {
    const query = supabase
      .from("templates")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    const { data } = templateId
      ? await query.neq("id", templateId)
      : await query;

    if (!data || data.length === 0) {
      return slug;
    }

    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }
}

export async function saveTemplateAction(formData: FormData) {
  const templateId = getTextValue(formData, "template_id");
  const name = getTextValue(formData, "name");
  const subject = getTextValue(formData, "subject");
  const previewText = getTextValue(formData, "preview_text");
  const html = getTextValue(formData, "html_content");

  if (!name || !subject || !html) {
    redirectWithMessage(
      "/vorlagen",
      "error",
      "Bitte Name, Betreff und HTML ausfüllen.",
    );
  }

  const { supabase, userId } = await getOptionalUser();

  if (!userId) {
    redirect("/login");
  }

  const slug = await buildUniqueSlug(supabase, name, templateId || undefined);

  if (templateId) {
    const { error } = await supabase
      .from("templates")
      .update({
        name,
        slug,
        subject,
        preview_text: previewText || null,
        html_content: html,
        mode: "manual",
        updated_by: userId,
      })
      .eq("id", templateId);

    if (error) {
      redirectWithMessage("/vorlagen", "error", error.message);
    }
  } else {
    const { data: inserted, error } = await supabase
      .from("templates")
      .insert({
        name,
        slug,
        subject,
        preview_text: previewText || null,
        html_content: html,
        mode: "manual",
        created_by: userId,
        updated_by: userId,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      redirectWithMessage(
        "/vorlagen",
        "error",
        error?.message ?? "Vorlage konnte nicht gespeichert werden.",
      );
    }
  }

  revalidatePath("/vorlagen");
  revalidatePath("/kampagnen");
  redirectWithMessage("/vorlagen", "success", "Vorlage wurde gespeichert.");
}
