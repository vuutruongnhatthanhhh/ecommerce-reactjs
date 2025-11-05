import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "@/services/categoryService";
import { toast } from "sonner";

const CategoryForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(categoryId);

  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  // Lấy thông tin danh mục khi chỉnh sửa
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(categoryId!);
        setForm({ name: data.name });
      } catch (err) {
        toast.error("Không lấy được thông tin danh mục");
      }
    };

    if (editing) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateCategory(categoryId!, { name: form.name });
        toast.success("Đã cập nhật danh mục");
      } else {
        await createCategory({ name: form.name });
        toast.success("Đã thêm danh mục mới");
      }
      navigate("/admin/categories");
    } catch (err: any) {
      toast.error("Lỗi khi lưu danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Sửa danh mục" : "Thêm danh mục"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Tên danh mục</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {editing ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </form>
    </div>
  );
};

export default CategoryForm;
