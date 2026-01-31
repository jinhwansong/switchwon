export const queryKeys = {
  exchangeRate: ['exchangeRate'] as const,
  wallets: ['wallets'] as const,
  orders: ['orders'] as const,
  ordersQuote: (fromCurrency: string, toCurrency: string, forexAmount: number) =>
    ['ordersQuote', fromCurrency, toCurrency, forexAmount] as const,
} as const;
