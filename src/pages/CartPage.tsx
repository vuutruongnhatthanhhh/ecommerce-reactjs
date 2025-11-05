import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
} from "@/store/cartSlice";

const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);

  const onChangeQty = (id: string | number, val: number) => {
    if (Number.isNaN(val)) return;
    dispatch(updateQuantity({ id, quantity: Math.max(1, val) }));
  };

  const onRemove = (id: string | number) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-12">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <div className="text-muted-foreground">
          <p>Không có sản phẩm nào trong giỏ hàng.</p>
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/san-pham")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={String(item.id)}
                className="flex flex-col md:flex-row items-center gap-4 border-b pb-4"
              >
                <Link to={`/san-pham/${item.url}`} className="shrink-0">
                  <img
                    src={item.image || "/no-image.png"}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded"
                  />
                </Link>

                <div className="flex-1 w-full">
                  <Link
                    to={`/san-pham/${item.url}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>

                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={item.quantity}
                      onChange={(e) =>
                        onChangeQty(item.id, Number(e.target.value))
                      }
                      onBlur={(e) =>
                        onChangeQty(
                          item.id,
                          Math.max(1, Number(e.target.value))
                        )
                      }
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="font-semibold text-blue-600">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-6 text-right space-y-4">
            <p className="text-lg">
              Tổng cộng:{" "}
              <span className="font-bold text-blue-600">
                {formatPrice(totalPrice)}
              </span>
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/thanh-toan")}
            >
              Thanh toán ngay
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
