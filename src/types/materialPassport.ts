export type MaterialBatchStatus =
  | 'pending_client_review'
  | 'sample_pending'
  | 'ready_for_review'
  | 'client_approved'
  | 'client_requested_more_evidence'
  | 'rejected';

export type SampleStatus = 'none' | 'required' | 'prepared' | 'shipped' | 'received' | 'verified';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';
export type TraceabilityStatus = 'TRACEABILITY_COMPLETE' | 'TRACEABILITY_PARTIAL' | 'PENDING' | 'REJECTED';
export type PhysicalVerificationStatus = 'completed' | 'pending' | 'rejected';

export interface ProjectAllocation {
  id?: string;
  projectId: string;
  projectName: string;
  allocatedQuantity: number;
  allocationDate: string;
}

export interface VerificationHistoryEvent {
  id: string;
  stageNumber: number;
  title: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface MaterialBatch {
  id: string;
  orderId: string;
  passportId: string; // KAR-MAT-YYYY-XXXXX
  materialType: string; // e.g. Seasoned Sagwan Teak
  species?: string; // e.g. Teak Wood
  category?: string; // Wood, Metal, Stone, Clay, Rattan & Cane, Textile, Other
  grade: string; // e.g. A
  description?: string; // Detailed material description
  
  // Supplier Information
  supplierName: string; // e.g. Sahrangpur Pvt Wood
  supplierLocation?: string; // e.g. Nashik, Maharashtra
  supplierContact?: string; // e.g. +91 98231 44520
  supplierGst?: string; // e.g. 27AABCS1429B1Z1
  supplierBatchId: string; // Original factory/supplier batch ID e.g. TV-0826-19
  
  // Sourcing & Invoice
  invoiceNumber: string; // e.g. INV-4521
  purchaseDate: string; // e.g. 2026-08-14
  purchasedQuantity: number;
  allocatedQuantity: number;
  remainingQuantity: number;
  quantityUnit: string; // kg, meter, sq.ft, piece, liter, other
  purchaseAmount?: number;
  
  // Artisan & Project References
  artisanId?: string;
  artisanName?: string;
  projectId?: string;
  projectName?: string;
  projectAllocations?: ProjectAllocation[];

  // Verification & Traceability Status
  verificationStatus?: VerificationStatus;
  traceabilityStatus?: TraceabilityStatus;
  status: MaterialBatchStatus;
  lastVerificationUpdate?: string;

  // Physical Inspection Details
  physicalVerificationStatus?: PhysicalVerificationStatus;
  physicalQuantityChecked?: boolean;
  physicalDimensionsChecked?: boolean;
  physicalConditionChecked?: boolean;
  supplierBatchRecorded?: boolean;
  physicalSampleInspected?: boolean;
  verifiedBy?: string; // e.g. Rameshwar Suthar / Lead Inspector
  verifiedDate?: string; // e.g. 14 August 2026

  // Optional Certificate Shortcut
  certificateAvailable?: boolean;
  certificateName?: string;
  certificateNumber?: string;
  certificateAuthority?: string;
  certificateIssueDate?: string;
  certificateExpiryDate?: string;
  certificateStatus?: string; // "Certificate Submitted" | "Certificate Record Added"

  // Physical Off-Cut Sample (Optional)
  sampleId?: string;
  sampleStatus: SampleStatus;
  sampleTrackingNumber?: string;
  sampleShippedAt?: string;
  sampleReceivedAt?: string;
  sampleVerifiedAt?: string;

  createdAt: string;
  updatedAt: string;
  verificationHistory?: VerificationHistoryEvent[];
}

export type EvidenceType =
  | 'invoice'
  | 'receipt'
  | 'cert_doc'
  | 'supplier_info'
  | 'raw_full'
  | 'grain_closeup'
  | 'angle_additional'
  | 'packaging_label'
  | 'video'
  | 'process_cut'
  | 'process_join'
  | 'process_assem'
  | 'process_finish'
  | 'final_furniture';

export type EvidenceVerificationStatus = 'uploaded' | 'approved' | 'rejected' | 'verified';

export interface EvidenceRecord {
  id: string;
  orderId: string;
  materialBatchId: string;
  type: EvidenceType;
  storagePath: string; // public URL or Supabase storage path
  fileHash: string;
  capturedAt?: string;
  uploadedAt: string;
  verificationStatus: EvidenceVerificationStatus;
  createdBy: string;
  replacedEvidenceId?: string;
}

export type CertificationVerificationStatus =
  | 'UPLOADED'
  | 'PENDING_REVIEW'
  | 'VERIFIED'
  | 'EXPIRED'
  | 'REJECTED';

export interface CertificationRecord {
  id: string;
  materialBatchId: string;
  type: string;
  certificateNumber: string;
  issuingAuthority: string;
  issuerName: string;
  issuedAt: string;
  expiresAt?: string;
  documentUrl: string;
  verificationStatus: CertificationVerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
}

export interface MaterialPassport {
  batch: MaterialBatch;
  evidence: EvidenceRecord[];
  certifications: CertificationRecord[];
}
