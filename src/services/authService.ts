import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACK_END;

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  message: string; // "Đăng nhập thành công"
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
    email: string;
    phone: string;
    address: string;
  };
};

export const loginUser = async (data: LoginPayload) => {
  const res = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
  return res.data;
};
