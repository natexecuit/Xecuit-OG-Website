/**
 * Financing Calculators
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';
import { CalculatorCard } from '../components/CalculatorCard';
import { InputField } from '../components/InputField';
import { ResultDisplay } from '../components/ResultDisplay';
import { SelectDropdown } from '../components/SelectDropdown';
import {
  calculateInterestExpense,
  calculateBlendedRate,
  calculateDSCR,
  calculateLeverageRatio,
} from '@/lib/calculators/financing';
import { parseInputValue } from '@/lib/format';

export default function FinancingPage() {
  const [activeCalculator, setActiveCalculator] = useState<'interest' | 'blended' | 'dscr' | 'leverage'>('interest');
  const [showResults, setShowResults] = useState(false);

  // Interest Expense State
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  // Blended Rate State
  const [tranches, setTranches] = useState([
    { principal: '', rate: '' },
    { principal: '', rate: '' },
  ]);

  // DSCR State
  const [annualNOI, setAnnualNOI] = useState('');
  const [annualDebtService, setAnnualDebtService] = useState('');

  // Leverage Ratio State
  const [totalDebt, setTotalDebt] = useState('');
  const [ebitda, setEbitda] = useState('');

  // Results State
  const [interestResult, setInterestResult] = useState<any>(null);
  const [blendedResult, setBlendedResult] = useState<any>(null);
  const [dscrResult, setDscrResult] = useState<any>(null);
  const [leverageResult, setLeverageResult] = useState<any>(null);

  const calculateInterest = () => {
    const p = parseInputValue(principal);
    const r = parseFloat(interestRate) || 0;
    const t = parseInt(term) || 0;

    if (p > 0 && r > 0 && t > 0) {
      const result = calculateInterestExpense({
        principal: p,
        interestRate: r,
        term: t,
        paymentFrequency,
      });
      setInterestResult(result.result);
      setShowResults(true);
    }
  };

  const calculateBlended = () => {
    const validTranches = tranches
      .filter(t => parseInputValue(t.principal) > 0 && parseFloat(t.rate) > 0)
      .map(t => ({
        principal: parseInputValue(t.principal),
        rate: parseFloat(t.rate),
      }));

    if (validTranches.length >= 2) {
      const result = calculateBlendedRate({ tranches: validTranches });
      setBlendedResult(result.result);
      setShowResults(true);
    }
  };

  const calculateDSCRResult = () => {
    const noi = parseInputValue(annualNOI);
    const ads = parseInputValue(annualDebtService);

    if (noi > 0 && ads > 0) {
      const result = calculateDSCR({ annualNOI: noi, annualDebtService: ads });
      setDscrResult(result.result);
      setShowResults(true);
    }
  };

  const calculateLeverageResult = () => {
    const debt = parseInputValue(totalDebt);
    const e = parseInputValue(ebitda);

    if (debt > 0 && e > 0) {
      const result = calculateLeverageRatio({ totalDebt: debt, ebitda: e });
      setLeverageResult(result.result);
      setShowResults(true);
    }
  };

  const addTranche = () => {
    setTranches([...tranches, { principal: '', rate: '' }]);
  };

  const removeTranche = (index: number) => {
    if (tranches.length > 2) {
      setTranches(tranches.filter((_, i) => i !== index));
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
              Financing <span className="text-[#9E8461] italic">Calculators</span>
            </h1>
            <p className="text-lg text-[#264C3F]/70 leading-relaxed max-w-2xl font-light">
              Analyze loan payments, blended interest rates, debt service coverage, and leverage ratios.
            </p>
          </div>
        </section>

        {/* Calculator Selector */}
        <section className="relative py-8 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => {
                  setActiveCalculator('interest');
                  setShowResults(false);
                }}
                className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${
                  activeCalculator === 'interest'
                    ? 'bg-[#264C3F] text-white'
                    : 'bg-white text-[#264C3F]/70 hover:bg-[#F9F7F4]'
                }`}
              >
                Interest Expense
              </button>
              <button
                onClick={() => {
                  setActiveCalculator('blended');
                  setShowResults(false);
                }}
                className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${
                  activeCalculator === 'blended'
                    ? 'bg-[#264C3F] text-white'
                    : 'bg-white text-[#264C3F]/70 hover:bg-[#F9F7F4]'
                }`}
              >
                Blended Rate
              </button>
              <button
                onClick={() => {
                  setActiveCalculator('dscr');
                  setShowResults(false);
                }}
                className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${
                  activeCalculator === 'dscr'
                    ? 'bg-[#264C3F] text-white'
                    : 'bg-white text-[#264C3F]/70 hover:bg-[#F9F7F4]'
                }`}
              >
                DSCR
              </button>
              <button
                onClick={() => {
                  setActiveCalculator('leverage');
                  setShowResults(false);
                }}
                className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${
                  activeCalculator === 'leverage'
                    ? 'bg-[#264C3F] text-white'
                    : 'bg-white text-[#264C3F]/70 hover:bg-[#F9F7F4]'
                }`}
              >
                Leverage Ratio
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Card */}
              {activeCalculator === 'interest' && (
                <CalculatorCard
                  title="Interest Expense Calculator"
                  description="Calculate loan payments and total interest expense."
                >
                  <div className="space-y-5">
                    <InputField
                      label="Loan Principal"
                      value={principal}
                      onChange={setPrincipal}
                      type="currency"
                      placeholder="5,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Annual Interest Rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      type="number"
                      placeholder="8.5"
                      suffix="%"
                      required
                    />
                    <InputField
                      label="Loan Term"
                      value={term}
                      onChange={setTerm}
                      type="number"
                      placeholder="5"
                      suffix="years"
                      required
                    />
                    <SelectDropdown
                      label="Payment Frequency"
                      value={paymentFrequency}
                      onChange={(value) => setPaymentFrequency(value as any)}
                      options={[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'annual', label: 'Annual' },
                      ]}
                      required
                    />
                    <button
                      onClick={calculateInterest}
                      className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm mt-4"
                    >
                      Calculate Payment
                    </button>
                  </div>
                </CalculatorCard>
              )}

              {activeCalculator === 'blended' && (
                <CalculatorCard
                  title="Blended Interest Rate Calculator"
                  description="Calculate weighted average rate across multiple debt tranches."
                >
                  <div className="space-y-5">
                    {tranches.map((tranche, index) => (
                      <div key={index} className="p-4 bg-[#F5F3EF] rounded-sm space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461]">
                            Tranche {index + 1}
                          </h4>
                          {tranches.length > 2 && (
                            <button
                              onClick={() => removeTranche(index)}
                              className="text-xs text-[#264C3F]/50 hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="Principal"
                            value={tranche.principal}
                            onChange={(value) => {
                              const updated = [...tranches];
                              updated[index].principal = value;
                              setTranches(updated);
                            }}
                            type="currency"
                            placeholder="2,500,000"
                            prefix="$"
                            required
                          />
                          <InputField
                            label="Rate %"
                            value={tranche.rate}
                            onChange={(value) => {
                              const updated = [...tranches];
                              updated[index].rate = value;
                              setTranches(updated);
                            }}
                            type="number"
                            placeholder="8.0"
                            suffix="%"
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addTranche}
                      className="w-full py-3 border border-dashed border-[#264C3F]/30 text-sm text-[#264C3F]/60 hover:border-[#264C3F] hover:text-[#264C3F] transition-all rounded-sm"
                    >
                      + Add Tranche
                    </button>
                    <button
                      onClick={calculateBlended}
                      className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm"
                    >
                      Calculate Blended Rate
                    </button>
                  </div>
                </CalculatorCard>
              )}

              {activeCalculator === 'dscr' && (
                <CalculatorCard
                  title="Debt Service Coverage Ratio (DSCR)"
                  description="Calculate DSCR to assess debt coverage capacity."
                >
                  <div className="space-y-5">
                    <InputField
                      label="Annual NOI"
                      value={annualNOI}
                      onChange={setAnnualNOI}
                      type="currency"
                      placeholder="1,200,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="Annual Debt Service"
                      value={annualDebtService}
                      onChange={setAnnualDebtService}
                      type="currency"
                      placeholder="800,000"
                      prefix="$"
                      required
                    />
                    <button
                      onClick={calculateDSCRResult}
                      className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm mt-4"
                    >
                      Calculate DSCR
                    </button>
                  </div>
                </CalculatorCard>
              )}

              {activeCalculator === 'leverage' && (
                <CalculatorCard
                  title="Leverage Ratio Calculator"
                  description="Calculate Debt / EBITDA leverage multiple."
                >
                  <div className="space-y-5">
                    <InputField
                      label="Total Debt"
                      value={totalDebt}
                      onChange={setTotalDebt}
                      type="currency"
                      placeholder="15,000,000"
                      prefix="$"
                      required
                    />
                    <InputField
                      label="EBITDA"
                      value={ebitda}
                      onChange={setEbitda}
                      type="currency"
                      placeholder="3,000,000"
                      prefix="$"
                      required
                    />
                    <button
                      onClick={calculateLeverageResult}
                      className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm mt-4"
                    >
                      Calculate Leverage
                    </button>
                  </div>
                </CalculatorCard>
              )}

              {/* Results Card */}
              {showResults && activeCalculator === 'interest' && interestResult && (
                <ResultDisplay
                  title="Interest Expense Results"
                  calculatorName="interest-expense"
                  results={[
                    {
                      label: `${paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} Payment`,
                      value: paymentFrequency === 'monthly' ? interestResult.monthlyPayment :
                             paymentFrequency === 'quarterly' ? interestResult.quarterlyPayment :
                             interestResult.annualPayment,
                      format: 'currency',
                    },
                    { label: 'Total Interest', value: interestResult.totalInterest, format: 'currency' },
                    { label: 'Total Payment', value: interestResult.totalPayment, format: 'currency' },
                  ]}
                  breakdown={[
                    { label: 'Principal', value: parseInputValue(principal) },
                    { label: 'Annual Rate', value: `${parseFloat(interestRate)}%` },
                    { label: 'Term', value: `${parseInt(term)} years` },
                  ]}
                />
              )}

              {showResults && activeCalculator === 'blended' && blendedResult && (
                <ResultDisplay
                  title="Blended Rate Results"
                  calculatorName="blended-rate"
                  results={[
                    { label: 'Blended Rate', value: blendedResult.blendedRate, format: 'percentage' },
                    { label: 'Total Principal', value: blendedResult.totalPrincipal, format: 'currency' },
                    { label: 'Annual Interest', value: blendedResult.annualInterest, format: 'currency' },
                  ]}
                  breakdown={tranches
                    .filter(t => parseInputValue(t.principal) > 0)
                    .map((t, i) => ({
                      label: `Tranche ${i + 1}`,
                      value: `$${parseInputValue(t.principal).toLocaleString()} @ ${parseFloat(t.rate)}%`,
                    }))}
                />
              )}

              {showResults && activeCalculator === 'dscr' && dscrResult && (
                <ResultDisplay
                  title="DSCR Results"
                  calculatorName="dscr"
                  results={[
                    { label: 'DSCR', value: dscrResult.dscr, format: 'number' },
                  ]}
                  breakdown={[
                    { label: 'Annual NOI', value: parseInputValue(annualNOI) },
                    { label: 'Annual Debt Service', value: parseInputValue(annualDebtService) },
                    { label: 'Status', value: dscrResult.coverageStatus.toUpperCase() },
                  ]}
                />
              )}

              {showResults && activeCalculator === 'leverage' && leverageResult && (
                <ResultDisplay
                  title="Leverage Ratio Results"
                  calculatorName="leverage-ratio"
                  results={[
                    { label: 'Leverage Multiple', value: leverageResult.leverageMultiple, format: 'number' },
                  ]}
                  breakdown={[
                    { label: 'Total Debt', value: parseInputValue(totalDebt) },
                    { label: 'EBITDA', value: parseInputValue(ebitda) },
                    { label: 'Status', value: leverageResult.leverageStatus.toUpperCase() },
                  ]}
                />
              )}
            </div>
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
