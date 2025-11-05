import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getOrderById,
  updateOrderStatus,
  type Order as ApiOrder,
  type OrderStatus,
} from "@/services/orderService";

const formatPrice = (val: number) =>
  val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const STATUS_VIEW: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-orange-600 text-white hover:bg-orange-600",
  },
  shipping: {
    label: "Đang giao",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  completed: {
    label: "Đã giao",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  cancelled: {
    label: "Đã huỷ",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

const ALLOWED_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
];

const OrderForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(Number(orderId));
        setOrder(data);
        setSelectedStatus((data.status as OrderStatus) ?? "pending");
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Không tải được đơn hàng"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleSaveStatus = async () => {
    if (!order) return;
    try {
      setSaving(true);
      const updated = await updateOrderStatus(order.id, selectedStatus);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: updated.status ?? selectedStatus,
              updatedAt: updated.updatedAt ?? prev.updatedAt,
            }
          : prev
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Cập nhật trạng thái thất bại"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Đang tải chi tiết đơn…
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-red-600">Lỗi: {error}</div>
        <Button variant="outline" onClick={() => navigate("/admin/orders")}>
          ← Quay lại danh sách
        </Button>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Không tìm thấy đơn hàng.
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/orders")}>
          ← Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusView = STATUS_VIEW[order.status];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-xl font-bold">Chi tiết đơn hàng: #{order.id}</h1>
        <Badge className={statusView.className}>{statusView.label}</Badge>
      </div>

      {/* Đổi trạng thái */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Trạng thái đơn</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="border px-3 py-2 rounded bg-white"
              disabled={saving}
            >
              {ALLOWED_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_VIEW[st].label}
                </option>
              ))}
            </select>
            <Button onClick={handleSaveStatus} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu trạng thái"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Trạng thái hiện tại:{" "}
            <strong>{STATUS_VIEW[order.status].label}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Thông tin khách hàng */}
      <Card>
        <CardContent className="p-4 space-y-1">
          <h2 className="font-semibold">Thông tin khách hàng</h2>
          <p>
            <strong>Tên:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.customerEmail}
          </p>
          <p>
            <strong>SĐT:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: vi })}
          </p>
          {order.note ? (
            <p>
              <strong>Ghi chú:</strong> {order.note}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Danh sách sản phẩm</h2>
          {order.items?.map((it) => (
            <div key={it.id} className="flex justify-between">
              <p className="truncate">
                {it.productName} × {it.quantity}
              </p>
              <p>{formatPrice(it.price)}</p>
            </div>
          ))}
          <div className="border-t pt-2 text-right font-semibold">
            Tổng cộng: {formatPrice(order.total)}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => navigate("/admin/orders")}>
        ← Quay lại danh sách
      </Button>
    </div>
  );
};

export default OrderForm;
