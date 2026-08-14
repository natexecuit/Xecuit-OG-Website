/**
 * Valuation Calculator - Holistic View
 * Compare all valuation methods side-by-side with editable parameters
 */

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';
import { InputField } from '../components/InputField';

// Default Trading Comps
const DEFAULT_COMPS = [
  { name: 'Comp A', ebitda: '2500000', multiple: '6.5' },
  { name: 'Comp B', ebitda: '3000000', multiple: '7.0' },
  { name: 'Comp C', ebitda: '2000000', multiple: '6.0' },
];

export default function ValuationPage() {
  // Subject Company Data
  const [subjectRevenue, setSubjectRevenue] = useState('10000000');
  const [subjectEBITDA, setSubjectEBITDA] = useState('2000000');

  // Implied Valuation Method
  const [impliedMultiple, setImpliedMultiple] = useState('6.5');

  // Trading Comps
  const [comps, setComps] = useState(DEFAULT_COMPS);

  // Calculated Results
  const [marginResult, setMarginResult] = useState({ margin: 0, status: '' });
  const [impliedResult, setImpliedResult] = useState({ enterpriseValue: 0, multiple: 0 });
  const [compsResult, setCompsResult] = useState<{
    minValuation: number;
    maxValuation: number;
    avgMultiple: number;
    impliedValuation: number;
    comps: Array<{ name: string; multiple: number; valuation: number }>;
  }>({
    minValuation: 0,
    maxValuation: 0,
    avgMultiple: 0,
    impliedValuation: 0,
    comps: [],
  });

  // Parse input value
  const parseValue = (value: string) => parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

  // Format number with commas
  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseValue(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Calculate all valuations whenever inputs change
  useEffect(() => {
    const revenue = parseValue(subjectRevenue);
    const ebitda = parseValue(subjectEBITDA);

    // EBITDA Margin
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    let marginStatus = 'low';
    if (margin >= 20) marginStatus = 'healthy';
    else if (margin >= 10) marginStatus = 'adequate';
    setMarginResult({ margin, status: marginStatus });

    // Implied Valuation
    const multiple = parseValue(impliedMultiple);
    const enterpriseValue = ebitda * multiple;
    setImpliedResult({ enterpriseValue, multiple });

    // Trading Comps
    const validComps = comps
      .filter(c => parseValue(c.ebitda) > 0 && parseValue(c.multiple) > 0)
      .map(c => ({
        name: c.name,
        ebitda: parseValue(c.ebitda),
        multiple: parseValue(c.multiple),
      }));

    if (validComps.length >= 2) {
      const multiples = validComps.map(c => c.multiple);
      const avgMultiple =
        multiples.length > 0
          ? multiples.reduce((sum, m) => sum + m, 0) / multiples.length
          : 0;

      const minMultiple = multiples.length > 0 ? Math.min(...multiples) : 0;
      const maxMultiple = multiples.length > 0 ? Math.max(...multiples) : 0;

      const minValuation = ebitda * minMultiple;
      const maxValuation = ebitda * maxMultiple;
      const impliedVal = ebitda * avgMultiple;

      setCompsResult({
        minValuation,
        maxValuation,
        avgMultiple,
        impliedValuation: impliedVal,
        comps: validComps.map(c => ({
          name: c.name,
          multiple: c.multiple,
          valuation: c.ebitda * c.multiple,
        })),
      });
    }
  }, [subjectRevenue, subjectEBITDA, impliedMultiple, comps]);

  // Trading Comps management
  const addComp = () => {
    setComps([
      ...comps,
      { name: `Comp ${comps.length + 1}`, ebitda: '', multiple: '' },
    ]);
  };

  const removeComp = (index: number) => {
    if (comps.length > 2) {
      setComps(comps.filter((_, i) => i !== index));
    }
  };

  const updateComp = (index: number, field: 'name' | 'ebitda' | 'multiple', value: string) => {
    const updated = [...comps];
    updated[index][field] = value;
    setComps(updated);
  };

  const resetComps = () => {
    setComps(DEFAULT_COMPS);
  };

  // Get margin status styling
  const getMarginStatusStyle = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'adequate':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Find valuation ranges
  const allValuations = [
    { method: 'EBITDA Margin', value: marginResult.margin },
    { method: 'Implied Valuation', value: impliedResult.enterpriseValue },
    { method: 'Trading Comps', value: compsResult.impliedValuation },
  ];

  const valuationMetrics = [
    { label: 'Revenue Multiple', value: subjectEBITDA ? (parseValue(subjectRevenue) / parseValue(subjectEBITDA)).toFixed(2) + 'x' : 'N/A' },
    { label: 'EBITDA Multiple', value: parseValue(subjectRevenue) && parseValue(subjectEBITDA) ? (parseValue(impliedMultiple)).toFixed(2) + 'x' : 'N/A' },
    { label: 'Enterprise Value', value: formatCurrency(impliedResult.enterpriseValue) },
  ];

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
              Valuation <span className="text-[#9E8461] italic">Calculator</span>
            </h1>
            <p className="text-lg text-[#264C3F]/70 leading-relaxed max-w-2xl font-light">
              Analyze business value using multiple methodologies. Enter your financials once and compare all valuation approaches side-by-side.
            </p>
          </div>
        </section>

        {/* Main Calculator */}
        <section className="relative py-8 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            {/* Company Financials Input */}
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-lg mb-8">
              <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Subject Company Financials</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Annual Revenue"
                  value={subjectRevenue}
                  onChange={setSubjectRevenue}
                  type="currency"
                  placeholder="10,000,000"
                  prefix="$"
                  required
                />
                <InputField
                  label="TTM EBITDA"
                  value={subjectEBITDA}
                  onChange={setSubjectEBITDA}
                  type="currency"
                  placeholder="2,000,000"
                  prefix="$"
                  required
                />
              </div>
            </div>

            {/* Three Method Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* EBITDA Margin Card */}
              <div className="bg-white p-6 rounded-sm shadow-lg">
                <h3 className="text-lg font-semibold text-[#264C3F] mb-4">EBITDA Margin</h3>
                <div className="space-y-4">
                  <div className="bg-[#F9F7F4] p-4 rounded">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">
                        Margin
                      </div>
                      <div className="text-3xl font-bold text-[#264C3F]">
                        {formatPercentage(marginResult.margin)}
                      </div>
                      <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getMarginStatusStyle(marginResult.status)}`}>
                        {marginResult.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-[#264C3F]/60">
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-semibold">{formatCurrency(parseValue(subjectRevenue))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EBITDA:</span>
                      <span className="font-semibold">{formatCurrency(parseValue(subjectEBITDA))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Implied Valuation Card */}
              <div className="bg-white p-6 rounded-sm shadow-lg">
                <h3 className="text-lg font-semibold text-[#264C3F] mb-4">Implied Valuation</h3>
                <div className="space-y-4">
                  <InputField
                    label="Valuation Multiple"
                    value={impliedMultiple}
                    onChange={setImpliedMultiple}
                    type="number"
                    placeholder="6.5"
                    suffix="x"
                  />
                  <div className="bg-[#F9F7F4] p-4 rounded">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">
                        Enterprise Value
                      </div>
                      <div className="text-3xl font-bold text-[#264C3F]">
                        {formatCurrency(impliedResult.enterpriseValue)}
                      </div>
                      <div className="text-xs text-[#264C3F]/60 mt-1">
                        At {parseValue(impliedMultiple).toFixed(2)}x multiple
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Comps Card */}
              <div className="bg-white p-6 rounded-sm shadow-lg">
                <h3 className="text-lg font-semibold text-[#264C3F] mb-4">Trading Comps</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const currentShow = document.getElementById('comps-editor')?.style.display !== 'none';
                      document.getElementById('comps-editor')!.style.display = currentShow ? 'none' : 'block';
                    }}
                    className="text-xs text-[#9E8461] hover:underline flex items-center gap-1"
                  >
                    <Icon icon="lucide:settings" className="text-sm" />
                    Edit Comps
                  </button>

                  <div id="comps-editor" style={{ display: 'none' }} className="space-y-3 max-h-64 overflow-y-auto">
                    {comps.map((comp, index) => (
                      <div key={index} className="p-3 bg-[#F5F3EF] rounded space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#9E8461]">
                            {index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : index + 1}
                          </span>
                          {comps.length > 2 && (
                            <button
                              onClick={() => removeComp(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={comp.name}
                            onChange={(e) => updateComp(index, 'name', e.target.value)}
                            placeholder="Comp Name"
                            className="w-full bg-white border-0 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-[#264C3F]/50 mb-1">EBITDA ($)</label>
                              <input
                                type="text"
                                value={comp.ebitda ? formatNumber(comp.ebitda) : ''}
                                onChange={(e) => updateComp(index, 'ebitda', e.target.value.replace(/,/g, ''))}
                                placeholder="2,500,000"
                                className="w-full bg-white border-0 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#264C3F]/50 mb-1">Multiple</label>
                              <input
                                type="number"
                                value={comp.multiple}
                                onChange={(e) => updateComp(index, 'multiple', e.target.value)}
                                placeholder="6.5"
                                step="0.1"
                                className="w-full bg-white border-0 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E8461]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addComp}
                      className="w-full py-2 text-xs text-[#9E8461] border border-dashed border-[#9E8461]/30 hover:bg-[#9E8461]/5 rounded"
                    >
                      + Add Comp
                    </button>
                    <button
                      onClick={resetComps}
                      className="w-full py-2 text-xs text-[#264C3F]/60 hover:text-[#264C3F]"
                    >
                      Reset to Default
                    </button>
                  </div>

                  <div className="bg-[#F9F7F4] p-4 rounded space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#264C3F]/60">Average Multiple</span>
                      <span className="font-semibold">{compsResult.avgMultiple.toFixed(2)}x</span>
                    </div>
                    <div className="border-t border-[#264C3F]/20 pt-2">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-1">
                          Implied Value
                        </div>
                        <div className="text-2xl font-bold text-[#264C3F]">
                          {formatCurrency(compsResult.impliedValuation)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#264C3F]/60">
                    <div className="flex justify-between">
                      <span>Range Low:</span>
                      <span>{formatCurrency(compsResult.minValuation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Range High:</span>
                      <span>{formatCurrency(compsResult.maxValuation)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valuation Summary */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg mb-8">
              <h3 className="text-lg font-semibold text-[#264C3F] mb-6">Valuation Summary</h3>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Revenue/EBITDA</div>
                  <div className="text-2xl font-bold text-[#264C3F]">
                    {parseValue(subjectRevenue) && parseValue(subjectEBITDA)
                      ? (parseValue(subjectRevenue) / parseValue(subjectEBITDA)).toFixed(2) + 'x'
                      : 'N/A'}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">EBITDA Margin</div>
                  <div className={`text-2xl font-bold ${getMarginStatusStyle(marginResult.status).split(' ')[0]}`}>
                    {formatPercentage(marginResult.margin)}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#F9F7F4] rounded">
                  <div className="text-xs uppercase tracking-widest text-[#264C3F]/60 mb-2">Avg Multiple</div>
                  <div className="text-2xl font-bold text-[#264C3F]">
                    {compsResult.avgMultiple.toFixed(2)}x
                  </div>
                </div>
              </div>

              {/* Valuation Range Comparison */}
              <div className="border-t border-[#264C3F]/10 pt-6">
                <h4 className="text-sm font-semibold text-[#264C3F] mb-4">Valuation Range Comparison</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#F9F7F4] rounded">
                    <span className="text-sm text-[#264C3F]/70">Implied Valuation ({parseValue(impliedMultiple).toFixed(1)}x)</span>
                    <span className="font-semibold text-[#264C3F]">{formatCurrency(impliedResult.enterpriseValue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F9F7F4] rounded">
                    <span className="text-sm text-[#264C3F]/70">Trading Comps (Avg: {compsResult.avgMultiple.toFixed(1)}x)</span>
                    <span className="font-semibold text-[#264C3F]">{formatCurrency(compsResult.impliedValuation)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#C7D1C2]/20 rounded">
                    <span className="text-sm font-semibold text-[#264C3F]">Comps Range</span>
                    <span className="font-semibold text-[#264C3F]">
                      {formatCurrency(compsResult.minValuation)} - {formatCurrency(compsResult.maxValuation)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  const data = {
                    subject: {
                      revenue: parseValue(subjectRevenue),
                      ebitda: parseValue(subjectEBITDA),
                    },
                    margin: marginResult,
                    implied: impliedResult,
                    tradingComps: {
                      comps: comps,
                      results: compsResult,
                    },
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `xecuit-valuation-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-[#264C3F] text-white font-bold py-4 px-8 text-sm uppercase tracking-[0.2em] hover:bg-[#1a3329] transition-all rounded-sm"
              >
                Export Valuation
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
