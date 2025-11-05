import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addToCart } from "@/store/cartSlice";
import { useAppDispatch } from "@/store";

/** ================== Types ================== */
export interface ProductCardItem {
  id?: number | string;
  /** slug để điều hướng chi tiết */
  url: string;
  name: string;
  category: string; // nếu API chỉ có categoryId, tạm truyền text từ ngoài
  price: number | string;
  inStock: boolean;
  rating: number;
  image?: string | null;
  isNew: boolean;
}

interface ProductSectionProps {
  title?: string;
  hideTitle?: boolean;
  showMoreButton?: boolean;

  products: ProductCardItem[];

  showPagination?: boolean;
  itemsPerPage?: number;

  serverPagination?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

/** ================== Utils ================== */
function formatVND(val: number) {
  try {
    return val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } catch {
    return `${val} ₫`;
  }
}

/** ================== Component ================== */
function ProductCard({
  title,
  hideTitle = false,
  showMoreButton = true,
  products,
  showPagination = false,
  itemsPerPage = 10,
  serverPagination = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: ProductSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const localTotalPages = useMemo(
    () => Math.ceil(products.length / itemsPerPage),
    [products.length, itemsPerPage]
  );

  const paginatedProducts =
    showPagination && !serverPagination
      ? products.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : products;

  const shouldRenderHeader = !hideTitle || showMoreButton;

  return (
    <section className="my-10">
      {shouldRenderHeader && (
        <div className="flex items-center mb-6 gap-3">
          {!hideTitle && <h2 className="text-2xl font-semibold">{title}</h2>}
          {showMoreButton && (
            <Button
              className="ml-auto border px-4 py-2 rounded bg-[#E6EFFD] text-blue-600 hover:bg-[#E6EFFD]"
              onClick={() => {
                navigate("/san-pham");
                window.scrollTo({ top: 0 });
              }}
            >
              Xem thêm <span className="ml-1">→</span>
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {paginatedProducts.map((product, index) => {
          const key = String(product.id ?? product.url ?? index);
          const priceText =
            typeof product.price === "number"
              ? formatVND(product.price)
              : product.price;

          return (
            <Link
              key={key}
              to={`/san-pham/${product.url}`}
              onClick={() => window.scrollTo({ top: 0 })}
              className="relative border rounded-lg shadow text-black bg-white mb-4"
            >
              <div className="p-4 flex flex-col">
                <img
                  src={product.image || "/no-image.png"}
                  alt={product.name}
                  className="object-contain h-32 mb-4 w-full"
                  loading="lazy"
                />

                <h3 className="font-medium text-sm mb-1 hover:underline line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                  {product.category}
                </p>

                {/* Rating hiển thị 5 sao; nếu muốn dùng product.rating thì đổi điều kiện */}
                <div className="flex gap-0.5 mb-2" aria-label="rating-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      fill="#facc15"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 mb-2 text-sm">
                  {product.inStock && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" /> Còn
                      hàng
                    </>
                  )}
                </div>

                <p className="text-blue-600 font-semibold mb-2">{priceText}</p>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // ngăn Link redirect
                    e.stopPropagation();
                    dispatch(
                      addToCart({
                        id: product.id!,
                        url: product.url,
                        name: product.name,
                        price: Number(product.price),
                        image: product.image,
                        quantity: 1,
                      })
                    );
                    toast.success("Đã thêm vào giỏ hàng!");
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
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

export default ProductCard;
