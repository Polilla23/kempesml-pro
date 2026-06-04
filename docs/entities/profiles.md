# `profiles` — Entity Documentation

> KML User Profiles. Extends Supabase `auth.users` with KML-specific data: role, team assignment and status.

---

## Table Definition

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  mail        TEXT        NOT NULL UNIQUE,
  role        TEXT        NOT NULL DEFAULT 'manager'
              CHECK (role IN ('admin', 'manager', 'viewer')),
  team_id     TEXT        REFERENCES teams(id) ON DELETE SET NULL,
  team_name   TEXT,
  status      TEXT        NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `UUID` | NO | — | Primary key. Same UUID as `auth.users(id)`. FK with CASCADE DELETE. |
| `name` | `TEXT` | NO | — | Full display name of the user. |
| `mail` | `TEXT` | NO | — | Email address. Must be unique. Maps to `auth.users.email`. |
| `role` | `TEXT` | NO | `'manager'` | User role. See [Roles](#roles) below. |
| `team_id` | `TEXT` | YES | `NULL` | FK to `teams(id)`. Can be set for both `admin` and `manager`. Set `NULL` for admins without a team. |
| `team_name` | `TEXT` | YES | `NULL` | Denormalized team name for fast reads without JOIN. Keep in sync with `teams.name`. |
| `status` | `TEXT` | NO | `'active'` | Account status. `active` or `inactive`. |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Last update timestamp. Auto-updated by trigger. |

---

## Roles

| Role | Description |
|---|---|
| `admin` | Full access to all data. Can also be assigned to a team and act as its manager. |
| `manager` | Can only manage their own assigned team. |
| `viewer` | Read-only access. Cannot modify any data. |

> An `admin` with a `team_id` set behaves as both admin and manager simultaneously.

---

## Constraints

| Name | Type | Definition |
|---|---|---|
| `profiles_pkey` | PRIMARY KEY | `id` |
| `profiles_mail_key` | UNIQUE | `mail` |
| `profiles_role_check` | CHECK | `role IN ('admin', 'manager', 'viewer')` |
| `profiles_status_check` | CHECK | `status IN ('active', 'inactive')` |
| `profiles_id_fkey` | FOREIGN KEY | `id → auth.users(id) ON DELETE CASCADE` |
| `profiles_team_id_fkey` | FOREIGN KEY | `team_id → teams(id) ON DELETE SET NULL` |

---

## Indexes

| Name | Column(s) | Type | Purpose |
|---|---|---|---|
| `profiles_pkey` | `id` | UNIQUE (PK) | Primary key lookup |
| `profiles_mail_key` | `mail` | UNIQUE | Email uniqueness + login lookup |
| `idx_profiles_role` | `role` | BTREE | Filter by role (e.g. fetch all admins) |
| `idx_profiles_team` | `team_id` | BTREE | Find user assigned to a team |

---

## Triggers

### `trg_profiles_updated_at`

Automatically updates `updated_at` on every row modification.

```sql
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

| Property | Value |
|---|---|
| Event | `BEFORE UPDATE` |
| Scope | `FOR EACH ROW` |
| Function | `set_updated_at()` (shared utility) |

---

### `trg_new_user`

Automatically creates a `profiles` row when a new user registers via Supabase Auth.

```sql
CREATE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

| Property | Value |
|---|---|
| Table | `auth.users` |
| Event | `AFTER INSERT` |
| Scope | `FOR EACH ROW` |
| Function | `handle_new_user()` |

---

## Functions

### `handle_new_user()`

Trigger function. Called automatically on new Supabase Auth signup. Inserts a row in `profiles` with default role `manager`. Reads `name` and `role` from `raw_user_meta_data` if provided.

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, mail, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'manager')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

| Property | Value |
|---|---|
| Returns | `TRIGGER` |
| Language | `plpgsql` |
| Security | `SECURITY DEFINER` |

---

### `is_admin()`

Returns `TRUE` if the currently authenticated user has `role = 'admin'`. Intended for use in RLS policies and application logic.

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

**Usage:**
```sql
SELECT is_admin();
```

**Use in RLS:**
```sql
USING (is_admin() OR auth.uid() = owner_id)
```

