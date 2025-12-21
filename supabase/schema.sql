-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: Core user data and wallet association
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_lifetime_steps BIGINT DEFAULT 0,
  total_earned_tokens DECIMAL(18, 8) DEFAULT 0
);

-- Daily activities: Aggregate steps per day for rewards
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  distance_meters DECIMAL(10, 2) DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  tokens_earned DECIMAL(18, 8) DEFAULT 0,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, date)
);

-- Activity sessions: For individual tracking sessions
CREATE TABLE IF NOT EXISTS activity_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  steps INTEGER DEFAULT 0,
  tokens_earned DECIMAL(18, 8) DEFAULT 0,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic setup
-- Allow users to read/write their own data based on wallet_address
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_sessions ENABLE ROW LEVEL SECURITY;

-- Note: In a production environment, you would use Supabase Auth 
-- but since we are using Wallet-based auth, we will handle verification 
-- in the app or via custom auth functions.
CREATE POLICY "Users can manage their own profile" ON users
  FOR ALL USING (true); -- Simplified for MVP, refine with wallet verification

CREATE POLICY "Users can manage their own activities" ON daily_activities
  FOR ALL USING (true);

CREATE POLICY "Users can manage their own sessions" ON activity_sessions
  FOR ALL USING (true);
