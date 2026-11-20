import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessClient } from "@/components/checkout/OrderSuccessClient";

export const metadata: Metadata = {
  title: "Trạng thái đơn hàng",
  description: "Thông tin xác nhận và thanh toán đơn hàng tại 11 Sport.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
      <Suspense
        fallback={
          <div className="max-w-xl mx-auto h-72 rounded-2xl bg-surface-muted animate-pulse" />
        }
      >
        <OrderSuccessClient />
      </Suspense>
    </div>
  );
}
