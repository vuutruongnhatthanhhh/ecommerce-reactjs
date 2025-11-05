import * as Sentry from "@sentry/react";

type CheckoutSuccessLog = {
  userId: number | string;
  orderId?: number | string;
  total: number;
  paymentMethod: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
};

export function logCheckoutSuccess(data: CheckoutSuccessLog) {
  // gửi log business cấp độ info
  Sentry.logger.info("Checkout success", {
    userId: data.userId,
    orderId: data.orderId ?? null,
    total: data.total,
    paymentMethod: data.paymentMethod,
    items: data.items.map((i) => ({
      productId: i.productId,
      name: i.productName,
      quantity: i.quantity,
      price: i.price,
    })),
  });
}

export function logCheckoutError(info: {
  userId?: number | string;
  reason: string;
  total: number;
  itemsCount: number;
}) {
  // gửi log cấp độ error
  Sentry.logger.error("Checkout failed", {
    userId: info.userId ?? null,
    reason: info.reason,
    total: info.total,
    itemsCount: info.itemsCount,
  });
}
