/**
 * Valuation Calculator Functions
 */

import type {
  EBITDAMarginInput,
  ImpliedValuationInput,
  TradingCompsInput,
  CalculationResult,
} from './types';

/**
 * Calculate EBITDA margin percentage
 */
export function calculateEBITDAMargin(
  input: EBITDAMarginInput
): CalculationResult<{
  margin: number;
  status: 'healthy' | 'adequate' | 'low';
}> {
  const margin = input.revenue > 0 ? (input.ebitda / input.revenue) * 100 : 0;

  let status: 'healthy' | 'adequate' | 'low';
  if (margin >= 20) {
    status = 'healthy';
  } else if (margin >= 10) {
    status = 'adequate';
  } else {
    status = 'low';
  }

  return {
    result: { margin, status },
    breakdown: {
      'Revenue': input.revenue,
      'EBITDA': input.ebitda,
      'Margin %': margin,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate implied enterprise value from EBITDA multiple
 */
export function calculateImpliedValuation(
  input: ImpliedValuationInput
): CalculationResult<{
  enterpriseValue: number;
  multiple: number;
}> {
  const enterpriseValue = input.ebitda * input.multiple;

  return {
    result: { enterpriseValue, multiple: input.multiple },
    breakdown: {
      'EBITDA': input.ebitda,
      'Multiple': input.multiple,
      'Enterprise Value': enterpriseValue,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate valuation range using trading comps
 */
export function calculateTradingComps(
  input: TradingCompsInput
): CalculationResult<{
  minValuation: number;
  maxValuation: number;
  avgMultiple: number;
  impliedValuation: number;
  comps: Array<{
    name: string;
    multiple: number;
    valuation: number;
  }>;
}> {
  const validComps = input.comps.filter(c => c.ebitda > 0);
  const multiples = validComps.map(c => c.multiple);

  const avgMultiple =
    multiples.length > 0
      ? multiples.reduce((sum, m) => sum + m, 0) / multiples.length
      : 0;

  const minMultiple = multiples.length > 0 ? Math.min(...multiples) : 0;
  const maxMultiple = multiples.length > 0 ? Math.max(...multiples) : 0;

  const minValuation = input.subjectEBITDA * minMultiple;
  const maxValuation = input.subjectEBITDA * maxMultiple;
  const impliedValuation = input.subjectEBITDA * avgMultiple;

  const comps = validComps.map(comp => ({
    name: comp.name,
    multiple: comp.multiple,
    valuation: comp.ebitda * comp.multiple,
  }));

  return {
    result: {
      minValuation,
      maxValuation,
      avgMultiple,
      impliedValuation,
      comps,
    },
    breakdown: {
      'Subject EBITDA': input.subjectEBITDA,
      'Average Multiple': avgMultiple,
      'Min Valuation': minValuation,
      'Implied Valuation': impliedValuation,
      'Max Valuation': maxValuation,
    },
    timestamp: new Date(),
  };
}
