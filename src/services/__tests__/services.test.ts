import { describe, it, expect } from 'vitest';
import {
  receiptRepository,
  relationshipResolver,
  insightService,
  ArchiveFilterService,
} from '../index';

describe('Service Layer Architecture Tests', () => {
  describe('ReceiptRepository', () => {
    it('returns exactly 55 life receipts', () => {
      expect(receiptRepository.getAll()).toHaveLength(55);
      expect(receiptRepository.count).toBe(55);
    });

    it('retrieves receipt by ID', () => {
      const r1 = receiptRepository.getById('R001');
      expect(r1).toBeDefined();
      expect(r1?.title).toBe('Midnight City');
      expect(r1?.type).toBe('music');
    });

    it('filters by type correctly', () => {
      expect(receiptRepository.getByType('photo')).toHaveLength(9);
      expect(receiptRepository.getByType('purchase')).toHaveLength(6);
      expect(receiptRepository.getByType('place')).toHaveLength(8);
      expect(receiptRepository.getByType('note')).toHaveLength(6);
    });

    it('returns geocoded places and purchase totals', () => {
      expect(receiptRepository.getPlaces()).toHaveLength(8);
      expect(receiptRepository.getPurchasesTotal()).toBe(72808);
      expect(receiptRepository.getChapters()).toHaveLength(9);
    });
  });

  describe('RelationshipResolver & Causal Intelligence', () => {
    it('identifies confirmed and inferred edge counts', () => {
      expect(relationshipResolver.confirmedEdgeCount).toBe(29);
      expect(relationshipResolver.inferredEdgeCount).toBe(14);
    });

    it('resolves connections with target receipts and directions', () => {
      const conns = relationshipResolver.getConnections('R001');
      expect(conns.length).toBeGreaterThan(0);
      expect(conns[0].targetReceipt).toBeDefined();
      expect(conns[0].edge).toBeDefined();
    });

    it('evaluates causal significance correctly', () => {
      // R030 is mirrorless purchase -> Turning Point
      const r30Insight = relationshipResolver.getCausalInsight('R030');
      expect(r30Insight.role).toBe('Turning Point');

      // R055 is final note -> Reflection
      const r55Insight = relationshipResolver.getCausalInsight('R055');
      expect(r55Insight.role).toBe('Reflection');

      // Place receipts -> Anchor
      const r23Insight = relationshipResolver.getCausalInsight('R023');
      expect(r23Insight.role).toBe('Anchor');
    });
  });

  describe('InsightService', () => {
    it('computes intent-to-action lags', () => {
      const lags = insightService.getIntentActionLags();
      expect(lags.length).toBeGreaterThanOrEqual(7);
      // Fastest lag is R029 -> R030 (35 minutes)
      expect(lags[0].lagFormatted).toBe('35 min');
    });

    it('computes spending breakdown', () => {
      const spending = insightService.getSpendingBreakdown();
      expect(spending.total).toBe(72808);
      expect(spending.cameraTotal).toBe(67100);
      expect(Math.round(spending.cameraPercentage)).toBe(92);
    });

    it('computes theme recurrence matrix', () => {
      const { themes, matrix } = insightService.getThemeMatrix();
      expect(themes).toHaveLength(7);
      expect(matrix['water']).toHaveLength(9);
      expect(matrix['seeing']).toHaveLength(9);
    });
  });

  describe('ArchiveFilterService', () => {
    const allReceipts = receiptRepository.getAll();
    const graph = receiptRepository.getRawDataset().graph;

    it('filters by query and type simultaneously', () => {
      const results = ArchiveFilterService.filterReceipts(allReceipts, {
        query: 'udaipur',
        type: 'photo',
      });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.every(r => r.type === 'photo')).toBe(true);
    });

    it('filters connected receipts only', () => {
      const results = ArchiveFilterService.filterReceipts(
        allReceipts,
        { connectedOnly: true },
        graph
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => (graph.neighbors.get(r.receipt_id) || []).length > 0)).toBe(true);
    });

    it('sorts by most connected descending', () => {
      const results = ArchiveFilterService.filterReceipts(
        allReceipts,
        { sort: 'connected' },
        graph
      );
      const firstConn = (graph.neighbors.get(results[0].receipt_id) || []).length;
      const lastConn = (graph.neighbors.get(results[results.length - 1].receipt_id) || []).length;
      expect(firstConn).toBeGreaterThanOrEqual(lastConn);
    });
  });
});
