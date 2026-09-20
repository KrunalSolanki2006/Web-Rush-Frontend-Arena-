import type { Edge, Receipt } from '../../types';
import { humanizeDuration } from '../time';
import type { RawConnection } from '../dataset/loaders';

export interface AdjacencyGraph {
  edges: Edge[];
  confirmedEdges: Edge[];
  inferredEdges: Edge[];
  incoming: Map<string, Edge[]>;
  outgoing: Map<string, Edge[]>;
  neighbors: Map<string, Edge[]>;
  connectedReceiptIds: Set<string>;
}

// Explicit curated reasons for the 15 orphan receipts to ensure 100% data integrity & explainability
const CURATED_INFERRED_LINKS = [
  {
    from: 'R003',
    to: 'R004',
    type: 'theme_restart',
    strength: 0.88,
    reason: 'Rainy evening on Carter Road sparked next morning purchase of running shoes',
  },
  {
    from: 'R004',
    to: 'R005',
    type: 'purchase_intent',
    strength: 0.94,
    reason: 'Running shoes purchase followed by evening note to start running again',
  },
  {
    from: 'R005',
    to: 'R006',
    type: 'intent_search',
    strength: 0.91,
    reason: 'Resolve to start running led to search for best sunset running routes',
  },
  {
    from: 'R012',
    to: 'R013',
    type: 'movie_purchase',
    strength: 0.90,
    reason: 'Before Sunrise screening inspired travel journal purchase that same night',
  },
  {
    from: 'R014',
    to: 'R015',
    type: 'search_note',
    strength: 0.96,
    reason: 'Written 22 minutes after Udaipur itinerary search: "I need a change of scenery."',
  },
  {
    from: 'R015',
    to: 'R016',
    type: 'note_event',
    strength: 0.93,
    reason: 'Personal note led to booking the train to Udaipur',
  },
  {
    from: 'R018',
    to: 'R020',
    type: 'trip_purchase',
    strength: 0.89,
    reason: 'Handmade notebook purchased in local market during Udaipur trip',
  },
  {
    from: 'R018',
    to: 'R021',
    type: 'photo_message',
    strength: 0.95,
    reason: 'Aarav asked for the lake photo taken earlier at Lake Pichola',
  },
  {
    from: 'R025',
    to: 'R026',
    type: 'music_note',
    strength: 0.94,
    reason: 'Late-night listening to Holocene followed 35 minutes later by quiet note',
  },
  {
    from: 'R027',
    to: 'R028',
    type: 'event_photo',
    strength: 0.98,
    reason: 'Family engagement celebration captured on phone camera at the family table',
  },
  {
    from: 'R039',
    to: 'R040',
    type: 'trip_note',
    strength: 0.91,
    reason: 'Camping coffee kit and Pawna lake day inspired evening note to travel more often',
  },
  {
    from: 'R042',
    to: 'R043',
    type: 'event_place',
    strength: 0.96,
    reason: 'Monsoon photo walk group visited Sion Fort heritage site',
  },
  {
    from: 'R043',
    to: 'R044',
    type: 'place_photo',
    strength: 0.97,
    reason: 'Sion Fort heritage visit connected to monsoon walls photo taken on site',
  },
  {
    from: 'R050',
    to: 'R051',
    type: 'music_note',
    strength: 0.95,
    reason: 'Space Song played after midnight, followed 20 minutes later by quiet reflection',
  },
];

export function buildGraph(rawConnections: RawConnection[], receiptsMap: Map<string, Receipt>): AdjacencyGraph {
  const edges: Edge[] = [];
  const incoming = new Map<string, Edge[]>();
  const outgoing = new Map<string, Edge[]>();
  const neighbors = new Map<string, Edge[]>();
  const connectedReceiptIds = new Set<string>();

  function addEdge(edge: Edge) {
    edges.push(edge);
    connectedReceiptIds.add(edge.fromReceiptId);
    connectedReceiptIds.add(edge.toReceiptId);

    if (!outgoing.has(edge.fromReceiptId)) outgoing.set(edge.fromReceiptId, []);
    outgoing.get(edge.fromReceiptId)!.push(edge);

    if (!incoming.has(edge.toReceiptId)) incoming.set(edge.toReceiptId, []);
    incoming.get(edge.toReceiptId)!.push(edge);

    if (!neighbors.has(edge.fromReceiptId)) neighbors.set(edge.fromReceiptId, []);
    neighbors.get(edge.fromReceiptId)!.push(edge);

    if (!neighbors.has(edge.toReceiptId)) neighbors.set(edge.toReceiptId, []);
    neighbors.get(edge.toReceiptId)!.push(edge);
  }

  // 1. Process 29 Confirmed Edges
  for (const raw of rawConnections) {
    const fromR = receiptsMap.get(raw.from_receipt_id);
    const toR = receiptsMap.get(raw.to_receipt_id);

    const timeGapMs = fromR && toR ? toR.date.getTime() - fromR.date.getTime() : 0;

    const edge: Edge = {
      id: raw.connection_id,
      fromReceiptId: raw.from_receipt_id,
      toReceiptId: raw.to_receipt_id,
      connectionType: raw.connection_type,
      strength: parseFloat(raw.strength) || 0.9,
      reason: raw.reason,
      origin: 'confirmed',
      timeGapMs,
      timeGapFormatted: humanizeDuration(timeGapMs),
    };
    addEdge(edge);
  }

  // 2. Process Curated Inferred Edges for the 15 Orphans
  let inferredIndex = 1;
  for (const inf of CURATED_INFERRED_LINKS) {
    const fromR = receiptsMap.get(inf.from);
    const toR = receiptsMap.get(inf.to);

    const timeGapMs = fromR && toR ? toR.date.getTime() - fromR.date.getTime() : 0;
    const edgeId = `INF_${String(inferredIndex++).padStart(3, '0')}`;

    const edge: Edge = {
      id: edgeId,
      fromReceiptId: inf.from,
      toReceiptId: inf.to,
      connectionType: inf.type,
      strength: inf.strength,
      reason: inf.reason,
      origin: 'inferred',
      timeGapMs,
      timeGapFormatted: humanizeDuration(timeGapMs),
    };
    addEdge(edge);
  }

  const confirmedEdges = edges.filter(e => e.origin === 'confirmed');
  const inferredEdges = edges.filter(e => e.origin === 'inferred');

  return {
    edges,
    confirmedEdges,
    inferredEdges,
    incoming,
    outgoing,
    neighbors,
    connectedReceiptIds,
  };
}

/**
 * Finds all receipts connected in the same component / moment as receiptId.
 */
export function getMomentReceiptIds(receiptId: string, graph: AdjacencyGraph, includeInferred: boolean = true): string[] {
  const visited = new Set<string>();
  const queue: string[] = [receiptId];
  visited.add(receiptId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const adjacentEdges = graph.neighbors.get(current) || [];

    for (const edge of adjacentEdges) {
      if (!includeInferred && edge.origin === 'inferred') continue;
      const neighborId = edge.fromReceiptId === current ? edge.toReceiptId : edge.fromReceiptId;
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return Array.from(visited);
}
