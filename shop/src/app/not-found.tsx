import Link from "next/link";
import { Home, Search } from "lucide-react";
import { localizeHref } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CHROME_I18N } from "@/lib/i18n/chrome";

/**
 * 11Sport 404 Page — standardized sharp Flatsome buttons & `#224e40` forest green tokens.
 */
export default function NotFound() {
  const locale = getServerLocale();
  const copy = CHROME_I18N[locale].notFoundPage;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
      <span className="inline-block px-3.5 py-1 bg-[#f8f9f5] border border-[#dce5da] font-mono text-xs font-bold uppercase tracking-widest text-[#204b3e]">
        {copy.badge}
      </span>
      <h1 className="text-[24px] sm:text-[30px] font-bold text-[#0a0a0a] uppercase tracking-wide">
        {copy.heading}
      </h1>
      <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
        {copy.description}
      </p>
      <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={localizeHref("/", locale)}
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>{copy.homeCta}</span>
        </Link>
        <Link
          href={localizeHref("/tim-kiem", locale)}
          className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-none border border-[#224e40] bg-white hover:bg-[#f8f9f5] text-[#224e40] text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>{copy.searchCta}</span>
        </Link>
      </div>
    </div>
  );
}
