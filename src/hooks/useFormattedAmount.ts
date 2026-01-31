import { useState, useCallback } from 'react';
import { formatNumberForInput } from '@/utils/format';

export function useFormattedAmount() {
  const [displayValue, setDisplayValue] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/,/g, '').replace(/[^\d.]/g, '');
      const dotIndex = raw.indexOf('.');
      if (dotIndex >= 0) {
        const intPart = raw.slice(0, dotIndex);
        const decPart = raw.slice(dotIndex + 1).replace(/\./g, '');
        raw = intPart + '.' + decPart;
      }
      if (raw === '') {
        setDisplayValue('');
        return;
      }
      if (raw === '.') {
        setDisplayValue('0.');
        return;
      }
      const parts = raw.split('.');
      const intPart = parts[0] ? parseInt(parts[0], 10) || 0 : 0;
      const decPart = parts[1] ?? '';
      const formatted =
        formatNumberForInput(intPart) +
        (parts.length > 1 ? '.' + decPart : '');
      setDisplayValue(formatted);
    },
    []
  );

  return { displayValue, setDisplayValue, handleChange };
}
