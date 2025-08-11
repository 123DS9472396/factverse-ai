-- ============================================
-- FactVerse AI - Complete Supabase Database Setup
-- ============================================

-- 1. FACTS TABLE (Already created by you - included for reference)
-- ============================================

-- Create the facts table
CREATE TABLE IF NOT EXISTS facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL CHECK (char_length(text) >= 10 AND char_length(text) <= 1000),
  category TEXT NOT NULL CHECK (category IN ('science', 'history', 'nature', 'space', 'technology', 'animals', 'geography', 'culture', 'mathematics', 'food', 'general')),
  source TEXT DEFAULT 'FactVerse AI',
  verified BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  metadata JSONB DEFAULT '{"confidence": 0.8, "reading_time": 30, "complexity": "medium", "ai_generated": true}',
  reports JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_facts_category ON facts(category);
CREATE INDEX IF NOT EXISTS idx_facts_verified ON facts(verified);
CREATE INDEX IF NOT EXISTS idx_facts_likes ON facts(likes DESC);
CREATE INDEX IF NOT EXISTS idx_facts_created_at ON facts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_facts_text_search ON facts USING gin(to_tsvector('english', text));

-- 2. USERS TABLE (For future user authentication)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  preferences JSONB DEFAULT '{"theme": "light", "notifications": true}',
  stats JSONB DEFAULT '{"facts_generated": 0, "facts_liked": 0, "facts_saved": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. USER_SAVED_FACTS TABLE (For saved facts functionality)
-- ============================================

CREATE TABLE IF NOT EXISTS user_saved_facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fact_id UUID REFERENCES facts(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fact_id)
);

-- Create indexes for saved facts
CREATE INDEX IF NOT EXISTS idx_user_saved_facts_user_id ON user_saved_facts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_facts_fact_id ON user_saved_facts(fact_id);

-- 4. USER_FACT_LIKES TABLE (For tracking who liked what)
-- ============================================

CREATE TABLE IF NOT EXISTS user_fact_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fact_id UUID REFERENCES facts(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fact_id)
);

-- Create indexes for likes
CREATE INDEX IF NOT EXISTS idx_user_fact_likes_user_id ON user_fact_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fact_likes_fact_id ON user_fact_likes(fact_id);

-- 5. CATEGORIES TABLE (For category management)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, display_name, description, color, icon, order_index) VALUES
('science', 'Science', 'Scientific discoveries and phenomena', '#10B981', '🔬', 1),
('technology', 'Technology', 'Tech innovations and digital world', '#3B82F6', '💻', 2),
('history', 'History', 'Historical events and figures', '#F59E0B', '📜', 3),
('nature', 'Nature', 'Natural world and environment', '#22C55E', '🌿', 4),
('space', 'Space', 'Astronomy and space exploration', '#8B5CF6', '🚀', 5),
('animals', 'Animals', 'Wildlife and animal kingdom', '#F97316', '🦁', 6),
('geography', 'Geography', 'Places and geographical features', '#06B6D4', '🌍', 7),
('culture', 'Culture', 'Cultural traditions and societies', '#EC4899', '🎭', 8),
('mathematics', 'Mathematics', 'Mathematical concepts and discoveries', '#6366F1', '➕', 9),
('food', 'Food', 'Culinary facts and nutrition', '#EF4444', '🍎', 10),
('general', 'General', 'Miscellaneous interesting facts', '#6B7280', '💡', 11)
ON CONFLICT (name) DO NOTHING;

-- 6. FACT_REPORTS TABLE (For detailed reporting system)
-- ============================================

CREATE TABLE IF NOT EXISTS fact_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fact_id UUID REFERENCES facts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'inaccurate', 'spam', 'duplicate', 'offensive', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reports
CREATE INDEX IF NOT EXISTS idx_fact_reports_fact_id ON fact_reports(fact_id);
CREATE INDEX IF NOT EXISTS idx_fact_reports_status ON fact_reports(status);
CREATE INDEX IF NOT EXISTS idx_fact_reports_created_at ON fact_reports(created_at DESC);

-- 7. API_USAGE_LOGS TABLE (For tracking API usage)
-- ============================================

CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for API logs
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);

