import { describe, it, expect } from 'vitest';
import { getDataset } from '../index';

describe('Dataset Integrity & Ground Truth (§2.3)', () => {
  const dataset = getDataset();

  it('contains exactly 55 receipts from 2025-01-04 21:10 to 2025-09-19 08:15', () => {
    expect(dataset.receipts).toHaveLength(55);
    expect(dataset.receipts[0].receipt_id).toBe('R001');
    expect(dataset.receipts[0].timestamp).toBe('2025-01-04 21:10');
    expect(dataset.receipts[54].receipt_id).toBe('R055');
    expect(dataset.receipts[54].timestamp).toBe('2025-09-19 08:15');
  });

  it('matches type distribution exactly: Photo 9, Place 8, Event 8, Search 7, Music 6, Purchase 6, Note 6, Movie 3, Message 2', () => {
    const counts = dataset.receipts.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(counts['photo']).toBe(9);
    expect(counts['place']).toBe(8);
    expect(counts['event']).toBe(8);
    expect(counts['search']).toBe(7);
    expect(counts['music']).toBe(6);
    expect(counts['purchase']).toBe(6);
    expect(counts['note']).toBe(6);
    expect(counts['movie']).toBe(3);
    expect(counts['message']).toBe(2);
  });

  it('matches receipts per month Jan to Sep: 7, 6, 11, 4, 5, 7, 4, 5, 6', () => {
    const expected = [7, 6, 11, 4, 5, 7, 4, 5, 6];
    for (let m = 1; m <= 9; m++) {
      const monthReceipts = dataset.receipts.filter(r => r.month === m);
      expect(monthReceipts.length).toBe(expected[m - 1]);
    }
  });

  it('purchases total exactly ₹72,808 and master amounts equal purchase amounts', () => {
    expect(dataset.purchasesTotal).toBe(72808);
    const purchases = dataset.receipts.filter(r => r.type === 'purchase');
    expect(purchases).toHaveLength(6);
    const sum = purchases.reduce((acc, p) => acc + (p.amount || 0), 0);
    expect(sum).toBe(72808);
  });

  it('exactly 8 places have coordinates: R002, R009, R017, R023, R031, R037, R043, R048', () => {
    expect(dataset.placesWithCoords).toHaveLength(8);
    const ids = dataset.placesWithCoords.map(p => p.receipt_id).sort();
    expect(ids).toEqual(['R002', 'R009', 'R017', 'R023', 'R031', 'R037', 'R043', 'R048']);
  });
});
