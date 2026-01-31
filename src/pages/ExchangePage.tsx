import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import PageSection from '@/components/common/PageSection';
import Button from '@/components/common/Button';
import CurrencyDropdown from '@/components/exchange/CurrencyDropdown';
import {
  CURRENCY_LABEL,
  EXCHANGE_CURRENCY_OPTIONS,
  CURRENCY_SHORT_LABEL,
  sortByCurrencyOrder,
} from '@/constants/exchange';
import type { ExchangeCurrency, ExchangeType } from '@/constants/exchange';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useExchange,
  useOrdersCreate,
  useOrdersQuote,
  useWallets,
} from '@/hooks/useExchange';
import { queryKeys } from '@/lib/queryKeys';
import { useToastStore } from '@/store/useToastStore';
import { useFormattedAmount } from '@/hooks/useFormattedAmount';
import { formatCurrency, formatNumber, formatRate, parseFormattedNumber } from '@/utils/format';
import upArrow from '@/assets/upArrow.svg';
import downArrow from '@/assets/downArrow.svg';
import downOutline from '@/assets/downOutline.svg';

export default function ExchangePage() {
  const [exchangeType, setExchangeType] = useState<ExchangeType>('buy');
  const [selectedCurrency, setSelectedCurrency] =
    useState<ExchangeCurrency>('USD');
  const { displayValue, setDisplayValue, handleChange } = useFormattedAmount();
  const { data: exchangeRate } = useExchange();
  const { data: wallets } = useWallets();
  const amount = parseFormattedNumber(displayValue);
  const debouncedAmount = useDebounce(amount, 200);
  const { data: quote } = useOrdersQuote(
    selectedCurrency,
    'KRW',
    debouncedAmount
  );
  const queryClient = useQueryClient();
  const ordersCreateMutation = useOrdersCreate();
  const showToast = useToastStore((state) => state.showToast);

  const sortedRates = useMemo(
    () => sortByCurrencyOrder(exchangeRate?.data ?? []),
    [exchangeRate?.data]
  );

  const currentRateItem = useMemo(
    () => sortedRates.find((r) => r.currency === selectedCurrency),
    [sortedRates, selectedCurrency]
  );

  const appliedRateLabel =
    selectedCurrency === 'USD'
      ? `1 USD = ${formatRate(currentRateItem?.rate ?? 0)} 원`
      : `100 JPY = ${formatRate(currentRateItem?.rate ?? 0)} 원`;

  const canSubmit =
    amount > 0 &&
    currentRateItem?.exchangeRateId != null &&
    !ordersCreateMutation.isPending;

  // EXCHANGE_RATE_MISMATCH 시 명세(최신 환율 재조회 후 주문 시도)를 1회 자동 재시도로 해석하여 구현
  const handleExchange = () => {
    const exchangeRateId = currentRateItem?.exchangeRateId;
    if (exchangeRateId == null || amount <= 0) return;
    const fromCurrency = exchangeType === 'buy' ? 'KRW' : selectedCurrency;
    const toCurrency = exchangeType === 'buy' ? selectedCurrency : 'KRW';

    const doOrder = (id: number, isRetry = false) => {
      ordersCreateMutation.mutate(
        { exchangeRateId: id, fromCurrency, toCurrency, forexAmount: amount },
        {
          onSuccess: () => {
            showToast('환전이 완료되었습니다.', 'success');
          },
          onError: (error: unknown) => {
            if (isRetry) return;
            const code = (error as { response?: { data?: { code?: string } } })?.response?.data?.code;
            if (code === 'EXCHANGE_RATE_MISMATCH') {
              queryClient
                .refetchQueries({ queryKey: queryKeys.exchangeRate })
                .then(() => {
                  const data = queryClient.getQueryData<{ data?: { exchangeRateId: number; currency: string }[] }>(
                    queryKeys.exchangeRate
                  );
                  const rateList = data?.data ?? [];
                  const sorted = sortByCurrencyOrder(rateList);
                  const rateItem = sorted.find((r) => r.currency === selectedCurrency);
                  const newId = rateItem?.exchangeRateId;
                  if (newId != null) doOrder(newId, true);
                });
            }
          },
          onSettled: () => {
            setDisplayValue('');
          },
        }
      );
    };

    doOrder(exchangeRateId);
  };

  return (
    <PageSection
      title="환율 정보"
      subtitle="실시간 환율을 확인하고 간편하게 환전하세요."
    >
      <div className="grid grid-cols-2 gap-6 items-stretch">
        {/* LEFT */}
        <div className="flex flex-col gap-6 h-full">
          {/* 환율 카드 */}
          <div className="flex gap-5">
            {sortedRates.map((item) => {
              const isUp = item.changePercentage > 0;

              return (
                <div
                  key={item.exchangeRateId}
                  className="flex-1 rounded-xl border border-(--gray-300) bg-(--gray-white) px-8 py-6"
                >
                  <div className="flex justify-between text-(--gray-600)">
                    <span className="text-[1.25rem] font-semibold">
                      {item.currency}
                    </span>
                    <span className="text-base">
                      {CURRENCY_LABEL[item.currency] ?? item.currency}
                    </span>
                  </div>

                  <div className="mt-2 mb-1 text-2xl font-bold text-(--gray-800)">
                    {formatRate(item.rate)} <span>KRW</span>
                  </div>

                  <div
                    className={clsx(
                      'text-base flex items-center gap-1',
                      isUp ? 'text-(--buy-primary)' : 'text-(--sell-primary)'
                    )}
                  >
                    <img
                      src={isUp ? upArrow : downArrow}
                      alt={isUp ? '상승' : '하락'}
                    />
                    <span>
                      {isUp ? '+' : ''}
                      {item.changePercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 내 지갑 */}
          <div className="flex flex-col flex-1 rounded-xl border border-(--gray-300) bg-(--gray-0) px-8 py-6">
            <h2 className="mb-8 text-2xl font-extrabold text-(--gray-800)">
              내 지갑
            </h2>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {wallets?.data?.wallets?.map((item) => (
                <div
                  key={item.walletId}
                  className="flex justify-between text-(--gray-600) text-[1.25rem]"
                >
                  <span className="font-medium">{item.currency}</span>
                  <span className="font-semibold">
                    {formatCurrency(item.balance, item.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-(--gray-300) flex justify-between text-[1.25rem]">
              <span className="text-(--gray-600) font-medium">
                총 보유 자산
              </span>
              <span className="text-(--blue-500) font-bold">
                {formatCurrency(wallets?.data?.totalKrwBalance ?? 0, 'KRW')}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col h-full rounded-xl border border-(--gray-300) bg-(--gray-0) px-8 py-6">
          <CurrencyDropdown
            value={selectedCurrency}
            options={EXCHANGE_CURRENCY_OPTIONS}
            onChange={setSelectedCurrency}
          />

          <div className="mt-4 mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-(--gray-300) bg-(--gray-white) p-3">
            <Button
              type="button"
              variant="buy"
              selected={exchangeType === 'buy'}
              onClick={() => {
                setExchangeType('buy');
                setDisplayValue('');
              }}
            >
              살래요
            </Button>
            <Button
              type="button"
              variant="sell"
              selected={exchangeType === 'sell'}
              onClick={() => {
                setExchangeType('sell');
                setDisplayValue('');
              }}
            >
              팔래요
            </Button>
          </div>

          <div>
            <h5 className="mb-3 text-[1.25rem] font-semibold text-(--gray-800)">
              {exchangeType === 'buy' ? '매수' : '매도'} 금액
            </h5>

            <div className="flex items-center justify-end gap-2 rounded-xl border border-(--gray-700) bg-(--gray-white) p-6 text-[1.25rem] text-(--gray-600)">
              <input
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder="0"
                className="flex-1 min-w-0 text-right font-semibold"
              />
              <span className="font-medium">
                {CURRENCY_SHORT_LABEL[selectedCurrency]}{' '}
                {exchangeType === 'buy' ? '사기' : '팔기'}
              </span>
            </div>
          </div>

          <img src={downOutline} alt="변환 화살표" className="mx-auto my-4" />

          <div>
            <h5 className="mb-3 text-[1.25rem] font-semibold text-(--gray-800)">
              {exchangeType === 'buy' ? '필요' : '환전'} 원화
            </h5>

            <div className="rounded-xl border border-(--gray-300) bg-(--gray-100) p-6 text-right text-[1.25rem]">
              <span className="font-semibold text-(--gray-600) mr-2.5">
                {formatNumber(quote?.data.krwAmount ?? 0)}
              </span>

              {exchangeType === 'buy' ? (
                <span className="font-bold text-(--buy-primary)">
                  원 필요해요
                </span>
              ) : (
                <span className="font-bold text-(--sell-primary)">
                  원 받을 수 있어요
                </span>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-(--gray-300) flex justify-between text-[1.25rem] text-(--gray-600) mt-27 mb-8">
            <span className="font-medium">적용 환율</span>
            <span className="font-semibold text-(--gray-800)">
              {appliedRateLabel}
            </span>
          </div>

          <Button
            full
            type="button"
            onClick={handleExchange}
            disabled={!canSubmit}
          >
            {ordersCreateMutation.isPending ? '처리 중...' : '환전하기'}
          </Button>
        </div>
      </div>
    </PageSection>
  );
}
