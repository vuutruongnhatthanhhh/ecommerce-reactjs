import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCartItems, selectCartTotal, clearCart } from "@/store/cartSlice";
import { createOrder, type CreateOrderPayload } from "@/services/orderService";
import { toast } from "sonner";

import { logCheckoutSuccess, logCheckoutError } from "@/utils/sentryLogger";

const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector((s) => s.auth.user);

  // Nếu chưa đăng nhập thì chuyển qua trang login
  useEffect(() => {
    if (!user) {
      navigate("/dang-nhap", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [user, navigate, location.pathname]);

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      note: "",
      paymentMethod: "cash",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập họ tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      phone: Yup.string()
        .matches(/^\d{9,11}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
      note: Yup.string().max(500, "Ghi chú tối đa 500 ký tự").notRequired(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user) {
          navigate("/dang-nhap");
          return;
        }

        // Dữ liệu gửi backend tạo đơn
        const payload: CreateOrderPayload = {
          customerName: values.name,
          customerPhone: values.phone,
          customerEmail: values.email,
          address: values.address,
          note: values.note?.trim() || undefined,
          userId: Number(user.id),
          items: cart.map((i) => ({
            productId: Number(i.id),
            productName: i.name,
            productImage: i.image || "",
            price: Number(i.price),
            quantity: i.quantity,
          })),
        };

        // Gọi API tạo đơn hàng
        const result = await createOrder(payload);

        // Backend của anh trả { id: <orderId>, ... }
        const orderId = result?.id ?? undefined;

        // Gửi log business "checkout thành công" lên Sentry (structured logs)
        logCheckoutSuccess({
          userId: user.id,
          orderId,
          total,
          paymentMethod: values.paymentMethod,
          items: cart.map((i) => ({
            productId: Number(i.id),
            productName: i.name,
            price: Number(i.price),
            quantity: i.quantity,
          })),
        });

        // UI sau khi đặt hàng xong
        toast.success("Đặt hàng thành công!");
        dispatch(clearCart());
        resetForm();
        navigate("/profile");
      } catch (err: any) {
        // Log lỗi checkout lên Sentry
        logCheckoutError({
          userId: user?.id,
          reason:
            err?.response?.data?.message ||
            err?.message ||
            "Unknown checkout error",
          total,
          itemsCount: cart.length,
        });

        toast.error(
          err?.response?.data?.message || "Đặt hàng thất bại. Hãy thử lại!"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Config fields cho form
  type Field = {
    name: "name" | "email" | "phone" | "address";
    label: string;
    type?: string;
  };

  const fields: Field[] = [
    { name: "name", label: "Họ tên" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Số điện thoại" },
    { name: "address", label: "Địa chỉ" },
  ];

  // Nếu giỏ hàng trống thì show state rỗng
  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Giỏ hàng trống</h1>
        <p className="text-muted-foreground">
          Không có sản phẩm nào trong giỏ hàng.
        </p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/san-pham")}
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* Form thông tin thanh toán / giao hàng */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>

        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              name={name}
              type={type || "text"}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
            )}
          </div>
        ))}

        {/* Ghi chú giao hàng */}
        <div>
          <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
          <textarea
            id="note"
            name="note"
            rows={4}
            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.note && formik.errors.note && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.note}</p>
          )}
        </div>

        {/* Hình thức thanh toán */}
        <div className="space-y-2">
          <Label>Hình thức thanh toán</Label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formik.values.paymentMethod === "cash"}
                onChange={formik.handleChange}
              />
              <span>Tiền mặt</span>
            </label>

            <label
              className="flex items-center gap-2 text-muted-foreground cursor-not-allowed"
              title="Chưa hỗ trợ"
            >
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                disabled
              />
              <span>Chuyển khoản (chưa hỗ trợ)</span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4"
        >
          {formik.isSubmitting ? "Đang đặt hàng..." : "Đặt hàng"}
        </Button>
      </form>

      {/* Tóm tắt đơn hàng */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={String(item.id)}
              className="flex items-center gap-4 border-b pb-4"
            >
              <Link to={`/san-pham/${item.url}`} className="shrink-0">
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded"
                  loading="lazy"
                />
              </Link>
              <div className="flex-1">
                <Link
                  to={`/san-pham/${item.url}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-semibold text-blue-600">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t mt-6 pt-4 text-right">
          <p className="text-lg">
            Tổng cộng:{" "}
            <span className="font-bold text-blue-600">
              {formatPrice(total)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
