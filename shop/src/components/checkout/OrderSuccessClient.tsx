"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Home,
  QrCode,
  Search,
  XCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatPriceByCurrency } from "@/lib/format";
import {
  formatDateByLocale,
  localizeHref,
  localizePaymentGateway,
  localizePaymentStatus,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";

interface StoredOrder {
  orderCode: string;
  totalAmount?: number;
  paymentGateway?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  paymentUrl?: string;
  qrCode?: string;
  reservedUntil?: string;
}

export interface OrderSuccessClientProps {
  initialOrderCode?: string;
}

function formatCountdown(secondsLeft: number): string {
  const mins = Math.floor(Math.max(0, secondsLeft) / 60);
  const secs = Math.max(0, secondsLeft) % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function OrderSuccessClient({
  initialOrderCode = "",
}: OrderSuccessClientProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = getCommerceI18n(locale).orderSuccess;
  const currency = useCurrencyStore((s) => s.currency);
  const codeFromQuery = searchParams.get("code") || initialOrderCode || "";

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<StoredOrder | null>(
    codeFromQuery ? { orderCode: codeFromQuery } : null
  );
  const [paymentStatus, setPaymentStatus] = useState<string>("UNPAID");
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [copied, setCopied] = useState(false);
  const [orderDateStr, setOrderDateStr] = useState<string>("");

  const activeCurrency = mounted ? currency : "VND";
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    setOrderDateStr(formatDateByLocale(new Date(), locale));
  }, [locale]);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = sessionStorage.getItem("11sport_last_order");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder;
        if (!codeFromQuery || parsed.orderCode === codeFromQuery) {
          setOrder(parsed);
          setPaymentStatus(parsed.paymentStatus || "UNPAID");
          if (parsed.reservedUntil) {
            const diff = Math.max(
              0,
              Math.floor(
                (new Date(parsed.reservedUntil).getTime() - Date.now()) / 1000
              )
            );
            setSecondsLeft(diff);
          }
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }

    if (codeFromQuery) {
      setOrder({ orderCode: codeFromQuery });
    }
  }, [codeFromQuery]);

  const orderCode = order?.orderCode || codeFromQuery;
  const isQrPayment =
    order?.paymentGateway === "PAYOS" || order?.paymentGateway === "VIETQR";

  // Dọn sạch giỏ hàng khi đơn hàng đã thực sự thanh toán thành công (PAID) hoặc là đơn COD
  useEffect(() => {
    if (paymentStatus === "PAID" || (!isQrPayment && orderCode)) {
      clearCart();
    }
  }, [paymentStatus, isQrPayment, orderCode, clearCart]);

  // Countdown 15:00
  useEffect(() => {
    if (
      !isQrPayment ||
      paymentStatus === "PAID" ||
      paymentStatus === "EXPIRED"
    ) {
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPaymentStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isQrPayment, paymentStatus]);

  // Poll GET /api/v1/public/orders/:code/payment-status every 3s
  useEffect(() => {
    if (
      !orderCode ||
      !isQrPayment ||
      paymentStatus === "PAID" ||
      paymentStatus === "EXPIRED"
    ) {
      return;
    }

    const poll = async () => {
      try {
        const res = await apiFetch<{
          data: {
            orderCode: string;
            paymentStatus: string;
            fulfillmentStatus: string;
            reservedUntil?: string;
          };
        }>(`/public/orders/${encodeURIComponent(orderCode)}/payment-status`);

        if (res?.data?.paymentStatus) {
          setPaymentStatus(res.data.paymentStatus);
          if (res.data.paymentStatus === "PAID") {
            clearCart();
            try {
              const current = sessionStorage.getItem("11sport_last_order");
              if (current) {
                const parsed = JSON.parse(current);
                sessionStorage.setItem(
                  "11sport_last_order",
                  JSON.stringify({ ...parsed, paymentStatus: "PAID" })
                );
              }
            } catch {
              // Ignore
            }
          }
        }
      } catch {
        // Keep polling on transient network errors
      }
    };

    // Kiểm tra ngay lần đầu nếu có tham số từ redirect PayOS
    if (searchParams.get("status") === "PAID") {
      poll();
    }

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [orderCode, isQrPayment, paymentStatus, searchParams, clearCart]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const accountHref = localizeHref("/tai-khoan", locale);
  const paddlesHref = localizeHref("/vot-pickleball", locale);
  const cartHref = localizeHref("/gio-hang", locale);
  const homeHref = localizeHref("/", locale);

  if (!orderCode) {
    return (
      <div className="max-w-2xl mx-auto border border-[#dce5da] bg-[#f8f9f5] p-8 text-center space-y-4">
        <h1 className="text-[22px] font-bold text-[#0a0a0a]">
          {t.notFoundHeading}
        </h1>
        <p className="text-[14px] text-[#555555]">{t.notFoundDesc}</p>
        <Link
          href={accountHref}
          className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
        >
          {t.trackOrderBtn}
        </Link>
      </div>
    );
  }

  const paymentSummary = isQrPayment
    ? `${localizePaymentGateway(
        order?.paymentGateway || "PAYOS",
        locale
      )} · ${localizePaymentStatus(paymentStatus, locale)}`
    : order?.paymentGateway && order.paymentGateway !== "COD"
    ? localizePaymentGateway(order.paymentGateway, locale)
    : `${localizePaymentGateway("COD", locale)} · ${t.codOpenBoxSuffix}`;

  const overviewCells = [
    { label: t.cellOrderCode, value: `#${orderCode}` },
    { label: t.cellDate, value: orderDateStr || t.today },
    {
      label: t.cellTotal,
      value:
        typeof order?.totalAmount === "number"
          ? formatPriceByCurrency(order.totalAmount, activeCurrency)
          : t.recorded,
    },
    {
      label: t.cellPayment,
      value: paymentSummary,
    },
  ];

  // QR Waiting State
  if (isQrPayment && paymentStatus === "UNPAID") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-dashed border-[#224e40] bg-[#f8f9f5] p-5 sm:p-6 flex items-center gap-3 text-[#204b3e]">
          <Clock className="w-6 h-6 shrink-0" aria-hidden="true" />
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold">
              {t.qrHeading(orderCode)}
            </h1>
            <p className="text-[13.5px] text-[#4a6b5d] mt-0.5">
              {t.qrSubheading}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1.12fr_0.88fr] sm:grid-cols-[1.45fr_0.85fr_1fr_1.15fr] gap-2.5 sm:gap-3">
          {overviewCells.map((cell) => (
            <div
              key={cell.label}
              className="min-w-0 border border-[#dce5da] bg-white p-2.5 sm:p-3.5 space-y-1"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                {cell.label}
              </p>
              <p className="text-[11.5px] sm:text-[13px] font-bold text-[#0a0a0a] tabular-nums tracking-tight break-words leading-snug">
                {cell.value}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-[#dce5da] bg-white p-6 sm:p-8 text-center space-y-5">
          <div className="inline-flex flex-col items-center border border-[#dd3333]/25 bg-[#fef2f2] px-5 py-3">
            <span className="text-xs font-semibold text-[#555555]">
              {t.reserveCountdownLabel}
            </span>
            <span className="text-[28px] font-bold text-[#dd3333] tabular-nums mt-0.5">
              {formatCountdown(secondsLeft)}
            </span>
          </div>

          <div className="mx-auto w-56 h-56 border border-[#dce5da] bg-[#f8f9f5] flex flex-col items-center justify-center p-3 gap-2">
            {order?.qrCode &&
            (order.qrCode.startsWith("http") ||
              order.qrCode.startsWith("data:image")) ? (
              <img
                src={order.qrCode}
                alt={t.qrAlt(orderCode)}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <>
                <QrCode
                  className="w-24 h-24 text-[#224e40]"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium text-[#204b3e]">{t.qrReady}</p>
              </>
            )}
          </div>

          {order?.paymentUrl && (
            <div>
              <a
                href={order.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
              >
                <span>{t.openPayosBtn}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}

          <div className="border border-[#ececec] bg-[#fafafa] p-4 text-left space-y-2 text-[13.5px] max-w-lg mx-auto">
            {typeof order?.totalAmount === "number" && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#555555]">{t.transferAmountLabel}</span>
                <span className="font-bold text-[#dd3333] text-base tabular-nums">
                  {formatPriceByCurrency(order.totalAmount, activeCurrency)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#555555]">{t.transferNoteLabel}</span>
              <div className="inline-flex items-center gap-2">
                <span className="font-mono font-bold text-[#0a0a0a]">
                  {orderCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(orderCode)}
                  aria-label={t.copyAriaLabel}
                  className="inline-flex items-center gap-1 px-2.5 h-8 border border-[#dddddd] bg-white text-xs font-semibold text-[#0a0a0a] hover:border-[#224e40]"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{copied ? t.copied : t.copy}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={paddlesHref}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
            >
              <span>{t.continueShoppingBtn}</span>
            </Link>
            <Link
              href={accountHref}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-none border border-[#224e40] text-[#224e40] hover:bg-[#f8f9f5] text-[13px] font-bold uppercase tracking-wider transition-colors"
            >
              <span>{t.trackOrderBtn}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Expired State
  if (isQrPayment && paymentStatus === "EXPIRED") {
    return (
      <div className="max-w-2xl mx-auto border border-[#dd3333]/30 bg-white p-6 sm:p-8 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#fef2f2] text-[#dd3333] flex items-center justify-center">
          <XCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-[22px] font-bold text-[#0a0a0a]">
          {t.expiredHeading}
        </h1>
        <p className="text-[14px] text-[#555555]">
          {t.expiredDescPrefix}{" "}
          <strong className="font-mono">{orderCode}</strong>{" "}
          {t.expiredDescSuffix}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={cartHref}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider"
          >
            {t.reorderBtn}
          </Link>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-none border border-[#dddddd] text-[#0a0a0a] text-[13px] font-bold uppercase tracking-wider"
          >
            {t.backHomeBtn}
          </Link>
        </div>
      </div>
    );
  }

  // Paid or COD Success State
  return (
    <div className="max-w-3xl mx-auto border border-[#dce5da] bg-[#f8f9f5] p-4 sm:p-8 space-y-6">
      <div className="flex items-start gap-3 p-4 border border-[#dce5da] bg-white text-[#204b3e]">
        <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h1 className="text-[18px] sm:text-[21px] font-bold leading-snug">
            {paymentStatus === "PAID"
              ? t.paidHeading(orderCode)
              : t.receivedHeading(orderCode)}
          </h1>
          <p className="text-[13.5px] text-[#4a6b5d] mt-1">
            {t.successSubheading}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1.12fr_0.88fr] sm:grid-cols-[1.45fr_0.85fr_1fr_1.15fr] gap-2.5 sm:gap-3">
        {overviewCells.map((cell) => (
          <div
            key={cell.label}
            className="min-w-0 bg-white border border-[#dce5da] p-2.5 sm:p-3.5 space-y-1"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
              {cell.label}
            </p>
            <p className="text-[11.5px] sm:text-[13px] font-bold text-[#0a0a0a] tabular-nums tracking-tight break-words leading-snug">
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[13.5px] text-[#333333] leading-relaxed">
        {t.perksNote}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href={paddlesHref}
          className="min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>{t.continueShoppingBtn}</span>
        </Link>
        <Link
          href={accountHref}
          className="min-h-[44px] px-6 rounded-none border border-[#224e40] bg-white hover:bg-[#f2f5f2] text-[#224e40] text-[13px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>{t.trackOrderBtn}</span>
        </Link>
      </div>
    </div>
  );
}
