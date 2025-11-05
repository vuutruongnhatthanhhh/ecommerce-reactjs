import { api } from "@/services/api";

export type OrderItemPayload = {
  productId: number;
  productName: string;
  productImage: string; // URL ảnh
  price: number;
  quantity: number;
};

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  note?: string; // optional
  userId: number; // từ auth.user.id
  items: OrderItemPayload[];
};

export const createOrder = async (payload: CreateOrderPayload) => {
  // Bearer token sẽ tự được gắn bởi api interceptor
  const res = await api.post("/orders", payload);
  return res.data;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  total: number;
  note?: string | null;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  createdAt: string; // ISO
  updatedAt: string; // ISO
  userId: number;
  items: OrderItem[];
};

export type OrdersResponse = {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
};

/**
 * Lấy danh sách đơn theo userId
 * Backend: GET /api/v1/orders/user/:userId?page=&limit=
 */
export const getOrdersByUser = async (
  userId: number,
  params: { page?: number; limit?: number } = {}
) => {
  const { page, limit } = params;
  const res = await api.get<OrdersResponse>(`/orders/user/${userId}`, {
    params: { page, limit },
  });
  return res.data;
};

/* ======================== Get all orders (search by phone) ======================== */
type GetAllOrdersParams = {
  search?: string; // ví dụ: "0911622262"
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

/**
 * Lấy tất cả đơn (có thể kèm search theo số điện thoại)
 * Backend: GET /api/v1/orders?search=...&page=&limit=
 */
export const getAllOrders = async (
  params: GetAllOrdersParams = {}
): Promise<OrdersResponse> => {
  const { search, page, limit, signal } = params;
  const res = await api.get<OrdersResponse>("/orders", {
    params: { search, page, limit },
    signal,
  });
  return res.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const res = await api.get<Order>(`/orders/${id}`);
  return res.data;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<Order> => {
  const res = await api.patch<Order>(`/orders/${id}`, { status });
  return res.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};
