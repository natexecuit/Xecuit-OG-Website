/**
 * ResultDisplay - Display calculation results with export functionality
 */

import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { exportToPNG, generateFilename } from '@/lib/export';

interface ResultDisplayProps {
  title: string;
  results: Array<{
    label: string;
    value: string | number;
    format?: 'currency' | 'percentage' | 'number';
  }>;
  breakdown?: Array<{ label: string; value: string | number }>;
  calculatorName: string;
  showExport?: boolean;
  className?: string;
}

export function ResultDisplay({
  title,
  results,
  breakdown = [],
  calculatorName,
  showExport = true,
  className = '',
}: ResultDisplayProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = generateFilename(calculatorName);
      await exportToPNG(`result-${calculatorName}`, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      default:
        return String(value);
    }
  };

  return (
    <div
      id={`result-${calculatorName}`}
      className={`bg-[#F9F7F4] p-6 md:p-8 rounded-sm border border-[#264C3F]/10 ${className}`}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-[#264C3F]">{title}</h3>
        {showExport && (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#264C3F] text-white text-xs uppercase tracking-wider rounded-sm hover:bg-[#1a3329] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="lucide:download" className="text-sm" />
            {isExporting ? 'Exporting...' : 'Export PNG'}
          </button>
        )}
      </div>

      {/* Xecuit Logo for export */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#264C3F]/10">
        <img
          src="/xecuit-dark-green-logo.png"
          alt="Xecuit"
          className="h-6 w-auto"
        />
        <span className="text-xs text-[#264C3F]/50 uppercase tracking-widest">
          Calculator Results
        </span>
      </div>

      {/* Main Results */}
      <div className="space-y-4 mb-6">
        {results.map((result, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <span className="text-sm text-[#264C3F]/70">{result.label}</span>
            <span className="text-xl md:text-2xl font-semibold text-[#264C3F]">
              {formatValue(result.value, result.format)}
            </span>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="pt-4 border-t border-[#264C3F]/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E8461] mb-3">
            Breakdown
          </h4>
          <div className="space-y-2">
            {breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-baseline text-sm">
                <span className="text-[#264C3F]/60">{item.label}</span>
                <span className="text-[#264C3F]/80 font-medium">
                  {formatValue(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
