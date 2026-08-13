export interface ArtisanRecord {
  id: string; // uuid
  name: string;
  phone: string;
  shop_name: string | null;
  location: any; // PostGIS Point
  address: string | null;
  category: string | null;
  created_at: string;
}
