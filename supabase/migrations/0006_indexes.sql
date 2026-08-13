create index if not exists artisans_location_idx on artisans using gist (location);
create index if not exists products_artisan_id_idx on products using btree (artisan_id);
create index if not exists orders_artisan_id_idx on orders using btree (artisan_id);
create index if not exists orders_buyer_id_idx on orders using btree (buyer_id);
