import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { getProducts, deleteProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { toast } from "sonner";
import notFoundImage from "@/assets/not-found-image.png";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: { name: string };
};

const formatPrice = (val: number) =>
  val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState(""); // input realtime
  const [search, setSearch] = useState(""); // value query thật
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const PLACEHOLDER_IMG = notFoundImage;
  const getThumb = (src?: string) =>
    src && src.trim() ? src : PLACEHOLDER_IMG;

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ search, page, limit: 5, categoryId });
      setProducts(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error("Không thể lấy danh sách sản phẩm");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories({ page: 1, limit: 100 });
      setCategories(res.data);
    } catch (err) {
      toast.error("Không thể tải danh mục");
    }
  };

  // debounce searchInput -> search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xoá sản phẩm này?")) return;
    const prev = products;
    setProducts((list) => list.filter((p) => p.id !== id)); // optimistic UI
    try {
      await deleteProduct(id);
      toast.success("Đã xoá sản phẩm");
      await fetchProducts();
    } catch (e) {
      setProducts(prev); // rollback nếu lỗi
      toast.error("Xoá thất bại, thử lại sau nha anh");
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <h1 className="text-xl font-bold">Quản lý sản phẩm</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/admin/products/new")}
        >
          + Thêm sản phẩm
        </Button>
      </div>

      {/* Tìm kiếm và lọc */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm sản phẩm..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64"
        />
        <Select
          value={categoryId || "all"}
          onValueChange={(val) => setCategoryId(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((c: any) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-4 p-4 border rounded"
          >
            {/* Thumbnail */}
            <div className="shrink-0">
              <div className="h-16 w-16 rounded border overflow-hidden bg-white">
                <img
                  src={getThumb(product.image)}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (
                      target.src !==
                      window.location.origin + PLACEHOLDER_IMG
                    ) {
                      target.src = PLACEHOLDER_IMG;
                    }
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-medium break-all line-clamp-2">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground break-all">
                Giá: {formatPrice(product.price)}
                {product?.category?.name ? ` — ${product.category.name}` : ""}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/products/${product.id}`)}
                title="Sửa"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id)}
                title="Xoá"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

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

export default ProductList;
