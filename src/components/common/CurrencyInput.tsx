import React from 'react';
import { formatINRLakhWords, parseINRInput } from '../../utils/currency';

interface CurrencyInputProps {
  value: number | undefined | null;
  onChange: (val: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. 5,00,000',
  min = 0,
  max,
  className = '',
  disabled = false,
}) => {
  const displayValue = value !== undefined && value !== null && value > 0 
    ? value.toLocaleString('en-IN') 
    : value === 0 ? '0' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseINRInput(raw);
    if (max !== undefined && parsed > max) {
      onChange(max);
    } else {
      onChange(Math.max(min, parsed));
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-slate-400 font-semibold text-base select-none">
          ₹
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-9 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all ${className}`}
        />
      </div>
      {value !== undefined && value !== null && value > 0 && (
        <p className="mt-1.5 text-xs text-brand-400 font-medium pl-1">
          {formatINRLakhWords(value)}
        </p>
      )}
    </div>
  );
};
