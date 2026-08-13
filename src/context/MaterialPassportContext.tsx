import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  MaterialPassport, 
  MaterialBatch, 
  EvidenceRecord, 
  CertificationRecord, 
  EvidenceType,
  MaterialBatchStatus,
  SampleStatus,
  CertificationVerificationStatus
} from '../types/materialPassport';
import * as service from '../services/materialPassportService';
import { useKaragirStore } from './KaragirStoreContext';
import { useEscrow } from './EscrowContext';
import { computeFileHash } from '../utils/hash';

interface MaterialPassportContextType {
  passport: MaterialPassport | null;
  isLoading: boolean;
  adminQueue: MaterialPassport[];
  loadPassport: (orderId: string) => Promise<MaterialPassport | null>;
  createNewBatch: (
    orderId: string,
    materialType: string,
    species: string,
    grade: string,
    supplierName: string,
    purchaseDate: string
  ) => Promise<MaterialBatch | null>;
  updateBatchStatus: (status: MaterialBatchStatus) => Promise<MaterialBatch | null>;
  uploadEvidence: (
    file: File, 
    type: EvidenceType, 
    replacedEvidenceId?: string
  ) => Promise<EvidenceRecord | null>;
  addCert: (
    type: string,
    certificateNumber: string,
    issuingAuthority: string,
    issuerName: string,
    issuedAt: string,
    expiresAt?: string,
    documentUrl?: string
  ) => Promise<CertificationRecord | null>;
  updateCertStatus: (
    certId: string, 
    status: CertificationVerificationStatus, 
    notes?: string
  ) => Promise<CertificationRecord | null>;
  updateSampleShipping: (
    sampleId: string, 
    trackingNumber: string
  ) => Promise<MaterialBatch | null>;
  updateSampleStatus: (
    sampleStatus: SampleStatus
  ) => Promise<MaterialBatch | null>;
  checkDuplicate: (file: File) => Promise<{ isDuplicate: boolean; orderId?: string; filename?: string }>;
  loadAdminQueue: () => Promise<void>;
  resetPassport: () => void;
}

const MaterialPassportContext = createContext<MaterialPassportContextType | undefined>(undefined);

