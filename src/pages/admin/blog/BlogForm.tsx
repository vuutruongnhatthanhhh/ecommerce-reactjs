import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createBlog, getBlogById, updateBlog } from "@/services/blogService";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import { ImagePlus } from "lucide-react";
import ImageBox from "@/components/ImageBox";
import { slugify } from "@/utils/slugify";
import { createPortal } from "react-dom";

const BlogForm = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(blogId);

  const [loading, setLoading] = useState(editing);
  const [form, setForm] = useState({
    name: "",
    url: "",
    image: "",
    shortDescription: "",
    content: "",
  });

  const [isImageBoxOpen, setIsImageBoxOpen] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);

  useEffect(() => {
    if (!urlTouched) {
      setForm((prev) => ({ ...prev, url: slugify(prev.name) }));
    }
  }, [form.name, urlTouched]);

  useEffect(() => {
    if (!editing || !blogId) return;
    (async () => {
      try {
        setLoading(true);
        const b = await getBlogById(blogId);
        setForm({
          name: b.name ?? "",
          url: b.url ?? "",
          image: b.image ?? "",
          shortDescription: b.shortDescription ?? "",
          content: b.content ?? "",
        });
        setUrlTouched(true);
      } catch (e) {
        toast.error("Không thể tải blog");
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, blogId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.image) return toast.error("Cần phải chọn hình cho blog");
      if (!form.content) return toast.error("Cần phải nhập nội dung cho blog");

      const payload = { ...form };

      if (editing && blogId) {
        await updateBlog(blogId, payload);
        toast.success("Đã cập nhật blog");
      } else {
        await createBlog(payload);
        toast.success("Đã thêm blog mới");
      }

      navigate("/admin/blogs");
    } catch (err: any) {
      toast.error(
        (editing ? "Lỗi khi cập nhật: " : "Lỗi khi thêm: ") +
          (err?.response?.data?.message || "")
      );
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Đang tải dữ liệu blog…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Sửa blog" : "Thêm blog"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Tiêu đề blog</Label>
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
              URL sẽ tự tạo theo tiêu đề.
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
              Đổi lại theo tiêu đề
            </button>
          )}
        </div>

        {/* HÌNH ẢNH */}
        <div>
          <Label>Hình ảnh</Label>
          <div className="mt-2">
            {form.image ? (
              <div className="relative inline-block">
                <img
                  src={form.image}
                  alt="preview"
                  className="h-28 w-28 rounded border object-contain bg-white"
                />
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
              <div className="h-28 w-28 rounded border flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                Chưa có ảnh
              </div>
            )}
          </div>

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
          <Label>Nội dung</Label>
          <Editor
            initialContent={form.content}
            onContentChange={(val) => setForm({ ...form, content: val })}
            folder="blogs"
          />
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
          {editing ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </form>

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
            folder="blogs"
          />,
          document.body
        )}
    </div>
  );
};

export default BlogForm;
