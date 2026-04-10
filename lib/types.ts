// ─── Database Types ───

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  country: string | null;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  cost_level: number;
  safety_rating: number;
  return_potential: number;
  best_months: string | null;
  avg_daily_budget: string | null;
  ideal_stay_duration: string | null;
  highlights: string[];
  vibes: string[];
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface BucketListItem {
  id: string;
  user_id: string;
  destination_id: string;
  status: "dreaming" | "planning" | "booked" | "visited";
  priority: number;
  notes: string | null;
  created_at: string;
  destination?: Destination;
}

export interface Trip {
  id: string;
  user_id: string;
  destination_id: string | null;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "planning" | "booked" | "active" | "completed";
  total_budget: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  destination?: Destination;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day_number: number;
  time_slot: "morning" | "afternoon" | "evening" | null;
  title: string;
  description: string | null;
  location: string | null;
  category: "activity" | "food" | "transport" | "accommodation" | "free_time";
  estimated_cost: number | null;
  booking_url: string | null;
  booking_confirmed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  trip_id: string | null;
  destination_id: string | null;
  title: string;
  story: string | null;
  date: string | null;
  mood: "magical" | "adventurous" | "romantic" | "peaceful" | "joyful" | "awestruck" | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  destination?: Destination;
  photos?: MemoryPhoto[];
}

export interface MemoryPhoto {
  id: string;
  memory_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

// ─── Filter & UI Types ───

export type Region = "All" | "Asia Pacific" | "Europe" | "Central & South America" | "Africa" | "Middle East" | "Caribbean" | "North America" | "Pacific" | "Indian Ocean" | "Central Asia" | "Thailand" | "Patagonia";
export type Vibe = "All" | "Adventure" | "Culture" | "Food" | "Nature" | "Romance";
export type SortOption = "name" | "cost-low" | "cost-high" | "safety" | "stay";
export type BucketStatus = "dreaming" | "planning" | "booked" | "visited";

export const REGIONS: Region[] = ["All", "Europe", "Asia Pacific", "Central & South America", "Africa", "Middle East", "Caribbean", "North America", "Pacific", "Indian Ocean", "Central Asia", "Thailand", "Patagonia"];
export const VIBES: Vibe[] = ["All", "Adventure", "Culture", "Food", "Nature", "Romance"];
export const MOODS = ["magical", "adventurous", "romantic", "peaceful", "joyful", "awestruck"] as const;
