import type { Moment, Receipt, ReceiptType } from '../../types';
import type { AdjacencyGraph } from '../graph';

const MOMENT_TITLES: Record<string, string> = {
  R001: 'Carter Road & The Restart',
  R008: 'Marine Drive & Travel Journal',
  R014: 'Udaipur Scenery & Lake Pichola',
  R022: 'Jheel\'s Cafe & Notebook',
  R025: 'Quiet Nights & Family Gathering',
  R029: 'Mirrorless Camera & Morning Forest',
  R034: 'The Lonavala Road Trip & Pawna Lake',
  R041: 'Monsoon Photo Walk & Sion Fort',
  R045: 'Analog Film Camera & Kala Ghoda Meetup',
  R050: 'Space Song & Quiet Reflection',
  R052: 'Perfect Days & Daily Journal Challenge',
};

export function buildMoments(receipts: Receipt[], graph: AdjacencyGraph): Moment[] {
  const visited = new Set<string>();
  const moments: Moment[] = [];

  // Sort receipts chronologically
  const sortedReceipts = [...receipts].sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const r of sortedReceipts) {
    if (visited.has(r.receipt_id)) continue;

    // Find all receipts in this connected component
    const componentReceiptIds = new Set<string>();
    const queue = [r.receipt_id];
    componentReceiptIds.add(r.receipt_id);
    visited.add(r.receipt_id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = graph.neighbors.get(current) || [];
      for (const edge of neighbors) {
        const nextId = edge.fromReceiptId === current ? edge.toReceiptId : edge.fromReceiptId;
        if (!componentReceiptIds.has(nextId)) {
          componentReceiptIds.add(nextId);
          visited.add(nextId);
          queue.push(nextId);
        }
      }
    }

    const momentReceipts = sortedReceipts.filter(item => componentReceiptIds.has(item.receipt_id));
    if (momentReceipts.length === 0) continue;

    const first = momentReceipts[0];
    const last = momentReceipts[momentReceipts.length - 1];
    const startTime = first.date;
    const endTime = last.date;
    const spanMs = endTime.getTime() - startTime.getTime();
    const typeRecipe = momentReceipts.map(m => m.type);

    const title = MOMENT_TITLES[first.receipt_id] || `${first.title} Chain`;

    moments.push({
      id: `MOMENT_${first.receipt_id}`,
      title,
      receipts: momentReceipts,
      receiptIds: momentReceipts.map(m => m.receipt_id),
      typeRecipe: typeRecipe as ReceiptType[],
      startTime,
      endTime,
      spanMs,
      chapterMonth: first.month,
      isConfirmedChain: momentReceipts.length >= 2,
    });
  }

  return moments;
}
