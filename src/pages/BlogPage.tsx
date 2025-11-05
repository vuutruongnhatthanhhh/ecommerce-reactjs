import React, { useEffect, useMemo, useState } from "react";
import BlogCard, { type BlogCardItem } from "@/components/BlogCard";
import { getBlogs } from "@/services/blogService";

function formatDateVN(input?: string) {
  if (!input) return "";
  const d = new Date(input);
  // fallback nếu input đã là "dd-MM-yyyy" thì cứ trả về
  if (isNaN(d.getTime())) return input;
  return d.toLocaleDateString("vi-VN"); // dd/MM/yyyy
}

function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const [items, setItems] = useState<BlogCardItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (p = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Giả định API trả { data, total, page, totalPages }
      const res = await getBlogs({ page: p, limit, search: "" });

      const blogs = (res.data ?? res.items ?? []).map(
        (b: any): BlogCardItem => ({
          id: b.id,
          url: b.url,
          title: b.name,
          description: b.shortDescription ?? "",
          category: b.category?.name ?? "",
          date: formatDateVN(b.createdAt),
          image: b.image ?? null,
        })
      );

      setItems(blogs);
      setTotalPages(res.totalPages ?? res.total_page ?? 1);
      setPage(res.page ?? res.currentPage ?? p);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Không tải được blog"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi đổi trang
  const handlePageChange = (p: number) => {
    setPage(p);
    fetchData(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {error ? (
        <div className="mx-auto max-w-6xl px-4 py-6 text-red-600">{error}</div>
      ) : (
        <BlogCard
          title="Tin tức"
          showMoreButton={false}
          blogs={loading ? [] : items}
          showPagination={true}
          serverPagination={true}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default BlogPage;
