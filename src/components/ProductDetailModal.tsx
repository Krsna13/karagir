import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductItem } from '../types';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { AiImage } from './AiImage';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const BADGES = [
  "Featured Cover / Master Build",
  "Studio Shot",
  "Joinery Detail",
  "Raw Timber View",
  "Ambient Design",
  "Dimensions Showcase"
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setIsOrdered(false);
      setIsSubmitting(false);
      setActiveIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleRequestBuild = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `KARAGIR-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setIsOrdered(true);
    }, 600);
  };

  const allImages = [product.coverImage, ...product.galleryImages];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#120B08] border border-[#3E2E24] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#1F1510]/80 hover:bg-[#EA580C] text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Viewer */}
        <div className="w-full md:w-3/5 flex flex-col p-6 space-y-4 bg-[#1F1510] border-r border-[#2A1E17]">
          {/* Hero Stage */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-[#1F1510] border border-[#2A1E17]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <AiImage
                  src={allImages[activeIndex]}
                  alt={`${product.name} View ${activeIndex + 1}`}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Active Badge Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-full bg-[#120B08]/90 text-xs font-bold text-[#EA580C] border border-[#EA580C]/40 backdrop-blur-md shadow-lg flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{BADGES[activeIndex] || "AI Generated View"}</span>
              </span>

              {isOrdered && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 rounded-full bg-emerald-950/90 text-xs font-bold text-emerald-400 border border-emerald-500/50 backdrop-blur-md shadow-lg flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ORDER PLACED ✓</span>
                </motion.span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex space-x-3 overflow-x-auto custom-scrollbar pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  activeIndex === idx ? 'border-[#EA580C] scale-105 shadow-[0_0_10px_rgba(234,88,12,0.5)]' : 'border-[#2A1E17] opacity-60 hover:opacity-100'
                }`}
              >
                <AiImage src={img} alt={`Thumbnail ${idx + 1}`} containerClassName="absolute inset-0 w-full h-full" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-2/5 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{product.category}</div>
              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">{product.name}</h2>
              <div className="text-2xl font-mono font-bold text-[#EAB308]">₹{product.startingPrice.toLocaleString('en-IN')} <span className="text-sm text-slate-400">starting price</span></div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium Materials</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((mat, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-sm text-slate-200">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto space-y-4">
            {isOrdered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-[#120B08] border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] space-y-3"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-white">Your Order is Placed!</h3>
                      <span className="text-emerald-400 font-bold text-lg">✓</span>
                    </div>
                    <p className="text-xs text-emerald-300 font-mono font-semibold mt-0.5">
                      Order ID: {orderId}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Your custom build request for <strong className="text-white">{product.name}</strong> has been assigned to our master artisans.
                </p>

                <div className="flex items-center space-x-2 pt-2">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    Done
                  </button>
                  <button 
                    onClick={() => setIsOrdered(false)}
                    className="px-4 py-3 rounded-xl bg-[#1F1510] hover:bg-[#2A1E17] border border-[#3E2E24] text-slate-300 hover:text-white text-xs font-bold transition-all active:scale-95"
                  >
                    Order Another
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Karagir Master Guarantee</span>
                </div>
                <button 
                  onClick={handleRequestBuild}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#EA580C] hover:bg-[#F97316] active:scale-[0.98] text-white font-bold transition-all shadow-lg glow-orange flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span>Request Custom Build</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};
