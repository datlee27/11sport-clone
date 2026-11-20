"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LogOut,
  Mail,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import { formatPhoneVN, formatVND, normalizePhoneVN } from "@/lib/format";
import type {
  CustomerAddress,
  CustomerOrderSummary,
  CustomerProfile,
} from "@/types/storefront";

const CUSTOMER_TOKEN_KEY = "11sport_customer_token";

export function AccountClient() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);

  // Auth OTP states
  const [emailInput, setEmailInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Guest Order Lookup states
  const [guestMode, setGuestMode] = useState<"login" | "lookup">("login");
  const [lookupCode, setLookupCode] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    orderCode: string;
    totalAmount: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt?: string;
  } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Logged-in Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">(
    "orders"
  );
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Add Address Form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<CustomerAddress, "id">>({
    label: "Nhà riêng",
    fullName: "",
    phone: "",
    province: "Hồ Chí Minh",
    district: "",
    ward: "",
    addressLine: "",
    isDefault: false,
  });

  const loadAccountData = useCallback(async (jwt: string) => {
    try {
      const [meRes, ordersRes] = await Promise.all([
        apiFetch<{ data: CustomerProfile }>("/public/customers/me", {
          headers: { Authorization: `Bearer ${jwt}` },
        }),
        apiFetch<{ data: CustomerOrderSummary[] }>(
          "/public/customers/me/orders",
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        ),
      ]);
      if (meRes?.data) {
        setProfile(meRes.data);
        setProfileName(meRes.data.name || "");
        setProfilePhone(formatPhoneVN(meRes.data.phone || ""));
      }
      setOrders(ordersRes?.data ?? []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        setToken(null);
        setProfile(null);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (saved) {
        setToken(saved);
        loadAccountData(saved);
      }
    } catch {
      // Ignore
    }
  }, [loadAccountData]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => {
      setResendSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await apiFetch("/public/customers/request-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier: emailInput.trim(),
          channel: "EMAIL",
        }),
      });
      setOtpSent(true);
      setResendSeconds(60);
    } catch (err) {
      setAuthError(
        err instanceof ApiError
          ? err.message
          : "Không thể gửi mã OTP. Vui lòng thử lại."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiFetch<{
        data: { token: string; customer: CustomerProfile };
      }>("/public/customers/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier: emailInput.trim(),
          otp: otpCode.trim(),
        }),
      });
      if (res?.data?.token) {
        localStorage.setItem(CUSTOMER_TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setProfile(res.data.customer);
        setProfileName(res.data.customer.name || "");
        setProfilePhone(res.data.customer.phone || "");
        loadAccountData(res.data.token);
      }
    } catch (err) {
      setAuthError(
        err instanceof ApiError
          ? err.message
          : "Mã OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    setToken(null);
    setProfile(null);
    setOrders([]);
    setOtpSent(false);
    setOtpCode("");
  };

  const handleSaveProfile = async (
    nextAddresses?: CustomerAddress[]
  ) => {
    if (!token || !profile) return;
    setSavingProfile(true);
    setProfileNotice(null);
    try {
      const res = await apiFetch<{ data: CustomerProfile }>(
        "/public/customers/me",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: profileName.trim(),
            phone: normalizePhoneVN(profilePhone),
            email: profile.email,
            addresses: nextAddresses ?? profile.addresses,
          }),
        }
      );
      if (res?.data) {
        setProfile(res.data);
      }
      setProfileNotice("Đã cập nhật thông tin thành công.");
    } catch {
      setProfileNotice("Không thể lưu thay đổi lúc này.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const created: CustomerAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: profile.addresses.length === 0 || newAddr.isDefault,
    };
    const updated = created.isDefault
      ? [
          ...profile.addresses.map((a) => ({ ...a, isDefault: false })),
          created,
        ]
      : [...profile.addresses, created];
    await handleSaveProfile(updated);
    setShowAddAddress(false);
    setNewAddr({
      label: "Nhà riêng",
      fullName: "",
      phone: "",
      province: "Hồ Chí Minh",
      district: "",
      ward: "",
      addressLine: "",
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!profile) return;
    const updated = profile.addresses.filter((a) => a.id !== id);
    await handleSaveProfile(updated);
  };

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim() || !lookupPhone.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const res = await apiFetch<{
        data: {
          orderCode: string;
          totalAmount: number;
          paymentStatus: string;
          fulfillmentStatus: string;
          createdAt?: string;
        };
      }>("/public/orders/lookup", {
        params: {
          code: lookupCode.trim(),
          phone: normalizePhoneVN(lookupPhone),
        },
      });
      setLookupResult(res?.data ?? null);
    } catch (err) {
      setLookupError(
        err instanceof ApiError
          ? err.message
          : "Không tìm thấy đơn hàng khớp với mã đơn và số điện thoại."
      );
    } finally {
      setLookupLoading(false);
    }
  };

  if (!mounted) {
    return <div className="h-72 rounded-2xl bg-surface-muted animate-pulse" />;
  }

  // Unauthenticated View: OTP Login + Guest Order Lookup
  if (!token) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex rounded-xl border border-surface-border bg-surface-subtle p-1">
          <button
            type="button"
            onClick={() => setGuestMode("login")}
            className={`flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
              guestMode === "login"
                ? "bg-white text-brand-primary shadow-card"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Đăng nhập Email OTP
          </button>
          <button
            type="button"
            onClick={() => setGuestMode("lookup")}
            className={`flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
              guestMode === "lookup"
                ? "bg-white text-brand-primary shadow-card"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Tra cứu đơn hàng
          </button>
        </div>

        {guestMode === "login" ? (
          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink-primary">
                Đăng nhập thành viên 11 Sport
              </h2>
              <p className="text-sm text-ink-muted">
                Nhập email để nhận mã OTP 6 số, không cần nhớ mật khẩu.
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-semantic-danger-bg text-semantic-danger-text text-sm font-medium"
              >
                {authError}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp-email"
                    className="block text-sm font-medium text-ink-secondary mb-1"
                  >
                    Email của bạn
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="otp-email"
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="khachhang@example.com"
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full min-h-[48px] rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm disabled:opacity-60"
                >
                  {authLoading ? "Đang gửi mã..." : "Gửi mã OTP 6 số"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-ink-secondary">
                  Mã OTP đã được gửi tới{" "}
                  <strong className="text-ink-primary">{emailInput}</strong>
                </p>

                <div>
                  <label
                    htmlFor="otp-code"
                    className="block text-sm font-medium text-ink-secondary mb-1"
                  >
                    Nhập mã OTP 6 số
                  </label>
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full h-12 px-4 rounded-lg border border-surface-border font-mono text-center text-lg tracking-widest font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full min-h-[48px] rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm disabled:opacity-60"
                >
                  {authLoading ? "Đang xác thực..." : "Xác nhận đăng nhập"}
                </button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-ink-muted hover:text-ink-primary min-h-[36px]"
                  >
                    Đổi email khác
                  </button>
                  <button
                    type="button"
                    disabled={resendSeconds > 0 || authLoading}
                    onClick={handleRequestOtp}
                    className="font-semibold text-brand-primary disabled:text-ink-muted min-h-[36px]"
                  >
                    {resendSeconds > 0
                      ? `Gửi lại sau ${resendSeconds}s`
                      : "Gửi lại mã OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink-primary">
                Tra cứu đơn hàng nhanh
              </h2>
              <p className="text-sm text-ink-muted">
                Dành cho khách hàng mua không cần đăng nhập.
              </p>
            </div>

            <form onSubmit={handleLookupOrder} className="space-y-4">
              <div>
                <label
                  htmlFor="lookup-code"
                  className="block text-sm font-medium text-ink-secondary mb-1"
                >
                  Mã đơn hàng
                </label>
                <input
                  id="lookup-code"
                  type="text"
                  required
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                  placeholder="ONL-20261120-0001"
                  className="w-full h-11 px-3 rounded-lg border border-surface-border font-mono text-sm uppercase focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="lookup-phone"
                  className="block text-sm font-medium text-ink-secondary mb-1"
                >
                  Số điện thoại nhận hàng
                </label>
                <input
                  id="lookup-phone"
                  type="tel"
                  required
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(formatPhoneVN(e.target.value))}
                  placeholder="0901 234 567"
                  className="w-full h-11 px-3 rounded-lg border border-surface-border font-mono text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full min-h-[48px] rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{lookupLoading ? "Đang tra cứu..." : "Tra cứu đơn"}</span>
              </button>
            </form>

            {lookupError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-semantic-danger-bg text-semantic-danger-text text-sm font-medium"
              >
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="rounded-xl border border-brand-border bg-brand-tint p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Mã đơn:</span>
                  <strong className="font-mono text-ink-primary">
                    {lookupResult.orderCode}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Tổng tiền:</span>
                  <strong className="font-mono text-accent-hot">
                    {formatVND(lookupResult.totalAmount)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Thanh toán:</span>
                  <strong className="font-mono text-brand-primary">
                    {lookupResult.paymentStatus}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Trạng thái giao:</span>
                  <strong className="font-mono text-ink-primary">
                    {lookupResult.fulfillmentStatus}
                  </strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar / Mobile Tabs */}
      <aside className="lg:col-span-3 rounded-2xl border border-surface-border bg-white p-3 flex lg:flex-col gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`min-h-[44px] px-3.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shrink-0 ${
            activeTab === "orders"
              ? "bg-brand-tint text-brand-primary"
              : "text-ink-secondary hover:bg-surface-subtle"
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          <span>Lịch sử đơn hàng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`min-h-[44px] px-3.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shrink-0 ${
            activeTab === "addresses"
              ? "bg-brand-tint text-brand-primary"
              : "text-ink-secondary hover:bg-surface-subtle"
          }`}
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>Sổ địa chỉ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`min-h-[44px] px-3.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shrink-0 ${
            activeTab === "profile"
              ? "bg-brand-tint text-brand-primary"
              : "text-ink-secondary hover:bg-surface-subtle"
          }`}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          <span>Thông tin cá nhân</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[44px] px-3.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 text-accent-hot hover:bg-accent-hot-tint shrink-0 lg:mt-2"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Đăng xuất</span>
        </button>
      </aside>

      {/* Content */}
      <div className="lg:col-span-9 rounded-2xl border border-surface-border bg-white p-5 sm:p-6 space-y-5">
        {profileNotice && (
          <div
            role="status"
            className="p-3 rounded-lg bg-semantic-success-bg text-semantic-success-text text-sm font-medium"
          >
            {profileNotice}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink-primary">
              Đơn hàng của tôi ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-ink-muted py-6">
                Bạn chưa có đơn hàng online nào.
              </p>
            ) : (
              <div className="divide-y divide-surface-border">
                {orders.map((ord) => (
                  <div
                    key={ord._id || ord.orderCode}
                    className="py-4 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-mono font-bold text-ink-primary">
                        {ord.orderCode}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString("vi-VN")} •{" "}
                        {ord.paymentGateway}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-surface-muted text-ink-primary font-mono text-xs font-semibold">
                        {ord.fulfillmentStatus}
                      </span>
                      <span className="font-mono font-bold text-accent-hot">
                        {formatVND(ord.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-ink-primary">
                Sổ địa chỉ giao hàng
              </h2>
              <button
                type="button"
                onClick={() => setShowAddAddress((p) => !p)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg bg-brand-primary text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Thêm địa chỉ</span>
              </button>
            </div>

            {showAddAddress && (
              <form
                onSubmit={handleAddAddress}
                className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, fullName: e.target.value })
                    }
                    placeholder="Họ và tên người nhận"
                    className="h-11 px-3 rounded-lg border border-surface-border bg-white text-sm"
                  />
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, phone: formatPhoneVN(e.target.value) })
                    }
                    placeholder="Số điện thoại (VD: 0901 234 567)"
                    className="h-11 px-3 rounded-lg border border-surface-border bg-white font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newAddr.province}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, province: e.target.value })
                    }
                    placeholder="Tỉnh/TP"
                    className="h-11 px-3 rounded-lg border border-surface-border bg-white text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={newAddr.district}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, district: e.target.value })
                    }
                    placeholder="Quận/Huyện"
                    className="h-11 px-3 rounded-lg border border-surface-border bg-white text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={newAddr.ward}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, ward: e.target.value })
                    }
                    placeholder="Phường/Xã"
                    className="h-11 px-3 rounded-lg border border-surface-border bg-white text-sm"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={newAddr.addressLine}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, addressLine: e.target.value })
                  }
                  placeholder="Số nhà, tên đường"
                  className="w-full h-11 px-3 rounded-lg border border-surface-border bg-white text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="min-h-[44px] px-4 rounded-lg border border-surface-border bg-white text-sm font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="min-h-[44px] px-5 rounded-lg bg-brand-primary text-white text-sm font-semibold"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            )}

            {!profile?.addresses?.length ? (
              <p className="text-sm text-ink-muted py-4">
                Chưa có địa chỉ nào được lưu.
              </p>
            ) : (
              <div className="space-y-3">
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-xl border border-surface-border p-4 flex items-start justify-between gap-3"
                  >
                    <div className="text-sm space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-ink-primary">
                          {addr.fullName}
                        </strong>
                        <span className="font-mono text-ink-secondary">
                          {addr.phone}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-brand-tint text-brand-primary text-xs font-bold">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-ink-secondary">
                        {addr.addressLine}, {addr.ward}, {addr.district},{" "}
                        {addr.province}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label="Xóa địa chỉ"
                      className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-accent-hot hover:bg-accent-hot-tint"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
            className="space-y-4 max-w-md"
          >
            <h2 className="text-lg font-bold text-ink-primary">
              Thông tin cá nhân
            </h2>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ""}
                className="w-full h-11 px-3 rounded-lg border border-surface-border bg-surface-muted text-sm text-ink-muted"
              />
            </div>
            <div>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Họ và tên
              </label>
              <input
                id="profile-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="profile-phone"
                className="block text-sm font-medium text-ink-secondary mb-1"
              >
                Số điện thoại
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(formatPhoneVN(e.target.value))}
                placeholder="0901 234 567"
                className="w-full h-11 px-3 rounded-lg border border-surface-border font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="min-h-[48px] px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm"
            >
              {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
