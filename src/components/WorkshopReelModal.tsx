import React, { useEffect } from 'react';
import type { Artisan } from '../types';
import { Play, ShieldCheck, X } from 'lucide-react';

interface WorkshopReelModalProps {
  artisan: Artisan;
  onClose: () => void;
}

export const WorkshopReelModal: React.FC<WorkshopReelModalProps> = ({ artisan, onClose }) => {
  // Lock background scroll when modal opens
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#1F1510] border border-[#3E2E24] rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Video Player Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-[#120B08]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2A1E17]">
            <img
              src={artisan.avatarUrl}
              alt={artisan.name}
              className="w-6 h-6 rounded-full object-cover border border-[#EA580C]"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{artisan.shopName}</p>
              <p className="text-[9px] text-slate-400">{artisan.locality}, Nashik</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#120B08]/80 hover:bg-[#261B15] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-[#2A1E17]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Reel HTML5 Element */}
        <div className="relative w-full h-[520px] bg-black">
          <video
            src={artisan.workshopReelUrl || 'https://assets.mixkit.co/videos/preview/mixkit-carpenter-sanding-a-piece-of-wood-41315-large.mp4'}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          />

          {/* Bottom Live Workshop Reel Badge */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#120B08]/90 backdrop-blur-md p-4 rounded-2xl border border-[#3E2E24]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold tracking-wider uppercase">
                <Play className="w-2.5 h-2.5 fill-current mr-1" />
                Live Workshop Reel
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                Verified Karagir
              </span>
            </div>

            <h4 className="text-sm font-bold text-white">{artisan.name}</h4>
            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{artisan.bio}</p>

            <button
              onClick={onClose}
              className="mt-3 w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition-all shadow-lg glow-orange"
            >
              Request Custom Quote From {artisan.name}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
