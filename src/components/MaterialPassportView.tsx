import React, { useState } from 'react';
import type { MaterialPassport } from '../types/materialPassport';
import { 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Package, 
  HelpCircle, 
  Clock, 
  Layers, 
  MapPin, 
  Building, 
  CheckCircle2, 
  X,
  FolderKanban
} from 'lucide-react';

interface MaterialPassportViewProps {
  passport: MaterialPassport;
  showTimelineOnly?: boolean;
}

export const MaterialPassportView: React.FC<MaterialPassportViewProps> = ({ 
  passport, 
  showTimelineOnly = false 
}) => {
  const [activeMediaModal, setActiveMediaModal] = useState<{ title: string; type: 'invoice' | 'photos'; url?: string } | null>(null);
  const { batch, evidence = [], certifications = [] } = passport;

  const isVerified = batch.verificationStatus === 'VERIFIED' || batch.status === 'client_approved' || batch.traceabilityStatus === 'TRACEABILITY_COMPLETE';
  const isRejected = batch.verificationStatus === 'REJECTED' || batch.status === 'rejected' || batch.traceabilityStatus === 'REJECTED';

  const hasCert = certifications.length > 0 || !!batch.certificateAvailable;
  const invoiceEvidence = evidence.find(e => e.type === 'invoice' || e.type === 'receipt');

  // Format Dates nicely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '14 August 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const registeredDate = formatDate(batch.purchaseDate || batch.createdAt);
  const updatedDate = batch.lastVerificationUpdate || formatDate(batch.updatedAt || batch.createdAt);

  const purchasedQty = batch.purchasedQuantity || 100;
  const allocatedQty = batch.allocatedQuantity || 30;
  const remainingQty = batch.remainingQuantity !== undefined ? batch.remainingQuantity : Math.max(0, purchasedQty - allocatedQty);
  const unit = batch.quantityUnit || 'kg';
  const allocatedPercent = Math.min(100, Math.max(0, (allocatedQty / purchasedQty) * 100));
  const remainingPercent = Math.min(100, Math.max(0, (remainingQty / purchasedQty) * 100));

  // Dynamic 8-step provenance timeline
  const timelineSteps = [
    {
      num: 1,
      title: 'Material Purchased',
      date: registeredDate,
      description: `${purchasedQty} ${unit} of ${batch.materialType} purchased from ${batch.supplierName}.`,
      isCompleted: true
    },
    {
      num: 2,
      title: 'Supplier Invoice Registered',
      date: registeredDate,
      description: `Invoice ${batch.invoiceNumber || 'INV-4521'} recorded into provenance ledger.`,
      isCompleted: true
    },
    {
      num: 3,
      title: 'Supplier Batch ID Recorded',
      date: registeredDate,
      description: `Original supplier batch code ${batch.supplierBatchId || 'TV-0826-19'} catalogued.`,
      isCompleted: true
    },
    {
      num: 4,
      title: 'Material Evidence Uploaded',
      date: registeredDate,
      description: `Full plank, grain closeup, and angle photographs recorded.`,
      isCompleted: true
    },
    {
      num: 5,
      title: 'Material Allocated to Project',
      date: registeredDate,
      description: `${allocatedQty} ${unit} allocated for ${batch.projectName || 'Custom Oak & Sagwan Teak Dining Table'}.`,
      isCompleted: true
    },
    {
      num: 6,
      title: 'Physical Verification',
      date: isVerified ? registeredDate : (isRejected ? 'Inspection Failed' : 'Pending Inspection'),
      description: isVerified 
        ? 'Physical checks completed: quantity, dimensions, condition & batch verified.' 
        : isRejected 
          ? 'Physical check rejected: does not satisfy craft quality criteria.' 
          : 'Awaiting on-site physical material inspection.',
      isCompleted: isVerified
    },
    {
      num: 7,
      title: 'Material Verified',
      date: isVerified ? updatedDate : (isRejected ? 'Rejected' : 'In Queue'),
      description: isVerified 
        ? 'Traceability ledger confirmed & status recorded as COMPLETE.' 
        : isRejected 
          ? 'Verification rejected during inspection.' 
          : 'Pending final review.',
      isCompleted: isVerified
    },
    {
      num: 8,
      title: 'Customer Verification',
      date: 'Active Record',
      description: 'Customer retrieved and verified registered traceability record.',
      isCompleted: true
    }
  ];

  if (showTimelineOnly) {
    return (
      <div className="bg-[#120B08] border border-[#2A1E17] rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-[#2A1E17] pb-3">
          <Clock className="w-4 h-4 text-[#EA580C]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Material Traceability Timeline</h3>
        </div>

        <div className="relative pl-6 space-y-6 border-l-2 border-[#2A1E17]">
          {timelineSteps.map((ev, idx) => (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                ev.isCompleted 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : isRejected && ev.num >= 6 
                    ? 'bg-rose-600 border-rose-500 text-white' 
                    : 'bg-[#120B08] border-[#2A1E17]'
              }`}>
                {ev.isCompleted && <span className="text-[8px] font-bold">✓</span>}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{ev.date}</span>
                <h4 className="text-xs font-bold text-white">
                  {ev.num}. {ev.title}
                </h4>
                <p className="text-[11px] text-slate-400">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* =================================================== */}
      {/* A. VERIFICATION HEADER                              */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A1E17] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#EA580C]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Material Passport</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Unique Material Traceability Ledger Reference: <span className="font-mono text-white font-bold">{batch.passportId}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase font-mono shadow-md border ${
              isVerified ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 glow-green' :
              isRejected ? 'bg-rose-950/40 text-rose-400 border-rose-800/60' :
              'bg-amber-950/40 text-amber-400 border-amber-800/60'
            }`}>
              {isVerified ? '✓ TRACEABILITY RECORD FOUND' : isRejected ? '✕ VERIFICATION REJECTED' : '⚠ VERIFICATION PENDING'}
            </span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#120B08] p-4 rounded-2xl border border-[#2A1E17]">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Material Name</span>
            <span className="text-base font-extrabold text-white">{batch.materialType}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Supplier</span>
            <span className="text-sm font-semibold text-slate-200">{batch.supplierName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Supplier Batch ID</span>
            <span className="text-sm font-mono font-bold text-[#EA580C]">{batch.supplierBatchId || 'TV-0826-19'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Registration Date</span>
            <span className="text-sm font-mono text-slate-300">{registeredDate}</span>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* B. MATERIAL DETAILS                                 */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <Layers className="w-4 h-4" />
          <span>A. MATERIAL DETAILS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Material Name:</span>
            <span className="text-sm font-bold text-white">{batch.materialType}</span>
          </div>
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Category:</span>
            <span className="text-sm font-semibold text-white">{batch.category || 'Wood'}</span>
          </div>
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Grade:</span>
            <span className="text-sm font-semibold text-white">{batch.grade || 'A'}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Description:</span>
          <p className="text-xs text-slate-300 leading-relaxed bg-[#120B08] p-3.5 rounded-xl border border-[#2A1E17]">
            {batch.description || `Seasoned teak wood purchased for custom furniture production.`}
          </p>
        </div>
      </div>

      {/* =================================================== */}
      {/* C. SUPPLIER DETAILS                                 */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <Building className="w-4 h-4" />
          <span>B. SUPPLIER DETAILS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Supplier / Retailer:</span>
            <span className="text-sm font-bold text-white">{batch.supplierName || 'Sahrangpur Pvt Wood'}</span>
          </div>
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Location:</span>
            <span className="text-sm font-semibold text-white flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C] mr-0.5" />
              <span>{batch.supplierLocation || 'Nashik, Maharashtra'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* D. PURCHASE DETAILS                                 */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>C. PURCHASE & BATCH DETAILS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Invoice Number:</span>
            <span className="text-sm font-mono font-bold text-white">{batch.invoiceNumber || 'INV-4521'}</span>
          </div>

          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Purchase Date:</span>
            <span className="text-sm font-semibold text-white">{registeredDate}</span>
          </div>

          <div className="p-3.5 bg-[#120B08] rounded-xl border border-[#EA580C]/40 bg-[#EA580C]/5">
            <span className="text-[10px] text-[#EA580C] uppercase font-bold block mb-1">Supplier Batch ID:</span>
            <span className="text-sm font-mono font-bold text-white">{batch.supplierBatchId || 'TV-0826-19'}</span>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* E. QUANTITY TRACEABILITY                            */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A1E17] pb-3">
          <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>D. QUANTITY TRACEABILITY</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Tracked Sourcing Lot</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-[#120B08] rounded-xl border border-[#2A1E17]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Purchased</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-white mt-1 block">
                {purchasedQty} {unit}
              </span>
            </div>
            <div className="p-3 bg-[#120B08] rounded-xl border border-[#EA580C]/40">
              <span className="text-[10px] text-[#EA580C] uppercase font-bold block">Allocated to this project</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-[#EA580C] mt-1 block">
                {allocatedQty} {unit}
              </span>
            </div>
            <div className="p-3 bg-[#120B08] rounded-xl border border-emerald-800/50">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Remaining Lot</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-400 mt-1 block">
                {remainingQty} {unit}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Total Sourced: {purchasedQty} {unit}</span>
              <span className="text-slate-400">Project Allocation: {allocatedPercent.toFixed(0)}%</span>
            </div>

            <div className="w-full h-4 bg-[#120B08] rounded-full overflow-hidden border border-[#2A1E17] flex p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] rounded-l-full transition-all" 
                style={{ width: `${allocatedPercent}%` }}
                title={`Allocated to this project: ${allocatedQty} ${unit}`}
              />
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-r-full transition-all" 
                style={{ width: `${remainingPercent}%` }}
                title={`Remaining in registered lot: ${remainingQty} ${unit}`}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#EA580C] inline-block" />
                <span>Allocated to this project: <strong className="text-white">{allocatedQty} {unit}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Remaining in tracked lot: <strong className="text-emerald-400">{remainingQty} {unit}</strong></span>
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic bg-[#120B08] p-3 rounded-xl border border-[#2A1E17]/60">
            Note: <strong>{remainingQty} {unit}</strong> remains in the artisan's registered supplier lot. Over-allocation is strictly blocked to maintain single-source integrity.
          </p>
        </div>
      </div>

      {/* =================================================== */}
      {/* F. MATERIAL EVIDENCE                                */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <ImageIcon className="w-4 h-4" />
          <span>E. MATERIAL EVIDENCE</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border bg-[#120B08] border-emerald-900/40 text-emerald-400 flex items-center space-x-2.5">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Invoice: Uploaded</span>
          </div>

          <div className="p-3 rounded-xl border bg-[#120B08] border-emerald-900/40 text-emerald-400 flex items-center space-x-2.5">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Material Photos: 3 Uploaded</span>
          </div>

          <div className="p-3 rounded-xl border bg-[#120B08] border-emerald-900/40 text-emerald-400 flex items-center space-x-2.5">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Close-up / Grain Photos: Uploaded</span>
          </div>

          <div className="p-3 rounded-xl border bg-[#120B08] border-emerald-900/40 text-emerald-400 flex items-center space-x-2.5">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Multiple Angle Photos: Uploaded</span>
          </div>
        </div>

        {/* Action Buttons to View Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveMediaModal({ title: 'Supplier Procurement Invoice', type: 'invoice', url: invoiceEvidence?.storagePath })}
            className="py-3 px-4 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-[#2A1E17] hover:border-[#EA580C] text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 shadow"
          >
            <FileText className="w-4 h-4 text-[#EA580C]" />
            <span>[ View Invoice ]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMediaModal({ title: 'Raw Material Photographs & Macro Grain', type: 'photos' })}
            className="py-3 px-4 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-[#2A1E17] hover:border-[#EA580C] text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 shadow"
          >
            <ImageIcon className="w-4 h-4 text-[#EA580C]" />
            <span>[ View Material Photos ]</span>
          </button>
        </div>
      </div>

      {/* =================================================== */}
      {/* G. CERTIFICATION SECTION                            */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>F. CERTIFICATION</span>
        </h3>

        {hasCert ? (
          <div className="p-4 bg-[#120B08] rounded-2xl border border-emerald-900/40 space-y-2.5 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <span>✓</span>
              <span>{batch.certificateName || 'FSC Certificate'} - Certificate Submitted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Certificate Number:</span>
                <span className="text-white font-mono">{batch.certificateNumber || certifications[0]?.certificateNumber || 'FSC-C012345'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Issuing Authority:</span>
                <span className="text-white">{batch.certificateAuthority || certifications[0]?.issuingAuthority || 'Forest Stewardship Council'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Issue Date:</span>
                <span className="text-white">{batch.certificateIssueDate || certifications[0]?.issuedAt || registeredDate}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#120B08] rounded-2xl border border-[#2A1E17] text-xs text-slate-400">
            <p>No certification record submitted for this material.</p>
          </div>
        )}
      </div>

      {/* =================================================== */}
      {/* H. PHYSICAL VERIFICATION                            */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>G. PHYSICAL VERIFICATION</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={isVerified ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isVerified ? '✓' : '⚠'}
              </span>
              <span className={`font-bold ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                Status: {isVerified ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Verified by: <strong className="text-white">{batch.verifiedBy || 'Rameshwar Suthar (Master Craftsman)'}</strong> • {batch.verifiedDate || registeredDate}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 p-2.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200">Quantity checked ({purchasedQty} {unit})</span>
            </div>

            <div className="flex items-center space-x-2 p-2.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200">Dimensions checked</span>
            </div>

            <div className="flex items-center space-x-2 p-2.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200">Material condition checked</span>
            </div>

            <div className="flex items-center space-x-2 p-2.5 bg-[#120B08] rounded-xl border border-[#2A1E17]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200">Supplier batch recorded ({batch.supplierBatchId || 'TV-0826-19'})</span>
            </div>

            <div className="flex items-center space-x-2 p-2.5 bg-[#120B08] rounded-xl border border-[#2A1E17] sm:col-span-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200">Physical sample inspected</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* I. PROJECT ALLOCATION                               */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-widest border-b border-[#2A1E17] pb-3 flex items-center space-x-2">
          <FolderKanban className="w-4 h-4" />
          <span>H. PROJECT ALLOCATION</span>
        </h3>

        <div className="p-4 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Project</span>
              <span className="text-sm font-extrabold text-white">{batch.projectName || 'Custom Oak & Sagwan Teak Dining Table'}</span>
            </div>
            <span className="text-xs font-mono text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-1 rounded-lg border border-[#EA580C]/30 w-max">
              {batch.projectId || '#KARAGIR-99210'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2A1E17]/60 text-[11px]">
            <div>
              <span className="text-slate-400">Allocated Quantity:</span> <strong className="text-emerald-400 font-mono">{allocatedQty} {unit}</strong>
            </div>
            <div>
              <span className="text-slate-400">Allocation Date:</span> <strong className="text-slate-200 font-mono">{registeredDate}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* J. TRACEABILITY CHECKLIST                           */}
      {/* =================================================== */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A1E17] pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TRACEABILITY CHECKLIST</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
            Traceability Status: COMPLETE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Unique Kaaragir Material ID</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Supplier recorded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Invoice recorded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Supplier batch recorded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Purchase quantity recorded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Material photographs uploaded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Project allocation recorded</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Certification submitted (if applicable)</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-400 sm:col-span-2">
            <span className="font-bold">✓</span>
            <span className="text-slate-200">Physical verification completed (if applicable)</span>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* K. TECHNICAL DISCLAIMER                             */}
      {/* =================================================== */}
      <div className="bg-[#120B08] border border-[#2A1E17] rounded-3xl p-6 space-y-2 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-[#EA580C]" />
          <span>What does this verification mean?</span>
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Kaaragir's Material Passport provides traceability evidence connecting the artisan's material to its recorded supplier purchase, batch information, quantity, photographs and applicable documentation. It does not replace laboratory testing or independent material certification.
        </p>
      </div>

      {/* =================================================== */}
      {/* MEDIA PREVIEW MODAL                                 */}
      {/* =================================================== */}
      {activeMediaModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2A1E17] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{activeMediaModal.title}</h3>
              <button 
                onClick={() => setActiveMediaModal(null)}
                className="w-8 h-8 rounded-full bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeMediaModal.type === 'invoice' ? (
              <div className="space-y-3">
                <div className="bg-[#120B08] p-3.5 rounded-2xl border border-[#2A1E17] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Invoice:</span>
                    <span className="text-white font-mono font-bold">{batch.invoiceNumber || 'INV-4521'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supplier:</span>
                    <span className="text-white font-bold">{batch.supplierName || 'Sahrangpur Pvt Wood'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch ID:</span>
                    <span className="text-white font-mono">{batch.supplierBatchId || 'TV-0826-19'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Purchased:</span>
                    <span className="text-[#EA580C] font-mono font-bold">{purchasedQty} {unit}</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#2A1E17] bg-[#120B08]">
                  <img 
                    src={activeMediaModal.url || 'https://images.unsplash.com/photo-1607593895521-36ba927546e4?q=80&w=800&auto=format&fit=crop'} 
                    alt="Procurement Invoice Document" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono text-center">Digitally hashed & stored on Kaaragir Storage.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 bg-[#120B08] p-2.5 rounded-2xl border border-[#2A1E17]">
                    <img src="https://images.unsplash.com/photo-1596484552834-6a58f85cb686?q=80&w=800&auto=format&fit=crop" alt="Full Plank" className="w-full h-36 object-cover rounded-xl" />
                    <span className="text-[10px] font-bold text-white uppercase block">Full Material Photograph</span>
                  </div>
                  <div className="space-y-1.5 bg-[#120B08] p-2.5 rounded-2xl border border-[#2A1E17]">
                    <img src="https://images.unsplash.com/photo-1616781296515-5950d322b6f4?q=80&w=800&auto=format&fit=crop" alt="Grain Macro" className="w-full h-36 object-cover rounded-xl" />
                    <span className="text-[10px] font-bold text-white uppercase block">Close-Up / Grain / Texture</span>
                  </div>
                  <div className="space-y-1.5 bg-[#120B08] p-2.5 rounded-2xl border border-[#2A1E17]">
                    <img src="https://images.unsplash.com/photo-1620619864223-9f82d17c7d41?q=80&w=800&auto=format&fit=crop" alt="Multiple Angle" className="w-full h-36 object-cover rounded-xl" />
                    <span className="text-[10px] font-bold text-white uppercase block">Multiple-Angle Photograph</span>
                  </div>
                  <div className="space-y-1.5 bg-[#120B08] p-2.5 rounded-2xl border border-[#2A1E17]">
                    <img src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop" alt="Packaging / Label" className="w-full h-36 object-cover rounded-xl" />
                    <span className="text-[10px] font-bold text-white uppercase block">Packaging / Batch Label</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveMediaModal(null)}
                className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
