import api from "@/lib/axios";

/* 최신 환율 조회 API */
interface ExchangeRateResponse {
  code: string;
  message: string;
  data: {
    exchangeRateId: number;
    currency: string;
    rate: number;
    changePercentage: number;
    applyDateTime: string;
  }[];
}

export const exchangeRate = async (): Promise<ExchangeRateResponse> => {
  const res = await api.get('/exchange-rates/latest');
  return res.data;
};

/* 환전 주문 내역 조회 API */
interface ordersResponse {
  code: string;
  message: string;
  data: {
    orderId: number;
    fromCurrency: string;
    fromAmount: number;
    toCurrency: string;
    toAmount: number;
    appliedRate: number;
    orderedAt: string;
  }[];
}

export const orders = async (): Promise<ordersResponse> => {
  const res = await api.get('/orders');
  return res.data;
};

/* 지갑조회 API */
interface walletsResponse {
  code: string;
  message: string;
  data: {
    totalKrwBalance: number;
    wallets: {
      walletId: number;
      currency: string;
      balance: number;
    }[];
  };
}

export const wallets = async (): Promise<walletsResponse> => {
  const res = await api.get('/wallets');
  return res.data;
};


/* 환전 주문 견적 조회 API */
interface ordersQuoteResponse{
  code: string;
  message: string;
  data: {
    krwAmount: number;
    appliedRate: number;
  };
}

export const ordersQuote = async (fromCurrency: string, toCurrency: string, forexAmount: number): Promise<ordersQuoteResponse> => {
  const res = await api.get('/orders/quote', {
    params: {
      fromCurrency,
      toCurrency,
      forexAmount,
    },
  });
  return res.data;
};


/* 환전 주문 요청 API */
interface ordersCreateResponse{
  code: string;
  message: string;
  data: string;
}

export const ordersCreate = async (exchangeRateId: number, fromCurrency: string, toCurrency: string, forexAmount: number): Promise<ordersCreateResponse> => {
  const res = await api.post('/orders', {
    exchangeRateId,
    fromCurrency,
    toCurrency,
    forexAmount,
  });
  return res.data;
};
