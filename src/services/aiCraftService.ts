// src/services/aiCraftService.ts

export interface ParsedAiSpec {
  categoryName?: string;
  materialId?: string;
  materialName?: string;
  colorHex?: string;
  roughness?: number;
  metalness?: number;
  finishName?: string;
  finishId?: string;
  lengthFt?: number;
  widthFt?: number;
  heightFt?: number;
  accents?: string[];
  hasDrawers?: boolean;
  hasCarvedLegs?: boolean;
  hasBottomShelf?: boolean;
  hasGlassTop?: boolean;
  explanationNotes: string;
  usedGeminiApi: boolean;
}

// Default fallback keyword map
const MATERIAL_KEYWORDS: Record<string, { id: string; name: string; colorHex: string; roughness: number; metalness: number }> = {
  teak: { id: "mat-teak", name: "Grade-A Sagwan (Teak Wood)", colorHex: "#8B4513", roughness: 0.4, metalness: 0.1 },
  sagwan: { id: "mat-teak", name: "Grade-A Sagwan (Teak Wood)", colorHex: "#8B4513", roughness: 0.4, metalness: 0.1 },
  sheesham: { id: "mat-sheesham", name: "Indian Sheesham (Rosewood)", colorHex: "#5C2C16", roughness: 0.35, metalness: 0.1 },
  rosewood: { id: "mat-sheesham", name: "Indian Sheesham (Rosewood)", colorHex: "#5C2C16", roughness: 0.35, metalness: 0.1 },
  mango: { id: "mat-mango", name: "Seasoned Mango Wood", colorHex: "#C49A45", roughness: 0.5, metalness: 0.05 },
  brass: { id: "mat-brass", name: "Moradabad Cast Brass", colorHex: "#D4AF37", roughness: 0.2, metalness: 0.85 },
  clay: { id: "mat-clay", name: "Khurja Glazed Terracotta Clay", colorHex: "#C06C4C", roughness: 0.6, metalness: 0.1 },
  terracotta: { id: "mat-clay", name: "Khurja Glazed Terracotta Clay", colorHex: "#C06C4C", roughness: 0.6, metalness: 0.1 },
  marble: { id: "mat-marble", name: "Makrana Pure White Marble", colorHex: "#F5F5F0", roughness: 0.1, metalness: 0.2 },
  cane: { id: "mat-cane", name: "Assam Natural Rattan / Cane", colorHex: "#E3C08D", roughness: 0.7, metalness: 0.0 },
  rattan: { id: "mat-cane", name: "Assam Natural Rattan / Cane", colorHex: "#E3C08D", roughness: 0.7, metalness: 0.0 },
};

/**
 * Main AI Text Prompt Analyzer Service
 * Supports optional Gemini 1.5 Flash API Key OR Smart Client-Side NLP Engine
 */
