export interface MaterialMapping {
  id: string;
  category: string;
  productName: string;
  primaryMaterial: string[];
  secondaryMaterials: string[];
  finishes: string[];
  regionalHub: string;
}

export interface MaterialCategoryBucket {
  name: string;
  icon: string;
  description: string;
  items: string[];
}

export const MATERIAL_BUCKETS: MaterialCategoryBucket[] = [
  {
    name: 'Solid Woods',
    icon: '🪵',
    description: 'Heirloom timber with natural grain patterns',
    items: ['Sagwan (Teak Wood)', 'Sheesham (Rosewood)', 'Mango Wood', 'Walnut']
  },
  {
    name: 'Metals',
    icon: '🪔',
    description: 'Heavy cast & hand-hammered metallurgy',
    items: ['Moradabad Brass', 'Bronze (Kansa)', 'Copper', 'Zinc (Bidriware)']
  },
  {
    name: 'Clays & Minerals',
    icon: '🏺',
    description: 'Earth & stone molded by artisan hands',
    items: ['Alluvial River Clay', 'Quartz Powder', 'Kaolin Pottery Clay', 'Soapstone', 'Makrana Marble']
  },
  {
    name: 'Natural Fibers',
    icon: '🧺',
    description: 'Sustainable hand-woven organic weaves',
    items: ['Assam Cane', 'Malaysian Rattan', 'Seasoned Bamboo', 'Sikki Grass', 'Raw Jute']
  }
];

export const QUICK_MATERIAL_PILLS = [
  { id: 'sagwan', label: '#SagwanTeak', query: 'Teak' },
  { id: 'sheesham', label: '#SheeshamWood', query: 'Sheesham' },
  { id: 'brass', label: '#MoradabadBrass', query: 'Brass' },
  { id: 'clay', label: '#KhurjaClay', query: 'Clay' },
  { id: 'marble', label: '#MakranaMarble', query: 'Marble' },
  { id: 'cane', label: '#AssamCane', query: 'Cane' },
  { id: 'silk', label: '#MulberrySilk', query: 'Silk' }
];

export const materialsMasterDatabase: MaterialMapping[] = [
  {
    id: "mat-01",
    category: "Woodwork & Furniture",
    productName: "Carved Dining Sets & Sofas",
    primaryMaterial: ["Sagwan (Teak Wood)", "Sheesham (Rosewood)", "Mango Wood"],
    secondaryMaterials: ["Brass Hinges", "Iron Dowels", "Cotton Upholstery"],
    finishes: ["Linseed Oil", "Natural Beeswax", "PU Polish"],
    regionalHub: "Saharanpur, Kirti Nagar, Satpur MIDC Nashik"
  },
  {
    id: "mat-02",
    category: "Furniture & Storage",
    productName: "Brass-Inlaid Sideboards & Tables",
    primaryMaterial: ["Sheesham Wood", "Rosewood"],
    secondaryMaterials: ["Brass Wire", "Solid Brass Strips", "Mother of Pearl"],
    finishes: ["Tree Resin Polish", "Walnut Stain"],
    regionalHub: "Hoshiarpur, Saharanpur, Panchavati Nashik"
  },
  {
    id: "mat-03",
    category: "Sacred Spaces",
    productName: "Carved Wooden Mandirs",
    primaryMaterial: ["Sagwan Teak", "Sheesham"],
    secondaryMaterials: ["Hanging Brass Bells", "Gold Leafing (Vark)"],
    finishes: ["Natural Polish", "Lacquer Colors"],
    regionalHub: "Saharanpur, Jaipur, Ahmedabad"
  },
  {
    id: "mat-04",
    category: "Metalware & Decor",
    productName: "Handcrafted Brass Urlis & Diyas",
    primaryMaterial: ["Brass Alloy (Copper + Zinc)", "Bronze (Kansa)"],
    secondaryMaterials: ["Clay Mold", "Beeswax"],
    finishes: ["Tamarind Polish", "Pitambari Buffing"],
    regionalHub: "Moradabad, Ambad MIDC Nashik, Bastar"
  },
  {
    id: "mat-05",
    category: "Pottery & Ceramics",
    productName: "Jaipur Blue Pottery Vases",
    primaryMaterial: ["Quartz Powder", "Glass Cullet", "Multani Mitti"],
    secondaryMaterials: ["Cobalt Oxide (Dark Blue)", "Copper Oxide (Turquoise)"],
    finishes: ["Glaze Powder Finish"],
    regionalHub: "Jaipur, College Road Nashik"
  },
  {
    id: "mat-06",
    category: "Natural Fiber Craft",
    productName: "Cane & Rattan Balcony Furniture",
    primaryMaterial: ["Natural Rattan Stems", "Seasoned Bamboo"],
    secondaryMaterials: ["Jute Twine", "Split Bamboo Ribbons"],
    finishes: ["Clear Protective Lacquer"],
    regionalHub: "Assam, Gangapur Road Nashik, Tripura"
  }
];

export const BASE_MATERIAL_PRICE_DELTAS: Record<string, { delta: number; label: string; roughness: number; metalness: number; colorHex: number }> = {
  'Sagwan (Teak Wood)': { delta: 0, label: 'Base Workshop Price', roughness: 0.35, metalness: 0.05, colorHex: 0xc87d46 },
  'Sheesham (Rosewood)': { delta: -3500, label: '-₹3,500 (Dense Grain)', roughness: 0.25, metalness: 0.05, colorHex: 0x4a2a18 },
  'Mango Wood': { delta: -7000, label: '-₹7,000 (Light Eco Wood)', roughness: 0.5, metalness: 0.02, colorHex: 0xd4a373 },
  'Walnut': { delta: 5000, label: '+₹5,000 (Premium Dark Timber)', roughness: 0.2, metalness: 0.08, colorHex: 0x22130c },
  'Moradabad Brass': { delta: 2500, label: '+₹2,500 (Forged Metal)', roughness: 0.15, metalness: 0.85, colorHex: 0xe5a93c }
};

export const SECONDARY_ACCENT_OPTIONS = [
  { id: 'brass_inlay', label: 'Solid Brass Wire / Sheet Inlay', price: 1800, icon: '🪔' },
  { id: 'mop_tiles', label: 'Mother of Pearl / Bone Tiles', price: 2500, icon: '🐚' },
  { id: 'wooden_jali', label: 'Hand-Carved Wooden Jali Panels', price: 1200, icon: '🪟' },
  { id: 'gold_leafing', label: '22K Gold Leafing (Vark) Accents', price: 3000, icon: '✨' }
];

export const ORGANIC_FINISH_OPTIONS = [
  { id: 'beeswax', label: 'Organic Beeswax & Linseed Oil (Matte/Natural)', description: 'Eco-friendly non-toxic satin buffed polish' },
  { id: 'pu_gloss', label: 'Polyurethane (PU) Protective Gloss Coating', description: 'Heavy weather & spill proof gloss barrier' },
  { id: 'walnut_stain', label: 'Traditional Dark Walnut Stain', description: 'Deep antique warmth highlights natural grain' }
];
