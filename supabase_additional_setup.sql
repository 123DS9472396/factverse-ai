-- ============================================
-- FactVerse AI - Additional Tables for Supabase
-- Run these queries one by one in Supabase SQL Editor
-- ============================================

-- STEP 1: Create Users Table
CREATE TABLE users (
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

-- STEP 2: Create User Saved Facts Table
CREATE TABLE user_saved_facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fact_id UUID REFERENCES facts(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fact_id)
);

-- STEP 3: Create User Fact Likes Table
CREATE TABLE user_fact_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fact_id UUID REFERENCES facts(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fact_id)
);

-- STEP 4: Create Categories Table
CREATE TABLE categories (
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

-- STEP 5: Insert Default Categories
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
('general', 'General', 'Miscellaneous interesting facts', '#6B7280', '💡', 11);

-- STEP 6: Add Text Search Index to Facts Table
CREATE INDEX idx_facts_text_search ON facts USING gin(to_tsvector('english', text));

-- STEP 7: Create RLS Policies for New Tables

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow users to insert" ON users FOR INSERT WITH CHECK (true);

-- Saved facts policies
ALTER TABLE user_saved_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to saved facts" ON user_saved_facts FOR ALL USING (true);

-- Likes policies
ALTER TABLE user_fact_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to likes" ON user_fact_likes FOR ALL USING (true);

-- Categories policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (active = true);

-- STEP 8: Create Useful Functions

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

-- STEP 9: Insert Sample Facts for Testing
INSERT INTO facts (text, category, verified, likes, metadata) VALUES
('The human brain contains approximately 86 billion neurons.', 'science', true, 15, '{"confidence": 0.95, "reading_time": 25, "complexity": "medium", "ai_generated": false}'),
('Honey never spoils and can be preserved for thousands of years.', 'food', true, 23, '{"confidence": 0.9, "reading_time": 20, "complexity": "easy", "ai_generated": false}'),
('A day on Venus is longer than its year.', 'space', true, 31, '{"confidence": 0.98, "reading_time": 18, "complexity": "medium", "ai_generated": false}'),
('Octopuses have three hearts and blue blood.', 'animals', true, 28, '{"confidence": 0.92, "reading_time": 15, "complexity": "easy", "ai_generated": false}'),
('The Great Wall of China is not visible from space with the naked eye.', 'history', true, 12, '{"confidence": 0.85, "reading_time": 30, "complexity": "medium", "ai_generated": false}');

-- STEP 10: Test Your Setup
SELECT 'Database setup completed! You now have:' as message;
SELECT COUNT(*) as total_facts FROM facts;
SELECT COUNT(*) as total_categories FROM categories;
SELECT * FROM get_category_stats();
