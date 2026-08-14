/**
 * CalculatorCard - Reusable card wrapper for calculator sections
 */

import { ReactNode } from 'react';

interface CalculatorCardProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function CalculatorCard({ children, title, description, className = '' }: CalculatorCardProps) {
  return (
    <div className={`bg-white p-6 md:p-8 rounded-sm shadow-lg ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-[#264C3F] mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-[#264C3F]/60">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
