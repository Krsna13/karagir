export interface PrimaryMaterial {
  id: string;
  name: string;
  category: "Wood" | "Metal" | "Clay" | "Stone" | "Fiber";
  ratePerCubicFt: number; // in INR (₹)
  description: string;
  colorHex?: string;
  roughness?: number;
  metalness?: number;
}

export interface SecondaryAccent {
  id: string;
  name: string;
  flatCost: number; // in INR (₹)
}

export interface SurfaceFinish {
  id: string;
  name: string;
  costPerSqFt: number; // in INR (₹)
}

export interface CraftsmanshipGrade {
  id: string;
  label: string;
  multiplier: number;
  experienceTag: string;
}

export interface LocalityFactor {
  pincode: string;
  areaName: string;
  costMultiplier: number; // Local supply/demand factor
}

// 🪵 1. PRIMARY RAW MATERIALS DATABASE
export const PRIMARY_MATERIALS: PrimaryMaterial[] = [
  { id: "mat-teak", name: "Grade-A Sagwan (Teak Wood)", category: "Wood", ratePerCubicFt: 2400, description: "High durability, termite-resistant, rich natural grain.", colorHex: "#8B4513", roughness: 0.4, metalness: 0.1 },
  { id: "mat-sheesham", name: "Indian Sheesham (Rosewood)", category: "Wood", ratePerCubicFt: 1800, description: "Dense grain with high contrast dark streaks.", colorHex: "#5C2C16", roughness: 0.35, metalness: 0.1 },
  { id: "mat-mango", name: "Seasoned Mango Wood", category: "Wood", ratePerCubicFt: 1100, description: "Eco-friendly, lightweight, golden brown undertones.", colorHex: "#C49A45", roughness: 0.5, metalness: 0.05 },
  { id: "mat-brass", name: "Moradabad Cast Brass", category: "Metal", ratePerCubicFt: 3200, description: "Solid rust-proof brass alloy with high lustre.", colorHex: "#D4AF37", roughness: 0.2, metalness: 0.85 },
  { id: "mat-clay", name: "Khurja Glazed Terracotta Clay", category: "Clay", ratePerCubicFt: 650, description: "Mineral-rich baked clay with natural glaze finish.", colorHex: "#C06C4C", roughness: 0.6, metalness: 0.1 },
  { id: "mat-marble", name: "Makrana Pure White Marble", category: "Stone", ratePerCubicFt: 2900, description: "Premium translucent natural white marble.", colorHex: "#F5F5F0", roughness: 0.1, metalness: 0.2 },
  { id: "mat-cane", name: "Assam Natural Rattan / Cane", category: "Fiber", ratePerCubicFt: 850, description: "High tensile flexible natural cane.", colorHex: "#E3C08D", roughness: 0.7, metalness: 0.0 }
];


// 🪔 2. SECONDARY ACCENTS & INLAY ADD-ONS
export const SECONDARY_ACCENTS: SecondaryAccent[] = [
  { id: "acc-brass-wire", name: "Hand-Hammered Brass Wire Inlay", flatCost: 2500 },
  { id: "acc-mop", name: "Mother of Pearl / Bone Tiles", flatCost: 3800 },
  { id: "acc-bells", name: "Hand-Cast Brass Hanging Bells (Set of 6)", flatCost: 1400 },
  { id: "acc-jali", name: "Hand-Carved Wooden Jali Panels", flatCost: 2200 },
  { id: "acc-gold-vark", name: "22K Gold Leafing (Vark) Accents", flatCost: 4500 }
];

// ✨ 3. SURFACE POLISHES & FINISHES
export const SURFACE_FINISHES: SurfaceFinish[] = [
  { id: "fin-beeswax", name: "Organic Beeswax & Linseed Oil (Natural Matte)", costPerSqFt: 85 },
  { id: "fin-pu-gloss", name: "Polyurethane (PU) High Gloss Protective Coat", costPerSqFt: 140 },
  { id: "fin-walnut-stain", name: "Traditional Dark Walnut Hand-Rubbed Stain", costPerSqFt: 110 },
  { id: "fin-shou-sugi", name: "Japanese Shou Sugi Ban Charred Finish", costPerSqFt: 160 }
];

// 🎖️ 4. CRAFTSMANSHIP GRADES
export const CRAFTSMANSHIP_GRADES: CraftsmanshipGrade[] = [
  { id: "grade-std", label: "Standard Karigar", multiplier: 1.0, experienceTag: "3–7 Yrs Exp" },
  { id: "grade-master", label: "Master Craftsman", multiplier: 1.35, experienceTag: "12+ Yrs Exp" },
  { id: "grade-awardee", label: "National Awardee Artisan", multiplier: 1.70, experienceTag: "25+ Yrs Exp / Heritage Guild" }
];

// 📍 5. LOCALITY AREA FACTORS (NASHIK & REGIONAL HUBS)
export const LOCALITY_FACTORS: LocalityFactor[] = [
  { pincode: "422007", areaName: "Satpur MIDC, Nashik", costMultiplier: 0.95 },
  { pincode: "422013", areaName: "Gangapur Road, Nashik", costMultiplier: 1.12 },
  { pincode: "422005", areaName: "College Road, Nashik", costMultiplier: 1.15 },
  { pincode: "422003", areaName: "Panchavati, Nashik", costMultiplier: 1.00 },
  { pincode: "422010", areaName: "Ambad MIDC, Nashik", costMultiplier: 0.92 },
  { pincode: "110015", areaName: "Kirti Nagar, Delhi Hub", costMultiplier: 1.18 },
  { pincode: "247001", areaName: "Saharanpur Woodcraft Cluster", costMultiplier: 0.88 }
];

import { ITEMS_21_DATABASE } from './itemMaterialsDatabase';

// 🪑 6. BASE PRODUCT CATALOG (21 ITEMS DATABASE WITH SUBCATEGORIES)
export const PRODUCT_BASE_CATALOG = ITEMS_21_DATABASE.map(item => ({
  id: item.id,
  name: item.name,
  category: item.categoryGroup,
  baseLabor: item.baseLaborPrice,
  defaultLength: item.defaultLengthFt,
  defaultWidth: item.defaultWidthFt,
  defaultHeight: item.defaultHeightFt,
  sampleImageUrl: item.sampleImageUrl,
  model3DType: item.model3DType,
  subcategories: item.subcategories,
  itemSpec: item
}));



