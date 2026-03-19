"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithMessage(
  path: string,
  status: "error" | "success" | "info",
  message: string,
): never {
  const params = new URLSearchParams({
    status,
    message,
  });

  redirect(`${path}?${params.toString()}`);
}

export async function signInAction(formData: FormData) {
  const email = getTextValue(formData, "email");
  const password = getTextValue(formData, "password");

  if (!email || !password) {
    redirectWithMessage("/login", "error", "Bitte E-Mail und Passwort ausfüllen.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage("/login", "error", error.message);
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirectWithMessage("/login", "success", "Du wurdest erfolgreich abgemeldet.");
}

export async function createInitialAdminAction(formData: FormData) {
  const fullName = getTextValue(formData, "full_name");
  const email = getTextValue(formData, "email");
  const password = getTextValue(formData, "password");

  if (!fullName || !email || !password) {
    redirectWithMessage(
      "/setup",
      "error",
      "Bitte Name, E-Mail und Passwort vollständig ausfüllen.",
    );
  }

  if (password.length < 8) {
    redirectWithMessage(
      "/setup",
      "error",
      "Das Passwort sollte mindestens 8 Zeichen lang sein.",
    );
  }

  const admin = createAdminClient();

  if (!admin) {
    redirectWithMessage(
      "/setup",
      "error",
      "SUPABASE_SERVICE_ROLE_KEY fehlt für das Erst-Setup.",
    );
  }

  const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (listError) {
    redirectWithMessage("/setup", "error", listError.message);
  }

  if ((existingUsers.users.length ?? 0) > 0) {
    redirectWithMessage(
      "/login",
      "info",
      "Es existiert bereits ein Benutzer. Bitte melde dich an.",
    );
  }

  const { data: createdUser, error: createError } = await admin.auth.admin.createUser(
    {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    },
  );

  if (createError || !createdUser.user) {
    redirectWithMessage(
      "/setup",
      "error",
      createError?.message ?? "Der Admin-Benutzer konnte nicht erstellt werden.",
    );
  }

  await admin.from("profiles").upsert(
    {
      id: createdUser.user.id,
      full_name: fullName,
      role: "admin",
    },
    {
      onConflict: "id",
    },
  );

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    redirectWithMessage(
      "/login",
      "success",
      "Admin wurde erstellt. Bitte melde dich jetzt an.",
    );
  }

  redirect("/dashboard");
}
