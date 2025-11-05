import React, { useEffect, useState } from "react";
import ProductCard, { type ProductCardItem } from "@/components/ProductCard";
import SubBanner from "@/components/SubBanner";
import BlogCard, { type BlogCardItem } from "@/components/BlogCard";
import MainBanner from "@/components/MainBanner";
import {
  getLatestProducts,
  type ProductPayload,
} from "@/services/productService";
import { getLatestBlogs, type BlogPayload } from "@/services/blogService";

function HomePage() {
  // ======== Products (latest 5) ========
  const [latestProducts, setLatestProducts] = useState<ProductCardItem[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState<string | null>(null);

  const toProductCardItem = (p: ProductPayload): ProductCardItem => ({
    id: p.id,
    url: p.url,
    name: p.name,
    category: p.category?.name ?? "",
    price: p.price,
    inStock: true,
    rating: 4,
    image: p.image ?? null,
    isNew: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getLatestProducts();
        setLatestProducts(data.map(toProductCardItem));
      } catch (e: any) {
        setProdError(
          e?.response?.data?.message || e?.message || "Lỗi tải sản phẩm mới"
        );
      } finally {
        setProdLoading(false);
      }
    })();
  }, []);

  // ======== Blogs (latest 4) ========
  const [latestBlogs, setLatestBlogs] = useState<BlogCardItem[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  const toBlogCardItem = (b: BlogPayload): BlogCardItem => ({
    id: b.id,
    url: b.url,
    title: b.name, // backend dùng "name"
    description: b.shortDescription ?? "",
    category: b.category?.name ?? "",
    date: new Date(b.createdAt).toLocaleDateString("vi-VN"),
    image: b.image ?? null,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getLatestBlogs(); // GET /blogs/latest
        setLatestBlogs(data.map(toBlogCardItem));
      } catch (e: any) {
        setBlogError(
          e?.response?.data?.message || e?.message || "Lỗi tải blog mới"
        );
      } finally {
        setBlogLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <MainBanner />

      {prodError ? (
        <div className="mx-auto max-w-6xl px-4 py-6 text-red-600">
          {prodError}
        </div>
      ) : (
        <ProductCard
          title="Sản phẩm mới"
          showMoreButton={true}
          products={prodLoading ? [] : latestProducts}
        />
      )}

      <SubBanner />

      {blogError ? (
        <div className="mx-auto max-w-6xl px-4 py-6 text-red-600">
          {blogError}
        </div>
      ) : (
        <BlogCard
          title="Tin tức"
          showMoreButton={true}
          blogs={blogLoading ? [] : latestBlogs}
        />
      )}
    </div>
  );
}

export default HomePage;
