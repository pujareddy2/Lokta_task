/**
 * Formatting and Helper Utilities
 */

export function formatPercent(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(decimals).replace(/\.00$/, '')}%`;
}

export function formatRateRange(low: number, high: number): string {
  if (isNaN(low) || isNaN(high)) return 'N/A';
  if (Math.abs(low - high) < 0.05) {
    return `${low.toFixed(2)}%`;
  }
  return `${low.toFixed(2)}% – ${high.toFixed(2)}%`;
}

export function formatTenureYearsMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0 && remMonths > 0) {
    return `${years} yr ${remMonths} mo`;
  }
  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  return `${months} months`;
}
