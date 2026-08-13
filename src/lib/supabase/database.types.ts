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
      material_batches: {
        Row: {
          id: string
          order_id: string
          passport_id: string
          material_type: string
          species: string
          grade: string
          supplier_name: string
          purchase_date: string
          status: string
          sample_id: string | null
          sample_status: string
          sample_tracking_number: string | null
          sample_shipped_at: string | null
          sample_received_at: string | null
          sample_verified_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          passport_id: string
          material_type: string
          species: string
          grade: string
          supplier_name: string
          purchase_date: string
          status: string
          sample_id?: string | null
          sample_status?: string
          sample_tracking_number?: string | null
          sample_shipped_at?: string | null
          sample_received_at?: string | null
          sample_verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          passport_id?: string
          material_type?: string
          species?: string
          grade?: string
          supplier_name?: string
          purchase_date?: string
          status?: string
          sample_id?: string | null
          sample_status?: string
          sample_tracking_number?: string | null
          sample_shipped_at?: string | null
          sample_received_at?: string | null
          sample_verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      material_evidence: {
        Row: {
          id: string
          order_id: string
          material_batch_id: string
          type: string
          storage_path: string
          file_hash: string
          captured_at: string | null
          uploaded_at: string | null
          verification_status: string
          created_by: string
          replaced_evidence_id: string | null
        }
        Insert: {
          id?: string
          order_id: string
          material_batch_id: string
          type: string
          storage_path: string
          file_hash: string
          captured_at?: string | null
          uploaded_at?: string | null
          verification_status: string
          created_by: string
          replaced_evidence_id?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          material_batch_id?: string
          type?: string
          storage_path?: string
          file_hash?: string
          captured_at?: string | null
          uploaded_at?: string | null
          verification_status?: string
          created_by?: string
          replaced_evidence_id?: string | null
        }
      }
      certification_records: {
        Row: {
          id: string
          material_batch_id: string
          type: string
          certificate_number: string
          issuing_authority: string
          issuer_name: string
          issued_at: string
          expires_at: string | null
          document_url: string
          verification_status: string
          verification_notes: string | null
          verified_at: string | null
        }
        Insert: {
          id?: string
          material_batch_id: string
          type: string
          certificate_number: string
          issuing_authority: string
          issuer_name: string
          issued_at: string
          expires_at?: string | null
          document_url: string
          verification_status: string
          verification_notes?: string | null
          verified_at?: string | null
        }
        Update: {
          id?: string
          material_batch_id?: string
          type?: string
          certificate_number?: string
          issuing_authority?: string
          issuer_name?: string
          issued_at?: string
          expires_at?: string | null
          document_url?: string
          verification_status?: string
          verification_notes?: string | null
          verified_at?: string | null
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
