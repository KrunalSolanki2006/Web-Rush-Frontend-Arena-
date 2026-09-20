import { useMemo } from 'react';
import {
  receiptRepository,
  relationshipResolver,
  insightService,
} from '../services';

/**
 * useDataset provides a convenient, memoized hook interface for React components
 * to interact with the domain services without tight coupling to the raw dataset.
 */
export function useDataset() {
  return useMemo(() => {
    return {
      // Repositories & Services
      repository: receiptRepository,
      relationships: relationshipResolver,
      insights: insightService,

      // Convenient Core Data Accessors
      receipts: receiptRepository.getAll(),
      chapters: receiptRepository.getChapters(),
      moments: receiptRepository.getMoments(),
      places: receiptRepository.getPlaces(),
      purchasesTotal: receiptRepository.getPurchasesTotal(),
      rawDataset: receiptRepository.getRawDataset(),

      // Graph & Stats
      graph: receiptRepository.getRawDataset().graph,
      confirmedCount: relationshipResolver.confirmedEdgeCount,
      inferredCount: relationshipResolver.inferredEdgeCount,

      // Query helpers
      getReceipt: (id: string) => receiptRepository.getById(id),
      getConnections: (id: string) => relationshipResolver.getConnections(id),
      getCausalInsight: (id: string) => relationshipResolver.getCausalInsight(id),
      getNeighbors: (id: string) => relationshipResolver.getNeighbors(id),
    };
  }, []);
}
