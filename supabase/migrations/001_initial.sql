-- ════════════════════════════════════════════════════════════
--  Skill Swap 2.0 — Initial Database Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── Enable UUID extension ─────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────
CREATE TABLE profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL,
  full_name             TEXT NOT NULL DEFAULT '',
  avatar_url            TEXT,
  college               TEXT,
  company               TEXT,
  bio                   TEXT,
  user_type             TEXT NOT NULL DEFAULT 'student' CHECK (user_type IN ('student', 'professional')),
  city                  TEXT,
  swapcoin_balance      INTEGER NOT NULL DEFAULT 50,
  total_sessions_taught INTEGER NOT NULL DEFAULT 0,
  total_sessions_learned INTEGER NOT NULL DEFAULT 0,
  average_rating        NUMERIC(3,2) NOT NULL DEFAULT 0,
  streak_days           INTEGER NOT NULL DEFAULT 0,
  last_active_date      DATE,
  onboarding_complete   BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User Skills ───────────────────────────────────────────
CREATE TABLE user_skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name   TEXT NOT NULL,
  skill_type   TEXT NOT NULL CHECK (skill_type IN ('teach', 'learn')),
  is_verified  BOOLEAN NOT NULL DEFAULT false,
  level        TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'expert')),
  sessions_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, skill_name, skill_type)
);

-- ── Swap Requests ─────────────────────────────────────────
CREATE TABLE swap_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_offered TEXT NOT NULL,
  skill_wanted  TEXT NOT NULL,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Sessions ──────────────────────────────────────────────
CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  learner_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name        TEXT NOT NULL,
  scheduled_at      TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  teacher_confirmed BOOLEAN NOT NULL DEFAULT false,
  learner_confirmed BOOLEAN NOT NULL DEFAULT false,
  coin_deposit      INTEGER NOT NULL DEFAULT 10,
  notes             TEXT,
  swap_request_id   UUID REFERENCES swap_requests(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Ratings ───────────────────────────────────────────────
CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  rater_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, rater_id)
);

-- ── SwapCoin Transactions ─────────────────────────────────
CREATE TABLE swapcoin_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('earn','spend','deposit','refund','bonus')),
  description TEXT NOT NULL,
  session_id  UUID REFERENCES sessions(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Certificates ──────────────────────────────────────────
CREATE TABLE certificates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  sessions_count INTEGER NOT NULL,
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, skill_name)
);

-- ════════════════════════════════════════════════════════════
--  Row Level Security (RLS)
-- ════════════════════════════════════════════════════════════
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings                ENABLE ROW LEVEL SECURITY;
ALTER TABLE swapcoin_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates           ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Skills: public read, own write
CREATE POLICY "Skills are viewable by everyone"
  ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own skills"
  ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Swap Requests: participants only
CREATE POLICY "Swap requests visible to participants"
  ON swap_requests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Authenticated users can create swap requests"
  ON swap_requests FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Participants can update swap requests"
  ON swap_requests FOR UPDATE
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Sessions: participants only
CREATE POLICY "Sessions visible to participants"
  ON sessions FOR SELECT
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);
CREATE POLICY "Authenticated users can create sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = teacher_id OR auth.uid() = learner_id);
CREATE POLICY "Participants can update sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- Ratings: public read, own write
CREATE POLICY "Ratings are public"
  ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings for sessions they participated in"
  ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Transactions: own only
CREATE POLICY "Users see their own transactions"
  ON swapcoin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts transactions"
  ON swapcoin_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates: public read
CREATE POLICY "Certificates are public"
  ON certificates FOR SELECT USING (true);
CREATE POLICY "Users manage their own certificates"
  ON certificates FOR ALL USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
--  Functions & Triggers
-- ════════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Give welcome bonus
  INSERT INTO swapcoin_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 50, 'bonus', 'Welcome bonus — happy swapping! 🎉');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update average rating when a new rating is added
CREATE OR REPLACE FUNCTION update_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET average_rating = (
    SELECT ROUND(AVG(stars)::numeric, 2)
    FROM ratings
    WHERE rated_id = NEW.rated_id
  )
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_rating_inserted
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_average_rating();

-- Issue certificate after 3 completed sessions on a skill
CREATE OR REPLACE FUNCTION check_certificate_eligibility()
RETURNS TRIGGER AS $$
DECLARE
  skill_sessions_count INTEGER;
BEGIN
  IF NEW.status = 'completed' THEN
    SELECT COUNT(*) INTO skill_sessions_count
    FROM sessions
    WHERE teacher_id = NEW.teacher_id
      AND skill_name = NEW.skill_name
      AND status = 'completed';

    IF skill_sessions_count >= 3 THEN
      INSERT INTO certificates (user_id, skill_name, sessions_count)
      VALUES (NEW.teacher_id, NEW.skill_name, skill_sessions_count)
      ON CONFLICT (user_id, skill_name) DO UPDATE
        SET sessions_count = EXCLUDED.sessions_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_session_completed
  AFTER UPDATE ON sessions
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION check_certificate_eligibility();

-- Update streak
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE profiles
    SET
      streak_days = CASE
        WHEN last_active_date = CURRENT_DATE - 1 THEN streak_days + 1
        WHEN last_active_date = CURRENT_DATE THEN streak_days
        ELSE 1
      END,
      last_active_date = CURRENT_DATE,
      total_sessions_taught = total_sessions_taught + 1
    WHERE id = NEW.teacher_id;

    UPDATE profiles
    SET total_sessions_learned = total_sessions_learned + 1
    WHERE id = NEW.learner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_session_complete_streak
  AFTER UPDATE ON sessions
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION update_streak();
