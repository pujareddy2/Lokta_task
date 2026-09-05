/**
 * Indian Rupee & Number Formatting Utilities
 */

export function formatINR(value: number | null | undefined, options?: { compact?: boolean; hideSymbol?: boolean }): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0';
  }

  const rounded = Math.round(value);
  const symbol = options?.hideSymbol ? '' : '₹';

  if (options?.compact) {
    if (Math.abs(rounded) >= 10000000) {
      const cr = (rounded / 10000000).toFixed(2).replace(/\.00$/, '');
      return `${symbol}${cr} Cr`;
    }
    if (Math.abs(rounded) >= 100000) {
      const lakh = (rounded / 100000).toFixed(2).replace(/\.00$/, '');
      return `${symbol}${lakh} L`;
    }
    if (Math.abs(rounded) >= 1000) {
      const k = (rounded / 1000).toFixed(1).replace(/\.0$/, '');
      return `${symbol}${k} k`;
    }
  }

  // Standard Indian comma separator: e.g. 12,34,567
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  let result = '';
  if (absStr.length <= 3) {
    result = absStr;
  } else {
    const last3 = absStr.substring(absStr.length - 3);
    const remaining = absStr.substring(0, absStr.length - 3);
    const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedRemaining},${last3}`;
  }

  return `${isNegative ? '-' : ''}${symbol}${result}`;
}

export function formatINRLakhWords(value: number): string {
  if (value >= 10000000) {
    const cr = (value / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Crore`;
  }
  if (value >= 100000) {
    const lakh = (value / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh`;
  }
  return formatINR(value);
}

export function parseINRInput(input: string): number {
  if (!input) return 0;
  // Strip non-digits
  const clean = input.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}
