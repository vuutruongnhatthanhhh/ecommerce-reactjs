import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/store";
import {
  getOrdersByUser,
  type Order as ApiOrder,
} from "@/services/orderService";

const formatCurrency = (amount: number) =>
  amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-amber-100 text-amber-700" },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-yellow-100 text-yellow-700",
  },
  shipping: { label: "Đang giao", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Đã giao", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
};

const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const userId = user?.id as number | undefined;

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    if (!userId) return;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getOrdersByUser(userId, {
          page,
          limit /*, signal: ac.signal*/,
        });
        setOrders(res.data ?? []);
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
          return;
        setError(err?.message ?? "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [userId, page, limit]);

  const hasOrders = orders.length > 0;

  // Tổng quan: số đơn & tổng tiền tất cả đơn
  const { totalOrders, grandTotal } = useMemo(() => {
    const totalOrders = orders.length;
    const grandTotal = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
    return { totalOrders, grandTotal };
  }, [orders]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Thông tin người dùng */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
        <Card>
          <CardContent className="p-6 space-y-2">
            <p>
              <strong>Họ tên:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.address}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách đơn hàng */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tình trạng đơn hàng</h2>

        {loading && (
          <div className="text-sm text-muted-foreground">
            Đang tải đơn hàng…
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600">Lỗi tải đơn: {error}</div>
        )}

        {!loading && !error && !hasOrders && (
          <div className="text-sm text-muted-foreground">
            Chưa có đơn hàng nào.
          </div>
        )}

        {!loading && !error && hasOrders && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusView =
                STATUS_MAP[order.status as string] ?? STATUS_MAP["pending"];
              return (
                <Card key={order.id}>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">
                        <strong>Mã đơn:</strong> #{order.id}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${statusView.className}`}
                      >
                        {statusView.label}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {format(new Date(order.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    {/* Ghi chú */}
                    {order.note ? (
                      <p className="text-sm">
                        <strong>Ghi chú:</strong> {order.note}
                      </p>
                    ) : null}

                    {/* Sản phẩm ngắn gọn */}
                    {order.items?.length ? (
                      <div className="pt-2">
                        <p className="text-sm font-semibold mb-1">
                          Sản phẩm ({order.items.length}):
                        </p>
                        <ul className="text-sm space-y-1">
                          {order.items.map((it) => (
                            <li key={it.id} className="flex justify-between">
                              <span className="truncate">
                                {it.productName} × {it.quantity}
                              </span>
                              <span>{formatCurrency(it.price)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
