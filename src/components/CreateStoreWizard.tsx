import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Image as ImageIcon, CheckCircle2, ChevronRight, ChevronLeft, Upload, Hammer, Sparkles, X } from 'lucide-react';
import { useKaragirStore } from '../context/KaragirStoreContext';
import { MASTER_CATEGORIES } from '../data/categoriesData';
import { getAiFurnitureImages, getAiCoverImage } from '../utils/generateAiImages';

export const CreateStoreWizard: React.FC = () => {
  const { isWizardOpen, setIsWizardOpen, saveStoreProfile, addWorkItem } = useKaragirStore();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // Step 1 State
  const [shopName, setShopName] = useState('');
  const [shopTagline, setShopTagline] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);

  // Step 2 State (Single Work Upload for demo)
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState(MASTER_CATEGORIES[0]?.name || 'Sofa');
  const [workMaterial, setWorkMaterial] = useState('');
  const [workPrice, setWorkPrice] = useState(0);
  const [workLeadTime, setWorkLeadTime] = useState(14);
  const [imageFiles, _setImageFiles] = useState<string[]>([]); // Simulate uploaded files

  if (!isWizardOpen) return null;

  const handleNextStep1 = () => {
    saveStoreProfile({ shopName, shopTagline, yearsExperience });
    setStep(2);
  };

  const handleNextStep2 = () => {
    let cover = '';
    let gallery: string[] = [];
    
    // Simulate AI Image generation fallback if empty
    if (imageFiles.length === 0) {
      cover = getAiCoverImage(workTitle);
      gallery = getAiFurnitureImages(workTitle, workCategory);
    } else {
      cover = imageFiles[0];
      gallery = imageFiles;
    }

    addWorkItem({
      id: `work-${Date.now()}`,
      title: workTitle,
      category: workCategory,
      coverImage: cover,
      galleryImages: gallery,
      material: workMaterial,
      price: workPrice,
      leadTimeDays: workLeadTime
    });

    setStep(3);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsWizardOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#1F1510] border border-[#3E2E24] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[800px]">
        
        {/* Wizard Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A1E17] bg-[#120B08]/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F1510] border border-[#EA580C] flex items-center justify-center text-[#EA580C]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Your Shop</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-[#EA580C] glow-orange' : 'bg-[#2A1E17]'}`}></span>
                <span className="w-4 h-0.5 bg-[#2A1E17]"></span>
                <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-[#EA580C] glow-orange' : 'bg-[#2A1E17]'}`}></span>
                <span className="w-4 h-0.5 bg-[#2A1E17]"></span>
                <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-emerald-500 glow-green' : 'bg-[#2A1E17]'}`}></span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsWizardOpen(false)} className="p-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] text-slate-400 hover:text-white rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 1: Store Setup</h3>
                  <p className="text-sm text-slate-400">Establish your unique artisan brand.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Shop Name</label>
                    <input type="text" placeholder="e.g., Master Sharma Teak Studio" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Tagline</label>
                    <input type="text" placeholder="e.g., 4th Generation Hand-Carved Teakwood Specialist" value={shopTagline} onChange={(e) => setShopTagline(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Years of Experience</label>
                    <input type="number" value={yearsExperience || ''} onChange={(e) => setYearsExperience(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Profile & Banner Photo</label>
                    <div className="border-2 border-dashed border-[#2A1E17] hover:border-[#EA580C] bg-[#120B08] rounded-2xl p-6 text-center cursor-pointer transition-colors group">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-500 group-hover:text-[#EA580C] mb-2" />
                      <p className="text-sm font-bold text-slate-300">Upload Shop Images</p>
                      <p className="text-[10px] text-slate-500 mt-1">Leave empty to use AI-generated aesthetic fallbacks.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 2: Upload Your Work</h3>
                  <p className="text-sm text-slate-400">Add a flagship product to showcase your skills.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <select value={workCategory} onChange={(e) => setWorkCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C] appearance-none">
                      {MASTER_CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Item Name / Title</label>
                    <input type="text" placeholder="e.g., Hand-Carved Royal Sofa" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Materials Used</label>
                      <input type="text" placeholder="e.g., Solid Sheesham" value={workMaterial} onChange={(e) => setWorkMaterial(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Starting Price (₹)</label>
                      <input type="number" value={workPrice || ''} onChange={(e) => setWorkPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Production Lead Time (Days)</label>
                    <input type="number" value={workLeadTime || ''} onChange={(e) => setWorkLeadTime(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EA580C]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Upload 5 Work Images</label>
                    <div className="border-2 border-dashed border-[#2A1E17] hover:border-[#EA580C] bg-[#120B08] rounded-2xl p-5 text-center cursor-pointer group">
                      <Upload className="w-6 h-6 mx-auto text-[#EA580C] mb-2" />
                      <p className="text-[11px] font-bold text-white uppercase bg-[#EA580C]/20 px-2 py-1 rounded inline-block border border-[#EA580C]/30 mb-2 flex items-center space-x-1 w-fit mx-auto">
                        <Sparkles className="w-3 h-3" /><span>AI Generation Enabled</span>
                      </p>
                      <p className="text-[10px] text-slate-400">If you don't upload images, we will automatically generate 5 ultra-realistic luxury studio shots using Pollinations AI based on your title.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Store Ready to Publish!</h3>
                <p className="text-sm text-slate-400 max-w-md">Your artisan profile and first showcase item have been prepared. Click below to launch your digital storefront on the Karagir network.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wizard Footer */}
        <div className="p-4 border-t border-[#2A1E17] bg-[#1F1510] flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : null} className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${step > 1 ? 'text-slate-300 hover:text-white hover:bg-[#261B15] border border-[#2A1E17]' : 'text-slate-600 cursor-not-allowed'}`} disabled={step === 1 || isPublishing}>
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {step < 3 ? (
            <button onClick={step === 1 ? handleNextStep1 : handleNextStep2} disabled={step === 1 && !shopName} className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white font-bold text-sm transition-all shadow-lg glow-orange disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handlePublish} disabled={isPublishing} className="flex items-center space-x-2 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg glow-green disabled:opacity-50">
              {isPublishing ? (
                <>
                  <Hammer className="w-4 h-4 animate-hammer" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Shop</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
