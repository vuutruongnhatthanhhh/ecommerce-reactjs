import axios from "axios";
import { api } from "@/services/api"; // instance có Authorization: Bearer ...
const API_URL = import.meta.env.VITE_API_BACK_END;

export type ProductPayload = {
  name: string;
  url: string;
  image: string;
  shortDescription: string;
  content: string;
  price: number;
  categoryId: number;
};

/** ========== CREATE / UPDATE / DELETE: CẦN AUTH (dùng api) ========== */

export const createProduct = async (payload: ProductPayload) => {
  const res = await api.post("/products", payload);
  return res.data;
};

export const updateProduct = async (
  id: string | number,
  data: Partial<ProductPayload>
) => {
  const res = await api.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string | number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

/** ========== GET: KHÔNG CẦN AUTH (dùng axios trực tiếp) ========== */

export const getProducts = async ({
  search = "",
  page = 1,
  limit = 10,
  categoryId = "",
}: {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}) => {
  const res = await axios.get(`${API_URL}/products`, {
    params: { search, page, limit, categoryId },
  });
  return res.data;
};

export const getProductById = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/products/by-id/${id}`);
  return res.data;
};

export const getProductByUrl = async (url: string) => {
  const res = await axios.get(`${API_URL}/products/by-url/${url}`);
  return res.data;
};

export const getLatestProducts = async (): Promise<ProductPayload[]> => {
  const res = await axios.get(`${API_URL}/products/latest`);
  return res.data;
};
