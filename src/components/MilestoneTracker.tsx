import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Hammer, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Camera, 
  ArrowLeft, 
  Upload, 
  AlertTriangle, 
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useEscrow } from '../context/EscrowContext';
import { useMaterialPassport } from '../context/MaterialPassportContext';

interface MilestoneTrackerProps {
  onBack?: () => void;
  isArtisanView?: boolean;
  onNavigateToVerify?: (materialId: string) => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ 
  onBack, 
  isArtisanView = false,
  onNavigateToVerify 
}) => {
  const { order, submitMilestoneProof, approveMilestone } = useEscrow();
  const { 
    passport, 
    createNewBatch, 
    uploadEvidence, 
    addCert, 
    updateSampleStatus,
    updateBatchStatus,
    checkDuplicate,
    checkDuplicateSupplierBatch
  } = useMaterialPassport();

  const [uploadingMilestoneId, setUploadingMilestoneId] = useState<string | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Guided Craftsman Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [materialType, setMaterialType] = useState('Seasoned Oak & Sagwan Teak');
  const [category, setCategory] = useState('Wood');
  const [grade, setGrade] = useState('A');
  const [description] = useState('Seasoned oak and sagwan teak purchased for custom furniture production.');
  const [supplierName, setSupplierName] = useState('Sahrangpur Pvt Wood');
  const [supplierLocation, setSupplierLocation] = useState('Nashik, Maharashtra');
  const [supplierBatchId, setSupplierBatchId] = useState('TW-0826-19');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-4521');
  const [purchasedQuantity, setPurchasedQuantity] = useState(100);
  const [allocatedQuantity, setAllocatedQuantity] = useState(30);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Cert Form State
  const certType = 'FSC Certificate';
  const [certNumber, setCertNumber] = useState('FSC-C012345');
  const [certAuthority, setCertAuthority] = useState('Forest Stewardship Council');

  // Quantity Error & State
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showRegisteredSuccess, setShowRegisteredSuccess] = useState(false);
  const [registeredMaterialId, setRegisteredMaterialId] = useState('KAR-MAT-2026-97373');

  // Client Verification Checklist State
  const [checklist, setChecklist] = useState({
    grain: false,
    colour: false,
    texture: false,
    docsReviewed: false
  });

  const renderIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return <Camera className="w-4 h-4" />;
      case 2:
        return <Hammer className="w-4 h-4" />;
      case 3:
        return <Truck className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  const handleApproveStage1 = async (milestoneId: string) => {
    await updateSampleStatus('verified');
    approveMilestone(milestoneId);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EA580C', '#15803D', '#EAB308']
    });
  };

  const handleApproveStages2And3 = (milestoneId: string) => {
    approveMilestone(milestoneId);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EA580C', '#15803D', '#EAB308']
    });
  };

  const handleSubmitProof = (milestoneId: string) => {
    if (!photoUrlInput) return;
    submitMilestoneProof(milestoneId, [photoUrlInput]);
    setUploadingMilestoneId(null);
    setPhotoUrlInput('');
  };

  // Guided Craftsman Actions
  const handleCreateBatch = async () => {
    setQuantityError(null);
    if (!materialType || !grade || !supplierName || !supplierBatchId || !invoiceNumber) {
      alert('Please fill out all sourcing details.');
      return;
    }

    // Critical Over-Allocation Protection Rule
    if (allocatedQuantity > purchasedQuantity) {
      setQuantityError(`Insufficient remaining quantity. Maximum available: ${purchasedQuantity} kg`);
      return;
    }

    const dupResult = await checkDuplicateSupplierBatch(supplierBatchId);
    if (dupResult.isDuplicate && dupResult.orderId !== order.orderId) {
      alert(`Notice: Supplier Batch ID ${supplierBatchId} was previously used in order #${dupResult.orderId?.split('-').pop()}. It is logged as a batch reuse across projects.`);
    }

    try {
      const batch = await createNewBatch(
        order.orderId, 
        materialType, 
        'Oak & Teak', 
        grade, 
        supplierName, 
        supplierBatchId, 
        invoiceNumber, 
        purchasedQuantity, 
        allocatedQuantity, 
        purchaseDate,
        {
          category,
          description,
          supplierLocation,
          artisanName: order.artisanName,
          projectName: order.productTitle
        }
      );

      if (batch) {
        setRegisteredMaterialId(batch.passportId);
        setShowRegisteredSuccess(true);
        setWizardStep(2);
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to initialize material batch.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'invoice' | 'raw_full' | 'grain_closeup' | 'angle_additional') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const dupResult = await checkDuplicate(file);
        if (dupResult.isDuplicate) {
          alert(`Notice: This evidence file appears to have already been submitted for another order (${dupResult.filename}).`);
        }

        await uploadEvidence(file, type);
      } catch (err) {
        console.error('File upload failed', err);
      }
    }
  };

  const handleAddCert = async () => {
    if (!certNumber || !certAuthority) {
      alert('Please fill out certification number and authority.');
      return;
    }
    await addCert(certType, certNumber, certAuthority, 'SCS Global Services', new Date().toISOString().split('T')[0]);
    alert('Certificate added successfully!');
  };

  const handleSubmitPassport = async (milestoneId: string) => {
    await updateBatchStatus('pending_client_review');
    const grainPhoto = passport?.evidence.find(e => e.type === 'grain_closeup')?.storagePath || '';
    const rawPhoto = passport?.evidence.find(e => e.type === 'raw_full')?.storagePath || '';
    
    submitMilestoneProof(milestoneId, [grainPhoto || rawPhoto || 'https://images.unsplash.com/photo-1596484552834-6a58f85cb686?auto=format&fit=crop&w=800&q=80']);
    alert('Material verification record submitted for client review.');
  };

  const handleCopyMaterialId = () => {
    const idToCopy = passport?.batch?.passportId || registeredMaterialId || 'KAR-MAT-2026-97373';
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleNavigateToVerify = () => {
    const targetId = passport?.batch?.passportId || 'KAR-MAT-2026-97373';
    if (onNavigateToVerify) {
      onNavigateToVerify(targetId);
    } else {
      window.location.hash = `#/verify/material/${targetId}`;
    }
  };

  const totalReleased = order.totalBudget - order.escrowVaultBalance;
  const activeMatId = passport?.batch?.passportId || 'KAR-MAT-2026-97373';
  const isMatVerified = passport?.batch?.verificationStatus === 'VERIFIED' || passport?.batch?.status === 'client_approved';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Back Button Navigation Header */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Home</span>
          </button>
        </div>
      )}
      
      {/* 1. Order Header */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="text-xs font-mono text-[#EA580C] bg-[#EA580C]/10 px-3 py-1 rounded-full border border-[#EA580C]/30 font-bold">
              Order ID: #{order.orderId}
            </span>
            <span className="text-xs font-semibold text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full border border-[#EAB308]/30 flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Locked in Escrow Vault
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{order.productTitle}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Buyer: <span className="text-white font-semibold">{order.buyerName}</span> • Artisan: <span className="text-white font-semibold">{order.artisanName}</span>
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-400 mb-1">Total Project Value</p>
          <p className="text-3xl font-extrabold text-[#EAB308] font-mono tracking-tight">₹{order.totalBudget.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Grid Layout: Timeline Left + Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. Vertical Visual Progress Timeline */}
        <div className="lg:col-span-8 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Live Material Milestone Verification</h2>
            <p className="text-xs text-slate-400 mt-1">Funds are released progressively as workshop stages are verified.</p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-10 border-l-2 border-[#2A1E17]">
            {order.milestones.map((step) => {
              const isInProgress = step.status === 'IN_PROGRESS';
              const isProofSubmitted = step.status === 'PROOF_SUBMITTED';
              const isApproved = step.status === 'APPROVED_AND_PAID';

              return (
                <div key={step.id} className="relative group">
                  
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isApproved ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                        : isInProgress ? 'bg-[#EA580C] text-white shadow-lg glow-orange animate-pulse'
                        : isProofSubmitted ? 'bg-[#EAB308] text-[#120B08] shadow-lg glow-yellow'
                        : 'bg-[#120B08] text-slate-500 border border-[#2A1E17]'
                    }`}
                  >
                    {isApproved ? <Check className="w-5 h-5 stroke-[3]" /> : renderIcon(step.stageNumber)}
                  </div>

                  <div className={`border rounded-2xl p-5 space-y-4 shadow-md transition-colors ${
                    isApproved ? 'bg-[#120B08] border-emerald-900/40' 
                    : isInProgress ? 'bg-[#1a120e] border-[#EA580C]/40'
                    : isProofSubmitted ? 'bg-[#1a170e] border-[#EAB308]/40'
                    : 'bg-[#120B08] border-[#2A1E17] opacity-60'
                  }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#2A1E17]/60 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#EA580C] tracking-widest uppercase block mb-1">
                          Stage {step.stageNumber} • {step.percentageSplit}% Tranche
                        </span>
                        <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 uppercase tracking-widest">
                          Payout
                        </span>
                        <span className="text-sm font-extrabold text-white font-mono">
                          ₹{step.grossAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                    {/* ========================================================= */}
                    {/* STAGE 1: COMPACT MATERIAL VERIFICATION CARD (BUYER & ARTISAN) */}
                    {/* ========================================================= */}
                    {step.stageNumber === 1 && (
                      <div className="space-y-4 pt-3 border-t border-[#2A1E17]/60">
                        
                        {/* =================================================== */}
                        {/* BUYER VIEW: CLEAN COMPACT MATERIAL VERIFICATION     */}
                        {/* =================================================== */}
                        {!isArtisanView && (
                          <div className="bg-[#120B08] rounded-2xl p-5 sm:p-6 border border-[#2A1E17] space-y-4">
                            
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C]">
                                Material Verification
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                isMatVerified ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800' : 'text-amber-400 bg-amber-950/40 border-amber-800'
                              }`}>
                                {isMatVerified ? '✓ VERIFIED' : '⚠ PENDING REVIEW'}
                              </span>
                            </div>

                            {/* Styled Material ID Card */}
                            <div className="p-4 rounded-xl bg-[#1F1510] border border-[#2A1E17] space-y-1 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Material ID
                                </span>
                                <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-wider">
                                  {activeMatId}
                                </span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={handleNavigateToVerify}
                                className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center space-x-1.5"
                              >
                                <span>Verify Material</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Compact Status Checklist */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                              <div className="flex items-center space-x-2 text-emerald-400 bg-[#1F1510] p-2.5 rounded-xl border border-[#2A1E17]">
                                <span className="font-bold">✓</span>
                                <span className="text-slate-200">Material Registered</span>
                              </div>
                              <div className="flex items-center space-x-2 text-emerald-400 bg-[#1F1510] p-2.5 rounded-xl border border-[#2A1E17]">
                                <span className="font-bold">✓</span>
                                <span className="text-slate-200">Evidence Submitted</span>
                              </div>
                              <div className={`flex items-center space-x-2 bg-[#1F1510] p-2.5 rounded-xl border border-[#2A1E17] ${isMatVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                <span className="font-bold">{isMatVerified ? '✓' : '⚠'}</span>
                                <span className="text-slate-200">{isMatVerified ? 'Verification Completed' : 'Verification Pending'}</span>
                              </div>
                            </div>

                            {/* Escrow Release Checkbox Section for Buyer */}
                            {(isInProgress || isProofSubmitted) && (
                              <div className="mt-4 pt-4 border-t border-[#2A1E17] space-y-3">
                                <div className="space-y-2">
                                  <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={checklist.grain} 
                                      onChange={(e) => setChecklist(prev => ({ ...prev, grain: e.target.checked }))}
                                      className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                    />
                                    <span>Lumber grain patterns & timber species match project requirements.</span>
                                  </label>

                                  <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={checklist.docsReviewed} 
                                      onChange={(e) => setChecklist(prev => ({ ...prev, docsReviewed: e.target.checked }))}
                                      className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                    />
                                    <span>Supplier invoice and traceability record reviewed via Material Verification ID.</span>
                                  </label>
                                </div>

                                <button 
                                  onClick={() => handleApproveStage1(step.id)}
                                  disabled={!checklist.grain || !checklist.docsReviewed}
                                  className={`w-full py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                                    checklist.grain && checklist.docsReviewed
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 glow-green' 
                                      : 'bg-[#1F1510] text-slate-500 border border-[#2A1E17] cursor-not-allowed'
                                  }`}
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>Approve Sourced Materials & Release Tranche (₹{step.grossAmount.toLocaleString('en-IN')})</span>
                                </button>
                              </div>
                            )}

                          </div>
                        )}

                        {/* =================================================== */}
                        {/* ARTISAN VIEW: 10-STEP MATERIAL REGISTRATION FLOW    */}
                        {/* =================================================== */}
                        {isArtisanView && (
                          <div className="space-y-4 bg-[#120B08] p-5 sm:p-6 rounded-2xl border border-[#EA580C]/30">
                            
                            {/* Step Progress Header */}
                            <div className="flex items-center justify-between border-b border-[#2A1E17] pb-3 mb-2">
                              <span className="text-xs font-extrabold text-[#EA580C] uppercase tracking-wider">
                                Material Sourcing Flow: Step {wizardStep} of 5
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {wizardStep === 1 && '1. Sourcing Details'}
                                {wizardStep === 2 && '2. Sourcing Invoice'}
                                {wizardStep === 3 && '3. Material Photos'}
                                {wizardStep === 4 && '4. Certification'}
                                {wizardStep === 5 && '5. Register & Generate ID'}
                              </span>
                            </div>

                            {/* SUCCESS CARD AFTER REGISTRATION */}
                            {showRegisteredSuccess && (
                              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#1F1510] border border-emerald-700/60 space-y-3">
                                <div className="flex items-center space-x-2 text-emerald-400">
                                  <Check className="w-5 h-5 font-bold" />
                                  <h4 className="text-xs font-bold uppercase tracking-wider">MATERIAL REGISTERED SUCCESSFULLY</h4>
                                </div>

                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                    Material Verification ID:
                                  </span>
                                  <span className="text-xl font-extrabold font-mono text-white tracking-widest block mt-0.5">
                                    {registeredMaterialId}
                                  </span>
                                  <p className="text-[11px] text-slate-300 mt-1">
                                    Save this ID and provide it to your customer for manual verification lookup.
                                  </p>
                                </div>

                                <div className="flex items-center space-x-3 pt-1">
                                  <button
                                    type="button"
                                    onClick={handleCopyMaterialId}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{copiedId ? 'Copied to Clipboard!' : 'Copy Material ID'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleNavigateToVerify}
                                    className="px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] text-slate-300 text-xs font-bold rounded-xl border border-[#2A1E17] flex items-center space-x-1.5"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>View Customer Ledger</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 1: MATERIAL DETAILS & QUANTITIES */}
                            {wizardStep === 1 && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Material Name</label>
                                    <input 
                                      type="text" 
                                      value={materialType}
                                      onChange={(e) => setMaterialType(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
                                    <select 
                                      value={category}
                                      onChange={(e) => setCategory(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    >
                                      <option value="Wood">Wood</option>
                                      <option value="Brass">Brass</option>
                                      <option value="Pottery">Pottery</option>
                                      <option value="Leather">Leather</option>
                                      <option value="Cane">Cane</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Grade</label>
                                    <input 
                                      type="text" 
                                      value={grade}
                                      onChange={(e) => setGrade(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier Batch ID (from Supplier)</label>
                                    <input 
                                      type="text" 
                                      value={supplierBatchId}
                                      onChange={(e) => setSupplierBatchId(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier Name</label>
                                    <input 
                                      type="text" 
                                      value={supplierName}
                                      onChange={(e) => setSupplierName(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier Location</label>
                                    <input 
                                      type="text" 
                                      value={supplierLocation}
                                      onChange={(e) => setSupplierLocation(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Invoice Number</label>
                                    <input 
                                      type="text" 
                                      value={invoiceNumber}
                                      onChange={(e) => setInvoiceNumber(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Purchase Date</label>
                                    <input 
                                      type="date" 
                                      value={purchaseDate}
                                      onChange={(e) => setPurchaseDate(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                    />
                                  </div>
                                </div>

                                {/* QUANTITY & OVER-ALLOCATION PREVENTION */}
                                <div className="p-4 rounded-2xl bg-[#1F1510] border border-[#2A1E17] space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">
                                      Quantity Sourcing & Allocation Ledger
                                    </span>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                      Remaining: {Math.max(0, purchasedQuantity - allocatedQuantity)} kg
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Purchased Quantity (kg)</label>
                                      <input 
                                        type="number" 
                                        value={purchasedQuantity}
                                        onChange={(e) => setPurchasedQuantity(Number(e.target.value))}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Allocated to This Project (kg)</label>
                                      <input 
                                        type="number" 
                                        value={allocatedQuantity}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          setAllocatedQuantity(val);
                                          if (val > purchasedQuantity) {
                                            setQuantityError(`Insufficient remaining quantity. Maximum available: ${purchasedQuantity} kg`);
                                          } else {
                                            setQuantityError(null);
                                          }
                                        }}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                  {quantityError && (
                                    <div className="text-[11px] text-rose-400 bg-rose-950/30 p-2.5 rounded-xl border border-rose-900 flex items-center space-x-2">
                                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                      <span>{quantityError}</span>
                                    </div>
                                  )}
                                </div>

                                <button 
                                  onClick={handleCreateBatch}
                                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md mt-2"
                                >
                                  Register Material & Generate Material ID →
                                </button>
                              </div>
                            )}

                            {/* WIZARD STEP 2: DOCUMENTS */}
                            {wizardStep === 2 && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="block text-[10px] uppercase font-bold text-slate-400">Upload Supplier Procurement Invoice / Receipt</label>
                                  <div className="flex items-center space-x-3">
                                    <input 
                                      type="file" 
                                      accept="image/*,application/pdf"
                                      onChange={(e) => handleFileUpload(e, 'invoice')}
                                      className="hidden" 
                                      id="invoice-file-tracker"
                                    />
                                    <label 
                                      htmlFor="invoice-file-tracker"
                                      className="cursor-pointer px-4 py-2.5 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
                                    >
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                                      <span>Attach Invoice Document</span>
                                    </label>
                                    
                                    {passport?.evidence?.some(e => e.type === 'invoice') ? (
                                      <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                                        <Check className="w-3.5 h-3.5 mr-1" /> Invoice Attached
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-emerald-400 font-mono">Demo Mock Invoice Ready</span>
                                    )}
                                  </div>
                                </div>

                                <div className="pt-2 flex justify-between gap-4">
                                  <button onClick={() => setWizardStep(1)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(3)} className="px-6 py-2 bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold rounded-xl">Next: Upload Photos →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 3: PHOTOS */}
                            {wizardStep === 3 && (
                              <div className="space-y-4">
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">1. Full Raw Material Plank Photo</label>
                                    <input type="file" accept="image/*" id="raw-photo-file-tr" className="hidden" onChange={(e) => handleFileUpload(e, 'raw_full')} />
                                    <label htmlFor="raw-photo-file-tr" className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 w-max">
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" /> Choose Photo
                                    </label>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">2. Wood Grain Close-up Macro Photo</label>
                                    <input type="file" accept="image/*" id="grain-photo-file-tr" className="hidden" onChange={(e) => handleFileUpload(e, 'grain_closeup')} />
                                    <label htmlFor="grain-photo-file-tr" className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 w-max">
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" /> Choose Photo
                                    </label>
                                  </div>
                                </div>

                                <div className="pt-2 flex justify-between gap-4">
                                  <button onClick={() => setWizardStep(2)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(4)} className="px-6 py-2 bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold rounded-xl">Next: Certifications →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 4: CERTIFICATION */}
                            {wizardStep === 4 && (
                              <div className="space-y-3">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Add Optional Certification (e.g. FSC Timber)</span>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Cert Number</label>
                                    <input 
                                      type="text" 
                                      value={certNumber}
                                      onChange={(e) => setCertNumber(e.target.value)}
                                      className="w-full px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Authority</label>
                                    <input 
                                      type="text" 
                                      value={certAuthority}
                                      onChange={(e) => setCertAuthority(e.target.value)}
                                      className="w-full px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <button 
                                  onClick={handleAddCert}
                                  className="py-1.5 px-4 rounded-lg bg-[#1F1510] hover:bg-[#261B15] text-[#EA580C] text-xs font-bold border border-[#EA580C]/40 transition-colors"
                                >
                                  Save Certificate
                                </button>

                                <div className="pt-2 flex justify-between gap-4 border-t border-[#2A1E17] mt-3">
                                  <button onClick={() => setWizardStep(3)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(5)} className="px-6 py-2 bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold rounded-xl">Review & Submit →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 5: FINAL SUBMIT */}
                            {wizardStep === 5 && (
                              <div className="space-y-4 text-center">
                                <p className="text-xs text-slate-300">
                                  Material Verification ID: <strong className="text-white font-mono">{registeredMaterialId}</strong>
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Submitting will record the material traceability ledger and notify the customer.
                                </p>

                                <div className="flex space-x-3 pt-2">
                                  <button onClick={() => setWizardStep(4)} className="flex-1 py-2.5 border border-[#2A1E17] text-slate-400 text-xs font-bold rounded-xl hover:bg-[#261B15]">Back</button>
                                  <button 
                                    onClick={() => handleSubmitPassport(step.id)}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                                  >
                                    Submit for Customer Verification
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* STAGES 2 & 3: CONSTRUCTION EVIDENCE & PAYMENTS             */}
                    {/* ========================================================= */}
                    {step.stageNumber !== 1 && (
                      <div className="space-y-4 pt-3 border-t border-[#2A1E17]/60">
                        
                        {/* ARTISAN VIEW CONTROLS */}
                        {isArtisanView && isInProgress && (
                          <div>
                            {uploadingMilestoneId === step.id ? (
                              <div className="space-y-3 bg-[#120B08] p-4 rounded-xl border border-[#2A1E17]">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Attach Fabrication Evidence</span>
                                <input 
                                  type="url" 
                                  placeholder="Paste construction photo URL here..." 
                                  value={photoUrlInput}
                                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                                  className="w-full px-4 py-2.5 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                                />
                                <div className="flex space-x-3">
                                  <button onClick={() => setUploadingMilestoneId(null)} className="flex-1 py-2 rounded-xl border border-[#2A1E17] text-slate-400 text-xs font-bold hover:bg-[#261B15]">Cancel</button>
                                  <button onClick={() => handleSubmitProof(step.id)} className="flex-1 py-2 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold">Submit Evidence</button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setUploadingMilestoneId(step.id)}
                                className="w-full py-2.5 rounded-xl bg-[#261B15] hover:bg-[#3E2E24] text-white text-xs font-bold border border-[#3E2E24] transition-all flex items-center justify-center space-x-2"
                              >
                                <Upload className="w-4 h-4 text-[#EA580C]" />
                                <span>Upload Progress Photo Proof</span>
                              </button>
                            )}
                          </div>
                        )}

                        {isArtisanView && isProofSubmitted && (
                          <div className="pt-2">
                             <span className="text-xs font-bold text-[#EAB308] flex items-center">
                               <Clock className="w-4 h-4 mr-1.5" /> Pending Buyer Approval...
                             </span>
                          </div>
                        )}

                        {/* BUYER VIEW CONTROLS */}
                        {!isArtisanView && (isInProgress || isProofSubmitted) && (
                          <div className="pt-3 border-t border-[#2A1E17]/60">
                            {isProofSubmitted && (
                              <div className="bg-[#120B08] p-3 rounded-xl border border-[#EAB308]/30 mb-4">
                                <p className="text-[11px] font-bold text-[#EAB308] uppercase tracking-wider mb-2">Artisan Submitted Proof</p>
                                {step.proofImages.map((img, idx) => (
                                  <img key={idx} src={img} alt="Proof" className="w-full h-40 object-cover rounded-lg border border-[#2A1E17]" />
                                ))}
                                <p className="text-[10px] text-slate-400 font-mono mt-2 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" /> Submitted at {step.submittedAt}
                                </p>
                              </div>
                            )}
                            <button 
                              onClick={() => handleApproveStages2And3(step.id)}
                              disabled={!isProofSubmitted}
                              className={`w-full py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                                isProofSubmitted 
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 glow-green' 
                                  : 'bg-[#1F1510] text-slate-500 border border-[#2A1E17] cursor-not-allowed'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Pay & Release Milestone (₹{step.grossAmount.toLocaleString('en-IN')})</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SHARED: APPROVED STATE */}
                    {isApproved && (
                      <div className="pt-3 border-t border-[#2A1E17]/60 flex items-center justify-between">
                         <span className="text-xs font-bold text-emerald-400 flex items-center">
                           <Check className="w-4 h-4 mr-1.5" /> Stage Approved & Paid
                         </span>
                         <span className="text-[10px] text-slate-500 font-mono">{step.approvedAt}</span>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Sidebar Detail Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Payment Escrow Protection Card */}
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">karagir Material Escrow</h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#120B08] border border-emerald-950/80">
              <span className="text-xs text-slate-400">Remaining Payment</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                ₹{order.escrowVaultBalance.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120B08] border border-[#2A1E17]">
              <span className="text-xs text-slate-400">Sent Payment</span>
              <p className="text-2xl font-extrabold text-white font-mono mt-0.5">
                ₹{totalReleased.toLocaleString('en-IN')}
              </p>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
              All payments are secured in the Karagir Escrow Vault and only released upon your explicit approval of physical milestone proofs.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
