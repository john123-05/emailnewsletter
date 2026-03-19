import { createClient } from "@supabase/supabase-js";
import { getOptionalServiceRoleKey, getSupabaseUrl } from "@/lib/env";

export function createAdminClient() {
  const serviceRoleKey = getOptionalServiceRoleKey();

  if (!serviceRoleKey) {
    return null;
  }

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
