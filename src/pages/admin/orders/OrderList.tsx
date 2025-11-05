import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { toast } from "sonner";
import {
  getAllOrders,
  deleteOrder,
  type Order as ApiOrder,
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

const OrderList = () => {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [searchInput, setSearchInput] = useState<string>(user?.phone ?? "");
  const [search, setSearch] = useState<string>(user?.phone ?? "");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Debounce searchInput -> search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // reset page khi search thay đổi
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllOrders({
        search: search || undefined,
        page,
        limit,
      });
      setOrders(res.data ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      setError(err?.message ?? "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const totalGrand = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [orders]
  );

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Xoá đơn #${id}?`);
    if (!ok) return;

    try {
      setDeletingId(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      await deleteOrder(id);
      toast.success(`Đã xoá đơn #${id}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Xoá đơn thất bại"
      );
      fetchOrders();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <h1 className="text-xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Input
          placeholder="Tìm theo số điện thoại..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Tổng quan */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <span>
          <strong>Tổng đơn trang này:</strong> {orders.length}
        </span>
        <span>
          <strong>Tổng tiền trang này:</strong> {formatPrice(totalGrand)}
        </span>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Đang tải…</div>
      )}
      {error && <div className="text-sm text-red-600">Lỗi: {error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="text-sm text-muted-foreground">Không có đơn hàng.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-2">
          {orders.map((order) => {
            const statusView =
              STATUS_VIEW[order.status] ?? STATUS_VIEW["pending"];
            const isDeleting = deletingId === order.id;
            return (
              <div
                key={order.id}
                className="flex justify-between border p-4 rounded items-start gap-4"
                aria-busy={isDeleting}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold break-all">
                    Đơn hàng: #{order.id}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">
                    Khách: {order.customerName} —{" "}
                    {format(new Date(order.createdAt), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm mt-1">
                    Tổng: {formatPrice(order.total)}
                  </p>
                  {order.note ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      Ghi chú: {order.note}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge className={statusView.className}>
                    {statusView.label}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      disabled={isDeleting}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        "Đang xoá..."
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          variant="outline"
        >
          Trang trước
        </Button>
        <span className="flex items-center px-2 text-sm">
          Trang {page} / {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          variant="outline"
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default OrderList;
