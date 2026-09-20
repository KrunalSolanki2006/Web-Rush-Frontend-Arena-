import { describe, it, expect } from 'vitest';
import { parseCSV } from '../index';

describe('RFC-4180 CSV Parser', () => {
  it('parses simple unquoted CSV lines', () => {
    const csv = 'id,name,city\n1,Alice,Mumbai\n2,Bob,Delhi';
    const res = parseCSV(csv);
    expect(res).toHaveLength(2);
    expect(res[0]).toEqual({ id: '1', name: 'Alice', city: 'Mumbai' });
  });

  it('handles quoted fields with commas correctly', () => {
    const csv = 'receipt_id,location\nR002,"Bandra, Mumbai"\nR009,South Mumbai';
    const res = parseCSV(csv);
    expect(res).toHaveLength(2);
    expect(res[0].location).toBe('Bandra, Mumbai');
    expect(res[1].location).toBe('South Mumbai');
  });

  it('handles escaped double quotes correctly', () => {
    const csv = 'id,note\n1,"Said ""hello"" to friend"\n2,Normal text';
    const res = parseCSV(csv);
    expect(res).toHaveLength(2);
    expect(res[0].note).toBe('Said "hello" to friend');
  });

  it('handles empty text gracefully', () => {
    expect(parseCSV('')).toEqual([]);
    expect(parseCSV('   \n  ')).toEqual([]);
  });
});
