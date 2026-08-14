/**
 * M&A Deal Analysis Calculator Functions
 * Comprehensive deal viability and return analysis
 */

export interface DealInputs {
  // Business Financials
  revenue: number;
  ttmEBITDA: number;

  // Deal Structure
  purchasePrice: number;
  buyerCashInjection: number;
  rolloverEquity: number; // % of equity that seller keeps
  earnoutAmount: number;
  earnoutYears: number;

  // Financing Structure
  seniorDebt: {
    amount: number;
    interestRate: number;
    term: number;
  };
  subDebt?: {
    amount: number;
    interestRate: number;
    term: number;
  };
  mezzanineDebt?: {
    amount: number;
    interestRate: number;
    term: number;
    currentRatioOnly?: boolean; // If true, only pays interest (PIK)
  };
  sellerFinancing?: {
    amount: number;
    interestRate: number;
    term: number;
    deferredMonths?: number; // Months before payments start
  };

  // Projections
  projectedRevenueGrowth: number; // % annually
  projectedEBITDAMargin: number; // % of revenue
  projectionYears: number;
}

export interface MonthlyProjection {
  month: number;
  year: number;
  revenue: number;
  ebitda: number;
  debtService: {
    senior: number;
    sub: number;
    mezzanine: number;
    seller: number;
    total: number;
  };
  dscr: number;
  leverageRatio: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

export interface AnnualProjection {
  year: number;
  revenue: number;
  ebitda: number;
  debtService: number;
  dscr: number;
  leverageRatio: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  equityValue: number;
}

export interface ReturnMetrics {
  moic: number; // Multiple of Invested Capital
  roi: number; // Return on Investment (%)
  irr: number; // Internal Rate of Return (%)
  paybackPeriod: number; // Years
  exitValue: number; // Projected exit value
  exitMultiple: number; // Exit multiple of invested capital
}

export interface DealHealth {
  overallStatus: 'healthy' | 'moderate' | 'risky';
  dscrStrength: 'strong' | 'adequate' | 'weak';
  leverageLevel: 'conservative' | 'moderate' | 'aggressive';
  debtCapacity: number; // Maximum debt the business can support
  debtCapacityUtilization: number; // % of capacity used
  monthlyAverageDSCR: number;
  weightedAverageCostOfCapital: number; // %
}

export interface DealAnalysisResult {
  inputs: DealInputs;
  projections: {
    monthly: MonthlyProjection[];
    annual: AnnualProjection[];
  };
  returns: ReturnMetrics;
  health: DealHealth;
  dealStructure: {
    totalEnterpriseValue: number;
    totalDebt: number;
    totalEquity: number;
    sellerProceeds: {
      upfront: number;
      rollover: number;
      earnout: number;
      total: number;
    };
    buyerCashInvested: number;
    capitalizationTable: {
      seniorDebt: number;
      subDebt: number;
      mezzanineDebt: number;
      sellerFinancing: number;
      totalDebt: number;
      buyerEquity: number;
      sellerRolloverEquity: number;
      totalEquity: number;
    };
  };
}

/**
 * Calculate monthly payment for amortizing loan
 */
function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) return principal / numPayments;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
}

/**
 * Calculate interest-only payment
 */
function calculateInterestOnlyPayment(principal: number, annualRate: number): number {
  return (principal * annualRate / 100) / 12;
}

/**
 * Calculate remaining balance at a given month
 */
function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  month: number
): number {
  if (month <= 0) return principal;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);

  if (month >= numPayments) return 0;

  // Remaining balance formula
  let remaining = principal;
  for (let i = 0; i < month; i++) {
    const interestPayment = remaining * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remaining -= principalPayment;
  }

  return Math.max(0, remaining);
}

/**
 * Calculate comprehensive M&A deal analysis
 */
