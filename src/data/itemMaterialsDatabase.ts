import type { Item21Spec } from '../types';

export interface RawMaterialSpec {
  categoryId: string;
  categoryName: string;
  keywords: string[];
  primaryMaterials: string[];
  secondaryAccents: string[];
  joineryConstruction: string;
  timberQuality: string;
  surfaceFinish: string;
  inlayDetail: string;
  quickChips: { label: string; matchKey: string }[];
  defaultPrimaryMaterialName: string;
  defaultFinishName: string;
  badgeMatName: string;
  badgePolishName: string;
}

export const ITEMS_21_DATABASE: Item21Spec[] = [
  {
    id: 'item-1-sofa',
    itemNumber: 1,
    name: 'Sofa',
    icon: '🛋️',
    categoryGroup: 'Furniture',
    model3DType: 'sofa',
      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Frame', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Cushioning', rateKey: 'foam_40d', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Upholstery', rateKey: 'velvet_linen', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true, defaultSelected: true },
        { role: 'Upholstery', rateKey: 'leather', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true, defaultSelected: false }
      ],
    defaultLengthFt: 6.5,
    defaultWidthFt: 3.0,
    defaultHeightFt: 2.8,
    baseLaborPrice: 18500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'sofa-upholstery',
        name: 'Upholstery Materials',
        materials: [
          'Genuine Leather', 'Faux/PU/Bonded Leather', 'Cotton', 'Linen', 'Wool',
          'Silk', 'Suede', 'Velvet', 'Chenille', 'Polyester', 'Nylon', 'Acrylic',
          'Rayon / Viscose', 'Olefin', 'Microfiber', 'Performance Fabrics (Crypton, Sunbrella, Revolution)'
        ]
      },
      {
        id: 'sofa-frame',
        name: 'Frame Materials',
        materials: [
          'Solid Hardwood (Teak, Sheesham, Oak, Walnut, Mahogany)',
          'Softwood (Pine, Cedar)',
          'Engineered Wood (Plywood, Particle Board, MDF)',
          'Metal Frame (Stainless Steel, Mild Steel, Iron)'
        ]
      },
      {
        id: 'sofa-cushion',
        name: 'Cushion & Filling Materials',
        materials: [
          'High-Density Polyurethane Foam', 'Memory Foam', 'Feather / Down Blend',
          'Polyester Fiberfill (Dacron)', 'Pocket Coil Springs', 'Sinuous Steel Springs', 'Natural Latex'
        ]
      },
      {
        id: 'sofa-hardware',
        name: 'Hardware & Accents',
        materials: [
          'Solid Wood Legs', 'Brass/Chrome Metal Feet', 'Webbing Straps',
          'Recliner Mechanism Components', 'Zippers & Piping'
        ]
      }
    ]
  },
  {
    id: 'item-2-dining-table',
    itemNumber: 2,
    name: 'Dining Table',
    icon: '🍽️',
    categoryGroup: 'Furniture',
    model3DType: 'dining_table',
      materials: [
        { role: 'Frame & Legs', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Top', rateKey: 'makrana_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true, defaultSelected: false },
        { role: 'Top', rateKey: 'toughened_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true, defaultSelected: true },
        { role: 'Finish', rateKey: 'pu_polish', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ],
    defaultLengthFt: 6.0,
    defaultWidthFt: 3.5,
    defaultHeightFt: 2.5,
    baseLaborPrice: 14000,
    sampleImageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'dining-base',
        name: 'Base & Frame Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Oak, Walnut, Mango Wood)',
          'Metal (Wrought Iron, Powder-Coated Steel, Stainless Steel, Cast Brass)',
          'Engineered Wood (Plywood, MDF)'
        ]
      },
      {
        id: 'dining-top',
        name: 'Table Top Materials',
        materials: [
          'Solid Hardwood Planks', 'Natural Stone (Marble, Granite, Quartzite)',
          'Tempered Glass', 'Sintered Stone / Porcelain Slab',
          'Wood Veneer on MDF/Plywood', 'Epoxy Resin Blend'
        ]
      },
      {
        id: 'dining-finishes',
        name: 'Protective Finishes & Coatings',
        materials: [
          'Organic Beeswax & Linseed Oil', 'Polyurethane (PU) Lacquer',
          'High-Gloss Duco Paint', 'Powder Coating (Metal)', 'Penetrating Stone Sealer'
        ]
      },
      {
        id: 'dining-hardware',
        name: 'Hardware & Fasteners',
        materials: [
          'Steel Joining Plates', 'Threaded Inserts', 'Leveling Glides',
          'Expansion Fasteners', 'Decorative Metal Inlays'
        ]
      }
    ]
  },
  {
    id: 'item-3-study-table',
    itemNumber: 3,
    name: 'Study Table',
    icon: '📖',
    categoryGroup: 'Furniture',
    model3DType: 'study_table',
      materials: [
        { role: 'Structure', rateKey: 'bwr_ply', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Surface', rateKey: 'laminate_1mm', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Legs', rateKey: 'wrought_iron', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Hardware', rateKey: 'drawer_runners', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ],
    defaultLengthFt: 5.0,
    defaultWidthFt: 2.5,
    defaultHeightFt: 2.5,
    baseLaborPrice: 9500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'study-core',
        name: 'Core Structure Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Mango Wood, Rubberwood)',
          'Commercial Plywood', 'HDMR Board (High-Density Moisture Resistant)',
          'MDF', 'Particle Board', 'Tubular Steel Frame'
        ]
      },
      {
        id: 'study-surface',
        name: 'Surface & Top Laminates',
        materials: [
          'Natural Wood Veneer', 'High-Pressure Laminate (HPL / Formica)',
          'Melamine Coating', 'Tempered Glass Overlay', 'Leatherette Blotter Top'
        ]
      },
      {
        id: 'study-hardware',
        name: 'Hardware & Storage Accessories',
        materials: [
          'Telescopic Ball-Bearing Drawer Slides', 'Soft-Close Door Hinges',
          'Wire Management Grommets & Cable Trays', 'Aluminium Handles & Knobs', 'Lock & Key Units'
        ]
      }
    ]
  },
  {
    id: 'item-4-bed',
    itemNumber: 4,
    name: 'Bed',
    icon: '🛏️',
    categoryGroup: 'Furniture',
    model3DType: 'bed',
      materials: [
        { role: 'Frame', rateKey: 'sheesham', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Base & Storage', rateKey: 'marine_bwp_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Headboard', rateKey: 'pu_leatherette', quantityBasis: 'surface_area_sqft', quantityFactor: 0.30, removable: true },
        { role: 'Hardware', rateKey: 'gas_lift_struts', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ],
    defaultLengthFt: 6.5,
    defaultWidthFt: 6.0,
    defaultHeightFt: 4.0,
    baseLaborPrice: 16500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'bed-frame',
        name: 'Frame & Structure Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Oak, Pine, Rosewood)',
          'Commercial / Marine Plywood', 'Metal (Steel Tubes, Iron Slats)', 'MDF / Particle Board'
        ]
      },
      {
        id: 'bed-headboard',
        name: 'Headboard & Upholstery Materials',
        materials: [
          'Velvet', 'Genuine Leather', 'Faux Leather / PU', 'Linen', 'Cotton-Canvas',
          'High-Density Foam Padding', 'Button Tufting / Brass Nailhead Trim'
        ]
      },
      {
        id: 'bed-storage',
        name: 'Storage & Lifting Mechanisms',
        materials: [
          'Hydraulic Lift-Up Gas Struts', 'Metal Drawer Runners',
          'Heavy-Duty Corner Brackets', 'Wooden Slat Support System', 'Central Support Steel Beams'
        ]
      },
      {
        id: 'bed-finishes',
        name: 'Finishes',
        materials: [
          'Melamine Polish', 'PU Coating', 'Teak Oil', 'Natural Wax', 'Powder-Coated Metal Finish'
        ]
      }
    ]
  },
  {
    id: 'item-5-wardrobe',
    itemNumber: 5,
    name: 'Wardrobe',
    icon: '📦',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'wardrobe',
      materials: [
        { role: 'Carcass', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Shutters', rateKey: 'acrylic_hg_laminate', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Hardware', rateKey: 'concealed_hinges', quantityBasis: 'fixed_qty', quantityFactor: 6, removable: true }
      ],
    defaultLengthFt: 6.0,
    defaultWidthFt: 2.0,
    defaultHeightFt: 7.0,
    baseLaborPrice: 22000,
    sampleImageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'wardrobe-carcass',
        name: 'Core Carcass Materials',
        materials: [
          'Marine Grade Plywood (BWP/BWR)', 'HDMR Board', 'MDF',
          'Particle Board / Chipboard', 'Solid Wood (Sheesham, Teak)'
        ]
      },
      {
        id: 'wardrobe-doors',
        name: 'Door & Exterior Finishes',
        materials: [
          'High-Pressure Laminate (HPL)', 'Acrylic Sheets', 'Natural Wood Veneer',
          'Lacquered / Back-Painted Glass', 'PU Duco Paint', 'Mirror Glass'
        ]
      },
      {
        id: 'wardrobe-fittings',
        name: 'Hardware & Internal Fittings',
        materials: [
          'Soft-Close Hinges', 'Sliding Door Roller Tracks', 'Stainless Steel Hanging Rods',
          'Pull-Out Shoe Trays', 'Drawer Lock Units', 'Concealed LED Profile Channels'
        ]
      },
      {
        id: 'wardrobe-lining',
        name: 'Internal Lining',
        materials: [
          'Suede / Velvet Lining (Jewelry Drawers)', 'Fabric / Leatherette Wrap', 'Melamine Inner Liner'
        ]
      }
    ]
  },
  {
    id: 'item-6-coffee-table',
    itemNumber: 6,
    name: 'Coffee Table',
    icon: '☕',
    categoryGroup: 'Furniture',
    model3DType: 'coffee_table',
      materials: [
        { role: 'Base', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Frame', rateKey: 'mango_wood', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Top', rateKey: 'toughened_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ],
    defaultLengthFt: 4.0,
    defaultWidthFt: 2.0,
    defaultHeightFt: 1.5,
    baseLaborPrice: 6500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'coffee-frame',
        name: 'Structural Frame Materials',
        materials: [
          'Solid Wood (Teak, Mango, Walnut, Sheesham)', 'Cast Iron / Mild Steel',
          'Stainless Steel', 'Brass / Copper Sheet', 'Rattan / Cane Webbing'
        ]
      },
      {
        id: 'coffee-top',
        name: 'Top Surface Materials',
        materials: [
          'Tempered Glass (Clear, Tinted, Frosted)', 'Natural Marble (Makrana, Italian, Carrara)',
          'Terrazzo', 'Solid Wood Slab (Live Edge)', 'Sintered Stone', 'Ceramic Tiles'
        ]
      },
      {
        id: 'coffee-inlays',
        name: 'Accents & Inlays',
        materials: [
          'Brass Wire / Strip Inlay', 'Mother of Pearl Inlay', 'Bone Inlay',
          'Epoxy Resin River Inlays', 'Antiqued Gold Leafing'
        ]
      },
      {
        id: 'coffee-hardware',
        name: 'Hardware',
        materials: [
          'Metal Hairpin Legs', 'Leveling Feet', 'Concealed Drawer Runners', 'Undermount Glides'
        ]
      }
    ]
  },
  {
    id: 'item-7-chair',
    itemNumber: 7,
    name: 'Chair',
    icon: '🪑',
    categoryGroup: 'Furniture',
    model3DType: 'chair',
      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Backrest', rateKey: 'cane_webbing', quantityBasis: 'surface_area_sqft', quantityFactor: 0.20, removable: true },
        { role: 'Upholstery', rateKey: 'cotton_linen', quantityBasis: 'surface_area_sqft', quantityFactor: 0.30, removable: true }
      ],
    defaultLengthFt: 2.2,
    defaultWidthFt: 2.2,
    defaultHeightFt: 3.2,
    baseLaborPrice: 5500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'chair-frame',
        name: 'Frame Materials',
        materials: [
          'Solid Hardwood (Teak, Sheesham, Oak, Beech, Walnut)',
          'Metal (Steel, Aluminium, Wrought Iron)', 'Molded Polypropylene / Plastic',
          'Bentwood', 'Rattan / Bamboo'
        ]
      },
      {
        id: 'chair-upholstery',
        name: 'Seat & Back Upholstery',
        materials: [
          'Cotton', 'Linen', 'Velvet', 'Genuine Leather', 'PU / Faux Leather',
          'Breathable Mesh', 'Natural Cane Webbing'
        ]
      },
      {
        id: 'chair-cushioning',
        name: 'Padding & Cushioning',
        materials: [
          'High-Resilience Polyurethane Foam', 'Fiberfill Padding', 'Molded Foam', 'Rubber Webbing Support'
        ]
      },
      {
        id: 'chair-hardware',
        name: 'Hardware & Glides',
        materials: [
          'Swivel Base Mechanism', 'Gas-Lift Hydraulics', 'Castor Wheels',
          'Brass Ferrule Foot Caps', 'Anti-Scratch Felt Pads'
        ]
      }
    ]
  },
  {
    id: 'item-8-bookshelf',
    itemNumber: 8,
    name: 'Bookshelf',
    icon: '📚',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'bookshelf',
      materials: [
        { role: 'Frame', rateKey: 'sheesham', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Shelves', rateKey: 'veneer_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Finish', rateKey: 'beeswax_oil', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ],
    defaultLengthFt: 3.5,
    defaultWidthFt: 1.5,
    defaultHeightFt: 6.0,
    baseLaborPrice: 7800,
    sampleImageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'bookshelf-core',
        name: 'Core Structural Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Oak, Pine)', 'Commercial / Marine Plywood',
          'MDF', 'Heavy-Duty Steel Angle Frame', 'Wrought Iron'
        ]
      },
      {
        id: 'bookshelf-finishes',
        name: 'Shelf & Backing Finishes',
        materials: [
          'Natural Wood Veneer', 'High-Pressure Laminate', 'Melamine Paper Finish',
          'Powder Coating (Metal Shelves)', 'Clear Lacquer'
        ]
      },
      {
        id: 'bookshelf-hardware',
        name: 'Hardware & Mounting Fittings',
        materials: [
          'Adjustable Shelf Supports / Pegs', 'Anti-Topple Wall Anchors',
          'Concealed Brackets', 'Decorative Metal Corner Bracing', 'Glass Door Hinges'
        ]
      }
    ]
  },
  {
    id: 'item-9-dressing-table',
    itemNumber: 9,
    name: 'Dressing Table',
    icon: '🪞',
    categoryGroup: 'Furniture',
    model3DType: 'dressing_table',
      materials: [
        { role: 'Structure', rateKey: 'bwr_ply', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Mirror', rateKey: 'mirror_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Finish', rateKey: 'duco_paint', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ],
    defaultLengthFt: 3.5,
    defaultWidthFt: 1.8,
    defaultHeightFt: 5.5,
    baseLaborPrice: 9800,
    sampleImageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'dressing-core',
        name: 'Core Structure Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Mango Wood)', 'Marine Plywood', 'MDF', 'HDMR Board'
        ]
      },
      {
        id: 'dressing-mirror',
        name: 'Mirror & Top Materials',
        materials: [
          'High-Definition Float Glass Mirror', 'Back-Lit LED Mirror Glass',
          'Marble/Granite Countertop', 'Toughened Glass Top Protector'
        ]
      },
      {
        id: 'dressing-finishes',
        name: 'Exterior Finishes & Inlays',
        materials: [
          'PU Duco Paint', 'Wood Veneer', 'High-Gloss Laminate',
          'Bone/Mother of Pearl Inlay', 'Brass Metal Trims'
        ]
      },
      {
        id: 'dressing-hardware',
        name: 'Storage Hardware',
        materials: [
          'Telescopic Drawer Slides', 'Soft-Close Door Hinges',
          'Vanity Organizer Dividers', 'LED Touch Sensors', 'Decorative Handles/Knobs'
        ]
      }
    ]
  },
  {
    id: 'item-10-shoe-rack',
    itemNumber: 10,
    name: 'Shoe Rack',
    icon: '👟',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'shoe_rack',
      materials: [
        { role: 'Carcass', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Doors', rateKey: 'louvered_slats', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Hardware', rateKey: 'tray_mechanism', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ],
    defaultLengthFt: 3.0,
    defaultWidthFt: 1.2,
    defaultHeightFt: 3.5,
    baseLaborPrice: 5800,
    sampleImageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'shoerack-carcass',
        name: 'Core Carcass Materials',
        materials: [
          'BWR/BWP Plywood', 'HDMR Board', 'Solid Teak / Sheesham',
          'Metal Wire / Slats', 'Particle Board'
        ]
      },
      {
        id: 'shoerack-doors',
        name: 'Door & Ventilation Features',
        materials: [
          'Louvered / Slatted Wooden Doors', 'Perforated Metal Panels',
          'Breathable Cane Webbing', 'Tilting Drawer Trays'
        ]
      },
      {
        id: 'shoerack-finishes',
        name: 'Finishes & Overlays',
        materials: [
          'Anti-Scratch Laminate', 'Melamine Polish', 'PU Coating', 'Water-Resistant Foil Wrap'
        ]
      },
      {
        id: 'shoerack-hardware',
        name: 'Hardware',
        materials: [
          'Tilt-Out Shoe Mechanism Hinges', 'Stainless Steel Rods',
          'Soft-Close Drawer Runners', 'Rubber Foot Pads'
        ]
      }
    ]
  },
  {
    id: 'item-11-tv-unit',
    itemNumber: 11,
    name: 'TV Unit / Cabinet',
    icon: '📺',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'tv_unit',
      materials: [
        { role: 'Structure', rateKey: 'hdmr_mdf', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Panels', rateKey: 'fluted_panels', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Countertop', rateKey: 'italian_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ],
    defaultLengthFt: 6.0,
    defaultWidthFt: 1.5,
    defaultHeightFt: 2.0,
    baseLaborPrice: 13500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'tv-carcass',
        name: 'Structural Carcass Materials',
        materials: [
          'Commercial Plywood', 'HDMR Board', 'MDF',
          'Solid Wood (Teak, Sheesham, Oak)', 'Steel Tube Frame'
        ]
      },
      {
        id: 'tv-facade',
        name: 'Facade & Panel Finishes',
        materials: [
          'Wood Veneer', 'Fluted / Louvered Wooden Panels', 'High-Gloss Acrylic',
          'Back-Painted Glass', 'PU Coating', 'Charcoal Louvers'
        ]
      },
      {
        id: 'tv-countertop',
        name: 'Countertop Materials',
        materials: [
          'Italian Marble', 'Quartz', 'Sintered Stone', 'Toughened Tinted Glass', 'Solid Timber Top'
        ]
      },
      {
        id: 'tv-hardware',
        name: 'Hardware & Cable Management',
        materials: [
          'Drop-Down Flap Hinges', 'Soft-Close Drawer Slides',
          'Wire Management Grommets', 'Concealed LED Strip Profiles', 'Wall Mounting Heavy Cleats'
        ]
      }
    ]
  },
  {
    id: 'item-12-side-table',
    itemNumber: 12,
    name: 'Side Table',
    icon: '🛋️',
    categoryGroup: 'Furniture',
    model3DType: 'side_table',
      materials: [
        { role: 'Legs', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Top', rateKey: 'mango_wood', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ],
    defaultLengthFt: 1.8,
    defaultWidthFt: 1.8,
    defaultHeightFt: 2.0,
    baseLaborPrice: 4200,
    sampleImageUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'sidetable-frame',
        name: 'Frame & Base Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Mango Wood)', 'Powder-Coated Metal',
          'Brushed Stainless Steel', 'Cast Brass', 'Bamboo / Cane'
        ]
      },
      {
        id: 'sidetable-top',
        name: 'Top Surface Materials',
        materials: [
          'Tempered Glass', 'Natural Marble', 'Granite', 'Terrazzo',
          'Ceramic Tile', 'Solid Wood Planks', 'Leather-Wrapped Top'
        ]
      },
      {
        id: 'sidetable-finishes',
        name: 'Finishes & Decorative Accents',
        materials: [
          'Organic Beeswax', 'PU Satin Polish', 'Antiqued Brass Foil', 'Gold Leafing', 'Epoxy Inlay'
        ]
      },
      {
        id: 'sidetable-hardware',
        name: 'Hardware',
        materials: [
          'Adjustable Floor Levelers', 'Metal Brackets', 'Concealed Drawer Runners', 'Decorative Pull Handles'
        ]
      }
    ]
  },
  {
    id: 'item-13-home-temple',
    itemNumber: 13,
    name: 'Home Temple (Mandir)',
    icon: '🛕',
    categoryGroup: 'Sacred & Specialty',
    model3DType: 'home_temple',
      materials: [
        { role: 'Main Structure', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Accents', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Inlay', rateKey: 'makrana_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ],
    defaultLengthFt: 3.0,
    defaultWidthFt: 2.0,
    defaultHeightFt: 4.5,
    baseLaborPrice: 12500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'mandir-wood',
        name: 'Primary Sacred Woods',
        materials: [
          'Solid Sagwan (Teak Wood)', 'Sheesham (Rosewood)', 'Mango Wood', 'Sandalwood (Accents)'
        ]
      },
      {
        id: 'mandir-accents',
        name: 'Stone & Sheet Accents',
        materials: [
          'Makrana White Marble', 'Brass Foil / Sheet Overlay', 'Copper Plates', 'Embossed Silver Sheets'
        ]
      },
      {
        id: 'mandir-carvings',
        name: 'Carving & Decorative Details',
        materials: [
          'Jali (Lattice Work) Panels', 'Carved Brass Bells', 'Kalash Finials', 'Gold Vark (Leafing)', 'Resin Inlays'
        ]
      },
      {
        id: 'mandir-hardware',
        name: 'Hardware & Fittings',
        materials: [
          'Soft-Close Drawers (for Pooja Essentials)', 'Pull-Out Diya Trays',
          'LED Spotlight Fixtures', 'Brass Hanging Hooks'
        ]
      }
    ]
  },
  {
    id: 'item-14-wooden-bench',
    itemNumber: 14,
    name: 'Wooden Bench',
    icon: '🪵',
    categoryGroup: 'Furniture',
    model3DType: 'wooden_bench',
      materials: [
        { role: 'Plank', rateKey: 'sheesham', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Base', rateKey: 'wrought_iron', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ],
    defaultLengthFt: 4.5,
    defaultWidthFt: 1.5,
    defaultHeightFt: 1.8,
    baseLaborPrice: 5200,
    sampleImageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'bench-timber',
        name: 'Frame & Seat Timber',
        materials: [
          'Solid Teak Wood', 'Sheesham Wood', 'Oak', 'Acacia', 'Mango Wood', 'Pine', 'Reclaimed Wood'
        ]
      },
      {
        id: 'bench-upholstery',
        name: 'Optional Upholstery & Cushioning',
        materials: [
          'High-Density Foam', 'Linen', 'Velvet', 'Cotton Canvas',
          'Genuine / Faux Leather', 'Weather-Resistant Outdoor Fabric (Sunbrella)'
        ]
      },
      {
        id: 'bench-base',
        name: 'Structural Reinforcements & Base',
        materials: [
          'Wrought Iron Frame Base', 'Stainless Steel Legs',
          'Mortise & Tenon Wood Joinery', 'Heavy-Duty Corner Brackets'
        ]
      },
      {
        id: 'bench-finishes',
        name: 'Protective Finishes',
        materials: [
          'Exterior Weatherproof Teak Oil', 'Polyurethane Clear Coat',
          'Antique Distressed Paint', 'Beeswax Polish'
        ]
      }
    ]
  },
  {
    id: 'item-15-crockery-cabinet',
    itemNumber: 15,
    name: 'Crockery Cabinet',
    icon: '🍽️',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'crockery_cabinet',
      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Glass Doors', rateKey: 'reeded_glass', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true }
      ],
    defaultLengthFt: 4.0,
    defaultWidthFt: 1.8,
    defaultHeightFt: 6.5,
    baseLaborPrice: 17500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'crockery-carcass',
        name: 'Core Frame & Carcass',
        materials: [
          'Marine Plywood', 'Solid Wood (Teak, Sheesham, Oak)', 'HDMR Board', 'MDF'
        ]
      },
      {
        id: 'crockery-glass',
        name: 'Glass & Door Materials',
        materials: [
          'Clear Float Glass', 'Fluted / Reeded Glass', 'Frosted Glass',
          'Toughened Glass Shelves', 'Solid Wood Framed Glass Doors'
        ]
      },
      {
        id: 'crockery-finishes',
        name: 'Finishes & Lining',
        materials: [
          'Wood Veneer', 'PU Gloss / Satin Paint', 'Laminate',
          'Mirror Backing Panel', 'Velvet-Lined Drawers'
        ]
      },
      {
        id: 'crockery-hardware',
        name: 'Hardware & Accessories',
        materials: [
          'Concealed Glass Hinges', 'Magnetic Door Latches', 'Undermount Drawer Runners',
          'LED Spotlight Channels', 'Brass Knobs'
        ]
      }
    ]
  },
  {
    id: 'item-16-indoor-swing',
    itemNumber: 16,
    name: 'Indoor Swing (Jhula)',
    icon: '🎋',
    categoryGroup: 'Sacred & Specialty',
    model3DType: 'indoor_swing',
      materials: [
        { role: 'Plank', rateKey: 'sagwan_teak', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Hanging Chains', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 4, removable: true }
      ],
    defaultLengthFt: 5.0,
    defaultWidthFt: 2.5,
    defaultHeightFt: 4.0,
    baseLaborPrice: 14500,
    sampleImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'jhula-plank',
        name: 'Seat Plank Materials',
        materials: [
          'Solid Teak Wood Planks', 'Sheesham Wood', 'Carved Solid Timber', 'Upholstered Wooden Deck'
        ]
      },
      {
        id: 'jhula-suspension',
        name: 'Suspension & Hanging Hardware',
        materials: [
          'Cast Brass Chains', 'Heavy-Duty Stainless Steel Chains', 'Forged Wrought Iron Links',
          'Ceiling Hook Bolts with Bearings', 'Decorative Brass Animal Motifs / Bells'
        ]
      },
      {
        id: 'jhula-upholstery',
        name: 'Cushioning & Upholstery',
        materials: [
          'High-Density Foam Pad', 'Velvet Fabric', 'Cotton-Linen Covers',
          'Silk Throw Pillows', 'Leatherette Wrap'
        ]
      },
      {
        id: 'jhula-finishes',
        name: 'Finishes',
        materials: [
          'Hand-Rubbed Melamine Polish', 'PU Coating', 'Hand-Carved Relief Motifs', 'Brass Sheet Inlays'
        ]
      }
    ]
  },
  {
    id: 'item-17-chest-drawers',
    itemNumber: 17,
    name: 'Chest of Drawers',
    icon: '🗄️',
    categoryGroup: 'Storage & Cabinets',
    model3DType: 'chest_of_drawers',
      materials: [
        { role: 'Body', rateKey: 'veneer_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Front Inlay', rateKey: 'mop_tile', quantityBasis: 'surface_area_sqft', quantityFactor: 0.20, removable: true }
      ],
    defaultLengthFt: 3.5,
    defaultWidthFt: 1.8,
    defaultHeightFt: 4.0,
    baseLaborPrice: 11000,
    sampleImageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'chest-core',
        name: 'Core Structure Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Mango Wood, Pine)', 'Commercial Plywood', 'MDF', 'HDMR Board'
        ]
      },
      {
        id: 'chest-fronts',
        name: 'Exterior Finishes & Fronts',
        materials: [
          'Natural Wood Veneer', 'PU Duco Paint', 'Bone / Mother of Pearl Inlay',
          'Rattan / Cane Webbing Drawer Fronts', 'High-Pressure Laminate'
        ]
      },
      {
        id: 'chest-hardware',
        name: 'Hardware & Movement',
        materials: [
          'Full-Extension Ball-Bearing Slides', 'Soft-Close Drawer Runners',
          'Vintage Brass Knobs', 'Ceramic Handles', 'Iron Cup Pulls'
        ]
      },
      {
        id: 'chest-interior',
        name: 'Interior Details',
        materials: [
          'Cedar Wood Lining (Aromatic)', 'Velvet-Lined Top Drawers', 'Divider Trays'
        ]
      }
    ]
  },
  {
    id: 'item-18-bar-cabinet',
    itemNumber: 18,
    name: 'Bar Cabinet',
    icon: '🍸',
    categoryGroup: 'Sacred & Specialty',
    model3DType: 'bar_cabinet',
      materials: [
        { role: 'Body', rateKey: 'mango_wood', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Racks', rateKey: 'ss304', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ],
    defaultLengthFt: 3.5,
    defaultWidthFt: 1.8,
    defaultHeightFt: 5.0,
    baseLaborPrice: 16000,
    sampleImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'bar-carcass',
        name: 'Carcass & Frame Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Walnut, Mango Wood)', 'Marine Plywood', 'HDMR Board', 'Metal Outer Caging'
        ]
      },
      {
        id: 'bar-surfaces',
        name: 'Countertop & Interior Surfaces',
        materials: [
          'Marble Slab', 'Granite Top', 'Stainless Steel Prep Tray',
          'Toughened Glass Shelves', 'Mirror Backing Panel'
        ]
      },
      {
        id: 'bar-finishes',
        name: 'Door & Accent Finishes',
        materials: [
          'Fluted Wood Panels', 'Leatherette Wrapped Doors', 'Brass Metal Inlays', 'Antiqued Metallic Paint'
        ]
      },
      {
        id: 'bar-hardware',
        name: 'Hardware & Specialized Storage',
        materials: [
          'Hanging Stemware / Wine Glass Racks', 'Bottle Rack Dividers',
          'Soft-Close Hinges', 'LED Sensor Strip Lights', 'Lock & Key Mechanisms'
        ]
      }
    ]
  },
  {
    id: 'item-19-console-table',
    itemNumber: 19,
    name: 'Console Table',
    icon: '🏛️',
    categoryGroup: 'Furniture',
    model3DType: 'console_table',
      materials: [
        { role: 'Frame', rateKey: 'ss304', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Top', rateKey: 'italian_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ],
    defaultLengthFt: 4.5,
    defaultWidthFt: 1.5,
    defaultHeightFt: 3.0,
    baseLaborPrice: 8200,
    sampleImageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'console-frame',
        name: 'Structural Frame Materials',
        materials: [
          'Solid Hardwood (Teak, Sheesham, Oak, Walnut)', 'Powder-Coated Steel',
          'Cast Brass', 'Brushed Stainless Steel', 'Wrought Iron'
        ]
      },
      {
        id: 'console-top',
        name: 'Top Surface Materials',
        materials: [
          'Natural Marble (Carrara, Italian, Black Marquina)', 'Toughened Glass',
          'Sintered Stone', 'Live Edge Solid Wood Slab', 'Terrazzo'
        ]
      },
      {
        id: 'console-inlays',
        name: 'Finishes & Inlay Art',
        materials: [
          'Brass Wire Inlays', 'Epoxy Resin River Inlays', 'High-Gloss PU Lacquer',
          'Gold/Silver Leafing', 'Distressed Vintage Polish'
        ]
      },
      {
        id: 'console-hardware',
        name: 'Hardware & Support',
        materials: [
          'Metal Hairpin / Geometric Legs', 'Leveling Glides',
          'Concealed Wall Mount Brackets', 'Soft-Close Drawer Runners'
        ]
      }
    ]
  },
  {
    id: 'item-20-bedside-table',
    itemNumber: 20,
    name: 'Bedside Table',
    icon: '🛏️',
    categoryGroup: 'Furniture',
    model3DType: 'bedside_table',
      materials: [
        { role: 'Body', rateKey: 'laminate_1mm', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Drawers', rateKey: 'drawer_runners', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ],
    defaultLengthFt: 1.8,
    defaultWidthFt: 1.5,
    defaultHeightFt: 2.0,
    baseLaborPrice: 3800,
    sampleImageUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'bedside-core',
        name: 'Core Carcass Materials',
        materials: [
          'Solid Wood (Teak, Sheesham, Mango Wood, Pine)', 'Plywood', 'HDMR Board',
          'MDF', 'Tubular Metal Base'
        ]
      },
      {
        id: 'bedside-finishes',
        name: 'Exterior Finishes & Fronts',
        materials: [
          'Natural Wood Polish', 'PU Duco Paint', 'High-Pressure Laminate',
          'Cane / Rattan Webbing', 'Fluted Wood Detailing'
        ]
      },
      {
        id: 'bedside-top',
        name: 'Top Surface Options',
        materials: [
          'Solid Wood', 'Marble Overlay', 'Toughened Glass Top Protector', 'Quartz'
        ]
      },
      {
        id: 'bedside-hardware',
        name: 'Hardware & Storage Fittings',
        materials: [
          'Soft-Close Drawer Slides', 'Telescopic Runners',
          'Wireless Charging Pad Mounts', 'Brass Handles / Knobs', 'Felt Bottom Glides'
        ]
      }
    ]
  },
  {
    id: 'item-21-door',
    itemNumber: 21,
    name: 'Door',
    icon: '🚪',
    categoryGroup: 'Architectural & Openings',
    model3DType: 'door',
      materials: [
        { role: 'Core & Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Panel', rateKey: 'marine_bwp_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Finish', rateKey: 'pu_polish', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Hardware', rateKey: 'door_hardware_set', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ],
    defaultLengthFt: 3.5,
    defaultWidthFt: 0.4,
    defaultHeightFt: 7.0,
    baseLaborPrice: 14800,
    sampleImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        id: 'door-core',
        name: 'Frame & Core Structure Materials',
        materials: [
          'Solid Hardwood (Teak / Sagwan, Sheesham, Sal, Mahogany, Oak, Pine)',
          'Marine Grade BWP / BWR Plywood', 'Solid Blockboard Core',
          'Tubular Chipboard Core', 'WPC (Wood Plastic Composite)', 'Steel / Aluminium Frame Sections'
        ]
      },
      {
        id: 'door-panel',
        name: 'Panel & Facade Options',
        materials: [
          'Solid Wood Carved Planks', 'High-Pressure Laminate (HPL / Formica)',
          'Natural Wood Veneer (Teak, Walnut, Rosewood)', 'Molded HDF Fiber Skins',
          'Acrylic / Duco Painted Panels', 'PVC Membrane Wraps'
        ]
      },
      {
        id: 'door-coatings',
        name: 'Protective Finishes & Coatings',
        materials: [
          'Exterior Weatherproof Polyurethane (PU) Coating', 'Organic Beeswax & Linseed Oil',
          'Melamine Polish', 'High-Gloss Duco Paint', 'Teak Oil',
          'Exterior Powder Coating', 'Anti-Termite & Anti-Fungal Sealers'
        ]
      },
      {
        id: 'door-hardware',
        name: 'Hardware, Locks & Hinges',
        materials: [
          'Heavy-Duty Stainless Steel (SS 304) Butt Hinges', 'Concealed Pivot Hinges',
          'Solid Brass Handles / Lever Sets', 'Smart Digital Locks (Biometric, Keypad, RFID)',
          'Mortise Locksets', 'Heavy Brass Tower Bolts (Chitkani)',
          'Automatic Door Closers & Magnetic Stoppers'
        ]
      },
      {
        id: 'door-insets',
        name: 'Glass Insets & Decorative Accents',
        materials: [
          'Toughened Frosted / Fluted Glass Insets', 'Cast Brass Wire / Strip Inlays',
          'Carved Wooden Jali (Lattice) Screens', '24K Gold Leafing (Vark)',
          'Brass Embossed Motifs (Bells, Kalash, Om)', 'CNC Geometric 3D Relief Carvings'
        ]
      }
    ]
  }
];

