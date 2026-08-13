import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { ARTISAN_DATABASE } from '../src/data/artisanDatabase';
import { MOCK_ARTISANS } from '../src/data/mockData';
// Assuming running from root with ts-node or similar

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'; // Preferably Service Role Key for migrations

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting data migration...');

  // 1. Migrate Artisans
  for (const artisan of ARTISAN_DATABASE) {
    // Note: To migrate passwords into Supabase Auth properly, you must use the Admin API or just seed the 'artisans' table directly.
    // For this mock data script, we will just insert into the artisans table. 
    // Supabase Auth will not contain these users unless they re-register.
    
    // Convert location to a GeoJSON Point format or WKT for PostGIS
    // A Nashik rough center is used for mock location
    const wktPoint = `POINT(73.7898 19.9975)`;
    
    const { error } = await supabase.from('artisans').insert({
      id: artisan.id.replace('artisan', 'a0000000-0000-0000-0000-00000000'), // mock UUID
      name: artisan.name,
      phone: artisan.phone,
      shop_name: artisan.shopName || null,
      location: wktPoint,
      address: artisan.location,
      category: artisan.craftSpecialty
    });

    if (error) {
      console.error(`Failed to migrate artisan ${artisan.name}:`, error);
    } else {
      console.log(`Migrated artisan: ${artisan.name}`);
    }
  }

  console.log('Data migration complete.');
}

migrate();
