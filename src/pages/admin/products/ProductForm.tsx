import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import ImageBox from "@/components/ImageBox";
import { slugify } from "@/utils/slugify";
import { createPortal } from "react-dom";

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [form, setForm] = useState({
    name: "",
    price: "",
    url: "",
    image: "",
    shortDescription: "",
    content: "",
    categoryId: "",
  });

  const [isImageBoxOpen, setIsImageBoxOpen] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);

  useEffect(() => {
    if (!urlTouched) {
      setForm((prev) => ({ ...prev, url: slugify(prev.name) }));
    }
  }, [form.name, urlTouched]);

  useEffect(() => {
    if (!editing || !productId) return;
    (async () => {
      try {
        setLoading(true);
        const p = await getProductById(productId);
        setForm({
          name: p.name ?? "",
          price: (p.price ?? "").toString(),
          url: p.url ?? "",
          image: p.image ?? "",
          shortDescription: p.shortDescription ?? "",
          content: p.content ?? "",
          categoryId: p.categoryId ? String(p.categoryId) : "",
        });
        setUrlTouched(true); // giữ nguyên url, không auto override khi name thay đổi
      } catch (e) {
        toast.error("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.categoryId) return toast.error("Cần phải chọn danh mục");
      if (!form.image) return toast.error("Cần phải chọn hình cho sản phẩm");
      if (!form.content)
        return toast.error("Cần phải nhập nội dung cho sản phẩm");

      const payload = {
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
      };

      if (editing && productId) {
        await updateProduct(productId, payload);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await createProduct(payload);
        toast.success("Đã thêm sản phẩm mới");
      }

      navigate("/admin/products");
    } catch (err: any) {
      toast.error(
        (editing ? "Lỗi khi cập nhật: " : "Lỗi khi thêm: ") +
          (err?.response?.data?.message || "")
      );
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories({ page: 1, limit: 100 });
      setCategories(res.data);
    } catch (err) {
      toast.error("Không thể tải danh mục");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Đang tải dữ liệu sản phẩm…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Tên sản phẩm</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>URL</Label>
          <Input
            name="url"
            value={form.url}
            onChange={(e) => {
              setUrlTouched(true);
              setForm((prev) => ({ ...prev, url: slugify(e.target.value) }));
            }}
            placeholder="duong-dan-khong-dau"
            required
          />
          {!urlTouched && (
            <p className="text-xs text-muted-foreground mt-1">
              URL sẽ tự tạo theo tên sản phẩm.
            </p>
          )}
          {urlTouched && (
            <button
              type="button"
              className="text-xs underline mt-1"
              onClick={() => {
                setUrlTouched(false);
                setForm((prev) => ({ ...prev, url: slugify(prev.name) }));
              }}
            >
              Đổi lại theo tên
            </button>
          )}
        </div>

        {/* HÌNH ẢNH – chỉ preview + nút chọn */}
        <div>
          <Label>Hình ảnh</Label>

          {/* Khung preview */}
          <div className="mt-2">
            {form.image ? (
              <div className="relative inline-block">
                <img
                  src={form.image}
                  alt="preview"
                  className="h-28 w-28 rounded border object-contain bg-white"
                />
                {/* Xoá ảnh */}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600 shadow"
                  title="Xoá ảnh"
                >
                  ✕
                </button>
              </div>
            ) : (
              // Placeholder khi chưa có ảnh
              <div className="h-28 w-28 rounded border flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                Chưa có ảnh
              </div>
            )}
          </div>

          {/* Nút chọn/đổi ảnh */}
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setIsImageBoxOpen(true)}
              title={form.image ? "Đổi ảnh" : "Chọn ảnh"}
            >
              <ImagePlus size={18} />
              {form.image ? "Đổi ảnh" : "Chọn ảnh"}
            </Button>
          </div>
        </div>

        <div>
          <Label>Mô tả ngắn</Label>
          <Input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Giá</Label>
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            min={0}
            required
          />
        </div>

        <div>
          <Label>Danh mục</Label>
          <Select
            value={form.categoryId}
            onValueChange={(val) => setForm({ ...form, categoryId: val })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nội dung</Label>
          <Editor
            initialContent={form.content}
            onContentChange={(val) => setForm({ ...form, content: val })}
            folder="products" // thư mục lưu ảnh
          />
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
          {editing ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </form>

      {/* ImageBox popup */}
      {isImageBoxOpen &&
        createPortal(
          <ImageBox
            open={isImageBoxOpen}
            onClose={() => setIsImageBoxOpen(false)}
            handleImageSelect={(imageUrl: string) => {
              setForm((prev) => ({ ...prev, image: imageUrl }));
              setIsImageBoxOpen(false);
              toast.success("Đã chọn ảnh từ thư viện");
            }}
            folder="products"
          />,
          document.body
        )}
    </div>
  );
};

export default ProductForm;
