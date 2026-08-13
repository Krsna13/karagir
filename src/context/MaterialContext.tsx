import React, { createContext, useContext, useState } from 'react';
import type { ItemMaterialSlot } from '../data/materialRates';
import { calculateAdjustedPrice as calculatePriceService } from '../services/pricingService';

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
    return calculatePriceService(basePrice, selectedPrimaryMaterial, selectedAccentMaterials);
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
