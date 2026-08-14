/**
 * Financing Calculator Functions
 */

import type {
  InterestExpenseInput,
  BlendedRateInput,
  DSCRInput,
  LeverageRatioInput,
  CalculationResult,
} from './types';

/**
 * Calculate interest expense and payment
 */
export function calculateInterestExpense(
  input: InterestExpenseInput
): CalculationResult<{
  monthlyPayment: number;
  quarterlyPayment: number;
  annualPayment: number;
  totalInterest: number;
  totalPayment: number;
}> {
  const { principal, interestRate, term, paymentFrequency } = input;

  // Convert annual rate to period rate
  const annualRate = interestRate / 100;
  let periodsPerYear = 12;
  let totalPeriods = term * periodsPerYear;

  switch (paymentFrequency) {
    case 'monthly':
      periodsPerYear = 12;
      totalPeriods = term * 12;
      break;
    case 'quarterly':
      periodsPerYear = 4;
      totalPeriods = term * 4;
      break;
    case 'annual':
      periodsPerYear = 1;
      totalPeriods = term;
      break;
  }

  const periodRate = annualRate / periodsPerYear;

  // Calculate payment using standard amortization formula
  let periodPayment: number;
  if (periodRate === 0) {
    periodPayment = principal / totalPeriods;
  } else {
    periodPayment =
      (principal * periodRate * Math.pow(1 + periodRate, totalPeriods)) /
      (Math.pow(1 + periodRate, totalPeriods) - 1);
  }

  const totalPayment = periodPayment * totalPeriods;
  const totalInterest = totalPayment - principal;

  // Calculate all frequencies
  const monthlyPayment = paymentFrequency === 'monthly'
    ? periodPayment
    : principal * (annualRate / 12) / (1 - Math.pow(1 + annualRate / 12, -term * 12));

  const quarterlyPayment = paymentFrequency === 'quarterly'
    ? periodPayment
    : principal * (annualRate / 4) / (1 - Math.pow(1 + annualRate / 4, -term * 4));

  const annualPayment = paymentFrequency === 'annual'
    ? periodPayment
    : principal * annualRate / (1 - Math.pow(1 + annualRate, -term));

  return {
    result: {
      monthlyPayment,
      quarterlyPayment,
      annualPayment,
      totalInterest,
      totalPayment,
    },
    breakdown: {
      'Principal': principal,
      'Annual Rate': interestRate,
      'Total Interest': totalInterest,
      'Total Payment': totalPayment,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate blended interest rate across multiple tranches
 */
export function calculateBlendedRate(
  input: BlendedRateInput
): CalculationResult<{
  blendedRate: number;
  totalPrincipal: number;
  annualInterest: number;
}> {
  const totalPrincipal = input.tranches.reduce((sum, t) => sum + t.principal, 0);

  let weightedRateSum = 0;
  for (const tranche of input.tranches) {
    weightedRateSum += (tranche.principal / totalPrincipal) * tranche.rate;
  }

  const blendedRate = totalPrincipal > 0 ? weightedRateSum : 0;
  const annualInterest = totalPrincipal * (blendedRate / 100);

  return {
    result: {
      blendedRate,
      totalPrincipal,
      annualInterest,
    },
    breakdown: {
      'Total Principal': totalPrincipal,
      'Blended Rate': blendedRate,
      'Annual Interest': annualInterest,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 */
export function calculateDSCR(
  input: DSCRInput
): CalculationResult<{
  dscr: number;
  coverageStatus: 'healthy' | 'adequate' | 'concerning';
}> {
  const dscr = input.annualDebtService > 0 ? input.annualNOI / input.annualDebtService : 0;

  let coverageStatus: 'healthy' | 'adequate' | 'concerning';
  if (dscr >= 1.5) {
    coverageStatus = 'healthy';
  } else if (dscr >= 1.25) {
    coverageStatus = 'adequate';
  } else {
    coverageStatus = 'concerning';
  }

  return {
    result: { dscr, coverageStatus },
    breakdown: {
      'Annual NOI': input.annualNOI,
      'Annual Debt Service': input.annualDebtService,
      'DSCR': dscr,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate leverage ratio (Debt / EBITDA)
 */
export function calculateLeverageRatio(
  input: LeverageRatioInput
): CalculationResult<{
  leverageMultiple: number;
  leverageStatus: 'conservative' | 'moderate' | 'aggressive';
}> {
  const leverageMultiple = input.ebitda > 0 ? input.totalDebt / input.ebitda : 0;

  let leverageStatus: 'conservative' | 'moderate' | 'aggressive';
  if (leverageMultiple <= 2.0) {
    leverageStatus = 'conservative';
  } else if (leverageMultiple <= 4.0) {
    leverageStatus = 'moderate';
  } else {
    leverageStatus = 'aggressive';
  }

  return {
    result: { leverageMultiple, leverageStatus },
    breakdown: {
      'Total Debt': input.totalDebt,
      'EBITDA': input.ebitda,
      'Leverage Multiple': leverageMultiple,
    },
    timestamp: new Date(),
  };
}
