"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPriceByCurrency, resolveMediaUrl } from "@/lib/format";
import {
  localizeColorName,
  localizeGiftTitle,
  localizeHref,
  localizeProductName,
  localizeSizeLabel,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N } from "@/lib/i18n/chrome";
import { calculatePerVariantCartPricing } from "@/lib/pricingAndSearch";

export function MiniCartDrawer() {
  const locale = useLocale();
  const t = CHROME_I18N[locale].miniCart;
  const items = useCartStore((s) => s.items);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const currency = useCurrencyStore((s) => s.currency);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!mounted || !isDrawerOpen) {
    return null;
  }

  const pricing = calculatePerVariantCartPricing(
    items.map((item) => ({
      productId: item.productId,
      variantKey: item.variantId,
      quantity: item.quantity,
      regularPrice: item.price,
      bulkTiers:
        item.price > 500_000
          ? [
              {
                minQty: 3,
                unitPrice: Math.max(0, item.price - 100_000),
                label: t.bulkTier3Label,
              },
              {
                minQty: 5,
                unitPrice: Math.max(0, item.price - 200_000),
                label: t.bulkTier5Label,
              },
            ]
          : [],
    }))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogAria}
    >
      <div
        className="fixed inset-0 bg-[#0a0a0a]/45"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="relative z-10 w-[88vw] max-w-[340px] sm:max-w-[380px] bg-white h-full shadow-[0_12px_36px_rgba(0,0,0,0.16)] flex flex-col">
        {/* Minimal Header: GIỎ HÀNG / CART + Close */}
        <div className="px-4 sm:px-5 h-14 border-b border-[#ececec] flex items-center justify-between shrink-0">
          <h2 className="text-[14px] font-bold text-[#0a0a0a] uppercase tracking-wider tabular-nums">
            {t.heading(pricing.totalQuantity)}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t.closeAria}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[#666666] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-2 space-y-5">
              <p className="text-[14px] text-[#333333]">{t.emptyMessage}</p>
              <Link
                href={localizeHref("/vot-pickleball", locale)}
                onClick={closeDrawer}
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-none bg-store-forest hover:bg-store-forest-hover text-white text-[13px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-2"
              >
                {t.returnToShop}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#ececec]">
              {items.map((item) => {
                const lineCalc = pricing.lines.find(
                  (l) =>
                    l.productId === item.productId &&
                    l.variantKey === item.variantId
                );
                const effectiveUnit =
                  lineCalc?.effectiveUnitPrice ?? item.price;
                const displayName = localizeProductName(
                  item.name,
                  locale,
                  item.slug
                );
                const productHref = localizeHref(`/${item.slug}`, locale);
                const variantMeta = [
                  localizeColorName(item.colorName, locale),
                  localizeSizeLabel(item.sizeName, locale),
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <li
                    key={item.variantId}
                    className="py-3.5 flex gap-3 items-start"
                  >
                    <Link
                      href={productHref}
                      onClick={closeDrawer}
                      className="relative w-[60px] h-[60px] bg-white border border-[#eeeeee] overflow-hidden shrink-0"
                    >
                      {resolveMediaUrl(item.imageUrl) ? (
                        <Image
                          src={resolveMediaUrl(item.imageUrl)}
                          alt={displayName}
                          fill
                          sizes="60px"
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#888888]">
                          11Sport
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={productHref}
                          onClick={closeDrawer}
                          className="text-[13.5px] font-medium text-[#224e40] hover:text-[#186746] line-clamp-2 leading-snug"
                        >
                          {displayName}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={t.removeItemAria(displayName)}
                          className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full border border-[#cccccc] text-[#666666] hover:border-[#0a0a0a] hover:text-[#0a0a0a] inline-flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      {variantMeta && (
                        <p className="text-[11.5px] text-[#777777] mt-0.5">
                          {variantMeta}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12.5px] text-[#555555] tabular-nums">
                          {item.quantity} ×{" "}
                          <strong className="text-[#0a0a0a] font-bold">
                            {formatPriceByCurrency(effectiveUnit, currency)}
                          </strong>
                        </span>

                        <div className="inline-flex items-center border border-[#dddddd] rounded-full bg-white min-h-[32px]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            aria-label={t.decreaseQtyAria(displayName)}
                            className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center text-[#555555] hover:text-[#0a0a0a] rounded-l-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-[#0a0a0a] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            aria-label={t.increaseQtyAria(displayName)}
                            className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center text-[#555555] hover:text-[#0a0a0a] rounded-r-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}

              {/* Unlocked Free Gift Row (no remove button) */}
              {pricing.unlockedGift && (
                <li className="py-3.5 flex gap-3 items-start bg-[#f8f9f5]/60 -mx-4 sm:-mx-5 px-4 sm:px-5">
                  <div className="relative w-[60px] h-[60px] bg-white border border-[#dce5da] overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold uppercase text-[#204b3e] text-center p-1">
                    {t.giftBadge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-[#204b3e] leading-snug">
                      {localizeGiftTitle(
                        pricing.unlockedGift.rewardTitle,
                        locale
                      )}
                    </p>
                    <p className="text-[11.5px] text-[#4a6b5d] mt-0.5">
                      {t.giftFreeSubtitle}
                    </p>
                    <p className="text-[12.5px] text-[#555555] mt-1 tabular-nums">
                      1 ×{" "}
                      <strong className="text-[#0a0a0a]">
                        {formatPriceByCurrency(0, currency)}
                      </strong>
                    </p>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Footer: Subtotal + 2 sharp full-width #224e40 CTA buttons */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#ececec] bg-white space-y-2.5 shrink-0">
            {pricing.bulkDiscountSaved > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#224e40]">
                <span>{t.bulkSavingsLabel}</span>
                <span className="tabular-nums">
                  -{formatPriceByCurrency(pricing.bulkDiscountSaved, currency)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pb-1">
              <span className="text-[14px] font-bold text-[#333333]">
                {t.subtotalLabel}
              </span>
              <span className="text-[15px] font-bold text-[#0a0a0a] tabular-nums">
                {formatPriceByCurrency(pricing.totalPayable, currency)}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href={localizeHref("/gio-hang", locale)}
                onClick={closeDrawer}
                className="w-full min-h-[44px] py-2.5 rounded-none inline-flex items-center justify-center bg-store-forest hover:bg-store-forest-hover text-white text-[13px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-2"
              >
                {t.viewCartCta}
              </Link>
              <Link
                href={localizeHref("/thanh-toan", locale)}
                onClick={closeDrawer}
                className="w-full min-h-[44px] py-2.5 rounded-none inline-flex items-center justify-center bg-store-forest hover:bg-store-forest-hover text-white text-[13px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-2"
              >
                {t.checkoutCta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
