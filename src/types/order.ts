export interface OrderRecord {
  id: string; // uuid
  buyer_id: string; // uuid (assuming buyers also authenticate, or it's just a reference)
  artisan_id: string; // uuid
  product_id: string; // uuid
  status: 'pending' | 'accepted' | 'in_production' | 'completed' | 'cancelled';
  final_price: number;
  created_at: string;
}
