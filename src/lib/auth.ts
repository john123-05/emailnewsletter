import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type WorkspaceSettingsRecord = {
  id: string;
  workspace_name: string | null;
  default_from_name: string | null;
  default_from_email: string | null;
  sender_mode: string | null;
};

async function ensureProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userEmail: string | null,
) {
  await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: userEmail ? userEmail.split("@")[0] : null,
      role: "admin",
    },
    {
      onConflict: "id",
    },
  );
}

async function ensureWorkspaceBootstrap(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  let { data: workspace } = await supabase
    .from("workspace_settings")
    .select("id, workspace_name, default_from_name, default_from_email, sender_mode")
    .limit(1)
    .maybeSingle<WorkspaceSettingsRecord>();

  if (!workspace) {
    const { data: inserted } = await supabase
      .from("workspace_settings")
      .insert({
        workspace_name: "Briefwerk Admin",
        default_locale: "de",
        sender_mode: "make_smtp",
      })
      .select("id, workspace_name, default_from_name, default_from_email, sender_mode")
      .single<WorkspaceSettingsRecord>();

    workspace = inserted ?? null;
  }

  const { count: listCount } = await supabase
    .from("lists")
    .select("id", { count: "exact", head: true });

  if (!listCount) {
    await supabase.from("lists").upsert(
      [
        {
          name: "Bestandskunden",
          description: "Bestehende Kundschaft für Updates und Launches",
          color: "#22453c",
          is_default: true,
        },
        {
          name: "Interessenten",
          description: "Leads aus Formularen und Landingpages",
          color: "#9a5f3f",
          is_default: false,
        },
        {
          name: "Webinar",
          description: "Teilnehmer und Reminder-Liste",
          color: "#aa6a1f",
          is_default: false,
        },
      ],
      {
        onConflict: "name",
        ignoreDuplicates: true,
      },
    );
  }

  return workspace;
}

export async function getOptionalUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  return {
    supabase,
    userId: typeof claims?.sub === "string" ? claims.sub : null,
    userEmail: typeof claims?.email === "string" ? claims.email : null,
  };
}

export async function requireAuthenticatedUser() {
  const { supabase, userId, userEmail } = await getOptionalUser();

  if (!userId) {
    redirect("/login");
  }

  await ensureProfile(supabase, userId, userEmail);
  const workspace = await ensureWorkspaceBootstrap(supabase);

  return {
    supabase,
    userId,
    userEmail,
    workspaceName: workspace?.workspace_name ?? "Briefwerk Admin",
  };
}

export async function redirectIfAuthenticated(target = "/dashboard") {
  const { userId } = await getOptionalUser();

  if (userId) {
    redirect(target);
  }
}

export async function getHasUsers() {
  const admin = createAdminClient();

  if (!admin) {
    return false;
  }

  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (error) {
    return false;
  }

  return (data.users.length ?? 0) > 0;
}
