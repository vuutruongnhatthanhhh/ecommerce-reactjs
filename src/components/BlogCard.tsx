import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";

/** ================== Types ================== */
export interface BlogCardItem {
  id?: number | string;
  /** slug để điều hướng chi tiết */
  url: string;
  title: string;
  description: string;
  category: string; // nếu API chỉ có categoryId, tạm truyền text từ ngoài
  date: string;
  image?: string | null;
}

interface BlogSectionProps {
  title?: string;
  hideTitle?: boolean;
  showMoreButton?: boolean;

  blogs: BlogCardItem[];

  // Filter chỉ hiển thị khi KHÔNG showMoreButton (giống bản cũ)
  enableFilterWhenNoMoreBtn?: boolean;

  showPagination?: boolean;
  itemsPerPage?: number;

  /** Server pagination giống ProductCard */
  serverPagination?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

/** ================== Component ================== */
function BlogCard({
  title,
  hideTitle = false,
  showMoreButton = true,
  blogs,
  enableFilterWhenNoMoreBtn = true,
  showPagination = false,
  itemsPerPage = 8,
  serverPagination = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: BlogSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate();

  const categories = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
    [blogs]
  );

  const filteredBlogs = useMemo(
    () => (filter ? blogs.filter((b) => b.category === filter) : blogs),
    [blogs, filter]
  );

  const localTotalPages = useMemo(
    () => Math.ceil(filteredBlogs.length / itemsPerPage),
    [filteredBlogs.length, itemsPerPage]
  );

  const paginatedBlogs =
    showPagination && !serverPagination
      ? filteredBlogs.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : filteredBlogs;

  const shouldRenderHeader = !hideTitle || showMoreButton;

  return (
    <section className="mt-16 mb-20">
      {shouldRenderHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          {!hideTitle && <h2 className="text-2xl font-semibold">{title}</h2>}

          {showMoreButton && (
            <Button
              className="ml-auto border px-4 py-2 rounded bg-[#E6EFFD] text-blue-600 hover:bg-[#E6EFFD]"
              onClick={() => {
                navigate("/tin-tuc");
                window.scrollTo({ top: 0 });
              }}
            >
              Xem thêm <span className="ml-1">→</span>
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedBlogs.map((blog, i) => {
          const key = String(blog.id ?? blog.url ?? i);
          return (
            <Link
              key={key}
              to={`/tin-tuc/${blog.url}`}
              onClick={() => window.scrollTo({ top: 0 })}
              className="block"
            >
              <Card className="overflow-hidden mb-4 h-full">
                <img
                  src={blog.image || "/no-image.png"}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <CardContent className="p-4">
                  <div className="text-xs text-gray-500 mb-1 line-clamp-1">
                    {blog.date}
                  </div>
                  <h3 className="font-semibold text-base mb-1 hover:underline line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                    {blog.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {showPagination &&
        (serverPagination
          ? (totalPages ?? 0) > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => onPageChange?.(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )
          : localTotalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: localTotalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            ))}
    </section>
  );
}

export default BlogCard;
