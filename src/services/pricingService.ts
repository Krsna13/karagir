/**
 * Pure functions for calculating material pricing adjustments.
 * This separates pricing business logic from React Context state.
 */

export const calculateAdjustedPrice = (
  basePrice: number, 
  selectedPrimaryMaterial: string, 
  selectedAccentMaterials: string[]
): number => {
  let price = basePrice;
  
  if (selectedPrimaryMaterial.includes('Sheesham')) price -= 3500;
  else if (selectedPrimaryMaterial.includes('Mango')) price -= 7000;
  else if (selectedPrimaryMaterial.includes('Walnut')) price += 5000;
  else if (selectedPrimaryMaterial.includes('Brass')) price += 2500;

  if (selectedAccentMaterials.includes('Solid Brass Wire / Sheet Inlay')) price += 1800;
  if (selectedAccentMaterials.includes('Mother of Pearl / Bone Tiles')) price += 2500;
  if (selectedAccentMaterials.includes('Hand-Carved Wooden Jali Panels')) price += 1200;
  if (selectedAccentMaterials.includes('22K Gold Leafing (Vark) Accents')) price += 3000;

  return Math.max(1000, price);
};
