-- ============================================================
-- create_table_profiles.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  mail        TEXT        NOT NULL UNIQUE,
  role        TEXT        NOT NULL DEFAULT 'manager'
              CHECK (role IN ('admin', 'manager', 'viewer')),
              -- admin: full access + can also manage a team
              -- manager: manages their team only
              -- viewer: read only
  team_id     TEXT        REFERENCES teams(id) ON DELETE SET NULL,
  team_name   TEXT,
  status      TEXT        NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_mail    ON profiles (mail);
CREATE INDEX IF NOT EXISTS idx_profiles_role    ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_team    ON profiles (team_id);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Each user reads their own profile; admins read all
-- IMPORTANT: uses is_admin() (SECURITY DEFINER) to avoid infinite recursion
-- DO NOT use EXISTS (SELECT FROM profiles ...) here — it causes infinite recursion
CREATE POLICY "Users access their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- Each user edits their own profile
-- Role immutability is enforced by trigger prevent_role_change (see below)
-- NOT by WITH CHECK subquery — that also causes recursion
CREATE POLICY "Users edit their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only service_role can insert, delete or change roles
CREATE POLICY "Only service_role manages profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ── Auto-create profile on signup ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, mail, name, role)
  VALUES (
    NEW.id,
    NEW.email,                                                    -- auth.users uses 'email', not 'mail'
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'manager')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_new_user ON auth.users;
CREATE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Helper: check if current user is admin ────────────────────────────────────
-- Usage: SELECT is_admin();
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper: check if current user manages a specific team ────────────────────
-- Covers both managers AND admins who are assigned to a team
-- Usage: SELECT manages_team('BIELSA-FC');
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

-- ── Trigger: prevent role change from user side ─────────────────────────────
-- Replaces the WITH CHECK subquery (which caused recursion) with a trigger
-- Only service_role can change roles
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Role changes are not allowed. Contact an administrator.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_change ON profiles;
CREATE TRIGGER trg_prevent_role_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_role_change();

COMMENT ON FUNCTION prevent_role_change IS
  'Prevents users from changing their own role. Only service_role can update role.';

COMMENT ON TABLE  profiles           IS 'KML User Profiles — extends Supabase auth.users';
COMMENT ON COLUMN profiles.id        IS 'auth.users UUID — FK to Supabase Auth';
COMMENT ON COLUMN profiles.role      IS 'admin: full access, can also be assigned to a team | manager: own team only | viewer: read only';
COMMENT ON COLUMN profiles.team_id   IS 'Can be set for both admin and manager roles';
COMMENT ON FUNCTION is_admin         IS 'Returns true if the current authenticated user has role=admin';
COMMENT ON FUNCTION manages_team     IS 'Returns true if current user manages the given team (admin or manager with team assigned)';
