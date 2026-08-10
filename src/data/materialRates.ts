export type Unit = "CFT" | "Sq.Ft" | "Kg" | "Ltr" | "Meter" | "Piece" | "Set" | "Pair";

export interface MaterialRate {
  key: string;
  category: string;
  name: string;
  unit: Unit;
  minPriceINR?: number; // undefined = use avg ± 10% fallback
  avgPriceINR: number;
  maxPriceINR?: number;
}

export const MATERIAL_RATES: MaterialRate[] = [
  // Solid Timber
  { key: "sagwan_teak", category: "Solid Timber", name: "Sagwan (Teak Wood)", unit: "CFT", avgPriceINR: 2400 },
  { key: "sheesham", category: "Solid Timber", name: "Sheesham (Rosewood)", unit: "CFT", avgPriceINR: 1800 },
  { key: "mango_wood", category: "Solid Timber", name: "Mango Wood", unit: "CFT", avgPriceINR: 1100 },
  { key: "oak_walnut", category: "Solid Timber", name: "Oak / Walnut", unit: "CFT", avgPriceINR: 3500 },
  { key: "rattan_cane_raw", category: "Solid Timber", name: "Assam Rattan/Cane", unit: "CFT", avgPriceINR: 850 }, // TODO: verify confirm rattan raw-stock vs webbing

  // Plywood & Boards
  { key: "marine_bwp_ply", category: "Plywood & Boards", name: "Marine Grade BWP", unit: "Sq.Ft", avgPriceINR: 135 },
  { key: "bwr_ply", category: "Plywood & Boards", name: "BWR Grade Plywood", unit: "Sq.Ft", avgPriceINR: 95 }, // TODO: verify Commercial Plywood vs BWR
  { key: "hdmr_mdf", category: "Plywood & Boards", name: "HDMR / MDF Board", unit: "Sq.Ft", avgPriceINR: 110 }, // TODO: verify HDMR/BWP Plywood Board vs HDMR/BWP
  { key: "laminate_1mm", category: "Plywood & Boards", name: "Laminate Sheet (1mm)", unit: "Sq.Ft", avgPriceINR: 60 },
  { key: "veneer_ply", category: "Plywood & Boards", name: "Veneer-Faced Plywood", unit: "Sq.Ft", avgPriceINR: 180 },
  { key: "acrylic_hg_laminate", category: "Plywood & Boards", name: "Acrylic / High-Gloss Laminate", unit: "Sq.Ft", avgPriceINR: 120 },
  { key: "fluted_panels", category: "Plywood & Boards", name: "Fluted Charcoal Panels", unit: "Sq.Ft", avgPriceINR: 150 },
  { key: "louvered_slats", category: "Plywood & Boards", name: "Louvered Wooden Slats", unit: "Sq.Ft", avgPriceINR: 200 },

  // Metals & Brass
  { key: "cast_brass", category: "Metals & Brass", name: "Cast Brass / Bronze", unit: "Kg", avgPriceINR: 3200 },
  { key: "ss304", category: "Metals & Brass", name: "Stainless Steel (SS 304)", unit: "Kg", avgPriceINR: 350 },
  { key: "wrought_iron", category: "Metals & Brass", name: "Wrought Iron / Mild Steel", unit: "Kg", avgPriceINR: 180 },
  { key: "powder_steel_frame", category: "Metals & Brass", name: "Powder-Coated Steel Frame", unit: "Piece", avgPriceINR: 1500 },

  // Upholstery & Foam
  { key: "foam_40d", category: "Upholstery & Foam", name: "High-Density Foam (40D)", unit: "Sq.Ft", avgPriceINR: 150 },
  { key: "leather", category: "Upholstery & Foam", name: "Genuine Leather", unit: "Sq.Ft", avgPriceINR: 450 },
  { key: "velvet_linen", category: "Upholstery & Foam", name: "Premium Velvet / Linen", unit: "Meter", avgPriceINR: 800 },
  { key: "pu_leatherette", category: "Upholstery & Foam", name: "PU Leatherette", unit: "Meter", avgPriceINR: 350 },
  { key: "cotton_linen", category: "Upholstery & Foam", name: "Cotton Linen Blend", unit: "Meter", avgPriceINR: 250 },
  { key: "cane_webbing", category: "Upholstery & Foam", name: "Rattan / Cane Webbing", unit: "Sq.Ft", avgPriceINR: 90 }, // TODO: verify rattan webbing

  // Stone & Glass
  { key: "makrana_marble", category: "Stone & Glass", name: "Makrana White Marble", unit: "Sq.Ft", avgPriceINR: 2900 },
  { key: "italian_marble", category: "Stone & Glass", name: "Italian Marble", unit: "Sq.Ft", avgPriceINR: 4500 },
  { key: "toughened_glass", category: "Stone & Glass", name: "Toughened / Tempered Glass", unit: "Sq.Ft", avgPriceINR: 250 },
  { key: "mirror_glass", category: "Stone & Glass", name: "Float Mirror Glass", unit: "Sq.Ft", avgPriceINR: 180 },
  { key: "reeded_glass", category: "Stone & Glass", name: "Fluted / Reeded Glass", unit: "Sq.Ft", avgPriceINR: 350 },
  { key: "mop_tile", category: "Stone & Glass", name: "Bone / Mother of Pearl Tile", unit: "Sq.Ft", avgPriceINR: 3800 },

  // Finishes
  { key: "pu_polish", category: "Finishes", name: "PU Polish / Lacquer", unit: "Sq.Ft", avgPriceINR: 140 },
  { key: "beeswax_oil", category: "Finishes", name: "Beeswax & Linseed Oil", unit: "Sq.Ft", avgPriceINR: 85 },
  { key: "duco_paint", category: "Finishes", name: "High-Gloss Duco Paint", unit: "Sq.Ft", avgPriceINR: 160 },

  // Hardware
  { key: "drawer_runners", category: "Hardware", name: "Telescopic Ball-Bearing Runners", unit: "Pair", avgPriceINR: 450 },
  { key: "gas_lift_struts", category: "Hardware", name: "Hydraulic Gas Lift Struts", unit: "Pair", avgPriceINR: 1200 },
  { key: "concealed_hinges", category: "Hardware", name: "Soft-Close Concealed Hinges", unit: "Pair", avgPriceINR: 350 },
  { key: "tray_mechanism", category: "Hardware", name: "Tilt-Out Tray Mechanism", unit: "Set", avgPriceINR: 850 },
  { key: "door_hardware_set", category: "Hardware", name: "SS Hinges & Handles Set", unit: "Set", avgPriceINR: 1500 }
];

