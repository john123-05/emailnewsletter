create extension if not exists pgcrypto;

do $$
begin
  create type public.contact_status as enum (
    'pending',
    'subscribed',
    'unsubscribed',
    'bounced',
    'suppressed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.campaign_status as enum (
    'draft',
    'scheduled',
    'queued',
    'sending',
    'sent',
    'paused',
    'failed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.recipient_status as enum (
    'queued',
    'processing',
    'sent',
    'delivered',
    'opened',
    'clicked',
    'bounced',
    'unsubscribed',
    'failed',
    'suppressed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.template_mode as enum (
    'manual',
    'hybrid',
    'make_generated'
  );
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_name text not null default 'Briefwerk Admin',
  default_from_name text,
  default_from_email text,
  reply_to_email text,
  default_locale text not null default 'de',
  sender_mode text not null default 'make_smtp',
  unsubscribe_base_url text,
  double_opt_in_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  company text,
  locale text not null default 'de',
  status public.contact_status not null default 'pending',
  source text,
  notes text,
  consent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  bounce_reason text,
  custom_fields jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  color text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.list_members (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  added_at timestamptz not null default timezone('utc', now()),
  unique (list_id, contact_id)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_tags (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (contact_id, tag_id)
);

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  import_status text not null default 'draft',
  total_rows integer not null default 0,
  imported_rows integer not null default 0,
  skipped_rows integer not null default 0,
  default_contact_status public.contact_status not null default 'subscribed',
  mapping jsonb not null default '{}'::jsonb,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subject text not null,
  preview_text text,
  html_content text not null,
  design_json jsonb not null default '{}'::jsonb,
  mode public.template_mode not null default 'manual',
  thumbnail_path text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  version_number integer not null,
  subject text not null,
  preview_text text,
  html_content text not null,
  design_json jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (template_id, version_number)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_id uuid references public.templates(id) on delete set null,
  subject_override text,
  preview_text_override text,
  from_name text,
  from_email text,
  reply_to_email text,
  status public.campaign_status not null default 'draft',
  target_lists jsonb not null default '[]'::jsonb,
  target_filters jsonb not null default '{}'::jsonb,
  send_via text not null default 'make_smtp',
  make_run_id text,
  scheduled_at timestamptz,
  queued_at timestamptz,
  launched_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  email text not null,
  full_name text,
  status public.recipient_status not null default 'queued',
  provider_message_id text,
  send_attempted_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  unsubscribed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.send_attempts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  campaign_recipient_id uuid references public.campaign_recipients(id) on delete cascade,
  channel text not null default 'make_smtp',
  provider text not null default 'ionos',
  status text not null default 'queued',
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  attempted_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  campaign_recipient_id uuid references public.campaign_recipients(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  event_type text not null,
  provider_event_id text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  event_name text,
  status text not null default 'received',
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  received_at timestamptz not null default timezone('utc', now()),
  processed_at timestamptz
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  template_id uuid references public.templates(id) on delete cascade,
  run_type text not null,
  status text not null default 'queued',
  external_run_id text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz
);

create index if not exists contacts_status_idx on public.contacts(status);
create index if not exists contacts_email_idx on public.contacts(email);
create index if not exists campaigns_status_idx on public.campaigns(status);
create index if not exists campaign_recipients_campaign_id_idx on public.campaign_recipients(campaign_id);
create index if not exists campaign_recipients_status_idx on public.campaign_recipients(status);
create index if not exists email_events_campaign_id_idx on public.email_events(campaign_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists workspace_settings_set_updated_at on public.workspace_settings;
create trigger workspace_settings_set_updated_at
before update on public.workspace_settings
for each row
execute function public.set_updated_at();

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row
execute function public.set_updated_at();

drop trigger if exists lists_set_updated_at on public.lists;
create trigger lists_set_updated_at
before update on public.lists
for each row
execute function public.set_updated_at();

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
before update on public.templates
for each row
execute function public.set_updated_at();

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists campaign_recipients_set_updated_at on public.campaign_recipients;
create trigger campaign_recipients_set_updated_at
before update on public.campaign_recipients
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.contacts enable row level security;
alter table public.lists enable row level security;
alter table public.list_members enable row level security;
alter table public.tags enable row level security;
alter table public.contact_tags enable row level security;
alter table public.imports enable row level security;
alter table public.templates enable row level security;
alter table public.template_versions enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.send_attempts enable row level security;
alter table public.email_events enable row level security;
alter table public.webhook_logs enable row level security;
alter table public.automation_runs enable row level security;

drop policy if exists "authenticated profiles access" on public.profiles;
create policy "authenticated profiles access"
on public.profiles
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated workspace settings access" on public.workspace_settings;
create policy "authenticated workspace settings access"
on public.workspace_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated contacts access" on public.contacts;
create policy "authenticated contacts access"
on public.contacts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated lists access" on public.lists;
create policy "authenticated lists access"
on public.lists
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated list members access" on public.list_members;
create policy "authenticated list members access"
on public.list_members
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated tags access" on public.tags;
create policy "authenticated tags access"
on public.tags
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated contact tags access" on public.contact_tags;
create policy "authenticated contact tags access"
on public.contact_tags
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated imports access" on public.imports;
create policy "authenticated imports access"
on public.imports
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated templates access" on public.templates;
create policy "authenticated templates access"
on public.templates
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated template versions access" on public.template_versions;
create policy "authenticated template versions access"
on public.template_versions
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated campaigns access" on public.campaigns;
create policy "authenticated campaigns access"
on public.campaigns
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated campaign recipients access" on public.campaign_recipients;
create policy "authenticated campaign recipients access"
on public.campaign_recipients
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated send attempts access" on public.send_attempts;
create policy "authenticated send attempts access"
on public.send_attempts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated email events access" on public.email_events;
create policy "authenticated email events access"
on public.email_events
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated webhook logs access" on public.webhook_logs;
create policy "authenticated webhook logs access"
on public.webhook_logs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated automation runs access" on public.automation_runs;
create policy "authenticated automation runs access"
on public.automation_runs
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values
  ('newsletter-assets', 'newsletter-assets', false),
  ('contact-imports', 'contact-imports', false)
on conflict (id) do nothing;

drop policy if exists "authenticated storage access newsletter assets" on storage.objects;
create policy "authenticated storage access newsletter assets"
on storage.objects
for all
to authenticated
using (bucket_id in ('newsletter-assets', 'contact-imports'))
with check (bucket_id in ('newsletter-assets', 'contact-imports'));
