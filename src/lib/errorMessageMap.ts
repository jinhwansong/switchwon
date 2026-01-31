export const ERROR_MESSAGE_MAP: Record<string, string> = {
  // API 관련 에러
  FAIL: '요청 처리 중 오류가 발생했습니다.',
  BAD_REQUEST: '입력값을 확인해주세요.',
  VALIDATION_ERROR: '요청 데이터가 올바르지 않습니다.',
  MISSING_PARAMETER: '필수 입력값이 누락되었습니다.',

  // 인증
  UNAUTHORIZED: '로그인이 필요한 서비스입니다.',

  // 도메인 관련 에러
  WALLET_INSUFFICIENT_BALANCE: '지갑의 잔액이 부족합니다.',
  INVALID_DEPOSIT_AMOUNT: '입금 금액이 유효하지 않습니다.',
  INVALID_WITHDRAW_AMOUNT: '출금 금액이 유효하지 않습니다.',
  CURRENCY_MISMATCH: '통화 타입이 일치하지 않습니다.',
  INVALID_AMOUNT_SCALE: 'USD 통화는 소수점 2자리까지만 허용됩니다.',
  EXCHANGE_RATE_CURRENCY_MISMATCH:
    '환율의 대상 통화와 변환하려는 금액의 통화가 일치하지 않습니다.',
  UNSUPPORTED_FOREX_CONVERSION_CURRENCY:
    '외화 변환은 원화(KRW)를 지원하지 않습니다.',
  INVALID_EXCHANGE_RATE_CURRENCY: '환율 정보의 통화는 KRW가 될 수 없습니다.',
  UNSUPPORTED_CURRENCY_FOR_KRW_CONVERSION:
    '원화(KRW) 변환은 KRW 통화만 지원합니다.',
  EXCHANGE_RATE_MISMATCH:
    '환율이 변동되었습니다. 변경된 환율 확인 후 다시 입력해 주세요.',
};
