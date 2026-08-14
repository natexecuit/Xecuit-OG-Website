/**
 * Success Fee Calculator - Holistic View
 * Compare all fee methods side-by-side with editable parameters
 */

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';
import { InputField } from '../components/InputField';
import { SelectDropdown } from '../components/SelectDropdown';

// Default Reverse Lehman Tiers (declining percentages as deal size increases)
const DEFAULT_LEHMAN_TIERS = [
  { min: 0, max: 1000000, rate: 10 },
  { min: 1000000, max: 2000000, rate: 8 },
  { min: 2000000, max: 5000000, rate: 6 },
  { min: 5000000, max: 10000000, rate: 5 },
  { min: 10000000, max: 25000000, rate: 4 },
  { min: 25000000, max: 50000000, rate: 3 },
  { min: 50000000, max: 100000000, rate: 2 },
  { min: 100000000, max: null, rate: 1 },
];

export default function SuccessFeePage() {
  // Core Input - Deal Value
  const [dealValue, setDealValue] = useState('10000000');

  // Simple Percentage Method
  const [simpleFeePercent, setSimpleFeePercent] = useState('5');

  // Retainer Method
  const [useRetainer, setUseRetainer] = useState(false);
  const [retainerFeePercent, setRetainerFeePercent] = useState('5');
  const [retainerAmount, setRetainerAmount] = useState('25000');
  const [retainerFrequency, setRetainerFrequency] = useState<'monthly' | 'quarterly' | 'upfront'>('monthly');
  const [retainerDuration, setRetainerDuration] = useState('12');

  // Lehman Scale Method
  const [lehmanTiers, setLehmanTiers] = useState(DEFAULT_LEHMAN_TIERS);
  const [showLehmanEditor, setShowLehmanEditor] = useState(false);

  // Calculated Results
  const [simpleResult, setSimpleResult] = useState(0);
  const [retainerResult, setRetainerResult] = useState({ retainerFee: 0, successFee: 0, totalFee: 0 });
  const [lehmanResult, setLehmanResult] = useState({ tierFees: [], totalFee: 0, effectiveRate: 0 });

  // Parse input value
  const parseValue = (value: string) => parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

  // Calculate all fees whenever inputs change
  useEffect(() => {
    const deal = parseValue(dealValue);

    // Simple % Fee
    setSimpleResult(deal * (parseValue(simpleFeePercent) / 100));

    // Retainer Fee
    let retFee = 0;
    if (useRetainer) {
      switch (retainerFrequency) {
        case 'monthly':
          retFee = parseValue(retainerAmount) * parseValue(retainerDuration);
          break;
        case 'quarterly':
          retFee = parseValue(retainerAmount) * (parseValue(retainerDuration) / 3);
          break;
        case 'upfront':
          retFee = parseValue(retainerAmount);
          break;
      }
    }
    const successFee = deal * (parseValue(retainerFeePercent) / 100);
    setRetainerResult({
      retainerFee: retFee,
      successFee,
      totalFee: retFee + successFee,
    });

    // Lehman Scale
    let remaining = deal;
    const tierFees: number[] = [];
    let totalLehman = 0;

    for (const tier of lehmanTiers) {
      if (remaining <= 0) break;

      const tierMax = tier.max === null ? remaining : tier.max;
      const tierMin = tier.min;
      const tierRange = tierMax - tierMin;

      const amountInTier = Math.min(remaining, tierRange);
      const feeInTier = amountInTier * (tier.rate / 100);

      tierFees.push(feeInTier);
      totalLehman += feeInTier;
      remaining -= amountInTier;
    }

    const effectiveRate = deal > 0 ? (totalLehman / deal) * 100 : 0;
    setLehmanResult({
      tierFees,
      totalFee: totalLehman,
      effectiveRate,
    });
  }, [dealValue, simpleFeePercent, useRetainer, retainerFeePercent, retainerAmount, retainerFrequency, retainerDuration, lehmanTiers]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Lehman tier management
  const addTier = () => {
    const lastTier = lehmanTiers[lehmanTiers.length - 1];
    setLehmanTiers([
      ...lehmanTiers,
      {
        min: lastTier.max || lastTier.min,
        max: null,
        rate: Math.max(1, lastTier.rate - 1),
      },
    ]);
  };

  const updateTier = (index: number, field: 'min' | 'max' | 'rate', value: string) => {
    const updated = [...lehmanTiers];
    updated[index][field] = field === 'rate' ? parseFloat(value) : parseFloat(value);
    setLehmanTiers(updated);
  };

  const removeTier = (index: number) => {
    if (lehmanTiers.length > 2) {
      setLehmanTiers(lehmanTiers.filter((_, i) => i !== index));
    }
  };

  const resetLehmanTiers = () => {
    setLehmanTiers(DEFAULT_LEHMAN_TIERS);
  };

  // Get best/lowest fee for highlighting
  const fees = [
    { method: 'Simple %', fee: simpleResult },
    { method: 'Retainer', fee: retainerResult.totalFee },
    { method: 'Lehman', fee: lehmanResult.totalFee },
  ];
  const lowestFee = Math.min(...fees.map(f => f.fee));
  const bestMethod = fees.find(f => f.fee === lowestFee)?.method;

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
              Success Fee <span className="text-[#9E8461] italic">Calculator</span>
            </h1>
            <p className="text-lg text-[#264C3F]/70 leading-relaxed max-w-2xl font-light">
              Compare all fee calculation methods side-by-side. Enter your deal value once and see how different structures would impact your fees.
            </p>
          </div>
        </section>

        {/* Main Calculator */}
        <section className="relative py-8 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            {/* Deal Value Input - Prominent */}
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-lg mb-8">
              <div className="text-center">
                <label className="block text-xs uppercase tracking-widest text-[#264C3F]/60 mb-4 font-semibold">
                  Deal / Transaction Value
                </label>
                <div className="flex justify-center items-center">
                  <span className="text-4xl md:text-5xl font-bold text-[#264C3F] mr-4">$</span>
                  <input
                    type="text"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className="text-4xl md:text-5xl font-bold text-[#264C3F] w-64 md:w-96 bg-transparent border-b-2 border-[#9E8461] focus:outline-none focus:border-[#264C3F] text-center"
                    placeholder="10,000,000"
                  />
                </div>
                <p className="text-sm text-[#264C3F]/60 mt-4">
                  Enter the transaction value to see all fee calculations update in real-time
                </p>
              </div>
            </div>

            {/* Three Method Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Simple % Method */}
              <div className={`bg-white p-6 rounded-sm shadow-lg border-2 transition-all ${
                bestMethod === 'Simple %' ? 'border-[#9E8461] ring-4 ring-[#9E8461]/10' : 'border-transparent'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#264C3F]">Simple %</h3>
                  {bestMethod === 'Simple %' && (
                    <span className="bg-[#9E8461] text-white text-xs px-2 py-1 rounded-full">LOWEST</span>
                  )}
                </div>
                <div className="mb-6">
                  <InputField
                    label="Fee Percentage"
                    value={simpleFeePercent}
                    onChange={setSimpleFeePercent}
                    type="number"
                    placeholder="5"
                    suffix="%"
                    className="mb-4"
                  />
                  <div className="bg-[#F9F7F4] p-4 rounded">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">
                        Success Fee
                      </div>
                      <div className="text-2xl font-bold text-[#264C3F]">
                        {formatCurrency(simpleResult)}
                      </div>
                      <div className="text-xs text-[#264C3F]/60 mt-1">
                        {formatPercentage((parseValue(simpleFeePercent)))} of deal value
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retainer + Success Fee Method */}
              <div className={`bg-white p-6 rounded-sm shadow-lg border-2 transition-all ${
                bestMethod === 'Retainer' ? 'border-[#9E8461] ring-4 ring-[#9E8461]/10' : 'border-transparent'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#264C3F]">Retainer + Success</h3>
                  {bestMethod === 'Retainer' && (
                    <span className="bg-[#9E8461] text-white text-xs px-2 py-1 rounded-full">LOWEST</span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={useRetainer}
                      onChange={(e) => setUseRetainer(e.target.checked)}
                      className="w-4 h-4 accent-[#9E8461]"
                    />
                    <span className="text-sm text-[#264C3F]/70">Include Retainer</span>
                  </div>

                  {useRetainer && (
                    <>
                      <InputField
                        label="Retainer Amount"
                        value={retainerAmount}
                        onChange={setRetainerAmount}
                        type="currency"
                        placeholder="25,000"
                        prefix="$"
                      />
                      <SelectDropdown
                        label="Frequency"
                        value={retainerFrequency}
                        onChange={(value) => setRetainerFrequency(value as any)}
                        options={[
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'quarterly', label: 'Quarterly' },
                          { value: 'upfront', label: 'Upfront' },
                        ]}
                      />
                      {retainerFrequency !== 'upfront' && (
                        <InputField
                          label="Duration (months)"
                          value={retainerDuration}
                          onChange={setRetainerDuration}
                          type="number"
                          placeholder="12"
                        />
                      )}
                    </>
                  )}

                  <InputField
                    label="Success Fee %"
                    value={retainerFeePercent}
                    onChange={setRetainerFeePercent}
                    type="number"
                    placeholder="5"
                    suffix="%"
                  />

                  <div className="bg-[#F9F7F4] p-4 rounded space-y-2">
                    {useRetainer && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#264C3F]/60">Retainer Fee</span>
                        <span className="font-semibold">{formatCurrency(retainerResult.retainerFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#264C3F]/60">Success Fee</span>
                      <span className="font-semibold">{formatCurrency(retainerResult.successFee)}</span>
                    </div>
                    <div className="border-t border-[#264C3F]/20 pt-2">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-1">
                          Total Fee
                        </div>
                        <div className="text-2xl font-bold text-[#264C3F]">
                          {formatCurrency(retainerResult.totalFee)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lehman Scale Method */}
              <div className={`bg-white p-6 rounded-sm shadow-lg border-2 transition-all ${
                bestMethod === 'Lehman' ? 'border-[#9E8461] ring-4 ring-[#9E8461]/10' : 'border-transparent'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#264C3F]">Lehman Scale</h3>
                  {bestMethod === 'Lehman' && (
                    <span className="bg-[#9E8461] text-white text-xs px-2 py-1 rounded-full">LOWEST</span>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowLehmanEditor(!showLehmanEditor)}
                    className="text-xs text-[#9E8461] hover:underline flex items-center gap-1"
                  >
                    <Icon icon="lucide:settings" className="text-sm" />
                    {showLehmanEditor ? 'Hide' : 'Customize'} Tiers
                  </button>

                  {!showLehmanEditor ? (
                    <div className="space-y-2 text-sm">
                      {lehmanTiers.map((tier, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-[#264C3F]/5 last:border-0">
                          <span className="text-[#264C3F]/70">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(tier.min)}
                            {tier.max && (
                              <span> - {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(tier.max)}
                              </span>
                            )}
                            {!tier.max && <span>+</span>}
                          </span>
                          <span className="font-semibold text-[#264C3F]">{tier.rate}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lehmanTiers.map((tier, index) => (
                        <div key={index} className="p-3 bg-[#F5F3EF] rounded space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#9E8461]">
                              Tier {index + 1}
                            </span>
                            {lehmanTiers.length > 2 && (
                              <button
                                onClick={() => removeTier(index)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-[#264C3F]/50 mb-1">Min ($)</label>
                              <input
                                type="text"
                                value={new Intl.NumberFormat('en-US').format(tier.min)}
                                onChange={(e) => updateTier(index, 'min', e.target.value.replace(/,/g, ''))}
                                className="w-full bg-white border-0 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                                disabled={index > 0}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#264C3F]/50 mb-1">Max ($)</label>
                              <input
                                type="text"
                                value={tier.max === null ? 'No limit' : new Intl.NumberFormat('en-US').format(tier.max)}
                                onChange={(e) => updateTier(index, 'max', e.target.value.replace(/,/g, ''))}
                                placeholder="No limit"
                                className="w-full bg-white border-0 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#264C3F]/50 mb-1">Rate %</label>
                              <input
                                type="number"
                                value={tier.rate}
                                onChange={(e) => updateTier(index, 'rate', e.target.value)}
                                className="w-full bg-white border-0 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                                step="0.1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addTier}
                        className="w-full py-2 text-xs text-[#9E8461] border border-dashed border-[#9E8461]/30 hover:bg-[#9E8461]/5 rounded"
                      >
                        + Add Tier
                      </button>
                      <button
                        onClick={resetLehmanTiers}
                        className="w-full py-2 text-xs text-[#264C3F]/60 hover:text-[#264C3F]"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}

                  <div className="bg-[#F9F7F4] p-4 rounded space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#264C3F]/60">Effective Rate</span>
                      <span className="font-semibold">{formatPercentage(lehmanResult.effectiveRate)}</span>
                    </div>
                    <div className="border-t border-[#264C3F]/20 pt-2">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-1">
                          Total Fee
                        </div>
                        <div className="text-2xl font-bold text-[#264C3F]">
                          {formatCurrency(lehmanResult.totalFee)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Comparison */}
            <div className="mt-8 bg-white p-6 md:p-8 rounded-sm shadow-lg">
              <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Fee Comparison Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Simple %</div>
                  <div className={`text-2xl font-bold ${bestMethod === 'Simple %' ? 'text-[#9E8461]' : 'text-[#264C3F]'}`}>
                    {formatCurrency(simpleResult)}
                  </div>
                  <div className="text-xs text-[#264C3F]/60 mt-1">
                    {formatPercentage(parseValue(simpleFeePercent))} rate
                  </div>
                </div>

                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Retainer + Success</div>
                  <div className={`text-2xl font-bold ${bestMethod === 'Retainer' ? 'text-[#9E8461]' : 'text-[#264C3F]'}`}>
                    {formatCurrency(retainerResult.totalFee)}
                  </div>
                  <div className="text-xs text-[#264C3F]/60 mt-1">
                    {useRetainer ? `With ${retainerFrequency} retainer` : 'Success fee only'}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Lehman Scale</div>
                  <div className={`text-2xl font-bold ${bestMethod === 'Lehman' ? 'text-[#9E8461]' : 'text-[#264C3F]'}`}>
                    {formatCurrency(lehmanResult.totalFee)}
                  </div>
                  <div className="text-xs text-[#264C3F]/60 mt-1">
                    {formatPercentage(lehmanResult.effectiveRate)} effective
                  </div>
                </div>
              </div>

              {bestMethod && (
                <div className="mt-6 p-4 bg-[#C7D1C2]/20 rounded text-center">
                  <div className="text-sm text-[#264C3F]">
                    <span className="font-semibold">Best Value:</span> {bestMethod} method at {formatCurrency(lowestFee)}
                  </div>
                  <div className="text-xs text-[#264C3F]/60 mt-1">
                    Savings of {formatCurrency(Math.max(...fees.map(f => f.fee)) - lowestFee)} vs highest fee
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const data = {
                    dealValue: parseValue(dealValue),
                    simpleMethod: { rate: parseValue(simpleFeePercent), fee: simpleResult },
                    retainerMethod: {
                      useRetainer,
                      retainerAmount: useRetainer ? parseValue(retainerAmount) : 0,
                      frequency: useRetainer ? retainerFrequency : null,
                      duration: useRetainer ? parseValue(retainerDuration) : null,
                      successRate: parseValue(retainerFeePercent),
                      fees: retainerResult,
                    },
                    lehmanMethod: { tiers: lehmanTiers, fees: lehmanResult },
                    comparison: { bestMethod, lowestFee, allFees: fees },
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `xecuit-success-fees-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-[#264C3F] text-white font-bold py-4 px-8 text-sm uppercase tracking-[0.2em] hover:bg-[#1a3329] transition-all rounded-sm"
              >
                Export Fee Comparison
              </button>
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
