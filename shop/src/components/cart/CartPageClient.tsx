"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatVND } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import type { CartPriceResponse } from "@/types/storefront";

const DEFAULT_FREESHIP_THRESHOLD = 500_000;
const DEFAULT_SHIPPING_FEE = 30_000;

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [pricing, setPricing] = useState<CartPriceResponse | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem("11sport_checkout_prefs");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          couponCode?: string;
          selectedGiftProductId?: string;
        };
        if (parsed.couponCode) {
          setCouponInput(parsed.couponCode);
          setAppliedCoupon(parsed.couponCode);
        }
        if (parsed.selectedGiftProductId) {
          setSelectedGiftId(parsed.selectedGiftProductId);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const syncCartPrice = useCallback(
    async (coupon: string, giftId: string) => {
      if (!items.length) {
        setPricing(null);
        return;
      }
      setLoadingPrice(true);
      try {
        const res = await apiFetch<{ data: CartPriceResponse }>(
          "/public/cart/price",
          {
            method: "POST",
            body: JSON.stringify({
              items: items.map((i) => ({
                productId: i.productId,
                variantKey: i.variantId,
                quantity: i.quantity,
              })),
              couponCode: coupon || undefined,
              selectedGiftProductId: giftId || undefined,
            }),
          }
        );
        if (res?.data) {
          setPricing(res.data);
          if (
            res.data.eligibleGifts?.length > 0 &&
            !res.data.eligibleGifts.some((g) => g.productId === giftId)
          ) {
            setSelectedGiftId(res.data.eligibleGifts[0].productId);
          }
        }
      } catch {
        setPricing(null);
      } finally {
        setLoadingPrice(false);
      }
    },
    [items]
  );

  useEffect(() => {
    if (!mounted) return;
    syncCartPrice(appliedCoupon, selectedGiftId);
  }, [mounted, items, appliedCoupon, selectedGiftId, syncCartPrice]);

  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(
        "11sport_checkout_prefs",
        JSON.stringify({
          couponCode: appliedCoupon || undefined,
          selectedGiftProductId: selectedGiftId || undefined,
        })
      );
    } catch {
      // Ignore
    }
  }, [mounted, appliedCoupon, selectedGiftId]);

  if (!mounted) {
    return <div className="h-72 rounded-2xl bg-surface-muted animate-pulse" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-subtle py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-white border border-surface-border flex items-center justify-center mb-4">
          <ShoppingBag className="w-7 h-7 text-ink-muted" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-ink-primary">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Hãy chọn thêm vợt Pickleball, giày thi đấu hoặc phụ kiện yêu thích.
        </p>
        <Link
          href="/danh-muc/vot-pickleball"
          className="mt-5 inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const localSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const rawSubtotal = pricing?.rawSubtotal ?? localSubtotal;
  const tierDiscountTotal = pricing?.tierDiscountTotal ?? 0;
  const couponDiscount = pricing?.couponDiscount ?? 0;
  const freeShipThreshold =
    pricing?.freeShipThreshold ?? DEFAULT_FREESHIP_THRESHOLD;
  const shippingFee =
    pricing?.shippingFee ??
    (rawSubtotal >= freeShipThreshold ? 0 : DEFAULT_SHIPPING_FEE);
  const totalAmount =
    pricing?.totalAmount ??
    Math.max(0, rawSubtotal - tierDiscountTotal - couponDiscount + shippingFee);
  const eligibleGifts = pricing?.eligibleGifts ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left: Item List */}
      <div className="lg:col-span-8 rounded-2xl border border-surface-border bg-white divide-y divide-surface-border">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="p-4 sm:p-5 flex gap-4 items-start"
          >
            <Link
              href={`/san-pham/${item.slug}`}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface-muted border border-surface-border overflow-hidden shrink-0"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
                  11Sport
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="text-sm sm:text-base font-semibold text-ink-primary hover:text-brand-primary line-clamp-2"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  aria-label={`Xóa ${item.name}`}
                  className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-accent-hot hover:bg-accent-hot-tint shrink-0"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {(item.colorName || item.sizeName) && (
                <p className="text-xs text-ink-muted">
                  Phân loại:{" "}
                  {[item.colorName, item.sizeName].filter(Boolean).join(" / ")}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center border border-surface-border rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    aria-label={`Giảm số lượng ${item.name}`}
                    className="w-11 h-11 inline-flex items-center justify-center text-ink-primary hover:bg-surface-muted rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-bold text-ink-primary">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    aria-label={`Tăng số lượng ${item.name}`}
                    className="w-11 h-11 inline-flex items-center justify-center text-ink-primary hover:bg-surface-muted rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-mono text-base font-bold text-ink-primary">
                    {formatVND(item.price * item.quantity)}
                  </p>
                  <p className="font-mono text-xs text-ink-muted">
                    {formatVND(item.price)} / sp
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Summary, Coupon & Single Gift Block */}
      <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
        {/* Khối Quà tặng kèm đơn hàng — chỉ hiển thị 1 lần duy nhất */}
        {eligibleGifts.length > 0 && (
          <div className="rounded-2xl border border-brand-border bg-brand-tint p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
              <Gift className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Quà tặng kèm đơn hàng (chọn 1)</span>
            </div>
            <div className="space-y-2">
              {eligibleGifts.map((gift) => (
                <label
                  key={gift.productId}
                  className="flex items-center gap-2.5 min-h-[44px] px-3 py-2 rounded-lg bg-white border border-brand-border cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="cart-gift"
                    value={gift.productId}
                    checked={selectedGiftId === gift.productId}
                    onChange={() => setSelectedGiftId(gift.productId)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="font-medium text-ink-primary flex-1">
                    {gift.productName}
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    x{gift.quantity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 space-y-4">
          <h2 className="text-base font-bold text-ink-primary">
            Tóm tắt đơn hàng
          </h2>

          {/* Coupon Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedCoupon(couponInput.trim().toUpperCase());
            }}
            className="space-y-2"
          >
            <label
              htmlFor="cart-coupon"
              className="text-xs font-semibold text-ink-secondary flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
              <span>Mã ưu đãi</span>
            </label>
            <div className="flex gap-2">
              <input
                id="cart-coupon"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Nhập mã giảm giá..."
                className="flex-1 h-11 px-3 rounded-lg border border-surface-border font-mono text-sm uppercase focus:outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 rounded-lg bg-surface-muted hover:bg-brand-tint hover:text-brand-primary text-sm font-semibold text-ink-primary transition-colors"
              >
                Áp dụng
              </button>
            </div>
            {pricing?.couponError && (
              <p className="text-xs text-accent-hot font-medium">
                {pricing.couponError}
              </p>
            )}
            {pricing?.couponApplied && (
              <p className="text-xs text-brand-primary font-semibold">
                Đã áp dụng mã {pricing.couponApplied.code}:{" "}
                {pricing.couponApplied.name}
              </p>
            )}
          </form>

          <div className="pt-3 border-t border-surface-border space-y-2 text-sm">
            <div className="flex justify-between text-ink-secondary">
              <span>Tạm tính</span>
              <span className="font-mono font-semibold text-ink-primary">
                {formatVND(rawSubtotal)}
              </span>
            </div>
            {tierDiscountTotal > 0 && (
              <div className="flex justify-between text-brand-primary">
                <span>Ưu đãi mua nhiều</span>
                <span className="font-mono font-semibold">
                  -{formatVND(tierDiscountTotal)}
                </span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-brand-primary">
                <span>Giảm giá coupon</span>
                <span className="font-mono font-semibold">
                  -{formatVND(couponDiscount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-ink-secondary">
              <span className="inline-flex items-center gap-1">
                <Truck className="w-4 h-4" aria-hidden="true" />
                <span>Phí vận chuyển</span>
              </span>
              <span className="font-mono font-semibold text-ink-primary">
                {shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-baseline justify-between">
            <span className="text-base font-bold text-ink-primary">
              Tổng cộng
            </span>
            <span className="font-mono text-xl font-bold text-accent-hot">
              {loadingPrice ? "..." : formatVND(totalAmount)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full min-h-[48px] inline-flex items-center justify-center rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm transition-colors"
          >
            Tiến hành thanh toán
          </Link>
        </div>
      </aside>
    </div>
  );
}
