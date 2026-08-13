import React, { useEffect, useState } from 'react';
import type { MaterialPassport } from '../types/materialPassport';
import { getPublicMaterialPassport } from '../services/materialPassportService';
import { MaterialPassportView } from './MaterialPassportView';
import { ShieldCheck, ArrowLeft, Award, User, Factory, Compass } from 'lucide-react';

interface PublicPassportVerificationProps {
  passportId: string | null;
  onBack: () => void;
}

export const PublicPassportVerification: React.FC<PublicPassportVerificationProps> = ({ 
  passportId, 
  onBack 
}) => {
  const [passport, setPassport] = useState<MaterialPassport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPassport = async () => {
      if (!passportId) return;
      setLoading(true);
      const data = await getPublicMaterialPassport(passportId);
      setPassport(data);
      setLoading(false);
    };

    fetchPublicPassport();
  }, [passportId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-mono">Retrieving Material Passport #{passportId}...</p>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-[#1F1510] border border-[#2A1E17] rounded-3xl space-y-6 shadow-2xl">
        <AlertTriangle className="w-12 h-12 text-[#EA580C] mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">Passport Not Found</h2>
        <p className="text-xs text-slate-400">The Material Passport ID you scanned does not match any batch registered on the Karagir platform.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold w-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { batch, evidence } = passport;
  const isApproved = batch.status === 'client_approved';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Marketplace</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Authentic Seal and Passport Badge */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-2xl text-center space-y-6 relative overflow-hidden">
            
            {/* Absolute decorative glow */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#EA580C]/10 rounded-full blur-2xl"></div>

            <div className="w-20 h-20 rounded-full bg-amber-950/20 border-2 border-amber-800/40 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Certificate of Material Provenance</h2>
              <p className="text-xs text-slate-400 leading-relaxed px-4">
                This public verification passport displays a verified audit trail of raw materials logged by the craftsman and manually checked by the client.
              </p>
            </div>

            <div className="border-t border-[#2A1E17] pt-6 flex flex-col items-center justify-center space-y-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Provenance Status</span>
              {isApproved ? (
                <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-extrabold shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CLIENT VERIFIED & SIGNED</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-amber-950/40 border border-amber-800 text-amber-400 text-xs font-extrabold shadow-sm">
                  <span>PENDING VERIFICATION</span>
                </div>
              )}
            </div>

            <p className="text-[9px] text-slate-500 font-mono">Verified via Karagir Escrow Contract Security</p>
          </div>

          <MaterialPassportView passport={passport} />
        </div>

        {/* Right Column: Visual Journey & Safe Public Specs */}
        <div className="lg:col-span-7 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#EA580C]" />
              <span>Material Origin & Crafting Journey</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Verifiable timeline tracking materials from lumberyard procurement to final assembly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#2A1E17] pb-6">
            <div className="p-4 bg-[#120B08] border border-[#2A1E17] rounded-2xl flex items-start space-x-3">
              <Factory className="w-4 h-4 text-[#EA580C] mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Supplier Name</span>
                <span className="text-xs text-white font-bold">{batch.supplierName}</span>
                <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Sourced locally in Nashik region</span>
              </div>
            </div>

            <div className="p-4 bg-[#120B08] border border-[#2A1E17] rounded-2xl flex items-start space-x-3">
              <User className="w-4 h-4 text-[#EA580C] mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Order ID</span>
                <span className="text-xs text-white font-mono font-bold">#{batch.orderId.split('-').pop() || batch.orderId}</span>
                <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Custom Commissions Only</span>
              </div>
            </div>
          </div>

          <MaterialPassportView passport={passport} showTimelineOnly={true} />

          {/* Grain and raw material image previews */}
          {evidence.some(e => e.type === 'grain_closeup' || e.type === 'raw_full') && (
            <div className="space-y-4 pt-4 border-t border-[#2A1E17]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Material Evidence Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {evidence.filter(e => e.type === 'grain_closeup' || e.type === 'raw_full').map(ev => (
                  <div key={ev.id} className="relative rounded-2xl border border-[#2A1E17] overflow-hidden group bg-[#120B08]">
                    <img src={ev.storagePath} alt={ev.type} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                        {ev.type === 'grain_closeup' ? 'Close-up grain matching' : 'Raw plank photograph'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// Simple import patch helper
import { AlertTriangle } from 'lucide-react';
