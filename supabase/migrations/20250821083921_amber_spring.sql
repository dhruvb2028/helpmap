/*
  # Create resources table for HelpMap

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the resource/organization
      - `type` (text) - Type of resource: Food, Shelter, Health, Blood
      - `address` (text) - Full address of the resource
      - `description` (text) - Description of services provided
      - `contact` (text) - Contact information (phone/email)
      - `latitude` (float) - Latitude coordinate
      - `longitude` (float) - Longitude coordinate
      - `created_at` (timestamp) - When the resource was added

  2. Security
    - Enable RLS on `resources` table
    - Add policy for public read access
    - Add policy for public insert access (no auth required)
*/

-- Create enum for resource types
CREATE TYPE resource_type AS ENUM ('Food', 'Shelter', 'Health', 'Blood');

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type resource_type NOT NULL,
  address text NOT NULL,
  description text DEFAULT '',
  contact text DEFAULT '',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view resources"
  ON resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert resources"
  ON resources
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);