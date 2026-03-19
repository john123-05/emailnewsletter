import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

const publicRoutes = new Set(["/", "/login", "/setup"]);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.has(pathname);

  if (!userId && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("message", "Bitte melde dich an, um den Admin-Bereich zu öffnen.");
    url.searchParams.set("status", "info");
    return NextResponse.redirect(url);
  }

  if (userId && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("message");
    url.searchParams.delete("status");
    return NextResponse.redirect(url);
  }

  return response;
}
