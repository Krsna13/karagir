import { supabase } from '../lib/supabase/client';
import type { 
  MaterialBatch, 
  EvidenceRecord, 
  CertificationRecord, 
  MaterialPassport,
  EvidenceType,
  VerificationStatus,
  PhysicalVerificationStatus
} from '../types/materialPassport';
import { computeFileHash } from '../utils/hash';
import { uploadImage, getImageUrl } from '../lib/supabase/storage';

const BUCKET_NAME = 'product-images';

// Helper to get mock data from localStorage
const getLocalData = <T>(key: string): T[] => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

const setLocalData = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
};

/**
 * Generates a unique Material Verification ID in the required format:
 * KAR-MAT-YYYY-XXXXX
 * (e.g. KAR-MAT-2026-97373)
 */
export const generateMaterialId = (year: number = 2026): string => {
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const existingIds = new Set(batches.map(b => b.passportId?.toUpperCase()));
  
  let newId = '';
  let attempts = 0;
  while (attempts < 1000) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    newId = `KAR-MAT-${year}-${randomNum}`;
    if (!existingIds.has(newId.toUpperCase())) {
      return newId;
    }
    attempts++;
  }
  return `KAR-MAT-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
};

/**
 * Checks if a Material Verification ID already exists in storage or database.
 */
export const checkMaterialIdExists = async (passportId: string): Promise<boolean> => {
  seedDemoData();
  const normalizedId = passportId.trim().toUpperCase();
  
  try {
    const { data, error } = await (supabase
      .from('material_batches') as any)
      .select('id')
      .ilike('passport_id', normalizedId)
      .limit(1)
      .maybeSingle();

    if (!error && data) return true;
  } catch {
    // ignore
  }

  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  return batches.some(b => b.passportId?.toUpperCase() === normalizedId);
};

/**
 * Validates that requested allocated quantity does not exceed available purchased quantity.
 */
export const validateQuantityAllocation = (
  purchasedQuantity: number,
  allocatedQuantity: number,
  existingAllocated: number = 0
): { isValid: boolean; remaining: number; maxAvailable: number; message?: string } => {
  const maxAvailable = Math.max(0, purchasedQuantity - existingAllocated);
  const remaining = purchasedQuantity - (existingAllocated + allocatedQuantity);

  if (allocatedQuantity <= 0) {
    return {
      isValid: false,
      remaining: maxAvailable,
      maxAvailable,
      message: 'Allocated quantity must be greater than 0.'
    };
  }

  if (allocatedQuantity > maxAvailable) {
    return {
      isValid: false,
      remaining: maxAvailable,
      maxAvailable,
      message: `Insufficient remaining quantity. Maximum available: ${maxAvailable} kg`
    };
  }

  return {
    isValid: true,
    remaining,
    maxAvailable
  };
};

/**
 * Checks for possible duplicate supplier batch registrations based on:
 * Supplier Name + Supplier Batch ID + Invoice Number.
 */
export const checkDuplicateBatchRecord = async (
  supplierName: string,
  supplierBatchId: string,
  invoiceNumber: string
): Promise<{ isDuplicate: boolean; existingRecord?: MaterialBatch }> => {
  seedDemoData();
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const sName = (supplierName || '').trim().toLowerCase();
  const sBatch = (supplierBatchId || '').trim().toLowerCase();
  const inv = (invoiceNumber || '').trim().toLowerCase();

  const existing = batches.find(b => 
    (b.supplierName || '').trim().toLowerCase() === sName &&
    (b.supplierBatchId || '').trim().toLowerCase() === sBatch &&
    (b.invoiceNumber || '').trim().toLowerCase() === inv
  );

  if (existing) {
    return { isDuplicate: true, existingRecord: existing };
  }
  return { isDuplicate: false };
};

/**
 * Seed initial demo records so hackathon demonstrations work smoothly out of the box.
 */
export const seedDemoData = () => {
  try {
    const batches = getLocalData<MaterialBatch>('karagir_material_batches');
    const existingPassportIds = new Set(batches.map(b => b.passportId));

    // 1. PRIMARY VERIFIED DEMO: KAR-MAT-2026-97373
    if (!existingPassportIds.has('KAR-MAT-2026-97373')) {
      const demoBatchId = 'demo-batch-1';
      const demoOrderId = 'KAR-PROJ-99210';
      const purchaseDate = '2026-08-14';
      const now = '2026-08-14T10:00:00.000Z';
      
      const demoBatch: MaterialBatch = {
        id: demoBatchId,
        orderId: demoOrderId,
        passportId: 'KAR-MAT-2026-97373',
        materialType: 'Seasoned Sagwan Teak',
        species: 'Teak Wood',
        category: 'Wood',
        grade: 'A',
        description: 'Seasoned teak wood purchased for custom furniture production.',
        supplierName: 'Sahrangpur Pvt Wood',
        supplierLocation: 'Nashik, Maharashtra',
        supplierContact: '+91 98231 44520',
        supplierGst: '27AABCS1429B1Z1',
        supplierBatchId: 'TV-0826-19',
        invoiceNumber: 'INV-4521',
        purchaseDate,
        purchasedQuantity: 100,
        allocatedQuantity: 30, // 30 kg for this project
        remainingQuantity: 70, // 70 kg remaining in registered lot
        quantityUnit: 'kg',
        purchaseAmount: 85000,
        artisanId: 'ART-102',
        artisanName: 'Rameshwar Suthar',
        projectId: '#KARAGIR-99210',
        projectName: 'Custom Oak & Sagwan Teak Dining Table',
        projectAllocations: [
          {
            id: 'alloc-1',
            projectId: '#KARAGIR-99210',
            projectName: 'Custom Oak & Sagwan Teak Dining Table',
            allocatedQuantity: 30,
            allocationDate: '14 August 2026'
          }
        ],
        verificationStatus: 'VERIFIED',
        traceabilityStatus: 'TRACEABILITY_COMPLETE',
        status: 'client_approved',
        lastVerificationUpdate: '14 August 2026',
        physicalVerificationStatus: 'completed',
        physicalQuantityChecked: true,
        physicalDimensionsChecked: true,
        physicalConditionChecked: true,
        supplierBatchRecorded: true,
        physicalSampleInspected: true,
        verifiedBy: 'Rameshwar Suthar (Master Craftsman)',
        verifiedDate: '14 August 2026',
        certificateAvailable: true,
        certificateName: 'FSC Certificate',
        certificateNumber: 'FSC-C012345',
        certificateAuthority: 'Forest Stewardship Council',
        certificateIssueDate: '14 August 2026',
        certificateStatus: 'Certificate Submitted',
        sampleStatus: 'verified',
        sampleId: 'SAMPLE-99210',
        sampleTrackingNumber: 'BD-88291022',
        createdAt: now,
        updatedAt: now,
        verificationHistory: [
          { id: 'vh-1', stageNumber: 1, title: 'Material Purchased', date: '14 Aug 2026', description: '100 kg Seasoned Sagwan Teak sourced from Sahrangpur Pvt Wood', isCompleted: true },
          { id: 'vh-2', stageNumber: 2, title: 'Supplier Invoice Registered', date: '14 Aug 2026', description: 'Invoice INV-4521 recorded with GST & pricing documentation', isCompleted: true },
          { id: 'vh-3', stageNumber: 3, title: 'Supplier Batch ID Recorded', date: '14 Aug 2026', description: 'Original factory batch ID TV-0826-19 catalogued', isCompleted: true },
          { id: 'vh-4', stageNumber: 4, title: 'Material Evidence Uploaded', date: '14 Aug 2026', description: 'Plank photographs, macro grain close-ups, and angles uploaded', isCompleted: true },
          { id: 'vh-5', stageNumber: 5, title: 'Material Allocated to Project', date: '14 Aug 2026', description: '30 kg allocated to Project #KARAGIR-99210 (70 kg remaining)', isCompleted: true },
          { id: 'vh-6', stageNumber: 6, title: 'Physical Verification', date: '14 Aug 2026', description: 'Physical inspection completed: quantity, dimensions, condition checked', isCompleted: true },
          { id: 'vh-7', stageNumber: 7, title: 'Material Verified', date: '14 Aug 2026', description: 'Documentation and physical checks verified by Karagir Verification Team', isCompleted: true },
          { id: 'vh-8', stageNumber: 8, title: 'Customer Verification', date: 'Active Today', description: 'Customer retrieval and confirmation of traceability ledger', isCompleted: true }
        ]
      };
      
      const demoEvidence: EvidenceRecord[] = [
        {
          id: 'ev-1',
          orderId: demoOrderId,
          materialBatchId: demoBatchId,
          type: 'invoice',
          storagePath: 'https://images.unsplash.com/photo-1607593895521-36ba927546e4?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-invoice-4521',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'verified',
          createdBy: 'ART-102'
        },
        {
          id: 'ev-2',
          orderId: demoOrderId,
          materialBatchId: demoBatchId,
          type: 'raw_full',
          storagePath: 'https://images.unsplash.com/photo-1596484552834-6a58f85cb686?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-raw-full-teak',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'verified',
          createdBy: 'ART-102'
        },
        {
          id: 'ev-3',
          orderId: demoOrderId,
          materialBatchId: demoBatchId,
          type: 'grain_closeup',
          storagePath: 'https://images.unsplash.com/photo-1616781296515-5950d322b6f4?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-grain-macro',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'verified',
          createdBy: 'ART-102'
        },
        {
          id: 'ev-4',
          orderId: demoOrderId,
          materialBatchId: demoBatchId,
          type: 'angle_additional',
          storagePath: 'https://images.unsplash.com/photo-1620619864223-9f82d17c7d41?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-angle-side',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'verified',
          createdBy: 'ART-102'
        }
      ];

      const demoCert: CertificationRecord = {
        id: 'cert-1',
        materialBatchId: demoBatchId,
        type: 'FSC Certificate',
        certificateNumber: 'FSC-C012345',
        issuingAuthority: 'Forest Stewardship Council',
        issuerName: 'SCS Global Services',
        issuedAt: '2026-08-14',
        documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Official FSC timber accreditation submitted and documented.',
        verifiedAt: now
      };

      batches.push(demoBatch);
      setLocalData('karagir_material_batches', batches);
      
      const existingEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
      setLocalData('karagir_material_evidence', [...existingEvidence, ...demoEvidence]);

      const existingCerts = getLocalData<CertificationRecord>('karagir_certification_records');
      setLocalData('karagir_certification_records', [...existingCerts, demoCert]);
    }

    // 2. PENDING DEMO RECORD: KAR-MAT-2026-10482
    if (!batches.some(b => b.passportId === 'KAR-MAT-2026-10482')) {
      const pendingBatchId = 'demo-batch-pending';
      const pendingOrderId = 'KAR-PROJ-88190';
      const now = '2026-08-12T08:30:00.000Z';

      const pendingBatch: MaterialBatch = {
        id: pendingBatchId,
        orderId: pendingOrderId,
        passportId: 'KAR-MAT-2026-10482',
        materialType: 'Moradabad Bell Brass Ingots',
        category: 'Brass',
        grade: 'Standard Casting Grade',
        description: 'Pure bell brass ingots for traditional metal casting work.',
        supplierName: 'Pital Nagri Wholesale Metal',
        supplierLocation: 'Moradabad, Uttar Pradesh',
        supplierContact: '+91 98370 11200',
        supplierBatchId: 'BR-0826-04',
        invoiceNumber: 'INV-8832',
        purchaseDate: '2026-08-12',
        purchasedQuantity: 50,
        allocatedQuantity: 15,
        remainingQuantity: 35,
        quantityUnit: 'kg',
        artisanId: 'ART-104',
        artisanName: 'Manoj Kumar Kansari',
        projectId: '#KARAGIR-88190',
        projectName: 'Handcrafted Brass Urli Bowl',
        projectAllocations: [
          {
            id: 'alloc-2',
            projectId: '#KARAGIR-88190',
            projectName: 'Handcrafted Brass Urli Bowl',
            allocatedQuantity: 15,
            allocationDate: '12 August 2026'
          }
        ],
        verificationStatus: 'PENDING',
        traceabilityStatus: 'PENDING',
        status: 'pending_client_review',
        lastVerificationUpdate: '12 August 2026',
        physicalVerificationStatus: 'pending',
        physicalQuantityChecked: false,
        physicalDimensionsChecked: false,
        physicalConditionChecked: false,
        supplierBatchRecorded: true,
        certificateAvailable: false,
        sampleStatus: 'none',
        createdAt: now,
        updatedAt: now,
        verificationHistory: [
          { id: 'pvh-1', stageNumber: 1, title: 'Material Purchased', date: '12 Aug 2026', description: '50 kg Brass Ingots sourced from Pital Nagri Wholesale', isCompleted: true },
          { id: 'pvh-2', stageNumber: 2, title: 'Supplier Invoice Registered', date: '12 Aug 2026', description: 'Invoice INV-8832 recorded', isCompleted: true },
          { id: 'pvh-3', stageNumber: 3, title: 'Supplier Batch ID Recorded', date: '12 Aug 2026', description: 'Supplier Batch BR-0826-04 catalogued', isCompleted: true },
          { id: 'pvh-4', stageNumber: 4, title: 'Material Evidence Uploaded', date: '12 Aug 2026', description: 'Photographs submitted', isCompleted: true },
          { id: 'pvh-5', stageNumber: 5, title: 'Material Allocated to Project', date: '12 Aug 2026', description: '15 kg allocated (35 kg remaining)', isCompleted: true }
        ]
      };

      const pendingEvidence: EvidenceRecord[] = [
        {
          id: 'ev-pend-1',
          orderId: pendingOrderId,
          materialBatchId: pendingBatchId,
          type: 'invoice',
          storagePath: 'https://images.unsplash.com/photo-1607593895521-36ba927546e4?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-invoice-8832',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'uploaded',
          createdBy: 'ART-104'
        },
        {
          id: 'ev-pend-2',
          orderId: pendingOrderId,
          materialBatchId: pendingBatchId,
          type: 'raw_full',
          storagePath: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
          fileHash: 'mock-hash-brass-ingots',
          capturedAt: now,
          uploadedAt: now,
          verificationStatus: 'uploaded',
          createdBy: 'ART-104'
        }
      ];

      batches.push(pendingBatch);
      setLocalData('karagir_material_batches', batches);

      const existingEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
      setLocalData('karagir_material_evidence', [...existingEvidence, ...pendingEvidence]);
    }

    // 3. REJECTED DEMO RECORD: KAR-MAT-2026-30219
    if (!batches.some(b => b.passportId === 'KAR-MAT-2026-30219')) {
      const rejectedBatchId = 'demo-batch-rejected';
      const rejectedOrderId = 'KAR-PROJ-77112';
      const now = '2026-08-10T14:15:00.000Z';

      const rejectedBatch: MaterialBatch = {
        id: rejectedBatchId,
        orderId: rejectedOrderId,
        passportId: 'KAR-MAT-2026-30219',
        materialType: 'Reclaimed Rosewood Planks',
        category: 'Wood',
        grade: 'B',
        description: 'Reclaimed seasoned rosewood planks with irregular moisture content.',
        supplierName: 'Deccan Timber Traders',
        supplierLocation: 'Pune, Maharashtra',
        supplierBatchId: 'RW-0826-91',
        invoiceNumber: 'INV-1109',
        purchaseDate: '2026-08-10',
        purchasedQuantity: 80,
        allocatedQuantity: 25,
        remainingQuantity: 55,
        quantityUnit: 'kg',
        artisanId: 'ART-102',
        artisanName: 'Rameshwar Suthar',
        projectId: '#KARAGIR-77112',
        projectName: 'Carved Mandir Woodwork',
        verificationStatus: 'REJECTED',
        traceabilityStatus: 'REJECTED',
        status: 'rejected',
        lastVerificationUpdate: '10 August 2026',
        physicalVerificationStatus: 'rejected',
        physicalQuantityChecked: true,
        physicalDimensionsChecked: false,
        physicalConditionChecked: false,
        supplierBatchRecorded: false,
        certificateAvailable: false,
        sampleStatus: 'none',
        createdAt: now,
        updatedAt: now,
        verificationHistory: [
          { id: 'rvh-1', stageNumber: 1, title: 'Material Purchased', date: '10 Aug 2026', description: '80 kg Rosewood sourced', isCompleted: true },
          { id: 'rvh-2', stageNumber: 2, title: 'Supplier Invoice Registered', date: '10 Aug 2026', description: 'Invoice INV-1109 recorded', isCompleted: true },
          { id: 'rvh-3', stageNumber: 3, title: 'Physical Verification Failed', date: '10 Aug 2026', description: 'Material condition checks failed: wood moisture exceeds acceptable tolerances', isCompleted: false },
          { id: 'rvh-4', stageNumber: 4, title: 'Material Verification Rejected', date: '10 Aug 2026', description: 'Rejected during inspection. Resubmission requested.', isCompleted: false }
        ]
      };

      batches.push(rejectedBatch);
      setLocalData('karagir_material_batches', batches);
    }

    // 4. ADDITIONAL REGISTRY SEED LOTS (To provide realistic summary counts: 12 registered materials, 7 allocated, 340 kg remaining)
    const extraLots = [
      { id: 'extra-1', passportId: 'KAR-MAT-2026-11942', materialType: 'Jaipur White Makrana Marble Slab', category: 'Stone', grade: 'Premium Grade-A', supplierName: 'Makrana Heritage Stones', supplierLocation: 'Nagaur, Rajasthan', supplierBatchId: 'ST-0826-01', invoiceNumber: 'INV-3091', purchaseDate: '2026-08-01', purchasedQuantity: 60, allocatedQuantity: 20, remainingQuantity: 40, quantityUnit: 'sq.ft', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Carved Marble Console Table', projectId: '#KARAGIR-91021' },
      { id: 'extra-2', passportId: 'KAR-MAT-2026-22817', materialType: 'Natural Assam Cane & Bamboo Weave', category: 'Rattan & Cane', grade: 'Export Grade', supplierName: 'Brahmaputra Agro Craft', supplierLocation: 'Guwahati, Assam', supplierBatchId: 'CN-0826-09', invoiceNumber: 'INV-5529', purchaseDate: '2026-08-05', purchasedQuantity: 40, allocatedQuantity: 15, remainingQuantity: 25, quantityUnit: 'meter', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Mid-Century Woven Lounge Chair', projectId: '#KARAGIR-84192' },
      { id: 'extra-3', passportId: 'KAR-MAT-2026-44190', materialType: 'Raw Full-Grain Vegetable Tanned Leather', category: 'Leather', grade: 'Grade-A Heavy', supplierName: 'Dharavi Artisans Guild', supplierLocation: 'Mumbai, Maharashtra', supplierBatchId: 'LT-0826-33', invoiceNumber: 'INV-7741', purchaseDate: '2026-08-07', purchasedQuantity: 50, allocatedQuantity: 10, remainingQuantity: 40, quantityUnit: 'sq.ft', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Hand-Stitched Leather Armchair', projectId: '#KARAGIR-79014' },
      { id: 'extra-4', passportId: 'KAR-MAT-2026-55319', materialType: 'Khurja High-Fire Terracotta Clay', category: 'Clay', grade: 'Stoneware Grade', supplierName: 'Ganga Clay Works', supplierLocation: 'Khurja, Uttar Pradesh', supplierBatchId: 'CL-0826-12', invoiceNumber: 'INV-2041', purchaseDate: '2026-08-09', purchasedQuantity: 100, allocatedQuantity: 30, remainingQuantity: 70, quantityUnit: 'kg', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Ceramic Tabletop Centerpiece', projectId: '#KARAGIR-66201' },
      { id: 'extra-5', passportId: 'KAR-MAT-2026-66802', materialType: 'Organic Ahimsa Silk Fabric', category: 'Textile', grade: 'Handloom Grade', supplierName: 'Bhagalpur Silk Co-op', supplierLocation: 'Bhagalpur, Bihar', supplierBatchId: 'TX-0826-45', invoiceNumber: 'INV-8812', purchaseDate: '2026-08-11', purchasedQuantity: 30, allocatedQuantity: 0, remainingQuantity: 30, quantityUnit: 'meter', status: 'ready_for_review' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const },
      { id: 'extra-6', passportId: 'KAR-MAT-2026-77314', materialType: 'Solid Cast Iron Hardware Set', category: 'Metal', grade: 'Antique Rust-Proof', supplierName: 'Aligarh Hardware Forge', supplierLocation: 'Aligarh, Uttar Pradesh', supplierBatchId: 'HW-0826-88', invoiceNumber: 'INV-9902', purchaseDate: '2026-08-13', purchasedQuantity: 40, allocatedQuantity: 0, remainingQuantity: 40, quantityUnit: 'piece', status: 'ready_for_review' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const },
      { id: 'extra-7', passportId: 'KAR-MAT-2026-88401', materialType: 'Pure Sheesham Wood Planks', category: 'Wood', grade: 'Grade-A', supplierName: 'Jodhpur Timber Depot', supplierLocation: 'Jodhpur, Rajasthan', supplierBatchId: 'SH-0826-22', invoiceNumber: 'INV-6014', purchaseDate: '2026-08-03', purchasedQuantity: 80, allocatedQuantity: 40, remainingQuantity: 40, quantityUnit: 'kg', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Royal Jodhpur Bedframe', projectId: '#KARAGIR-55219' },
      { id: 'extra-8', passportId: 'KAR-MAT-2026-99015', materialType: 'Hand-Forged Copper Plates', category: 'Metal', grade: '99.9% Pure', supplierName: 'Tambat Ali Copper Works', supplierLocation: 'Pune, Maharashtra', supplierBatchId: 'CU-0826-77', invoiceNumber: 'INV-4410', purchaseDate: '2026-08-06', purchasedQuantity: 25, allocatedQuantity: 15, remainingQuantity: 10, quantityUnit: 'kg', status: 'client_approved' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const, projectName: 'Hammered Copper Bath Tub', projectId: '#KARAGIR-44109' },
      { id: 'extra-9', passportId: 'KAR-MAT-2026-33918', materialType: 'Seasoned Rosewood Veneer', category: 'Wood', grade: 'Premium Decorative', supplierName: 'Nilgiri Timber Merchants', supplierLocation: 'Ooty, Tamil Nadu', supplierBatchId: 'VN-0826-04', invoiceNumber: 'INV-1299', purchaseDate: '2026-08-08', purchasedQuantity: 30, allocatedQuantity: 0, remainingQuantity: 30, quantityUnit: 'sq.ft', status: 'ready_for_review' as const, verificationStatus: 'VERIFIED' as const, traceabilityStatus: 'TRACEABILITY_COMPLETE' as const }
    ];

    extraLots.forEach(lot => {
      if (!batches.some(b => b.passportId === lot.passportId)) {
        const fullLot: MaterialBatch = {
          id: lot.id,
          orderId: lot.projectId || 'KAR-PROJ-GEN',
          passportId: lot.passportId,
          materialType: lot.materialType,
          category: lot.category,
          grade: lot.grade,
          description: `${lot.materialType} sourced for artisan production.`,
          supplierName: lot.supplierName,
          supplierLocation: lot.supplierLocation,
          supplierBatchId: lot.supplierBatchId,
          invoiceNumber: lot.invoiceNumber,
          purchaseDate: lot.purchaseDate,
          purchasedQuantity: lot.purchasedQuantity,
          allocatedQuantity: lot.allocatedQuantity,
          remainingQuantity: lot.remainingQuantity,
          quantityUnit: lot.quantityUnit,
          artisanId: 'ART-102',
          artisanName: 'Rameshwar Suthar',
          projectId: lot.projectId,
          projectName: lot.projectName,
          projectAllocations: lot.projectName ? [
            {
              id: `alloc-${lot.id}`,
              projectId: lot.projectId || '',
              projectName: lot.projectName,
              allocatedQuantity: lot.allocatedQuantity,
              allocationDate: lot.purchaseDate
            }
          ] : [],
          verificationStatus: lot.verificationStatus,
          traceabilityStatus: lot.traceabilityStatus,
          status: lot.status,
          lastVerificationUpdate: lot.purchaseDate,
          physicalVerificationStatus: 'completed',
          physicalQuantityChecked: true,
          physicalDimensionsChecked: true,
          physicalConditionChecked: true,
          supplierBatchRecorded: true,
          certificateAvailable: false,
          sampleStatus: 'none',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        batches.push(fullLot);
      }
    });

    setLocalData('karagir_material_batches', batches);
  } catch (e) {
    console.error('Failed to seed demo data', e);
  }
};

/**
 * Returns all registered material records.
 */
export const getAllMaterialRecords = async (): Promise<MaterialBatch[]> => {
  seedDemoData();
  return getLocalData<MaterialBatch>('karagir_material_batches');
};

/**
 * Allocates a quantity of registered material to an active project.
 */
export const allocateMaterialToProject = async (
  passportId: string,
  projectId: string,
  projectName: string,
  quantity: number,
  allocationDate: string = '14 August 2026'
): Promise<{ success: boolean; message: string; updatedBatch?: MaterialBatch }> => {
  seedDemoData();
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batchIndex = batches.findIndex(b => b.passportId?.toUpperCase() === passportId.trim().toUpperCase());
  
  if (batchIndex === -1) {
    return { success: false, message: 'Material ID not found.' };
  }

  const batch = batches[batchIndex];
  if (quantity <= 0) {
    return { success: false, message: 'Allocated quantity must be greater than 0.' };
  }

  if (quantity > batch.remainingQuantity) {
    return {
      success: false,
      message: `Insufficient remaining quantity. Maximum available: ${batch.remainingQuantity} ${batch.quantityUnit}`
    };
  }

  batch.allocatedQuantity += quantity;
  batch.remainingQuantity = batch.purchasedQuantity - batch.allocatedQuantity;
  batch.projectId = projectId;
  batch.projectName = projectName;

  if (!batch.projectAllocations) {
    batch.projectAllocations = [];
  }

  batch.projectAllocations.push({
    id: crypto.randomUUID(),
    projectId,
    projectName,
    allocatedQuantity: quantity,
    allocationDate
  });

  batch.updatedAt = new Date().toISOString();
  batches[batchIndex] = batch;
  setLocalData('karagir_material_batches', batches);

  return { 
    success: true, 
    message: `Successfully allocated ${quantity} ${batch.quantityUnit} to project ${projectName}.`, 
    updatedBatch: batch 
  };
};

/**
 * Fetches the Material Passport for an order.
 * Tries Supabase first, falls back to LocalStorage.
 */
export const getMaterialPassport = async (orderId: string): Promise<MaterialPassport | null> => {
  seedDemoData();

  try {
    const { data: batchData, error: batchError } = await (supabase
      .from('material_batches') as any)
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (batchError) throw batchError;

    if (batchData) {
      const { data: evidenceData } = await (supabase
        .from('material_evidence') as any)
        .select('*')
        .eq('order_id', orderId);

      const { data: certData } = await (supabase
        .from('certification_records') as any)
        .select('*')
        .eq('material_batch_id', batchData.id);

      return {
        batch: {
          id: batchData.id,
          orderId: batchData.order_id,
          passportId: batchData.passport_id,
          materialType: batchData.material_type,
          species: batchData.species,
          category: batchData.category || 'Wood',
          grade: batchData.grade,
          description: batchData.description,
          supplierName: batchData.supplier_name,
          supplierLocation: batchData.supplier_location,
          supplierContact: batchData.supplier_contact,
          supplierGst: batchData.supplier_gst,
          supplierBatchId: batchData.supplier_batch_id,
          invoiceNumber: batchData.invoice_number,
          purchasedQuantity: Number(batchData.purchased_quantity || 0),
          allocatedQuantity: Number(batchData.allocated_quantity || 0),
          remainingQuantity: Number(batchData.remaining_quantity || 0),
          quantityUnit: batchData.quantity_unit || 'kg',
          purchaseDate: batchData.purchase_date,
          purchaseAmount: batchData.purchase_amount ? Number(batchData.purchase_amount) : undefined,
          status: batchData.status,
          verificationStatus: batchData.verification_status,
          traceabilityStatus: batchData.traceability_status || 'TRACEABILITY_COMPLETE',
          physicalVerificationStatus: batchData.physical_verification_status,
          sampleStatus: batchData.sample_status,
          sampleId: batchData.sample_id,
          sampleTrackingNumber: batchData.sample_tracking_number,
          createdAt: batchData.created_at,
          updatedAt: batchData.updated_at
        },
        evidence: (evidenceData || []).map((e: any) => ({
          id: e.id,
          orderId: e.order_id,
          materialBatchId: e.material_batch_id,
          type: e.type,
          storagePath: e.storage_path,
          fileHash: e.file_hash,
          capturedAt: e.captured_at,
          uploadedAt: e.uploaded_at,
          verificationStatus: e.verification_status,
          createdBy: e.created_by
        })),
        certifications: (certData || []).map((c: any) => ({
          id: c.id,
          materialBatchId: c.material_batch_id,
          type: c.type,
          certificateNumber: c.certificate_number,
          issuingAuthority: c.issuing_authority,
          issuerName: c.issuer_name,
          issuedAt: c.issued_at,
          expiresAt: c.expires_at,
          documentUrl: c.document_url,
          verificationStatus: c.verification_status,
          verificationNotes: c.verification_notes,
          verifiedAt: c.verified_at
        }))
      };
    }
  } catch (e) {
    // console.warn('Supabase passport lookup failed, fallback to local:', e);
  }

  // Fallback to local storage
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batch = batches.find(b => b.orderId === orderId);
  if (!batch) return null;

  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const evidence = allEvidence.filter(e => e.materialBatchId === batch.id || e.orderId === orderId);

  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  const certifications = allCerts.filter(c => c.materialBatchId === batch.id);

  return { batch, evidence, certifications };
};

/**
 * Public Material Passport Lookup by Material Verification ID (e.g. KAR-MAT-2026-97373)
 */
export const getPublicMaterialPassport = async (passportId: string): Promise<MaterialPassport | null> => {
  seedDemoData();
  const normalizedId = passportId.trim().toUpperCase();

  try {
    const { data: batchData, error: batchError } = await (supabase
      .from('material_batches') as any)
      .select('*')
      .ilike('passport_id', normalizedId)
      .maybeSingle();

    if (batchError) throw batchError;

    if (batchData) {
      const { data: evidenceData } = await (supabase
        .from('material_evidence') as any)
        .select('*')
        .eq('material_batch_id', batchData.id);

      const { data: certData } = await (supabase
        .from('certification_records') as any)
        .select('*')
        .eq('material_batch_id', batchData.id);

      return {
        batch: {
          id: batchData.id,
          orderId: batchData.order_id,
          passportId: batchData.passport_id,
          materialType: batchData.material_type,
          species: batchData.species,
          category: batchData.category || 'Wood',
          grade: batchData.grade,
          description: batchData.description,
          supplierName: batchData.supplier_name,
          supplierLocation: batchData.supplier_location,
          supplierContact: batchData.supplier_contact,
          supplierGst: batchData.supplier_gst,
          supplierBatchId: batchData.supplier_batch_id,
          invoiceNumber: batchData.invoice_number,
          purchasedQuantity: Number(batchData.purchased_quantity || 0),
          allocatedQuantity: Number(batchData.allocated_quantity || 0),
          remainingQuantity: Number(batchData.remaining_quantity || 0),
          quantityUnit: batchData.quantity_unit || 'kg',
          purchaseDate: batchData.purchase_date,
          purchaseAmount: batchData.purchase_amount ? Number(batchData.purchase_amount) : undefined,
          status: batchData.status,
          verificationStatus: batchData.verification_status,
          traceabilityStatus: batchData.traceability_status || 'TRACEABILITY_COMPLETE',
          physicalVerificationStatus: batchData.physical_verification_status,
          sampleStatus: batchData.sample_status,
          sampleId: batchData.sample_id,
          sampleTrackingNumber: batchData.sample_tracking_number,
          createdAt: batchData.created_at,
          updatedAt: batchData.updated_at
        },
        evidence: (evidenceData || []).map((e: any) => ({
          id: e.id,
          orderId: e.order_id,
          materialBatchId: e.material_batch_id,
          type: e.type,
          storagePath: e.storage_path,
          fileHash: e.file_hash,
          capturedAt: e.captured_at,
          uploadedAt: e.uploaded_at,
          verificationStatus: e.verification_status,
          createdBy: e.created_by
        })),
        certifications: (certData || []).map((c: any) => ({
          id: c.id,
          materialBatchId: c.material_batch_id,
          type: c.type,
          certificateNumber: c.certificate_number,
          issuingAuthority: c.issuing_authority,
          issuerName: c.issuer_name,
          issuedAt: c.issued_at,
          expiresAt: c.expires_at,
          documentUrl: c.document_url,
          verificationStatus: c.verification_status,
          verificationNotes: c.verification_notes,
          verifiedAt: c.verified_at
        }))
      };
    }
  } catch (e) {
    // console.warn('Supabase public passport lookup failed, fallback to local:', e);
  }

  // Fallback to local storage
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batch = batches.find(b => b.passportId?.trim().toUpperCase() === normalizedId);
  if (!batch) return null;

  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const evidence = allEvidence.filter(e => e.materialBatchId === batch.id || e.orderId === batch.orderId);

  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  const certifications = allCerts.filter(c => c.materialBatchId === batch.id);

  return { batch, evidence, certifications };
};

/**
 * Creates a new Material Batch record with uniqueness & over-allocation validation.
 */
export const createMaterialBatch = async (
  batchInput: Omit<MaterialBatch, 'id' | 'createdAt' | 'updatedAt' | 'passportId' | 'remainingQuantity'> & { 
    passportId?: string;
    remainingQuantity?: number;
  }
): Promise<MaterialBatch | null> => {
  seedDemoData();
  const newId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  // Validate allocation
  const valResult = validateQuantityAllocation(
    batchInput.purchasedQuantity, 
    batchInput.allocatedQuantity
  );
  if (!valResult.isValid) {
    throw new Error(valResult.message || 'Invalid quantity allocation.');
  }

  // Check duplicate supplier batch
  const dupCheck = await checkDuplicateBatchRecord(
    batchInput.supplierName,
    batchInput.supplierBatchId,
    batchInput.invoiceNumber
  );
  if (dupCheck.isDuplicate) {
    console.warn('Possible duplicate material batch detected:', dupCheck.existingRecord);
  }

  // Generate unique Material ID
  const passportId = batchInput.passportId || generateMaterialId(new Date().getFullYear());
  const remainingQuantity = batchInput.purchasedQuantity - batchInput.allocatedQuantity;

  const newBatch: MaterialBatch = {
    ...batchInput,
    id: newId,
    passportId,
    remainingQuantity,
    verificationStatus: batchInput.verificationStatus || 'VERIFIED',
    traceabilityStatus: batchInput.traceabilityStatus || 'TRACEABILITY_COMPLETE',
    physicalVerificationStatus: batchInput.physicalVerificationStatus || 'completed',
    physicalQuantityChecked: batchInput.physicalQuantityChecked ?? true,
    physicalDimensionsChecked: batchInput.physicalDimensionsChecked ?? true,
    physicalConditionChecked: batchInput.physicalConditionChecked ?? true,
    supplierBatchRecorded: batchInput.supplierBatchRecorded ?? true,
    physicalSampleInspected: batchInput.physicalSampleInspected ?? true,
    verifiedBy: batchInput.verifiedBy || 'Artisan Workshop Recorded',
    verifiedDate: batchInput.verifiedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    projectAllocations: batchInput.projectName ? [
      {
        id: crypto.randomUUID(),
        projectId: batchInput.projectId || 'KAR-PROJ-GEN',
        projectName: batchInput.projectName,
        allocatedQuantity: batchInput.allocatedQuantity,
        allocationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      }
    ] : [],
    createdAt: now,
    updatedAt: now,
    verificationHistory: [
      { id: crypto.randomUUID(), stageNumber: 1, title: 'Material Registered', date: 'Just now', description: `Registered ${batchInput.purchasedQuantity} ${batchInput.quantityUnit} from ${batchInput.supplierName}`, isCompleted: true },
      { id: crypto.randomUUID(), stageNumber: 2, title: 'Supplier Batch Logged', date: 'Just now', description: `Supplier Batch ${batchInput.supplierBatchId} recorded`, isCompleted: true },
      { id: crypto.randomUUID(), stageNumber: 3, title: 'Material ID Issued', date: 'Just now', description: `Kaaragir Material ID ${passportId} generated`, isCompleted: true }
    ]
  };

  try {
    const { data, error } = await (supabase
      .from('material_batches') as any)
      .insert({
        id: newBatch.id,
        order_id: newBatch.orderId,
        passport_id: newBatch.passportId,
        material_type: newBatch.materialType,
        species: newBatch.species,
        category: newBatch.category,
        grade: newBatch.grade,
        description: newBatch.description,
        supplier_name: newBatch.supplierName,
        supplier_location: newBatch.supplierLocation,
        supplier_contact: newBatch.supplierContact,
        supplier_gst: newBatch.supplierGst,
        supplier_batch_id: newBatch.supplierBatchId,
        invoice_number: newBatch.invoiceNumber,
        purchased_quantity: newBatch.purchasedQuantity,
        allocated_quantity: newBatch.allocatedQuantity,
        remaining_quantity: newBatch.remainingQuantity,
        quantity_unit: newBatch.quantityUnit,
        purchase_date: newBatch.purchaseDate,
        purchase_amount: newBatch.purchaseAmount,
        status: newBatch.status,
        verification_status: newBatch.verificationStatus,
        traceability_status: newBatch.traceabilityStatus,
        physical_verification_status: newBatch.physicalVerificationStatus,
        sample_status: newBatch.sampleStatus,
        created_at: newBatch.createdAt,
        updated_at: newBatch.updatedAt
      })
      .select()
      .single();

    if (error) throw error;
    if (data) return newBatch;
  } catch (e) {
    // console.warn('Supabase insert failed, caching locally:', e);
  }

  // Cache locally
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  batches.unshift(newBatch);
  setLocalData('karagir_material_batches', batches);

  return newBatch;
};

/**
 * Uploads evidence file with client-side SHA-256 computation.
 */
export const uploadEvidenceFile = async (
  file: File,
  orderId: string,
  materialBatchId: string,
  type: EvidenceType,
  createdBy: string
): Promise<EvidenceRecord | null> => {
  const fileHash = await computeFileHash(file);
  const now = new Date().toISOString();
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}/${type}_${Date.now()}.${fileExt}`;

  let publicUrl = '';
  try {
    const uploadedPath = await uploadImage(BUCKET_NAME, fileName, file);
    if (uploadedPath) {
      publicUrl = getImageUrl(BUCKET_NAME, uploadedPath);
    }
  } catch (err) {
    console.error('Storage upload failed, using data URL fallback', err);
  }

  if (!publicUrl) {
    publicUrl = URL.createObjectURL(file);
  }

  const newEvidence: EvidenceRecord = {
    id: crypto.randomUUID(),
    orderId,
    materialBatchId,
    type,
    storagePath: publicUrl,
    fileHash,
    capturedAt: now,
    uploadedAt: now,
    verificationStatus: 'verified',
    createdBy
  };

  try {
    const { error } = await (supabase
      .from('material_evidence') as any)
      .insert({
        id: newEvidence.id,
        order_id: newEvidence.orderId,
        material_batch_id: newEvidence.materialBatchId,
        type: newEvidence.type,
        storage_path: newEvidence.storagePath,
        file_hash: newEvidence.fileHash,
        captured_at: newEvidence.capturedAt,
        uploaded_at: newEvidence.uploadedAt,
        verification_status: newEvidence.verificationStatus,
        created_by: newEvidence.createdBy
      });
    if (error) throw error;
  } catch (e) {
    // ignore
  }

  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  allEvidence.push(newEvidence);
  setLocalData('karagir_material_evidence', allEvidence);

  return newEvidence;
};

