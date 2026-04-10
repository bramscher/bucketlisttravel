-- ============================================================
-- Bucket List Travel - Supabase Database Schema
-- A travel planning & memory platform for couples
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  partner_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() = partner_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- DESTINATIONS
-- ─────────────────────────────────────────────
create table public.destinations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  region text not null,
  country text,
  tagline text,
  description text,
  image_url text,
  cost_level int check (cost_level between 1 and 5),       -- 1=budget, 5=luxury
  safety_rating int check (safety_rating between 1 and 5),
  return_potential int check (return_potential between 1 and 5), -- "could we live here?"
  best_months text,
  avg_daily_budget text,
  ideal_stay_duration text,
  highlights text[] default '{}',
  vibes text[] default '{}',            -- Adventure, Culture, Food, Nature, Romance
  latitude decimal(10,7),
  longitude decimal(10,7),
  created_at timestamptz default now()
);

alter table public.destinations enable row level security;

create policy "Destinations are viewable by everyone"
  on public.destinations for select
  using (true);

-- ─────────────────────────────────────────────
-- BUCKET LIST (saved destinations per couple)
-- ─────────────────────────────────────────────
create table public.bucket_list (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  destination_id uuid references public.destinations(id) on delete cascade not null,
  status text default 'dreaming' check (status in ('dreaming', 'planning', 'booked', 'visited')),
  priority int default 0,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, destination_id)
);

alter table public.bucket_list enable row level security;

create policy "Users can manage own bucket list"
  on public.bucket_list for all
  using (auth.uid() = user_id);

-- Partners can see each other's bucket list
create policy "Partners can view bucket list"
  on public.bucket_list for select
  using (
    user_id in (
      select id from public.profiles where id = auth.uid()
      union
      select partner_id from public.profiles where id = auth.uid() and partner_id is not null
    )
  );

-- ─────────────────────────────────────────────
-- TRIPS (planned or completed)
-- ─────────────────────────────────────────────
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  destination_id uuid references public.destinations(id),
  title text not null,
  description text,
  cover_image_url text,
  start_date date,
  end_date date,
  status text default 'planning' check (status in ('planning', 'booked', 'active', 'completed')),
  total_budget decimal(10,2),
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.trips enable row level security;

create policy "Users can manage own trips"
  on public.trips for all
  using (auth.uid() = user_id);

create policy "Partners can view trips"
  on public.trips for select
  using (
    user_id in (
      select partner_id from public.profiles where id = auth.uid() and partner_id is not null
    )
  );

-- ─────────────────────────────────────────────
-- ITINERARY ITEMS (day-by-day planning)
-- ─────────────────────────────────────────────
create table public.itinerary_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number int not null,
  time_slot text,                       -- 'morning', 'afternoon', 'evening'
  title text not null,
  description text,
  location text,
  category text check (category in ('activity', 'food', 'transport', 'accommodation', 'free_time')),
  estimated_cost decimal(10,2),
  booking_url text,
  booking_confirmed boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.itinerary_items enable row level security;

create policy "Users can manage itinerary via trip"
  on public.itinerary_items for all
  using (
    trip_id in (select id from public.trips where user_id = auth.uid())
  );

-- ─────────────────────────────────────────────
-- MEMORIES (travel journal entries)
-- ─────────────────────────────────────────────
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  trip_id uuid references public.trips(id) on delete set null,
  destination_id uuid references public.destinations(id),
  title text not null,
  story text,                           -- rich text / markdown
  date date,
  mood text check (mood in ('magical', 'adventurous', 'romantic', 'peaceful', 'joyful', 'awestruck')),
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.memories enable row level security;

create policy "Users can manage own memories"
  on public.memories for all
  using (auth.uid() = user_id);

create policy "Partners can view memories"
  on public.memories for select
  using (
    user_id in (
      select partner_id from public.profiles where id = auth.uid() and partner_id is not null
    )
  );

-- ─────────────────────────────────────────────
-- MEMORY PHOTOS
-- ─────────────────────────────────────────────
create table public.memory_photos (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  storage_path text not null,           -- path in Supabase Storage
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.memory_photos enable row level security;

create policy "Users can manage photos via memory"
  on public.memory_photos for all
  using (
    memory_id in (select id from public.memories where user_id = auth.uid())
  );

-- ─────────────────────────────────────────────
-- STORAGE BUCKET for photos
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('travel-photos', 'travel-photos', true)
on conflict do nothing;

create policy "Users can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'travel-photos'
    and auth.uid() is not null
  );

create policy "Users can view all photos"
  on storage.objects for select
  using (bucket_id = 'travel-photos');

create policy "Users can delete own photos"
  on storage.objects for delete
  using (
    bucket_id = 'travel-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────
create index idx_bucket_list_user on public.bucket_list(user_id);
create index idx_bucket_list_dest on public.bucket_list(destination_id);
create index idx_trips_user on public.trips(user_id);
create index idx_itinerary_trip on public.itinerary_items(trip_id);
create index idx_memories_user on public.memories(user_id);
create index idx_memories_trip on public.memories(trip_id);
create index idx_memory_photos_memory on public.memory_photos(memory_id);
create index idx_destinations_region on public.destinations(region);
