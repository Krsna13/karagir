import re

with open('src/components/CustomerCampaignLauncher.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports
code = code.replace(
'''import type { 
  PrimaryMaterial, 
  SurfaceFinish, 
  CraftsmanshipGrade, 
  LocalityFactor 
} from "../data/karagirPricingMockData";''',
'''import type { CraftsmanshipGrade } from "../data/karagirPricingMockData";
import { LOCALITIES, calculateEstimatedCost, type Locality, type ItemMaterialSlot } from "../data/materialRates";
import { useMaterial } from "../context/MaterialContext";''')

code = code.replace(
'''import { 
  PRIMARY_MATERIALS, 
  SECONDARY_ACCENTS, 
  SURFACE_FINISHES, 
  CRAFTSMANSHIP_GRADES, 
  LOCALITY_FACTORS, 
  PRODUCT_BASE_CATALOG 
} from "../data/karagirPricingMockData";''',
'''import { 
  CRAFTSMANSHIP_GRADES, 
  PRODUCT_BASE_CATALOG 
} from "../data/karagirPricingMockData";''')

# 2. State variables
code = code.replace(
'''  const [primaryMaterial, setPrimaryMaterial] = useState<PrimaryMaterial>(PRIMARY_MATERIALS[0]); // Sagwan Teak
  const [selectedAccents, setSelectedAccents] = useState<string[]>(["acc-brass-wire", "acc-jali"]);
  const [selectedFinish, setSelectedFinish] = useState<SurfaceFinish>(SURFACE_FINISHES[0]);
  const [selectedGrade, setSelectedGrade] = useState<CraftsmanshipGrade>(CRAFTSMANSHIP_GRADES[1]); // Master Karigar
  const [selectedLocality, setSelectedLocality] = useState<LocalityFactor>(LOCALITY_FACTORS[0]); // Satpur MIDC''',
'''  const { selectedSlots, setSelectedSlots, removeSlot } = useMaterial();
  const [selectedGrade, setSelectedGrade] = useState<CraftsmanshipGrade>(CRAFTSMANSHIP_GRADES[1]);
  const [selectedLocality, setSelectedLocality] = useState<Locality>(LOCALITIES[0]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.itemSpec && selectedProduct.itemSpec.materials) {
      setSelectedSlots(selectedProduct.itemSpec.materials.filter((s: ItemMaterialSlot) => s.defaultSelected !== false));
    }
  }, [selectedProduct, setSelectedSlots]);
''')

# Fix Ai Description effects that might reference primaryMaterial
code = code.replace('''  // ⚡ Live AI Auto-Parse Text Effect: Automatically updates material/category/finish as user types in AI Description!
  useEffect(() => {
    if (!aiDescription) return;

    const lowerText = aiDescription.toLowerCase();

    // Auto-detect & switch Primary Material
    if (lowerText.includes('brass')) {
      const brassMat = PRIMARY_MATERIALS.find(m => m.id === 'mat-brass');
      if (brassMat && primaryMaterial.id !== 'mat-brass') setPrimaryMaterial(brassMat);
    } else if (lowerText.includes('marble')) {
      const marbleMat = PRIMARY_MATERIALS.find(m => m.id === 'mat-marble');
      if (marbleMat && primaryMaterial.id !== 'mat-marble') setPrimaryMaterial(marbleMat);
    } else if (lowerText.includes('sheesham') || lowerText.includes('rosewood')) {
      const sheeshamMat = PRIMARY_MATERIALS.find(m => m.id === 'mat-sheesham');
      if (sheeshamMat && primaryMaterial.id !== 'mat-sheesham') setPrimaryMaterial(sheeshamMat);
    } else if (lowerText.includes('teak') || lowerText.includes('sagwan')) {
      const teakMat = PRIMARY_MATERIALS.find(m => m.id === 'mat-teak');
      if (teakMat && primaryMaterial.id !== 'mat-teak') setPrimaryMaterial(teakMat);
    }
  }, [aiDescription]);''', '')

code = code.replace('''      // Match material or set extracted color
      const matchingMat = PRIMARY_MATERIALS.find(m => 
        m.name.toLowerCase().includes(spec.materialName.toLowerCase()) || 
        m.id.includes(spec.materialName.toLowerCase())
      );

      if (matchingMat) {
        setPrimaryMaterial(matchingMat);
      } else {
        setPrimaryMaterial({
          id: 'mat-custom-photo',
          name: spec.materialName,
          category: 'Wood',
          ratePerCubicFt: 2200,
          description: 'AI Extracted Material Texture from uploaded reference sketch',
          colorHex: spec.colorHex,
          roughness: spec.roughness,
          metalness: spec.metalness
        });
      }''', '')

# 4. Remove calculatePricing and replace it
calc_pricing_old = '''  const calculatePricing = () => {
    const rawMaterialRate = primaryMaterial.ratePerCubicFt;
    const materialCost = currentVolume * rawMaterialRate;

    const accentCost = selectedAccents.reduce((acc, accentId) => {
      const found = SECONDARY_ACCENTS.find((a) => a.id === accentId);
      return acc + (found ? found.flatCost : 0);
    }, 0);

    const finishCost = currentArea * selectedFinish.costPerSqFt;
    const baseCraftsmanCost = selectedProduct.baseLabor * selectedGrade.multiplier;

    const subtotal = (materialCost + accentCost + finishCost + baseCraftsmanCost) * selectedLocality.costMultiplier;
    
    const rangeMin = Math.round(subtotal * 0.90);
    const rangeMax = Math.round(subtotal * 1.15);
    const calculatedAverage = Math.round((rangeMin + rangeMax) / 2);

    return { subtotal, rangeMin, rangeMax, calculatedAverage };
  };

  const { rangeMin, rangeMax, calculatedAverage } = calculatePricing();'''

calc_pricing_new = '''  const { min: rangeMin, max: rangeMax, avg: calculatedAverage, breakdown } = calculateEstimatedCost(
    { lengthFt: parsedLength, widthFt: parsedWidth, heightFt: parsedHeight },
    selectedSlots,
    selectedGrade.multiplier,
    selectedLocality
  );'''
code = code.replace(calc_pricing_old, calc_pricing_new)

# 5. Remove sections 4, 5, 6, 7 block.
pattern = r"\{/\* 4️⃣ PRIMARY STRUCTURAL MATERIAL \*/\}[\s\S]*?\{/\* RIGHT COLUMN"
code = re.sub(pattern, "{/* RIGHT COLUMN", code)

# 6. Insert Locality picker into Estimate card
locality_select_html = '''
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#3E2E24]">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Craftsmanship Grade:</label>
                <select className="w-full bg-[#120B08] border border-[#3E2E24] text-white font-semibold rounded-2xl p-3 text-xs" value={selectedGrade.id} onChange={(e) => setSelectedGrade(CRAFTSMANSHIP_GRADES.find((g) => g.id === e.target.value) || CRAFTSMANSHIP_GRADES[1])}>
                  {CRAFTSMANSHIP_GRADES.map((g) => (
                    <option key={g.id} value={g.id}>{g.label} ({g.experienceTag}) — {g.multiplier}x</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Target Delivery Locality:</label>
                <select className="w-full bg-[#120B08] border border-[#3E2E24] text-white font-semibold rounded-2xl p-3 text-xs" value={selectedLocality.pincode} onChange={(e) => setSelectedLocality(LOCALITIES.find((l) => l.pincode === e.target.value) || LOCALITIES[0])}>
                  <optgroup label="Mumbai">
                    {LOCALITIES.filter(l => l.city === 'Mumbai').map((l) => (
                      <option key={l.pincode} value={l.pincode}>{l.name} ({l.pincode}) — Factor {l.costFactor}x</option>
                    ))}
                  </optgroup>
                  <optgroup label="Pune">
                    {LOCALITIES.filter(l => l.city === 'Pune').map((l) => (
                      <option key={l.pincode} value={l.pincode}>{l.name} ({l.pincode}) — Factor {l.costFactor}x</option>
                    ))}
                  </optgroup>
                  <optgroup label="Nashik">
                    {LOCALITIES.filter(l => l.city === 'Nashik').map((l) => (
                      <option key={l.pincode} value={l.pincode}>{l.name} ({l.pincode}) — Factor {l.costFactor}x</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
'''
estimate_card_pattern = r"(Calculated Area Average: <span.*?>₹\{Math.round\(calculatedAverage\).toLocaleString\(\"en-IN\"\)\}.00</span>\s*</div>)"
code = re.sub(estimate_card_pattern, r"\1\n" + locality_select_html, code)

# 7. Update Live Technical Spec Sheet Add-ons rendering
# Replace the hardcoded pills with dynamic rendering of `breakdown` items
addons_old_pattern = r"\{/\* ⚡ 5️⃣ ACTIVE 3D MODEL ADD-ONS & FEATURES INJECTED \*/\}[\s\S]*?</div>\s*</div>\s*</div>"
addons_new = '''{/* ⚡ 5️⃣ ACTIVE 3D MODEL ADD-ONS & FEATURES INJECTED */}
              <div className="bg-[#120B08] p-3.5 rounded-xl border border-[#EA580C]/40 space-y-2.5 shadow-inner mt-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#2A1E17]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
                    <span className="text-[11px] text-[#EA580C] font-extrabold uppercase tracking-wider block">
                      ACTIVE MATERIALS & ADD-ONS:
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#1A120E] p-2 rounded-lg border border-[#2A1E17]">
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-semibold">{item.materialName}</span>
                        <span className="text-[10px] text-slate-400">{item.role} • {item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-[#EAB308] font-mono">₹{Math.round(item.lineAvg).toLocaleString('en-IN')}</span>
                        <button 
                          onClick={() => removeSlot(item.role, selectedSlots.find(s => s.role === item.role && s.rateKey !== "")?.rateKey || "")}
                          className="w-6 h-6 rounded-full bg-red-950/40 text-red-400 flex items-center justify-center hover:bg-red-900/60 hover:text-red-300 transition-colors border border-red-900/30"
                          title="Remove Material"
                        >
                          <Minus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>'''
# Need to import Minus from lucide-react if not present, but wait, `Minus` might not be imported.
# Let's import Minus at the top.
if "Minus," not in code and "Minus " not in code:
    code = code.replace('import { \n  Hammer,', 'import { \n  Minus, Hammer,')

code = re.sub(addons_old_pattern, addons_new, code)

# 8. Add a 4th card "Recommended Combos" to the Blueprint Grid
# Wait, I need to find the Blueprint Grid.
# The user said: "Fix the empty space in the Materials Blueprint panel... add a 4th card 'Recommended Combos' in that slot"
# Let's look for "Core Structure Materials" or "Hardware & Storage Accessories"
blueprint_pattern = r"(<div className=\"bg-\[\#120B08\] border border-\[\#2A1E17\] rounded-xl p-4\">\s*<h4 className=\"text-xs font-bold text-slate-300 uppercase tracking-widest mb-3\">Hardware & Storage Accessories</h4>[\s\S]*?</div>)"
recommended_combos_card = '''
                <div className="bg-[#120B08] border border-[#2A1E17] rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Sparkles size={40} className="text-[#EAB308]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#EAB308]" /> Recommended Combos
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2.5 rounded-lg border border-[#EA580C]/30 bg-[#EA580C]/10 hover:bg-[#EA580C]/20 transition-colors flex flex-col">
                      <span className="text-xs font-bold text-white">Classic Teak + Brass</span>
                      <span className="text-[10px] text-slate-400 mt-1">Sagwan Teak Frame with Brass Accents</span>
                    </button>
                    <button className="w-full text-left p-2.5 rounded-lg border border-[#3E2E24] hover:bg-[#1A120E] transition-colors flex flex-col">
                      <span className="text-xs font-bold text-white">Modern Sheesham</span>
                      <span className="text-[10px] text-slate-400 mt-1">Rosewood with Fluted Panels</span>
                    </button>
                  </div>
                </div>
'''
code = re.sub(blueprint_pattern, r"\1" + "\n" + recommended_combos_card, code)

# Replace "import { Minus" if I just appended it.
# Wait, I used "Minus" instead of "Trash2" or something. Trash2 is already imported.
code = code.replace("<Minus size={12} />", "<Trash2 size={12} />")

with open('src/components/CustomerCampaignLauncher.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("UI refactored.")
