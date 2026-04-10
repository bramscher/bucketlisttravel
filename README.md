# Bucket List Travel

A travel planning and memory platform for couples. Explore 60 curated destinations rated by cost, safety, and long-stay potential. Build day-by-day trip itineraries. Capture memories with photos and stories.

Built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

**Live repo:** [github.com/bramscher/bucketlisttravel](https://github.com/bramscher/bucketlisttravel)

---

## Current Status

### Working
- Landing page with hero, features overview, and CTAs
- Destination explorer with 60 curated destinations across 12 regions
- Filtering by region, vibe (Adventure, Culture, Food, Nature, Romance), and sorting
- Destination detail modal with highlights, ratings, budget info
- Auth flow (email/password + Google OAuth)
- Protected dashboard with bucket list stats and quick actions
- Save/unsave destinations to bucket list with heart button
- Bucket list status tracking (Dreaming → Planning → Booked → Visited)
- Trip planner with multi-day itinerary builder
- Memory journal — list view and creation with mood, photos, story
- Partner account linking (shared visibility via RLS)
- Middleware route protection for authenticated pages

### Not Yet Built
- Individual destination detail pages (currently modal-only)
- Trip detail/edit page (can create but not view/edit after)
- Memory detail page (list exists but no click-through view)
- Map view of destinations or trips
- Search/text filter for destinations
- Photo gallery within memories
- Budget tracking and trip cost summaries
- Notifications or reminders
- Social sharing
- Mobile app / PWA

---

## Quick Start

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run these in order:
   - `supabase/schema.sql` — tables, RLS policies, indexes, storage bucket, triggers
   - `supabase/seed.sql` — 10 original destinations
   - `supabase/seed-50.sql` — 50 additional destinations
3. Go to **Settings → API** and copy your project URL and anon key

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Enable Google Auth (optional)

1. Supabase Dashboard → Authentication → Providers → Google
2. Add your Google OAuth client ID and secret
3. Set redirect URL to `https://your-domain.com/auth/callback`

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
bucket-list-travel/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout + metadata
│   ├── globals.css             # Tailwind + custom fonts
│   ├── explore/page.tsx        # Destination discovery + filters
│   ├── dashboard/page.tsx      # Bucket list overview + stats
│   ├── trips/new/page.tsx      # Trip planner + itinerary builder
│   ├── memories/
│   │   ├── page.tsx            # Memory journal list
│   │   └── new/page.tsx        # Create memory with photos
│   └── auth/
│       ├── login/page.tsx      # Email/password + Google login
│       ├── signup/page.tsx     # Registration
│       └── callback/route.ts   # OAuth callback handler
├── components/
│   ├── destinations/
│   │   ├── DestinationCard.tsx # Card with image, ratings, save button
│   │   └── DestinationModal.tsx# Full detail modal
│   ├── layout/
│   │   └── Header.tsx          # Sticky nav, auth state, mobile menu
│   └── ui/
│       ├── FilterBar.tsx       # Region/vibe/sort filters
│       ├── RatingDots.tsx      # 1-5 dot rating display
│       ├── CostLabel.tsx       # $ cost level display
│       └── VibeTag.tsx         # Colored vibe badge
├── lib/
│   ├── supabase.ts             # Browser client
│   ├── supabase-server.ts      # Server client (cookie-based)
│   └── types.ts                # TypeScript interfaces + constants
├── supabase/
│   ├── schema.sql              # Full schema + RLS + triggers
│   ├── seed.sql                # 10 original destinations
│   ├── seed-50.sql             # 50 additional destinations
│   └── fix-images.sql          # Image URL cleanup (run before re-seeding)
├── middleware.ts               # Route protection
├── tailwind.config.ts          # Colors, fonts, animations
├── next.config.mjs             # Image domains (Unsplash, Supabase)
└── package.json
```

### Database (7 tables, all with RLS)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with partner linking |
| `destinations` | 60 curated destinations with ratings, vibes, highlights |
| `bucket_list` | Saved destinations per user (dreaming/planning/booked/visited) |
| `trips` | Planned or completed trips |
| `itinerary_items` | Day-by-day activities within trips |
| `memories` | Travel journal entries with mood tags |
| `memory_photos` | Photos attached to memories (Supabase Storage) |

**Storage:** `travel-photos` bucket (public read, authenticated upload)

### Destination Coverage (60 total)

| Region | Count | Examples |
|--------|-------|---------|
| Europe | 13 | Santorini, Amalfi Coast, Swiss Alps, Iceland, Dolomites |
| Asia Pacific | 15 | Kyoto, Bali, Hanoi, Rajasthan, Seoul, Borneo |
| Central & South America | 8 | Machu Picchu, Costa Rica, Galápagos, Oaxaca |
| Africa | 8 | Serengeti, Cape Town, Namibia, Rwanda, Zanzibar |
| Middle East | 3 | Petra, Istanbul, Oman |
| Caribbean | 2 | Cuba, St. Lucia |
| North America | 3 | Banff, Hawaii, Utah |
| Indian Ocean | 3 | Maldives, Seychelles, Mauritius |
| Pacific | 2 | Fiji, Tasmania |
| Central Asia | 1 | Uzbekistan |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth (email + Google OAuth) |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Dates | date-fns |
| Animation | Framer Motion |

---

## Design System

- **Primary:** Sky blue `#0EA5E9` / Dark `#0284C7`
- **Accent:** Orange `#F97316` / Dark `#EA580C`
- **Background:** Light blue `#F0F9FF`
- **Text:** Ocean `#0C4A6E`
- **Headings:** Cormorant (serif)
- **Body:** Montserrat (sans-serif)
- **Responsive:** Mobile-first, 375px to 1440px+

---

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add env variables
4. Deploy — auto-detects Next.js
