"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import {
  formatPhoneVN,
  formatPriceByCurrency,
  isValidPhoneVN,
  normalizePhoneVN,
} from "@/lib/format";
import {
  localizeApiMessage,
  localizeColorName,
  localizeCouponName,
  localizeGiftTitle,
  localizeHref,
  localizeProductName,
  localizeSizeLabel,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { calculatePerVariantCartPricing } from "@/lib/pricingAndSearch";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type {
  CartPriceResponse,
  CustomerProfile,
} from "@/types/storefront";

const CUSTOMER_TOKEN_KEY = "11sport_customer_token";

const SHARP_INPUT_CLS =
  "w-full min-h-[44px] px-3 py-2 rounded-none border border-[#dddddd] bg-white text-base sm:text-[14px] text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#224e40]";
const SHARP_INPUT_ERROR_CLS =
  "w-full min-h-[44px] px-3 py-2 rounded-none border border-[#dd3333] bg-white text-base sm:text-[14px] text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#dd3333]";
const LABEL_CLS = "block text-[13px] font-bold text-[#222222] mb-1.5";

type CheckoutFieldKey =
  | "name"
  | "phone"
  | "address"
  | "province"
  | "altName"
  | "altAddress";

function focusInvalidField(el: HTMLInputElement | null) {
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const commerce = getCommerceI18n(locale);
  const t = commerce.checkout;
  const tCart = commerce.cart;

  const isCancelled =
    searchParams.get("cancelled") === "1" ||
    searchParams.get("cancel") === "true";
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const currency = useCurrencyStore((s) => s.currency);

  const [mounted, setMounted] = useState(false);
  const [customerToken, setCustomerToken] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactExtra, setContactExtra] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [province, setProvince] = useState(() => t.defaultProvince);
  const [district, setDistrict] = useState("");
  const [note, setNote] = useState("");

  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [altFullName, setAltFullName] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [altAddress, setAltAddress] = useState("");

  const [paymentGateway, setPaymentGateway] = useState<"PAYOS" | "COD">(
    "PAYOS"
  );

  const [showCouponBox, setShowCouponBox] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [pricing, setPricing] = useState<CartPriceResponse | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<CheckoutFieldKey | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const provinceRef = useRef<HTMLInputElement>(null);
  const altNameRef = useRef<HTMLInputElement>(null);
  const altAddressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProvince((prev) => {
      if (locale === "en" && prev === "TP. Hồ Chí Minh") {
        return "Ho Chi Minh City";
      }
      if (locale === "vi" && prev === "Ho Chi Minh City") {
        return "TP. Hồ Chí Minh";
      }
      return prev;
    });
  }, [locale]);

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
          setShowCouponBox(true);
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
              setPhone(
                (prev) =>
                  prev || formatPhoneVN(defaultAddr.phone || c.phone || "")
              );
              setContactExtra((prev) => prev || c.email || "");
              setProvince((prev) => defaultAddr.province || prev);
              setDistrict((prev) => prev || defaultAddr.district || "");
              setAddressLine((prev) => prev || defaultAddr.addressLine || "");
            } else {
              setFullName((prev) => prev || c.name || "");
              setPhone((prev) => prev || formatPhoneVN(c.phone || ""));
              setContactExtra((prev) => prev || c.email || "");
            }
          })
          .catch(() => {
            // Token expired or unavailable
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
    return <div className="h-80 bg-[#f8f9f5] animate-pulse" />;
  }

  // Empty Cart 1:1 mipik.vn
  if (items.length === 0) {
    return (
      <div className="py-14 sm:py-20 px-4 text-center space-y-5 bg-white">
        <p className="text-[15px] text-[#333333]">{tCart.emptyText}</p>
        <Link
          href={localizeHref("/vot-pickleball", locale)}
          className="inline-flex items-center justify-center min-h-[44px] px-7 rounded-none bg-store-forest hover:bg-store-forest-hover text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
        >
          {tCart.backToShop}
        </Link>
      </div>
    );
  }

  const localSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const localPricing = calculatePerVariantCartPricing(
    items.map((i) => ({
      productId: i.productId,
      variantKey: i.variantId,
      quantity: i.quantity,
      regularPrice: i.price,
      bulkTiers:
        i.price > 500_000
          ? [
              {
                minQty: 3,
                unitPrice: Math.max(0, i.price - 100_000),
                label: tCart.bulkTierLabel(3),
              },
              {
                minQty: 5,
                unitPrice: Math.max(0, i.price - 200_000),
                label: tCart.bulkTierLabel(5),
              },
            ]
          : [],
    }))
  );

  const rawSubtotal = pricing?.rawSubtotal ?? localSubtotal;
  const tierDiscountTotal =
    pricing?.tierDiscountTotal ?? localPricing.bulkDiscountSaved;
  const couponDiscount = pricing?.couponDiscount ?? 0;
  const shippingFee = pricing?.shippingFee ?? 0;
  const totalAmount =
    pricing?.totalAmount ??
    Math.max(0, rawSubtotal - tierDiscountTotal - couponDiscount + shippingFee);
  const eligibleGifts =
    pricing?.eligibleGifts ??
    (localPricing.unlockedGift
      ? [
          {
            productId: `local-gift-${localPricing.unlockedGift.minQty}`,
            productName: localPricing.unlockedGift.rewardTitle,
            quantity: 1,
          },
        ]
      : []);
  const activeGift =
    eligibleGifts.find((g) => g.productId === selectedGiftId) ||
    eligibleGifts[0] ||
    null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMsg(null);
    setFieldError(null);
    if (!fullName.trim()) {
      setFieldError("name");
      setErrorMsg(t.errNameRequired);
      focusInvalidField(nameRef.current);
      return;
    }
    if (!isValidPhoneVN(phone)) {
      setFieldError("phone");
      setErrorMsg(t.errPhoneInvalid);
      focusInvalidField(phoneRef.current);
      return;
    }
    if (!addressLine.trim()) {
      setFieldError("address");
      setErrorMsg(t.errAddressRequired);
      focusInvalidField(addressRef.current);
      return;
    }
    if (!province.trim()) {
      setFieldError("province");
      setErrorMsg(t.errProvinceRequired);
      focusInvalidField(provinceRef.current);
      return;
    }
    if (shipToDifferent && !altFullName.trim()) {
      setFieldError("altName");
      setErrorMsg(t.errAltNameRequired);
      focusInvalidField(altNameRef.current);
      return;
    }
    if (shipToDifferent && !altAddress.trim()) {
      setFieldError("altAddress");
      setErrorMsg(t.errAltAddressRequired);
      focusInvalidField(altAddressRef.current);
      return;
    }

    const trimmedContact = contactExtra.trim();
    const emailValue = trimmedContact.includes("@")
      ? trimmedContact
      : undefined;
    const noteParts = [
      note.trim(),
      trimmedContact && !trimmedContact.includes("@")
        ? `WhatsApp/Zalo: ${trimmedContact}`
        : "",
      shipToDifferent && altPhone.trim()
        ? `${t.altPhoneNotePrefix}: ${altPhone.trim()}`
        : "",
    ].filter(Boolean);

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
            fullName:
              shipToDifferent && altFullName.trim()
                ? altFullName.trim()
                : fullName.trim(),
            phone:
              shipToDifferent && isValidPhoneVN(altPhone)
                ? normalizePhoneVN(altPhone)
                : normalizePhoneVN(phone),
            email: emailValue,
            province: province.trim(),
            district: district.trim() || t.defaultDistrictFallback,
            ward: t.defaultWardFallback,
            addressLine:
              shipToDifferent && altAddress.trim()
                ? altAddress.trim()
                : addressLine.trim(),
            note: noteParts.length > 0 ? noteParts.join(" | ") : undefined,
          },
          paymentGateway,
          couponCode: appliedCoupon || undefined,
          selectedGiftProductId:
            selectedGiftId &&
            pricing?.eligibleGifts?.some((g) => g.productId === selectedGiftId)
              ? selectedGiftId
              : undefined,
        }),
      });

      const orderData = res?.data;
      if (orderData?.orderCode) {
        let finalPaymentUrl = orderData.paymentUrl || "";
        let finalQrCode = orderData.qrCode || "";

        // Nếu chọn thanh toán PAYOS:
        // Đảm bảo luôn tạo Link và Mã QR PayOS THẬT từ máy chủ PayOS (kể cả khi FE đang mock dữ liệu sản phẩm)
        // để người dùng có thể demo quét mã QR thực tế 100% cho khách hàng xem
        if (paymentGateway === "PAYOS") {
          try {
            const payosRes = await fetch("/api/payos/create-payment-link", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCode: orderData.orderCode,
                amount: orderData.totalAmount || pricing?.totalAmount || 50000,
                description: `11S ${orderData.orderCode}`.slice(0, 25),
              }),
            });
            const payosJson = await payosRes.json();
            if (payosJson.success && payosJson.data?.checkoutUrl) {
              finalPaymentUrl = payosJson.data.checkoutUrl;
              finalQrCode = payosJson.data.qrCode;
            }
          } catch (payosErr) {
            console.error("Lỗi khi kết nối cổng thanh toán PayOS:", payosErr);
          }
        }

        const finalOrderData = {
          ...orderData,
          paymentUrl: finalPaymentUrl,
          qrCode: finalQrCode,
        };

        try {
          sessionStorage.setItem(
            "11sport_last_order",
            JSON.stringify(finalOrderData)
          );
          sessionStorage.removeItem("11sport_checkout_prefs");
        } catch {
          // Ignore
        }

        // Nếu có link thanh toán thật từ PayOS, chuyển hướng ngay sang cổng PayOS
        // QUAN TRỌNG: KHÔNG gọi clearCart() tại đây!
        // Giữ nguyên toàn bộ sản phẩm trong giỏ hàng để nếu khách bấm "Hủy" trên PayOS và quay về,
        // sản phẩm vẫn còn nguyên. Chỉ xóa giỏ hàng khi đơn hàng thanh toán thành công (hoặc COD).
        if (
          paymentGateway === "PAYOS" &&
          finalPaymentUrl &&
          finalPaymentUrl.startsWith("http")
        ) {
          window.location.href = finalPaymentUrl;
          return;
        }

        // Nếu là COD hoặc đơn hoàn tất tại shop: dọn sạch giỏ hàng và sang trang kết quả
        clearCart();
        router.push(
          localizeHref(
            `/thanh-toan/order-received/${encodeURIComponent(orderData.orderCode)}`,
            locale
          )
        );
      } else {
        setErrorMsg(t.errNoOrderCode);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(localizeApiMessage(err.message, locale));
      } else {
        setErrorMsg(t.errServerConnection);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner thông báo khi khách bấm Hủy thanh toán từ PayOS */}
      {isCancelled && (
        <div
          role="status"
          className="border border-[#f59e0b] bg-[#fffbeb] p-4 text-[#92400e] flex items-start gap-3"
        >
          <AlertCircle
            className="w-5 h-5 shrink-0 text-[#d97706] mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="font-bold text-[14px]">{t.payosCancelTitle}</p>
            <p className="text-[13px] text-[#b45309]">{t.payosCancelBody}</p>
          </div>
        </div>
      )}

      {/* Top 1-Line Coupon Toggle (1:1 mipik.vn) */}
      <div className="border-b border-[#ececec] pb-4 text-[13.5px]">
        <p className="text-[#333333]">
          {t.haveCouponQuestion}{" "}
          <button
            type="button"
            onClick={() => setShowCouponBox((prev) => !prev)}
            className="text-[#224e40] hover:underline font-medium"
          >
            {t.clickToEnterCoupon}
          </button>
        </p>

        {showCouponBox && (
          <div className="mt-3 p-4 sm:p-5 border-2 border-dashed border-[#dddddd] bg-white space-y-3 max-w-xl">
            <p className="text-[13px] text-[#555555]">{t.couponHint}</p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setAppliedCoupon(couponInput.trim().toUpperCase());
                  }
                }}
                placeholder={t.couponPlaceholder}
                aria-label={t.couponAriaLabel}
                className={`${SHARP_INPUT_CLS} sm:flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  setAppliedCoupon(couponInput.trim().toUpperCase())
                }
                className="min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[12.5px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
              >
                {t.applyBtnUpper}
              </button>
            </div>
            {pricing?.couponError && (
              <p className="text-xs text-[#dd3333] font-medium">
                {localizeApiMessage(pricing.couponError, locale)}
              </p>
            )}
            {pricing?.couponApplied && (
              <p className="text-xs text-[#204b3e] font-bold">
                {tCart.couponAppliedPrefix(
                  pricing.couponApplied.code,
                  localizeCouponName(pricing.couponApplied.name, locale)
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main 7:5 Checkout Form */}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT 7 COLS: Flat Clean White Billing & Shipping Form */}
        <div className="lg:col-span-7 space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="border border-[#dd3333]/35 bg-[#fef2f2] text-[#b91c1c] p-3.5 flex items-start gap-2.5 text-[13.5px] font-medium"
            >
              <AlertCircle
                className="w-4 h-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-[16px] sm:text-[17px] font-bold uppercase tracking-wide text-[#0a0a0a]">
              {t.billingHeading}
            </h2>

            <div>
              <label htmlFor="checkout-name" className={LABEL_CLS}>
                {t.fullNameLabel} <span className="text-[#dd3333]">*</span>
              </label>
              <input
                ref={nameRef}
                id="checkout-name"
                type="text"
                required
                aria-invalid={fieldError === "name"}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldError === "name") setFieldError(null);
                }}
                placeholder={t.fullNamePlaceholder}
                className={
                  fieldError === "name" ? SHARP_INPUT_ERROR_CLS : SHARP_INPUT_CLS
                }
              />
            </div>

            <div>
              <label htmlFor="checkout-phone" className={LABEL_CLS}>
                {t.phoneLabel} <span className="text-[#dd3333]">*</span>
              </label>
              <input
                ref={phoneRef}
                id="checkout-phone"
                type="tel"
                required
                aria-invalid={fieldError === "phone"}
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneVN(e.target.value));
                  if (fieldError === "phone") setFieldError(null);
                }}
                placeholder={t.phonePlaceholder}
                className={`${
                  fieldError === "phone"
                    ? SHARP_INPUT_ERROR_CLS
                    : SHARP_INPUT_CLS
                } tabular-nums`}
              />
            </div>

            <div>
              <label htmlFor="checkout-contact" className={LABEL_CLS}>
                {t.contactExtraLabel}
              </label>
              <input
                id="checkout-contact"
                type="text"
                value={contactExtra}
                onChange={(e) => setContactExtra(e.target.value)}
                placeholder={t.contactExtraPlaceholder}
                className={SHARP_INPUT_CLS}
              />
            </div>

            <div>
              <label htmlFor="checkout-address" className={LABEL_CLS}>
                {t.addressLabel} <span className="text-[#dd3333]">*</span>
              </label>
              <input
                ref={addressRef}
                id="checkout-address"
                type="text"
                required
                aria-invalid={fieldError === "address"}
                value={addressLine}
                onChange={(e) => {
                  setAddressLine(e.target.value);
                  if (fieldError === "address") setFieldError(null);
                }}
                placeholder={t.addressPlaceholder}
                className={
                  fieldError === "address"
                    ? SHARP_INPUT_ERROR_CLS
                    : SHARP_INPUT_CLS
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-province" className={LABEL_CLS}>
                  {t.provinceLabel} <span className="text-[#dd3333]">*</span>
                </label>
                <input
                  ref={provinceRef}
                  id="checkout-province"
                  type="text"
                  required
                  aria-invalid={fieldError === "province"}
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    if (fieldError === "province") setFieldError(null);
                  }}
                  placeholder={t.provincePlaceholder}
                  className={
                    fieldError === "province"
                      ? SHARP_INPUT_ERROR_CLS
                      : SHARP_INPUT_CLS
                  }
                />
              </div>

              <div>
                <label htmlFor="checkout-district" className={LABEL_CLS}>
                  {t.districtLabel}
                </label>
                <input
                  id="checkout-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t.districtPlaceholder}
                  className={SHARP_INPUT_CLS}
                />
              </div>
            </div>

            {/* Ship to different address checkbox */}
            <div className="pt-1">
              <label className="inline-flex items-center gap-2.5 min-h-[44px] text-[14px] text-[#333333] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={shipToDifferent}
                  onChange={(e) => setShipToDifferent(e.target.checked)}
                  className="w-4 h-4 accent-[#224e40]"
                />
                <span>{t.shipToDifferentLabel}</span>
              </label>

              {shipToDifferent && (
                <div className="mt-3 p-4 border border-[#ececec] bg-[#fafafa] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="alt-name" className={LABEL_CLS}>
                        {t.altNameLabel}{" "}
                        <span className="text-[#dd3333]">*</span>
                      </label>
                      <input
                        ref={altNameRef}
                        id="alt-name"
                        type="text"
                        aria-invalid={fieldError === "altName"}
                        value={altFullName}
                        onChange={(e) => {
                          setAltFullName(e.target.value);
                          if (fieldError === "altName") setFieldError(null);
                        }}
                        placeholder={t.altNamePlaceholder}
                        className={
                          fieldError === "altName"
                            ? SHARP_INPUT_ERROR_CLS
                            : SHARP_INPUT_CLS
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="alt-phone" className={LABEL_CLS}>
                        {t.altPhoneLabel}
                      </label>
                      <input
                        id="alt-phone"
                        type="tel"
                        value={altPhone}
                        onChange={(e) =>
                          setAltPhone(formatPhoneVN(e.target.value))
                        }
                        placeholder={t.altPhonePlaceholder}
                        className={`${SHARP_INPUT_CLS} tabular-nums`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="alt-address" className={LABEL_CLS}>
                      {t.altAddressLabel}{" "}
                      <span className="text-[#dd3333]">*</span>
                    </label>
                    <input
                      ref={altAddressRef}
                      id="alt-address"
                      type="text"
                      aria-invalid={fieldError === "altAddress"}
                      value={altAddress}
                      onChange={(e) => {
                        setAltAddress(e.target.value);
                        if (fieldError === "altAddress") setFieldError(null);
                      }}
                      placeholder={t.altAddressPlaceholder}
                      className={
                        fieldError === "altAddress"
                          ? SHARP_INPUT_ERROR_CLS
                          : SHARP_INPUT_CLS
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <h2 className="text-[16px] sm:text-[17px] font-bold uppercase tracking-wide text-[#0a0a0a]">
              {t.additionalInfoHeading}
            </h2>
            <div>
              <label htmlFor="checkout-note" className={LABEL_CLS}>
                {t.orderNoteLabel}
              </label>
              <textarea
                id="checkout-note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.orderNotePlaceholder}
                className="w-full p-3 rounded-none border border-[#dddddd] bg-white text-base sm:text-[14px] text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#224e40]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: Flatsome `.is-well` Order Review & Payment Card */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-[#fafafa] border border-[#e5e5e5] shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 sm:p-7 rounded-none space-y-4">
          <h2 className="text-[16px] sm:text-[17px] font-bold uppercase tracking-wide text-[#0a0a0a]">
            {t.yourOrderHeading}
          </h2>

          {/* Concise Text-Only Review Table */}
          <div className="text-[13.5px]">
            <div className="flex items-center justify-between pb-2.5 border-b-[3px] border-[#ececec] text-[12px] font-bold uppercase tracking-wider text-[#777777]">
              <span>{tCart.colProduct}</span>
              <span>{tCart.colSubtotal}</span>
            </div>

            <div className="divide-y divide-[#ececec]">
              {items.map((item) => {
                const lineCalc = localPricing.lines.find(
                  (l) =>
                    l.productId === item.productId &&
                    l.variantKey === item.variantId
                );
                const lineSubtotal =
                  lineCalc?.lineSubtotal ?? item.price * item.quantity;
                const displayName = localizeProductName(
                  item.name,
                  locale,
                  item.slug
                );
                const variantLabel = [
                  localizeColorName(item.colorName, locale),
                  localizeSizeLabel(item.sizeName, locale),
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <div
                    key={item.variantId}
                    className="py-3 flex items-baseline justify-between gap-3"
                  >
                    <span className="text-[#555555] leading-snug">
                      {displayName}
                      {variantLabel ? ` (${variantLabel})` : ""}{" "}
                      <strong className="text-[#0a0a0a]">
                        × {item.quantity}
                      </strong>
                    </span>
                    <span className="font-bold text-[#0a0a0a] tabular-nums whitespace-nowrap shrink-0">
                      {formatPriceByCurrency(
                        lineSubtotal,
                        mounted ? currency : "VND"
                      )}
                    </span>
                  </div>
                );
              })}

              {activeGift && (
                <div className="py-3 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[#204b3e] leading-snug">
                      <span>
                        {localizeGiftTitle(activeGift.productName, locale)}
                      </span>{" "}
                      <strong className="text-[#0a0a0a]">× 1</strong>
                      <p className="text-[11.5px] text-[#4a6b5d]">
                        {tCart.giftSubtitle}
                      </p>
                    </div>
                    <span className="font-bold text-[#0a0a0a] tabular-nums shrink-0">
                      {formatPriceByCurrency(0, mounted ? currency : "VND")}
                    </span>
                  </div>

                  {eligibleGifts.length > 1 && (
                    <div className="pt-1 space-y-1">
                      {eligibleGifts.map((g) => (
                        <label
                          key={g.productId}
                          className="flex items-center gap-2 text-xs text-[#204b3e] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="checkout-gift"
                            checked={selectedGiftId === g.productId}
                            onChange={() => setSelectedGiftId(g.productId)}
                            className="accent-[#224e40]"
                          />
                          <span>
                            {localizeGiftTitle(g.productName, locale)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="py-3 flex items-center justify-between gap-3">
                <span className="font-semibold text-[#333333]">
                  {tCart.subtotal}
                </span>
                <span className="font-bold text-[#0a0a0a] tabular-nums">
                  {formatPriceByCurrency(
                    rawSubtotal,
                    mounted ? currency : "VND"
                  )}
                </span>
              </div>

              {tierDiscountTotal > 0 && (
                <div className="py-3 flex items-center justify-between gap-3 text-[#204b3e]">
                  <span>{tCart.bulkSavings}</span>
                  <span className="font-bold tabular-nums">
                    -
                    {formatPriceByCurrency(
                      tierDiscountTotal,
                      mounted ? currency : "VND"
                    )}
                  </span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="py-3 flex items-center justify-between gap-3 text-[#204b3e]">
                  <span>{tCart.promoCode}</span>
                  <span className="font-bold tabular-nums">
                    -
                    {formatPriceByCurrency(
                      couponDiscount,
                      mounted ? currency : "VND"
                    )}
                  </span>
                </div>
              )}

              <div className="py-3 flex items-center justify-between gap-3">
                <span className="font-semibold text-[#333333]">
                  {tCart.shipping}
                </span>
                <span className="text-[#555555] text-right">
                  {shippingFee === 0
                    ? tCart.freeShipping
                    : formatPriceByCurrency(
                        shippingFee,
                        mounted ? currency : "VND"
                      )}
                </span>
              </div>

              <div className="py-3.5 border-b-2 border-[#ececec] flex items-center justify-between gap-3">
                <span className="font-bold text-[#0a0a0a]">{tCart.total}</span>
                <span className="text-[16px] font-bold text-[#0a0a0a] tabular-nums">
                  {formatPriceByCurrency(
                    totalAmount,
                    mounted ? currency : "VND"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods List INSIDE Order Summary Box (1:1 mipik.vn) */}
          <ul className="divide-y divide-[#ececec] text-[13.5px]">
            <li className="py-3 space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentGateway"
                  value="PAYOS"
                  checked={paymentGateway === "PAYOS"}
                  onChange={() => setPaymentGateway("PAYOS")}
                  className="mt-1 accent-[#224e40]"
                />
                <span className="font-bold text-[#0a0a0a] leading-snug">
                  {t.payosTitle}
                </span>
              </label>
              {paymentGateway === "PAYOS" && (
                <p className="pl-6 text-[12.5px] text-[#555555] leading-relaxed">
                  {t.payosDesc}
                </p>
              )}
            </li>

            <li className="py-3 space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentGateway"
                  value="COD"
                  checked={paymentGateway === "COD"}
                  onChange={() => setPaymentGateway("COD")}
                  className="mt-1 accent-[#224e40]"
                />
                <span className="font-bold text-[#0a0a0a] leading-snug">
                  {t.codTitle}
                </span>
              </label>
              {paymentGateway === "COD" && (
                <p className="pl-6 text-[12.5px] text-[#555555] leading-relaxed">
                  {t.codDesc}
                </p>
              )}
            </li>
          </ul>

          {/* Full-width Sharp #224e40 Place Order CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[46px] rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13.5px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
          >
            {submitting ? t.submittingBtn : t.placeOrderBtn}
          </button>

          <p className="text-[12.5px] text-[#555555] leading-relaxed">
            {t.supportNote}
          </p>
        </aside>
      </form>
    </div>
  );
}
