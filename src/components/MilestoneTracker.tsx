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
  Package, 
  CheckCircle
} from 'lucide-react';
import { useEscrow } from '../context/EscrowContext';
import { useMaterialPassport } from '../context/MaterialPassportContext';
import { MaterialPassportView } from './MaterialPassportView';

interface MilestoneTrackerProps {
  onBack?: () => void;
  isArtisanView?: boolean;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ onBack, isArtisanView = false }) => {
  const { order, submitMilestoneProof, approveMilestone } = useEscrow();
  const { 
    passport, 
    createNewBatch, 
    uploadEvidence, 
    addCert, 
    updateSampleShipping, 
    updateSampleStatus,
    updateBatchStatus,
    checkDuplicate 
  } = useMaterialPassport();

  const [uploadingMilestoneId, setUploadingMilestoneId] = useState<string | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Guided Craftsman Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [materialType, setMaterialType] = useState(order.productTitle.split(' ').slice(1).join(' ') || 'Premium Teak Wood');
  const [species, setSpecies] = useState('');
  const [grade, setGrade] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Cert Form State
  const certType = 'FSC Certificate';
  const [certNumber, setCertNumber] = useState('');
  const [certAuthority, setCertAuthority] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssuedAt, setCertIssuedAt] = useState(new Date().toISOString().split('T')[0]);

  // Sample ID State
  const [sampleId, setSampleId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Duplicate Check Warning state
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Client Verification Checklist State
  const [checklist, setChecklist] = useState({
    grain: false,
    colour: false,
    texture: false,
    sampleReceived: false,
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
    // Release escrow and approve passport
    await updateSampleStatus('verified'); // sets batch to client_approved
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
    if (!materialType || !species || !grade || !supplierName) {
      alert('Please fill out all sourcing details.');
      return;
    }
    await createNewBatch(order.orderId, materialType, species, grade, supplierName, purchaseDate);
    setWizardStep(2);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'invoice' | 'raw_full' | 'grain_closeup' | 'angle_additional') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDuplicateWarning(null);

      try {
        const dupResult = await checkDuplicate(file);
        if (dupResult.isDuplicate) {
          setDuplicateWarning(`This evidence appears to have already been submitted for another order (${dupResult.filename}).`);
        }

        await uploadEvidence(file, type);
      } catch (err) {
        console.error('File upload failed', err);
      }
    }
  };

  const handleAddCert = async () => {
    if (!certNumber || !certAuthority || !certIssuer) {
      alert('Please fill out all certification details.');
      return;
    }
    await addCert(certType, certNumber, certAuthority, certIssuer, certIssuedAt);
    setCertNumber('');
    setCertAuthority('');
    setCertIssuer('');
    alert('Certificate added successfully!');
  };

  const handlePrepareSample = () => {
    const sId = `SAMPLE-${Math.floor(10000 + Math.random() * 90000)}`;
    setSampleId(sId);
  };

  const handleShipSample = async () => {
    if (!trackingNumber) {
      alert('Please enter courier tracking details.');
      return;
    }
    await updateSampleShipping(sampleId, trackingNumber);
    setWizardStep(5);
  };

  const handleSubmitPassport = async (milestoneId: string) => {
    await updateBatchStatus('pending_client_review');
    
    // Extract a proof photo to sync to standard milestone proof
    const grainPhoto = passport?.evidence.find(e => e.type === 'grain_closeup')?.storagePath || '';
    const rawPhoto = passport?.evidence.find(e => e.type === 'raw_full')?.storagePath || '';
    
    submitMilestoneProof(milestoneId, [grainPhoto || rawPhoto || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80']);
    alert('Material passport submitted for client review.');
  };

  const allChecklistItemsChecked = 
    checklist.grain && 
    checklist.colour && 
    checklist.texture && 
    checklist.sampleReceived && 
    checklist.docsReviewed;

  const totalReleased = order.totalBudget - order.escrowVaultBalance;

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
                    {/* STAGE 1: RAW MATERIAL VERIFICATION (WIZARDS & CHECKLISTS) */}
                    {/* ========================================================= */}
                    {step.stageNumber === 1 && (
                      <div className="space-y-4 pt-3 border-t border-[#2A1E17]/60">
                        
                        {/* ARTISAN WORKFLOW (STAGE 1) */}
                        {isArtisanView && isInProgress && (
                          <div className="space-y-4 bg-[#120B08] p-5 rounded-2xl border border-[#EA580C]/30">
                            
                            {/* Step Progress indicators */}
                            <div className="flex items-center justify-between border-b border-[#2A1E17] pb-3 mb-2">
                              <span className="text-xs font-extrabold text-[#EA580C] uppercase tracking-wider">
                                Sourcing guided wizard: Step {wizardStep} of 5
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {wizardStep === 1 && 'Sourcing Details'}
                                {wizardStep === 2 && 'Supplier Documents'}
                                {wizardStep === 3 && 'Raw Material Photos'}
                                {wizardStep === 4 && 'Physical Sample'}
                                {wizardStep === 5 && 'Verify & Submit'}
                              </span>
                            </div>

                            {/* WIZARD STEP 1: CREATE BATCH */}
                            {wizardStep === 1 && !passport && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Material Type Specified</label>
                                  <input 
                                    type="text" 
                                    value={materialType}
                                    onChange={(e) => setMaterialType(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Wood Species</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Tectona grandis (Teak)" 
                                      value={species}
                                      onChange={(e) => setSpecies(e.target.value)}
                                      className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Lumber Grade</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Grade-A seasoned" 
                                      value={grade}
                                      onChange={(e) => setGrade(e.target.value)}
                                      className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier Lumberyard Name</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Saharanpur Timber Depot" 
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Purchase Date</label>
                                  <input 
                                    type="date" 
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                  />
                                </div>
                                <button 
                                  onClick={handleCreateBatch}
                                  className="w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold font-mono transition-colors shadow-md mt-2"
                                >
                                  Initialize Material Batch →
                                </button>
                              </div>
                            )}

                            {/* Resume Wizard if passport exists but wizard is step 1 */}
                            {wizardStep === 1 && passport && (
                              <div className="text-center py-4 space-y-3">
                                <p className="text-xs text-slate-300">Material batch initialized: <strong className="text-white">{passport.batch.materialType}</strong></p>
                                <button onClick={() => setWizardStep(2)} className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold">Resume Sourcing Wizard</button>
                              </div>
                            )}

                            {/* WIZARD STEP 2: DOCUMENTS */}
                            {wizardStep === 2 && passport && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="block text-[10px] uppercase font-bold text-slate-400">Upload Lumberyard Sourcing Invoice / Receipt</label>
                                  <div className="flex items-center space-x-3">
                                    <input 
                                      type="file" 
                                      accept="image/*,application/pdf"
                                      onChange={(e) => handleFileUpload(e, 'invoice')}
                                      className="hidden" 
                                      id="invoice-file"
                                    />
                                    <label 
                                      htmlFor="invoice-file"
                                      className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
                                    >
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                                      <span>Choose Invoice Image / PDF</span>
                                    </label>
                                    
                                    {passport.evidence.some(e => e.type === 'invoice') ? (
                                      <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                                        <Check className="w-3.5 h-3.5 mr-1" /> Invoice Attached
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 font-mono">Invoice missing</span>
                                    )}
                                  </div>
                                  
                                  {duplicateWarning && (
                                    <div className="text-[10px] text-rose-400 bg-rose-950/25 p-2.5 rounded-lg border border-rose-900/40 flex items-start gap-1.5">
                                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                      <span>{duplicateWarning}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="border-t border-[#2A1E17] pt-3 space-y-3">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Add Certification (Optional, e.g. FSC Wood Permit)</span>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Cert Number</label>
                                      <input 
                                        type="text" 
                                        placeholder="e.g. FSC-C012345" 
                                        value={certNumber}
                                        onChange={(e) => setCertNumber(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Authority</label>
                                      <input 
                                        type="text" 
                                        placeholder="e.g. Forest Stewardship Council" 
                                        value={certAuthority}
                                        onChange={(e) => setCertAuthority(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Issuer Name</label>
                                      <input 
                                        type="text" 
                                        placeholder="e.g. SCS Global Services" 
                                        value={certIssuer}
                                        onChange={(e) => setCertIssuer(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Issue Date</label>
                                      <input 
                                        type="date" 
                                        value={certIssuedAt}
                                        onChange={(e) => setCertIssuedAt(e.target.value)}
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
                                  {passport.certifications.length > 0 && (
                                    <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ FSC Cert recorded (Status: PENDING REVIEW)</span>
                                  )}
                                </div>

                                <div className="pt-2 flex justify-between gap-4">
                                  <button onClick={() => setWizardStep(1)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(3)} className="px-6 py-2 bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold rounded-xl">Next: Photos →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 3: RAW PHOTOS */}
                            {wizardStep === 3 && passport && (
                              <div className="space-y-4">
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">1. Full Raw Material Plank Photo</label>
                                    <input type="file" accept="image/*" id="raw-photo-file" className="hidden" onChange={(e) => handleFileUpload(e, 'raw_full')} />
                                    <label htmlFor="raw-photo-file" className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 w-max">
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" /> Choose Photo
                                    </label>
                                    {passport.evidence.some(e => e.type === 'raw_full') && <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ Full plank photo uploaded</span>}
                                  </div>

                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">2. Wood Grain Close-up Macro Photo (Important for fingerprinting)</label>
                                    <input type="file" accept="image/*" id="grain-photo-file" className="hidden" onChange={(e) => handleFileUpload(e, 'grain_closeup')} />
                                    <label htmlFor="grain-photo-file" className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 w-max">
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" /> Choose Photo
                                    </label>
                                    {passport.evidence.some(e => e.type === 'grain_closeup') && <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ Grain fingerprint photo uploaded</span>}
                                  </div>

                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">3. Multi-Angle Raw Lumber Photos (Optional)</label>
                                    <input type="file" accept="image/*" id="angle-photo-file" className="hidden" onChange={(e) => handleFileUpload(e, 'angle_additional')} />
                                    <label htmlFor="angle-photo-file" className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 w-max">
                                      <Upload className="w-3.5 h-3.5 text-[#EA580C]" /> Choose Photo
                                    </label>
                                    {passport.evidence.filter(e => e.type === 'angle_additional').length > 0 && (
                                      <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                                        ✓ {passport.evidence.filter(e => e.type === 'angle_additional').length} extra photo(s) uploaded
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="pt-2 flex justify-between gap-4">
                                  <button onClick={() => setWizardStep(2)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(4)} className="px-6 py-2 bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold rounded-xl">Next: Sample Block →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 4: PHYSICAL SAMPLE */}
                            {wizardStep === 4 && passport && (
                              <div className="space-y-4">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  For premium custom woodwork commissions, we require craftsmen to ship a small 2-inch off-cut sample block from the actual lumber chosen. The client will use this reference block to match texture, scent, and weight on delivery.
                                </p>

                                {!sampleId && !passport.batch.sampleId ? (
                                  <button 
                                    onClick={handlePrepareSample}
                                    className="py-2 px-4 rounded-lg bg-[#EA580C]/10 border border-[#EA580C]/40 text-[#EA580C] text-xs font-bold hover:bg-[#EA580C]/20 transition-all flex items-center space-x-1.5"
                                  >
                                    <Package className="w-4 h-4" />
                                    <span>Cut & Generate Sample ID</span>
                                  </button>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-[#1F1510] border border-[#2A1E17]">
                                      <span className="text-[9px] uppercase font-bold text-slate-500">Sample Reference Details</span>
                                      <p className="text-xs font-bold text-white mt-1">Sample ID: {sampleId || passport.batch.sampleId}</p>
                                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Order ID: #{order.orderId.split('-').pop()}</p>
                                      <p className="text-[9px] text-[#EA580C] font-mono mt-0.5">Please write these IDs on the physical block before dispatching.</p>
                                    </div>

                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Courier Tracking details (e.g. Delhivery, BlueDart)</label>
                                      <input 
                                        type="text" 
                                        placeholder="e.g. BlueDart #88291022" 
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                                      />
                                    </div>

                                    <button 
                                      onClick={handleShipSample}
                                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl w-full flex items-center justify-center space-x-1.5"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Confirm Dispatch & Ship</span>
                                    </button>
                                  </div>
                                )}

                                <div className="pt-2 flex justify-between gap-4 border-t border-[#2A1E17] mt-3">
                                  <button onClick={() => setWizardStep(3)} className="px-4 py-2 border border-[#2A1E17] rounded-xl text-slate-400 text-xs font-bold hover:bg-[#261B15]">Back</button>
                                  <button onClick={() => setWizardStep(5)} className="px-6 py-2 border border-[#EA580C]/40 text-[#EA580C] hover:text-white hover:bg-[#261B15] text-xs font-bold rounded-xl">Skip Sample / Next →</button>
                                </div>
                              </div>
                            )}

                            {/* WIZARD STEP 5: VERIFY & SUBMIT */}
                            {wizardStep === 5 && passport && (
                              <div className="space-y-4 text-center">
                                <p className="text-xs text-slate-300">
                                  Your Material Passport is prepared. Sourcing information and digital evidence will be sent for Client review.
                                </p>

                                <div className="text-left bg-[#1F1510] p-4 rounded-xl border border-[#2A1E17] space-y-1 text-xs">
                                  <p className="text-slate-400">Material Type: <span className="text-white font-bold">{passport.batch.materialType}</span></p>
                                  <p className="text-slate-400">Invoice: <span className="text-white font-bold">{passport.evidence.some(e => e.type === 'invoice') ? 'ATTACHED' : 'MISSING'}</span></p>
                                  <p className="text-slate-400">Grain Closeup: <span className="text-white font-bold">{passport.evidence.some(e => e.type === 'grain_closeup') ? 'ATTACHED' : 'MISSING'}</span></p>
                                  <p className="text-slate-400">Physical Sample: <span className="text-white font-bold">{passport.batch.sampleStatus === 'shipped' ? 'SHIPPED' : 'NONE'}</span></p>
                                </div>

                                <div className="flex space-x-3 pt-2">
                                  <button onClick={() => setWizardStep(4)} className="flex-1 py-2.5 border border-[#2A1E17] text-slate-400 text-xs font-bold rounded-xl hover:bg-[#261B15]">Back</button>
                                  <button 
                                    onClick={() => handleSubmitPassport(step.id)}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                                  >
                                    Submit Material Passport
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* ARTISAN WORKFLOW (PENDING REVIEW STATE) */}
                        {isArtisanView && isProofSubmitted && (
                          <div className="pt-2">
                            <span className="text-xs font-bold text-[#EAB308] flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 animate-pulse" /> Material Passport submitted. Waiting for Buyer manual verification...
                            </span>
                            {passport && (
                              <div className="mt-4">
                                <MaterialPassportView passport={passport} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* CLIENT VIEW WORKFLOW (IN_PROGRESS - WAITING FOR CREATION) */}
                        {!isArtisanView && isInProgress && (
                          <div className="pt-2 text-slate-400 text-xs flex items-center space-x-1.5 bg-[#120B08] p-4 rounded-xl border border-[#2A1E17]">
                            <Clock className="w-4 h-4 text-[#EA580C] animate-spin" />
                            <span>Craftsman is sourcing the timber and compiling the Material Passport...</span>
                          </div>
                        )}

                        {/* CLIENT VIEW WORKFLOW (PROOF SUBMITTED - MANUAL CHECKLIST & VERIFY) */}
                        {!isArtisanView && isProofSubmitted && passport && (
                          <div className="space-y-4">
                            <MaterialPassportView passport={passport} />

                            <div className="bg-[#120B08] p-5 rounded-2xl border border-[#EAB308]/30 space-y-4">
                              <div>
                                <h4 className="text-xs font-extrabold text-[#EAB308] uppercase tracking-wider">Your Physical Verification Check</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Please inspect the physical sample block and documents before releasing payments.</p>
                              </div>

                              <div className="space-y-2.5">
                                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={checklist.grain} 
                                    onChange={(e) => setChecklist(prev => ({ ...prev, grain: e.target.checked }))}
                                    className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                  />
                                  <span>Lumber grain patterns match digital photographs.</span>
                                </label>

                                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={checklist.colour} 
                                    onChange={(e) => setChecklist(prev => ({ ...prev, colour: e.target.checked }))}
                                    className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                  />
                                  <span>Material colour conforms to specifications.</span>
                                </label>

                                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={checklist.texture} 
                                    onChange={(e) => setChecklist(prev => ({ ...prev, texture: e.target.checked }))}
                                    className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                  />
                                  <span>Material feel, texture, and density are consistent.</span>
                                </label>

                                {passport.batch.sampleStatus !== 'none' && (
                                  <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={checklist.sampleReceived} 
                                      onChange={(e) => setChecklist(prev => ({ ...prev, sampleReceived: e.target.checked }))}
                                      className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                    />
                                    <span>Physical sample block received (Sample ID: {passport.batch.sampleId}).</span>
                                  </label>
                                )}

                                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={checklist.docsReviewed} 
                                    onChange={(e) => setChecklist(prev => ({ ...prev, docsReviewed: e.target.checked }))}
                                    className="rounded bg-[#1F1510] border-[#2A1E17] text-[#EA580C] focus:ring-0 w-4 h-4"
                                  />
                                  <span>Lumberyard procurement invoices & certifications reviewed.</span>
                                </label>
                              </div>

                              <button 
                                onClick={() => handleApproveStage1(step.id)}
                                disabled={!allChecklistItemsChecked}
                                className={`w-full py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                                  allChecklistItemsChecked 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 glow-green' 
                                    : 'bg-[#1F1510] text-slate-500 border border-[#2A1E17] cursor-not-allowed'
                                }`}
                              >
                                <ShieldCheck className="w-4 h-4" />
                                <span>Approve Sourced Materials & Pay (₹{step.grossAmount.toLocaleString('en-IN')})</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* STAGES 2 & 3: CONSTRUCTION EVIDENCE & PAGINGS LOCK        */}
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
