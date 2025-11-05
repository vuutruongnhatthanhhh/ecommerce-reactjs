import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/common/Sidebar";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      toast.error("Vui lòng đăng nhập");
      navigate("/dang-nhap");
      return;
    }

    try {
      const decoded: any = jwtDecode(token); // decode token

      if (decoded?.role !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập trang quản trị!");
        navigate("/");
        return;
      }
    } catch (err) {
      toast.error("Token không hợp lệ");
      navigate("/dang-nhap");
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-auto">
        <Sidebar />
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
