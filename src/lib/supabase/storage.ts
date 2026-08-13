import { supabase } from './client';

export const uploadImage = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  return data.path;
};

export const getImageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
