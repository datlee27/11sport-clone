import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng",
  description: "Hoàn tất thông tin giao hàng và thanh toán tại 11Sport.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-6 lg:py-8">
      <h1 className="sr-only">Thanh toán đơn hàng 11Sport</h1>
      <CheckoutClient />
    </div>
  );
}
