"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Banknote,
  Gift,
  QrCode,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import {
  formatVND,
  formatPhoneVN,
  isValidPhoneVN,
  normalizePhoneVN,
} from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import type {
  CartPriceResponse,
  CustomerProfile,
} from "@/types/storefront";

const CUSTOMER_TOKEN_KEY = "11sport_customer_token";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [customerToken, setCustomerToken] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("Hồ Chí Minh");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [note, setNote] = useState("");
  const [paymentGateway, setPaymentGateway] = useState<"PAYOS" | "COD">(
    "PAYOS"
  );

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [pricing, setPricing] = useState<CartPriceResponse | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const savedPrefs = sessionStorage.getItem("11sport_checkout_prefs");
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs) as {
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

      const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (token) {
        setCustomerToken(token);
        apiFetch<{ data: CustomerProfile }>("/public/customers/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            const c = res?.data;
            if (!c) return;
            const defaultAddr =
              c.addresses?.find((a) => a.isDefault) || c.addresses?.[0];
            if (defaultAddr) {
              setFullName((prev) => prev || defaultAddr.fullName || c.name);
              setPhone((prev) => prev || formatPhoneVN(defaultAddr.phone || c.phone || ""));
              setEmail((prev) => prev || c.email || "");
              setProvince((prev) => defaultAddr.province || prev);
              setDistrict((prev) => prev || defaultAddr.district || "");
              setWard((prev) => prev || defaultAddr.ward || "");
              setAddressLine((prev) => prev || defaultAddr.addressLine || "");
            } else {
              setFullName((prev) => prev || c.name || "");
              setPhone((prev) => prev || formatPhoneVN(c.phone || ""));
              setEmail((prev) => prev || c.email || "");
            }
          })
          .catch(() => {
            // Token expired or backend unavailable
          });
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const syncPrice = useCallback(async () => {
    if (!items.length) return;
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
            couponCode: appliedCoupon || undefined,
            selectedGiftProductId: selectedGiftId || undefined,
            province: province || undefined,
          }),
        }
      );
      if (res?.data) {
        setPricing(res.data);
        if (
          res.data.eligibleGifts?.length > 0 &&
          !res.data.eligibleGifts.some((g) => g.productId === selectedGiftId)
        ) {
          setSelectedGiftId(res.data.eligibleGifts[0].productId);
        }
      }
    } catch {
      setPricing(null);
    }
  }, [items, appliedCoupon, selectedGiftId, province]);

  useEffect(() => {
    if (mounted) syncPrice();
  }, [mounted, syncPrice]);

  if (!mounted) {
    return <div className="h-96 rounded-2xl bg-surface-muted animate-pulse" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-subtle py-16 px-4 text-center">
        <ShoppingBag
          className="w-10 h-10 text-ink-muted mx-auto mb-3"
          aria-hidden="true"
        />
        <h2 className="text-lg font-bold text-ink-primary">
          Chưa có sản phẩm trong giỏ hàng
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Vui lòng thêm sản phẩm vào giỏ trước khi tiến hành thanh toán.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-brand-primary text-white text-sm font-semibold"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  const localSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const rawSubtotal = pricing?.rawSubtotal ?? localSubtotal;
  const tierDiscountTotal = pricing?.tierDiscountTotal ?? 0;
  const couponDiscount = pricing?.couponDiscount ?? 0;
  const shippingFee =
    pricing?.shippingFee ?? (rawSubtotal >= 500_000 ? 0 : 30_000);
  const totalAmount =
    pricing?.totalAmount ??
    Math.max(0, rawSubtotal - tierDiscountTotal - couponDiscount + shippingFee);
  const eligibleGifts = pricing?.eligibleGifts ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người nhận.");
      return;
    }
    if (!isValidPhoneVN(phone)) {
      setErrorMsg("Số điện thoại không hợp lệ (VD: 0901 234 567).");
      return;
    }
    if (
      !province.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !addressLine.trim()
    ) {
      setErrorMsg("Vui lòng điền đầy đủ địa chỉ giao hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{
        data: {
          orderCode: string;
          totalAmount: number;
          paymentGateway: string;
          paymentStatus: string;
          fulfillmentStatus: string;
          paymentUrl?: string;
          qrCode?: string;
          reservedUntil?: string;
        };
      }>("/public/orders", {
        method: "POST",
        headers: customerToken
          ? { Authorization: `Bearer ${customerToken}` }
          : undefined,
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantKey: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            fullName: fullName.trim(),
            phone: normalizePhoneVN(phone),
            email: email.trim() || undefined,
            province: province.trim(),
            district: district.trim(),
            ward: ward.trim(),
            addressLine: addressLine.trim(),
            note: note.trim() || undefined,
          },
          paymentGateway,
          couponCode: appliedCoupon || undefined,
          selectedGiftProductId: selectedGiftId || undefined,
        }),
      });

      const orderData = res?.data;
      if (orderData?.orderCode) {
        try {
          sessionStorage.setItem(
            "11sport_last_order",
            JSON.stringify(orderData)
          );
          sessionStorage.removeItem("11sport_checkout_prefs");
        } catch {
          // Ignore
        }
        clearCart();
        router.push(
          `/order-success?code=${encodeURIComponent(orderData.orderCode)}`
        );
      } else {
        setErrorMsg("Không nhận được mã đơn hàng từ hệ thống.");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrorMsg(
          err.message ||
            "Một số sản phẩm trong giỏ vừa hết tồn kho. Vui lòng kiểm tra lại số lượng."
        );
      } else if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          "Không thể kết nối máy chủ đặt hàng. Vui lòng thử lại sau."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-24 md:pb-0"
    >
      {/* Left 60%: Delivery & Payment */}
      <div className="lg:col-span-7 space-y-6">
        {!customerToken && (
          <div className="rounded-xl border border-brand-border bg-brand-tint p-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-brand-primary font-medium">
              Đã có tài khoản 11 Sport? Đăng nhập Email OTP để tự điền địa chỉ.
            </span>
            <Link
              href="/tai-khoan"
              className="font-bold text-brand-primary hover:underline"
            >
              Đăng nhập ngay →
            </Link>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-accent-hot/30 bg-semantic-danger-bg text-semantic-danger-text p-4 flex items-start gap-2.5 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Receiver */}
        <section className="rounded-2xl border border-surface-border bg-white p-5 space-y-4">
          <h2 className="text-base font-bold text-ink-primary">
            1. Thông tin người nhận
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Họ và tên <span className="text-accent-hot">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Số điện thoại <span className="text-accent-hot">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhoneVN(e.target.value))}
                placeholder="0901 234 567"
                className="w-full h-11 px-3 rounded-lg border border-surface-border font-mono text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="checkout-email"
              className="block text-sm font-medium text-ink-secondary mb-1"
            >
              Email (nhận thông tin đơn hàng)
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
        </section>

        {/* Section 2: Address */}
        <section className="rounded-2xl border border-surface-border bg-white p-5 space-y-4">
          <h2 className="text-base font-bold text-ink-primary">
            2. Địa chỉ nhận hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="checkout-province"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Tỉnh / Thành <span className="text-accent-hot">*</span>
              </label>
              <input
                id="checkout-province"
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Hồ Chí Minh"
                className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-district"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Quận / Huyện <span className="text-accent-hot">*</span>
              </label>
              <input
                id="checkout-district"
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Quận 1"
                className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-ward"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Phường / Xã <span className="text-accent-hot">*</span>
              </label>
              <input
                id="checkout-ward"
                type="text"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="Phường Bến Thành"
                className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="checkout-address"
              className="block text-sm font-medium text-ink-secondary mb-1"
            >
              Địa chỉ chi tiết (Số nhà, tên đường){" "}
              <span className="text-accent-hot">*</span>
            </label>
            <input
              id="checkout-address"
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="112 Nguyễn Trãi"
              className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-note"
              className="block text-sm font-medium text-ink-secondary mb-1"
            >
              Ghi chú giao hàng
            </label>
            <textarea
              id="checkout-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Giao giờ hành chính, gọi trước khi giao..."
              className="w-full p-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
        </section>

        {/* Section 3: Payment Method */}
        <section className="rounded-2xl border border-surface-border bg-white p-5 space-y-3">
          <h2 className="text-base font-bold text-ink-primary">
            3. Phương thức thanh toán
          </h2>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
              paymentGateway === "PAYOS"
                ? "border-brand-primary bg-brand-tint"
                : "border-surface-border hover:border-brand-primary"
            }`}
          >
            <input
              type="radio"
              name="paymentGateway"
              value="PAYOS"
              checked={paymentGateway === "PAYOS"}
              onChange={() => setPaymentGateway("PAYOS")}
              className="mt-1 text-brand-primary focus:ring-brand-primary"
            />
            <QrCode
              className="w-5 h-5 text-brand-primary shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold text-ink-primary">
                Chuyển khoản QR (PayOS / VietQR)
              </p>
              <p className="text-xs text-ink-secondary mt-0.5">
                Xác nhận tự động trong vài giây, giữ chỗ tồn kho 15 phút.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
              paymentGateway === "COD"
                ? "border-brand-primary bg-brand-tint"
                : "border-surface-border hover:border-brand-primary"
            }`}
          >
            <input
              type="radio"
              name="paymentGateway"
              value="COD"
              checked={paymentGateway === "COD"}
              onChange={() => setPaymentGateway("COD")}
              className="mt-1 text-brand-primary focus:ring-brand-primary"
            />
            <Banknote
              className="w-5 h-5 text-brand-primary shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold text-ink-primary">
                Thanh toán khi nhận hàng (COD)
              </p>
              <p className="text-xs text-ink-secondary mt-0.5">
                Kiểm tra hàng trước khi thanh toán cho đơn vị vận chuyển.
              </p>
            </div>
          </label>
        </section>
      </div>

      {/* Right 40%: Order Summary */}
      <aside className="lg:col-span-5 rounded-2xl border border-surface-border bg-white p-5 space-y-4 lg:sticky lg:top-24">
        <h2 className="text-base font-bold text-ink-primary">
          Tóm tắt đơn hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản
          phẩm)
        </h2>

        <ul className="divide-y divide-surface-border max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.variantId} className="py-3 flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded-lg bg-surface-muted border border-surface-border overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-muted">
                    11S
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-primary line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-ink-muted">
                  {[item.colorName, item.sizeName].filter(Boolean).join(" / ")}{" "}
                  • SL: <span className="font-mono">{item.quantity}</span>
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-ink-primary shrink-0">
                {formatVND(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {eligibleGifts.length > 0 && (
          <div className="rounded-xl border border-brand-border bg-brand-tint p-3 space-y-2">
            <p className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>Quà tặng đơn hàng</span>
            </p>
            {eligibleGifts.map((g) => (
              <label
                key={g.productId}
                className="flex items-center gap-2 text-xs font-medium text-ink-primary cursor-pointer"
              >
                <input
                  type="radio"
                  name="checkout-gift"
                  checked={selectedGiftId === g.productId}
                  onChange={() => setSelectedGiftId(g.productId)}
                  className="text-brand-primary"
                />
                <span>{g.productName}</span>
              </label>
            ))}
          </div>
        )}

        {/* Coupon */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Mã ưu đãi..."
              aria-label="Mã ưu đãi"
              className="w-full h-11 pl-9 pr-3 rounded-lg border border-surface-border font-mono text-sm uppercase focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setAppliedCoupon(couponInput.trim().toUpperCase())}
            className="min-h-[44px] px-4 rounded-lg bg-surface-muted hover:bg-brand-tint hover:text-brand-primary text-sm font-semibold text-ink-primary"
          >
            Áp dụng
          </button>
        </div>

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
            <span>Phí vận chuyển</span>
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
            {formatVND(totalAmount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="hidden md:flex w-full min-h-[48px] items-center justify-center rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Đang xử lý đơn hàng..." : "HOÀN TẤT ĐẶT HÀNG"}
        </button>
      </aside>

      {/* Sticky Mobile Submit Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-surface-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-sticky flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-muted">Tổng thanh toán</p>
          <p className="font-mono text-base font-bold text-accent-hot">
            {formatVND(totalAmount)}
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 min-h-[48px] rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm disabled:opacity-60"
        >
          {submitting ? "Đang xử lý..." : "HOÀN TẤT ĐẶT HÀNG"}
        </button>
      </div>
    </form>
  );
}
