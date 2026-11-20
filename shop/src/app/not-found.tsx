import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-brand-primary">
        Lỗi 404
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink-primary">
        Không tìm thấy trang bạn yêu cầu
      </h1>
      <p className="mt-3 text-sm sm:text-base text-ink-secondary">
        Đường dẫn có thể đã thay đổi hoặc sản phẩm hiện không còn kinh doanh.
        Vui lòng quay về trang chủ hoặc tìm kiếm sản phẩm khác.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>Về trang chủ</span>
        </Link>
        <Link
          href="/tim-kiem"
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg border border-surface-border bg-white hover:border-brand-primary text-ink-primary text-sm font-semibold transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Tìm kiếm sản phẩm</span>
        </Link>
      </div>
    </div>
  );
}
