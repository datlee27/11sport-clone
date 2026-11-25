"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import {
  calcDiscountPercent,
  formatPriceByCurrency,
  resolveMediaUrl,
  type LocaleCode,
} from "@/lib/format";
import {
  localizeColorName,
  localizeHref,
  localizeProductName,
  STORE_I18N,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N } from "@/lib/i18n/chrome";
import { buildCartVariantId } from "@/lib/pricingAndSearch";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type { ProductListItem } from "@/types/storefront";

interface ProductCardProps {
  product: ProductListItem;
  density?: "home" | "category";
  locale?: LocaleCode;
}

/**
 * Product Card 1:1 with live 11Sport storefront design system:
 * - Home density: 14px radius, #ebebeb border, centered title/swatches/price, 0 CTA buttons
 * - Category density: 8px radius, #eeeeee border, left-aligned title/swatches/price, solid high-contrast CTA (`CHỌN` / `THÊM VÀO GIỎ HÀNG`)
 * - Top-left dark forest `-N%` pill + soft mint `TẶNG ÁO` / `Mới` pills
 */
export function ProductCard({
  product,
  density = "home",
  locale,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCurrencyStore((s) => s.currency);
  const routeLocale = useLocale();
  const activeLocale = locale ?? routeLocale;
  const t = STORE_I18N[activeLocale].product;
  const chrome = CHROME_I18N[activeLocale].productCard;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeCurrency = mounted ? currency : "VND";
  const displayName = localizeProductName(
    product.name,
    activeLocale,
    product.slug
  );

  const defaultImage =
    product.thumbnailUrl ||
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/images/mock/paddle-joola-red.svg";

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const colors = product.colors ?? [];
  const activeColor = colors[selectedColorIdx];
  const displayImage = activeColor?.imageUrl || defaultImage;
  const resolvedDisplayImage = resolveMediaUrl(displayImage);

  const galleryPool: string[] = [];
  for (const raw of [
    defaultImage,
    ...(product.images ?? []).map((img) => img.url),
    ...colors.map((c) => c.imageUrl),
  ]) {
    const resolved = resolveMediaUrl(raw);
    if (resolved && !galleryPool.includes(resolved)) {
      galleryPool.push(resolved);
    }
  }
  const hoverImage =
    galleryPool.find((url) => url !== resolvedDisplayImage) ?? null;

  const discountPercent = calcDiscountPercent(
    product.sellingPrice,
    product.compareAtPrice
  );

  const visibleColors = colors.slice(0, 5);
  const extraColorCount = Math.max(0, colors.length - 5);
  const productHref = localizeHref(`/${product.slug}`, activeLocale);
  const isCategory = density === "category";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    addItem({
      variantId: buildCartVariantId(product._id, {
        colorName: activeColor?.color,
      }),
      productId: product._id,
      slug: product.slug,
      name: product.name,
      brandName: product.brand?.name || "11Sport",
      sku: product.code,
      imageUrl: displayImage,
      colorName: activeColor?.color,
      price: product.sellingPrice,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      maxStock: product.stockAvailable,
    });
  };

  return (
    <article
      className={`group flex flex-col h-full bg-white p-2.5 sm:p-3 ${
        isCategory
          ? "rounded-[8px] border border-[#eeeeee] text-left"
          : "mipik-card-lift rounded-[14px] border border-[#ebebeb] text-center"
      }`}
    >
      {/* 1. Square Image Box with Top-Left Discount & Bottom-Left Gift/New Pill */}
      <Link
        href={productHref}
        className="group/img relative aspect-square bg-white rounded-lg overflow-hidden block"
      >
        {resolvedDisplayImage ? (
          <>
            <Image
              src={resolvedDisplayImage}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className={`object-contain p-1.5 transition-all duration-300 ease-out ${
                hoverImage
                  ? "group-hover/img:opacity-0 group-hover/img:scale-[1.03] motion-reduce:group-hover/img:opacity-100"
                  : "group-hover/img:scale-105 motion-reduce:group-hover/img:scale-100"
              }`}
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={chrome.hoverImageAlt(displayName)}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-contain p-1.5 opacity-0 transition-all duration-300 ease-out group-hover/img:opacity-100 group-hover/img:scale-[1.03] pointer-events-none motion-reduce:hidden"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-300">
            <Package className="w-10 h-10 stroke-[1.5]" aria-hidden="true" />
          </div>
        )}

        {/* Top-left Discount Pill */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-1.5 z-10 px-2.5 py-0.5 rounded-full bg-store-forest text-white text-[11px] font-bold leading-tight whitespace-nowrap">
            -{discountPercent}%
          </span>
        )}

        {/* Top-right `Mới` pill only if product also carries `TẶNG ÁO` */}
        {product.isNew && product.hasGift && (
          <span className="absolute top-2 right-1.5 z-10 px-2.5 py-0.5 rounded-full bg-[#eef7f2] text-[#224e40] border border-[#c0e2d5] text-[11px] font-semibold leading-tight whitespace-nowrap">
            {t.newBadge}
          </span>
        )}

        {/* Bottom-left Gift Pill (`TẶNG ÁO`) or `Mới` */}
        {(product.hasGift || (product.isNew && !product.hasGift)) && (
          <div className="absolute bottom-2 left-1.5 z-10 flex items-center gap-1">
            {product.hasGift && (
              <span className="px-2.5 py-1 rounded-full bg-store-mint-bg text-[#224e40] border border-[#c0e2d5] text-[11px] font-bold uppercase tracking-wide leading-none whitespace-nowrap">
                {t.freeGiftBadge}
              </span>
            )}
            {product.isNew && !product.hasGift && (
              <span className="px-2.5 py-1 rounded-full bg-[#eef7f2] text-[#224e40] border border-[#c0e2d5] text-[11px] font-semibold leading-none whitespace-nowrap">
                {t.newBadge}
              </span>
            )}
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-ink-primary text-white text-xs font-bold">
              {t.outOfStock}
            </span>
          </div>
        )}
      </Link>

      {/* 2. Square 36x36 Color Swatches (up to 5) + Plain `+N` Overflow */}
      {visibleColors.length > 0 && (
        <div
          className={`pt-2.5 flex flex-wrap items-center gap-1.5 min-h-[44px] ${
            isCategory ? "justify-start" : "justify-center"
          }`}
        >
          {visibleColors.map((col, idx) => {
            const thumb = resolveMediaUrl(col.imageUrl || defaultImage);
            const isSelected = idx === selectedColorIdx;
            const localizedColor = localizeColorName(col.color, activeLocale);
            return (
              <button
                key={`${col.color}-${idx}`}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                onMouseEnter={() => setSelectedColorIdx(idx)}
                aria-label={chrome.selectColorAria(localizedColor, displayName)}
                aria-pressed={isSelected}
                className={`relative w-9 h-9 rounded-[4px] border overflow-hidden bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest ${
                  isSelected
                    ? "border-store-forest ring-1 ring-store-forest"
                    : "border-[#dcdcdc] hover:border-store-forest"
                }`}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={localizedColor}
                    fill
                    sizes="36px"
                    className="object-contain p-0.5"
                  />
                ) : (
                  <span
                    className="block w-full h-full"
                    style={{ backgroundColor: col.colorHexes?.[0] || "#224E40" }}
                  />
                )}
              </button>
            );
          })}
          {extraColorCount > 0 && (
            <span className="text-xs font-bold text-ink-primary pl-0.5">
              +{extraColorCount}
            </span>
          )}
        </div>
      )}

      {/* 3. Product Title */}
      <div className={isCategory ? "pt-2" : "pt-2 px-1"}>
        <Link
          href={productHref}
          className={`text-[13.5px] sm:text-[14px] text-[#1e2c26] hover:text-store-forest line-clamp-2 min-h-[38px] block leading-snug ${
            isCategory ? "font-normal text-left" : "font-medium text-center"
          }`}
        >
          {displayName}
        </Link>
      </div>

      {/* 4. Price + High-Contrast CTA on Category Pages */}
      <div className="pt-1 mt-auto space-y-2">
        <div
          className={`flex flex-wrap items-baseline gap-x-1.5 ${
            isCategory ? "justify-start" : "justify-center"
          }`}
        >
          {discountPercent > 0 && product.compareAtPrice && (
            <span className="text-[13px] line-through text-[#6b7280] font-normal">
              {formatPriceByCurrency(product.compareAtPrice, activeCurrency)}
            </span>
          )}
          <span className="text-[13.5px] font-bold text-[#0a0a0a]">
            {formatPriceByCurrency(product.sellingPrice, activeCurrency)}
          </span>
        </div>

        {isCategory &&
          (colors.length > 1 && product.inStock ? (
            <Link
              href={productHref}
              className="mt-1 inline-flex items-center justify-center min-h-[38px] px-3.5 sm:px-4 py-1.5 max-w-full rounded-[4px] text-[11px] font-bold uppercase tracking-wide text-center leading-tight text-white bg-store-forest hover:bg-store-forest-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-1 self-start"
            >
              {t.selectOption}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="mt-1 inline-flex items-center justify-center min-h-[38px] px-3.5 sm:px-4 py-1.5 max-w-full rounded-[4px] text-[11px] font-bold uppercase tracking-wide text-center leading-tight text-white bg-store-forest hover:bg-store-forest-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed self-start"
            >
              {!product.inStock ? t.outOfStock.toUpperCase() : t.addToCart}
            </button>
          ))}
      </div>
    </article>
  );
}
