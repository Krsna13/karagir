import React, { useState } from 'react';
import { Hammer, Tag, IndianRupee, Image as ImageIcon } from 'lucide-react';
import type { KaragirStore, WorkItem } from '../types';

interface Props {
  storeData: KaragirStore | null;
  addWorkItem: (item: WorkItem) => Promise<void>;
}

export const CatalogEditor: React.FC<Props> = ({ storeData, addWorkItem }) => {
  const [newItem, setNewItem] = useState<WorkItem>({
    id: '',
    title: '',
    category: storeData?.craftSpecialty || '',
    coverImage: '',
    galleryImages: [],
    price: 0,
    material: '',
    leadTimeDays: 14
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || newItem.price <= 0) return;
    
    await addWorkItem({
      ...newItem,
      id: Math.random().toString(36).substring(7),
      coverImage: newItem.coverImage || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80' // Fallback image if empty
    });
    
    setNewItem({ ...newItem, title: '', price: 0, material: '', coverImage: '' });
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      
      {/* Header */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-xl flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#120B08] border border-[#EA580C] flex items-center justify-center">
            <Hammer className="w-5 h-5 text-[#EA580C]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Catalog & Categories</h2>
            <p className="text-xs text-slate-400">Manage your workshop offerings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Existing Products Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {storeData?.works?.map(work => (
              <div key={work.id} className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl overflow-hidden hover:border-[#EA580C]/50 transition-colors shadow-lg group">
                <div className="h-44 overflow-hidden relative">
                  <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    {work.category}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white truncate">{work.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                      <Tag className="w-3 h-3" />
                      <span>{work.material}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#2A1E17]">
                    <span className="text-[#EAB308] font-mono text-sm font-extrabold flex items-center">
                      ₹{work.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-[#120B08] px-2 py-1 rounded-md">Live</span>
                  </div>
                </div>
              </div>
            ))}

            {(!storeData?.works || storeData.works.length === 0) && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-[#2A1E17] rounded-3xl">
                <Hammer className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-sm font-bold text-slate-400">No products in your catalog yet.</p>
                <p className="text-xs text-slate-500">Use the form on the right to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky 'Create New Listing' Form */}
        <div className="lg:col-span-4 sticky top-8">
          <form onSubmit={handleAdd} className="bg-[#120B08] border border-[#EA580C]/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Create New Listing</h3>
              <p className="text-xs text-slate-400">Add a new item to your storefront</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Product Title</label>
                <input type="text" required value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Carved Dining Table" className="w-full px-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Category</label>
                <input type="text" required value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Raw Material</label>
                <input type="text" required value={newItem.material} onChange={e => setNewItem({...newItem, material: e.target.value})} placeholder="e.g. Teak Wood" className="w-full px-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Photo URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="url" value={newItem.coverImage} onChange={e => setNewItem({...newItem, coverImage: e.target.value})} placeholder="https://..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Base Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="number" required value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold shadow-lg transition-all glow-orange">
                List Product to Storefront
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
