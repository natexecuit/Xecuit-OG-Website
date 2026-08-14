/**
 * Success Fee Calculator Functions
 */

import type {
  SimpleSuccessFeeInput,
  RetainerSuccessFeeInput,
  LehmanFeeInput,
  CalculationResult,
} from './types';

/**
 * Calculate simple percentage success fee
 */
export function calculateSimpleSuccessFee(
  input: SimpleSuccessFeeInput
): CalculationResult<number> {
  const fee = input.dealValue * (input.feePercentage / 100);

  return {
    result: fee,
    breakdown: {
      'Deal Value': input.dealValue,
      'Fee Percentage': input.feePercentage,
      'Success Fee': fee,
      'Total Fee': fee,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate retainer + success fee
 */
export function calculateRetainerSuccessFee(
  input: RetainerSuccessFeeInput
): CalculationResult<{ retainerFee: number; successFee: number; totalFee: number }> {
  // Calculate retainer fee based on frequency
  let retainerFee: number;
  switch (input.retainerFrequency) {
    case 'monthly':
      retainerFee = input.retainerAmount * input.retainerDuration;
      break;
    case 'quarterly':
      retainerFee = input.retainerAmount * (input.retainerDuration / 3);
      break;
    case 'upfront':
      retainerFee = input.retainerAmount;
      break;
    default:
      retainerFee = input.retainerAmount;
  }

  // Calculate success fee
  const successFee = input.dealValue * (input.feePercentage / 100);

  // Total fee
  const totalFee = retainerFee + successFee;

  return {
    result: { retainerFee, successFee, totalFee },
    breakdown: {
      'Retainer Fee': retainerFee,
      'Success Fee': successFee,
      'Total Fee': totalFee,
    },
    timestamp: new Date(),
  };
}

/**
 * Calculate Lehman / Reverse Lehman fee (sliding scale)
 */
export function calculateLehmanFee(
  input: LehmanFeeInput
): CalculationResult<{
  tierFees: number[];
  totalFee: number;
  effectiveRate: number;
}> {
  let remainingValue = input.dealValue;
  const tierFees: number[] = [];
  let totalFee = 0;

  for (const tier of input.tiers) {
    if (remainingValue <= 0) break;

    // Calculate the amount in this tier
    const tierMax = tier.max === null ? remainingValue : tier.max;
    const tierMin = tier.min;
    const tierRange = tierMax - tierMin;

    const amountInTier = Math.min(remainingValue, tierRange);
    const feeInTier = amountInTier * (tier.rate / 100);

    tierFees.push(feeInTier);
    totalFee += feeInTier;
    remainingValue -= amountInTier;
  }

  const effectiveRate = input.dealValue > 0 ? (totalFee / input.dealValue) * 100 : 0;

  return {
    result: {
      tierFees,
      totalFee,
      effectiveRate,
    },
    breakdown: {
      'Total Fee': totalFee,
      'Effective Rate': effectiveRate,
    },
    timestamp: new Date(),
  };
}

/**
 * Default Lehman fee tiers (common in M&A)
 */
export const DEFAULT_LEHMAN_TIERS = [
  { min: 0, max: 5000000, rate: 5 },
  { min: 5000000, max: 10000000, rate: 4 },
  { min: 10000000, max: 15000000, rate: 3 },
  { min: 15000000, max: 20000000, rate: 2 },
  { min: 20000000, max: null, rate: 1 },
];
