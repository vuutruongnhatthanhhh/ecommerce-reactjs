import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { getBlogByUrl, type BlogPayload } from "@/services/blogService";

const BlogDetailPage: React.FC = () => {
  const { url } = useParams<{ url: string }>(); // route: /tin-tuc/:url
  const [blog, setBlog] = useState<BlogPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!url) {
          setError("Thiếu tham số bài viết");
          return;
        }
        const data = await getBlogByUrl(url);
        if (mounted) setBlog(data);
      } catch (e: any) {
        if (mounted)
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Không tải được bài viết"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">
        {error || "Bài viết không tồn tại"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.name}</h1>

      <div className="flex items-center text-sm text-muted-foreground mb-6 gap-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>
            {blog.createdAt
              ? format(new Date(blog.createdAt), "dd/MM/yyyy")
              : ""}
          </span>
        </div>
        {/* {blog.category?.name && <Badge>{blog.category.name}</Badge>} */}
      </div>

      <img
        src={blog.image || "/no-image.png"}
        alt={blog.name}
        className="rounded-xl w-full object-contain mb-8"
        loading="lazy"
      />

      <div
        className="prose prose-blue dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content || "" }}
      />
    </div>
  );
};

export default BlogDetailPage;
