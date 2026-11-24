"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

/**
 * 11Sport Error Boundary — bắt mọi unhandled error runtime ở App Router.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cho monitoring/debugging
    console.error("[Storefront Runtime Error]:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
      <span className="inline-block px-3.5 py-1 bg-[#fff5f5] border border-[#fed7d7] font-mono text-xs font-bold uppercase tracking-widest text-[#c53030]">
        HỆ THỐNG GIÁN ĐOẠN · 11SPORT
      </span>
      <h1 className="text-[22px] sm:text-[28px] font-bold text-[#0a0a0a] uppercase tracking-wide">
        Đã xảy ra sự cố khi tải dữ liệu
      </h1>
      <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
        Hệ thống không thể tải dữ liệu từ máy chủ hoặc kết nối mạng bị gián đoạn.
        Bạn vui lòng bấm thử lại hoặc quay về trang chủ.
      </p>
      <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>THỬ LẠI</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none border border-[#224e40] bg-white hover:bg-[#f8f9f5] text-[#224e40] text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>VỀ TRANG CHỦ</span>
        </Link>
      </div>
    </div>
  );
}
