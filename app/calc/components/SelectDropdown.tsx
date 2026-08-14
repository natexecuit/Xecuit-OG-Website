/**
 * SelectDropdown - Branded dropdown component
 */

import { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function SelectDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  className = '',
  icon,
}: SelectDropdownProps) {
  return (
    <div className={className}>
      <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-[#9E8461]">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F5F3EF] border-0 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none cursor-pointer"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-[#264C3F]/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
