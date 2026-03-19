function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Umgebungsvariable ${name} fehlt.`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function getOptionalServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
