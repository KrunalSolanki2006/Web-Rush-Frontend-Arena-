import { describe, it, expect } from 'vitest';
import {
  parseDateLocal,
  parseDurationMin,
  getTimeOfDayBand,
  humanizeDuration,
  formatINR,
} from '../index';

describe('Time Utilities', () => {
  it('parses local dates without timezone drift', () => {
    const d = parseDateLocal('2025-01-04 21:10');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0); // Jan
    expect(d.getDate()).toBe(4);
    expect(d.getHours()).toBe(21);
    expect(d.getMinutes()).toBe(10);
  });

  it('handles mm.ss duration parsing with dropped zero padding', () => {
    // 4.03 -> 4m 3s -> 243s
    const dur1 = parseDurationMin('4.03');
    expect(dur1.seconds).toBe(243);
    expect(dur1.formatted).toBe('4:03');

    // 5.2 -> 5m 20s -> 320s
    const dur2 = parseDurationMin('5.2');
    expect(dur2.seconds).toBe(320);
    expect(dur2.formatted).toBe('5:20');

    // 3.58 -> 3m 58s -> 238s
    const dur3 = parseDurationMin('3.58');
    expect(dur3.seconds).toBe(238);
    expect(dur3.formatted).toBe('3:58');
  });

  it('correctly maps time of day bands per §2.8', () => {
    expect(getTimeOfDayBand(parseDateLocal('2025-01-04 22:30'))).toBe('night');
    expect(getTimeOfDayBand(parseDateLocal('2025-01-05 02:15'))).toBe('night');
    expect(getTimeOfDayBand(parseDateLocal('2025-05-10 06:15'))).toBe('morning');
    expect(getTimeOfDayBand(parseDateLocal('2025-05-09 13:05'))).toBe('afternoon');
    expect(getTimeOfDayBand(parseDateLocal('2025-02-02 20:24'))).toBe('evening');
  });

  it('formats humanized durations', () => {
    expect(humanizeDuration(35 * 60 * 1000)).toBe('35 min');
    expect(humanizeDuration((10 * 60 + 50) * 60 * 1000)).toBe('10 h 50 min');
    expect(humanizeDuration((5 * 24 + 8) * 60 * 60 * 1000)).toBe('5 d 8 h');
  });

  it('formats INR currency', () => {
    const formatted = formatINR(72808);
    expect(formatted).toContain('72,808');
  });
});
