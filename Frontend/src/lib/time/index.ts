import type { TimeOfDayBand } from '../../types';

/**
 * Parses timestamp string "YYYY-MM-DD HH:mm" into a local Date without timezone shift.
 * Never uses UTC or ISO string parsing to ensure wall-clock consistency.
 */
export function parseDateLocal(timestampStr: string): Date {
  const [datePart, timePart] = timestampStr.trim().split(' ');
  const [yearStr, monthStr, dayStr] = (datePart || '2025-01-01').split('-');
  const [hourStr, minStr] = (timePart || '00:00').split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  return new Date(year, month, day, hour, minute, 0, 0);
}

/**
 * Parses music.duration_min which is formatted as mm.ss (not decimal minutes).
 * "4.03" means 4 minutes and 3 seconds -> 243 seconds.
 * "5.2" means 5 minutes and 20 seconds -> 320 seconds (trailing zero dropped).
 */
export function parseDurationMin(rawDuration: string): { seconds: number; formatted: string } {
  if (!rawDuration) return { seconds: 0, formatted: '0:00' };

  const parts = rawDuration.trim().split('.');
  const mins = parseInt(parts[0], 10) || 0;
  let secs = 0;

  if (parts.length > 1) {
    let secStr = parts[1];
    if (secStr.length === 1) {
      secStr += '0'; // pad right: "2" -> "20"
    }
    secs = parseInt(secStr.slice(0, 2), 10) || 0;
  }

  const totalSeconds = mins * 60 + secs;
  const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
  return { seconds: totalSeconds, formatted };
}

/**
 * Determines time-of-day band per §2.8 specification:
 * - night: 21:00–04:59
 * - morning: 05:00–11:59
 * - afternoon: 12:00–17:59
 * - evening: 18:00–20:59
 */
export function getTimeOfDayBand(date: Date): TimeOfDayBand {
  const hour = date.getHours();
  if (hour >= 21 || hour < 5) return 'night';
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Humanizes time delta in milliseconds into concise readable string.
 * e.g., "35 min", "10 h 50 min", "5 d 8 h"
 */
export function humanizeDuration(ms: number): string {
  const absMs = Math.abs(ms);
  const totalMinutes = Math.round(absMs / (60 * 1000));

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  if (hours < 24) {
    return remainingMins > 0 ? `${hours} h ${remainingMins} min` : `${hours} h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days} d ${remainingHours} h` : `${days} d`;
}

/**
 * Formats amount in Indian Rupee format (en-IN).
 * e.g., 72808 -> "₹72,808"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1] || '';
}

export function formatDateLabel(date: Date): string {
  const m = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

export function formatTimeLabel(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
