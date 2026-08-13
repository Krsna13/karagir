# Karagir Architecture & Data Flow

This document explains the structural data flow of the Karagir application following its migration to a Supabase-backed architecture.

## Overview
Karagir operates as a Single Page Application (SPA) leveraging pure React State (`App.tsx`) for view routing instead of external router libraries. 

## 1. The React Context Layer
The application has two central state providers:
- `KaragirStoreContext.tsx`: Manages the active artisan session (login/register) and tracks the current artisan's draft store setup. 
- `MaterialContext.tsx`: Handles complex state regarding active material selections, finishes, and dimensional adjustments on the 3D Customizer.

## 2. The Services Layer (`src/services/`)
Components and Contexts **never** interact with the database directly. They invoke pure business-logic functions located in `src/services/`:
- `storageService.ts`: Facilitates Auth, Profile CRUD, and Product CRUD.
- `geoService.ts`: Executes radius searches to find artisans near a buyer.
- `pricingService.ts`: Pure mathematical functions for recalculating base prices against raw material adjustments.
- `imageService.ts`: First attempts to fetch an image from the Supabase Storage CDN. If not found, it generates a luxury studio image via Pollinations AI and uploads it back to Supabase.

## 3. The Supabase Data Access Layer (`src/lib/supabase/`)
The `services` layer calls the dedicated domain wrappers located in `lib/supabase`:
- `artisans.ts`: Typed queries against the `artisans` table, including the `get_artisans_within_radius` RPC call.
- `products.ts`: Typed queries against the `products` table.
- `auth.ts`: Wrapper for Supabase Phone Authentication.
- `storage.ts`: Wrapper for Supabase Storage buckets.

## 4. The Database (PostgreSQL + PostGIS)
- **Artisans**: Uses `geography(Point, 4326)` for precise spatial queries.
- **RLS**: Row-Level Security policies are strictly default-deny. Artisans can only mutate their own rows and products.
