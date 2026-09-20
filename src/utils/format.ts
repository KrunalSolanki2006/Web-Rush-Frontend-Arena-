/**
 * @module format
 * @description Formatting utilities for currency, numbers, dates, and strings.
 * Centralizes all display-layer transformations to keep components pure.
 */

/** Formats a number as Indian Rupee currency string (e.g. ₹72,808) */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Formats a number with comma separators (e.g. 1,234) */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-IN');
}

/**
 * Formats a percentage as a display string.
 * @param value - ratio from 0 to 1 (e.g. 0.75)
 * @param decimals - decimal places (default 0)
 */
export function formatPercent(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Truncates a string to maxLen, appending "…" if needed */
export function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

/** Title-cases a string (e.g. "hello world" → "Hello World") */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, ch => ch.toUpperCase());
}

/** Converts a tag slug to a human-readable label (e.g. "photo-walk" → "Photo Walk") */
export function tagToLabel(tag: string): string {
  return titleCase(tag.replace(/[-_]/g, ' '));
}

/** Pluralizes a word given a count (e.g. pluralize("receipt", 2) → "receipts") */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural ?? `${word}s`;
}

/** Returns a receipt ID padded to canonical form (e.g. "1" → "R001") */
export function toReceiptId(raw: string | number): string {
  const n = typeof raw === 'string' ? parseInt(raw.replace(/\D/g, ''), 10) : raw;
  if (!Number.isFinite(n) || n <= 0) return '';
  return `R${String(n).padStart(3, '0')}`;
}

/** Normalizes a search query string for comparison */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}
