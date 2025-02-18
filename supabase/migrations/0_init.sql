-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('admin', 'editor', 'user');
create type star_type as enum ('actor', 'actress');
create type news_status as enum ('published', 'draft', 'archived');
create type comment_status as enum ('pending', 'approved', 'rejected');
create type target_type as enum ('star', 'news');
create type social_platform as enum ('instagram', 'twitter', 'facebook', 'tiktok');

-- Create users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create stars table
create table if not exists stars (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  profile_image_url text,
  star_type star_type not null,
  current_project text,
  birth_date text not null,
  birth_place text not null,
  biography text not null,
  education text not null,
  cover_image_url text,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_rising boolean not null default false,
  is_influential boolean not null default false,
  filmography jsonb,
  gallery_images text[],
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create news table
create table if not exists news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text not null,
  cover_image text not null,
  author_id uuid not null references users(id) on delete cascade,
  star_id uuid references stars(id) on delete cascade,
  status news_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create comments table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  target_type target_type not null,
  target_id uuid not null,
  content text not null,
  status comment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create favorites table
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  star_id uuid not null references stars(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, star_id)
);

-- Create social_media table
create table if not exists social_media (
  id uuid primary key default uuid_generate_v4(),
  star_id uuid not null references stars(id) on delete cascade,
  platform social_platform not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(star_id, platform)
);

-- Create indexes
create index if not exists idx_stars_slug on stars(slug);
create index if not exists idx_news_slug on news(slug);
create index if not exists idx_news_author on news(author_id);
create index if not exists idx_comments_user on comments(user_id);
create index if not exists idx_comments_target on comments(target_type, target_id);
create index if not exists idx_favorites_user on favorites(user_id);
create index if not exists idx_favorites_star on favorites(star_id);
create index if not exists idx_social_media_star on social_media(star_id);

-- Create updated_at triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

create trigger update_stars_updated_at
  before update on stars
  for each row
  execute function update_updated_at_column();

create trigger update_news_updated_at
  before update on news
  for each row
  execute function update_updated_at_column();

create trigger update_comments_updated_at
  before update on comments
  for each row
  execute function update_updated_at_column();

create trigger update_social_media_updated_at
  before update on social_media
  for each row
  execute function update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table users enable row level security;
alter table stars enable row level security;
alter table news enable row level security;
alter table comments enable row level security;
alter table favorites enable row level security;
alter table social_media enable row level security;

-- Users policies
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Admin can view all users"
  on users for select
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

create policy "Admin can update any user"
  on users for update
  using (auth.jwt() ->> 'role' = 'admin');

-- Stars policies
create policy "Anyone can view stars"
  on stars for select
  using (true);

create policy "Admin and editors can create stars"
  on stars for insert
  with check (auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Admin and editors can update stars"
  on stars for update
  using (auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Only admin can delete stars"
  on stars for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- News policies
create policy "Anyone can view published news"
  on news for select
  using (status = 'published' or auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Admin and editors can create news"
  on news for insert
  with check (auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Admin and editors can update news"
  on news for update
  using (auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Only admin can delete news"
  on news for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- Comments policies
create policy "Anyone can view approved comments"
  on comments for select
  using (status = 'approved' or auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Authenticated users can create comments"
  on comments for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own comments"
  on comments for update
  using (auth.uid() = user_id);

create policy "Admin and editors can update any comment"
  on comments for update
  using (auth.jwt() ->> 'role' in ('admin', 'editor'));

create policy "Only admin can delete comments"
  on comments for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- Favorites policies
create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Admin can view all favorites"
  on favorites for select
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Users can create their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- Social media policies
create policy "Anyone can view social media links"
  on social_media for select
  to public
  using (true);

create policy "Admin and editors can manage social media"
  on social_media for all
  using (auth.jwt() ->> 'role' in ('admin', 'editor'));

-- Storage bucket policies
-- Note: These need to be set up in the Supabase dashboard or via the API

-- Create buckets if they don't exist
-- insert into storage.buckets (id, name)
-- values 
--   ('star_images', 'Star profile and gallery images'),
--   ('news_images', 'News article images'),
--   ('user_avatars', 'User profile pictures'),
--   ('gallery_images', 'General gallery images'); 