import axios from "axios";
import { api } from "@/services/api"; // instance có Authorization: Bearer ...
const API_URL = import.meta.env.VITE_API_BACK_END;

/** ====== CREATE / UPDATE / DELETE: CẦN AUTH (dùng api) ====== */

export const createCategory = async (data: { name: string }) => {
  const res = await api.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id: string, data: { name: string }) => {
  const res = await api.patch(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

/** ============================ GET: KHÔNG CẦN AUTH ============================ */

export const getCategories = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axios.get(`${API_URL}/categories`, { params });
  return res.data;
};

export const getCategoryById = async (id: string) => {
  const res = await axios.get(`${API_URL}/categories/${id}`);
  return res.data;
};
