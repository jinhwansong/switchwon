import api from "../lib/axios";

/* 로그인 API */
interface LoginResponse {
  code: string;
  message: string;
  data: {
    memberId: number;
    token: string;
  };
}

export const login = async (email: string): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', null, {
    params: {
      email,
    },
  });
  return res.data;
};