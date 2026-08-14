/**
 * Currency and percentage formatting utilities for calculator display
 */

/**
 * Format a number as currency with proper commas and decimals
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '$0';

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return formatted;
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0.00%';

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators (no currency symbol)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse a string input to a number, handling currency symbols and commas
 */
export function parseInputValue(value: string): number {
  if (!value) return 0;

  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format input value for display (adds commas while typing)
 */
export function formatInputValue(value: string): string {
  const num = parseInputValue(value);
  if (num === 0) return '';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
