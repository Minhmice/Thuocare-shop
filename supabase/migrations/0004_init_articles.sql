create table if not exists public.articles (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  cover_image_url text,
  content_html text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists articles_active_published_idx on public.articles (is_active, published_at desc);
create index if not exists articles_featured_idx on public.articles (is_featured);

