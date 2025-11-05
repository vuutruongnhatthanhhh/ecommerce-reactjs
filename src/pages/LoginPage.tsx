import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginUser } from "@/services/authService";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/store/authSlice";

const LoginPage = () => {
  useAuthRedirect();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(form);

      // 1) Lưu token vào cookie
      Cookies.set("access_token", res.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      // 2) Lưu user info + token vào Redux (được persist qua reload)
      dispatch(
        setAuth({
          user: {
            id: res.user.id,
            name: res.user.name,
            username: res.user.username,
            role: res.user.role,
            email: res.user.email,
            phone: res.user.phone,
            address: res.user.address,
          },
        })
      );

      toast.success("Đăng nhập thành công!");
      setError("");
      navigate("/");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-4">
          Chưa có tài khoản?{" "}
          <a href="/dang-ky" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