export const MaterialPassportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passport, setPassport] = useState<MaterialPassport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminQueue, setAdminQueue] = useState<MaterialPassport[]>([]);
  
  const { storeData } = useKaragirStore();
  const { order } = useEscrow();

  // Helper to get active user ID
  const getUserId = () => {
    return storeData?.id || 'mock-user-id';
  };

  const loadPassport = async (orderId: string): Promise<MaterialPassport | null> => {
    setIsLoading(true);
    try {
      const data = await service.getMaterialPassport(orderId);
      setPassport(data);
      return data;
    } catch (e) {
      console.error('Failed to load material passport', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewBatch = async (
    orderId: string,
    materialType: string,
    species: string,
    grade: string,
    supplierName: string,
    purchaseDate: string
  ): Promise<MaterialBatch | null> => {
    setIsLoading(true);
    try {
      const passportId = `MP-${Math.floor(10000 + Math.random() * 90000)}`;
      const batch = await service.createMaterialBatch({
        orderId,
        passportId,
        materialType,
        species,
        grade,
        supplierName,
        purchaseDate,
        status: 'pending_client_review',
        sampleStatus: 'none'
      });
      
      if (batch) {
        setPassport({
          batch,
          evidence: [],
          certifications: []
        });
      }
      return batch;
    } catch (e) {
      console.error('Failed to create material batch', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBatchStatus = async (status: MaterialBatchStatus): Promise<MaterialBatch | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const updatedBatch = await service.updateMaterialBatch(passport.batch.id, { status });
      if (updatedBatch) {
        setPassport(prev => prev ? { ...prev, batch: updatedBatch } : null);
      }
      return updatedBatch;
    } catch (e) {
      console.error('Failed to update material batch status', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadEvidence = async (
    file: File,
    type: EvidenceType,
    replacedEvidenceId?: string
  ): Promise<EvidenceRecord | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const record = await service.uploadEvidenceFile(
        passport.batch.orderId,
        passport.batch.id,
        file,
        type,
        getUserId(),
        replacedEvidenceId
      );
      if (record) {
        setPassport(prev => {
          if (!prev) return null;
          // Filter out the old replaced evidence from visual list if applicable, or keep it for audit log
          let updatedEvidence = [...prev.evidence];
          if (replacedEvidenceId) {
            updatedEvidence = updatedEvidence.map(e => 
              e.id === replacedEvidenceId 
                ? { ...e, verificationStatus: 'rejected' } 
                : e
            );
          }
          return {
            ...prev,
            evidence: [...updatedEvidence, record]
          };
        });
      }
      return record;
    } catch (e) {
      console.error('Failed to upload evidence file', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addCert = async (
    type: string,
    certificateNumber: string,
    issuingAuthority: string,
    issuerName: string,
    issuedAt: string,
    expiresAt?: string,
    documentUrl?: string
  ): Promise<CertificationRecord | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const record = await service.addCertificationRecord({
        materialBatchId: passport.batch.id,
        type,
        certificateNumber,
        issuingAuthority,
        issuerName,
        issuedAt,
        expiresAt,
        documentUrl: documentUrl || 'https://example.com/mock-cert.pdf',
        verificationStatus: 'PENDING_REVIEW'
      });
      if (record) {
        setPassport(prev => prev ? { ...prev, certifications: [...prev.certifications, record] } : null);
      }
      return record;
    } catch (e) {
      console.error('Failed to add certificate', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCertStatus = async (
    certId: string,
    status: CertificationVerificationStatus,
    notes?: string
  ): Promise<CertificationRecord | null> => {
    setIsLoading(true);
    try {
      const updated = await service.updateCertificationRecord(certId, {
        verificationStatus: status,
        verificationNotes: notes,
        verifiedAt: new Date().toISOString()
      });
      if (updated && passport) {
        setPassport(prev => {
          if (!prev) return null;
          return {
            ...prev,
            certifications: prev.certifications.map(c => c.id === certId ? updated : c)
          };
        });
      }
      return updated;
    } catch (e) {
      console.error('Failed to update certification status', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSampleShipping = async (
    sampleId: string,
    trackingNumber: string
  ): Promise<MaterialBatch | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const updatedBatch = await service.updateMaterialBatch(passport.batch.id, {
        sampleId,
        sampleStatus: 'shipped',
        sampleTrackingNumber: trackingNumber,
        sampleShippedAt: new Date().toISOString(),
        status: 'sample_pending'
      });
      if (updatedBatch) {
        setPassport(prev => prev ? { ...prev, batch: updatedBatch } : null);
      }
      return updatedBatch;
    } catch (e) {
      console.error('Failed to update sample shipping information', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSampleStatus = async (
    sampleStatus: SampleStatus
  ): Promise<MaterialBatch | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const updates: Partial<MaterialBatch> = { sampleStatus };
      const now = new Date().toISOString();
      if (sampleStatus === 'received') {
        updates.sampleReceivedAt = now;
        updates.status = 'ready_for_review';
      } else if (sampleStatus === 'verified') {
        updates.sampleVerifiedAt = now;
        updates.status = 'client_approved';
      }
      
      const updatedBatch = await service.updateMaterialBatch(passport.batch.id, updates);
      if (updatedBatch) {
        setPassport(prev => prev ? { ...prev, batch: updatedBatch } : null);
      }
      return updatedBatch;
    } catch (e) {
      console.error('Failed to update sample status', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkDuplicate = async (file: File) => {
    if (!passport?.batch) return { isDuplicate: false };
    const hash = await computeFileHash(file);
    const result = await service.checkDuplicateEvidence(hash, passport.batch.orderId);
    return result || { isDuplicate: false };
  };

  const loadAdminQueue = async () => {
    setIsLoading(true);
    try {
      const queue = await service.getAdminVerificationQueue();
      setAdminQueue(queue);
    } catch (e) {
      console.error('Failed to load admin queue', e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassport = () => {
    setPassport(null);
  };

  // Automatically load passport if order is loaded and exists
  useEffect(() => {
    if (order?.orderId) {
      loadPassport(order.orderId);
    } else {
      resetPassport();
    }
  }, [order?.orderId]);

  return (
    <MaterialPassportContext.Provider value={{
      passport,
      isLoading,
      adminQueue,
      loadPassport,
      createNewBatch,
      updateBatchStatus,
      uploadEvidence,
      addCert,
      updateCertStatus,
      updateSampleShipping,
      updateSampleStatus,
      checkDuplicate,
      loadAdminQueue,
      resetPassport
    }}>
      {children}
    </MaterialPassportContext.Provider>
  );
};

export const useMaterialPassport = () => {
  const context = useContext(MaterialPassportContext);
  if (context === undefined) {
    throw new Error('useMaterialPassport must be used within a MaterialPassportProvider');
  }
  return context;
};
