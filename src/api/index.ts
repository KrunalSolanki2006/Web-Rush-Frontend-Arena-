/**
 * @module api
 * @description Static data API layer — provides type-safe accessors for
 * the fixed 55-receipt dataset bundled at build time.
 *
 * NOTE: This project is deliberately frontend-only with zero backend services.
 * All "API" calls resolve synchronously from in-memory data loaded from CSV
 * files at build time via `src/lib/dataset/loaders.ts`.
 *
 * This module provides a semantic boundary that mirrors a real REST API
 * interface, making the codebase portable to a future server-backed
 * implementation without changing consumer code.
 */

import { receiptRepository } from '../services/ReceiptRepository';
import { relationshipResolver } from '../services/RelationshipResolver';
import { insightService } from '../services/InsightService';
import type { Receipt, Chapter, Moment, PlaceReceipt } from '../types';
import type { CausalInsight, ResolvedConnection } from '../services/RelationshipResolver';
import type { IntentActionLag, SpendingBreakdown, MorningShiftData, InnerVoiceItem } from '../types';
import type { ThemeRecurrenceMatrix } from '../services/InsightService';

/**
 * Receipts API — CRUD-like accessors for the 55 life receipts.
 */
export const receiptsApi = {
  /** Returns all 55 receipts, chronologically ordered */
  getAll: (): Receipt[] => receiptRepository.getAll(),

  /** Returns a single receipt by ID (e.g. "R001"), or undefined */
  getById: (id: string): Receipt | undefined => receiptRepository.getById(id),

  /** Returns all receipts of a given type */
  getByType: <T extends Receipt = Receipt>(type: Receipt['type']): T[] =>
    receiptRepository.getByType<T>(type),

  /** Returns all receipts in a given month (1–9) */
  getByMonth: (month: number): Receipt[] => receiptRepository.getByMonth(month),

  /** Returns all 9 monthly chapters */
  getChapters: (): Chapter[] => receiptRepository.getChapters(),

  /** Returns all 11 connected moments */
  getMoments: (): Moment[] => receiptRepository.getMoments(),

  /** Returns 8 geolocated place receipts */
  getPlaces: (): PlaceReceipt[] => receiptRepository.getPlaces(),

  /** Returns total documented purchase spend in INR */
  getPurchasesTotal: (): number => receiptRepository.getPurchasesTotal(),

  /** Returns total receipt count (55) */
  count: (): number => receiptRepository.count,
} as const;

/**
 * Connections API — graph navigation and causal intelligence.
 */
export const connectionsApi = {
  /** Returns all connections for a receipt (incoming + outgoing) */
  getConnections: (receiptId: string): ResolvedConnection[] =>
    relationshipResolver.getConnections(receiptId),

  /** Returns neighbor receipts directly connected to receiptId */
  getNeighbors: (receiptId: string): Receipt[] =>
    relationshipResolver.getNeighbors(receiptId),

  /** Returns the parent Moment for a receipt, if one exists */
  getParentMoment: (receiptId: string): Moment | undefined =>
    relationshipResolver.getParentMoment(receiptId),

  /** Returns causal intelligence for a receipt (role + description) */
  getCausalInsight: (receiptId: string): CausalInsight =>
    relationshipResolver.getCausalInsight(receiptId),

  /** Total confirmed edge count (29) */
  confirmedCount: (): number => relationshipResolver.confirmedEdgeCount,

  /** Total inferred edge count (14) */
  inferredCount: (): number => relationshipResolver.inferredEdgeCount,
} as const;

/**
 * Insights API — computed behavioral analytics across all 55 receipts.
 */
export const insightsApi = {
  /** Intent-to-action lags across confirmed search-to-purchase chains */
  getIntentActionLags: (): IntentActionLag[] => insightService.getIntentActionLags(),

  /** Spending breakdown by category */
  getSpendingBreakdown: (): SpendingBreakdown => insightService.getSpendingBreakdown(),

  /** Circadian shift analysis: morning vs night activity across chapters */
  getMorningShift: (): MorningShiftData => insightService.getMorningShift(),

  /** All 6 inner voice (note) receipts in chronological sequence */
  getInnerVoice: (): InnerVoiceItem[] => insightService.getInnerVoice(),

  /** 7-theme recurrence matrix across 9 monthly chapters */
  getThemeMatrix: (): ThemeRecurrenceMatrix => insightService.getThemeMatrix(),
} as const;