| Property | Value |
|---|---|
| Returns | `BOOLEAN` |
| Language | `sql` |
| Security | `SECURITY DEFINER STABLE` |

---

### `manages_team(p_team_id TEXT)`

Returns `TRUE` if the currently authenticated user manages the given team. Covers both `manager` role users and `admin` users with a team assigned.

```sql
CREATE OR REPLACE FUNCTION manages_team(p_team_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND team_id = p_team_id
      AND role IN ('admin', 'manager')
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

**Usage:**
```sql
SELECT manages_team('BIELSA-FC');
```

**Use in RLS of other tables:**
```sql
USING (is_admin() OR manages_team(team_id))
```

| Property | Value |
|---|---|
| Parameter | `p_team_id TEXT` — the team ID to check against |
| Returns | `BOOLEAN` |
| Language | `sql` |
| Security | `SECURITY DEFINER STABLE` |

---

## Row Level Security (RLS)

RLS is **enabled** on this table. Three policies are defined.

### Policy: `Users access their own profile`

| Property | Value |
|---|---|
| Operation | `SELECT` |
| Applies to | All authenticated users |

Each user can only read their own profile. Admins can read all profiles.

> ⚠️ Uses `is_admin()` (`SECURITY DEFINER`) instead of a subquery on `profiles` — a direct `EXISTS (SELECT FROM profiles ...)` here causes **infinite recursion** in RLS.

```sql
USING (auth.uid() = id OR is_admin());
```

---

### Policy: `Users edit their own profile`

| Property | Value |
|---|---|
| Operation | `UPDATE` |
| Applies to | All authenticated users |

Users can edit their own profile fields. Role immutability is enforced by the `prevent_role_change` trigger — not by `WITH CHECK` subquery (which would also cause recursion).

```sql
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

### Policy: `Only service_role manages profiles`

| Property | Value |
|---|---|
| Operation | `ALL` (INSERT, UPDATE, DELETE) |
| Applies to | `service_role` only |

All write operations — including role changes, profile creation and deletion — are restricted to `service_role`. This is the key used by backend scripts and migrations.

```sql
USING (auth.role() = 'service_role');
```

---

### `trg_prevent_role_change`

Prevents users from changing their own `role`. Fires on every `UPDATE` — if `role` changed and the caller is not `service_role`, raises an exception.

```sql
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Role changes are not allowed. Contact an administrator.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_prevent_role_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_role_change();
```

| Property | Value |
|---|---|
| Event | `BEFORE UPDATE` |
| Scope | `FOR EACH ROW` |
| Function | `prevent_role_change()` |

> This replaces the `WITH CHECK (role = subquery)` pattern which causes RLS recursion.

---

## Relationships

```
auth.users (Supabase)
    │ 1:1 (CASCADE DELETE)
    ▼
profiles
    │ N:1 (SET NULL on delete)
    ▼
teams
```

---

## Migration Notes

- **Firebase UID**: during migration from Firebase, store the original Firebase UID in a temporary column `firebase_uid TEXT UNIQUE` if needed to cross-reference records.
- **Email mapping**: `profiles.mail` maps to `auth.users.email`. The trigger reads `NEW.email` (not `NEW.mail`) since `auth.users` uses the field name `email`.
- **Role assignment**: on first migration, insert profiles via `service_role` with the appropriate role. Firebase users with `rol = 'admin'` → `role = 'admin'`, `rol = 'manager'` → `role = 'manager'`.

---

## Example Queries

```sql
-- Get full profile for current user
SELECT * FROM profiles WHERE id = auth.uid();

-- List all managers with their team
SELECT name, mail, team_name FROM profiles
WHERE role = 'manager' AND status = 'active'
ORDER BY team_name;

-- List all admins
SELECT name, mail, team_name FROM profiles
WHERE role = 'admin' ORDER BY name;

-- Deactivate a user (service_role only)
UPDATE profiles SET status = 'inactive' WHERE mail = 'user@example.com';

-- Promote user to admin (service_role only)
UPDATE profiles SET role = 'admin' WHERE mail = 'user@example.com';

-- Check if current user can manage a team (use in app logic)
SELECT manages_team('BIELSA-FC');
```

---

*Last updated: 2026 · KML Database Documentation*
