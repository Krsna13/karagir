import React, { useState, useEffect } from 'react';
import type { MaterialBatch, MaterialPassport } from '../types/materialPassport';
import { 
  getAllMaterialRecords, 
  allocateMaterialToProject, 
  createMaterialBatch, 
  checkDuplicateBatchRecord,
  getPublicMaterialPassport
} from '../services/materialPassportService';
import { MaterialPassportView } from './MaterialPassportView';
import { 
  Plus, 
  Package, 
  FolderKanban, 
  Layers, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  X, 
  Search, 
  Upload, 
  Building, 
  Info,
  ChevronRight,
  Check
} from 'lucide-react';

interface MaterialRegistryViewProps {
  onNavigateToPassport?: (passportId: string) => void;
}

export const MaterialRegistryView: React.FC<MaterialRegistryViewProps> = ({ onNavigateToPassport }) => {
  const [materials, setMaterials] = useState<MaterialBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedBatchForAllocation, setSelectedBatchForAllocation] = useState<MaterialBatch | null>(null);
  const [viewingPassport, setViewingPassport] = useState<MaterialPassport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-step Registration Form State
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Wood');
  const [materialName, setMaterialName] = useState('Seasoned Sagwan Teak');
  const [grade, setGrade] = useState('A');
  const [description, setDescription] = useState('Seasoned teak wood purchased for custom furniture production.');
  const [species, setSpecies] = useState('Teak Wood');

  const [supplierName, setSupplierName] = useState('Sahrangpur Pvt Wood');
  const [supplierLocation, setSupplierLocation] = useState('Nashik, Maharashtra');
  const [supplierContact, setSupplierContact] = useState('+91 98231 44520');
  const [supplierGst, setSupplierGst] = useState('27AABCS1429B1Z1');
  const [purchaseDate, setPurchaseDate] = useState('2026-08-14');

  const [invoiceNumber, setInvoiceNumber] = useState('INV-4521');
  const [supplierBatchId, setSupplierBatchId] = useState('TV-0826-19');
  const [purchasedQuantity, setPurchasedQuantity] = useState(100);
  const [allocatedQuantity] = useState(30);
  const [unit, setUnit] = useState('kg');
  const [purchaseAmount, setPurchaseAmount] = useState(85000);
  const [invoiceAttached, setInvoiceAttached] = useState(true);

  const [hasPhoto1, setHasPhoto1] = useState(true); // Full photo
  const [hasPhoto2, setHasPhoto2] = useState(true); // Grain closeup
  const [hasPhoto3, setHasPhoto3] = useState(true); // Multi-angle
  const [hasPhoto4, setHasPhoto4] = useState(false); // Packaging label

  const [hasCert, setHasCert] = useState(true);
  const [certName, setCertName] = useState('FSC Certificate');
  const [certNumber, setCertNumber] = useState('FSC-C012345');
  const [certAuthority, setCertAuthority] = useState('Forest Stewardship Council');
  const [certIssueDate, setCertIssueDate] = useState('2026-08-14');

  // Allocation Form State
  const [projectName, setProjectName] = useState('Custom Oak & Sagwan Teak Dining Table');
  const [projectId, setProjectId] = useState('#KARAGIR-99210');
  const [allocatingQty, setAllocatingQty] = useState(30);
  const [allocationError, setAllocationError] = useState<string | null>(null);

  // Duplicate Warning State & Success State
  const [duplicateWarning, setDuplicateWarning] = useState<MaterialBatch | null>(null);
  const [registrationSuccessBatch, setRegistrationSuccessBatch] = useState<MaterialBatch | null>(null);

  const loadMaterials = async () => {
    setLoading(true);
    const data = await getAllMaterialRecords();
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Allocation Modal
  const handleOpenAllocateModal = (batch: MaterialBatch) => {
    setSelectedBatchForAllocation(batch);
    setAllocatingQty(Math.min(batch.remainingQuantity, 30));
    setAllocationError(null);
    setIsAllocateModalOpen(true);
  };

  // Submit Allocation
  const handleConfirmAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForAllocation) return;

    if (allocatingQty <= 0) {
      setAllocationError('Quantity must be greater than 0.');
      return;
    }

    if (allocatingQty > selectedBatchForAllocation.remainingQuantity) {
      setAllocationError(`Insufficient remaining quantity. Maximum available: ${selectedBatchForAllocation.remainingQuantity} ${selectedBatchForAllocation.quantityUnit}`);
      return;
    }

    const result = await allocateMaterialToProject(
      selectedBatchForAllocation.passportId,
      projectId,
      projectName,
      allocatingQty
    );

    if (result.success) {
      setIsAllocateModalOpen(false);
      setSelectedBatchForAllocation(null);
      await loadMaterials();
    } else {
      setAllocationError(result.message);
    }
  };

  // Step 6 Check & Register
  const handleReviewStep = async () => {
    // Check duplicate
    const dupCheck = await checkDuplicateBatchRecord(supplierName, supplierBatchId, invoiceNumber);
    if (dupCheck.isDuplicate && dupCheck.existingRecord) {
      setDuplicateWarning(dupCheck.existingRecord);
    } else {
      setDuplicateWarning(null);
    }
    setStep(6);
  };

  const handleRegisterSubmit = async () => {
    try {
      const newBatch = await createMaterialBatch({
        orderId: projectId || 'KAR-PROJ-GEN',
        materialType: materialName,
        species,
        category,
        grade,
        description,
        supplierName,
        supplierLocation,
        supplierContact,
        supplierGst,
        supplierBatchId,
        invoiceNumber,
        purchaseDate,
        purchasedQuantity,
        allocatedQuantity,
        quantityUnit: unit,
        purchaseAmount,
        projectId,
        projectName: allocatedQuantity > 0 ? projectName : undefined,
        certificateAvailable: hasCert,
        certificateName: hasCert ? certName : undefined,
        certificateNumber: hasCert ? certNumber : undefined,
        certificateAuthority: hasCert ? certAuthority : undefined,
        certificateIssueDate: hasCert ? certIssueDate : undefined,
        certificateStatus: hasCert ? 'Certificate Submitted' : undefined,
        verificationStatus: 'VERIFIED',
        traceabilityStatus: 'TRACEABILITY_COMPLETE',
        status: 'client_approved',
        sampleStatus: 'none'
      });

      if (newBatch) {
        setRegistrationSuccessBatch(newBatch);
        await loadMaterials();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to register material');
    }
  };

  const handleOpenPassportView = async (passportId: string) => {
    if (onNavigateToPassport) {
      onNavigateToPassport(passportId);
    } else {
      const pass = await getPublicMaterialPassport(passportId);
      if (pass) {
        setViewingPassport(pass);
      }
    }
  };

  const handleResetWizard = () => {
    setStep(1);
    setDuplicateWarning(null);
    setRegistrationSuccessBatch(null);
    setIsRegisterModalOpen(false);
  };

  // KPI Calculations
  const totalRegisteredCount = materials.length;
  const totalAllocatedProjectsCount = materials.filter(m => m.allocatedQuantity > 0 || (m.projectAllocations && m.projectAllocations.length > 0)).length;
  const totalRemainingKg = materials
    .filter(m => m.quantityUnit === 'kg')
    .reduce((sum, m) => sum + (m.remainingQuantity || 0), 0);

  // Filtered Records
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.passportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplierBatchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || m.category?.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A1E17] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Material Registry</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-bold">
              Ledger Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register purchased materials and maintain traceability from supplier to customer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setStep(1);
            setRegistrationSuccessBatch(null);
            setIsRegisterModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-lg glow-orange flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Register Material</span>
        </button>
      </div>

      {/* 2. Three Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Registered Materials */}
        <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden group hover:border-[#EA580C]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Materials</span>
            <div className="w-10 h-10 rounded-2xl bg-[#120B08] border border-[#2A1E17] flex items-center justify-center text-[#EA580C]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{totalRegisteredCount}</p>
            <span className="text-xs text-emerald-400 font-semibold font-mono">batches on file</span>
          </div>
          <p className="text-[11px] text-slate-500">Documented from lumberyards and authorized suppliers</p>
        </div>

        {/* Card 2: Allocated to Projects */}
        <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden group hover:border-[#EAB308]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allocated to Projects</span>
            <div className="w-10 h-10 rounded-2xl bg-[#120B08] border border-[#2A1E17] flex items-center justify-center text-[#EAB308]">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#EAB308] font-mono">{totalAllocatedProjectsCount}</p>
            <span className="text-xs text-slate-400 font-mono">active builds</span>
          </div>
          <p className="text-[11px] text-slate-500">Currently assigned to verified customer milestone contracts</p>
        </div>

        {/* Card 3: Remaining Material */}
        <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Material</span>
            <div className="w-10 h-10 rounded-2xl bg-[#120B08] border border-[#2A1E17] flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{totalRemainingKg} kg</p>
            <span className="text-xs text-slate-400 font-mono">in stock lot</span>
          </div>
          <p className="text-[11px] text-slate-500">Available across registered workshop timber & brass lots</p>
        </div>

      </div>

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1F1510] border border-[#2A1E17] p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Material ID, Supplier, Batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#120B08] border border-[#2A1E17] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EA580C]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'Wood', 'Metal', 'Stone', 'Clay', 'Leather'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : 'bg-[#120B08] text-slate-400 hover:text-white border border-[#2A1E17]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Registered Material Records List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Registered Material Records</h2>
          <span className="text-xs font-mono text-slate-500">Showing {filteredMaterials.length} records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-[#1F1510] rounded-3xl border border-[#2A1E17]">
            <div className="w-8 h-8 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono">Loading Material Registry...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#1F1510] rounded-3xl border border-[#2A1E17] space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Material Records Found</h3>
            <p className="text-xs max-w-sm mx-auto">No material batches match your search criteria. Click "+ Register Material" to add a new batch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMaterials.map((mat) => {
              const remainingPct = Math.round((mat.remainingQuantity / mat.purchasedQuantity) * 100);
              const isVerified = mat.verificationStatus === 'VERIFIED' || mat.traceabilityStatus === 'TRACEABILITY_COMPLETE';
              const isRejected = mat.verificationStatus === 'REJECTED' || mat.traceabilityStatus === 'REJECTED';

              return (
                <div 
                  key={mat.id} 
                  className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-5 sm:p-6 hover:border-[#EA580C]/40 transition-all shadow-xl space-y-4"
                >
                  {/* Top Row: Material ID + Status + Category */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A1E17] pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs sm:text-sm font-mono font-extrabold text-white bg-[#120B08] px-3 py-1 rounded-xl border border-[#2A1E17] tracking-wider">
                        {mat.passportId}
                      </span>
                      <span className="text-xs font-bold text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-0.5 rounded-full border border-[#EA580C]/30">
                        {mat.category || 'Wood'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Grade <strong className="text-white">{mat.grade}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                        isVerified ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40' :
                        isRejected ? 'text-rose-400 bg-rose-950/30 border-rose-800/40' :
                        'text-amber-400 bg-amber-950/30 border-amber-800/40'
                      }`}>
                        {isVerified ? '✓ TRACEABILITY COMPLETE' : isRejected ? '✕ REJECTED' : '⚠ PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Middle Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Material Name & Sourcing Info */}
                    <div className="md:col-span-5 space-y-1.5">
                      <h3 className="text-base font-extrabold text-white">{mat.materialType}</h3>
                      <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>Supplier: <strong className="text-slate-200">{mat.supplierName}</strong></span>
                        {mat.supplierLocation && <span className="text-slate-500">({mat.supplierLocation})</span>}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center space-x-3 font-mono pt-1">
                        <span>Invoice: <strong className="text-white">{mat.invoiceNumber}</strong></span>
                        <span>•</span>
                        <span>Supplier Batch: <strong className="text-[#EA580C]">{mat.supplierBatchId}</strong></span>
                      </p>
                    </div>

                    {/* Middle: Quantity Ledger & Progress Bar */}
                    <div className="md:col-span-4 bg-[#120B08] p-4 rounded-2xl border border-[#2A1E17] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Purchased: <strong className="text-white">{mat.purchasedQuantity} {mat.quantityUnit}</strong></span>
                        <span className="text-[#EA580C] font-semibold">Allocated: {mat.allocatedQuantity} {mat.quantityUnit}</span>
                      </div>
                      
                      {/* Visual Quantity Bar */}
                      <div className="w-full h-2.5 bg-[#1F1510] rounded-full overflow-hidden flex border border-[#2A1E17]">
                        <div 
                          className="bg-[#EA580C] h-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((mat.allocatedQuantity / mat.purchasedQuantity) * 100))}%` }}
                          title={`Allocated: ${mat.allocatedQuantity} ${mat.quantityUnit}`}
                        />
                        <div 
                          className="bg-emerald-600 h-full transition-all"
                          style={{ width: `${Math.max(0, remainingPct)}%` }}
                          title={`Remaining: ${mat.remainingQuantity} ${mat.quantityUnit}`}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono pt-0.5">
                        <span className="text-emerald-400 font-bold">Remaining: {mat.remainingQuantity} {mat.quantityUnit}</span>
                        <span className="text-slate-500">{mat.purchaseDate}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAllocateModal(mat)}
                        disabled={mat.remainingQuantity <= 0}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                          mat.remainingQuantity > 0 
                            ? 'bg-[#EA580C] hover:bg-[#F97316] text-white shadow-md glow-orange' 
                            : 'bg-[#120B08] text-slate-600 border border-[#2A1E17] cursor-not-allowed'
                        }`}
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        <span>Allocate to Project</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPassportView(mat.passportId)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-[#2A1E17] text-slate-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>Passport</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyId(mat.passportId)}
                          className="py-2 px-3 rounded-xl bg-[#120B08] hover:bg-[#261B15] border border-[#2A1E17] text-slate-300 hover:text-white text-[11px] font-mono transition-colors"
                          title="Copy Material ID"
                        >
                          {copiedId === mat.passportId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Project Allocations Pill if assigned */}
                  {mat.projectAllocations && mat.projectAllocations.length > 0 && (
                    <div className="pt-2 border-t border-[#2A1E17]/60 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300">Allocated Projects:</span>
                      {mat.projectAllocations.map((alloc, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-[#120B08] border border-[#2A1E17] text-slate-200">
                          {alloc.projectName} ({alloc.allocatedQuantity} {mat.quantityUnit}) • {alloc.projectId}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PROJECT ALLOCATION MODAL                         */}
      {/* ========================================================= */}
      {isAllocateModalOpen && selectedBatchForAllocation && (
        <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            
            <div className="flex justify-between items-start border-b border-[#2A1E17] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider font-bold block">
                  Quantity Traceability
                </span>
                <h3 className="text-xl font-extrabold text-white">Allocate Material to Project</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAllocateModalOpen(false)}
                className="p-2 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white border border-[#2A1E17]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Batch Reference Card */}
            <div className="p-4 rounded-2xl bg-[#120B08] border border-[#2A1E17] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono text-white font-bold">{selectedBatchForAllocation.passportId}</span>
                <span className="text-emerald-400 font-mono font-bold">Remaining: {selectedBatchForAllocation.remainingQuantity} {selectedBatchForAllocation.quantityUnit}</span>
              </div>
              <p className="text-slate-300 font-semibold">{selectedBatchForAllocation.materialType}</p>
              <p className="text-slate-500 text-[11px]">
                Supplier: {selectedBatchForAllocation.supplierName} • Batch: {selectedBatchForAllocation.supplierBatchId}
              </p>
            </div>

            <form onSubmit={handleConfirmAllocation} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Active Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Project Order ID
                  </label>
                  <input
                    type="text"
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Quantity to Allocate ({selectedBatchForAllocation.quantityUnit})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedBatchForAllocation.remainingQuantity}
                    value={allocatingQty}
                    onChange={(e) => setAllocatingQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              {allocationError && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{allocationError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg glow-orange"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MULTI-STEP MATERIAL REGISTRATION WIZARD (STEPS 1-6) */}
      {/* ========================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn my-8">
            
            {/* Modal Header & Progress */}
            <div className="flex justify-between items-start border-b border-[#2A1E17] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider font-bold block">
                  Kaaragir Material Sourcing Engine
                </span>
                <h3 className="text-xl font-extrabold text-white">Register New Material</h3>
                {!registrationSuccessBatch && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Step {step} of 6: {
                      step === 1 ? 'Material Details' :
                      step === 2 ? 'Supplier Details' :
                      step === 3 ? 'Purchase & Batch Details' :
                      step === 4 ? 'Material Evidence Photographs' :
                      step === 5 ? 'Certification Details' :
                      'Review Sourcing Record'
                    }
                  </p>
                )}
              </div>
              <button 
                type="button"
                onClick={handleResetWizard}
                className="p-2 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white border border-[#2A1E17]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SUCCESS SCREEN AFTER REGISTRATION */}
            {registrationSuccessBatch ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 border-2 border-emerald-600 text-emerald-400 mx-auto flex items-center justify-center shadow-lg glow-green">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-white">Material Successfully Registered</h4>
                  <p className="text-xs text-slate-400">Your unique Kaaragir Material ID has been catalogued in the traceability ledger.</p>
                </div>

                {/* Material ID Box */}
                <div className="p-6 rounded-2xl bg-[#120B08] border-2 border-[#EA580C] space-y-2 max-w-md mx-auto shadow-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Your Kaaragir Material ID
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-widest text-[#EA580C]">
                    {registrationSuccessBatch.passportId}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    Keep this ID safe. Buyers can use it to verify the material traceability record.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyId(registrationSuccessBatch.passportId)}
                    className="px-5 py-3 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-200 border border-[#2A1E17] text-xs font-bold flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4 text-[#EA580C]" />
                    <span>{copiedId === registrationSuccessBatch.passportId ? 'Copied to Clipboard!' : 'Copy Material ID'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleResetWizard();
                      handleOpenAllocateModal(registrationSuccessBatch);
                    }}
                    className="px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 glow-orange"
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>Allocate to Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const id = registrationSuccessBatch.passportId;
                      handleResetWizard();
                      handleOpenPassportView(id);
                    }}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Material Passport</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                
                {/* ================================================= */}
                {/* STEP 1: MATERIAL DETAILS                          */}
                {/* ================================================= */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Material Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        >
                          <option value="Wood">Wood</option>
                          <option value="Metal">Metal</option>
                          <option value="Stone">Stone</option>
                          <option value="Clay">Clay</option>
                          <option value="Rattan & Cane">Rattan & Cane</option>
                          <option value="Textile">Textile</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Material Name
                        </label>
                        <input
                          type="text"
                          required
                          value={materialName}
                          onChange={(e) => setMaterialName(e.target.value)}
                          placeholder="e.g. Seasoned Sagwan Teak"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Material Grade
                        </label>
                        <input
                          type="text"
                          required
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          placeholder="e.g. A"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Optional: Species / Material Type
                        </label>
                        <input
                          type="text"
                          value={species}
                          onChange={(e) => setSpecies(e.target.value)}
                          placeholder="e.g. Teak Wood"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Material Description
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details regarding the material specifications, curing, or intended use."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center space-x-1.5"
                      >
                        <span>Next: Supplier Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* STEP 2: SUPPLIER DETAILS                          */}
                {/* ================================================= */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Supplier / Retailer Name
                        </label>
                        <input
                          type="text"
                          required
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                          placeholder="e.g. Sahrangpur Pvt Wood"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Supplier Location
                        </label>
                        <input
                          type="text"
                          required
                          value={supplierLocation}
                          onChange={(e) => setSupplierLocation(e.target.value)}
                          placeholder="e.g. Nashik, Maharashtra"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Supplier Contact Number
                        </label>
                        <input
                          type="text"
                          value={supplierContact}
                          onChange={(e) => setSupplierContact(e.target.value)}
                          placeholder="e.g. +91 98231 44520"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Supplier GST / Business Details (Optional)
                        </label>
                        <input
                          type="text"
                          value={supplierGst}
                          onChange={(e) => setSupplierGst(e.target.value)}
                          placeholder="e.g. 27AABCS1429B1Z1"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        required
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-xl bg-[#120B08] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center space-x-1.5"
                      >
                        <span>Next: Purchase & Batch Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* STEP 3: PURCHASE AND BATCH DETAILS                */}
                {/* ================================================= */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          required
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder="e.g. INV-4521"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Supplier Batch ID (from Supplier)
                        </label>
                        <input
                          type="text"
                          required
                          value={supplierBatchId}
                          onChange={(e) => setSupplierBatchId(e.target.value)}
                          placeholder="e.g. TV-0826-19"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    {/* Note on Supplier Batch vs Kaaragir Material ID */}
                    <div className="p-3 bg-[#120B08] rounded-xl border border-[#EA580C]/30 text-[11px] text-slate-300 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-[#EA580C] mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Important:</strong> The supplier batch ID identifies the supplier's original batch. Kaaragir will generate its OWN unique Material ID.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Purchased Quantity
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={purchasedQuantity}
                          onChange={(e) => setPurchasedQuantity(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Unit of Measurement
                        </label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                        >
                          <option value="kg">kg</option>
                          <option value="meter">meter</option>
                          <option value="sq.ft">sq.ft</option>
                          <option value="piece">piece</option>
                          <option value="liter">liter</option>
                          <option value="other">other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Purchase Amount (₹, Optional)
                        </label>
                        <input
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    {/* Invoice Upload Box */}
                    <div className="p-4 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Upload Sourcing Invoice / Receipt (PDF / JPG)
                      </span>
                      <div className="flex items-center space-x-3">
                        <label className="cursor-pointer px-4 py-2 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>Attach Invoice</span>
                          <input type="file" className="hidden" onChange={() => setInvoiceAttached(true)} />
                        </label>
                        {invoiceAttached && (
                          <span className="text-xs text-emerald-400 font-mono flex items-center">
                            <Check className="w-3.5 h-3.5 mr-1" /> Mock Invoice Attached (INV-4521)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-xl bg-[#120B08] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center space-x-1.5"
                      >
                        <span>Next: Material Evidence</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* STEP 4: MATERIAL EVIDENCE                         */}
                {/* ================================================= */}
                {step === 4 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#120B08] p-3.5 rounded-2xl border border-[#2A1E17]">
                      "These photographs create a visual record of the material at the time of registration. They are supporting evidence and are not by themselves laboratory proof of authenticity."
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <div className="p-3.5 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2">
                        <span className="text-[11px] font-bold text-white block">1. Full Material Photograph</span>
                        <label className="cursor-pointer px-3 py-1.5 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5 w-max">
                          <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>{hasPhoto1 ? 'Photo Attached ✓' : 'Upload Photo'}</span>
                          <input type="file" className="hidden" onChange={() => setHasPhoto1(true)} />
                        </label>
                      </div>

                      <div className="p-3.5 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2">
                        <span className="text-[11px] font-bold text-white block">2. Close-Up / Grain / Texture</span>
                        <label className="cursor-pointer px-3 py-1.5 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5 w-max">
                          <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>{hasPhoto2 ? 'Photo Attached ✓' : 'Upload Photo'}</span>
                          <input type="file" className="hidden" onChange={() => setHasPhoto2(true)} />
                        </label>
                      </div>

                      <div className="p-3.5 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2">
                        <span className="text-[11px] font-bold text-white block">3. Multiple-Angle Photograph</span>
                        <label className="cursor-pointer px-3 py-1.5 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5 w-max">
                          <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>{hasPhoto3 ? 'Photo Attached ✓' : 'Upload Photo'}</span>
                          <input type="file" className="hidden" onChange={() => setHasPhoto3(true)} />
                        </label>
                      </div>

                      <div className="p-3.5 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-2">
                        <span className="text-[11px] font-bold text-white block">4. Packaging / Label (Optional)</span>
                        <label className="cursor-pointer px-3 py-1.5 bg-[#1F1510] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5 w-max">
                          <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>{hasPhoto4 ? 'Photo Attached ✓' : 'Upload Photo'}</span>
                          <input type="file" className="hidden" onChange={() => setHasPhoto4(true)} />
                        </label>
                      </div>

                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-5 py-2.5 rounded-xl bg-[#120B08] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center space-x-1.5"
                      >
                        <span>Next: Certification</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* STEP 5: CERTIFICATION                            */}
                {/* ================================================= */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Certification Available?</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setHasCert(true)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold ${hasCert ? 'bg-[#EA580C] text-white' : 'bg-[#1F1510] text-slate-400 border border-[#2A1E17]'}`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasCert(false)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold ${!hasCert ? 'bg-[#EA580C] text-white' : 'bg-[#1F1510] text-slate-400 border border-[#2A1E17]'}`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {hasCert && (
                        <div className="space-y-3 pt-3 border-t border-[#2A1E17]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                Certificate Name
                              </label>
                              <input
                                type="text"
                                value={certName}
                                onChange={(e) => setCertName(e.target.value)}
                                placeholder="e.g. FSC Certificate"
                                className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                Certificate Number
                              </label>
                              <input
                                type="text"
                                value={certNumber}
                                onChange={(e) => setCertNumber(e.target.value)}
                                placeholder="e.g. FSC-C012345"
                                className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                Issuing Authority
                              </label>
                              <input
                                type="text"
                                value={certAuthority}
                                onChange={(e) => setCertAuthority(e.target.value)}
                                placeholder="e.g. Forest Stewardship Council"
                                className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                Issue Date
                              </label>
                              <input
                                type="date"
                                value={certIssueDate}
                                onChange={(e) => setCertIssueDate(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#1F1510] border border-[#2A1E17] text-white text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="px-5 py-2.5 rounded-xl bg-[#120B08] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleReviewStep}
                        className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center space-x-1.5"
                      >
                        <span>Next: Review & Register</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* STEP 6: REVIEW & DUPLICATE PROTECTION             */}
                {/* ================================================= */}
                {step === 6 && (
                  <div className="space-y-4">
                    
                    {/* Duplicate Batch Alert if detected */}
                    {duplicateWarning && (
                      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800 text-xs space-y-2">
                        <div className="flex items-center space-x-2 text-amber-400 font-bold">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>Possible Duplicate Material Batch</span>
                        </div>
                        <p className="text-slate-300">
                          This supplier batch has already been registered in the ledger.
                        </p>
                        <div className="p-3 bg-[#120B08] rounded-xl border border-amber-900/50 space-y-1 font-mono text-[11px] text-slate-300">
                          <p>Material ID: <strong className="text-white">{duplicateWarning.passportId}</strong></p>
                          <p>Supplier: {duplicateWarning.supplierName}</p>
                          <p>Batch ID: {duplicateWarning.supplierBatchId}</p>
                          <p>Purchased: {duplicateWarning.purchasedQuantity} {duplicateWarning.quantityUnit} • Remaining: {duplicateWarning.remainingQuantity} {duplicateWarning.quantityUnit}</p>
                        </div>
                      </div>
                    )}

                    {/* Review Summary Grid */}
                    <div className="p-5 bg-[#120B08] rounded-2xl border border-[#2A1E17] space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#2A1E17]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">MATERIAL</span>
                          <span className="font-bold text-white text-sm">{materialName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">CATEGORY</span>
                          <span className="font-bold text-[#EA580C]">{category}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#2A1E17]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">SUPPLIER</span>
                          <span className="text-slate-200">{supplierName} ({supplierLocation})</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">INVOICE & BATCH</span>
                          <span className="font-mono text-white">{invoiceNumber} • {supplierBatchId}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#2A1E17]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">PURCHASED QUANTITY</span>
                          <span className="font-mono font-bold text-emerald-400">{purchasedQuantity} {unit}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">DOCUMENTS & PHOTOS</span>
                          <span className="text-slate-300">Invoice attached • 3 Photos recorded</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">CERTIFICATION</span>
                        <span className="text-slate-300">
                          {hasCert ? `${certName} (${certNumber}) - Submitted` : 'No certification record submitted'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="px-5 py-2.5 rounded-xl bg-[#120B08] text-slate-400 text-xs font-bold border border-[#2A1E17]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleRegisterSubmit}
                        className="flex-1 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-widest shadow-lg glow-orange"
                      >
                        Register Material & Generate Material ID
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: MATERIAL PASSPORT PREVIEW MODAL                  */}
      {/* ========================================================= */}
      {viewingPassport && (
        <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A1E17] pb-4">
              <span className="text-xs font-mono font-bold text-[#EA580C] uppercase tracking-wider">
                Material Passport Preview
              </span>
              <button 
                type="button"
                onClick={() => setViewingPassport(null)}
                className="p-2 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white border border-[#2A1E17]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <MaterialPassportView passport={viewingPassport} />
          </div>
        </div>
      )}

    </div>
  );
};