/**
 * Adds an official certification record.
 */
export const addCertification = async (
  materialBatchId: string,
  type: string,
  certificateNumber: string,
  issuingAuthority: string,
  issuerName: string,
  issuedAt: string,
  file?: File,
  expiresAt?: string
): Promise<CertificationRecord | null> => {
  let docUrl = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop';
  
  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `certs/${materialBatchId}_${Date.now()}.${fileExt}`;
    try {
      const path = await uploadImage(BUCKET_NAME, fileName, file);
      if (path) docUrl = getImageUrl(BUCKET_NAME, path);
    } catch {
      docUrl = URL.createObjectURL(file);
    }
  }

  const newCert: CertificationRecord = {
    id: crypto.randomUUID(),
    materialBatchId,
    type,
    certificateNumber,
    issuingAuthority,
    issuerName,
    issuedAt,
    expiresAt,
    documentUrl: docUrl,
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Certificate record submitted and catalogued with material batch.',
    verifiedAt: new Date().toISOString()
  };

  try {
    const { error } = await (supabase
      .from('certification_records') as any)
      .insert({
        id: newCert.id,
        material_batch_id: newCert.materialBatchId,
        type: newCert.type,
        certificate_number: newCert.certificateNumber,
        issuing_authority: newCert.issuingAuthority,
        issuer_name: newCert.issuerName,
        issued_at: newCert.issuedAt,
        expires_at: newCert.expiresAt,
        document_url: newCert.documentUrl,
        verification_status: newCert.verificationStatus,
        verification_notes: newCert.verificationNotes,
        verified_at: newCert.verifiedAt
      });
    if (error) throw error;
  } catch (e) {
    // ignore
  }

  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  allCerts.push(newCert);
  setLocalData('karagir_certification_records', allCerts);

  return newCert;
};

