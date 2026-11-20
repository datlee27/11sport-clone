"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { calcDiscountPercent, formatVND } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import type { ProductListItem } from "@/types/storefront";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const defaultImage =
    product.thumbnailUrl ||
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "";

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const colors = product.colors ?? [];
  const activeColor = colors[selectedColorIdx];
  const displayImage = activeColor?.imageUrl || defaultImage;

  const discountPercent = calcDiscountPercent(
    product.sellingPrice,
    product.compareAtPrice
  );

  const visibleColors = colors.slice(0, 4);
  const extraColorCount = Math.max(0, colors.length - 4);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    addItem({
      variantId: `${product._id}-${activeColor?.color || "default"}`,
      productId: product._id,
      slug: product.slug,
      name: product.name,
      brandName: product.brand?.name || "11 Sport",
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
    <article className="group rounded-xl border border-surface-border bg-white shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col h-full">
      {/* 1. Image Box */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative aspect-square bg-surface-muted rounded-t-xl overflow-hidden block"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-ink-muted">
            11 SPORT
          </div>
        )}

        {/* Top-left Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-accent-hot text-white font-mono text-xs font-bold leading-tight">
            -{discountPercent}%
          </span>
        )}

        {/* Top-right Gift or New Badge */}
        {product.hasGift ? (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-brand-primary text-white text-[11px] font-bold leading-tight">
            TẶNG QUÀ
          </span>
        ) : product.isNew ? (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-accent-volt text-ink-primary text-[11px] font-bold leading-tight">
            MỚI
          </span>
        ) : null}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-ink-primary text-white text-xs font-bold">
              Tạm hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* 2. Swatch Row */}
      <div className="h-8 px-3 pt-2 flex items-center gap-1">
        {visibleColors.map((col, idx) => {
          const hex = col.colorHexes?.[0] || "#334155";
          const isSelected = idx === selectedColorIdx;
          return (
            <button
              key={`${col.color}-${idx}`}
              type="button"
              onClick={() => setSelectedColorIdx(idx)}
              onMouseEnter={() => setSelectedColorIdx(idx)}
              aria-label={`Chọn màu ${col.color} cho ${product.name}`}
              aria-pressed={isSelected}
              className="p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <span
                className={`block w-4 h-4 rounded-full border ${
                  isSelected
                    ? "ring-2 ring-brand-primary ring-offset-1 border-white"
                    : "border-surface-border"
                }`}
                style={{ backgroundColor: hex }}
              />
            </button>
          );
        })}
        {extraColorCount > 0 && (
          <span className="text-xs font-medium text-ink-muted ml-0.5">
            +{extraColorCount}
          </span>
        )}
      </div>

      {/* 3. Brand & Title */}
      <div className="px-3 pt-1">
        {product.brand?.name && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted truncate">
            {product.brand.name}
          </p>
        )}
        <Link
          href={`/san-pham/${product.slug}`}
          className="mt-0.5 text-sm font-semibold text-ink-primary hover:text-brand-primary line-clamp-2 min-h-[40px] block leading-snug"
        >
          {product.name}
        </Link>
      </div>

      {/* 4. Rating, Price & Quick Add */}
      <div className="px-3 pb-3 pt-2 mt-auto flex items-end justify-between gap-2">
        <div className="min-w-0">
          {typeof product.ratingCount === "number" && product.ratingCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-ink-secondary mb-1">
              <Star
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono font-semibold">
                {(product.ratingAvg ?? 5).toFixed(1)}
              </span>
              <span className="text-ink-muted">({product.ratingCount})</span>
            </div>
          )}

          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span
              className={`font-mono font-bold text-sm sm:text-base ${
                discountPercent > 0 ? "text-accent-hot" : "text-ink-primary"
              }`}
            >
              {formatVND(product.sellingPrice)}
            </span>
            {discountPercent > 0 && product.compareAtPrice && (
              <span className="font-mono text-xs line-through text-ink-muted">
                {formatVND(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          aria-label={
            product.inStock
              ? `Thêm nhanh ${product.name} vào giỏ hàng`
              : `${product.name} tạm hết hàng`
          }
          className={`shrink-0 inline-flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            product.inStock
              ? "border-brand-border bg-brand-tint text-brand-primary hover:bg-brand-primary hover:text-white"
              : "border-surface-border bg-surface-muted text-ink-muted cursor-not-allowed"
          }`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
