import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard, { type ProductCardItem } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

function useDebounce<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

type Category = { id: string | number; name: string };

type ProductApi = {
  id: string | number;
  url?: string;
  slug?: string;
  name: string;
  price: number;
  image?: string | null;
  inStock?: boolean | null;
  rating?: number | null;
  categoryId?: number | string;
  category?: { id?: string | number; name?: string } | null;
  isNew?: boolean | null;
  shortDescription?: string | null;
};

const PAGE_SIZE = 10;

const ProductPage = () => {
  const [sp, setSp] = useSearchParams();

  // ===== URL state =====
  const urlCategoryId = sp.get("categoryId") ?? "";
  const urlPage = Number(sp.get("page") || 1);
  const urlSearch = sp.get("search") ?? "";

  // ===== UI state =====
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(urlSearch);
  const [categoryId, setCategoryId] = useState<string>(urlCategoryId);
  const [page, setPage] = useState(Math.max(1, urlPage));
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  // Sync khi URL đổi (back/forward hoặc click menu)
  useEffect(() => {
    setCategoryId(urlCategoryId);
    setPage(Math.max(1, urlPage));
    setSearch(urlSearch);
  }, [urlCategoryId, urlPage, urlSearch]);

  const fetchCategoriesList = useCallback(async () => {
    try {
      const res = await getCategories({ page: 1, limit: 1000 });
      setCategories(res.data ?? res.items ?? res ?? []);
    } catch {
      toast.error("Không thể tải danh mục");
    }
  }, []);

  const normalize = (items: ProductApi[]): ProductCardItem[] =>
    (items ?? []).map((p) => {
      const slug = p.url ?? p.slug;
      return {
        id: p.id,
        url: slug || "",
        name: p.name,
        category: p.category?.name || `Danh mục #${p.categoryId ?? "-"}`,
        price: p.price,
        inStock: p.inStock ?? true,
        rating: Math.max(0, Math.min(5, p.rating ?? 0)),
        image: p.image ?? undefined,
        isNew: Boolean(p.isNew),
      };
    });

  const fetchProductsList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        search: debouncedSearch,
        page,
        limit: PAGE_SIZE,
        categoryId,
      });

      const list: ProductApi[] = Array.isArray(res.data)
        ? res.data
        : res.data?.items ?? res.data ?? [];
      setProducts(normalize(list));
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error(e);
      toast.error("Không thể lấy danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, categoryId]);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // ===== handlers =====
  const handleCategoryChange = (val: string) => {
    const nextCategory = val === "all" ? "" : val;
    setCategoryId(nextCategory);
    setPage(1);
    setSp((prev) => {
      const n = new URLSearchParams(prev);
      if (nextCategory) n.set("categoryId", nextCategory);
      else n.delete("categoryId");
      n.set("page", "1");
      if (search) n.set("search", search);
      else n.delete("search");
      return n;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    setSp((prev) => {
      const n = new URLSearchParams(prev);
      if (val) n.set("search", val);
      else n.delete("search");
      n.set("page", "1");
      if (categoryId) n.set("categoryId", categoryId);
      else n.delete("categoryId");
      return n;
    });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    setSp((prev) => {
      const n = new URLSearchParams(prev);
      n.set("page", String(p));
      if (categoryId) n.set("categoryId", categoryId);
      else n.delete("categoryId");
      if (search) n.set("search", search);
      else n.delete("search");
      return n;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 py-10">
      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-64"
        />

        <Select
          value={categoryId || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((c) => (
              <SelectItem key={String(c.id)} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="h-64 border rounded p-3 animate-pulse">
              <div className="h-36 bg-muted rounded mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <ProductCard
          title="Tất cả sản phẩm"
          hideTitle={true}
          showMoreButton={false}
          products={products}
          showPagination={true}
          serverPagination={true}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductPage;
