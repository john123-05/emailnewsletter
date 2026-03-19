import { createContactAction } from "@/app/actions/contacts";
import { AppShell } from "@/components/app-shell";
import { ContactStatusSelect } from "@/components/contact-status-select";
import { ContactUploadPanel } from "@/components/contact-upload-panel";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getContactsData } from "@/lib/data";

export const dynamic = "force-dynamic";

type KontaktePageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function KontaktePage({ searchParams }: KontaktePageProps) {
  const { supabase, userEmail, workspaceName } = await requireAuthenticatedUser();
  const [{ contacts }, params] = await Promise.all([
    getContactsData(supabase),
    searchParams,
  ]);
  const message = params.message;
  const status = params.status ?? "info";

  return (
    <AppShell
      title="Kontakte"
      userEmail={userEmail}
      workspaceName={workspaceName}
    >
      {message ? (
        <div
          className={[
            "rounded-[22px] border px-4 py-3 text-sm leading-6",
            status === "error"
              ? "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.1)] text-[var(--danger)]"
              : "border-[rgba(45,107,87,0.18)] bg-[rgba(45,107,87,0.1)] text-[var(--success)]",
          ].join(" ")}
        >
          {message}
        </div>
      ) : null}

      <SectionCard title="Kontaktliste">
        {contacts.length === 0 ? (
          <EmptyState
            title="Noch keine Kontakte"
            description="Importiere eine Liste und starte danach die erste Kampagne."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-[rgba(24,33,28,0.45)]">
                  <th className="pb-1">E-Mail</th>
                  <th className="pb-1">Name</th>
                  <th className="pb-1">Firma</th>
                  <th className="pb-1">Attraktionstyp</th>
                  <th className="pb-1">Sprache</th>
                  <th className="pb-1">Land</th>
                  <th className="pb-1">Angemeldet</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="align-top">
                    <td className="rounded-l-[22px] border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4">
                      <div className="text-sm text-[rgba(24,33,28,0.72)]">
                        {contact.email}
                      </div>
                    </td>
                    <td className="border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm text-[rgba(24,33,28,0.72)]">
                      {[contact.first_name, contact.last_name]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </td>
                    <td className="border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm text-[rgba(24,33,28,0.72)]">
                      {contact.company ?? "—"}
                    </td>
                    <td className="border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4">
                      <div className="text-sm text-[rgba(24,33,28,0.72)]">
                        {contact.custom_fields?.attraktionstyp ?? "—"}
                      </div>
                    </td>
                    <td className="border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm text-[rgba(24,33,28,0.72)]">
                      {contact.locale}
                    </td>
                    <td className="border border-r-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm text-[rgba(24,33,28,0.72)]">
                      {contact.custom_fields?.land ?? "—"}
                    </td>
                    <td className="rounded-r-[22px] border border-l-0 border-[var(--line)] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm text-[rgba(24,33,28,0.72)]">
                      <ContactStatusSelect
                        contactId={contact.id}
                        currentStatus={contact.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Import">
          <ContactUploadPanel />
        </SectionCard>

        <SectionCard title="Kontakt hinzufügen">
          <form action={createContactAction} className="grid gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="E-Mail"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
            <input
              name="company"
              type="text"
              placeholder="Firma"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
            <input
              name="attraktionstyp"
              type="text"
              placeholder="Attraktionstyp"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="sprache"
                type="text"
                defaultValue="de"
                placeholder="Sprache"
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
              <input
                name="land"
                type="text"
                placeholder="Land"
                className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </div>
            <select
              name="status"
              defaultValue="subscribed"
              className="rounded-2xl border border-[var(--line-strong)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            >
              <option value="subscribed">angemeldet</option>
              <option value="pending">wartend</option>
              <option value="unsubscribed">abgemeldet</option>
              <option value="suppressed">gesperrt</option>
            </select>
            <button
              type="submit"
              className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:opacity-92"
            >
              Kontakt anlegen
            </button>
          </form>
        </SectionCard>
      </div>
    </AppShell>
  );
}
