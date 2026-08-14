/**
 * InputField - Branded input component with currency formatting
 */

import { useState } from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'currency';
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  required?: boolean;
  className?: string;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  placeholder = '',
  prefix = '',
  suffix = '',
  min,
  max,
  required = false,
  className = '',
}: InputFieldProps) {
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Remove non-numeric characters for number/currency types
    if (type === 'number' || type === 'currency') {
      newValue = newValue.replace(/[^0-9.]/g, '');

      // Handle multiple decimals
      const parts = newValue.split('.');
      if (parts.length > 2) {
        newValue = parts[0] + '.' + parts.slice(1).join('');
      }

      // Validate min/max
      const numValue = parseFloat(newValue);
      if (min !== undefined && numValue < min) newValue = String(min);
      if (max !== undefined && numValue > max) newValue = String(max);
    }

    setDisplayValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (type === 'currency' && displayValue) {
      const numValue = parseFloat(displayValue);
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }));
      }
    }
  };

  const handleFocus = () => {
    if (type === 'currency') {
      // Remove formatting on focus
      const numValue = parseFloat(displayValue.replace(/,/g, ''));
      if (!isNaN(numValue)) {
        setDisplayValue(String(numValue));
      }
    }
  };

  return (
    <div className={className}>
      <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">
        {label} {required && <span className="text-[#9E8461]">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#264C3F]/50 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`w-full bg-[#F5F3EF] border-0 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-16' : ''}`}
          required={required}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#264C3F]/50 font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
