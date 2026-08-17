import { describe, it, expect, beforeEach } from 'vitest';
import { 
  generateMaterialId, 
  validateQuantityAllocation, 
  getPublicMaterialPassport, 
  checkDuplicateBatchRecord,
  allocateMaterialToProject,
  getAllMaterialRecords
} from '../materialPassportService';

describe('Kaaragir Material Registry & Verification Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates unique Material IDs in the required KAR-MAT-YYYY-XXXXX format', () => {
    const id1 = generateMaterialId(2026);
    const id2 = generateMaterialId(2026);

    expect(id1).toMatch(/^KAR-MAT-2026-\d{5}$/);
    expect(id2).toMatch(/^KAR-MAT-2026-\d{5}$/);
    expect(id1).not.toBe(id2);
  });

  it('validates quantity allocation correctly and blocks over-allocation', () => {
    // 100 kg purchased, 30 kg allocated -> valid, 70 kg remaining
    const validResult = validateQuantityAllocation(100, 30);
    expect(validResult.isValid).toBe(true);
    expect(validResult.remaining).toBe(70);

    // 100 kg purchased, trying to allocate 120 kg -> invalid, max available 100 kg
    const overAllocatedResult = validateQuantityAllocation(100, 120);
    expect(overAllocatedResult.isValid).toBe(false);
    expect(overAllocatedResult.message).toContain('Insufficient remaining quantity. Maximum available: 100 kg');

    // 0 or negative allocated quantity -> invalid
    const zeroResult = validateQuantityAllocation(100, 0);
    expect(zeroResult.isValid).toBe(false);
  });

  it('retrieves the primary demo record KAR-MAT-2026-97373 with complete traceability and project allocation', async () => {
    const passport = await getPublicMaterialPassport('KAR-MAT-2026-97373');
    
    expect(passport).not.toBeNull();
    if (!passport) return;

    expect(passport.batch.passportId).toBe('KAR-MAT-2026-97373');
    expect(passport.batch.materialType).toBe('Seasoned Sagwan Teak');
    expect(passport.batch.species).toBe('Teak Wood');
    expect(passport.batch.supplierName).toBe('Sahrangpur Pvt Wood');
    expect(passport.batch.invoiceNumber).toBe('INV-4521');
    expect(passport.batch.supplierBatchId).toBe('TV-0826-19');
    expect(passport.batch.purchasedQuantity).toBe(100);
    expect(passport.batch.allocatedQuantity).toBe(30);
    expect(passport.batch.remainingQuantity).toBe(70);
    expect(passport.batch.verificationStatus).toBe('VERIFIED');
    expect(passport.batch.traceabilityStatus).toBe('TRACEABILITY_COMPLETE');
    expect(passport.batch.physicalVerificationStatus).toBe('completed');
    expect(passport.batch.projectAllocations).toBeDefined();
    expect(passport.batch.projectAllocations?.length).toBeGreaterThan(0);
    expect(passport.batch.projectName).toBe('Custom Oak & Sagwan Teak Dining Table');
    expect(passport.certifications.length).toBeGreaterThan(0);
    expect(passport.evidence.length).toBeGreaterThan(0);
  });

  it('detects duplicate supplier batch registrations based on Supplier + Batch ID + Invoice', async () => {
    // Check against demo batch: Sahrangpur Pvt Wood + TV-0826-19 + INV-4521
    const dupCheck = await checkDuplicateBatchRecord('Sahrangpur Pvt Wood', 'TV-0826-19', 'INV-4521');
    expect(dupCheck.isDuplicate).toBe(true);
    expect(dupCheck.existingRecord?.passportId).toBe('KAR-MAT-2026-97373');

    // Distinct new purchase should not be flagged as duplicate
    const nonDup = await checkDuplicateBatchRecord('New Supplier Ltd', 'NEW-BATCH-001', 'INV-9999');
    expect(nonDup.isDuplicate).toBe(false);
  });

  it('allocates material quantity to projects and updates remaining balances', async () => {
    // Seeded batch has 70 kg remaining
    const allocResult = await allocateMaterialToProject(
      'KAR-MAT-2026-97373',
      '#KARAGIR-88220',
      'Handcrafted Coffee Table',
      20
    );

    expect(allocResult.success).toBe(true);
    expect(allocResult.updatedBatch?.allocatedQuantity).toBe(50);
    expect(allocResult.updatedBatch?.remainingQuantity).toBe(50);

    // Over-allocating beyond remaining 50 kg must fail
    const overAlloc = await allocateMaterialToProject(
      'KAR-MAT-2026-97373',
      '#KARAGIR-99999',
      'Excess Project',
      60
    );

    expect(overAlloc.success).toBe(false);
    expect(overAlloc.message).toContain('Insufficient remaining quantity');
  });

  it('retrieves all registered material batches for the Material Registry dashboard', async () => {
    const allRecords = await getAllMaterialRecords();
    expect(allRecords.length).toBeGreaterThanOrEqual(10);
    expect(allRecords.some(r => r.passportId === 'KAR-MAT-2026-97373')).toBe(true);
  });
});
