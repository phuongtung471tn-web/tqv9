create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  city text,
  major text,
  ai_score int,
  ai_rank text,
  risk_level text,
  risk_reasons text[],
  recommended_action text,
  behavior_summary text,
  sale_advice text,
  device_tech_info text,
  traffic_ads_source text,
  network_provider text,
  network_label text,
  current_session int,
  visits_today int,
  visits_month int,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  ttclid text,
  variant text,
  landing_url text,
  device_manufacturer text,
  device_family text,
  device_model text,
  operating_system text,
  browser text,
  visitor_behavior_payload jsonb
);

create index if not exists leads_phone_created_idx
  on public.leads (phone, created_at desc);

create table if not exists public.visitor_sessions (
  id text primary key,
  visitor_id text not null,
  visited_day date not null,
  visited_month text not null,
  source text,
  medium text,
  campaign text,
  content text,
  device_model text,
  device_kind text,
  os text,
  browser text,
  created_at timestamptz not null default now()
);

create index if not exists visitor_sessions_visitor_day_idx
  on public.visitor_sessions (visitor_id, visited_day);

create index if not exists visitor_sessions_visitor_month_idx
  on public.visitor_sessions (visitor_id, visited_month);
