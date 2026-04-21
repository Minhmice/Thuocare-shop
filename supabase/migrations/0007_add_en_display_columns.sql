-- Placeholder English display columns (generated from slugs)
-- Non-destructive: keep original VN fields, app can prefer *_en.

alter table public.brands
  add column if not exists name_en text;

alter table public.categories
  add column if not exists name_en text;

alter table public.products
  add column if not exists title_en text,
  add column if not exists short_title_en text;

-- helper: Title Case from slug/segments (placeholder, not real translation)
create or replace function public._lc_title_from_slug(slug text)
returns text
language sql
immutable
as $$
  select initcap(replace(
    regexp_replace(coalesce(slug,''), '^.*/', ''), -- last segment
    '-', ' '
  ))
$$;

-- Fill placeholders (safe rerun)
update public.brands
set name_en = coalesce(name_en, public._lc_title_from_slug(slug))
where name_en is null or name_en = '';

update public.categories
set name_en = coalesce(name_en, public._lc_title_from_slug(slug))
where name_en is null or name_en = '';

update public.products
set
  title_en = coalesce(title_en, public._lc_title_from_slug(regexp_replace(slug, '\\.html$', ''))),
  short_title_en = coalesce(short_title_en, public._lc_title_from_slug(regexp_replace(slug, '\\.html$', '')))
where (title_en is null or title_en = '')
   or (short_title_en is null or short_title_en = '');