export function calculateMADealAnalysis(inputs: DealInputs): DealAnalysisResult {
  // Build capitalization table
  const capitalization = {
    seniorDebt: inputs.seniorDebt.amount,
    subDebt: inputs.subDebt?.amount || 0,
    mezzanineDebt: inputs.mezzanineDebt?.amount || 0,
    sellerFinancing: inputs.sellerFinancing?.amount || 0,
    totalDebt: 0,
    buyerEquity: inputs.buyerCashInjection,
    sellerRolloverEquity: 0,
    totalEquity: 0,
  };

  capitalization.totalDebt =
    capitalization.seniorDebt +
    capitalization.subDebt +
    capitalization.mezzanineDebt +
    capitalization.sellerFinancing;

  // Calculate seller rollover equity
  const rolloverAmount = (inputs.purchasePrice * inputs.rolloverEquity) / 100;
  capitalization.sellerRolloverEquity = rolloverAmount;

  // Calculate total equity
  const totalEquityRequired = inputs.purchasePrice - capitalization.totalDebt;
  capitalization.totalEquity = totalEquityRequired;

  // Seller proceeds calculation
  const sellerProceeds = {
    upfront: inputs.purchasePrice - capitalization.sellerFinancing - rolloverAmount,
    rollover: rolloverAmount,
    earnout: inputs.earnoutAmount,
    total: 0,
  };
  sellerProceeds.total = sellerProceeds.upfront + sellerProceeds.rollover + inputs.earnoutAmount;

  // Generate monthly projections
  const monthlyProjections: MonthlyProjection[] = [];
  const annualProjections: AnnualProjection[] = [];

  let cumulativeCashFlow = 0;
  const totalMonths = inputs.projectionYears * 12;

  for (let month = 1; month <= totalMonths; month++) {
    const year = Math.ceil(month / 12);
    const yearFraction = (month - 1) / 12;

    // Project revenue and EBITDA with growth
    const revenueGrowthFactor = Math.pow(1 + inputs.projectedRevenueGrowth / 100, yearFraction);
    const projectedRevenue = inputs.revenue * revenueGrowthFactor;

    const projectedEBITDA = projectedRevenue * (inputs.projectedEBITDAMargin / 100);

    // Calculate debt service for each tranche
    let seniorDebtService = 0;
    let subDebtService = 0;
    let mezzanineDebtService = 0;
    let sellerDebtService = 0;

    // Senior debt service
    if (month <= inputs.seniorDebt.term * 12) {
      seniorDebtService = calculateMonthlyPayment(
        inputs.seniorDebt.amount,
        inputs.seniorDebt.interestRate,
        inputs.seniorDebt.term
      );
    }

    // Sub debt service
    if (inputs.subDebt && month <= inputs.subDebt.term * 12) {
      subDebtService = calculateMonthlyPayment(
        inputs.subDebt.amount,
        inputs.subDebt.interestRate,
        inputs.subDebt.term
      );
    }

    // Mezzanine debt service (may be PIK - current ratio only)
    if (inputs.mezzanineDebt && month <= inputs.mezzanineDebt.term * 12) {
      if (inputs.mezzanineDebt.currentRatioOnly) {
        mezzanineDebtService = calculateInterestOnlyPayment(
          inputs.mezzanineDebt.amount,
          inputs.mezzanineDebt.interestRate
        );
      } else {
        mezzanineDebtService = calculateMonthlyPayment(
          inputs.mezzanineDebt.amount,
          inputs.mezzanineDebt.interestRate,
          inputs.mezzanineDebt.term
        );
      }
    }

    // Seller financing (may have deferred period)
    if (inputs.sellerFinancing && month > (inputs.sellerFinancing.deferredMonths || 0)) {
      const sellerMonth = month - (inputs.sellerFinancing.deferredMonths || 0);
      if (sellerMonth <= inputs.sellerFinancing.term * 12) {
        sellerDebtService = calculateMonthlyPayment(
          inputs.sellerFinancing.amount,
          inputs.sellerFinancing.interestRate,
          inputs.sellerFinancing.term
        );
      }
    }

    const totalDebtService = seniorDebtService + subDebtService + mezzanineDebtService + sellerDebtService;

    // Calculate DSCR (annualized)
    const annualizedEBITDA = projectedEBITDA;
    const annualizedDebtService = totalDebtService * 12;
    const dscr = annualizedDebtService > 0 ? annualizedEBITDA / annualizedDebtService : 0;

    // Calculate leverage ratio
    const remainingSeniorBalance = calculateRemainingBalance(
      inputs.seniorDebt.amount,
      inputs.seniorDebt.interestRate,
      inputs.seniorDebt.term,
      month
    );
    const remainingSubBalance = inputs.subDebt
      ? calculateRemainingBalance(
          inputs.subDebt.amount,
          inputs.subDebt.interestRate,
          inputs.subDebt.term,
          month
        )
      : 0;
    const remainingMezzBalance = inputs.mezzanineDebt
      ? calculateRemainingBalance(
          inputs.mezzanineDebt.amount,
          inputs.mezzanineDebt.interestRate,
          inputs.mezzanineDebt.term,
          month
        )
      : 0;
    const remainingSellerBalance = inputs.sellerFinancing
      ? calculateRemainingBalance(
          inputs.sellerFinancing.amount,
          inputs.sellerFinancing.interestRate,
          inputs.sellerFinancing.term,
          month - (inputs.sellerFinancing.deferredMonths || 0)
        )
      : 0;

    const totalRemainingDebt =
      remainingSeniorBalance + remainingSubBalance + remainingMezzBalance + remainingSellerBalance;

    const leverageRatio = projectedEBITDA > 0 ? totalRemainingDebt / projectedEBITDA : 0;

    // Calculate cash flow
    const cashFlow = projectedEBITDA / 12 - totalDebtService;
    cumulativeCashFlow += cashFlow;

    monthlyProjections.push({
      month,
      year,
      revenue: projectedRevenue,
      ebitda: projectedEBITDA,
      debtService: {
        senior: seniorDebtService,
        sub: subDebtService,
        mezzanine: mezzanineDebtService,
        seller: sellerDebtService,
        total: totalDebtService,
      },
      dscr,
      leverageRatio,
      cashFlow,
      cumulativeCashFlow,
    });

    // Create annual projection at year-end
    if (month % 12 === 0) {
      const yearCashFlow = monthlyProjections
        .slice(month - 12, month)
        .reduce((sum, m) => sum + m.cashFlow, 0);

      annualProjections.push({
        year,
        revenue: projectedRevenue,
        ebitda: projectedEBITDA,
        debtService: totalDebtService * 12,
        dscr,
        leverageRatio,
        cashFlow: yearCashFlow,
        cumulativeCashFlow,
        equityValue: cumulativeCashFlow + capitalization.buyerEquity,
      });
    }
  }

  // Calculate return metrics
  const buyerCashInvested = capitalization.buyerEquity;
  const finalEquityValue = annualProjections[annualProjections.length - 1]?.equityValue || 0;
  const totalReturn = finalEquityValue - buyerCashInvested;

  const moic = buyerCashInvested > 0 ? finalEquityValue / buyerCashInvested : 0;
  const roi = buyerCashInvested > 0 ? (totalReturn / buyerCashInvested) * 100 : 0;

  // Calculate IRR using Newton-Raphson method
  const irr = calculateIRR(
    [-buyerCashInvested],
    annualProjections.map((p) => p.cashFlow),
    inputs.projectionYears
  );

  // Calculate payback period
  let paybackPeriod = 0;
  let runningCashFlow = 0;
  for (const proj of annualProjections) {
    runningCashFlow += proj.cashFlow;
    paybackPeriod++;
    if (runningCashFlow >= buyerCashInvested) break;
  }

  // Exit value (assuming same multiple as entry)
  const entryMultiple = inputs.purchasePrice / inputs.ttmEBITDA;
  const exitEBITDA = annualProjections[annualProjections.length - 1]?.ebitda || inputs.ttmEBITDA;
  const exitValue = exitEBITDA * entryMultiple;
  const exitMultiple = buyerCashInvested > 0 ? exitValue / buyerCashInvested : 0;

  const returns: ReturnMetrics = {
    moic,
    roi,
    irr,
    paybackPeriod,
    exitValue,
    exitMultiple,
  };

  // Calculate deal health metrics
  const avgMonthlyDSCR =
    monthlyProjections.reduce((sum, m) => sum + m.dscr, 0) / monthlyProjections.length;

  const dscrStrength =
    avgMonthlyDSCR >= 1.5 ? 'strong' : avgMonthlyDSCR >= 1.25 ? 'adequate' : 'weak';

  const initialLeverage = capitalization.totalDebt / inputs.ttmEBITDA;
  const leverageLevel =
    initialLeverage <= 2.0 ? 'conservative' : initialLeverage <= 4.0 ? 'moderate' : 'aggressive';

  // Calculate debt capacity (max debt business can support at 1.25x DSCR)
  const monthlyDebtServiceCapacity = (inputs.ttmEBITDA / 12) * 0.8; // Assuming max 80% of EBITDA for debt service
  const debtCapacity = calculateMaximumDebt(
    monthlyDebtServiceCapacity,
    inputs.seniorDebt.interestRate,
    inputs.seniorDebt.term
  );

  const debtCapacityUtilization =
    debtCapacity > 0 ? (capitalization.totalDebt / debtCapacity) * 100 : 0;

  const overallStatus =
    dscrStrength === 'strong' && leverageLevel !== 'aggressive' && moic >= 1.5
      ? 'healthy'
      : dscrStrength === 'adequate' && leverageLevel === 'moderate' && moic >= 1.25
      ? 'moderate'
      : 'risky';

  // Calculate WACC
  const wacc = calculateWACC(capitalization, inputs);

  const health: DealHealth = {
    overallStatus,
    dscrStrength,
    leverageLevel,
    debtCapacity,
    debtCapacityUtilization,
    monthlyAverageDSCR: avgMonthlyDSCR,
    weightedAverageCostOfCapital: wacc,
  };

  return {
    inputs,
    projections: {
      monthly: monthlyProjections,
      annual: annualProjections,
    },
    returns,
    health,
    dealStructure: {
      totalEnterpriseValue: inputs.purchasePrice,
      totalDebt: capitalization.totalDebt,
      totalEquity: capitalization.totalEquity,
      sellerProceeds,
      buyerCashInvested,
      capitalizationTable: capitalization,
    },
  };
}

