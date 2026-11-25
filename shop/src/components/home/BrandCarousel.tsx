"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl, type LocaleCode } from "@/lib/format";
import { localizeHref } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N } from "@/lib/i18n/chrome";
import type { BrandSummary } from "@/types/storefront";

interface BrandCarouselProps {
  brands: BrandSummary[];
  title?: string;
  locale?: LocaleCode;
}

const ORDERED_HOME_SLUGS = [
  "kamito",
  "sypik",
  "selkirk",
  "vole",
  "joola",
  "wika",
  "kbs",
  "kaiwin",
];

/**
 * Full-bleed Brand Tile Strip 1:1 with live mipik.vn:
 * - No section title box, no rounded corners, flush 100% edge-to-edge above Footer
 * - 7 columns on Desktop, 4 columns on Mobile
 * - 1:1 square dark green #224E40 tiles separated by crisp 2px white borders
 */
export function BrandCarousel({ brands, title, locale }: BrandCarouselProps) {
  const routeLocale = useLocale();
  const activeLocale = locale ?? routeLocale;
  const t = CHROME_I18N[activeLocale].brandCarousel;
  const resolvedTitle = title ?? t.defaultTitle;
  const [startOffset, setStartOffset] = useState(0);

  if (!brands.length) {
    return (
      <section
        aria-label={resolvedTitle}
        className="group relative w-full bg-white py-[2px]"
      >
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-[2px] bg-white">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className={`relative aspect-square bg-[#224e40] flex flex-col items-center justify-center p-3 sm:p-4 ${
                idx >= 4 ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50">
                <AlertCircle className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const preferred = brands.filter(
    (b) => "featuredOnHome" in b && Boolean(b.featuredOnHome)
  );
  const baseList = preferred.length >= 7 ? preferred : brands;
  const sortedList = [...baseList].sort((a, b) => {
    const ia = ORDERED_HOME_SLUGS.indexOf(a.slug);
    const ib = ORDERED_HOME_SLUGS.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const displayCount = Math.min(7, sortedList.length);
  const visibleBrands = Array.from({ length: displayCount }, (_, idx) => {
    return sortedList[(startOffset + idx) % sortedList.length]!;
  });

  const canRotate = sortedList.length > 7;

  return (
    <section
      aria-label={resolvedTitle}
      className="group relative w-full bg-white py-[2px]"
    >
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-[2px] bg-white">
        {visibleBrands.map((brand, idx) => {
          const rawHref =
            "rootCategorySlug" in brand &&
            typeof brand.rootCategorySlug === "string"
              ? `/${brand.rootCategorySlug}`
              : `/thuong-hieu/${brand.slug}`;
          const href = localizeHref(rawHref, activeLocale);
          const logo = resolveMediaUrl(brand.logoUrl);

          return (
            <Link
              key={`${brand._id}-${idx}`}
              href={href}
              aria-label={brand.name}
              className={`group/tile relative aspect-square bg-store-forest hover:bg-store-forest-hover text-white overflow-hidden flex items-center justify-center text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${
                idx >= 4 ? "hidden lg:flex" : "flex"
              }`}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 1024px) 25vw, 15vw"
                  className="object-cover transition-transform duration-200 group-hover/tile:scale-105"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="px-1.5 sm:px-3 text-xs sm:text-base lg:text-lg xl:text-xl font-extrabold uppercase tracking-wide sm:tracking-[0.12em] text-white leading-tight break-words transition-transform duration-200 group-hover/tile:scale-105"
                >
                  {brand.name}
                </span>
              )}
              <span className="sr-only">{brand.name}</span>
            </Link>
          );
        })}
      </div>

      {canRotate && (
        <>
          <button
            type="button"
            onClick={() =>
              setStartOffset(
                (prev) => (prev - 1 + sortedList.length) % sortedList.length
              )
            }
            aria-label={t.prevBrandAria}
            className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-ink-primary shadow-md hover:bg-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity absolute left-3 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() =>
              setStartOffset((prev) => (prev + 1) % sortedList.length)
            }
            aria-label={t.nextBrandAria}
            className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-ink-primary shadow-md hover:bg-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity absolute right-3 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}
