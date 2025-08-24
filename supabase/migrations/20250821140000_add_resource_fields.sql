/*
  # Add additional fields to resources table

  1. Changes
    - Add email field for email contact
    - Add website field for organization website
    - Add hours field for operating hours
    - Add services field for detailed service description
    - Add eligibility field for eligibility requirements
    - Add languages field for languages spoken
    
  2. Indexes
    - Add index on email for search functionality
*/

-- Add new columns to resources table
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS email text DEFAULT '',
ADD COLUMN IF NOT EXISTS website text DEFAULT '',
ADD COLUMN IF NOT EXISTS hours text DEFAULT '',
ADD COLUMN IF NOT EXISTS services text DEFAULT '',
ADD COLUMN IF NOT EXISTS eligibility text DEFAULT '',
ADD COLUMN IF NOT EXISTS languages text DEFAULT '';

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_resources_email ON resources(email);
CREATE INDEX IF NOT EXISTS idx_resources_services ON resources USING gin(to_tsvector('english', services));
CREATE INDEX IF NOT EXISTS idx_resources_eligibility ON resources USING gin(to_tsvector('english', eligibility));

-- Update the search functionality to include new fields
-- This would be used in future full-text search implementations
