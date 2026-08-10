import React, { useEffect } from 'react';
import { useMaterial } from '../context/MaterialContext';
import { SECONDARY_ACCENT_OPTIONS } from '../data/materialsMasterDatabase';
import { Sparkles, Check, X } from 'lucide-react';

interface MultiMaterialAddonProps {
  onClose: () => void;
}

export const MultiMaterialAddon: React.FC<MultiMaterialAddonProps> = ({ onClose }) => {
  const {
    selectedPrimaryMaterial,
    selectedAccentMaterials,
    toggleAccentMaterial,
  } = useMaterial();


  // Lock background scroll when modal opens
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#1F1510] border border-[#3E2E24] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2A1E17] pb-4">
          <div>
            <span className="flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider text-[#EA580C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Material Inlay Engine</span>
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">Layer Secondary Accent Materials</h3>
            <p className="text-xs text-slate-400">Combine metal inlays, bone tiles, or gold leafing onto your base timber.</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-[#2A1E17]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Base Material Summary */}
        <div className="p-3.5 rounded-2xl bg-[#120B08] border border-[#2A1E17] flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mandatory Base Material</span>
            <span className="font-bold text-white">{selectedPrimaryMaterial}</span>
          </div>
          <span className="text-emerald-400 text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Base Timber Locked
          </span>
        </div>

        {/* Secondary Inlays & Accents (Multi-Select Checkboxes) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Secondary Accents & Inlays:
          </label>

          <div className="space-y-2.5">
            {SECONDARY_ACCENT_OPTIONS.map((accent) => {
              const isSelected = selectedAccentMaterials.includes(accent.label);
              return (
                <label
                  key={accent.id}
                  onClick={() => toggleAccentMaterial(accent.label)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-xs cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#EA580C]/20 border-[#EA580C] text-white font-semibold shadow-md'
                      : 'bg-[#120B08] border-[#2A1E17] text-slate-400 hover:border-[#3E2E24] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-[#EA580C] border-[#EA580C]' : 'bg-[#1F1510] border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-base">{accent.icon}</span>
                    <span>{accent.label}</span>
                  </div>

                  <span className={`font-mono text-[11px] ${isSelected ? 'text-[#EAB308] font-bold' : 'text-slate-500'}`}>
                    +₹{accent.price.toLocaleString('en-IN')}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition-all shadow-lg glow-orange flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Multi-Material Inlay Selection</span>
          </button>
        </div>

      </div>
    </div>
  );
};
