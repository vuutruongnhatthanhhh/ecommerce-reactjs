import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { getCategories, deleteCategory } from "@/services/categoryService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await getCategories({ search, page, limit: 5 });
      setCategories(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error("Không thể lấy danh sách danh mục");
      console.error(err);
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
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Xác nhận xoá danh mục?");
    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      toast.success("Xoá danh mục thành công");
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi xoá danh mục");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <h1 className="text-xl font-bold">Quản lý danh mục</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/admin/categories/new")}
        >
          + Thêm danh mục
        </Button>
      </div>

      {/* Tìm kiếm */}
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Danh sách */}
      <div className="space-y-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-medium break-all">{c.name}</h2>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/categories/${c.id}`)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(c.id)}
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

export default CategoryList;
