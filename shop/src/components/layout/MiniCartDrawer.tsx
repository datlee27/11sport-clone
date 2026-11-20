"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/format";

const FREESHIP_THRESHOLD = 500_000;

export function MiniCartDrawer() {
  const items = useCartStore((s) => s.items);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal);
  const freeshipProgress = Math.min(
    100,
    Math.round((subtotal / FREESHIP_THRESHOLD) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Giỏ hàng của bạn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/50"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-[420px] bg-white h-full shadow-drawer flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-5 h-16 border-b border-surface-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag
              className="w-5 h-5 text-brand-primary"
              aria-hidden="true"
            />
            <h2 className="text-base font-bold text-ink-primary">
              Giỏ hàng ({totalItems} sản phẩm)
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Đóng giỏ hàng"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-secondary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Freeship Progress */}
        <div className="px-4 sm:px-5 py-3 bg-brand-tint border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-brand-primary">
            <Truck className="w-4 h-4 shrink-0" aria-hidden="true" />
            {remainingForFreeship > 0 ? (
              <span>
                Mua thêm{" "}
                <strong className="font-mono font-bold">
                  {formatVND(remainingForFreeship)}
                </strong>{" "}
                để được Freeship toàn quốc
              </span>
            ) : (
              <span className="font-semibold">
                Đơn hàng của bạn đã đủ điều kiện Freeship toàn quốc!
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${freeshipProgress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
                <ShoppingBag
                  className="w-7 h-7 text-ink-muted"
                  aria-hidden="true"
                />
              </div>
              <p className="text-base font-semibold text-ink-primary">
                Giỏ hàng đang trống
              </p>
              <p className="text-sm text-ink-muted mt-1 max-w-[260px]">
                Khám phá vợt Pickleball, giày thi đấu và phụ kiện chính hãng tại
                11 Sport.
              </p>
              <Link
                href="/danh-muc/vot-pickleball"
                onClick={closeDrawer}
                className="mt-5 inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-surface-border">
              {items.map((item) => (
                <li key={item.variantId} className="py-4 flex gap-3">
                  <Link
                    href={`/san-pham/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative w-20 h-20 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-surface-border"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
                        11Sport
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-semibold text-ink-primary line-clamp-2 hover:text-brand-primary"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-accent-hot hover:bg-accent-hot-tint shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {(item.colorName || item.sizeName) && (
                      <p className="text-xs text-ink-muted mt-0.5">
                        {[item.colorName, item.sizeName]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    )}

                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-surface-border rounded-lg">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label={`Giảm số lượng ${item.name}`}
                          className="w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center text-ink-secondary hover:bg-surface-muted rounded-l-lg"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-9 text-center font-mono text-sm font-semibold text-ink-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label={`Tăng số lượng ${item.name}`}
                          className="w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center text-ink-secondary hover:bg-surface-muted rounded-r-lg"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-ink-primary">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-surface-border bg-white space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-secondary">
                Tạm tính
              </span>
              <span className="font-mono text-lg font-bold text-ink-primary">
                {formatVND(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/gio-hang"
                onClick={closeDrawer}
                className="min-h-[48px] inline-flex items-center justify-center rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-tint text-sm font-semibold transition-colors"
              >
                Xem giỏ hàng
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="min-h-[48px] inline-flex items-center justify-center rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
              >
                Thanh toán ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
