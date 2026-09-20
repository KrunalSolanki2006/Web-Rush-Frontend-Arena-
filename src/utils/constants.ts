/**
 * @module constants
 * @description Application-wide constants and configuration values.
 * Single source of truth for numeric ground-truth values from the dataset spec.
 */

/** Ground truth dataset constants from §2.3 of the problem specification */
export const DATASET = {
  /** Total number of life receipts in the dataset */
  TOTAL_RECEIPTS: 55,

  /** Total number of monthly chapters (January through September 2025) */
  CHAPTER_COUNT: 9,

  /** Number of confirmed causal connections (hard-coded in connections CSV) */
  CONFIRMED_EDGES: 29,

  /** Number of inferred thematic connections (curated to connect orphans) */
  INFERRED_EDGES: 14,

  /** Total confirmed + inferred edge count */
  TOTAL_EDGES: 43,

  /** Total documented purchase expenditure in Indian Rupees */
  PURCHASES_TOTAL_INR: 72808,

  /** Number of geolocated place receipts with lat/lon coordinates */
  GEOLOCATED_PLACES: 8,

  /** Number of connected moments (multi-receipt narrative chains) */
  CONNECTED_MOMENTS: 11,

  /** Date range: start of dataset */
  DATE_START: '2025-01-04',

  /** Date range: end of dataset */
  DATE_END: '2025-09-19',
} as const;

/** Receipt types with display order */
export const RECEIPT_TYPES = [
  'music',
  'movie',
  'place',
  'purchase',
  'photo',
  'message',
  'search',
  'event',
  'note',
] as const;

/** Month labels for 9-month arc (Jan 2025 through Sep 2025) */
export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
] as const;

/** Short month labels for compact display */
export const MONTH_SHORT_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
] as const;

/** Canonical themes identified across the 55-receipt dataset */
export const CANONICAL_THEMES = [
  'water',
  'light',
  'movement',
  'stillness',
  'seeing',
  'writing',
  'company',
] as const;

/** App route paths */
export const ROUTES = {
  HOME: '/',
  STORY: '/story',
  THREADS: '/threads',
  MAP: '/map',
  PATTERNS: '/patterns',
  ARCHIVE: '/archive',
  METHOD: '/method',
} as const;
