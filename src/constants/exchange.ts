export type ExchangeType = 'buy' | 'sell';

export type ExchangeCurrency = 'USD' | 'JPY';

export const CURRENCY_ORDER: ExchangeCurrency[] = ['USD', 'JPY'];

export const CURRENCY_LABEL: Record<string, string> = {
  USD: '미국 달러',
  JPY: '일본 엔화',
};

export const CURRENCY_SHORT_LABEL: Record<ExchangeCurrency, string> = {
  USD: '달러',
  JPY: '엔화',
};

export const EXCHANGE_CURRENCY_OPTIONS: {
  value: ExchangeCurrency;
  label: string;
}[] = [
  { value: 'USD', label: '미국 USD' },
  { value: 'JPY', label: '일본 JPY' },
];

export function sortByCurrencyOrder<T extends { currency: string }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      (CURRENCY_ORDER.indexOf(a.currency as ExchangeCurrency) + 1 || 99) -
      (CURRENCY_ORDER.indexOf(b.currency as ExchangeCurrency) + 1 || 99)
  );
}
