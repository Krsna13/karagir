import React, { createContext, useContext, useState } from 'react';
import type { ItemMaterialSlot } from '../data/materialRates';

interface MaterialContextType {
  selectedMaterialFilters: string[];
  selectedCategoryBuckets: string[];
  selectedPrimaryMaterial: string;
  selectedAccentMaterials: string[];
  selectedFinish: string;
  selectedSlots: ItemMaterialSlot[];
  toggleMaterialFilter: (material: string) => void;
  toggleCategoryBucket: (bucket: string) => void;
  setPrimaryMaterial: (material: string) => void;
  toggleAccentMaterial: (accent: string) => void;
  setFinish: (finish: string) => void;
  clearAllMaterialFilters: () => void;
  calculateAdjustedPrice: (basePrice: number) => number;
  setSelectedSlots: (slots: ItemMaterialSlot[]) => void;
  toggleSlot: (slot: ItemMaterialSlot) => void;
  removeSlot: (role: string, rateKey: string) => void;
}

const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

export const MaterialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMaterialFilters, setSelectedMaterialFilters] = useState<string[]>([]);
  const [selectedCategoryBuckets, setSelectedCategoryBuckets] = useState<string[]>([]);
  const [selectedPrimaryMaterial, setSelectedPrimaryMaterial] = useState<string>('Sagwan (Teak Wood)');
  const [selectedAccentMaterials, setSelectedAccentMaterials] = useState<string[]>(['Solid Brass Wire / Sheet Inlay']);
  const [selectedFinish, setSelectedFinish] = useState<string>('Organic Beeswax & Linseed Oil (Matte/Natural)');
  const [selectedSlots, setSelectedSlots] = useState<ItemMaterialSlot[]>([]);

  const toggleMaterialFilter = (material: string) => {
    setSelectedMaterialFilters((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const toggleCategoryBucket = (bucket: string) => {
    setSelectedCategoryBuckets((prev) =>
      prev.includes(bucket) ? prev.filter((b) => b !== bucket) : [...prev, bucket]
    );
  };

  const toggleAccentMaterial = (accent: string) => {
    setSelectedAccentMaterials((prev) =>
      prev.includes(accent) ? prev.filter((a) => a !== accent) : [...prev, accent]
    );
  };

  const clearAllMaterialFilters = () => {
    setSelectedMaterialFilters([]);
    setSelectedCategoryBuckets([]);
  };

  const calculateAdjustedPrice = (basePrice: number): number => {
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

  const toggleSlot = (slot: ItemMaterialSlot) => {
    setSelectedSlots(prev => {
      const exists = prev.find(s => s.role === slot.role && s.rateKey === slot.rateKey);
      if (exists) {
        if (prev.length <= 1) return prev; // Guard: zero-materials-selected state
        return prev.filter(s => !(s.role === slot.role && s.rateKey === slot.rateKey));
      }
      return [...prev, slot];
    });
  };

  const removeSlot = (role: string, rateKey: string) => {
    setSelectedSlots(prev => {
      if (prev.length <= 1) {
        alert("Cannot remove the last material. Minimum one material required.");
        return prev;
      }
      return prev.filter(s => !(s.role === role && s.rateKey === rateKey));
    });
  };

  return (
    <MaterialContext.Provider
      value={{
        selectedMaterialFilters,
        selectedCategoryBuckets,
        selectedPrimaryMaterial,
        selectedAccentMaterials,
        selectedFinish,
        selectedSlots,
        toggleMaterialFilter,
        toggleCategoryBucket,
        setPrimaryMaterial: setSelectedPrimaryMaterial,
        toggleAccentMaterial,
        setFinish: setSelectedFinish,
        clearAllMaterialFilters,
        calculateAdjustedPrice,
        setSelectedSlots,
        toggleSlot,
        removeSlot
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};

export const useMaterial = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error('useMaterial must be used within a MaterialProvider');
  }
  return context;
};
