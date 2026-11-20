import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { AccountClient } from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "Tài khoản khách hàng",
  description: "Đăng nhập Email OTP, quản lý đơn hàng và sổ địa chỉ 11 Sport.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
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
        <span className="font-semibold text-ink-primary">Tài khoản</span>
      </nav>

      <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary">
        Tài khoản khách hàng
      </h1>

      <AccountClient />
    </div>
  );
}
