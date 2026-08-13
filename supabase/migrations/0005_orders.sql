create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null, -- Note: Assuming basic auth tracking or anon usage initially
  artisan_id uuid references artisans(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'in_production', 'completed', 'cancelled')),
  final_price numeric not null,
  created_at timestamptz default now()
);
