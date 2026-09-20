import { describe, it, expect } from 'vitest';
import { getDataset } from '../../../lib/dataset';

describe('Archive Search and Filter Logic', () => {
  const dataset = getDataset();

  it('filters by receipt type correctly', () => {
    const photos = dataset.receipts.filter(r => r.type === 'photo');
    expect(photos).toHaveLength(9);

    const notes = dataset.receipts.filter(r => r.type === 'note');
    expect(notes).toHaveLength(6);
  });

  it('filters by month correctly', () => {
    // March is busiest with 11
    const march = dataset.receipts.filter(r => r.month === 3);
    expect(march).toHaveLength(11);

    // April has 4
    const april = dataset.receipts.filter(r => r.month === 4);
    expect(april).toHaveLength(4);
  });

  it('filters by query string across fields', () => {
    // Search for "Udaipur"
    const udaipurReceipts = dataset.receipts.filter(r => {
      const text = `${r.title} ${r.context} ${r.location} ${r.tags.join(' ')}`.toLowerCase();
      return text.includes('udaipur');
    });
    expect(udaipurReceipts.length).toBeGreaterThanOrEqual(9);

    // Search for "camera"
    const cameraReceipts = dataset.receipts.filter(r => {
      const text = `${r.title} ${r.context} ${r.location} ${r.tags.join(' ')}`.toLowerCase();
      return text.includes('camera');
    });
    expect(cameraReceipts.length).toBeGreaterThanOrEqual(4);
  });

  it('sorts by amount descending', () => {
    const sorted = [...dataset.receipts].sort((a, b) => (b.amount || 0) - (a.amount || 0));
    expect(sorted[0].receipt_id).toBe('R030'); // Mirrorless Camera (58,900)
    expect(sorted[0].amount).toBe(58900);
    expect(sorted[1].receipt_id).toBe('R046'); // 35mm Film Camera (8,200)
    expect(sorted[1].amount).toBe(8200);
  });
});
