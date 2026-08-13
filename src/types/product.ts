export interface ProductRecord {
  id: string; // uuid
  artisan_id: string; // uuid
  item_type: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  } | null;
  price: number;
  image_urls: string[] | null;
  created_at: string;
}