/**
 * Checks if a file hash is already registered in another order.
 */
export const checkDuplicateEvidence = async (fileHash: string, currentOrderId: string) => {
  seedDemoData();
  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const duplicate = allEvidence.find(e => e.fileHash === fileHash && e.orderId !== currentOrderId);
  if (duplicate) {
    return {
      isDuplicate: true,
      orderId: duplicate.orderId,
      evidenceId: duplicate.id
    };
  }
  return { isDuplicate: false };
};

/**
 * Admin Queue Fetcher
 */
export const getAdminVerificationQueue = async (): Promise<MaterialPassport[]> => {
  seedDemoData();
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');

  return batches.map(batch => ({
    batch,
    evidence: allEvidence.filter(e => e.materialBatchId === batch.id || e.orderId === batch.orderId),
    certifications: allCerts.filter(c => c.materialBatchId === batch.id)
  }));
};

/**
 * Updates batch verification and physical inspection checklist status.
 */
export const updateMaterialVerification = async (
  batchId: string,
  verificationStatus: VerificationStatus,
  physicalStatus: PhysicalVerificationStatus,
  physicalChecks: {
    quantityChecked: boolean;
    dimensionsChecked: boolean;
    conditionChecked: boolean;
    supplierBatchRecorded: boolean;
  }
) => {
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batchIndex = batches.findIndex(b => b.id === batchId);
  if (batchIndex !== -1) {
    batches[batchIndex].verificationStatus = verificationStatus;
    batches[batchIndex].traceabilityStatus = verificationStatus === 'VERIFIED' ? 'TRACEABILITY_COMPLETE' : 'REJECTED';
    batches[batchIndex].physicalVerificationStatus = physicalStatus;
    batches[batchIndex].physicalQuantityChecked = physicalChecks.quantityChecked;
    batches[batchIndex].physicalDimensionsChecked = physicalChecks.dimensionsChecked;
    batches[batchIndex].physicalConditionChecked = physicalChecks.conditionChecked;
    batches[batchIndex].supplierBatchRecorded = physicalChecks.supplierBatchRecorded;
    batches[batchIndex].status = verificationStatus === 'VERIFIED' ? 'client_approved' : verificationStatus === 'REJECTED' ? 'rejected' : 'pending_client_review';
    batches[batchIndex].lastVerificationUpdate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setLocalData('karagir_material_batches', batches);
    return batches[batchIndex];
  }
  return null;
};

