import axios from "axios";
import { api } from "@/services/api";

const API_URL = import.meta.env.VITE_API_BACK_END;

/**
 * Đăng ký user mới (không cần access token)
 */
export const createUser = async (data: {
  username: string;
  password: string;
  name: string;
  role?: string;
}) => {
  const res = await axios.post(`${API_URL}/users`, {
    ...data,
    role: data.role || "USER", // mặc định USER
  });
  return res.data;
};

/**
 * Các API khác vẫn dùng api (có gắn Authorization header)
 */
export const getUserById = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getUsers = async (params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/users", { params });
  return res.data;
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    username: string;
    password: string;
    role: string;
  }>
) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number | string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
