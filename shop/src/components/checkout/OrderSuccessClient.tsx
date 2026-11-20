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
import { formatVND } from "@/lib/format";

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

function formatCountdown(secondsLeft: number): string {
  const mins = Math.floor(Math.max(0, secondsLeft) / 60);
  const secs = Math.max(0, secondsLeft) % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const codeFromQuery = searchParams.get("code") || "";

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("UNPAID");
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
      // Ignore
    }

    if (codeFromQuery) {
      setOrder({ orderCode: codeFromQuery });
    }
  }, [codeFromQuery]);

  const orderCode = order?.orderCode || codeFromQuery;
  const isQrPayment =
    order?.paymentGateway === "PAYOS" || order?.paymentGateway === "VIETQR";

  // Countdown 15:00
  useEffect(() => {
    if (!isQrPayment || paymentStatus === "PAID" || paymentStatus === "EXPIRED") {
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

  // Poll GET /api/v1/public/orders/:code/payment-status every 5s
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
        }
      } catch {
        // Keep polling on transient network errors
      }
    };

    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [orderCode, isQrPayment, paymentStatus]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!orderCode) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-subtle p-8 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-ink-primary">
          Không tìm thấy mã đơn hàng
        </h1>
        <p className="text-sm text-ink-secondary">
          Bạn có thể tra cứu trạng thái đơn hàng bằng mã đơn và số điện thoại.
        </p>
        <Link
          href="/tai-khoan"
          className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-brand-primary text-white text-sm font-semibold"
        >
          Tra cứu đơn hàng
        </Link>
      </div>
    );
  }

  // QR Waiting State
  if (isQrPayment && paymentStatus === "UNPAID") {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-surface-border bg-white p-6 sm:p-8 shadow-card space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-semantic-warning-bg text-semantic-warning-text text-xs font-bold">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>Đang chờ thanh toán VietQR / PayOS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
          Quét mã QR để hoàn tất đơn hàng
        </h1>

        <p className="text-sm text-ink-secondary">
          Mã đơn hàng:{" "}
          <strong className="font-mono text-ink-primary">{orderCode}</strong>
        </p>

        {/* Countdown 15:00 */}
        <div className="rounded-xl bg-accent-hot-tint border border-accent-hot/20 p-4 inline-flex flex-col items-center">
          <span className="text-xs font-semibold text-ink-secondary">
            Thời gian giữ chỗ tồn kho còn lại
          </span>
          <span className="font-mono text-3xl font-extrabold text-accent-hot mt-1">
            {formatCountdown(secondsLeft)}
          </span>
        </div>

        {/* QR Box */}
        <div className="mx-auto w-60 h-60 rounded-2xl border-2 border-brand-border bg-brand-tint flex flex-col items-center justify-center p-4 gap-2">
          <QrCode
            className="w-24 h-24 text-brand-primary"
            aria-hidden="true"
          />
          {order?.qrCode ? (
            <p className="font-mono text-[10px] text-ink-muted break-all line-clamp-3">
              {order.qrCode}
            </p>
          ) : (
            <p className="text-xs font-medium text-brand-primary">
              Mã QR PayOS đang sẵn sàng
            </p>
          )}
        </div>

        {order?.paymentUrl && (
          <div>
            <a
              href={order.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold"
            >
              <span>Mở cổng thanh toán PayOS</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        )}

        <div className="rounded-xl bg-surface-subtle border border-surface-border p-4 text-left space-y-2 text-sm">
          {typeof order?.totalAmount === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Số tiền cần chuyển:</span>
              <span className="font-mono font-bold text-accent-hot text-base">
                {formatVND(order.totalAmount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-ink-muted">Nội dung chuyển khoản:</span>
            <div className="inline-flex items-center gap-2">
              <span className="font-mono font-bold text-ink-primary">
                {orderCode}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(orderCode)}
                aria-label="Sao chép mã đơn hàng"
                className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-md border border-surface-border bg-white text-xs font-semibold text-ink-primary hover:border-brand-primary"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copied ? "Đã chép" : "Sao chép"}</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-muted">
          Hệ thống tự động kiểm tra trạng thái thanh toán mỗi 5 giây. Vui lòng
          không đóng trang này cho đến khi thanh toán hoàn tất.
        </p>
      </div>
    );
  }

  // Expired State
  if (isQrPayment && paymentStatus === "EXPIRED") {
    return (
      <div className="max-w-xl mx-auto rounded-2xl border border-accent-hot/30 bg-white p-6 sm:p-8 shadow-card text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-semantic-danger-bg text-semantic-danger-icon flex items-center justify-center">
          <XCircle className="w-9 h-9" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink-primary">
          Mã QR thanh toán đã hết hạn
        </h1>
        <p className="text-sm text-ink-secondary">
          Đơn hàng <strong className="font-mono">{orderCode}</strong> đã quá
          thời gian giữ chỗ 15 phút và tồn kho đã được hoàn lại.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/gio-hang"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-brand-primary text-white text-sm font-bold"
          >
            Đặt lại đơn hàng
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg border border-surface-border text-ink-primary text-sm font-semibold"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Paid or COD Success State
  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-brand-border bg-white p-6 sm:p-8 shadow-card text-center space-y-5">
      <div className="w-16 h-16 mx-auto rounded-full bg-semantic-success-bg text-semantic-success-icon flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
        {paymentStatus === "PAID"
          ? "Thanh toán thành công!"
          : "Đặt hàng thành công!"}
      </h1>

      <p className="text-sm sm:text-base text-ink-secondary">
        Cảm ơn bạn đã mua sắm tại 11 Sport. Mã đơn hàng của bạn là{" "}
        <strong className="font-mono text-brand-primary">{orderCode}</strong>.
      </p>

      {typeof order?.totalAmount === "number" && (
        <div className="rounded-xl bg-surface-subtle border border-surface-border p-4 inline-flex items-center gap-3 text-sm">
          <span className="text-ink-muted">Tổng giá trị đơn hàng:</span>
          <span className="font-mono font-bold text-lg text-ink-primary">
            {formatVND(order.totalAmount)}
          </span>
        </div>
      )}

      <div className="pt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/tai-khoan"
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-tint text-sm font-bold"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Tra cứu đơn hàng</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>
    </div>
  );
}
