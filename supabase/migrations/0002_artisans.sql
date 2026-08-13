create table if not exists artisans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique not null,
  password_hash text,
  shop_name text,
  location geography(Point, 4326) not null,
  address text,
  category text,
  created_at timestamptz default now()
);
