import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/categoryService";

type Category = {
  id: number | string;
  name: string;
};

export default function ProductMenu() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const activeId = sp.get("categoryId");

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        // lấy “tất cả” — tăng limit nếu cần
        const res = await getCategories({ page: 1, limit: 1000, search: "" });
        const data = res.data ?? res.items ?? res; // support nhiều kiểu response
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || "Không tải được danh mục"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {err ? (
          <div className="text-sm text-red-600 py-3">{err}</div>
        ) : (
          <ul className="flex gap-6 overflow-x-auto whitespace-nowrap py-3 scrollbar-hide">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="min-w-[90px]">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  </li>
                ))
              : items.map((cat) => {
                  const isActive = String(activeId ?? "") === String(cat.id);
                  return (
                    <li key={cat.id}>
                      <Button
                        type="button"
                        variant="ghost"
                        className={`text-sm font-medium px-1 py-0 h-auto ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-800 hover:text-blue-600"
                        }`}
                        onClick={() => {
                          navigate(`/san-pham?categoryId=${cat.id}`);
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        {cat.name}
                      </Button>
                    </li>
                  );
                })}
          </ul>
        )}
      </div>
    </nav>
  );
}
