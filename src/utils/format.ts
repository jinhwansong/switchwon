// 예: 기본 숫자 (천 단위 콤마)
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

// 예: 소수 자리 고정 (환율 등, 천 단위 콤마)
export function formatRate(value: number, fractionDigits = 2): string {
  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

// 예: 통화 심볼 + 공백 + 금액 (₩ 1,234 / $ 1,234.56, 천 단위 콤마)
const CURRENCY_SYMBOL: Record<string, string> = {
  KRW: '₩',
  USD: '$',
  JPY: '¥',
};
export function formatCurrency(
  value: number,
  currency: string = 'KRW'
): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency;
  const formatted = value.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${symbol} ${formatted}`;
}

// 숫자를 천 단위 콤마 문자열로 (정수만)
export function formatNumberForInput(value: number): string {
  return Math.floor(value).toLocaleString('ko-KR');
}

// 숫자를 천 단위 콤마 + 소수점 maxFractionDigits 자리까지 (입력용)
export function formatNumberForInputWithDecimals(
  value: number,
  maxFractionDigits = 2
): string {
  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

// 콤마 있는 문자열을 숫자로 파싱 (소수 지원)
export function parseFormattedNumber(str: string): number {
  const stripped = str.replace(/,/g, '');
  const num = parseFloat(stripped);
  return Number.isNaN(num) ? 0 : num;
}
