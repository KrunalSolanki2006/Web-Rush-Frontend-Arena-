import type { Edge, Moment, Receipt } from '../types';
import { getDataset, type Dataset } from '../lib/dataset';
import { getMomentReceiptIds, type AdjacencyGraph } from '../lib/graph';

export type CausalRole = 'Trigger' | 'Catalyst' | 'Turning Point' | 'Reflection' | 'Anchor' | 'Independent';

export interface CausalInsight {
  role: CausalRole;
  description: string;
  connectionCount: number;
  confirmedCount: number;
  inferredCount: number;
  incomingCount: number;
  outgoingCount: number;
}

export interface ResolvedConnection {
  edge: Edge;
  targetReceipt: Receipt;
  direction: 'outgoing' | 'incoming';
}

/**
 * RelationshipResolver handles all graph navigation, connection querying,
 * and causal intelligence between life receipts.
 */
export class RelationshipResolver {
  private static instance: RelationshipResolver | null = null;
  private dataset: Dataset;
  private graph: AdjacencyGraph;

  private constructor() {
    this.dataset = getDataset();
    this.graph = this.dataset.graph;
  }

  public static getInstance(): RelationshipResolver {
    if (!RelationshipResolver.instance) {
      RelationshipResolver.instance = new RelationshipResolver();
    }
    return RelationshipResolver.instance;
  }

  /** Returns all connections for a receipt (both outgoing and incoming) */
  public getConnections(receiptId: string): ResolvedConnection[] {
    const outgoing = this.graph.outgoing.get(receiptId) || [];
    const incoming = this.graph.incoming.get(receiptId) || [];

    const result: ResolvedConnection[] = [];

    for (const edge of outgoing) {
      const target = this.dataset.receiptsMap.get(edge.toReceiptId);
      if (target) {
        result.push({ edge, targetReceipt: target, direction: 'outgoing' });
      }
    }

    for (const edge of incoming) {
      const target = this.dataset.receiptsMap.get(edge.fromReceiptId);
      if (target) {
        result.push({ edge, targetReceipt: target, direction: 'incoming' });
      }
    }

    // Sort confirmed first, then by strength descending
    return result.sort((a, b) => {
      if (a.edge.origin !== b.edge.origin) {
        return a.edge.origin === 'confirmed' ? -1 : 1;
      }
      return b.edge.strength - a.edge.strength;
    });
  }

  /** Returns neighbor receipts directly connected to receiptId */
  public getNeighbors(receiptId: string): Receipt[] {
    const edges = this.graph.neighbors.get(receiptId) || [];
    const neighborIds = new Set<string>();

    for (const e of edges) {
      if (e.fromReceiptId === receiptId) neighborIds.add(e.toReceiptId);
      else neighborIds.add(e.fromReceiptId);
    }

    const receipts: Receipt[] = [];
    for (const id of neighborIds) {
      const r = this.dataset.receiptsMap.get(id);
      if (r) receipts.push(r);
    }
    return receipts;
  }

  /** Returns all receipt IDs belonging to the same connected moment / component */
  public getMomentReceiptIds(receiptId: string, includeInferred = true): string[] {
    return getMomentReceiptIds(receiptId, this.graph, includeInferred);
  }

  /** Finds the parent Moment object for a receipt, if one exists */
  public getParentMoment(receiptId: string): Moment | undefined {
    return this.dataset.moments.find(m => m.receiptIds.includes(receiptId));
  }

  /**
   * "Why This Moment Matters" Causal Intelligence
   * Computes the causal role of any receipt in the narrative graph.
   */
  public getCausalInsight(receiptId: string): CausalInsight {
    const outgoing = this.graph.outgoing.get(receiptId) || [];
    const incoming = this.graph.incoming.get(receiptId) || [];
    const receipt = this.dataset.receiptsMap.get(receiptId);

    const connectionCount = outgoing.length + incoming.length;
    const allEdges = [...outgoing, ...incoming];
    const confirmedCount = allEdges.filter(e => e.origin === 'confirmed').length;
    const inferredCount = allEdges.filter(e => e.origin === 'inferred').length;

    // Turning Points: Key transformative milestones in the 9-month arc
    const turningPoints = new Set(['R004', 'R016', 'R030', 'R036', 'R046', 'R054']);
    if (turningPoints.has(receiptId)) {
      return {
        role: 'Turning Point',
        description: 'Marks a pivotal shift in creative direction, habit, or commitment.',
        connectionCount,
        confirmedCount,
        inferredCount,
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
      };
    }

    if (receipt?.type === 'place') {
      return {
        role: 'Anchor',
        description: 'Geographic anchor that grounds multiple events and creative moments.',
        connectionCount,
        confirmedCount,
        inferredCount,
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
      };
    }

    if (receipt?.type === 'note' && (incoming.length > 0 || receiptId === 'R055')) {
      return {
        role: 'Reflection',
        description: 'Introspective pause that captures the inner voice following an experience.',
        connectionCount,
        confirmedCount,
        inferredCount,
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
      };
    }

    if (incoming.length === 0 && outgoing.length > 0) {
      return {
        role: 'Trigger',
        description: 'Initiating spark that sets off a subsequent chain of actions or searches.',
        connectionCount,
        confirmedCount,
        inferredCount,
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
      };
    }

    if (incoming.length > 0 && outgoing.length > 0) {
      return {
        role: 'Catalyst',
        description: 'Bridge moment connecting a prior intent or experience to a new outcome.',
        connectionCount,
        confirmedCount,
        inferredCount,
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
      };
    }

    return {
      role: 'Independent',
      description: 'A quiet, standalone moment of observation.',
      connectionCount,
      confirmedCount,
      inferredCount,
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
    };
  }

  /** Total confirmed connections in graph */
  public get confirmedEdgeCount(): number {
    return this.graph.confirmedEdges.length;
  }

  /** Total inferred connections in graph */
  public get inferredEdgeCount(): number {
    return this.graph.inferredEdges.length;
  }
}

export const relationshipResolver = RelationshipResolver.getInstance();
