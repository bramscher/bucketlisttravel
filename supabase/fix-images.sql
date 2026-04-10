-- ============================================================
-- Fix broken Unsplash image URLs (12 destinations + 1 duplicate)
-- Run this in SQL Editor to update existing rows
-- ============================================================

-- First, delete the old seed-50 data if it was already inserted (safe to re-run)
DELETE FROM public.destinations WHERE name IN (
  'Santorini, Greece', 'Amalfi Coast, Italy', 'Dubrovnik, Croatia',
  'Swiss Alps, Switzerland', 'Lisbon, Portugal', 'Edinburgh, Scotland',
  'Barcelona, Spain', 'Reykjavik & Golden Circle, Iceland', 'Cinque Terre, Italy',
  'Prague, Czech Republic', 'Cusco & Machu Picchu, Peru', 'Costa Rica',
  'Galápagos Islands, Ecuador', 'Patagonian Lake District, Argentina',
  'Cartagena, Colombia', 'Oaxaca, Mexico', 'Petra & Wadi Rum, Jordan',
  'Istanbul, Turkey', 'Oman', 'Hanoi & Ha Long Bay, Vietnam',
  'Luang Prabang, Laos', 'Rajasthan, India', 'Sri Lanka',
  'Siem Reap, Cambodia', 'Seoul, South Korea', 'Taipei, Taiwan',
  'Fiji', 'Tasmania, Australia', 'Victoria Falls, Zambia/Zimbabwe',
  'Madagascar', 'Zanzibar, Tanzania', 'Namibia', 'Rwanda',
  'Cuba', 'St. Lucia', 'Banff & Canadian Rockies, Canada',
  'Hawaii (Big Island)', 'Utah''s Mighty Five, USA',
  'Borneo, Malaysia', 'Philippines (Palawan & Siargao)',
  'Myanmar (Burma)', 'Hokkaido, Japan', 'Zhangjiajie, China',
  'Maldives', 'Seychelles', 'Mauritius', 'Uzbekistan',
  'Norwegian Fjords, Norway', 'Provence, France', 'Dolomites, Italy'
);
