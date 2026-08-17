import React, { useEffect, useState } from 'react';
import type { MaterialPassport } from '../types/materialPassport';
import { getPublicMaterialPassport } from '../services/materialPassportService';
import { MaterialPassportView } from './MaterialPassportView';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  FileSearch, 
  Info
} from 'lucide-react';

interface PublicPassportVerificationProps {
  passportId: string | null;
  onBack: () => void;
}

export const PublicPassportVerification: React.FC<PublicPassportVerificationProps> = ({ 
  passportId, 
  onBack 
}) => {
  const [manualIdInput, setManualIdInput] = useState(passportId || 'KAR-MAT-2026-97373');
  const [searchedId, setSearchedId] = useState<string | null>(passportId);
  const [passport, setPassport] = useState<MaterialPassport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchPassport = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setSearchedId(idToFetch.trim());
    try {
      const data = await getPublicMaterialPassport(idToFetch.trim());
      setPassport(data);
    } catch (e) {
      console.error('Error fetching material passport:', e);
      setPassport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passportId) {
      setManualIdInput(passportId);
      fetchPassport(passportId);
    }
  }, [passportId]);

  const handleVerifyClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualIdInput.trim()) return;
    fetchPassport(manualIdInput.trim());
  };

  const handleSelectDemoId = (demoId: string) => {
    setManualIdInput(demoId);
    fetchPassport(demoId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Milestone Tracker</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Karagir Trust Engine</span>
        </div>
      </div>

      {/* =================================================== */}
      {/* VERIFY YOUR MATERIAL - SEARCH & CODE INPUT SECTION  */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#120B08] border border-[#EA580C] text-[#EA580C] mx-auto flex items-center justify-center shadow-lg">
            <FileSearch className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            Verify Material
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter the Kaaragir Material ID provided by the artisan to retrieve the recorded supplier purchase, batch information, quantity, photographs and applicable documentation.
          </p>
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleVerifyClick} className="max-w-lg mx-auto space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-left">
              Enter Material Verification ID
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="KAR-MAT-2026-97373" 
                value={manualIdInput}
                onChange={(e) => setManualIdInput(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#120B08] border-2 border-[#2A1E17] focus:border-[#EA580C] text-white text-base font-mono tracking-wider text-center focus:outline-none shadow-inner transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#EA580C] hover:bg-[#F97316] text-white text-sm font-extrabold uppercase tracking-widest transition-all shadow-lg glow-orange flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify Material</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Select ID Badges for Hackathon Judges */}
        <div className="max-w-lg mx-auto pt-2 border-t border-[#2A1E17]/80">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-2 text-center">
            Demo Test Material IDs:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemoId('KAR-MAT-2026-97373')}
              className="px-3 py-1.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-emerald-900/50 text-emerald-400 text-[11px] font-mono font-bold transition-colors"
            >
              ✓ KAR-MAT-2026-97373 (Verified)
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoId('KAR-MAT-2026-10482')}
              className="px-3 py-1.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-amber-900/50 text-amber-400 text-[11px] font-mono font-bold transition-colors"
            >
              ⚠ KAR-MAT-2026-10482 (Pending)
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoId('KAR-MAT-2026-30219')}
              className="px-3 py-1.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-rose-900/50 text-rose-400 text-[11px] font-mono font-bold transition-colors"
            >
              ✕ KAR-MAT-2026-30219 (Rejected)
            </button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* VERIFICATION RESULTS CONTAINER                     */}
      {/* =================================================== */}
      {loading && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-12">
          <div className="w-12 h-12 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            Retrieving material traceability ledger for #{searchedId}...
          </p>
        </div>
      )}

      {!loading && hasSearched && !passport && (
        /* RESULT STATE 2: NOT FOUND */
        <div className="max-w-lg mx-auto text-center p-8 sm:p-10 bg-[#1F1510] border border-rose-900/50 rounded-3xl space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-950/40 border border-rose-800 text-rose-400 mx-auto flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
              ✕ MATERIAL ID NOT FOUND
            </h2>
            <p className="text-sm font-mono text-rose-400 font-bold">{searchedId}</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              The Material ID could not be found. Please check the code and try again.
            </p>
          </div>

          <div className="p-4 bg-[#120B08] rounded-2xl border border-[#2A1E17] text-left text-xs text-slate-400 space-y-2">
            <p className="font-bold text-white flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-[#EA580C]" />
              <span>Troubleshooting Tips:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>Ensure the ID follows the format: <span className="font-mono text-white">KAR-MAT-YYYY-XXXXX</span></li>
              <li>Confirm the ID with your craftsman in the Milestone Tracker.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setManualIdInput('KAR-MAT-2026-97373');
              fetchPassport('KAR-MAT-2026-97373');
            }}
            className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            Try Demo Record (KAR-MAT-2026-97373)
          </button>
        </div>
      )}

      {!loading && hasSearched && passport && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Status Alert Banner */}
          {passport.batch.verificationStatus === 'VERIFIED' || passport.batch.status === 'client_approved' ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  ✓ MATERIAL RECORD FOUND & FULLY VERIFIED
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-900/40 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-700/50">
                {passport.batch.passportId}
              </span>
            </div>
          ) : passport.batch.verificationStatus === 'REJECTED' || passport.batch.status === 'rejected' ? (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-rose-400">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  ✕ MATERIAL VERIFICATION REJECTED
                </span>
              </div>
              <span className="text-[10px] font-mono bg-rose-900/40 text-rose-300 px-2.5 py-1 rounded-full border border-rose-700/50">
                {passport.batch.passportId}
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-amber-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  ⚠ MATERIAL VERIFICATION PENDING
                </span>
              </div>
              <span className="text-[10px] font-mono bg-amber-900/40 text-amber-300 px-2.5 py-1 rounded-full border border-amber-700/50">
                {passport.batch.passportId}
              </span>
            </div>
          )}

          {/* Full Customer Verification Result View */}
          <MaterialPassportView passport={passport} />

        </div>
      )}

    </div>
  );
};
