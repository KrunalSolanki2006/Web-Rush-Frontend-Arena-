import { describe, it, expect } from 'vitest';
import { getDataset } from '../../lib/dataset';
import { getMomentReceiptIds } from '../../lib/graph';
import { ArchiveFilterService } from '../../services/ArchiveFilterService';
import { ReceiptRepository } from '../../services/ReceiptRepository';
import { RelationshipResolver } from '../../services/RelationshipResolver';
import { InsightService } from '../../services/InsightService';

describe('Comprehensive Feature Verification Suite', () => {
  const dataset = getDataset();
  const repo = ReceiptRepository.getInstance();
  const resolver = RelationshipResolver.getInstance();
  const insightService = InsightService.getInstance();

  describe('1. Dataset & Ground Truth Integrity', () => {
    it('has exactly 55 receipts from Jan to Sep 2025', () => {
      expect(dataset.receipts).toHaveLength(55);
      expect(repo.getAll()).toHaveLength(55);
    });

    it('has exactly 9 monthly chapters with moments and receipts', () => {
      expect(dataset.chapters).toHaveLength(9);
      for (let m = 1; m <= 9; m++) {
        const ch = dataset.chapters.find(c => c.month === m);
        expect(ch).toBeDefined();
        expect(ch?.receipts.length).toBeGreaterThan(0);
        expect(ch?.title).toBeTruthy();
        expect(ch?.persona).toBeTruthy();
        expect(ch?.blurb).toBeTruthy();
      }
    });

    it('has exactly 29 confirmed and 14 inferred connections (43 total edges)', () => {
      const confirmed = dataset.graph.edges.filter(e => e.origin === 'confirmed');
      const inferred = dataset.graph.edges.filter(e => e.origin === 'inferred');
      expect(confirmed).toHaveLength(29);
      expect(inferred).toHaveLength(14);
      expect(dataset.graph.edges).toHaveLength(43);
    });

    it('has exactly 8 geolocated places with valid lat/lon', () => {
      expect(dataset.placesWithCoords).toHaveLength(8);
      dataset.placesWithCoords.forEach(p => {
        expect(p.latitude).toBeGreaterThan(18);
        expect(p.latitude).toBeLessThan(26);
        expect(p.longitude).toBeGreaterThan(72);
        expect(p.longitude).toBeLessThan(75);
        expect(p.name).toBeTruthy();
        expect(p.city).toBeTruthy();
      });
    });

    it('calculates total purchases to match exactly ₹72,808', () => {
      const total = dataset.receipts
        .filter(r => r.type === 'purchase')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      expect(total).toBe(72808);
    });
  });

  describe('2. Story Mode Feature Verification', () => {
    it('verifies all 9 chapters have moments and persona', () => {
      dataset.chapters.forEach(ch => {
        expect(ch.title).toBeTruthy();
        expect(ch.persona).toBeTruthy();
        expect(ch.moments.length).toBeGreaterThan(0);
      });
    });
  });

  describe('3. Threads Board & Causal Graph Feature Verification', () => {
    it('verifies graph traversal for every receipt without errors', () => {
      dataset.receipts.forEach(r => {
        const ids = getMomentReceiptIds(r.receipt_id, dataset.graph, true);
        expect(Array.isArray(ids)).toBe(true);
        expect(ids).toContain(r.receipt_id);
      });
    });

    it('verifies causal insight resolution for every receipt', () => {
      dataset.receipts.forEach(r => {
        const insight = resolver.getCausalInsight(r.receipt_id);
        expect(insight).toBeDefined();
        expect(['Trigger', 'Catalyst', 'Turning Point', 'Reflection', 'Anchor', 'Independent']).toContain(insight.role);
        expect(insight.description).toBeTruthy();
      });
    });

    it('verifies connected receipts retrieval for every receipt', () => {
      dataset.receipts.forEach(r => {
        const conns = resolver.getConnections(r.receipt_id);
        expect(Array.isArray(conns)).toBe(true);
        conns.forEach(c => {
          expect(c.edge).toBeDefined();
          expect(c.targetReceipt).toBeDefined();
          expect(c.targetReceipt.receipt_id).toBeTruthy();
        });
      });
    });
  });

  describe('4. Life Map Feature Verification', () => {
    it('verifies all 8 places have valid details and connected receipts', () => {
      dataset.placesWithCoords.forEach(place => {
        const placeReceipts = dataset.receipts.filter(
          r =>
            r.receipt_id === place.receipt_id ||
            (r.location && r.location.toLowerCase().includes(place.name.toLowerCase())) ||
            (r.context && r.context.toLowerCase().includes(place.name.toLowerCase()))
        );
        expect(placeReceipts.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('5. Patterns & Discoveries Feature Verification', () => {
    it('computes theme matrix with all themes across all 9 months', () => {
      const matrixData = insightService.getThemeMatrix();
      expect(matrixData.themes.length).toBeGreaterThan(0);
      matrixData.themes.forEach(t => {
        expect(matrixData.matrix[t]).toBeDefined();
        expect(matrixData.matrix[t]).toHaveLength(9);
      });
    });

    it('computes circadian morning shift across chapters', () => {
      const shift = insightService.getMorningShift();
      expect(shift.chapters).toHaveLength(9);
      shift.chapters.forEach(c => {
        expect(c.total).toBeGreaterThan(0);
        expect(c.morningPercentage).toBeGreaterThanOrEqual(0);
      });
    });

    it('computes intent-action lags', () => {
      const lags = insightService.getIntentActionLags();
      expect(lags.length).toBeGreaterThan(0);
      lags.forEach(lag => {
        expect(lag.searchReceipt).toBeDefined();
        expect(lag.outcomeReceipt).toBeDefined();
        expect(lag.lagMs).toBeGreaterThanOrEqual(0);
      });
    });

    it('computes spending breakdown', () => {
      const spending = insightService.getSpendingBreakdown();
      expect(spending.total).toBe(72808);
      expect(spending.cameraTotal).toBe(67100); // 58900 + 8200
      expect(spending.cameraPercentage).toBeGreaterThan(90);
    });

    it('computes inner voice arc', () => {
      const arc = insightService.getInnerVoice();
      expect(arc.length).toBeGreaterThan(0);
      arc.forEach(item => {
        expect(item.receipt).toBeDefined();
        expect(item.order).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('6. Archive Multi-Facet Filter Verification', () => {
    it('filters by all 9 types independently', () => {
      const types = ['photo', 'place', 'event', 'search', 'music', 'purchase', 'note', 'movie', 'message'] as const;
      types.forEach(t => {
        const results = ArchiveFilterService.filterReceipts(dataset.receipts, { type: t });
        expect(results.length).toBeGreaterThan(0);
        results.forEach(r => expect(r.type).toBe(t));
      });
    });

    it('filters by month', () => {
      for (let m = 1; m <= 9; m++) {
        const results = ArchiveFilterService.filterReceipts(dataset.receipts, { month: m });
        expect(results.length).toBeGreaterThan(0);
        results.forEach(r => expect(r.month).toBe(m));
      }
    });

    it('filters by connected-only', () => {
      const results = ArchiveFilterService.filterReceipts(
        dataset.receipts,
        { connectedOnly: true },
        dataset.graph
      );
      expect(results.length).toBeGreaterThan(0);
    });

    it('sorts by amount descending', () => {
      const results = ArchiveFilterService.filterReceipts(dataset.receipts, { sort: 'amount' });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].amount || 0).toBeGreaterThanOrEqual(results[i + 1].amount || 0);
      }
    });
  });
});
