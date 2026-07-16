-- PHASE 0: Data Model, Privacy & Canonical State
-- This migration creates the single source of truth for user progression

-- 1. Profiles table (user identity and consent)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  guardian_status TEXT DEFAULT 'none' CHECK (guardian_status IN ('none', 'pending', 'approved')),
  data_consent BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User state table (SINGLE SOURCE OF TRUTH for progression)
CREATE TABLE IF NOT EXISTS user_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_checkin_date DATE,
  dna_score INT DEFAULT 0,
  tier TEXT DEFAULT 'Foundation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Mission definitions (static mission metadata)
CREATE TABLE IF NOT EXISTS mission_definitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL,
  level_required INT NOT NULL,
  xp_reward INT NOT NULL,
  difficulty TEXT,
  time_estimate TEXT,
  lesson_body TEXT,
  activity_schema JSONB,
  is_repeatable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Mission responses (append-only longitudinal record)
CREATE TABLE IF NOT EXISTS mission_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES mission_definitions(id),
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DNA events (append-only event log for DNA scoring)
CREATE TABLE IF NOT EXISTS dna_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trait TEXT NOT NULL,
  delta INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(10, 2),
  current_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Daily checkins (one per day per user)
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- Enable Row-Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_state
CREATE POLICY "Users can read own user_state" ON user_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own user_state" ON user_state
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for mission_definitions (public read)
CREATE POLICY "Anyone can read mission_definitions" ON mission_definitions
  FOR SELECT USING (TRUE);

-- RLS Policies for mission_responses
CREATE POLICY "Users can read own mission_responses" ON mission_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mission_responses" ON mission_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dna_events
CREATE POLICY "Users can read own dna_events" ON dna_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dna_events" ON dna_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can read own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for daily_checkins
CREATE POLICY "Users can read own daily_checkins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_checkins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_state_user_id ON user_state(user_id);
CREATE INDEX idx_mission_responses_user_id ON mission_responses(user_id);
CREATE INDEX idx_mission_responses_created_at ON mission_responses(created_at);
CREATE INDEX idx_dna_events_user_id ON dna_events(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_daily_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX idx_daily_checkins_date ON daily_checkins(checkin_date);
