import { uploadImage, getImageUrl } from '../lib/supabase/storage';
import { supabase } from '../lib/supabase/client';

const BUCKET_NAME = 'product-images';

/**
 * Tries to fetch an image from Supabase Storage first.
 * If not found, generates via Pollinations AI and uploads it to Supabase for future use.
 */
export const getCachedOrGeneratedImage = async (itemName: string, imageIndex: number = 0): Promise<string> => {
  const sanitizedName = itemName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `ai-generated/${sanitizedName}-${imageIndex}.jpg`;

  // 1. Check if image exists in Supabase Storage
  // (We use a head request equivalent or just try to get public URL and assume it exists if we track it, 
  // but to truly check existence we can list the directory)
  const { data: listData, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('ai-generated', {
      search: `${sanitizedName}-${imageIndex}.jpg`
    });

  if (!listError && listData && listData.length > 0) {
    return getImageUrl(BUCKET_NAME, filePath);
  }

  // 2. Fallback to Pollinations AI
  const prompt = `handcrafted ${itemName} Indian artisanal solid teak wood elegant studio shot high resolution detail ${imageIndex}`;
  const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;

  try {
    // 3. Cache it back to Supabase Storage
    const response = await fetch(aiUrl);
    if (!response.ok) throw new Error('Failed to fetch from Pollinations');
    
    const blob = await response.blob();
    const file = new File([blob], `${sanitizedName}-${imageIndex}.jpg`, { type: 'image/jpeg' });
    
    const uploadedPath = await uploadImage(BUCKET_NAME, filePath, file);
    if (uploadedPath) {
      return getImageUrl(BUCKET_NAME, uploadedPath);
    }
  } catch (error) {
    console.error('Failed to cache AI image to Supabase:', error);
  }

  // If caching fails, just return the AI url directly
  return aiUrl;
};
