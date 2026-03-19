insert into public.workspace_settings (
  id,
  workspace_name,
  default_from_name,
  default_from_email,
  sender_mode,
  default_locale
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Briefwerk Admin',
  'Briefwerk Studio',
  'newsletter@beispiel.de',
  'make_smtp',
  'de'
)
on conflict (id) do update
set
  workspace_name = excluded.workspace_name,
  default_from_name = excluded.default_from_name,
  default_from_email = excluded.default_from_email,
  sender_mode = excluded.sender_mode,
  default_locale = excluded.default_locale;

insert into public.lists (id, name, description, color, is_default)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Bestandskunden', 'Bestehende Kundschaft für Updates und Launches', '#22453c', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Interessenten', 'Leads aus Formularen und Landingpages', '#9a5f3f', false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Webinar', 'Teilnehmer und Reminder-Liste', '#aa6a1f', false)
on conflict (id) do nothing;

insert into public.tags (id, name, color)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'B2B', '#22453c'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Presse', '#9a5f3f'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'VIP', '#aa6a1f')
on conflict (id) do nothing;

insert into public.contacts (
  id,
  email,
  first_name,
  last_name,
  company,
  status,
  source,
  consent_at
)
values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'anna@beispiel.de', 'Anna', 'Weber', 'Weber Atelier', 'subscribed', 'CSV-Import März', timezone('utc', now()) - interval '20 day'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'lukas@atelier-hoffmann.de', 'Lukas', 'Hoffmann', 'Atelier Hoffmann', 'pending', 'Landingpage', timezone('utc', now()) - interval '7 day'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'miriam@schuster-design.de', 'Miriam', 'Schuster', 'Schuster Design', 'unsubscribed', 'Altbestand', timezone('utc', now()) - interval '90 day')
on conflict (email) do nothing;

insert into public.list_members (id, list_id, contact_id)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'dddddddd-dddd-dddd-dddd-ddddddddddd1'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'dddddddd-dddd-dddd-dddd-ddddddddddd2'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'dddddddd-dddd-dddd-dddd-ddddddddddd3')
on conflict (list_id, contact_id) do nothing;

insert into public.templates (
  id,
  name,
  slug,
  subject,
  preview_text,
  html_content,
  mode
)
values (
  'ffffffff-ffff-ffff-ffff-fffffffffff1',
  'Monatsbrief',
  'monatsbrief',
  'Das Wichtigste des Monats in drei Minuten',
  'Kurzes Update mit Highlight, CTA und Footer',
  '<section><h1>Monatsbrief</h1><p>Dies ist ein Seed-Template für Briefwerk.</p></section>',
  'manual'
)
on conflict (slug) do nothing;

insert into public.template_versions (
  id,
  template_id,
  version_number,
  subject,
  preview_text,
  html_content
)
values (
  '99999999-9999-9999-9999-999999999991',
  'ffffffff-ffff-ffff-ffff-fffffffffff1',
  1,
  'Das Wichtigste des Monats in drei Minuten',
  'Kurzes Update mit Highlight, CTA und Footer',
  '<section><h1>Monatsbrief</h1><p>Version 1</p></section>'
)
on conflict (template_id, version_number) do nothing;

insert into public.campaigns (
  id,
  name,
  template_id,
  status,
  target_lists,
  send_via,
  scheduled_at
)
values (
  '12121212-1212-1212-1212-121212121212',
  'Frühlingskampagne 2026',
  'ffffffff-ffff-ffff-ffff-fffffffffff1',
  'scheduled',
  '["Bestandskunden","Interessenten"]'::jsonb,
  'make_smtp',
  timezone('utc', now()) + interval '2 day'
)
on conflict (id) do nothing;
