import type {
  InnerVoiceItem,
  IntentActionLag,
  MorningShiftData,
  SpendingBreakdown,
} from '../types';
import { getDataset, type Dataset } from '../lib/dataset';
import {
  computeInnerVoice,
  computeIntentActionLags,
  computeMorningShift,
  computeSpendingBreakdown,
} from '../lib/insights';
import { matchThemes } from '../lib/dataset/chapters';

export const CANONICAL_THEMES = [
  'water',
  'light',
  'movement',
  'stillness',
  'seeing',
  'writing',
  'company',
] as const;

export type CanonicalTheme = (typeof CANONICAL_THEMES)[number];

export interface ThemeRecurrenceMatrix {
  themes: readonly string[];
  matrix: Record<string, number[]>; // theme -> [month1_count, ..., month9_count]
  totalOccurrences: Record<string, number>;
}

/**
 * InsightService provides memoized, centralized derived analytical metrics
 * across all 55 life receipts.
 */
export class InsightService {
  private static instance: InsightService | null = null;
  private dataset: Dataset;

  // Cached derived calculations
  private cachedLags: IntentActionLag[] | null = null;
  private cachedSpending: SpendingBreakdown | null = null;
  private cachedMorningShift: MorningShiftData | null = null;
  private cachedInnerVoice: InnerVoiceItem[] | null = null;
  private cachedThemeMatrix: ThemeRecurrenceMatrix | null = null;

  private constructor() {
    this.dataset = getDataset();
  }

  public static getInstance(): InsightService {
    if (!InsightService.instance) {
      InsightService.instance = new InsightService();
    }
    return InsightService.instance;
  }

  /** Intent-to-Action Lags across confirmed search connections */
  public getIntentActionLags(): IntentActionLag[] {
    if (!this.cachedLags) {
      this.cachedLags = computeIntentActionLags(this.dataset);
    }
    return this.cachedLags;
  }

  /** Spending concentration & camera purchase breakdown */
  public getSpendingBreakdown(): SpendingBreakdown {
    if (!this.cachedSpending) {
      this.cachedSpending = computeSpendingBreakdown(this.dataset);
    }
    return this.cachedSpending;
  }

  /** Circadian morning vs night shift across chapters */
  public getMorningShift(): MorningShiftData {
    if (!this.cachedMorningShift) {
      this.cachedMorningShift = computeMorningShift(this.dataset);
    }
    return this.cachedMorningShift;
  }

  /** The 6 inner voice notes in chronological sequence */
  public getInnerVoice(): InnerVoiceItem[] {
    if (!this.cachedInnerVoice) {
      this.cachedInnerVoice = computeInnerVoice(this.dataset);
    }
    return this.cachedInnerVoice;
  }

  /**
   * Computes the 7-theme recurrence matrix across the 9 monthly chapters.
   * Centralized here to avoid repetitive nested loops in UI components.
   */
  public getThemeMatrix(): ThemeRecurrenceMatrix {
    if (!this.cachedThemeMatrix) {
      const matrix: Record<string, number[]> = {};
      const totalOccurrences: Record<string, number> = {};

      for (const t of CANONICAL_THEMES) {
        matrix[t] = Array(9).fill(0);
        totalOccurrences[t] = 0;
      }

      for (const r of this.dataset.receipts) {
        const themes = matchThemes(r);
        for (const t of themes) {
          if (matrix[t] && r.month >= 1 && r.month <= 9) {
            matrix[t][r.month - 1]++;
            totalOccurrences[t]++;
          }
        }
      }

      this.cachedThemeMatrix = {
        themes: CANONICAL_THEMES,
        matrix,
        totalOccurrences,
      };
    }
    return this.cachedThemeMatrix;
  }
}

export const insightService = InsightService.getInstance();
