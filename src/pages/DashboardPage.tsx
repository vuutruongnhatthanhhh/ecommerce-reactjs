import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/services/userService";
import { getProducts } from "@/services/productService";
import { getAllOrders } from "@/services/orderService";

type TotalsState = {
  users: number;
  products: number;
  orders: number;
};

const DashboardPage = () => {
  const [totals, setTotals] = useState<TotalsState>({
    users: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotals = async () => {
    try {
      setLoading(true);
      setError(null);

      const [uRes, pRes, oRes] = await Promise.all([
        getUsers({ page: 1, limit: 1 }), // { data, total, page, totalPages }
        getProducts({ page: 1, limit: 1, search: "" }), // { data, total, page, totalPages }
        getAllOrders({ page: 1, limit: 1 }), // { data, total, page, totalPages }
      ]);

      setTotals({
        users: Number(uRes?.total ?? 0),
        products: Number(pRes?.total ?? 0),
        orders: Number(oRes?.total ?? 0),
      });
    } catch (err: any) {
      setError(err?.message ?? "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  const cards = useMemo(
    () => [
      { title: "Người dùng", value: totals.users },
      { title: "Sản phẩm", value: totals.products },
      { title: "Đơn hàng", value: totals.orders },
    ],
    [totals]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thống kê tổng quan</h1>
        <div className="flex items-center gap-2">
          <Button onClick={fetchTotals} disabled={loading} variant="outline">
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      <Separator />

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((stat, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {loading ? "…" : stat.value.toLocaleString("vi-VN")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
