import { render } from "@testing-library/react";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import CheckoutPage from "@/pages/CheckoutPage";
import "@testing-library/jest-dom";

describe("CheckoutPage", () => {
  beforeEach(() => {
    // Mock alert
    window.alert = jest.fn();
  });

  it("hiện lỗi khi nhập thiếu thông tin", async () => {
    render(<CheckoutPage />);
    fireEvent.click(screen.getByRole("button", { name: "Đặt hàng" }));

    await waitFor(() => {
      expect(screen.getByText("Vui lòng nhập họ tên")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng nhập email")).toBeInTheDocument();
      expect(
        screen.getByText("Vui lòng nhập số điện thoại")
      ).toBeInTheDocument();
      expect(screen.getByText("Vui lòng nhập địa chỉ")).toBeInTheDocument();
    });
  });

  it("submit thành công khi nhập đúng", async () => {
    render(<CheckoutPage />);

    fireEvent.change(screen.getByLabelText("Họ tên"), {
      target: { value: "Nhật Thanh" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "bin@tjzenn.vn" },
    });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), {
      target: { value: "0912345678" },
    });
    fireEvent.change(screen.getByLabelText("Địa chỉ"), {
      target: { value: "451/15 phường Tam Hiệp" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Đặt hàng" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Cảm ơn bạn đã đặt hàng!");
    });
  });
});
