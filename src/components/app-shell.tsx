import type { ReactNode } from "react";
import { signOutAction } from "@/app/actions/auth";
import { navigation } from "@/lib/navigation";
import { NavLink } from "@/components/nav-link";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  userEmail?: string | null;
  workspaceName?: string | null;
};

export function AppShell({
  title,
  subtitle,
  children,
  actions,
  userEmail,
  workspaceName,
}: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-4 text-[var(--foreground)] lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-[1440px] gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_18px_60px_rgba(48,33,15,0.08)] backdrop-blur">
          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
          </nav>

          <div className="mt-5 rounded-[22px] border border-[var(--line)] bg-[rgba(255,250,242,0.72)] p-4">
            <div className="truncate text-sm font-medium">
              {userEmail ?? workspaceName ?? "Nicht angemeldet"}
            </div>
            <div className="mt-4 flex gap-2">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(24,33,28,0.12)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[rgba(24,33,28,0.22)] hover:bg-white/70"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_60px_rgba(48,33,15,0.08)] backdrop-blur lg:p-6">
          <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-[rgba(24,33,28,0.62)]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </header>

          <div className="mt-5 space-y-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
