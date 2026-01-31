import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  exchangeRate,
  orders,
  ordersCreate,
  ordersQuote,
  wallets,
} from '@/api/exchange';
import { queryKeys } from '@/lib/queryKeys';

export interface OrdersCreateParams {
  exchangeRateId: number;
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
}

export function useExchange() {
  return useQuery({
    queryKey: queryKeys.exchangeRate,
    queryFn: exchangeRate,
    refetchInterval: 60 * 1000,
  });
}

export function useWallets() {
  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: wallets,
  });
}

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: orders,
  });
}

export function useOrdersQuote(
  fromCurrency: string,
  toCurrency: string,
  forexAmount: number
) {
  return useQuery({
    queryKey: queryKeys.ordersQuote(fromCurrency, toCurrency, forexAmount),
    queryFn: () => ordersQuote(fromCurrency, toCurrency, forexAmount),
    enabled: forexAmount > 0,
  });
}

export function useOrdersCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: OrdersCreateParams) =>
      ordersCreate(
        params.exchangeRateId,
        params.fromCurrency,
        params.toCurrency,
        params.forexAmount
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}
