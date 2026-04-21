-- Minimal checkout: orders + order_items

create table if not exists public.orders (
  id text primary key,
  phone text not null,
  customer_name text,
  note text,
  subtotal_amount int not null,
  status text not null default 'new',
  source text not null default 'web',
  created_at timestamptz not null default now(),
  constraint orders_subtotal_nonneg check (subtotal_amount >= 0),
  constraint orders_phone_len check (length(phone) >= 8 and length(phone) <= 20)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  order_id text not null references public.orders (id) on delete cascade,
  product_id text not null references public.products (id) on delete restrict,
  qty int not null,
  unit_price_amount int not null,
  primary key (order_id, product_id),
  constraint order_items_qty_pos check (qty > 0),
  constraint order_items_price_nonneg check (unit_price_amount >= 0)
);

