export const dashboardStats = [
  {
    label: "Aktive Kontakte",
    value: "184",
    detail: "12 neue Kontakte in den letzten 30 Tagen",
  },
  {
    label: "Öffnungsrate",
    value: "54,8 %",
    detail: "Basis: letzte 4 Kampagnen",
  },
  {
    label: "Klickraten",
    value: "18,2 %",
    detail: "Vor allem Produkt- und Terminlinks",
  },
  {
    label: "Abmeldungen",
    value: "3",
    detail: "Saubere Suppression-Liste aktiv",
  },
] as const;

export const contacts = [
  {
    name: "Anna Weber",
    email: "anna@beispiel.de",
    list: "Bestandskunden",
    status: "aktiv",
    source: "CSV-Import März",
    consent: "12.02.2026",
  },
  {
    name: "Lukas Hoffmann",
    email: "lukas@atelier-hoffmann.de",
    list: "Interessenten",
    status: "wartend",
    source: "Landingpage",
    consent: "05.03.2026",
  },
  {
    name: "Miriam Schuster",
    email: "miriam@schuster-design.de",
    list: "Presse",
    status: "abgemeldet",
    source: "Import Altbestand",
    consent: "11.11.2025",
  },
  {
    name: "Jonas Klein",
    email: "jonas@klein-coaching.de",
    list: "Webinar",
    status: "aktiv",
    source: "Formular",
    consent: "17.03.2026",
  },
] as const;

export const lists = [
  {
    name: "Bestandskunden",
    contacts: 86,
    note: "Hohe Conversion, eher kurze Updates",
  },
  {
    name: "Interessenten",
    contacts: 59,
    note: "Mehr Erklärung, mehr Cases und Vertrauen",
  },
  {
    name: "Webinar",
    contacts: 23,
    note: "Ideal für Event-Reminder und Follow-up",
  },
] as const;

export const campaigns = [
  {
    name: "Frühlingskampagne 2026",
    status: "geplant",
    audience: "Bestandskunden + Interessenten",
    schedule: "20.03.2026, 10:00 Uhr",
    template: "Editorial Produktupdate",
  },
  {
    name: "Webinar Follow-up",
    status: "entwurf",
    audience: "Webinar",
    schedule: "Noch offen",
    template: "Kompakter Reminder",
  },
  {
    name: "Monatsupdate Februar",
    status: "gesendet",
    audience: "Alle aktiven Kontakte",
    schedule: "28.02.2026, 09:30 Uhr",
    template: "Monatsbrief",
  },
] as const;

export const templates = [
  {
    name: "Editorial Produktupdate",
    subject: "Neuigkeiten, Termine und ein Blick hinter die Kulissen",
    mode: "hybrid",
    updatedAt: "Heute, 08:40 Uhr",
  },
  {
    name: "Monatsbrief",
    subject: "Das Wichtigste des Monats in 3 Minuten",
    mode: "manuell",
    updatedAt: "Gestern, 16:10 Uhr",
  },
  {
    name: "Kompakter Reminder",
    subject: "Dein Platz ist fast reserviert",
    mode: "make-generiert",
    updatedAt: "18.03.2026, 07:55 Uhr",
  },
] as const;

export const activityFeed = [
  "CSV-Import mit 28 Datensätzen abgeschlossen",
  "Testversand an info@deinedomain.de erfolgreich an Make übergeben",
  "Template 'Editorial Produktupdate' manuell angepasst",
  "Webhook-Antwort für Kampagne 'Monatsupdate Februar' empfangen",
] as const;

export const automationChecklist = [
  "HTML-Entwurf per Make aus Stichpunkten erzeugen",
  "Testversand an interne Mailadresse senden",
  "Geplanten Versand über SMTP anstoßen",
  "Versandstatus in Supabase zurückschreiben",
] as const;

export const previewHtml = `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f6efe5; padding: 32px;">
    <div style="max-width: 620px; margin: 0 auto; background: #fffaf2; border-radius: 28px; overflow: hidden; border: 1px solid #eadbc8;">
      <div style="padding: 40px; background: linear-gradient(135deg, #21443b, #9a5f3f); color: #fff8ee;">
        <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Briefwerk Studio</p>
        <h1 style="margin: 0; font-size: 32px; line-height: 1.1;">Frische Ideen für deinen nächsten Newsletter</h1>
      </div>
      <div style="padding: 32px 40px; color: #1a1d18;">
        <p style="margin-top: 0; font-size: 16px; line-height: 1.7;">
          Diese Vorschau zeigt, wie eine Mischung aus Bild, Teaser, CTA und redaktionellem Block aussehen kann.
        </p>
        <div style="padding: 18px; border-radius: 18px; background: #f2e7d7; margin: 24px 0;">
          <strong>Highlight der Woche:</strong> Neues Produktshooting, neue Landingpage und frische Termine.
        </div>
        <a href="#" style="display: inline-block; padding: 14px 22px; border-radius: 999px; background: #21443b; color: #fff; text-decoration: none;">
          Jetzt ansehen
        </a>
      </div>
    </div>
  </div>
`;
