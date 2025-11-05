import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminLayout from "@/pages/admin/AdminLayout";
import UserList from "@/pages/admin/users/UserList";
import UserForm from "@/pages/admin/users/UserForm";
import ProductList from "@/pages/admin/products/ProductList";
import ProductForm from "@/pages/admin/products/ProductForm";
import CategoryList from "@/pages/admin/categories/CategoryList";
import CategoryForm from "@/pages/admin/categories/CategoryForm";
import OrderList from "@/pages/admin/orders/OrderList";
import OrderForm from "@/pages/admin/orders/OrderForm";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardPage from "@/pages/DashboardPage";
import BlogList from "@/pages/admin/blog/BlogList";
import BlogForm from "@/pages/admin/blog/BlogForm";

export default function App() {
  return (
    <Router>
      <Header />
      <Menu />
      <main className="min-h-screen max-w-screen-xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ProductPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />

          <Route path="/san-pham" element={<ProductPage />} />
          {/* <Route path="/chi-tiet-san-pham" element={<ProductDetailPage />} /> */}
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/tin-tuc" element={<BlogPage />} />
          <Route path="/tin-tuc/:url" element={<BlogDetailPage />} />

          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Người dùng */}
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:userId" element={<UserForm />} />

            {/* Danh mục */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:categoryId" element={<CategoryForm />} />

            {/* Sản phẩm */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:productId" element={<ProductForm />} />

            {/* Tin tức */}
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/:blogId" element={<BlogForm />} />

            {/* Đơn hàng */}
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/orders/:orderId" element={<OrderForm />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
