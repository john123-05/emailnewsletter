export type IntegrationCheck = {
  name: string;
  configured: boolean;
  description: string;
  nextStep: string;
};

export function getIntegrationChecks(): IntegrationCheck[] {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  const makeSendConfigured = Boolean(process.env.MAKE_TEST_SEND_WEBHOOK_URL);
  const makeTemplateConfigured = Boolean(
    process.env.MAKE_TEMPLATE_WEBHOOK_URL,
  );

  const smtpConfigured = Boolean(
    process.env.IONOS_SMTP_HOST &&
      process.env.IONOS_SMTP_USER &&
      process.env.IONOS_SMTP_PASSWORD,
  );

  const adminSetupConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return [
    {
      name: "Supabase",
      configured: supabaseConfigured,
      description: "Datenbank, Storage, Kontakte, Kampagnen und Statuslogik.",
      nextStep: supabaseConfigured
        ? "Frontend kann jetzt gegen echte Projekt-Variablen verbunden werden."
        : "`.env.local` mit Supabase-URL und Anon-Key füllen.",
    },
    {
      name: "Make Testversand",
      configured: makeSendConfigured,
      description: "Webhook für Einzeltestsendungen und später geplante Versände.",
      nextStep: makeSendConfigured
        ? "Testformular ist bereit."
        : "`MAKE_TEST_SEND_WEBHOOK_URL` setzen.",
    },
    {
      name: "Make Template-Generator",
      configured: makeTemplateConfigured,
      description: "HTML- oder Content-Entwurf aus Stichpunkten, Hooks oder Themen.",
      nextStep: makeTemplateConfigured
        ? "Vorlagen-Generator kann Requests an Make senden."
        : "`MAKE_TEMPLATE_WEBHOOK_URL` setzen.",
    },
    {
      name: "IONOS SMTP",
      configured: smtpConfigured,
      description: "Eigentlicher Versandkanal hinter Make.com.",
      nextStep: smtpConfigured
        ? "SMTP-Zugang ist vorbereitet."
        : "SMTP-Zugang bevorzugt direkt in Make hinterlegen.",
    },
    {
      name: "Admin Setup",
      configured: adminSetupConfigured,
      description: "Einmaliges Erstellen des ersten Admin-Benutzers via Service Role.",
      nextStep: adminSetupConfigured
        ? "Erst-Setup ist serverseitig möglich."
        : "`SUPABASE_SERVICE_ROLE_KEY` in `.env.local` setzen.",
    },
  ];
}
