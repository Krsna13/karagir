create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  artisan_id uuid references artisans(id) on delete cascade,
  item_type text not null,
  material text not null,
  dimensions jsonb,
  price numeric not null,
  image_urls text[],
  created_at timestamptz default now()
);