export async function parseDesignDescriptionWithAI(
  promptText: string,
  userApiKey?: string
): Promise<ParsedAiSpec> {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  const lower = promptText.toLowerCase();

  // Extract Feature Commands
  const hasDrawers = lower.includes('drawer') || lower.includes('cabinet') || lower.includes('storage') || lower.includes('pullout');
  const hasCarvedLegs = lower.includes('carved') || lower.includes('fluted') || lower.includes('pillar') || lower.includes('turned');
  const hasBottomShelf = lower.includes('shelf') || lower.includes('bottom rack') || lower.includes('rack');
  const hasGlassTop = lower.includes('glass') || lower.includes('transparent');

  // Try Gemini API if Key is provided
  if (apiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this custom furniture / craft design description: "${promptText}". Extract the parameters into valid JSON format with keys:
                    "categoryName" (string, e.g. "Bespoke Dining Table", "Temple Mandir", "Jhula Swing", "Urli Bowl"),
                    "materialName" (string),
                    "colorHex" (string hex code like "#8B4513", "#D4AF37", "#F5F5F0"),
                    "roughness" (number 0.1 to 0.8),
                    "metalness" (number 0.0 to 0.9),
                    "finishName" (string),
                    "lengthFt" (number),
                    "widthFt" (number),
                    "heightFt" (number),
                    "hasDrawers" (boolean),
                    "hasCarvedLegs" (boolean),
                    "explanationNotes" (short summary). Return ONLY raw JSON.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJsonStr = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJsonStr = rawJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);

        return {
          categoryName: parsed.categoryName,
          materialName: parsed.materialName,
          colorHex: parsed.colorHex || '#8B4513',
          roughness: parsed.roughness ?? 0.4,
          metalness: parsed.metalness ?? 0.1,
          finishName: parsed.finishName,
          lengthFt: parsed.lengthFt,
          widthFt: parsed.widthFt,
          heightFt: parsed.heightFt,
          hasDrawers: parsed.hasDrawers ?? hasDrawers,
          hasCarvedLegs: parsed.hasCarvedLegs ?? hasCarvedLegs,
          hasBottomShelf,
          hasGlassTop,
          explanationNotes: parsed.explanationNotes || `Gemini AI Parsed Specs: ${parsed.materialName || 'Custom'}${parsed.hasDrawers ? ' + Front Drawers' : ''}`,
          usedGeminiApi: true,
        };
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart NLP engine:", err);
    }
  }

  // Smart Client-side Natural Language Parser Engine (Zero external API required)
  // Extract Material
  let matchedMat = MATERIAL_KEYWORDS['teak'];
  let matMatchedExplicitly = false;
  for (const key of Object.keys(MATERIAL_KEYWORDS)) {
    if (lower.includes(key)) {
      matchedMat = MATERIAL_KEYWORDS[key];
      matMatchedExplicitly = true;
      break;
    }
  }

  // Extract Category
  let categoryName = undefined;
  if (lower.includes('mandir') || lower.includes('temple')) categoryName = 'Carved Wooden Home Temple (Mandir)';
  else if (lower.includes('urli') || lower.includes('fountain') || lower.includes('bowl')) categoryName = 'Hand-Carved Brass & Marble Urli';
  else if (lower.includes('jhula') || lower.includes('swing')) categoryName = 'Royal Rajasthani Carved Jhula';
  else if (lower.includes('table') || lower.includes('dining')) categoryName = 'Hand-Turned Sagwan Teak Dining Table';
  else if (lower.includes('sofa') || lower.includes('lounge')) categoryName = 'Heritage Carved Teak Lounge Sofa';

  // Extract Dimensions (e.g. "8ft", "5x3", "7 feet", "10 foot")
  let lengthFt: number | undefined = undefined;
  let widthFt: number | undefined = undefined;
  let heightFt: number | undefined = undefined;

  const dimensionMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:x|by|\*)\s*(\d+(?:\.\d+)?)(?:\s*(?:x|by|\*)\s*(\d+(?:\.\d+)?))?/);
  if (dimensionMatch) {
    lengthFt = parseFloat(dimensionMatch[1]);
    widthFt = parseFloat(dimensionMatch[2]);
    if (dimensionMatch[3]) heightFt = parseFloat(dimensionMatch[3]);
  } else {
    const singleNumMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)/);
    if (singleNumMatch) {
      lengthFt = parseFloat(singleNumMatch[1]);
    }
  }

  // Extract Finish
  let finishName = undefined;
  if (lower.includes('gloss')) finishName = 'PU High Gloss Finish';
  else if (lower.includes('walnut')) finishName = 'Dark Walnut Oil Finish';
  else if (lower.includes('wax') || lower.includes('beeswax')) finishName = 'Natural Organic Beeswax Matte';

  // Feature Explanation
  const featureList: string[] = [];
  if (hasDrawers) featureList.push('Front 3D Pullout Drawers');
  if (hasCarvedLegs) featureList.push('Rajasthani Carved Fluted Legs');
  if (hasBottomShelf) featureList.push('Bottom Storage Shelf');
  if (hasGlassTop) featureList.push('Glass Top Overlay');

  const featureSummary = featureList.length > 0 ? ` + Added ${featureList.join(', ')}` : '';
  const matSummary = matMatchedExplicitly ? `Matched ${matchedMat.name}` : `Built 3D Model Spec`;

  return {
    categoryName,
    materialId: matchedMat.id,
    materialName: matchedMat.name,
    colorHex: matchedMat.colorHex,
    roughness: matchedMat.roughness,
    metalness: matchedMat.metalness,
    finishName,
    lengthFt,
    widthFt,
    heightFt,
    hasDrawers,
    hasCarvedLegs,
    hasBottomShelf,
    hasGlassTop,
    explanationNotes: `✨ AI 3D Model Updated: ${matSummary}${featureSummary}`,
    usedGeminiApi: false,
  };
}
