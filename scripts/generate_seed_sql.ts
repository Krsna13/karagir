import * as fs from 'fs';
import { ARTISAN_DATABASE } from '../src/data/artisanDatabase';
import { regionalArtisansDatabase } from '../src/data/regionalArtisansDatabase';

let sql = `-- Seed Script for Auth Users and Artisans
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cleanup any previous mock attempts to allow clean re-runs
DELETE FROM public.artisans WHERE phone LIKE '9%';
DELETE FROM auth.users WHERE email LIKE '%@karagir.local';

DO $$
DECLARE
  new_user_id uuid;
BEGIN
`;

// Merge both databases
const allArtisans = [
  ...ARTISAN_DATABASE.map(a => ({
    name: a.name,
    phone: a.phone,
    shopName: a.shopName || '',
    category: a.craftSpecialty,
    address: a.location,
    // Provide a default coordinate for global artisans
    lat: 19.9975,
    lng: 73.7898
  })),
  ...regionalArtisansDatabase.map(a => ({
    name: a.name,
    phone: a.mobileNo,
    shopName: a.shopName,
    category: a.craftCategory,
    address: a.address,
    lat: a.lat,
    lng: a.lng
  }))
];

const uniqueArtisans = [];
const seenPhones = new Set();
for (const a of allArtisans) {
  if (!seenPhones.has(a.phone)) {
    uniqueArtisans.push(a);
    seenPhones.add(a.phone);
  }
}

for (const artisan of uniqueArtisans) {
  const pseudoEmail = `${artisan.phone}@karagir.local`;
  const pointWkt = `POINT(${artisan.lng} ${artisan.lat})`;

  sql += `
  -- Artisan: ${artisan.name} (${artisan.phone})
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '${pseudoEmail}', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "${artisan.name}", "phone": "${artisan.phone}"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '${pseudoEmail}')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, '${artisan.name}', '${artisan.phone}', '123456', '${artisan.shopName}', 
    ST_GeomFromText('${pointWkt}', 4326), '${artisan.address.replace(/'/g, "''")}', '${artisan.category}'
  );
`;
}

sql += `
END $$;
`;

fs.writeFileSync('supabase_seed.sql', sql);
console.log('Generated supabase_seed.sql successfully with ' + uniqueArtisans.length + ' artisans.');
