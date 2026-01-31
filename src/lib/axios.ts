import axios from "axios";
import { useToastStore } from "@/store/useToastStore";
import { ERROR_MESSAGE_MAP } from "./errorMessageMap";

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      useToastStore.getState().showToast(
        '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        'error'
      );
      return Promise.reject(error);
    }

    const { code, message, data } = error.response.data || {};
    if (code === 'UNAUTHORIZED') {
      if (!isRedirecting) {
        isRedirecting = true;
        useToastStore.getState().showToast(
          ERROR_MESSAGE_MAP.UNAUTHORIZED,
          'error'
        );
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    const fieldMessage =
      data && typeof data === 'object'
        ? (Object.values(data).find((v): v is string => typeof v === 'string') ?? null)
        : null;
    const errorMessage =
      fieldMessage ||
      ERROR_MESSAGE_MAP[code] ||
      message ||
      '요청 처리 중 오류가 발생했습니다.';

    useToastStore.getState().showToast(errorMessage, 'error');

    return Promise.reject(error);
  }
);

export default api;