"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { localizeHref } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N } from "@/lib/i18n/chrome";

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
  const locale = useLocale();
  const copy = CHROME_I18N[locale].errorPage;

  useEffect(() => {
    // Log error cho monitoring/debugging
    console.error("[Storefront Runtime Error]:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
      <span className="inline-block px-3.5 py-1 bg-[#fff5f5] border border-[#fed7d7] font-mono text-xs font-bold uppercase tracking-widest text-[#c53030]">
        {copy.badge}
      </span>
      <h1 className="text-[22px] sm:text-[28px] font-bold text-[#0a0a0a] uppercase tracking-wide">
        {copy.heading}
      </h1>
      <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
        {copy.description}
      </p>
      <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{copy.retryCta}</span>
        </button>
        <Link
          href={localizeHref("/", locale)}
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none border border-[#224e40] bg-white hover:bg-[#f8f9f5] text-[#224e40] text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>{copy.homeCta}</span>
        </Link>
      </div>
    </div>
  );
}
