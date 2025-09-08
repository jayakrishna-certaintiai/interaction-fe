import { formatNumber } from '../FormatNumber';

describe('formatNumber', () => {
  test('formats thousands with k', () => {
    expect(formatNumber(1000)).toBe('1k');
    expect(formatNumber(2500)).toBe('2.5k');
  });

  test('formats millions with m', () => {
    expect(formatNumber(1500000)).toBe('1.5m');
  });

  test('formats billions with b', () => {
    expect(formatNumber(2500000000)).toBe('2.5b');
  });

  test('returns original for values < 1000', () => {
    expect(formatNumber(999)).toBe(999);
  });
});
