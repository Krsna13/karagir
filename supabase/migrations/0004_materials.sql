create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  rate_key text unique not null,
  name text not null,
  type text not null,
  unit text not null,
  price_per_unit numeric not null,
  description text,
  created_at timestamptz default now()
);
