-- Profiles. Extends auth.users with KML-specific data (role, team, status).
-- See docs/entities/profiles.md for the full reference.

create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null,
  mail        text        not null unique,
  role        text        not null default 'manager'
              check (role in ('admin', 'manager', 'viewer')),
  team_id     text        references teams(id) on delete set null,
  team_name   text,
  status      text        not null default 'active'
              check (status in ('active', 'inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles (role);
create index if not exists idx_profiles_team on profiles (team_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
-- NOTE: `set search_path = ''` is required on SECURITY DEFINER functions —
-- without it the function runs with the auth admin's search_path (which lacks
-- `public`) and the insert fails with "Database error saving new user". All
-- objects must therefore be schema-qualified (public.profiles).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, mail, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'manager')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Authorization helpers (used in RLS policies across tables)
-- ---------------------------------------------------------------------------

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create or replace function manages_team(p_team_id text)
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and team_id = p_team_id
      and role in ('admin', 'manager')
      and status = 'active'
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;

-- Read: own profile, or any profile if admin.
create policy "Users access their own profile"
  on profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Update: own profile only, and cannot change own role.
create policy "Users edit their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from profiles where id = auth.uid())
  );

-- All writes (insert/update/delete incl. role changes) are service_role only.
create policy "Only service_role manages profiles"
  on profiles for all
  using (auth.role() = 'service_role');