/**
 * Compatibility alias for updating a material batch.
 */
export const updateMaterialBatch = async (
  batchId: string,
  updates: Partial<MaterialBatch>
): Promise<MaterialBatch | null> => {
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batchIndex = batches.findIndex(b => b.id === batchId);
  if (batchIndex !== -1) {
    batches[batchIndex] = { ...batches[batchIndex], ...updates, updatedAt: new Date().toISOString() };
    setLocalData('karagir_material_batches', batches);
    return batches[batchIndex];
  }
  return null;
};

/**
 * Compatibility alias for adding certification records.
 */
export const addCertificationRecord = async (
  materialBatchId: string,
  type: string,
  certificateNumber: string,
  issuingAuthority: string,
  issuerName: string,
  issuedAt: string,
  file?: File,
  expiresAt?: string
): Promise<CertificationRecord | null> => {
  return addCertification(
    materialBatchId,
    type,
    certificateNumber,
    issuingAuthority,
    issuerName,
    issuedAt,
    file,
    expiresAt
  );
};

/**
 * Compatibility alias for updating certification status.
 */
export const updateCertificationRecord = async (
  certId: string,
  status: any,
  notes?: string
): Promise<boolean> => {
  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  const certIdx = allCerts.findIndex(c => c.id === certId);
  if (certIdx !== -1) {
    allCerts[certIdx].verificationStatus = status;
    if (notes) allCerts[certIdx].verificationNotes = notes;
    allCerts[certIdx].verifiedAt = new Date().toISOString();
    setLocalData('karagir_certification_records', allCerts);
    return true;
  }
  return false;
};

/**
 * Compatibility alias for checking duplicate supplier batch ID.
 */
export const checkDuplicateSupplierBatch = async (
  supplierBatchId: string
): Promise<{ isDuplicate: boolean; orderId?: string }> => {
  seedDemoData();
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const duplicate = batches.find(b => b.supplierBatchId?.toLowerCase() === supplierBatchId.toLowerCase());
  if (duplicate) {
    return {
      isDuplicate: true,
      orderId: duplicate.orderId
    };
  }
  return { isDuplicate: false };
};
