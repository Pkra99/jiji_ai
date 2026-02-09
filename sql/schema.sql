-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RESOURCES TABLE
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('ppt', 'video')),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Resources are viewable by all authenticated users
CREATE POLICY "Authenticated users can view resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

-- Also allow anonymous access for now (mocked auth)
CREATE POLICY "Anonymous users can view resources"
  ON resources FOR SELECT
  TO anon
  USING (true);

-- QUERIES TABLE
CREATE TABLE IF NOT EXISTS queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  response_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on queries
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- Query policies
CREATE POLICY "Users can view own queries"
  ON queries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queries"
  ON queries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also allow anonymous inserts (for mocked auth)
CREATE POLICY "Anonymous users can insert queries"
  ON queries FOR INSERT
  TO anon
  WITH CHECK (true);

-- SAMPLE DATA
-- Insert sample resources (update URLs after uploading to Storage)
INSERT INTO resources (title, description, type, storage_path, public_url, tags) VALUES
(
  'Introduction to RAG',
  'Comprehensive guide to Retrieval-Augmented Generation',
  'ppt',
  'resources/intro_to_rag.pptx',
  'https://ixipzvrdskmboufmdti.supabase.co/storage/v1/object/public/resources/intro_to_rag.pptx',
  ARRAY['rag', 'retrieval', 'generation', 'ai', 'llm']
),
(
  'RAG Deep Dive Video',
  'Video tutorial explaining RAG architecture and implementation',
  'video',
  'resources/rag_deep_dive.mp4',
  'https://ixipzvrdskmboufmdti.supabase.co/storage/v1/object/public/resources/rag_deep_dive.mp4',
  ARRAY['rag', 'video', 'tutorial', 'deep dive']
),
(
  'LLM Fundamentals',
  'Understanding Large Language Models',
  'ppt',
  'resources/llm_fundamentals.pptx',
  'https://ixipzvrdskmboufmdti.supabase.co/storage/v1/object/public/resources/llm_fundamentals.pptx',
  ARRAY['llm', 'language model', 'ai', 'transformer']
),
(
  'Prompt Engineering Guide',
  'Best practices for crafting effective prompts',
  'ppt',
  'resources/prompt_engineering.pptx',
  'https://ixipzvrdskmboufmdti.supabase.co/storage/v1/object/public/resources/prompt_engineering.pptx',
  ARRAY['prompt', 'engineering', 'tips', 'best practices']
);
