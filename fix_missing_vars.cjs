const fs = require('fs');
const filePath = 'src/components/CustomerCampaignLauncher.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Add back the imports
code = code.replace(
`import { 
  CRAFTSMANSHIP_GRADES, 
  PRODUCT_BASE_CATALOG 
} from "../data/karagirPricingMockData";`,
`import { 
  PRIMARY_MATERIALS,
  SECONDARY_ACCENTS,
  SURFACE_FINISHES,
  CRAFTSMANSHIP_GRADES, 
  PRODUCT_BASE_CATALOG 
} from "../data/karagirPricingMockData";`);

// 2. Add derived variables
const derivedVars = `
  // Derive legacy variables from selectedSlots to keep 3D Viewer working
  const primaryMaterialName = selectedSlots.find(s => s.role === 'Primary Structural Material')?.materialName || 'Teak';
  const primaryMaterial = PRIMARY_MATERIALS.find(m => m.name.includes(primaryMaterialName) || primaryMaterialName.includes(m.name)) || PRIMARY_MATERIALS[0];

  const finishName = selectedSlots.find(s => s.role === 'Surface Finish & Polish')?.materialName || 'Beeswax';
  const selectedFinish = SURFACE_FINISHES.find(f => f.name.includes(finishName) || finishName.includes(f.name)) || SURFACE_FINISHES[0];

  const selectedAccents = selectedSlots.filter(s => s.role === 'Secondary Accent Inlays').map(s => {
    const acc = SECONDARY_ACCENTS.find(a => a.name.includes(s.materialName) || s.materialName.includes(a.name));
    return acc ? acc.id : '';
  }).filter(Boolean);

  const toggleAccent = () => {}; // No-op to prevent errors if called
`;

// Insert after useEffect
code = code.replace(
`  useEffect(() => {
    if (selectedProduct && selectedProduct.itemSpec && selectedProduct.itemSpec.materials) {
      setSelectedSlots(selectedProduct.itemSpec.materials.filter((s: ItemMaterialSlot) => s.defaultSelected !== false));
    }
  }, [selectedProduct, setSelectedSlots]);`,
`  useEffect(() => {
    if (selectedProduct && selectedProduct.itemSpec && selectedProduct.itemSpec.materials) {
      setSelectedSlots(selectedProduct.itemSpec.materials.filter((s: ItemMaterialSlot) => s.defaultSelected !== false));
    }
  }, [selectedProduct, setSelectedSlots]);
${derivedVars}`);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Fixed missing variables');
