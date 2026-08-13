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
  MessageSquare,
  Search
} from 'lucide-react';
import { checkDuplicateEvidence } from '../services/materialPassportService';

interface AdminVerificationQueueProps {
  onBack: () => void;
}

export const AdminVerificationQueue: React.FC<AdminVerificationQueueProps> = ({ onBack }) => {
  const { adminQueue, loadAdminQueue, updateCertStatus, updateBatchStatus } = useMaterialPassport();
  const [loading, setLoading] = useState(true);
  const [selectedPassport, setSelectedPassport] = useState<MaterialPassport | null>(null);
  const [notes, setNotes] = useState('');
  
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
      notes || (approve ? 'Certificate details checked and matches registration authority.' : 'Invalid certificate number or expired.')
    );
    // Refresh local selection
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

  const handleApproveDocs = async () => {
    if (!selectedPassport) return;
    // Approving the documents moves it to the client verification stages
    const nextStatus = selectedPassport.batch.sampleStatus === 'none' ? 'ready_for_review' : 'sample_pending';
    await updateBatchStatus(nextStatus);
    alert('Documentation marked as audited. Ready for client manual matching.');
    setSelectedPassport(null);
    loadAdminQueue();
  };

  const handleRejectDocs = async () => {
    if (!selectedPassport) return;
    await updateBatchStatus('rejected');
    alert('Documentation rejected. Sourcing flagged to craftsman.');
    setSelectedPassport(null);
    loadAdminQueue();
  };

  // Safe checks helper
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
          <h1 className="text-2xl font-extrabold text-white">Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Review raw material batches, certifications, and check for file reuse warnings.</p>
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
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#2A1E17] pb-2">Active Batches ({adminQueue.length})</h2>
          
          {loading ? (
            <p className="text-xs text-slate-500 font-mono py-8 text-center">Loading verification queue...</p>
          ) : adminQueue.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-8 text-center">No batches pending review.</p>
          ) : (
            <div className="space-y-3">
              {adminQueue.map(pass => {
                const isSelected = selectedPassport?.batch.id === pass.batch.id;
                return (
                  <button
                    key={pass.batch.id}
                    onClick={() => handleSelectPassport(pass)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-[#261B15] border-[#EA580C]' 
                        : 'bg-[#120B08] border-[#2A1E17] hover:border-[#EA580C]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-slate-500 font-bold bg-[#1F1510] px-2 py-0.5 rounded border border-[#2A1E17]">
                        {pass.batch.passportId}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        pass.batch.status === 'client_approved' ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-800/30' : 'text-amber-400 bg-amber-950/20 border border-amber-800/30'
                      }`}>
                        {pass.batch.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-2">{pass.batch.materialType}</h3>
                    <p className="text-[10px] text-slate-400">Order ID: #{pass.batch.orderId.split('-').pop()}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 pt-2 border-t border-[#2A1E17]/60">
                      <span>Certs: {pass.certifications.length}</span>
                      <span>Files: {pass.evidence.length}</span>
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
              <div className="flex justify-between items-start border-b border-[#2A1E17] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider block font-bold">Auditing Batch</span>
                  <h2 className="text-lg font-bold text-white">{selectedPassport.batch.materialType} ({selectedPassport.batch.species})</h2>
                  <p className="text-xs text-slate-400">Supplier: <strong className="text-white">{selectedPassport.batch.supplierName}</strong> • Date: {selectedPassport.batch.purchaseDate}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-white bg-[#120B08] px-3 py-1 rounded border border-[#2A1E17]">
                    {selectedPassport.batch.passportId}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Sample req: {selectedPassport.batch.sampleStatus !== 'none' ? 'YES' : 'NO'}</span>
                </div>
              </div>

              {/* RISK FLAGS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Hazard Analysis</h3>
                <div className="p-4 bg-[#120B08] border border-[#2A1E17] rounded-2xl space-y-2.5">
                  
                  {hasIncompleteInvoice && (
                    <div className="flex items-start space-x-2 text-rose-400 text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Warning:</strong> Sourcing invoice / supplier receipt is missing in this passport submission.</span>
                    </div>
                  )}

                  {hasIncompleteGrain && (
                    <div className="flex items-start space-x-2 text-amber-400 text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Notice:</strong> Close-up wood grain photo is missing. Required for client manual grain verification.</span>
                    </div>
                  )}

                  {/* Duplicate hash flags */}
                  {Object.values(duplicateWarnings).map((warning, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-rose-400 text-xs bg-rose-950/15 p-2 rounded-lg border border-rose-900/30">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Fraud Alert:</strong> {warning}</span>
                    </div>
                  ))}

                  {(!hasIncompleteInvoice && !hasIncompleteGrain && Object.keys(duplicateWarnings).length === 0) && (
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span>All deterministic hazard rules passed. No file reuse detected.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CERTIFICATE VERIFICATION SECTION */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Certification Document Review</h3>
                {selectedPassport.certifications.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono py-2">No certificates submitted for this batch.</p>
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
                                placeholder="Add audit notes / observations..."
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

                          {cert.verificationNotes && (
                            <div className="p-2 bg-[#1F1510] border border-[#2A1E17] rounded-lg text-[10px] text-slate-400 flex items-start space-x-2">
                              <MessageSquare className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                              <span><strong>Audit Notes:</strong> {cert.verificationNotes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RAW MATERIAL IMAGES */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Raw Material Planks & Grain Closeup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedPassport.evidence.filter(e => e.type === 'grain_closeup' || e.type === 'raw_full' || e.type === 'angle_additional').map(ev => {
                    const hasDupWarning = duplicateWarnings[ev.id];
                    return (
                      <div key={ev.id} className={`relative rounded-xl border overflow-hidden group bg-[#120B08] ${
                        hasDupWarning ? 'border-rose-800' : 'border-[#2A1E17]'
                      }`}>
                        <img src={ev.storagePath} alt={ev.type} className="w-full h-24 object-cover" />
                        <div className="p-2 bg-[#120B08] text-[9px] border-t border-[#2A1E17]/60">
                          <span className="font-bold text-white block uppercase tracking-wider truncate">{ev.type.replace('_', ' ')}</span>
                          <span className="text-slate-500 block truncate font-mono mt-0.5">Hash: {ev.fileHash.substring(0, 10)}...</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GLOBAL DOCUMENTATION APPROVAL CONTROLS */}
              <div className="pt-4 border-t border-[#2A1E17] flex space-x-4">
                <button
                  onClick={handleRejectDocs}
                  className="flex-1 py-3 rounded-xl border border-rose-900 hover:bg-rose-950/20 text-rose-400 text-xs font-bold transition-all shadow-md"
                >
                  Reject & Request Resubmission
                </button>
                <button
                  onClick={handleApproveDocs}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audits Passed - Approve Sourcing</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-12 text-center text-slate-400 space-y-4 shadow-2xl h-full flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-[#EA580C] opacity-40 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Select a Batch for Review</h3>
              <p className="text-xs max-w-sm">Pick any Material Batch from the queue to verify supplier invoices, FSC wood certs, macro grains, and trace hashing warnings.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