/**
 * Calculate IRR using Newton-Raphson method
 */
function calculateIRR(
  initialInvestment: number[],
  cashFlows: number[],
  periods: number
): number {
  if (cashFlows.length === 0) return 0;

  const allCashFlows = [...initialInvestment, ...cashFlows];

  // Handle edge case where there are no positive cash flows
  if (cashFlows.every(cf => cf <= 0)) return 0;

  let rate = 0.1; // Initial guess
  const maxIterations = 100;
  const tolerance = 0.0001;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < allCashFlows.length; j++) {
      npv += allCashFlows[j] / Math.pow(1 + rate, j);
      dnpv -= j * allCashFlows[j] / Math.pow(1 + rate, j + 1);
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Convert to percentage
    }

    rate = newRate;
  }

  return rate * 100; // Convert to percentage
}

/**
 * Calculate maximum debt capacity
 */
function calculateMaximumDebt(
  monthlyPayment: number,
  annualRate: number,
  termYears: number
): number {
  if (monthlyPayment <= 0 || annualRate <= 0 || termYears <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) return monthlyPayment * numPayments;

  // Maximum principal that can be supported
  const maxPrincipal =
    (monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

  return maxPrincipal;
}

/**
 * Calculate Weighted Average Cost of Capital (WACC)
 */
function calculateWACC(capitalization: any, inputs: DealInputs): number {
  const totalCapital = capitalization.totalDebt + capitalization.totalEquity;
  if (totalCapital <= 0) return 0;

  // Cost of debt (weighted average)
  let debtCost = 0;
  let totalDebtForWeight = 0;

  if (capitalization.seniorDebt > 0) {
    debtCost += capitalization.seniorDebt * inputs.seniorDebt.interestRate;
    totalDebtForWeight += capitalization.seniorDebt;
  }
  if (inputs.subDebt && capitalization.subDebt > 0) {
    debtCost += capitalization.subDebt * inputs.subDebt.interestRate;
    totalDebtForWeight += capitalization.subDebt;
  }
  if (inputs.mezzanineDebt && capitalization.mezzanineDebt > 0) {
    debtCost += capitalization.mezzanineDebt * inputs.mezzanineDebt.interestRate;
    totalDebtForWeight += capitalization.mezzanineDebt;
  }
  if (inputs.sellerFinancing && capitalization.sellerFinancing > 0) {
    debtCost += capitalization.sellerFinancing * inputs.sellerFinancing.interestRate;
    totalDebtForWeight += capitalization.sellerFinancing;
  }

  const weightedDebtCost = totalDebtForWeight > 0 ? debtCost / totalDebtForWeight : 0;
  const debtWeight = capitalization.totalDebt / totalCapital;

  // Cost of equity (simplified - typically 12-20% for private equity)
  const equityCost = 15; // Assuming 15% cost of equity
  const equityWeight = capitalization.totalEquity / totalCapital;

  // Tax rate assumption (simplified)
  const taxRate = 0.25; // 25% corporate tax rate

  // WACC = (E/V × Re) + (D/V × Rd × (1 − T))
  const wacc = equityWeight * equityCost + debtWeight * weightedDebtCost * (1 - taxRate);

  return wacc;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
