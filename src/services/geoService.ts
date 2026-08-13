import { getArtisansWithinRadius as libGetArtisansWithinRadius } from '../lib/supabase/artisans';
import { APP_CONFIG } from '../config/constants';

export const findArtisansNearLocation = async (
  lat: number = APP_CONFIG.DEFAULT_LOCATION.lat, 
  lng: number = APP_CONFIG.DEFAULT_LOCATION.lng, 
  radiusKm: number = APP_CONFIG.SEARCH_RADIUS_KM
) => {
  return await libGetArtisansWithinRadius(lat, lng, radiusKm);
};
