import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { getBlogs, deleteBlog } from "@/services/blogService";
import { toast } from "sonner";
import notFoundImage from "@/assets/not-found-image.png";

type Blog = {
  id: string;
  name: string;
  image?: string;
  shortDescription?: string;
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchInput, setSearchInput] = useState(""); // nhập realtime
  const [search, setSearch] = useState(""); // query thật
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PLACEHOLDER_IMG = notFoundImage as string;
  const getThumb = (src?: string) =>
    src && src.trim() ? src : PLACEHOLDER_IMG;

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs({ search, page, limit: 5 });
      setBlogs(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error("Không thể lấy danh sách blog");
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
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xoá blog này?")) return;
    const prev = blogs;
    setBlogs((list) => list.filter((b) => b.id !== id)); // optimistic UI
    try {
      await deleteBlog(id);
      toast.success("Đã xoá blog");
      await fetchBlogs(); // đồng bộ lại phân trang
    } catch (e) {
      setBlogs(prev); // rollback
      toast.error("Xoá thất bại, thử lại sau nha anh");
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <h1 className="text-xl font-bold">Quản lý blog</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/admin/blogs/new")}
        >
          + Thêm blog
        </Button>
      </div>

      {/* Tìm kiếm */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm blog..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Danh sách blog */}
      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center justify-between gap-4 p-4 border rounded"
          >
            {/* Thumbnail */}
            <div className="shrink-0">
              <div className="h-16 w-16 rounded border overflow-hidden bg-white">
                <img
                  src={getThumb(blog.image)}
                  alt={blog.name}
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
                {blog.name}
              </h2>
              {blog.shortDescription && (
                <p className="text-sm text-muted-foreground break-all line-clamp-2">
                  {blog.shortDescription}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                title="Sửa"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(blog.id)}
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

export default BlogList;
