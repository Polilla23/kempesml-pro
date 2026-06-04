-- Shared utility functions used across tables.

-- Auto-updates an `updated_at` column on row modification.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
