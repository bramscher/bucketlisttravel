-- ============================================================
-- Bucket List Travel - Chat Agent Schema
-- AI trip planning conversations + messages
-- ============================================================

-- ─────────────────────────────────────────────
-- CHAT CONVERSATIONS
-- ─────────────────────────────────────────────
create table public.chat_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  destination_id uuid references public.destinations(id),
  trip_id uuid references public.trips(id) on delete set null,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.chat_conversations enable row level security;

create policy "Users can manage own conversations"
  on public.chat_conversations for all
  using (auth.uid() = user_id);

create policy "Partners can view conversations"
  on public.chat_conversations for select
  using (
    user_id in (
      select partner_id from public.profiles where id = auth.uid() and partner_id is not null
    )
  );

-- ─────────────────────────────────────────────
-- CHAT MESSAGES
-- ─────────────────────────────────────────────
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.chat_conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  tool_calls jsonb,
  tool_results jsonb,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "Users can manage messages via conversation"
  on public.chat_messages for all
  using (
    conversation_id in (
      select id from public.chat_conversations where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index idx_chat_conversations_user on public.chat_conversations(user_id);
create index idx_chat_conversations_updated on public.chat_conversations(user_id, updated_at desc);
create index idx_chat_messages_conversation on public.chat_messages(conversation_id, created_at);
