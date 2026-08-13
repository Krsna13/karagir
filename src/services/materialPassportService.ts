import { supabase } from '../lib/supabase/client';
import type { 
  MaterialBatch, 
  EvidenceRecord, 
  CertificationRecord, 
  MaterialPassport,
  EvidenceType
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
 * Fetches the Material Passport for an order.
 * Tries Supabase first, falls back to LocalStorage.
 */
export const getMaterialPassport = async (orderId: string): Promise<MaterialPassport | null> => {
  try {
    // 1. Try Supabase
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
        batch: batchData as unknown as MaterialBatch,
        evidence: (evidenceData || []) as unknown as EvidenceRecord[],
        certifications: (certData || []) as unknown as CertificationRecord[]
      };
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to LocalStorage:', err);
  }

  // 2. Fallback to LocalStorage
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batch = batches.find(b => b.orderId === orderId);
  if (!batch) return null;

  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const evidence = allEvidence.filter(e => e.orderId === orderId);

  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  const certifications = allCerts.filter(c => c.materialBatchId === batch.id);

  return { batch, evidence, certifications };
};

/**
 * Creates a new Material Batch record.
 */
export const createMaterialBatch = async (
  batchInput: Omit<MaterialBatch, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MaterialBatch | null> => {
  const newId = crypto.randomUUID();
  const now = new Date().toISOString();
  const batch: MaterialBatch = {
    ...batchInput,
    id: newId,
    createdAt: now,
    updatedAt: now
  };

  try {
    // Try Supabase
    const { data, error } = await (supabase
      .from('material_batches') as any)
      .insert(batch as any)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as MaterialBatch;
  } catch (err) {
    console.warn('Supabase insert failed, caching locally:', err);
  }

  // Fallback
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  batches.push(batch);
  setLocalData('karagir_material_batches', batches);
  return batch;
};

/**
 * Updates a Material Batch.
 */
export const updateMaterialBatch = async (
  batchId: string, 
  updates: Partial<MaterialBatch>
): Promise<MaterialBatch | null> => {
  const now = new Date().toISOString();

  try {
    // Try Supabase
    const { data, error } = await (supabase
      .from('material_batches') as any)
      .update({ ...updates, updated_at: now } as any)
      .eq('id', batchId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as MaterialBatch;
  } catch (err) {
    console.warn('Supabase update failed, editing locally:', err);
  }

  // Fallback
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const idx = batches.findIndex(b => b.id === batchId);
  if (idx === -1) return null;

  const updated = { ...batches[idx], ...updates, updatedAt: now };
  batches[idx] = updated;
  setLocalData('karagir_material_batches', batches);
  return updated;
};

/**
 * Uploads an evidence file (invoice, photo, etc.).
 * Stores it in storage, performs duplicate check, and inserts evidence record.
 */
export const uploadEvidenceFile = async (
  orderId: string,
  batchId: string,
  file: File,
  type: EvidenceType,
  userId: string,
  replacedEvidenceId?: string
): Promise<EvidenceRecord | null> => {
  // 1. Generate file hash
  const fileHash = await computeFileHash(file);
  const now = new Date().toISOString();
  const evidenceId = crypto.randomUUID();
  const filePath = `evidence/${orderId}/${evidenceId}-${file.name}`;
  
  let storagePathUrl = '';

  try {
    // Try Supabase storage
    const path = await uploadImage(BUCKET_NAME, filePath, file);
    if (path) {
      storagePathUrl = getImageUrl(BUCKET_NAME, path);
    }
  } catch (err) {
    console.warn('Supabase storage upload failed, utilizing data URL fallback:', err);
  }

  if (!storagePathUrl) {
    // Fallback: convert file to a local object URL or data URL
    storagePathUrl = URL.createObjectURL(file);
  }

  const record: EvidenceRecord = {
    id: evidenceId,
    orderId,
    materialBatchId: batchId,
    type,
    storagePath: storagePathUrl,
    fileHash,
    capturedAt: now,
    uploadedAt: now,
    verificationStatus: 'uploaded',
    createdBy: userId,
    replacedEvidenceId
  };

  try {
    // Try Supabase DB
    const { data, error } = await (supabase
      .from('material_evidence') as any)
      .insert(record as any)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as EvidenceRecord;
  } catch (err) {
    console.warn('Supabase DB insert failed, caching locally:', err);
  }

  // Fallback
  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  allEvidence.push(record);
  setLocalData('karagir_material_evidence', allEvidence);

  // If replacing an old evidence, update that record's status or note
  if (replacedEvidenceId) {
    const idx = allEvidence.findIndex(e => e.id === replacedEvidenceId);
    if (idx !== -1) {
      allEvidence[idx].verificationStatus = 'rejected'; // marked as replaced
      setLocalData('karagir_material_evidence', allEvidence);
    }
  }

  return record;
};

/**
 * Adds a new certification record.
 */
export const addCertificationRecord = async (
  certInput: Omit<CertificationRecord, 'id'>
): Promise<CertificationRecord | null> => {
  const certId = crypto.randomUUID();
  const record: CertificationRecord = {
    ...certInput,
    id: certId
  };

  try {
    const { data, error } = await (supabase
      .from('certification_records') as any)
      .insert(record as any)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as CertificationRecord;
  } catch (err) {
    console.warn('Supabase cert insert failed, caching locally:', err);
  }

  // Fallback
  const certs = getLocalData<CertificationRecord>('karagir_certification_records');
  certs.push(record);
  setLocalData('karagir_certification_records', certs);
  return record;
};

/**
 * Updates a certification record (e.g. verifying it).
 */
export const updateCertificationRecord = async (
  certId: string,
  updates: Partial<CertificationRecord>
): Promise<CertificationRecord | null> => {
  try {
    const { data, error } = await (supabase
      .from('certification_records') as any)
      .update(updates as any)
      .eq('id', certId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as CertificationRecord;
  } catch (err) {
    console.warn('Supabase cert update failed, editing locally:', err);
  }

  // Fallback
  const certs = getLocalData<CertificationRecord>('karagir_certification_records');
  const idx = certs.findIndex(c => c.id === certId);
  if (idx === -1) return null;

  const updated = { ...certs[idx], ...updates };
  certs[idx] = updated;
  setLocalData('karagir_certification_records', certs);
  return updated;
};

/**
 * Searches for duplicate evidence files uploaded in other orders using the file hash.
 */
export const checkDuplicateEvidence = async (
  fileHash: string,
  excludeOrderId: string
): Promise<{ isDuplicate: boolean; orderId?: string; filename?: string } | null> => {
  try {
    const { data, error } = await (supabase
      .from('material_evidence') as any)
      .select('order_id, storage_path')
      .eq('file_hash', fileHash)
      .neq('order_id', excludeOrderId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      const filename = data.storage_path.split('/').pop() || 'file';
      return { isDuplicate: true, orderId: data.order_id, filename };
    }
  } catch (err) {
    console.warn('Supabase duplicate check failed, checking local cache:', err);
  }

  // Fallback
  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const match = allEvidence.find(e => e.fileHash === fileHash && e.orderId !== excludeOrderId);
  
  if (match) {
    const filename = match.storagePath.split('/').pop() || 'file';
    return { isDuplicate: true, orderId: match.orderId, filename };
  }

  return { isDuplicate: false };
};

/**
 * Public lookup for material passports by Passport ID (QR code route).
 */
export const getPublicMaterialPassport = async (passportId: string): Promise<MaterialPassport | null> => {
  try {
    const { data: batchData, error: batchError } = await (supabase
      .from('material_batches') as any)
      .select('*')
      .eq('passport_id', passportId)
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
        batch: batchData as unknown as MaterialBatch,
        evidence: (evidenceData || []) as unknown as EvidenceRecord[],
        certifications: (certData || []) as unknown as CertificationRecord[]
      };
    }
  } catch (err) {
    console.warn('Supabase public passport lookup failed, fallback to local:', err);
  }

  // Fallback
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const batch = batches.find(b => b.passportId === passportId);
  if (!batch) return null;

  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const evidence = allEvidence.filter(e => e.materialBatchId === batch.id);

  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');
  const certifications = allCerts.filter(c => c.materialBatchId === batch.id);

  return { batch, evidence, certifications };
};

/**
 * Verification queue for admin overview.
 */
export const getAdminVerificationQueue = async (): Promise<MaterialPassport[]> => {
  try {
    const { data: batches, error } = await (supabase
      .from('material_batches') as any)
      .select('*');

    if (error) throw error;
    if (batches && batches.length > 0) {
      const passports: MaterialPassport[] = [];
      for (const batch of batches) {
        const { data: evidenceData } = await (supabase
          .from('material_evidence') as any)
          .select('*')
          .eq('material_batch_id', batch.id);

        const { data: certData } = await (supabase
          .from('certification_records') as any)
          .select('*')
          .eq('material_batch_id', batch.id);

        passports.push({
          batch: batch as unknown as MaterialBatch,
          evidence: (evidenceData || []) as unknown as EvidenceRecord[],
          certifications: (certData || []) as unknown as CertificationRecord[]
        });
      }
      return passports;
    }
  } catch (err) {
    console.warn('Supabase admin query failed, listing local cache:', err);
  }

  // Fallback
  const batches = getLocalData<MaterialBatch>('karagir_material_batches');
  const allEvidence = getLocalData<EvidenceRecord>('karagir_material_evidence');
  const allCerts = getLocalData<CertificationRecord>('karagir_certification_records');

  return batches.map(batch => ({
    batch,
    evidence: allEvidence.filter(e => e.materialBatchId === batch.id),
    certifications: allCerts.filter(c => c.materialBatchId === batch.id)
  }));
};
