import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Xem lại sản phẩm và tiến hành thanh toán tại 11 Sport.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary">Giỏ hàng</span>
      </nav>

      <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary">
        Giỏ hàng của bạn
      </h1>

      <CartPageClient />
    </div>
  );
}
