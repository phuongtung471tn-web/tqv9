create table if not exists public.funnel_configs (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.funnel_configs enable row level security;

-- The anon key is used by the current client-side storage adapter.
-- Restrict this policy further when Supabase Auth is enabled.
create policy "funnel configs can be read"
  on public.funnel_configs for select
  using (true);

create policy "funnel configs can be written"
  on public.funnel_configs for insert
  with check (id = 1);

create policy "funnel configs can be updated"
  on public.funnel_configs for update
  using (id = 1)
  with check (id = 1);

create unique index if not exists funnel_configs_id_idx on public.funnel_configs (id);
