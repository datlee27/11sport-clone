"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LocaleCode } from "@/lib/format";
import { useLocale } from "@/lib/i18n/client";
import { CATALOG_I18N } from "@/lib/i18n/catalog";

interface SeoDescriptionBoxProps {
  html?: string;
  title?: string;
  locale?: LocaleCode;
}

/**
 * Collapsible Borderless Term Description Box 1:1 with live mipik.vn (.term-description.is-collapsed + .product-section-toggle):
 * - Clean white background, zero outer card/border
 * - 340px collapsed max height with soft bottom gradient fade
 * - Centered solid #224E40 rectangular toggle button (`Xem thêm` / `Thu gọn` | `Show More` / `Show Less`)
 */
export function SeoDescriptionBox({
  html,
  title,
  locale: localeProp,
}: SeoDescriptionBoxProps) {
  const detectedLocale = useLocale();
  const locale = localeProp ?? detectedLocale;
  const t = CATALOG_I18N[locale].seoBox;
  const [expanded, setExpanded] = useState(false);

  if (!html) return null;

  return (
    <section
      aria-label={title || t.defaultAriaLabel}
      className="bg-white pt-4 pb-6"
    >
      <div
        className={`relative overflow-hidden transition-all ${
          expanded ? "max-h-none" : "max-h-[340px]"
        }`}
      >
        <div
          className="prose prose-slate max-w-[52ch] mx-auto text-sm sm:text-base text-ink-secondary leading-relaxed text-pretty [&_p]:text-pretty [&_li]:text-pretty"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/85 to-transparent"
          />
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 rounded-none bg-store-forest hover:bg-store-forest-hover text-white text-sm font-medium transition-colors"
        >
          <span>{expanded ? t.showLess : t.showMore}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
