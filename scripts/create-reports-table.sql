-- Create reports table to store saved reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE,
  end_date DATE,
  audience VARCHAR(100),
  sections JSONB,
  notes TEXT,
  content JSONB,
  user_id TEXT REFERENCES neon_auth.users_sync(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
