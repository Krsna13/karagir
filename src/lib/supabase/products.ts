import { supabase } from './client';
import type { ProductRecord } from '../../types/product';
import type { Database } from './database.types';

type InsertProduct = Database['public']['Tables']['products']['Insert'];
type UpdateProduct = Database['public']['Tables']['products']['Update'];

export const getProductsByArtisan = async (artisanId: string): Promise<ProductRecord[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('artisan_id', artisanId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as ProductRecord[];
};

export const createProduct = async (product: InsertProduct): Promise<ProductRecord | null> => {
  const { data, error } = await supabase
    .from('products')
    // @ts-ignore
    .insert(product as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  return data as ProductRecord;
};

export const updateProduct = async (id: string, updates: UpdateProduct): Promise<ProductRecord | null> => {
  const { data, error } = await supabase
    .from('products')
    // @ts-ignore
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  return data as ProductRecord;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  return true;
};
