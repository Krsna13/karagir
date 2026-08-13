import { describe, it, expect } from 'vitest';
import { calculateAdjustedPrice } from '../pricingService';

describe('pricingService', () => {
  it('should return base price when no adjustments apply', () => {
    const base = 10000;
    const price = calculateAdjustedPrice(base, 'Generic Wood', []);
    expect(price).toBe(10000);
  });

  it('should decrease price for Mango wood', () => {
    const base = 15000;
    const price = calculateAdjustedPrice(base, 'Mango Wood', []);
    expect(price).toBe(8000); // 15000 - 7000
  });

  it('should apply multiple accent adjustments', () => {
    const base = 10000;
    const price = calculateAdjustedPrice(base, 'Walnut', ['Solid Brass Wire / Sheet Inlay', 'Hand-Carved Wooden Jali Panels']);
    // 10000 + 5000 (Walnut) + 1800 (Brass) + 1200 (Jali)
    expect(price).toBe(18000);
  });

  it('should not return a price below 1000', () => {
    const base = 5000;
    const price = calculateAdjustedPrice(base, 'Mango', []);
    // 5000 - 7000 = -2000 => floor to 1000
    expect(price).toBe(1000);
  });
});
