import { redirect } from "next/navigation";
import { createInitialAdminAction } from "@/app/actions/auth";
import { getHasUsers, getOptionalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SetupPageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const [{ userId }, hasUsers, params] = await Promise.all([
    getOptionalUser(),
    getHasUsers(),
    searchParams,
  ]);

  if (hasUsers && userId) {
    redirect("/dashboard");
  }

  if (hasUsers && !userId) {
    redirect("/login");
  }

  const message = params.message;
  const status = params.status ?? "info";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(33,68,59,0.18),transparent_30%),linear-gradient(180deg,#f7f2e9_0%,#f1e6d8_100%)] px-5 py-8 text-[var(--foreground)]">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(255,251,244,0.9)] p-7 shadow-[0_24px_80px_rgba(48,33,15,0.08)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[rgba(24,33,28,0.45)]">
            Erst-Setup
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
            Ersten Admin-Benutzer anlegen
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgba(24,33,28,0.68)]">
            Dieser Schritt ist nur beim allerersten Start nötig. Danach wird die
            Setup-Seite automatisch geschlossen und nur noch die Anmeldung
            angezeigt.
          </p>

          {message ? (
            <div
              className={[
                "mt-6 rounded-[24px] border px-4 py-3 text-sm leading-6",
                status === "error"
                  ? "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.1)] text-[var(--danger)]"
                  : "border-[rgba(154,95,63,0.18)] bg-[rgba(154,95,63,0.1)] text-[var(--accent)]",
              ].join(" ")}
            >
              {message}
            </div>
          ) : null}

          <form action={createInitialAdminAction} className="mt-7 grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Name</span>
              <input
                name="full_name"
                type="text"
                required
                placeholder="Max Mustermann"
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Admin-E-Mail</span>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@deinedomain.de"
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Passwort</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92"
            >
              Admin anlegen und anmelden
            </button>
          </form>
        </section>

        <section className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(145deg,#21443b,#9a5f3f)] p-7 text-[#fff7ee] shadow-[0_24px_80px_rgba(48,33,15,0.12)]">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#f3e1cb]/80">
            Was danach bereit ist
          </div>
          <div className="mt-6 grid gap-4">
            {[
              "Geschützte Admin-Routen mit Supabase-Login",
              "Echte Datenabfragen für Kontakte, Kampagnen und Vorlagen",
              "Vorbereitete Make-Webhooks für Testversand und HTML-Entwurf",
              "Live-Datenbank in deinem verknüpften Supabase-Projekt",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-6 text-[#fff2e6]/86"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
