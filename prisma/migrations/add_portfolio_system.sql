-- src/prisma/migrations/add_portfolio_system.sql

-- Add portfolio/onboarding fields to User model
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN template_id VARCHAR(50) DEFAULT 'minimal';
ALTER TABLE users ADD COLUMN theme_id VARCHAR(50) DEFAULT 'ocean';
ALTER TABLE users ADD COLUMN job_title VARCHAR(100);
ALTER TABLE users ADD COLUMN location VARCHAR(100);
ALTER TABLE users ADD COLUMN resume_url VARCHAR(500);
ALTER TABLE users ADD COLUMN looking_for_work BOOLEAN DEFAULT TRUE;

-- User skills table
CREATE TABLE user_skills (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category VARCHAR(50), -- 'frontend', 'backend', 'database', 'tools', 'soft-skills'
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, skill_name)
);

-- User experience/education table
CREATE TABLE user_experience (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('work', 'education', 'project', 'volunteer')),
  title VARCHAR(200) NOT NULL, -- Job title or degree
  organization VARCHAR(200) NOT NULL, -- Company or school
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  location VARCHAR(100),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio template configurations
CREATE TABLE user_portfolio_config (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  template_id VARCHAR(50) NOT NULL DEFAULT 'minimal',
  theme_id VARCHAR(50) NOT NULL DEFAULT 'ocean',
  custom_css TEXT,
  section_order JSON, -- Array of section names in order
  section_visibility JSON, -- Object with section: boolean visibility
  customizations JSON, -- Template-specific customizations
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Template usage analytics
CREATE TABLE template_analytics (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(50) NOT NULL,
  theme_id VARCHAR(50) NOT NULL,
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- 'selected', 'published', 'viewed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_category ON user_skills(category);
CREATE INDEX idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX idx_user_experience_type ON user_experience(type);
CREATE INDEX idx_template_analytics_template_theme ON template_analytics(template_id, theme_id);
CREATE INDEX idx_template_analytics_created_at ON template_analytics(created_at);