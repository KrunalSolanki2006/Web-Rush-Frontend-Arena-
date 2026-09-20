import type { Receipt, ReceiptType } from '../types';
import { matchThemes } from '../lib/dataset/chapters';
import type { AdjacencyGraph } from '../lib/graph';

export interface ArchiveFilterOptions {
  query?: string;
  type?: ReceiptType | '';
  month?: number | null;
  theme?: string;
  city?: string;
  connectedOnly?: boolean;
  hasCoordinates?: boolean;
  sort?: 'oldest' | 'newest' | 'connected' | 'amount';
}

/**
 * ArchiveFilterService provides pure, testable filtering and sorting logic
 * for the 55-receipt archive ledger.
 */
export class ArchiveFilterService {
  /**
   * Filters and sorts an array of receipts based on ArchiveFilterOptions.
   */
  public static filterReceipts(
    receipts: Receipt[],
    options: ArchiveFilterOptions,
    graph?: AdjacencyGraph
  ): Receipt[] {
    const query = options.query?.toLowerCase().trim() || '';
    const selectedType = options.type || '';
    const selectedMonth = options.month ?? null;
    const selectedTheme = options.theme || '';
    const selectedCity = options.city?.toLowerCase().trim() || '';
    const connectedOnly = options.connectedOnly ?? false;
    const hasCoordinates = options.hasCoordinates ?? false;
    const sort = options.sort || 'oldest';

    let list = [...receipts];

    // 1. Text Search across multiple fields
    if (query) {
      list = list.filter(r => {
        const extra = r.type === 'message' ? r.text : r.type === 'search' ? r.query : '';
        const fullText = `${r.receipt_id} ${r.title} ${r.context} ${r.location} ${r.tags.join(' ')} ${extra}`.toLowerCase();
        return fullText.includes(query);
      });
    }

    // 2. Type Filter
    if (selectedType) {
      list = list.filter(r => r.type === selectedType);
    }

    // 3. Month Filter
    if (selectedMonth !== null && selectedMonth > 0) {
      list = list.filter(r => r.month === selectedMonth);
    }

    // 4. Theme Filter
    if (selectedTheme) {
      list = list.filter(r => {
        const themes = matchThemes(r);
        return themes.includes(selectedTheme);
      });
    }

    // 5. City Filter
    if (selectedCity) {
      list = list.filter(r => r.normalizedCity.toLowerCase() === selectedCity);
    }

    // 6. Connected Only Filter
    if (connectedOnly && graph) {
      list = list.filter(r => {
        const neighbors = graph.neighbors.get(r.receipt_id);
        return neighbors && neighbors.length > 0;
      });
    }

    // 7. Has Coordinates Filter
    if (hasCoordinates) {
      list = list.filter(r => Boolean(r.coordinates));
    }

    // 8. Sorting
    list.sort((a, b) => {
      if (sort === 'newest') {
        return b.date.getTime() - a.date.getTime();
      }
      if (sort === 'connected' && graph) {
        const aConn = (graph.neighbors.get(a.receipt_id) || []).length;
        const bConn = (graph.neighbors.get(b.receipt_id) || []).length;
        return bConn - aConn;
      }
      if (sort === 'amount') {
        return (b.amount || 0) - (a.amount || 0);
      }
      // default: oldest
      return a.date.getTime() - b.date.getTime();
    });

    return list;
  }
}
