import { useRef, useState } from 'react';
import clsx from 'clsx';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { ExchangeCurrency } from '@/constants/exchange';
import expandLess from '@/assets/expand.svg';
import japan from '@/assets/japan.svg';
import usa from '@/assets/usa.svg';

const FLAG_ICON: Record<ExchangeCurrency, string> = {
  USD: usa,
  JPY: japan,
};

interface Option {
  value: ExchangeCurrency;
  label: string;
}

interface CurrencyDropdownProps {
  value: ExchangeCurrency;
  options: Option[];
  onChange: (value: ExchangeCurrency) => void;
}

export default function CurrencyDropdown({
  value,
  options,
  onChange,
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, isOpen, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-left"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <h4 className="text-xl font-bold text-(--gray-800) flex items-center gap-2">
          <img src={FLAG_ICON[value]} alt="" />
          {value} 환전하기
        </h4>
        <img
          src={expandLess}
          alt="펼치기"
          className={clsx(
            'h-5 w-5 text-(--gray-600) transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-10 mt-2 rounded-[0.625rem] bg-(--gray-white) w-35 py-2 border border-(--gray-200)"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option">
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full px-4 py-3 text-(--gray-700) font-medium hover:bg-(--gray-100) flex items-center gap-3',
                  value === opt.value && 'bg-(--gray-100)'
                )}
              >
                <img src={FLAG_ICON[opt.value]} alt="" />
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