-- 8. SYSTEM_SETTINGS TABLE (For app configuration)
-- ============================================

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('app_version', '"1.0.0"', 'Current application version'),
('maintenance_mode', 'false', 'Whether the app is in maintenance mode'),
('max_facts_per_user_per_day', '50', 'Maximum facts a user can generate per day'),
('rate_limit_per_minute', '10', 'API rate limit per minute per user'),
('featured_categories', '["science", "technology", "space"]', 'Categories to feature on homepage')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_fact_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Facts policies (Public read, authenticated write)
DROP POLICY IF EXISTS "Allow public read access" ON facts;
DROP POLICY IF EXISTS "Allow public insert access" ON facts;
DROP POLICY IF EXISTS "Allow public update access" ON facts;

CREATE POLICY "Allow public read access" ON facts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON facts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON facts FOR UPDATE USING (true);

-- Users policies (Users can read all, but only modify their own)
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow users to insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Saved facts policies (Users can only see and modify their own)
CREATE POLICY "Users can view own saved facts" ON user_saved_facts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save facts" ON user_saved_facts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave facts" ON user_saved_facts FOR DELETE USING (auth.uid() = user_id);

-- Likes policies (Users can only see and modify their own)
CREATE POLICY "Users can view own likes" ON user_fact_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can like facts" ON user_fact_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike facts" ON user_fact_likes FOR DELETE USING (auth.uid() = user_id);

-- Categories policies (Public read, admin write)
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (active = true);

-- Reports policies (Users can create, moderators can manage)
CREATE POLICY "Users can create reports" ON fact_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reports" ON fact_reports FOR SELECT USING (auth.uid() = user_id);

-- System settings policies (Public read for non-sensitive settings)
CREATE POLICY "Allow public read system settings" ON system_settings 
FOR SELECT USING (key NOT IN ('admin_emails', 'api_keys', 'secret_keys'));

-- ============================================
-- USEFUL FUNCTIONS
-- ============================================

-- Function to get category statistics
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (
  category TEXT,
  count BIGINT,
  verified BIGINT,
  avg_likes NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.category,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE f.verified = true) as verified,
    ROUND(AVG(f.likes), 2) as avg_likes
  FROM facts f
  GROUP BY f.category
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending facts
CREATE OR REPLACE FUNCTION get_trending_facts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  text TEXT,
  category TEXT,
  likes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.text,
    f.category,
    f.likes,
    f.created_at
  FROM facts f
  WHERE f.verified = true
  ORDER BY f.likes DESC, f.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search facts
CREATE OR REPLACE FUNCTION search_facts(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  text TEXT,
  category TEXT,
  likes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.text,
    f.category,
    f.likes,
    f.created_at,
    ts_rank(to_tsvector('english', f.text), plainto_tsquery('english', search_query)) as rank
  FROM facts f
  WHERE to_tsvector('english', f.text) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, f.likes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_facts_updated_at BEFORE UPDATE ON facts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert some sample facts for testing
INSERT INTO facts (text, category, verified, likes, metadata) VALUES
('The human brain contains approximately 86 billion neurons.', 'science', true, 15, '{"confidence": 0.95, "reading_time": 25, "complexity": "medium", "ai_generated": false}'),
('Honey never spoils and can be preserved for thousands of years.', 'food', true, 23, '{"confidence": 0.9, "reading_time": 20, "complexity": "easy", "ai_generated": false}'),
('A day on Venus is longer than its year.', 'space', true, 31, '{"confidence": 0.98, "reading_time": 18, "complexity": "medium", "ai_generated": false}'),
('Octopuses have three hearts and blue blood.', 'animals', true, 28, '{"confidence": 0.92, "reading_time": 15, "complexity": "easy", "ai_generated": false}'),
('The Great Wall of China is not visible from space with the naked eye.', 'history', true, 12, '{"confidence": 0.85, "reading_time": 30, "complexity": "medium", "ai_generated": false}')
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'FactVerse AI database setup completed successfully!';
  RAISE NOTICE 'Tables created: facts, users, user_saved_facts, user_fact_likes, categories, fact_reports, api_usage_logs, system_settings';
  RAISE NOTICE 'Functions created: get_category_stats(), get_trending_facts(), search_facts()';
  RAISE NOTICE 'Sample data inserted for testing';
END $$;
