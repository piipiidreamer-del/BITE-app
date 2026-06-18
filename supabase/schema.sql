-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  nickname        text not null,
  user_handle     text unique not null,
  icon_char       text not null default 'B',
  icon_bg_color   text not null default '#7C3AED',
  icon_text_color text not null default '#ffffff',
  streak          int  not null default 0,
  last_post_date  date,
  first_bite_done boolean not null default false,
  created_at      timestamptz default now()
);

alter table profiles enable row level security;
create policy "Public read" on profiles for select using (true);
create policy "Own update"  on profiles for update using (auth.uid() = id);
create policy "Own insert"  on profiles for insert with check (auth.uid() = id);

-- ─── POSTS ───────────────────────────────────────────────────────────────────
create table posts (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  caption      text,
  image_top    text not null,
  image_middle text not null,
  image_bottom text not null,
  is_first_bite boolean default false,
  created_at   timestamptz default now()
);

create index on posts(user_id, created_at desc);

alter table posts enable row level security;
create policy "Auth read"  on posts for select using (auth.role() = 'authenticated');
create policy "Own insert" on posts for insert with check (auth.uid() = user_id);
create policy "Own delete" on posts for delete using (auth.uid() = user_id);

-- ─── FRIENDSHIPS ─────────────────────────────────────────────────────────────
create table friendships (
  id           uuid primary key default uuid_generate_v4(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status       text not null default 'pending',
  created_at   timestamptz default now(),
  unique(requester_id, addressee_id)
);

alter table friendships enable row level security;
create policy "Involved read"     on friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "Requester insert"  on friendships for insert
  with check (auth.uid() = requester_id);
create policy "Addressee update"  on friendships for update
  using (auth.uid() = addressee_id or auth.uid() = requester_id);
create policy "Involved delete"   on friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ─── REACTIONS ───────────────────────────────────────────────────────────────
create table reactions (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references posts(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  emoji      text not null check (emoji in ('drool','plead','neutral')),
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table reactions enable row level security;
create policy "Auth read"  on reactions for select using (auth.role() = 'authenticated');
create policy "Own insert" on reactions for insert with check (auth.uid() = user_id);
create policy "Own update" on reactions for update using (auth.uid() = user_id);
create policy "Own delete" on reactions for delete using (auth.uid() = user_id);

-- ─── COMMENTS ────────────────────────────────────────────────────────────────
create table comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references posts(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  body       text not null,
  created_at timestamptz default now()
);

alter table comments enable row level security;
create policy "Auth read"  on comments for select using (auth.role() = 'authenticated');
create policy "Own insert" on comments for insert with check (auth.uid() = user_id);
create policy "Own delete" on comments for delete using (auth.uid() = user_id);

-- ─── POST VIEWS ──────────────────────────────────────────────────────────────
create table post_views (
  id        uuid primary key default uuid_generate_v4(),
  post_id   uuid not null references posts(id) on delete cascade,
  viewer_id uuid not null references profiles(id) on delete cascade,
  viewed_at timestamptz default now(),
  unique(post_id, viewer_id)
);

alter table post_views enable row level security;
create policy "Own read"   on post_views for select using (auth.uid() = viewer_id);
create policy "Own insert" on post_views for insert with check (auth.uid() = viewer_id);

-- ─── STORAGE ─────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict do nothing;

create policy "Auth upload" on storage.objects
  for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
create policy "Public read" on storage.objects
  for select using (bucket_id = 'post-images');
create policy "Own delete"  on storage.objects
  for delete using (bucket_id = 'post-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─── STREAK TRIGGER ──────────────────────────────────────────────────────────
create or replace function update_streak()
returns trigger language plpgsql security definer as $$
declare
  last_date date;
begin
  select last_post_date into last_date from profiles where id = new.user_id;
  if last_date = current_date - 1 then
    update profiles set streak = streak + 1, last_post_date = current_date where id = new.user_id;
  elsif last_date = current_date then
    null;
  else
    update profiles set streak = 1, last_post_date = current_date where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger on_post_insert
  after insert on posts
  for each row execute function update_streak();
