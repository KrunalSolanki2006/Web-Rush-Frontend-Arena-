import { describe, it, expect } from 'vitest';
import { getDataset } from '../../dataset';
import {
  computeIntentActionLags,
  computeSpendingBreakdown,
  computeMorningShift,
  computeInnerVoice,
} from '../index';

describe('Computed Insights (§2.8)', () => {
  const dataset = getDataset();

  it('computes intent-to-action lags accurately', () => {
    const lags = computeIntentActionLags(dataset);
    expect(lags.length).toBeGreaterThan(0);

    // Camera search to purchase: 35 min
    const cameraLag = lags.find(l => l.searchReceipt.receipt_id === 'R029');
    expect(cameraLag?.lagFormatted).toBe('35 min');

    // Udaipur cafe: 50 min
    const cafeLag = lags.find(l => l.searchReceipt.receipt_id === 'R022');
    expect(cafeLag?.lagFormatted).toBe('50 min');

    // 30-day challenge: 10 h 50 min
    const challengeLag = lags.find(l => l.searchReceipt.receipt_id === 'R053');
    expect(challengeLag?.lagFormatted).toBe('10 h 50 min');
  });

  it('computes spending breakdown accurately', () => {
    const spending = computeSpendingBreakdown(dataset);
    expect(spending.total).toBe(72808);
    expect(spending.cameraTotal).toBe(67100);
    expect(Math.round(spending.cameraPercentage)).toBe(92);
    expect(Math.round(spending.mirrorlessPercentage)).toBe(81);
  });

  it('computes morning shift accurately', () => {
    const shift = computeMorningShift(dataset);
    expect(shift.janFebMorningRatio).toBe('1 of 13 receipts');
    expect(shift.mayJulMorningRatio).toBe('10 of 16 receipts');
  });

  it('computes the inner voice sequence', () => {
    const notes = computeInnerVoice(dataset);
    expect(notes).toHaveLength(6);
    const ids = notes.map(n => n.receipt.receipt_id);
    expect(ids).toEqual(['R005', 'R015', 'R026', 'R040', 'R051', 'R055']);

    // Five written at night, last one in morning
    expect(notes.filter(n => n.isNight)).toHaveLength(5);
    expect(notes[5].receipt.timeLabel).toBe('08:15');
    expect(notes[5].receipt.title).toBe('One photo a day.');
  });
});
