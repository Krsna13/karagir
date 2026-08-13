-- Default-deny Row Level Security

-- Enable RLS
alter table artisans enable row level security;
alter table products enable row level security;
alter table materials enable row level security;
alter table orders enable row level security;

-- Artisans Policies
-- Public read access on artisans
create policy "Public read access on artisans" 
on artisans for select using (true);

-- Artisans can only update their own row
create policy "Artisans can update their own row" 
on artisans for update using (auth.uid() = id);

-- (If using standard Supabase auth flow, insert happens via a secure function or triggers. For now, allow auth.uid to insert their own)
create policy "Artisans can insert their own row" 
on artisans for insert with check (auth.uid() = id);

-- Products Policies
-- Public read access on products
create policy "Public read access on products" 
on products for select using (true);

-- Artisans can insert/update/delete their own products
create policy "Artisans can insert own products" 
on products for insert with check (auth.uid() = artisan_id);

create policy "Artisans can update own products" 
on products for update using (auth.uid() = artisan_id);

create policy "Artisans can delete own products" 
on products for delete using (auth.uid() = artisan_id);

-- Materials Policies
-- Public read access on materials
create policy "Public read access on materials" 
on materials for select using (true);
-- No insert/update/delete for users (Service Role only)

-- Orders Policies
-- Orders visible only to the buyer and involved artisan
create policy "Users can view own orders" 
on orders for select using (auth.uid() = buyer_id or auth.uid() = artisan_id);

create policy "Buyers can create orders" 
on orders for insert with check (auth.uid() = buyer_id);

create policy "Users can update own orders" 
on orders for update using (auth.uid() = buyer_id or auth.uid() = artisan_id);
