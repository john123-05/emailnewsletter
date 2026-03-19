import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { getHasUsers, redirectIfAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated("/dashboard");

  const hasUsers = await getHasUsers();

  if (!hasUsers) {
    redirect("/setup");
  }

  const params = await searchParams;
  const message = params.message;
  const status = params.status ?? "info";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(154,95,63,0.16),transparent_30%),linear-gradient(180deg,#f7f2e9_0%,#f1e6d8_100%)] px-5 py-8 text-[var(--foreground)]">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(145deg,#21443b,#9a5f3f)] p-7 text-[#fff7ee] shadow-[0_24px_80px_rgba(48,33,15,0.12)]">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#f3e1cb]/80">
            Briefwerk
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em]">
            Deutscher Newsletter-
            <br />
            Leitstand für dein Team
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#fff2e6]/86">
            Melde dich an, um Kontakte, Kampagnen, Vorlagen und Make-Automationen
            zentral in Supabase zu steuern.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "Kontakte, Listen, Status und Suppression direkt in Supabase",
              "Testversand und HTML-Entwürfe über Make.com",
              "IONOS SMTP als Versandkanal im Hintergrund",
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

        <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(255,251,244,0.9)] p-7 shadow-[0_24px_80px_rgba(48,33,15,0.08)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[rgba(24,33,28,0.45)]">
            Anmeldung
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
            Willkommen zurück
          </h2>
          <p className="mt-3 text-sm leading-7 text-[rgba(24,33,28,0.68)]">
            Verwende den ersten Admin-Benutzer, den du im Setup oder später in
            Supabase angelegt hast.
          </p>

          {message ? (
            <div
              className={[
                "mt-6 rounded-[24px] border px-4 py-3 text-sm leading-6",
                status === "error"
                  ? "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.1)] text-[var(--danger)]"
                  : status === "success"
                    ? "border-[rgba(45,107,87,0.18)] bg-[rgba(45,107,87,0.1)] text-[var(--success)]"
                    : "border-[rgba(154,95,63,0.18)] bg-[rgba(154,95,63,0.1)] text-[var(--accent)]",
              ].join(" ")}
            >
              {message}
            </div>
          ) : null}

          <form action={signInAction} className="mt-7 grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">E-Mail</span>
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
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92"
            >
              Anmelden
            </button>
          </form>

          <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm leading-6 text-[rgba(24,33,28,0.72)]">
            Noch kein Benutzer vorhanden?
            <br />
            <Link href="/setup" className="font-semibold text-[var(--accent)]">
              Dann starte hier das Erst-Setup.
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
