import { describe, it, expect } from 'vitest';
import { getDataset } from '../../dataset';

describe('Graph Engine & Connectivity (§2.3 & §2.5)', () => {
  const dataset = getDataset();

  it('contains exactly 29 confirmed edges pointing forward in time', () => {
    expect(dataset.graph.confirmedEdges).toHaveLength(29);
    for (const edge of dataset.graph.confirmedEdges) {
      expect(edge.origin).toBe('confirmed');
      expect(edge.timeGapMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('connects 100% of receipts (0 orphans remaining after inferred links)', () => {
    for (const r of dataset.receipts) {
      expect(dataset.graph.connectedReceiptIds.has(r.receipt_id)).toBe(true);
    }
  });

  it('verifies sanity pairs from §2.5', () => {
    const inferred = dataset.graph.inferredEdges;
    // R014 -> R015: "I need a change of scenery" 22 min after itinerary search
    const r14_15 = inferred.find(e => e.fromReceiptId === 'R014' && e.toReceiptId === 'R015');
    expect(r14_15).toBeDefined();
    expect(r14_15?.timeGapFormatted).toBe('22 min');

    // R018 -> R021: Aarav asks for lake photo
    const r18_21 = inferred.find(e => e.fromReceiptId === 'R018' && e.toReceiptId === 'R021');
    expect(r18_21).toBeDefined();

    // R025 -> R026: Holocene followed by quiet note
    const r25_26 = inferred.find(e => e.fromReceiptId === 'R025' && e.toReceiptId === 'R026');
    expect(r25_26).toBeDefined();

    // R050 -> R051: Space Song followed by quiet note
    const r50_51 = inferred.find(e => e.fromReceiptId === 'R050' && e.toReceiptId === 'R051');
    expect(r50_51).toBeDefined();

    // R027 -> R028: Family engagement event and photo
    const r27_28 = inferred.find(e => e.fromReceiptId === 'R027' && e.toReceiptId === 'R028');
    expect(r27_28).toBeDefined();
  });
});
