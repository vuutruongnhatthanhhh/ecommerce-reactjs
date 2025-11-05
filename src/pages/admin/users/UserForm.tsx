import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createUser, updateUser, getUserById } from "@/services/userService";
import { toast } from "sonner";

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(userId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (editing && userId) {
        try {
          const user = await getUserById(userId);
          setForm({
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            password: "",
            role: user.role || "USER",
          });
        } catch (err) {
          toast.error("Không tìm thấy người dùng");
          navigate("/admin/users");
        }
      }
    };

    fetchUser();
  }, [editing, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing && userId) {
        await updateUser(userId, {
          name: form.name,
          role: form.role,
        });
        toast.success("Đã cập nhật người dùng!");
      } else {
        await createUser({
          name: form.name,
          username: form.username,
          password: form.password,
          role: form.role,
        });
        toast.success("Thêm người dùng thành công!");
      }

      navigate("/admin/users");
    } catch (err: any) {
      toast.error("Lỗi khi lưu người dùng: " + err?.response?.data?.message);
      console.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Sửa người dùng" : "Thêm người dùng"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Họ tên</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Tên đăng nhập</Label>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        {!editing && (
          <div>
            <Label>Mật khẩu</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <Label>Vai trò</Label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="USER">Người dùng</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
          {editing ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
