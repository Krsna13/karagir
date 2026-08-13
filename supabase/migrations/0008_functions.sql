-- Function to find artisans within a specific radius (in kilometers)
create or replace function get_artisans_within_radius(
  search_lat double precision,
  search_lng double precision,
  radius_km double precision
)
returns table (
  id uuid,
  name text,
  phone text,
  shop_name text,
  location geography(Point, 4326),
  address text,
  category text,
  distance_meters double precision
)
language sql
as $$
  select 
    id, 
    name, 
    phone, 
    shop_name, 
    location, 
    address, 
    category,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography) as distance_meters
  from artisans
  where ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
    radius_km * 1000 -- convert km to meters
  )
  order by distance_meters asc;
$$;
