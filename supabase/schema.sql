-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: Core user data and wallet association
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_lifetime_steps BIGINT DEFAULT 0,
  total_earned_tokens DECIMAL(18, 8) DEFAULT 0,
  energy INTEGER DEFAULT 20, -- Max initial energy
  last_energy_regen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active_shoe_id UUID, -- References nft_shoes.id
  display_name TEXT,
  avatar_url TEXT
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

-- NFT Shoes table: Track owned shoe NFTs and their metadata
CREATE TABLE IF NOT EXISTS nft_shoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  token_id BIGINT UNIQUE NOT NULL, -- On-chain token ID
  rarity TEXT NOT NULL, -- Common, Uncommon, Rare, Epic, Legendary
  level INTEGER DEFAULT 1,
  efficiency INTEGER DEFAULT 100,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to users after nft_shoes is created
ALTER TABLE users 
ADD CONSTRAINT fk_active_shoe 
FOREIGN KEY (active_shoe_id) 
REFERENCES nft_shoes(id) 
ON DELETE SET NULL;

-- RLS (Row Level Security) - Basic setup
-- Allow users to read/write their own data based on wallet_address
CREATE TABLE IF NOT EXISTS nft_shoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own shoes" ON nft_shoes
  FOR ALL USING (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_shoes ENABLE ROW LEVEL SECURITY;

-- Note: In a production environment, you would use Supabase Auth 
-- but since we are using Wallet-based auth, we will handle verification 
-- in the app or via custom auth functions.
CREATE POLICY "Users can manage their own profile" ON users
  FOR ALL USING (true); -- Simplified for MVP, refine with wallet verification

CREATE POLICY "Users can manage their own activities" ON daily_activities
  FOR ALL USING (true);

CREATE POLICY "Users can manage their own sessions" ON activity_sessions
  FOR ALL USING (true);

-- Transactions table: Log all financial/reward events
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'REWARD', 'CLAIM', 'PURCHASE'
  amount DECIMAL(18, 8) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (true);
