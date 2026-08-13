import { supabase } from './client';
import type { ArtisanRecord } from '../../types/artisan';
import type { Database } from './database.types';

type InsertArtisan = Database['public']['Tables']['artisans']['Insert'];
type UpdateArtisan = Database['public']['Tables']['artisans']['Update'];

export const getArtisanById = async (id: string): Promise<ArtisanRecord | null> => {
  const { data, error } = await supabase
    .from('artisans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching artisan:', error);
    return null;
  }
  return data as ArtisanRecord;
};

export const createArtisan = async (artisan: InsertArtisan): Promise<ArtisanRecord | null> => {
  const { data, error } = await supabase
    .from('artisans')
    // @ts-ignore: Supabase types mismatch on exact insert generic
    .insert(artisan as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating artisan:', error);
    return null;
  }
  return data as ArtisanRecord;
};

export const updateArtisan = async (id: string, updates: UpdateArtisan): Promise<ArtisanRecord | null> => {
  const { data, error } = await supabase
    .from('artisans')
    // @ts-ignore: Supabase types mismatch on exact update generic
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating artisan:', error);
    return null;
  }
  return data as ArtisanRecord;
};

export const getArtisansWithinRadius = async (lat: number, lng: number, radiusKm: number) => {
  const { data, error } = await supabase
    // @ts-ignore: Supabase types mismatch on RPC generic
    .rpc('get_artisans_within_radius', {
      search_lat: lat,
      search_lng: lng,
      radius_km: radiusKm,
    } as any);

  if (error) {
    console.error('Error fetching artisans within radius:', error);
    return [];
  }
  return data;
};
