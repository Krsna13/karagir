import React, { useState } from 'react';
import { useMaterial } from '../context/MaterialContext';
import { MATERIAL_BUCKETS, QUICK_MATERIAL_PILLS } from '../data/materialsMasterDatabase';
import { ChevronDown, Check, Sparkles, RotateCcw, Filter } from 'lucide-react';


export const MaterialFilterBar: React.FC = () => {
  const {
    selectedMaterialFilters,
    selectedCategoryBuckets,
    toggleMaterialFilter,
    toggleCategoryBucket,
    clearAllMaterialFilters,
  } = useMaterial();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedBucket, setExpandedBucket] = useState<string | null>('Solid Woods');

  const totalActiveFilters = selectedMaterialFilters.length + selectedCategoryBuckets.length;

  return (
    <div className="space-y-4">
      
      {/* 1. Quick Horizontal Scrollable Material Pills */}
      <div className="flex items-center justify-between bg-[#1F1510] p-3 rounded-2xl border border-[#2A1E17] shadow-lg">
        <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar py-1 pr-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#120B08] text-[#EA580C] text-xs font-bold shrink-0 border border-[#EA580C]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Raw Materials:</span>
          </div>

          {QUICK_MATERIAL_PILLS.map((pill) => {
            const isActive = selectedMaterialFilters.includes(pill.query);
            return (
              <button
                key={pill.id}
                onClick={() => toggleMaterialFilter(pill.query)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#EA580C] text-white shadow-md glow-orange border border-white/20'
                    : 'bg-[#120B08] text-slate-300 hover:text-white border border-[#2A1E17] hover:border-[#3E2E24]'
                }`}
              >
                <span>{pill.label}</span>
                {isActive && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>

        {totalActiveFilters > 0 && (
          <button
            onClick={clearAllMaterialFilters}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white text-xs font-semibold border border-[#2A1E17] shrink-0 transition-colors ml-2"
          >
            <RotateCcw className="w-3 h-3 text-[#EA580C]" />
            <span className="hidden sm:inline">Clear</span>
            <span className="bg-[#EA580C] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {totalActiveFilters}
            </span>
          </button>
        )}
      </div>

      {/* 2. Collapsible Sidebar Bucket Filter Panel */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-5 shadow-2xl space-y-4">
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center justify-between cursor-pointer select-none border-b border-[#2A1E17] pb-3"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#EA580C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Raw Material Categories ({MATERIAL_BUCKETS.length} Buckets)
            </h3>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
              isSidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isSidebarOpen && (
          <div className="space-y-3">
            {MATERIAL_BUCKETS.map((bucket) => {
              const isBucketSelected = selectedCategoryBuckets.includes(bucket.name);
              const isAccordionExpanded = expandedBucket === bucket.name;

              return (
                <div
                  key={bucket.name}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isBucketSelected
                      ? 'bg-[#261B15] border-[#EA580C]/70 shadow-md'
                      : 'bg-[#120B08] border-[#2A1E17]'
                  }`}
                >
                  {/* Bucket Header Row */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isBucketSelected}
                        onChange={() => toggleCategoryBucket(bucket.name)}
                        className="w-4 h-4 rounded accent-[#EA580C] bg-[#120B08] border-[#3E2E24] cursor-pointer"
                      />
                      <span className="text-base">{bucket.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{bucket.name}</h4>
                        <p className="text-[10px] text-slate-400">{bucket.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedBucket(isAccordionExpanded ? null : bucket.name)
                      }
                      className="p-1 rounded-lg hover:bg-[#1F1510] text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isAccordionExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sub-Items Checkboxes */}
                  {isAccordionExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-[#2A1E17]/60 grid grid-cols-2 gap-2 bg-[#120B08]/80">
                      {bucket.items.map((item) => {
                        const isItemSelected = selectedMaterialFilters.includes(item);
                        return (
                          <label
                            key={item}
                            className={`flex items-center space-x-2 p-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${
                              isItemSelected
                                ? 'text-[#EA580C] font-semibold bg-[#EA580C]/10'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isItemSelected}
                              onChange={() => toggleMaterialFilter(item)}
                              className="w-3.5 h-3.5 rounded accent-[#EA580C] bg-[#1F1510] border-[#3E2E24]"
                            />
                            <span className="truncate">{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
