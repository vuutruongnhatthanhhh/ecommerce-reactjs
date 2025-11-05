import { useState, KeyboardEvent } from "react";
import { Search, ShoppingCart, User, Headphones, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import { selectCartCount } from "@/store/cartSlice";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const count = useAppSelector(selectCartCount);

  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất!");
    navigate("/dang-nhap");
  };

  const goSearch = () => {
    const q = search.trim();
    if (!q) {
      navigate("/san-pham?page=1");
      return;
    }
    navigate(`/san-pham?search=${encodeURIComponent(q)}&page=1`);
    // optional: giữ lại text người dùng vừa gõ
    setSearch("");
  };

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  };

  return (
    <header className="bg-[#E6EFFD] text-black px-4 py-2">
      <div className="max-w-screen-xl mx-auto w-full items-center justify-between gap-4 hidden sm:flex">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-4 flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="h-12" />
          <span className="text-xl font-bold tracking-wide">TJZenn</span>
        </div>

        {/* Search (Desktop) */}
        <div className="flex-grow max-w-xl w-full flex items-center justify-center">
          <Input
            type="text"
            placeholder="Bạn cần tìm gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onEnter}
            className="rounded-none rounded-l-md bg-white text-black w-full"
          />
          <Button
            type="button"
            onClick={goSearch}
            className="rounded-none rounded-r-md bg-white text-black border border-l-0 hover:bg-blue-600 hover:text-white"
          >
            <Search className="w-5 h-5 " />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 text-sm whitespace-nowrap flex-shrink-0">
          <div
            className="flex items-center gap-1 relative cursor-pointer"
            onClick={() => navigate("/gio-hang")}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Giỏ hàng</span>
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </div>
          {isAuthenticated ? (
            <>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5" />
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Đăng xuất</span>
              </div>
            </>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => navigate("/dang-nhap")}
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Đăng nhập</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between sm:hidden">
        {/* Left: Logo */}
        <div className="flex items-center gap-2" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-lg font-semibold">TJZenn</span>
        </div>

        {/* Right: All icons */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-black bg-[#E6EFFD] hover:bg-[#E6EFFD] shadow-none focus:outline-none focus:ring-0"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Headphones className="w-5 h-5" />
          <div className="relative" onClick={() => navigate("/gio-hang")}>
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </div>
          <User className="w-5 h-5" onClick={() => navigate("/profile")} />
        </div>
      </div>

      {/* Mobile Search Bar (Dropdown) */}
      {isSearchOpen && (
        <div className="sm:hidden mt-2 flex px-4">
          <Input
            type="text"
            placeholder="Bạn cần tìm gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onEnter}
            className="bg-white text-black w-full rounded-l-md"
          />
          <Button
            type="button"
            onClick={goSearch}
            className="bg-white text-black hover:bg-blue-600 hover:text-white"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
