/**
 * Type definitions for calculator calculations
 */

// Success Fee Calculator Types
export interface SimpleSuccessFeeInput {
  dealValue: number;
  feePercentage: number;
}

export interface RetainerSuccessFeeInput {
  dealValue: number;
  feePercentage: number;
  retainerAmount: number;
  retainerFrequency: 'monthly' | 'quarterly' | 'upfront';
  retainerDuration: number; // in months
}

export interface LehmanFeeTier {
  min: number;
  max: number | null; // null means no upper limit (last tier)
  rate: number;
}

export interface LehmanFeeInput {
  dealValue: number;
  tiers: LehmanFeeTier[];
}

// Financing Calculator Types
export interface InterestExpenseInput {
  principal: number;
  interestRate: number;
  term: number; // in years
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
}

export interface BlendedRateInput {
  tranches: Array<{
    principal: number;
    rate: number;
  }>;
}

export interface DSCRInput {
  annualNOI: number;
  annualDebtService: number;
}

export interface LeverageRatioInput {
  totalDebt: number;
  ebitda: number;
}

// Valuation Calculator Types
export interface EBITDAMarginInput {
  ebitda: number;
  revenue: number;
}

export interface ImpliedValuationInput {
  ebitda: number;
  multiple: number;
}

export interface TradingComp {
  name: string;
  ebitda: number;
  multiple: number;
}

export interface TradingCompsInput {
  subjectEBITDA: number;
  comps: TradingComp[];
}

// Result Types
export interface CalculationResult<T> {
  result: T;
  breakdown?: Record<string, number>;
  timestamp: Date;
}
