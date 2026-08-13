export type MaterialBatchStatus =
  | 'pending_client_review'
  | 'sample_pending'
  | 'ready_for_review'
  | 'client_approved'
  | 'client_requested_more_evidence'
  | 'rejected';

export type SampleStatus = 'none' | 'required' | 'prepared' | 'shipped' | 'received' | 'verified';

export interface MaterialBatch {
  id: string;
  orderId: string;
  passportId: string;
  materialType: string;
  species: string;
  grade: string;
  supplierName: string;
  purchaseDate: string;
  status: MaterialBatchStatus;
  sampleId?: string;
  sampleStatus: SampleStatus;
  sampleTrackingNumber?: string;
  sampleShippedAt?: string;
  sampleReceivedAt?: string;
  sampleVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType =
  | 'invoice'
  | 'receipt'
  | 'cert_doc'
  | 'supplier_info'
  | 'raw_full'
  | 'grain_closeup'
  | 'angle_additional'
  | 'video'
  | 'process_cut'
  | 'process_join'
  | 'process_assem'
  | 'process_finish'
  | 'final_furniture';

export type EvidenceVerificationStatus = 'uploaded' | 'approved' | 'rejected';

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
