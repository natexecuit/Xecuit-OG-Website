/**
 * M&A Deal Analysis Calculator
 * Comprehensive deal viability and return analysis
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';
import { InputField } from '../components/InputField';
import { SelectDropdown } from '../components/SelectDropdown';
import { calculateMADealAnalysis, formatCurrency, formatPercentage, type DealInputs } from '@/lib/calculators/ma-deal-analysis';
import { parseInputValue } from '@/lib/format';

export default function MADealAnalysisPage() {
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Business Financials
  const [revenue, setRevenue] = useState('10000000');
  const [ttmEBITDA, setTtmEBITDA] = useState('2000000');

  // Deal Structure
  const [purchasePrice, setPurchasePrice] = useState('12000000');
  const [buyerCashInjection, setBuyerCashInjection] = useState('4000000');
  const [rolloverEquity, setRolloverEquity] = useState('10');
  const [earnoutAmount, setEarnoutAmount] = useState('0');
  const [earnoutYears, setEarnoutYears] = useState('3');

  // Senior Debt
  const [seniorDebtAmount, setSeniorDebtAmount] = useState('6000000');
  const [seniorDebtRate, setSeniorDebtRate] = useState('8.5');
  const [seniorDebtTerm, setSeniorDebtTerm] = useState('7');

  // Sub Debt
  const [hasSubDebt, setHasSubDebt] = useState(false);
  const [subDebtAmount, setSubDebtAmount] = useState('1000000');
  const [subDebtRate, setSubDebtRate] = useState('12');
  const [subDebtTerm, setSubDebtTerm] = useState('5');

  // Mezzanine Debt
  const [hasMezzanineDebt, setHasMezzanineDebt] = useState(false);
  const [mezzanineDebtAmount, setMezzanineDebtAmount] = useState('1000000');
  const [mezzanineDebtRate, setMezzanineDebtRate] = useState('14');
  const [mezzanineDebtTerm, setMezzanineDebtTerm] = useState('5');
  const [mezzaninePIK, setMezzaninePIK] = useState(false);

  // Seller Financing
  const [hasSellerFinancing, setHasSellerFinancing] = useState(false);
  const [sellerFinancingAmount, setSellerFinancingAmount] = useState('500000');
  const [sellerFinancingRate, setSellerFinancingRate] = useState('6');
  const [sellerFinancingTerm, setSellerFinancingTerm] = useState('5');
  const [sellerFinancingDeferred, setSellerFinancingDeferred] = useState('0');

  // Projections
  const [revenueGrowth, setRevenueGrowth] = useState('5');
  const [ebitdaMargin, setEbitdaMargin] = useState('20');
  const [projectionYears, setProjectionYears] = useState('5');

  const handleCalculate = () => {
    const inputs: DealInputs = {
      revenue: parseInputValue(revenue),
      ttmEBITDA: parseInputValue(ttmEBITDA),
      purchasePrice: parseInputValue(purchasePrice),
      buyerCashInjection: parseInputValue(buyerCashInjection),
      rolloverEquity: parseFloat(rolloverEquity),
      earnoutAmount: parseInputValue(earnoutAmount),
      earnoutYears: parseInt(earnoutYears),
      seniorDebt: {
        amount: parseInputValue(seniorDebtAmount),
        interestRate: parseFloat(seniorDebtRate),
        term: parseInt(seniorDebtTerm),
      },
      subDebt: hasSubDebt
        ? {
            amount: parseInputValue(subDebtAmount),
            interestRate: parseFloat(subDebtRate),
            term: parseInt(subDebtTerm),
          }
        : undefined,
      mezzanineDebt: hasMezzanineDebt
        ? {
            amount: parseInputValue(mezzanineDebtAmount),
            interestRate: parseFloat(mezzanineDebtRate),
            term: parseInt(mezzanineDebtTerm),
            currentRatioOnly: mezzaninePIK,
          }
        : undefined,
      sellerFinancing: hasSellerFinancing
        ? {
            amount: parseInputValue(sellerFinancingAmount),
            interestRate: parseFloat(sellerFinancingRate),
            term: parseInt(sellerFinancingTerm),
            deferredMonths: parseInt(sellerFinancingDeferred),
          }
        : undefined,
      projectedRevenueGrowth: parseFloat(revenueGrowth),
      projectedEBITDAMargin: parseFloat(ebitdaMargin),
      projectionYears: parseInt(projectionYears),
    };

    const result = calculateMADealAnalysis(inputs);
    setAnalysisResult(result);
    setShowResults(true);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'strong':
      case 'conservative':
        return 'text-green-600';
      case 'moderate':
      case 'adequate':
        return 'text-yellow-600';
      case 'risky':
      case 'weak':
      case 'aggressive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthBg = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'strong':
      case 'conservative':
        return 'bg-green-50 border-green-200';
      case 'moderate':
      case 'adequate':
        return 'bg-yellow-50 border-yellow-200';
      case 'risky':
      case 'weak':
      case 'aggressive':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#E2DBCF]">
        {/* Film grain overlay */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="film-grain"></div>
        </div>

        {/* Header Navigation */}
        <header className="relative z-50 w-full px-6 py-8 md:px-12 flex justify-between items-center main-nav">
          <Link href="/" className="flex items-center">
            <img
              src="/xecuit-dark-green-logo.png"
              alt="Xecuit Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="flex gap-10 items-center text-xs uppercase tracking-[0.2em] font-medium text-[#264C3F]/70">
            <Link href="/calc" className="hover:text-[#264C3F] transition-colors">Calculators</Link>
            <Link href="/" className="hover:text-[#264C3F] transition-colors">Home</Link>
            <a
              href="mailto:acquisitions@xecuit.com"
              className="px-5 py-2 border border-[#264C3F]/30 rounded-full hover:bg-[#264C3F] hover:text-[#E2DBCF] transition-all"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* Page Header */}
        <section className="relative py-12 md:py-16 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Link href="/calc" className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
                ← Back to Calculators
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#264C3F] leading-[0.95] mb-4">
              M&A Deal <span className="text-[#9E8461] italic">Analysis</span>
            </h1>
            <p className="text-lg text-[#264C3F]/70 leading-relaxed max-w-2xl font-light">
              Comprehensive deal viability analysis with debt capacity, returns, and financial projections.
            </p>
          </div>
        </section>

        {/* Calculator Form */}
        <section className="relative py-8 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Business Financials */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-4">Business Financials</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <InputField
                      label="Annual Revenue"
                      value={revenue}
                      onChange={setRevenue}
                      type="currency"
                      placeholder="10,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="TTM EBITDA"
                      value={ttmEBITDA}
                      onChange={setTtmEBITDA}
                      type="currency"
                      placeholder="2,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Purchase Price"
                      value={purchasePrice}
                      onChange={setPurchasePrice}
                      type="currency"
                      placeholder="12,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Buyer Cash Injection"
                      value={buyerCashInjection}
                      onChange={setBuyerCashInjection}
                      type="currency"
                      placeholder="4,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Rollover Equity %"
                      value={rolloverEquity}
                      onChange={setRolloverEquity}
                      type="number"
                      placeholder="10"
                      suffix="%"
                      required
                    />
                    <InputField
                      label="Earnout Amount"
                      value={earnoutAmount}
                      onChange={setEarnoutAmount}
                      type="currency"
                      placeholder="0"
                      prefix="$"
                    />
                    <InputField
                      label="Earnout Years"
                      value={earnoutYears}
                      onChange={setEarnoutYears}
                      type="number"
                      placeholder="3"
                      suffix="years"
                    />
                  </div>
                </div>

                {/* Senior Debt */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-4">Senior Debt</h3>
                  <div className="grid md:grid-cols-3 gap-5">
                    <InputField
                      label="Amount"
                      value={seniorDebtAmount}
                      onChange={setSeniorDebtAmount}
                      type="currency"
                      placeholder="6,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Interest Rate"
                      value={seniorDebtRate}
                      onChange={setSeniorDebtRate}
                      type="number"
                      placeholder="8.5"
                      suffix="%"
                      required
                    />
                    <InputField
                      label="Term"
                      value={seniorDebtTerm}
                      onChange={setSeniorDebtTerm}
                      type="number"
                      placeholder="7"
                      suffix="years"
                      required
                    />
                  </div>
                </div>

                {/* Additional Debt */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#264C3F]">Additional Financing</h3>
                  </div>

                  {/* Sub Debt */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={hasSubDebt}
                        onChange={(e) => setHasSubDebt(e.target.checked)}
                        className="w-4 h-4 accent-[#9E8461]"
                      />
                      <span className="text-sm text-[#264C3F]/70">Subordinated Debt</span>
                    </label>
                    {hasSubDebt && (
                      <div className="grid md:grid-cols-3 gap-5 pl-7">
                        <InputField
                          label="Amount"
                          value={subDebtAmount}
                          onChange={setSubDebtAmount}
                          type="currency"
                          placeholder="1,000,000"
                          prefix="$"
                          required
                        />
                        <InputField
                          label="Interest Rate"
                          value={subDebtRate}
                          onChange={setSubDebtRate}
                          type="number"
                          placeholder="12"
                          suffix="%"
                          required
                        />
                        <InputField
                          label="Term"
                          value={subDebtTerm}
                          onChange={setSubDebtTerm}
                          type="number"
                          placeholder="5"
                          suffix="years"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Mezzanine Debt */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={hasMezzanineDebt}
                        onChange={(e) => setHasMezzanineDebt(e.target.checked)}
                        className="w-4 h-4 accent-[#9E8461]"
                      />
                      <span className="text-sm text-[#264C3F]/70">Mezzanine Debt</span>
                    </label>
                    {hasMezzanineDebt && (
                      <div className="space-y-4 pl-7">
                        <div className="grid md:grid-cols-3 gap-5">
                          <InputField
                            label="Amount"
                            value={mezzanineDebtAmount}
                            onChange={setMezzanineDebtAmount}
                            type="currency"
                            placeholder="1,000,000"
                            prefix="$"
                            required
                          />
                          <InputField
                            label="Interest Rate"
                            value={mezzanineDebtRate}
                            onChange={setMezzanineDebtRate}
                            type="number"
                            placeholder="14"
                            suffix="%"
                            required
                          />
                          <InputField
                            label="Term"
                            value={mezzanineDebtTerm}
                            onChange={setMezzanineDebtTerm}
                            type="number"
                            placeholder="5"
                            suffix="years"
                            required
                          />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mezzaninePIK}
                            onChange={(e) => setMezzaninePIK(e.target.checked)}
                            className="w-4 h-4 accent-[#9E8461]"
                          />
                          <span className="text-sm text-[#264C3F]/70">PIK (Interest Only)</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Seller Financing */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={hasSellerFinancing}
                        onChange={(e) => setHasSellerFinancing(e.target.checked)}
                        className="w-4 h-4 accent-[#9E8461]"
                      />
                      <span className="text-sm text-[#264C3F]/70">Seller Financing</span>
                    </label>
                    {hasSellerFinancing && (
                      <div className="grid md:grid-cols-2 gap-5 pl-7">
                        <div className="grid grid-cols-3 gap-3">
                          <InputField
                            label="Amount"
                            value={sellerFinancingAmount}
                            onChange={setSellerFinancingAmount}
                            type="currency"
                            placeholder="500,000"
                            prefix="$"
                            required
                          />
                          <InputField
                            label="Rate"
                            value={sellerFinancingRate}
                            onChange={setSellerFinancingRate}
                            type="number"
                            placeholder="6"
                            suffix="%"
                            required
                          />
                          <InputField
                            label="Term"
                            value={sellerFinancingTerm}
                            onChange={setSellerFinancingTerm}
                            type="number"
                            placeholder="5"
                            suffix="years"
                            required
                          />
                        </div>
                        <InputField
                          label="Deferred Months"
                          value={sellerFinancingDeferred}
                          onChange={setSellerFinancingDeferred}
                          type="number"
                          placeholder="0"
                          suffix="months"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-4">Projection Assumptions</h3>
                  <div className="grid md:grid-cols-3 gap-5">
                    <InputField
                      label="Revenue Growth (Annual)"
                      value={revenueGrowth}
                      onChange={setRevenueGrowth}
                      type="number"
                      placeholder="5"
                      suffix="%"
                      required
                    />
                    <InputField
                      label="EBITDA Margin"
                      value={ebitdaMargin}
                      onChange={setEbitdaMargin}
                      type="number"
                      placeholder="20"
                      suffix="%"
                      required
                    />
                    <InputField
                      label="Projection Period"
                      value={projectionYears}
                      onChange={setProjectionYears}
                      type="number"
                      placeholder="5"
                      suffix="years"
                      required
                    />
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm"
                >
                  Analyze Deal
                </button>
              </div>

              {/* Quick Summary Sidebar */}
              <div className="space-y-6">
                {/* Deal Structure Summary */}
                <div className="bg-white p-6 rounded-sm shadow-lg">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461] mb-4">
                    Deal Structure
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#264C3F]/60">Purchase Price</span>
                      <span className="font-semibold">{formatCurrency(parseInputValue(purchasePrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#264C3F]/60">TTM EBITDA</span>
                      <span className="font-semibold">{formatCurrency(parseInputValue(ttmEBITDA))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#264C3F]/60">Entry Multiple</span>
                      <span className="font-semibold">{(parseInputValue(purchasePrice) / parseInputValue(ttmEBITDA)).toFixed(2)}x</span>
                    </div>
                    <div className="pt-3 border-t border-[#264C3F]/10">
                      <div className="flex justify-between">
                        <span className="text-[#264C3F]/60">Total Debt</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            parseInputValue(seniorDebtAmount) +
                              (hasSubDebt ? parseInputValue(subDebtAmount) : 0) +
                              (hasMezzanineDebt ? parseInputValue(mezzanineDebtAmount) : 0) +
                              (hasSellerFinancing ? parseInputValue(sellerFinancingAmount) : 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#264C3F]/60">Buyer Equity</span>
                        <span className="font-semibold">{formatCurrency(parseInputValue(buyerCashInjection))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#264C3F]/60">Seller Rollover</span>
                        <span className="font-semibold">{formatCurrency(parseInputValue(purchasePrice) * parseFloat(rolloverEquity) / 100)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                {showResults && analysisResult && (
                  <>
                    <div className={`p-6 rounded-sm border ${getHealthBg(analysisResult.health.overallStatus)}`}>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-3">
                        Deal Health
                      </h4>
                      <div className={`text-2xl font-bold mb-2 ${getHealthColor(analysisResult.health.overallStatus)}`}>
                        {analysisResult.health.overallStatus.toUpperCase()}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>DSCR: </span>
                          <span className={getHealthColor(analysisResult.health.dscrStrength)}>
                            {analysisResult.health.dscrStrength.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leverage: </span>
                          <span className={getHealthColor(analysisResult.health.leverageLevel)}>
                            {analysisResult.health.leverageLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-lg">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461] mb-4">
                        Returns
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#264C3F]/60">MOIC</span>
                          <span className="text-xl font-bold text-[#264C3F]">
                            {analysisResult.returns.moic.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#264C3F]/60">IRR</span>
                          <span className="text-xl font-bold text-[#264C3F]">
                            {formatPercentage(analysisResult.returns.irr)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#264C3F]/60">ROI</span>
                          <span className="text-xl font-bold text-[#264C3F]">
                            {formatPercentage(analysisResult.returns.roi)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#264C3F]/60">Payback</span>
                          <span className="text-lg font-semibold text-[#264C3F]">
                            {analysisResult.returns.paybackPeriod} yrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Detailed Results */}
            {showResults && analysisResult && (
              <div className="mt-8 space-y-6">
                {/* Deal Structure Details */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Deal Structure Breakdown</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461] mb-4">
                        Sources & Uses
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Enterprise Value</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.totalEnterpriseValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Total Debt</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.totalDebt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Total Equity</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.totalEquity)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461] mb-4">
                        Seller Proceeds
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Upfront Cash</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.sellerProceeds.upfront)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Rollover Equity</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.sellerProceeds.rollover)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#264C3F]/60">Earnout Potential</span>
                          <span className="font-semibold">{formatCurrency(analysisResult.dealStructure.sellerProceeds.earnout)}</span>
                        </div>
                        <div className="pt-2 border-t border-[#264C3F]/10 flex justify-between font-bold">
                          <span className="text-[#264C3F]">Total</span>
                          <span className="text-[#264C3F]">{formatCurrency(analysisResult.dealStructure.sellerProceeds.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annual Projections */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Annual Projections</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#264C3F]/20">
                          <th className="text-left py-3 px-4 text-[#264C3F]/60 font-semibold">Year</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">Revenue</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">EBITDA</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">Debt Service</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">DSCR</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">Cash Flow</th>
                          <th className="text-right py-3 px-4 text-[#264C3F]/60 font-semibold">Equity Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.projections.annual.map((proj: any) => (
                          <tr key={proj.year} className="border-b border-[#264C3F]/10 hover:bg-[#F9F7F4]">
                            <td className="py-3 px-4 font-semibold">{proj.year}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(proj.revenue)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(proj.ebitda)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(proj.debtService)}</td>
                            <td className={`py-3 px-4 text-right font-semibold ${
                              proj.dscr >= 1.5 ? 'text-green-600' : proj.dscr >= 1.25 ? 'text-yellow-600' : 'text-red-600'
                            }`}>{proj.dscr.toFixed(2)}x</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(proj.cashFlow)}</td>
                            <td className="py-3 px-4 text-right font-bold">{formatCurrency(proj.equityValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg">
                  <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Deal Health Analysis</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className={`p-4 rounded border ${getHealthBg(analysisResult.health.overallStatus)}`}>
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Overall Status</div>
                      <div className={`text-2xl font-bold ${getHealthColor(analysisResult.health.overallStatus)}`}>
                        {analysisResult.health.overallStatus.toUpperCase()}
                      </div>
                    </div>
                    <div className={`p-4 rounded border ${getHealthBg(analysisResult.health.dscrStrength)}`}>
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">DSCR Strength</div>
                      <div className={`text-2xl font-bold ${getHealthColor(analysisResult.health.dscrStrength)}`}>
                        {analysisResult.health.dscrStrength.toUpperCase()}
                      </div>
                      <div className="text-sm mt-1">{analysisResult.health.monthlyAverageDSCR.toFixed(2)}x average</div>
                    </div>
                    <div className={`p-4 rounded border ${getHealthBg(analysisResult.health.leverageLevel)}`}>
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Leverage Level</div>
                      <div className={`text-2xl font-bold ${getHealthColor(analysisResult.health.leverageLevel)}`}>
                        {analysisResult.health.leverageLevel.toUpperCase()}
                      </div>
                      <div className="text-sm mt-1">{formatPercentage(analysisResult.health.weightedAverageCostOfCapital)} WACC</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[#F9F7F4] rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#264C3F]/60">Debt Capacity Utilization</span>
                      <span className="text-sm font-semibold text-[#264C3F]">
                        {formatPercentage(analysisResult.health.debtCapacityUtilization)}
                      </span>
                    </div>
                    <div className="w-full bg-[#E2DBCF] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          analysisResult.health.debtCapacityUtilization <= 80
                            ? 'bg-green-600'
                            : analysisResult.health.debtCapacityUtilization <= 100
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(analysisResult.health.debtCapacityUtilization, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#264C3F]/50 mt-1">
                      Maximum debt capacity: {formatCurrency(analysisResult.health.debtCapacity)}
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={() => {
                    const element = document.getElementById('ma-analysis-results');
                    if (element) {
                      // Simple text-based export for now
                      const data = {
                        dealStructure: analysisResult.dealStructure,
                        returns: analysisResult.returns,
                        health: analysisResult.health,
                        annualProjections: analysisResult.projections.annual,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `xecuit-ma-analysis-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="w-full bg-[#264C3F] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#1a3329] transition-all rounded-sm"
                >
                  Export Analysis
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#264C3F] py-20 px-6 md:px-24 border-t border-[#E2DBCF]/5 footer-area mt-16">
          <div className="hero-grain-overlay opacity-30"></div>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-[10px] text-[#E2DBCF]/40 uppercase tracking-widest font-bold">
              © 2026 Xecuit Holdings LLC | All rights Reserved.
            </span>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/company/xecuit/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:linkedin" className="text-[#E2DBCF]/30 hover:text-[#E2DBCF] cursor-pointer text-lg" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