export const ITEM_MATERIALS_DATABASE: Record<string, RawMaterialSpec> = {
  sacred_temples: {
    categoryId: 'sacred_temples',
    categoryName: 'Sacred & Home Temples (Heritage Mandir)',
    keywords: ['mandir', 'temple', 'sacred', 'pooja', 'shrine', 'carved home temple'],
    primaryMaterials: ['Seasoned Sagwan (Teak Wood)', 'Sheesham (Indian Rosewood)', 'Moradabad Cast Brass Alloy'],
    secondaryAccents: ['Makrana White Marble Inlay', '18-Gauge Solid Brass Wire', 'Carved Jali Screens'],
    joineryConstruction: 'Traditional Mortise & Tenon (Zero Nails)',
    timberQuality: 'Kiln-Dried Seasoned Sagwan Teak <10% Moisture',
    surfaceFinish: '3 Hand-Rubbed Coats of Organic Beeswax & Linseed Oil (Natural Matte)',
    inlayDetail: 'High-Density 18 Gauge Solid Brass Wire & Makrana Marble',
    quickChips: [
      { label: "Moradabad Brass Pillars", matchKey: "brass pillar" },
      { label: "Makrana Marble Inlay", matchKey: "marble" },
      { label: "Carved Fluted Legs", matchKey: "carved" },
      { label: "Organic Beeswax Polish", matchKey: "beeswax" },
      { label: "Add 2 Front Drawers", matchKey: "drawer" },
      { label: "Carved Jali Screen", matchKey: "jali" }
    ],
    defaultPrimaryMaterialName: 'Sagwan (Teak Wood)',
    defaultFinishName: 'Organic Beeswax & Linseed Oil (Natural Matte)',
    badgeMatName: 'Sagwan Teak & Moradabad Brass',
    badgePolishName: '3-Coat Beeswax & Linseed Oil'
  },
  custom_furniture: {
    categoryId: 'custom_furniture',
    categoryName: 'Custom Furniture & Seating',
    keywords: ['dining', 'table', 'sofa', 'chair', 'jhula', 'swing', 'sideboard', 'desk', 'bench', 'cabinet', 'furniture', 'bed', 'door', 'bookshelf', 'wardrobe', 'side table'],
    primaryMaterials: ['Kiln-Dried Sagwan Teak', 'Sheesham Rosewood', 'Mango Wood', 'Natural Assam Cane/Rattan'],
    secondaryAccents: ['Hand-Cut Bone / Mother of Pearl Inlay', 'Heavy Brass Corner Brackets', 'Velvet Upholstery'],
    joineryConstruction: 'Dovetail & Mortise-and-Tenon Woodwork',
    timberQuality: 'Kiln-Dried Timber Seasoned <12%',
    surfaceFinish: 'Polyurethane (PU) Satin / Dark Walnut Stain',
    inlayDetail: 'Hand-Cut MOP Inlay & Solid Brass Corner Brackets',
    quickChips: [
      { label: "Add 2 Front Drawers", matchKey: "drawer" },
      { label: "Carved Fluted Legs", matchKey: "carved" },
      { label: "Glass Top Overlay", matchKey: "glass" },
      { label: "Moradabad Brass Pillars", matchKey: "brass pillar" },
      { label: "Makrana Marble Inlay", matchKey: "marble" },
      { label: "Dark Beeswax Polish", matchKey: "beeswax" },
      { label: "Bottom Storage Shelf", matchKey: "shelf" }
    ],
    defaultPrimaryMaterialName: 'Sagwan (Teak Wood)',
    defaultFinishName: 'Hand-Rubbed Organic Beeswax Polish',
    badgeMatName: 'Kiln-Dried Sagwan Teak',
    badgePolishName: 'Organic Beeswax & Linseed Oil'
  }
};

export function getMaterialSpecByCategory(categoryNameOrInput: string): RawMaterialSpec {
  if (!categoryNameOrInput) return ITEM_MATERIALS_DATABASE.custom_furniture;
  const lower = categoryNameOrInput.toLowerCase();
  for (const spec of Object.values(ITEM_MATERIALS_DATABASE)) {
    if (spec.keywords.some((kw) => lower.includes(kw))) {
      return spec;
    }
  }
  return ITEM_MATERIALS_DATABASE.custom_furniture;
}
