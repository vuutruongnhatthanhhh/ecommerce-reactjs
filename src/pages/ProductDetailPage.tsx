import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByUrl } from "@/services/productService";
import { CheckCircle } from "lucide-react";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  url: string;
  image: string | null;
  shortDescription: string;
  content: string;
  price: number;
  categoryId: number;
};

function formatPrice(n?: number) {
  return typeof n === "number"
    ? new Intl.NumberFormat("vi-VN").format(n) + " đ"
    : "";
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!slug) return;
        const data = await getProductByUrl(slug);
        if (mounted) setProduct(data);
      } catch (e: any) {
        if (mounted) setErr("Không tải được sản phẩm. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const pushItemToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        url: product.url,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      })
    );
  };

  const handleAddToCart = () => {
    pushItemToCart();
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    pushItemToCart();
    navigate("/thanh-toan");
  };

  if (loading) return <div className="p-6">Đang tải…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!product) return <div className="p-6">Không tìm thấy sản phẩm</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="flex justify-center">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
            className="w-full max-w-xs rounded-lg object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

          <p className="text-lg text-blue-600 font-semibold">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-2">
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" /> Còn hàng
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="pt-4 flex flex-col md:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-700"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-green-700"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 mt-10 prose prose-blue mb-12">
        {/* content BE là HTML → render */}
        <div dangerouslySetInnerHTML={{ __html: product.content }} />
      </div>
    </>
  );
}
