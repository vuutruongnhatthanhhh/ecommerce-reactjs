import { NavLink } from "react-router-dom";
import {
  Users,
  Package,
  Menu,
  ReceiptText,
  ChartColumnDecreasing,
  Newspaper,
  ArchiveRestore,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [showMobile, setShowMobile] = useState(false);

  const menuItems = [
    { to: "/admin", label: "Thống kê", icon: ChartColumnDecreasing },
    { to: "/admin/orders", label: "Đơn hàng", icon: ReceiptText },
    { to: "/admin/users", label: "Người dùng", icon: Users },
    { to: "/admin/categories", label: "Danh mục", icon: ArchiveRestore },
    { to: "/admin/products", label: "Sản phẩm", icon: Package },
    { to: "/admin/blogs", label: "Tin tức", icon: Newspaper },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden p-2 z-50 relative">
        <Button variant="outline" size="sm" onClick={() => setShowMobile(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {showMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setShowMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 bg-white border-r w-64 h-full p-4
          transform transition-transform duration-200 ease-in-out
          ${showMobile ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block md:min-h-screen
        `}
      >
        <h2 className="text-xl font-bold mb-6">TJZenn Admin</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setShowMobile(false)}
              end // <-- thêm thuộc tính này để chỉ active đúng path tuyệt đối
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export { Sidebar };
