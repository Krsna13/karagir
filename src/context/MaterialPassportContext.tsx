import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  MaterialPassport, 
  MaterialBatch, 
  EvidenceRecord, 
  CertificationRecord, 
  EvidenceType,
  MaterialBatchStatus,
  SampleStatus,
  CertificationVerificationStatus,
  VerificationStatus,
  PhysicalVerificationStatus
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
    supplierBatchId: string,
    invoiceNumber: string,
    purchasedQuantity: number,
    allocatedQuantity: number,
    purchaseDate: string,
    extraOptions?: {
      category?: string;
      description?: string;
      supplierLocation?: string;
      artisanId?: string;
      artisanName?: string;
      projectId?: string;
      projectName?: string;
      customPassportId?: string;
    }
  ) => Promise<MaterialBatch | null>;
  updateBatchStatus: (status: MaterialBatchStatus) => Promise<MaterialBatch | null>;
  updateMaterialVerification: (
    batchId: string,
    verificationStatus: VerificationStatus,
    physicalStatus: PhysicalVerificationStatus,
    physicalChecks?: {
      quantityChecked?: boolean;
      dimensionsChecked?: boolean;
      conditionChecked?: boolean;
      supplierBatchRecorded?: boolean;
    }
  ) => Promise<MaterialBatch | null>;
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
  checkDuplicateSupplierBatch: (supplierBatchId: string) => Promise<{ isDuplicate: boolean; orderId?: string }>;
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
    return storeData?.id || 'ART-102';
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
    supplierBatchId: string,
    invoiceNumber: string,
    purchasedQuantity: number,
    allocatedQuantity: number,
    purchaseDate: string,
    extraOptions?: {
      category?: string;
      description?: string;
      supplierLocation?: string;
      artisanId?: string;
      artisanName?: string;
      projectId?: string;
      projectName?: string;
      customPassportId?: string;
    }
  ): Promise<MaterialBatch | null> => {
    setIsLoading(true);
    try {
      const passportId = extraOptions?.customPassportId || service.generateMaterialId();
      
      const batch = await service.createMaterialBatch({
        orderId,
        passportId,
        materialType,
        species,
        grade,
        category: extraOptions?.category || 'Wood',
        description: extraOptions?.description || `Seasoned ${materialType} purchased for custom furniture production.`,
        supplierName,
        supplierLocation: extraOptions?.supplierLocation || 'Nashik, Maharashtra',
        supplierBatchId,
        invoiceNumber,
        purchasedQuantity,
        allocatedQuantity,
        remainingQuantity: purchasedQuantity - allocatedQuantity,
        quantityUnit: 'kg',
        purchaseDate,
        artisanId: extraOptions?.artisanId || getUserId(),
        artisanName: extraOptions?.artisanName || storeData?.artisanName || 'Rameshwar Suthar',
        projectId: extraOptions?.projectId || orderId,
        projectName: extraOptions?.projectName || order?.productTitle || 'Custom Woodwork Request',
        status: 'pending_client_review',
        verificationStatus: 'PENDING',
        physicalVerificationStatus: 'pending',
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
      throw e;
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

  const updateMaterialVerification = async (
    batchId: string,
    verificationStatus: VerificationStatus,
    physicalStatus: PhysicalVerificationStatus,
    physicalChecks?: {
      quantityChecked?: boolean;
      dimensionsChecked?: boolean;
      conditionChecked?: boolean;
      supplierBatchRecorded?: boolean;
    }
  ): Promise<MaterialBatch | null> => {
    setIsLoading(true);
    try {
      const updatedBatch = await service.updateMaterialVerification(
        batchId,
        verificationStatus,
        physicalStatus,
        {
          quantityChecked: physicalChecks?.quantityChecked ?? true,
          dimensionsChecked: physicalChecks?.dimensionsChecked ?? true,
          conditionChecked: physicalChecks?.conditionChecked ?? true,
          supplierBatchRecorded: physicalChecks?.supplierBatchRecorded ?? true
        }
      );

      if (updatedBatch) {
        if (passport?.batch?.id === batchId) {
          setPassport(prev => prev ? { ...prev, batch: updatedBatch } : null);
        }
        setAdminQueue(prev => prev.map(p => p.batch.id === batchId ? { ...p, batch: updatedBatch } : p));
      }
      return updatedBatch;
    } catch (e) {
      console.error('Failed to update material verification status', e);
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
        file,
        passport.batch.orderId,
        passport.batch.id,
        type,
        getUserId()
      );
      if (record) {
        setPassport(prev => {
          if (!prev) return null;
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
    expiresAt?: string
  ): Promise<CertificationRecord | null> => {
    if (!passport?.batch) return null;
    setIsLoading(true);
    try {
      const record = await service.addCertificationRecord(
        passport.batch.id,
        type,
        certificateNumber,
        issuingAuthority,
        issuerName,
        issuedAt,
        undefined,
        expiresAt
      );
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
      await service.updateCertificationRecord(certId, status, notes);
      if (passport) {
        setPassport(prev => {
          if (!prev) return null;
          return {
            ...prev,
            certifications: prev.certifications.map(c => 
              c.id === certId ? { ...c, verificationStatus: status, verificationNotes: notes } : c
            )
          };
        });
      }
      return null;
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
        updates.verificationStatus = 'VERIFIED';
        updates.physicalVerificationStatus = 'completed';
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

  const checkDuplicateSupplierBatch = async (supplierBatchId: string) => {
    if (!passport?.batch) return { isDuplicate: false };
    const result = await service.checkDuplicateSupplierBatch(supplierBatchId);
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
      updateMaterialVerification,
      uploadEvidence,
      addCert,
      updateCertStatus,
      updateSampleShipping,
      updateSampleStatus,
      checkDuplicate,
      checkDuplicateSupplierBatch,
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
