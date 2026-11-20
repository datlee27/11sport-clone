/**
 * Format số tiền sang định dạng chuẩn Việt Nam: 1.030.000₫
 */
export function formatVND(amount: number | null | undefined): string {
  const safeValue =
    typeof amount === "number" && Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = new Intl.NumberFormat("vi-VN").format(safeValue);
  return `${formatted}₫`;
}

/**
 * Tính phần trăm giảm giá (làm tròn xuống/gần nhất, trả về 0 nếu không giảm).
 */
export function calcDiscountPercent(
  price: number,
  compareAtPrice?: number | null
): number {
  if (!compareAtPrice || compareAtPrice <= price || compareAtPrice <= 0) {
    return 0;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Chuẩn hóa số điện thoại Việt Nam về dạng 10-11 chữ số liền (0901234567).
 */
export function normalizePhoneVN(input: string | null | undefined): string {
  const raw = String(input || "").replace(/[\s.\-()]/g, "");
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+84") || (digits.startsWith("84") && digits.length >= 11)) {
    digits = `0${digits.slice(2)}`;
  }
  return digits.slice(0, 11);
}

/**
 * Format số điện thoại Việt Nam khi nhập/hiển thị: 0901 234 567
 */
export function formatPhoneVN(input: string | null | undefined): string {
  const digits = normalizePhoneVN(input);
  if (!digits) return "";
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/**
 * Kiểm tra hợp lệ số điện thoại Việt Nam (10-11 chữ số bắt đầu bằng 0).
 */
export function isValidPhoneVN(input: string | null | undefined): boolean {
  const digits = normalizePhoneVN(input);
  return /^0[0-9]{9,10}$/.test(digits);
}
