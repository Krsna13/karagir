import React, { useState } from 'react';
import type { Artisan, Product } from '../types';
import { MOCK_ARTISANS, MOCK_PRODUCTS } from '../data/mockData';
import { Star, ShieldCheck, MapPin, Play, Eye, Search, Hammer, Sparkles, ArrowLeft } from 'lucide-react';
import { ThreeDProductViewer } from './ThreeDProductViewer';
import { ArtisanProduct3DEditor } from './ArtisanProduct3DEditor';

interface ArtisanStorefrontProps {
  artisan?: Artisan;
  onOpenReel: (artisan: Artisan) => void;
  onBack?: () => void;
}

export const ArtisanStorefront: React.FC<ArtisanStorefrontProps> = ({
  artisan = MOCK_ARTISANS[0],
  onOpenReel,
  onBack,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterPills = ['All Products', 'Custom Sofas', 'Teak Mandir', 'Dining Sets', 'Cane & Outdoor'];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || prod.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeFilter === 'All Products' ||
      (activeFilter === 'Dining Sets' && prod.category === 'Woodwork') ||
      (activeFilter === 'Teak Mandir' && prod.title.includes('Mandir')) ||
      (activeFilter === 'Cane & Outdoor' && prod.category === 'Cane');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back Button Navigation Header */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Artisans Directory</span>
          </button>
        </div>
      )}
      
      {/* 1. Workshop Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-[#2A1E17] bg-[#1F1510] shadow-2xl">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={artisan.coverUrl}
            alt={artisan.shopName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1510] via-black/40 to-transparent"></div>

          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#120B08]/80 text-emerald-400 text-xs font-semibold backdrop-blur-md border border-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Karagir Workshop</span>
            </span>
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#120B08]/80 text-slate-300 text-xs font-mono backdrop-blur-md border border-[#2A1E17]">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{artisan.distanceKm} km in {artisan.locality}, Nashik</span>
            </span>
          </div>

          <button
            onClick={() => onOpenReel(artisan)}
            className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold shadow-xl transition-all glow-orange"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>15s Live Workshop Reel</span>
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-8 -mt-16 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-end space-x-5">
            <img
              src={artisan.avatarUrl}
              alt={artisan.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#1F1510] shadow-2xl"
            />
            <div className="space-y-1 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{artisan.shopName}</h1>
              <p className="text-sm font-semibold text-slate-300">
                Master Karagir: <span className="text-[#EA580C]">{artisan.name}</span> ({artisan.experienceYears}+ Yrs Exp)
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  {artisan.rating} ({artisan.reviewsCount} verified reviews)
                </span>
                <span>•</span>
                <span>Response time: <strong className="text-white">{artisan.responseTime}</strong></span>
              </div>
            </div>
          </div>

          <button className="px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition-all shadow-lg glow-orange flex items-center space-x-2">
            <Hammer className="w-4 h-4" />
            <span>Request Custom Order</span>
          </button>
        </div>
      </section>

      {/* 2. SECTION B: ARTISAN STOREFRONT 3D PRODUCT EDITOR */}
      <section id="storefront-3d-editor">
        <ArtisanProduct3DEditor />
      </section>

      {/* 3. In-Store Product Catalog */}
      <section className="space-y-6">
        <div className="bg-[#1F1510] p-4 rounded-2xl border border-[#2A1E17] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto py-1">
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === pill
                    ? 'bg-[#EA580C] text-white shadow-md'
                    : 'bg-[#120B08] text-slate-400 hover:text-white border border-[#2A1E17]'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workshop catalog..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#120B08] border border-[#2A1E17] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#1F1510] border border-[#2A1E17] hover:border-[#EA580C]/70 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1510] via-transparent to-black/20"></div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold shadow-lg transition-all glow-orange"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>3D View / Inspect</span>
                  </button>

                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#120B08]/90 text-amber-400 border border-[#2A1E17]">
                    #{product.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#EA580C] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                  
                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-[#2A1E17]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Material:</span>
                      <span className="font-semibold text-white">{product.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensions:</span>
                      <span className="font-mono text-slate-300">{product.dimensions}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Base Price</span>
                  <span className="text-lg font-extrabold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-4 py-2.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-[#EA580C] hover:text-white text-xs font-bold border border-[#EA580C]/40 transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect 3D</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3D Inspection Viewport Modal */}
      {selectedProduct && (
        <ThreeDProductViewer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};
