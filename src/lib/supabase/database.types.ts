export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artisans: {
        Row: {
          id: string
          name: string
          phone: string
          password_hash: string | null
          shop_name: string | null
          location: any // PostGIS Point is tricky in TS, usually parsed as string or custom object
          address: string | null
          category: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone: string
          password_hash?: string | null
          shop_name?: string | null
          location: any
          address?: string | null
          category?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          password_hash?: string | null
          shop_name?: string | null
          location?: any
          address?: string | null
          category?: string | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          artisan_id: string | null
          item_type: string
          material: string
          dimensions: Json | null
          price: number
          image_urls: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          artisan_id?: string | null
          item_type: string
          material: string
          dimensions?: Json | null
          price: number
          image_urls?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          artisan_id?: string | null
          item_type?: string
          material?: string
          dimensions?: Json | null
          price?: number
          image_urls?: string[] | null
          created_at?: string | null
        }
      }
      materials: {
        Row: {
          id: string
          rate_key: string
          name: string
          type: string
          unit: string
          price_per_unit: number
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          rate_key: string
          name: string
          type: string
          unit: string
          price_per_unit: number
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          rate_key?: string
          name?: string
          type?: string
          unit?: string
          price_per_unit?: number
          description?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          artisan_id: string | null
          product_id: string | null
          status: string
          final_price: number
          created_at: string | null
        }
        Insert: {
          id?: string
          buyer_id: string
          artisan_id?: string | null
          product_id?: string | null
          status: string
          final_price: number
          created_at?: string | null
        }
        Update: {
          id?: string
          buyer_id?: string
          artisan_id?: string | null
          product_id?: string | null
          status?: string
          final_price?: number
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_artisans_within_radius: {
        Args: {
          search_lat: number
          search_lng: number
          radius_km: number
        }
        Returns: {
          id: string
          name: string
          phone: string
          shop_name: string
          location: any
          address: string
          category: string
          distance_meters: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