export type QuantityBasis = "volume_cuft" | "surface_area_sqft" | "top_area_sqft" | "fixed_qty";

export const QUANTITY_DEFAULTS: Record<QuantityBasis, number> = {
  volume_cuft: 0.18, // structural members ≈ 18% of the bounding volume
  surface_area_sqft: 0.60, // cladding/panels cover ≈ 60% of total surface
  top_area_sqft: 1.0, // tops/mirrors/overlays use the full top footprint
  fixed_qty: 1, // hardware — one unit per slot unless user override
};

export interface Dimensions {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
}

export function volumeCuFt(d: Dimensions) {
  return d.lengthFt * d.widthFt * d.heightFt;
}

export function totalSurfaceAreaSqFt(d: Dimensions) {
  return 2 * (d.lengthFt * d.widthFt + d.lengthFt * d.heightFt + d.widthFt * d.heightFt);
}

export function topAreaSqFt(d: Dimensions) {
  return d.lengthFt * d.widthFt;
}

export interface ItemMaterialSlot {
  role: string;
  rateKey: string;
  quantityBasis: QuantityBasis;
  quantityFactor: number;
  removable?: boolean;
  defaultSelected?: boolean;
}

export interface CostLine {
  role: string;
  materialName: string;
  quantity: number;
  unit: Unit;
  lineMin: number;
  lineAvg: number;
  lineMax: number;
}

export interface CostEstimate {
  min: number;
  avg: number;
  max: number;
  breakdown: CostLine[];
}

export interface Locality {
  city: "Mumbai" | "Pune" | "Nashik";
  name: string;
  pincode: string;
  costFactor: number;
}

export const LOCALITIES: Locality[] = [
  // Nashik
  { city: "Nashik", name: "Satpur MIDC", pincode: "422007", costFactor: 0.95 },
  { city: "Nashik", name: "Gangapur Road", pincode: "422013", costFactor: 0.97 },
  { city: "Nashik", name: "Panchavati", pincode: "422003", costFactor: 0.96 },
  { city: "Nashik", name: "Ambad MIDC", pincode: "422010", costFactor: 0.95 },
  { city: "Nashik", name: "College Road", pincode: "422005", costFactor: 0.98 },
  // Pune
  { city: "Pune", name: "Hinjewadi", pincode: "411057", costFactor: 1.05 },
  { city: "Pune", name: "Kothrud", pincode: "411038", costFactor: 1.08 },
  { city: "Pune", name: "Shivajinagar", pincode: "411005", costFactor: 1.10 },
  // Mumbai
  { city: "Mumbai", name: "Andheri", pincode: "400053", costFactor: 1.20 },
  { city: "Mumbai", name: "Bandra", pincode: "400050", costFactor: 1.25 },
  { city: "Mumbai", name: "Dadar", pincode: "400028", costFactor: 1.22 }
];

export function calculateEstimatedCost(
  dimensions: Dimensions,
  selectedSlots: ItemMaterialSlot[],
  craftsmanshipMultiplier: number,
  locality: Locality
): CostEstimate {
  const volume = volumeCuFt(dimensions);
  const surface = totalSurfaceAreaSqFt(dimensions);
  const top = topAreaSqFt(dimensions);

  const breakdown: CostLine[] = selectedSlots.map((slot) => {
    const rate = MATERIAL_RATES.find((r) => r.key === slot.rateKey);
    if (!rate) {
      console.warn(`Material rate not found for key: ${slot.rateKey}`);
      return {
        role: slot.role,
        materialName: "Unknown",
        quantity: 0,
        unit: "Piece",
        lineMin: 0,
        lineAvg: 0,
        lineMax: 0
      } as CostLine;
    }

    const basisValue = { 
      volume_cuft: volume, 
      surface_area_sqft: surface, 
      top_area_sqft: top,
      fixed_qty: 1
    }[slot.quantityBasis] || 1;

    const quantity = slot.quantityBasis === "fixed_qty" 
      ? slot.quantityFactor 
      : basisValue * slot.quantityFactor;

    const min = rate.minPriceINR ?? rate.avgPriceINR * 0.9;
    const max = rate.maxPriceINR ?? rate.avgPriceINR * 1.1;

    return {
      role: slot.role,
      materialName: rate.name,
      quantity: Math.round(quantity * 100) / 100,
      unit: rate.unit,
      lineMin: quantity * min * craftsmanshipMultiplier * locality.costFactor,
      lineAvg: quantity * rate.avgPriceINR * craftsmanshipMultiplier * locality.costFactor,
      lineMax: quantity * max * craftsmanshipMultiplier * locality.costFactor,
    };
  });

  const sum = (k: "lineMin" | "lineAvg" | "lineMax") => breakdown.reduce((s, l) => s + l[k], 0);

  return {
    min: sum("lineMin"),
    avg: sum("lineAvg"),
    max: sum("lineMax"),
    breakdown
  };
}
