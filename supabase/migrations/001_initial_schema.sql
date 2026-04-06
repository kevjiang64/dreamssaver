-- Dreams Saver — run in Supabase SQL Editor or via CLI migrations

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'subscribed', 'cancelled', 'past_due')),
  stripe_customer_id text unique,
  ai_insights_used_count integer not null default 0,
  ai_insight_limit integer not null default 5
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data ->> 'email', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title varchar(255),
  description text not null,
  dream_date date not null,
  mood_upon_waking text not null
    check (mood_upon_waking in ('Happy', 'Anxious', 'Calm', 'Neutral', 'Excited')),
  is_lucid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dreams_user_id_created_at on public.dreams (user_id, created_at desc);

create trigger dreams_updated_at
  before update on public.dreams
  for each row execute function public.set_updated_at();

create table if not exists public.dream_insights (
  id uuid primary key default gen_random_uuid(),
  dream_id uuid not null unique references public.dreams (id) on delete cascade,
  insight_text text not null,
  generated_at timestamptz not null default now(),
  ai_model_version varchar(50) not null default 'gemini-2.0-flash'
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name varchar(100) not null,
  created_at timestamptz not null default now(),
  unique (user_id, lower(name))
);

create table if not exists public.dream_tags (
  dream_id uuid not null references public.dreams (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (dream_id, tag_id)
);

alter table public.users enable row level security;
alter table public.dreams enable row level security;
alter table public.dream_insights enable row level security;
alter table public.tags enable row level security;
alter table public.dream_tags enable row level security;

create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Dreams select own"
  on public.dreams for select using (auth.uid() = user_id);

create policy "Dreams insert own"
  on public.dreams for insert with check (auth.uid() = user_id);

create policy "Dreams update own"
  on public.dreams for update using (auth.uid() = user_id);

create policy "Dreams delete own"
  on public.dreams for delete using (auth.uid() = user_id);

create policy "Insights select for own dreams"
  on public.dream_insights for select
  using (
    exists (
      select 1 from public.dreams d
      where d.id = dream_insights.dream_id and d.user_id = auth.uid()
    )
  );

create policy "Insights insert for own dreams"
  on public.dream_insights for insert
  with check (
    exists (
      select 1 from public.dreams d
      where d.id = dream_insights.dream_id and d.user_id = auth.uid()
    )
  );

create policy "Tags all own"
  on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Dream tags via own dreams"
  on public.dream_tags for all
  using (
    exists (
      select 1 from public.dreams d
      where d.id = dream_tags.dream_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dreams d
      where d.id = dream_tags.dream_id and d.user_id = auth.uid()
    )
  );
