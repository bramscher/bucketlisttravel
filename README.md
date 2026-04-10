# Bucket List Travel

A travel planning and memory platform for couples. Explore destinations rated by cost, safety, and long-stay potential. Plan day-by-day itineraries. Capture memories with photos and stories.

Built with Next.js 14, Supabase, and Tailwind CSS. Ready to deploy on Vercel.

---

## Quick Start

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Then run `supabase/seed.sql` to populate 10 curated destinations
4. Go to **Settings → API** and copy your project URL and anon key

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Enable Google Auth (optional)

1. In Supabase Dashboard → Authentication → Providers → Google
2. Add your Google OAuth client ID and secret
3. Set the redirect URL to `https://your-domain.com/auth/callback`

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add environment variables (same as `.env.local`)
4. Deploy — Vercel auto-detects Next.js

Your site will be live in under a minute.

---

## Architecture

```
bucket-list-travel/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── explore/            # Destination discovery
│   ├── dashboard/          # User's bucket list & stats
│   ├── trips/new/          # Trip planner with itinerary builder
│   ├── memories/           # Memory journal (list + create)
│   └── auth/               # Login, signup, OAuth callback
├── components/
│   ├── destinations/       # DestinationCard, DestinationModal
│   ├── layout/             # Header
│   └── ui/                 # RatingDots, CostLabel, VibeTag, FilterBar
├── lib/
│   ├── supabase.ts         # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client
│   └── types.ts            # TypeScript interfaces
├── supabase/
│   ├── schema.sql          # Full database schema with RLS
│   └── seed.sql            # 10 curated destinations
└── middleware.ts            # Auth protection for routes
```

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, partner linking |
| `destinations` | Curated travel destinations with ratings |
| `bucket_list` | Saved destinations per user (dreaming → visited) |
| `trips` | Planned or completed trips |
| `itinerary_items` | Day-by-day trip activities |
| `memories` | Travel journal entries |
| `memory_photos` | Photos attached to memories |

All tables have Row Level Security (RLS) enabled. Partners can see each other's data.

---

## Features

- **Explore**: Browse destinations filtered by region, vibe, cost, safety, and stay potential
- **Bucket List**: Save destinations, track status from dreaming to visited
- **Trip Planner**: Build day-by-day itineraries with categories (activity, food, transport, stay)
- **Memory Journal**: Write stories, tag moods, upload photos, favorite your best moments
- **Partner Sharing**: Link accounts to share bucket lists, trips, and memories
- **Auth**: Email/password + Google OAuth via Supabase

---

## Design System

- **Colors**: Sky blue (#0EA5E9) + Adventure orange (#F97316) on light (#F0F9FF)
- **Typography**: Cormorant (headings) + Montserrat (body) from Google Fonts
- **Style**: Clean, elegant cards with subtle hover animations
- **Responsive**: Mobile-first, works beautifully from 375px to 1440px+
