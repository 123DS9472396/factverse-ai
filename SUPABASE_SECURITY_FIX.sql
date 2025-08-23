-- FactVerse AI - Supabase Security Fixes
-- Run these commands in your Supabase SQL Editor to fix security issues

-- Fix: Remove mutable search_path from functions
-- This addresses the 4 security warnings in your dashboard

-- 1. Fix get_category_stats function
CREATE OR REPLACE FUNCTION public.get_category_stats()
RETURNS TABLE(category text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT category, COUNT(*)::bigint 
  FROM facts 
  WHERE verified = true 
  GROUP BY category 
  ORDER BY count DESC;
$$;

-- 2. Fix get_trending_facts function  
CREATE OR REPLACE FUNCTION public.get_trending_facts(limit_count integer DEFAULT 10)
RETURNS TABLE(
    id uuid,
    text text,
    category text,
    likes integer,
    created_at timestamptz,
    verified boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT f.id, f.text, f.category, f.likes, f.created_at, f.verified
  FROM facts f
  WHERE f.verified = true
  ORDER BY f.likes DESC, f.created_at DESC
  LIMIT limit_count;
$$;

-- 3. Fix search_facts function
CREATE OR REPLACE FUNCTION public.search_facts(search_term text)
RETURNS TABLE(
    id uuid,
    text text,
    category text,
    likes integer,
    created_at timestamptz,
    verified boolean,
    relevance real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    f.id, f.text, f.category, f.likes, f.created_at, f.verified,
    ts_rank(to_tsvector('english', f.text), plainto_tsquery('english', search_term)) as relevance
  FROM facts f
  WHERE to_tsvector('english', f.text) @@ plainto_tsquery('english', search_term)
    AND f.verified = true
  ORDER BY relevance DESC, f.likes DESC;
$$;

-- 4. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Add performance indexes to improve query speed
CREATE INDEX IF NOT EXISTS idx_facts_category ON facts(category);
CREATE INDEX IF NOT EXISTS idx_facts_verified ON facts(verified);
CREATE INDEX IF NOT EXISTS idx_facts_likes ON facts(likes DESC);
CREATE INDEX IF NOT EXISTS idx_facts_created_at ON facts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_facts_text_search ON facts USING gin(to_tsvector('english', text));

-- Add proper permissions
GRANT EXECUTE ON FUNCTION public.get_category_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_trending_facts(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_facts(text) TO anon, authenticated;

-- Update table permissions
GRANT SELECT ON public.facts TO anon, authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT INSERT, UPDATE ON public.user_fact_interactions TO authenticated;

COMMENT ON FUNCTION public.get_category_stats() IS 'Returns fact count by category - Security fixed';
COMMENT ON FUNCTION public.get_trending_facts(integer) IS 'Returns trending facts - Security fixed';
COMMENT ON FUNCTION public.search_facts(text) IS 'Full-text search in facts - Security fixed';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates timestamp trigger - Security fixed';
