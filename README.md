# Briefwerk Admin

Interne Newsletter-Oberfläche für Kontakte, Kampagnen, Vorlagen, Versandstatus und Automationen.

Architektur für dieses Projekt:
- `Next.js` als deutsches Admin-Frontend
- `Supabase` als Datenbank, Storage und Auth-Basis
- `Make.com` als Automations-Layer für HTML-Generierung, Testversand und Massenversand
- `IONOS SMTP` hinter Make.com für den tatsächlichen Versand

## Was schon vorbereitet ist

- Deutsche Admin-Oberfläche mit Bereichen für `Übersicht`, `Kontakte`, `Kampagnen`, `Vorlagen` und `Einstellungen`
- Lokale Supabase-Migration für Kontakte, Listen, Tags, Templates, Kampagnen, Versand-Events und Suppression
- Make-Webhooks für `Testversand` und `Template-Entwurf`
- `.env.example` mit allen benötigten Variablen

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Danach ist die App unter `http://localhost:3000` erreichbar.

## Supabase in Cursor verbinden

Bevor ich das Schema in dein echtes Supabase-Projekt pushen kann, musst du dich hier im Terminal anmelden:

```bash
supabase login
supabase link --project-ref DEIN_PROJEKT_REF
supabase db push
```

Optional für lokale Entwicklung mit Supabase-Containern:

```bash
supabase start
```

## Wichtige Umgebungsvariablen

Siehe `.env.example`. Für den Anfang sind diese am wichtigsten:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MAKE_TEST_SEND_WEBHOOK_URL=
MAKE_TEMPLATE_WEBHOOK_URL=
```

Wenn der Versand direkt aus Make.com laufen soll, bleiben die SMTP-Zugangsdaten dort und nicht im Frontend.

## Empfohlener Make-Flow

1. Admin legt Kampagne in dieser App an
2. App ruft Make-Webhooks für HTML-Entwurf oder Testversand auf
3. Make holt Kampagnen-/Kontakt-Daten aus Supabase oder bekommt sie per Payload
4. Make sendet über IONOS SMTP
5. Make schreibt Versandstatus oder Fehler per Webhook zurück in Supabase

## Nächste sinnvolle Schritte

1. Supabase mit dem richtigen Account verknüpfen
2. Migration in das echte Projekt pushen
3. Auth und echte Datenabfragen anstelle der Mock-Daten anschließen
4. Make-Szenarien für `template draft`, `test send` und `campaign send` aktivieren
