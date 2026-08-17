import React, { useEffect, useState } from 'react';
import type { MaterialPassport } from '../types/materialPassport';
import { useMaterialPassport } from '../context/MaterialPassportContext';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  X, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Search,
  XCircle
} from 'lucide-react';
import { checkDuplicateEvidence } from '../services/materialPassportService';

interface AdminVerificationQueueProps {
  onBack: () => void;
}

export const AdminVerificationQueue: React.FC<AdminVerificationQueueProps> = ({ onBack }) => {
  const { adminQueue, loadAdminQueue, updateCertStatus, updateMaterialVerification } = useMaterialPassport();
  const [loading, setLoading] = useState(true);
  const [selectedPassport, setSelectedPassport] = useState<MaterialPassport | null>(null);
  const [notes, setNotes] = useState('');
  
  // Physical Inspection Checklist State for Admin
  const [physicalChecks, setPhysicalChecks] = useState({
    quantityChecked: true,
    dimensionsChecked: true,
    conditionChecked: true,
    supplierBatchRecorded: true
  });

  // Hash warnings mapping: { evidenceId: warningText }
  const [duplicateWarnings, setDuplicateWarnings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      await loadAdminQueue();
      setLoading(false);
    };
    fetchQueue();
  }, []);

  // Set initial selected passport if none selected
  useEffect(() => {
    if (adminQueue.length > 0 && !selectedPassport) {
      setSelectedPassport(adminQueue[0]);
    }
  }, [adminQueue, selectedPassport]);

  // Compute duplicate checks for selected passport evidence files
  useEffect(() => {
    const runDuplicateChecks = async () => {
      if (!selectedPassport) return;
      
      const warnings: Record<string, string> = {};
      for (const ev of selectedPassport.evidence) {
        const result = await checkDuplicateEvidence(ev.fileHash, ev.orderId);
        if (result && result.isDuplicate) {
          warnings[ev.id] = `Duplicate detected: File was already submitted for Order #${result.orderId?.split('-').pop()}`;
        }
      }
      setDuplicateWarnings(warnings);

      // Sync physical checks from batch
      setPhysicalChecks({
        quantityChecked: selectedPassport.batch.physicalQuantityChecked ?? true,
        dimensionsChecked: selectedPassport.batch.physicalDimensionsChecked ?? true,
        conditionChecked: selectedPassport.batch.physicalConditionChecked ?? true,
        supplierBatchRecorded: selectedPassport.batch.supplierBatchRecorded ?? true
      });
    };

    runDuplicateChecks();
  }, [selectedPassport]);

  const handleSelectPassport = (passport: MaterialPassport) => {
    setSelectedPassport(passport);
    setNotes('');
    setDuplicateWarnings({});
  };

  const handleVerifyCert = async (certId: string, approve: boolean) => {
    await updateCertStatus(
      certId, 
      approve ? 'VERIFIED' : 'REJECTED', 
      notes || (approve ? 'Certificate details checked and verified against official registry.' : 'Invalid certificate number or expired.')
    );
    if (selectedPassport) {
      setSelectedPassport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          certifications: prev.certifications.map(c => 
            c.id === certId 
              ? { ...c, verificationStatus: approve ? 'VERIFIED' : 'REJECTED', verificationNotes: notes } 
              : c
          )
        };
      });
    }
    setNotes('');
  };

  const handleApproveMaterial = async () => {
    if (!selectedPassport) return;
    
    await updateMaterialVerification(
      selectedPassport.batch.id,
      'VERIFIED',
      'completed',
      physicalChecks
    );

    alert(`Material ${selectedPassport.batch.passportId} approved! Status is now VERIFIED.`);
    await loadAdminQueue();
  };

  const handleRejectMaterial = async () => {
    if (!selectedPassport) return;

    await updateMaterialVerification(
      selectedPassport.batch.id,
      'REJECTED',
      'rejected',
      physicalChecks
    );

    alert(`Material ${selectedPassport.batch.passportId} marked as REJECTED.`);
    await loadAdminQueue();
  };

  const hasIncompleteInvoice = selectedPassport && !selectedPassport.evidence.some(e => e.type === 'invoice');
  const hasIncompleteGrain = selectedPassport && !selectedPassport.evidence.some(e => e.type === 'grain_closeup');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2A1E17] pb-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-300 hover:text-white border border-[#2A1E17] text-xs font-bold transition-all shadow group mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Marketplace</span>
          </button>
          <h1 className="text-2xl font-extrabold text-white">Admin Material Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Review raw material batches, supplier invoices, batch lineages, and manage verification status.</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-800/40">
            Admin Auth Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Queue List */}
        <div className="lg:col-span-4 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-[#2A1E17] pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Registered Batches ({adminQueue.length})</h2>
            <span className="text-[10px] font-mono text-slate-500">Live Registry</span>
          </div>
          
          {loading ? (
            <p className="text-xs text-slate-500 font-mono py-8 text-center">Loading verification queue...</p>
          ) : adminQueue.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-8 text-center">No batches in queue.</p>
          ) : (
            <div className="space-y-3">
              {adminQueue.map(pass => {
                const isSelected = selectedPassport?.batch.id === pass.batch.id;
                const isPassVerified = pass.batch.verificationStatus === 'VERIFIED' || pass.batch.status === 'client_approved';
                const isPassRejected = pass.batch.verificationStatus === 'REJECTED' || pass.batch.status === 'rejected';

                return (
                  <button
                    key={pass.batch.id}
                    onClick={() => handleSelectPassport(pass)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-[#261B15] border-[#EA580C] shadow-lg glow-orange' 
                        : 'bg-[#120B08] border-[#2A1E17] hover:border-[#EA580C]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-white font-bold bg-[#1F1510] px-2 py-0.5 rounded border border-[#2A1E17]">
                        {pass.batch.passportId}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isPassVerified ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-800/30' :
                        isPassRejected ? 'text-rose-400 bg-rose-950/20 border border-rose-800/30' :
                        'text-amber-400 bg-amber-950/20 border border-amber-800/30'
                      }`}>
                        {isPassVerified ? 'VERIFIED' : isPassRejected ? 'REJECTED' : 'PENDING'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-2">{pass.batch.materialType}</h3>
                    <p className="text-[10px] text-slate-400">Supplier Batch: <span className="font-mono text-slate-300">{pass.batch.supplierBatchId}</span></p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 pt-2 border-t border-[#2A1E17]/60">
                      <span>Purchased: {pass.batch.purchasedQuantity} {pass.batch.quantityUnit}</span>
                      <span>Allocated: {pass.batch.allocatedQuantity} {pass.batch.quantityUnit}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Batch Review Panel */}
        <div className="lg:col-span-8">
          {selectedPassport ? (
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              {/* Batch Info Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#2A1E17] pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider font-bold">
                      Material Verification Audit
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      selectedPassport.batch.verificationStatus === 'VERIFIED' || selectedPassport.batch.status === 'client_approved' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800' :
                      selectedPassport.batch.verificationStatus === 'REJECTED' ? 'text-rose-400 bg-rose-950/40 border-rose-800' :
                      'text-amber-400 bg-amber-950/40 border-amber-800'
                    }`}>
                      STATUS: {selectedPassport.batch.verificationStatus || 'PENDING'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white">{selectedPassport.batch.materialType}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Artisan: <strong className="text-white">{selectedPassport.batch.artisanName || 'Rameshwar Suthar'}</strong> • Project: <span className="text-slate-300">{selectedPassport.batch.projectName || selectedPassport.batch.orderId}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supplier: <strong className="text-white">{selectedPassport.batch.supplierName}</strong> ({selectedPassport.batch.supplierLocation || 'Nashik, Maharashtra'})
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#120B08] border border-[#2A1E17] font-mono">Invoice: <strong className="text-white">{selectedPassport.batch.invoiceNumber}</strong></span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#120B08] border border-[#EA580C]/40 font-mono text-[#EA580C]">Supplier Batch ID: <strong>{selectedPassport.batch.supplierBatchId}</strong></span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#120B08] border border-emerald-800/40 font-mono text-emerald-400">Lot: {selectedPassport.batch.purchasedQuantity}kg / Alloc: {selectedPassport.batch.allocatedQuantity}kg</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-mono font-extrabold text-white bg-[#120B08] px-3.5 py-1.5 rounded-xl border border-[#2A1E17] tracking-wider">
                    {selectedPassport.batch.passportId}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 font-mono">Registered: {selectedPassport.batch.purchaseDate}</span>
                </div>
              </div>

              {/* RISK / FRAUD CHECKS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Provenance & Authenticity Audit</h3>
                <div className="p-4 bg-[#120B08] border border-[#2A1E17] rounded-2xl space-y-2.5">
                  {hasIncompleteInvoice && (
                    <div className="flex items-start space-x-2 text-rose-400 text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Notice:</strong> Sourcing invoice is missing in this submission.</span>
                    </div>
                  )}

                  {hasIncompleteGrain && (
                    <div className="flex items-start space-x-2 text-amber-400 text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Notice:</strong> Close-up wood grain photograph is pending.</span>
                    </div>
                  )}

                  {Object.values(duplicateWarnings).map((warning, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-rose-400 text-xs bg-rose-950/15 p-2 rounded-lg border border-rose-900/30">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Hazard Warning:</strong> {warning}</span>
                    </div>
                  ))}

                  {(!hasIncompleteInvoice && !hasIncompleteGrain && Object.keys(duplicateWarnings).length === 0) && (
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span>All provenance lineage and hash collision checks passed.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PHYSICAL VERIFICATION INSPECTION CONTROLS */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Physical Inspection Checklist</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="p-3 bg-[#120B08] rounded-xl border border-[#2A1E17] flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={physicalChecks.quantityChecked}
                      onChange={(e) => setPhysicalChecks(p => ({ ...p, quantityChecked: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#EA580C] bg-[#1F1510] border-[#2A1E17]"
                    />
                    <span className="text-slate-200">Quantity checked ({selectedPassport.batch.purchasedQuantity} {selectedPassport.batch.quantityUnit})</span>
                  </label>

                  <label className="p-3 bg-[#120B08] rounded-xl border border-[#2A1E17] flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={physicalChecks.dimensionsChecked}
                      onChange={(e) => setPhysicalChecks(p => ({ ...p, dimensionsChecked: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#EA580C] bg-[#1F1510] border-[#2A1E17]"
                    />
                    <span className="text-slate-200">Dimensions checked</span>
                  </label>

                  <label className="p-3 bg-[#120B08] rounded-xl border border-[#2A1E17] flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={physicalChecks.conditionChecked}
                      onChange={(e) => setPhysicalChecks(p => ({ ...p, conditionChecked: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#EA580C] bg-[#1F1510] border-[#2A1E17]"
                    />
                    <span className="text-slate-200">Material condition checked</span>
                  </label>

                  <label className="p-3 bg-[#120B08] rounded-xl border border-[#2A1E17] flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={physicalChecks.supplierBatchRecorded}
                      onChange={(e) => setPhysicalChecks(p => ({ ...p, supplierBatchRecorded: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#EA580C] bg-[#1F1510] border-[#2A1E17]"
                    />
                    <span className="text-slate-200">Supplier batch recorded ({selectedPassport.batch.supplierBatchId})</span>
                  </label>
                </div>
              </div>

              {/* CERTIFICATE VERIFICATION */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Certification Document Review</h3>
                {selectedPassport.certifications.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono py-2 bg-[#120B08] p-3 rounded-xl border border-[#2A1E17]">
                    No certificates submitted for this batch.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedPassport.certifications.map(cert => {
                      const isPending = cert.verificationStatus === 'PENDING_REVIEW' || cert.verificationStatus === 'UPLOADED';
                      return (
                        <div key={cert.id} className="p-4 bg-[#120B08] border border-[#2A1E17] rounded-2xl space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-[#EA580C]" />
                                <span className="text-xs font-bold text-white">{cert.type}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">Authority: {cert.issuingAuthority} • Issued by: {cert.issuerName}</p>
                              <p className="text-[9px] text-[#EAB308] font-mono mt-0.5">Cert No: {cert.certificateNumber} • Issued: {cert.issuedAt}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                                cert.verificationStatus === 'VERIFIED' ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-800/30' : 'text-amber-400 bg-amber-950/20 border border-amber-800/30'
                              }`}>
                                {cert.verificationStatus}
                              </span>
                              <a 
                                href={cert.documentUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-[#EA580C] hover:text-white"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {isPending && (
                            <div className="pt-2 border-t border-[#2A1E17]/60 flex items-center gap-3">
                              <input 
                                type="text"
                                placeholder="Add audit notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                              />
                              <button 
                                onClick={() => handleVerifyCert(cert.id, false)}
                                className="px-3 py-1.5 rounded-lg bg-rose-900/20 text-rose-400 border border-rose-800/40 text-xs font-bold flex items-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                              <button 
                                onClick={() => handleVerifyCert(cert.id, true)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-900/20 text-emerald-400 border border-emerald-800/40 text-xs font-bold flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* EVIDENCE PHOTO GALLERY */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Material Evidence Submissions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedPassport.evidence.map(ev => {
                    const hasDupWarning = duplicateWarnings[ev.id];
                    return (
                      <div key={ev.id} className={`rounded-xl border overflow-hidden bg-[#120B08] ${hasDupWarning ? 'border-rose-800' : 'border-[#2A1E17]'}`}>
                        <img src={ev.storagePath} alt={ev.type} className="w-full h-24 object-cover" />
                        <div className="p-2 bg-[#120B08] text-[9px] border-t border-[#2A1E17]/60">
                          <span className="font-bold text-white block uppercase tracking-wider truncate">{ev.type.replace('_', ' ')}</span>
                          <span className="text-slate-500 block truncate font-mono mt-0.5">Hash: {ev.fileHash.substring(0, 8)}...</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ADMIN ACTIONS: APPROVE MATERIAL & REJECT */}
              <div className="pt-6 border-t border-[#2A1E17] flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleRejectMaterial}
                  className="flex-1 py-3.5 rounded-xl border border-rose-900 hover:bg-rose-950/30 text-rose-400 text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>[ Reject / Request Resubmission ]</span>
                </button>

                <button
                  type="button"
                  onClick={handleApproveMaterial}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2 glow-green"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>[ Approve Material ]</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-12 text-center text-slate-400 space-y-4 shadow-2xl h-full flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-[#EA580C] opacity-40 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Select a Batch for Review</h3>
              <p className="text-xs max-w-sm">Pick any Material Batch from the queue to verify supplier invoices, batch tracking, physical checklist, and approve verification.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
