-- Teams. Referenced by profiles(team_id). Uses a human-readable TEXT id
-- (e.g. 'BIELSA-FC') as documented in the profiles entity.

create table if not exists teams (
  id          text        primary key,
  name        text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_teams_updated_at
  before update on teams
  for each row execute function set_updated_at();

alter table teams enable row level security;

-- Everyone authenticated can read teams.
create policy "Authenticated can read teams"
  on teams for select
  to authenticated
  using (true);

-- Only service_role manages teams for now (admins via backend).
create policy "Only service_role manages teams"
  on teams for all
  using (auth.role() = 'service_role');
