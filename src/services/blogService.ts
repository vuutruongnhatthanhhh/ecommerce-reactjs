import axios from "axios";
import { api } from "@/services/api"; // instance có Authorization: Bearer ...
const API_URL = import.meta.env.VITE_API_BACK_END;

export type BlogPayload = {
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  image?: string | null;
  createdAt: string;
};

/** ========= CREATE/UPDATE/DELETE: CẦN AUTH (dùng api) ========= */

export const createBlog = async (payload: BlogPayload) => {
  const res = await api.post("/blogs", payload);
  return res.data;
};

export const updateBlog = async (
  id: string | number,
  data: Partial<BlogPayload>
) => {
  const res = await api.patch(`/blogs/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id: string | number) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};

/** ====================== GET: KHÔNG CẦN AUTH ====================== */

export const getBlogs = async ({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axios.get(`${API_URL}/blogs`, {
    params: { search, page, limit },
  });
  return res.data;
};

export const getBlogById = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/blogs/by-id/${id}`);
  return res.data;
};

export const getBlogByUrl = async (url: string) => {
  const res = await axios.get(`${API_URL}/blogs/by-url/${url}`);
  return res.data;
};

export const getLatestBlogs = async (): Promise<BlogPayload[]> => {
  const res = await axios.get(`${API_URL}/blogs/latest`);
  return res.data;
};
