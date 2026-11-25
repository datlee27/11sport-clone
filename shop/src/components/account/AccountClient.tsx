"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  LogOut,
  MapPin,
  Package,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import {
  formatPhoneVN,
  formatPriceByCurrency,
  normalizePhoneVN,
} from "@/lib/format";
import {
  formatDateByLocale,
  localizeApiMessage,
  localizeHref,
  localizeOrderStatus,
  localizePaymentStatus,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { useCurrencyStore } from "@/store/currencyStore";
import type {
  CustomerAddress,
  CustomerOrderSummary,
  CustomerProfile,
} from "@/types/storefront";

const CUSTOMER_TOKEN_KEY = "11sport_customer_token";

const SHARP_INPUT_CLS =
  "w-full min-h-[44px] px-3 py-2 rounded-none border border-[#dddddd] bg-white text-base sm:text-[14px] text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#224e40]";
const LABEL_CLS = "block text-[13px] font-bold text-[#222222] mb-1.5";

/**
 * 1:1 mipik.vn My Account (`/tai-khoan` & `/en/my-account`) & Figma `Store/Account/AuthCard/Login` (9:1231)
 */
export function AccountClient() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = getCommerceI18n(locale).account;
  const currency = useCurrencyStore((s) => s.currency);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);

  // Guest Mode
  const [guestMode, setGuestMode] = useState<"login" | "lookup">("login");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Guest Order Lookup
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

  // Authenticated Dashboard Tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "addresses" | "profile"
  >("orders");
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Add Address Form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<CustomerAddress, "id">>(() => ({
    label: t.defaultAddressLabel,
    fullName: "",
    phone: "",
    province: t.defaultProvince,
    district: "",
    ward: "",
    addressLine: "",
    isDefault: false,
  }));

  useEffect(() => {
    setNewAddr((prev) => ({
      ...prev,
      label:
        locale === "en" && prev.label === "Nhà riêng"
          ? "Home"
          : locale === "vi" && prev.label === "Home"
          ? "Nhà riêng"
          : prev.label,
      province:
        locale === "en" && prev.province === "TP. Hồ Chí Minh"
          ? "Ho Chi Minh City"
          : locale === "vi" && prev.province === "Ho Chi Minh City"
          ? "TP. Hồ Chí Minh"
          : prev.province,
    }));
  }, [locale]);

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
      // Ignore storage errors
    }
  }, [loadAccountData]);

  useEffect(() => {
    if (searchParams.get("tab") === "lookup") {
      setGuestMode("lookup");
    }
  }, [searchParams]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handleRequestOtp = async () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setAuthError(t.errIdentifierRequired);
      return;
    }
    const cleanId = trimmed.includes("@")
      ? trimmed.toLowerCase()
      : normalizePhoneVN(trimmed);
    if (!cleanId) {
      setAuthError(t.errIdentifierInvalid);
      return;
    }

    setOtpSending(true);
    setAuthError(null);
    setOtpNotice(null);
    try {
      const res = await apiFetch<{ message?: string; devOtp?: string }>(
        "/public/customers/request-otp",
        {
          method: "POST",
          body: JSON.stringify({
            identifier: cleanId,
            channel: trimmed.includes("@") ? "EMAIL" : "SMS",
          }),
        }
      );
      const baseMsg = res?.message
        ? localizeApiMessage(res.message, locale)
        : t.otpSentFallback;
      setOtpNotice(res?.devOtp ? `${baseMsg} (OTP: ${res.devOtp})` : baseMsg);
      setOtpCooldown(60);
    } catch (err) {
      setAuthError(
        err instanceof ApiError
          ? localizeApiMessage(err.message, locale)
          : t.errOtpSendFailed
      );
    } finally {
      setOtpSending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    if (!trimmed || !otp.trim()) {
      setAuthError(t.errLoginFieldsRequired);
      return;
    }
    const cleanId = trimmed.includes("@")
      ? trimmed.toLowerCase()
      : normalizePhoneVN(trimmed);
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiFetch<{
        data: { token: string; customer: CustomerProfile };
      }>("/public/customers/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier: cleanId,
          otp: otp.trim(),
        }),
      });
      if (res?.data?.token) {
        if (rememberMe) {
          localStorage.setItem(CUSTOMER_TOKEN_KEY, res.data.token);
        }
        setToken(res.data.token);
        setProfile(res.data.customer);
        setProfileName(res.data.customer.name || "");
        setProfilePhone(res.data.customer.phone || "");
        loadAccountData(res.data.token);
      }
    } catch (err) {
      setAuthError(
        err instanceof ApiError
          ? localizeApiMessage(err.message, locale)
          : t.errOtpInvalid
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
    setOtp("");
    setOtpNotice(null);
  };

  const handleSaveProfile = async (nextAddresses?: CustomerAddress[]) => {
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
      setProfileNotice(t.profileSaved);
    } catch {
      setProfileNotice(t.profileSaveFailed);
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
      label: t.defaultAddressLabel,
      fullName: "",
      phone: "",
      province: t.defaultProvince,
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
          ? localizeApiMessage(err.message, locale)
          : t.lookupNotFound
      );
    } finally {
      setLookupLoading(false);
    }
  };

  if (!mounted) {
    return <div className="h-64 bg-[#f8f9f5] animate-pulse" />;
  }

  const lostPasswordHref = localizeHref("/tai-khoan/lost-password", locale);
  const paddlesHref = localizeHref("/vot-pickleball", locale);

  // 1. GUEST VIEW — 1:1 mipik.vn Single-Column Sharp WooCommerce Login Form
  if (!token) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#ececec] pb-3">
          <h2 className="text-[19px] sm:text-[21px] font-bold uppercase tracking-wide text-[#0a0a0a]">
            {guestMode === "login" ? t.headingLogin : t.headingLookup}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
            <button
              type="button"
              onClick={() => setGuestMode("login")}
              aria-pressed={guestMode === "login"}
              className={`py-2.5 min-h-[40px] inline-flex items-center ${
                guestMode === "login"
                  ? "font-bold text-[#224e40] underline underline-offset-4"
                  : "text-[#555555] hover:text-[#0a0a0a]"
              }`}
            >
              {t.tabLogin}
            </button>
            <span className="text-[#cccccc]" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              onClick={() => setGuestMode("lookup")}
              aria-pressed={guestMode === "lookup"}
              className={`py-2.5 min-h-[40px] inline-flex items-center ${
                guestMode === "lookup"
                  ? "font-bold text-[#224e40] underline underline-offset-4"
                  : "text-[#555555] hover:text-[#0a0a0a]"
              }`}
            >
              {t.tabLookup}
            </button>
          </div>
        </div>

        {guestMode === "login" ? (
          <div className="space-y-4">
            {authError && (
              <div
                role="alert"
                className="p-3 rounded-none border border-[#dd3333]/35 bg-[#fef2f2] text-[#b91c1c] text-[13.5px] font-medium"
              >
                {authError}
              </div>
            )}

            {otpNotice && (
              <div
                role="status"
                className="p-3 rounded-none border border-[#dce5da] bg-[#f8f9f5] text-[#204b3e] text-[13.5px] font-medium"
              >
                {otpNotice}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-identifier" className={LABEL_CLS}>
                  {t.identifierLabel} <span className="text-[#dd3333]">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    aria-label={t.identifierLabel}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.identifierPlaceholder}
                    className={`${SHARP_INPUT_CLS} sm:flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={otpSending || otpCooldown > 0}
                    className="min-h-[44px] px-4 rounded-none border border-[#224e40] bg-white hover:bg-[#f4f7f5] text-[#224e40] text-[12.5px] font-bold uppercase tracking-wider transition-colors disabled:opacity-55 whitespace-nowrap shrink-0"
                  >
                    {otpSending
                      ? t.otpSending
                      : otpCooldown > 0
                      ? t.otpResend(otpCooldown)
                      : t.sendOtp}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="login-otp" className={LABEL_CLS}>
                  {t.otpLabel} <span className="text-[#dd3333]">*</span>
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  aria-label={t.otpLabel}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={t.otpPlaceholder}
                  className={`${SHARP_INPUT_CLS} font-mono tracking-widest`}
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 text-[13.5px] text-[#333333] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#224e40]"
                  />
                  <span>{t.rememberMe}</span>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="min-h-[44px] px-7 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                >
                  {authLoading ? t.signingIn : t.signInBtn}
                </button>
              </div>

              <div>
                <Link
                  href={lostPasswordHref}
                  className="text-[13.5px] text-[#224e40] hover:underline"
                >
                  {t.forgotPassword}
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[#555555]">{t.lookupIntro}</p>

            <form onSubmit={handleLookupOrder} className="space-y-4">
              <div>
                <label htmlFor="lookup-code" className={LABEL_CLS}>
                  {t.orderCodeLabel} <span className="text-[#dd3333]">*</span>
                </label>
                <input
                  id="lookup-code"
                  type="text"
                  required
                  aria-label={t.orderCodeLabel}
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                  placeholder={t.orderCodePlaceholder}
                  className={`${SHARP_INPUT_CLS} font-mono uppercase`}
                />
              </div>

              <div>
                <label htmlFor="lookup-phone" className={LABEL_CLS}>
                  {t.deliveryPhoneLabel}{" "}
                  <span className="text-[#dd3333]">*</span>
                </label>
                <input
                  id="lookup-phone"
                  type="tel"
                  required
                  aria-label={t.deliveryPhoneLabel}
                  value={lookupPhone}
                  onChange={(e) =>
                    setLookupPhone(formatPhoneVN(e.target.value))
                  }
                  placeholder={t.deliveryPhonePlaceholder}
                  className={`${SHARP_INPUT_CLS} tabular-nums`}
                />
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="min-h-[44px] px-7 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
              >
                {lookupLoading ? t.lookingUp : t.lookupBtn}
              </button>
            </form>

            {lookupError && (
              <div
                role="alert"
                className="p-3 rounded-none border border-[#dd3333]/35 bg-[#fef2f2] text-[#b91c1c] text-[13.5px] font-medium"
              >
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="border border-[#dce5da] bg-[#f8f9f5] p-4 space-y-2 text-[14px] max-w-lg">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#555555]">{t.resultOrderCode}</span>
                  <strong className="font-mono text-[#224e40] text-right">
                    {lookupResult.orderCode}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#555555]">{t.resultTotal}</span>
                  <strong className="text-[#dd3333] tabular-nums text-right">
                    {formatPriceByCurrency(
                      lookupResult.totalAmount,
                      mounted ? currency : "VND"
                    )}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#555555]">{t.resultPayment}</span>
                  <strong className="text-[#204b3e] text-right">
                    {localizePaymentStatus(lookupResult.paymentStatus, locale)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#555555]">{t.resultFulfillment}</span>
                  <strong className="text-[#0a0a0a] text-right">
                    {localizeOrderStatus(
                      lookupResult.fulfillmentStatus,
                      locale
                    )}
                  </strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 2. AUTHENTICATED VIEW — Store/Account/DashboardNav (9:1259) & OrderTable (9:1288)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside className="lg:col-span-3 border border-[#e5e5e5] bg-[#fafafa] p-3 space-y-1">
        <div className="px-3 py-2.5 border-b border-[#ececec] mb-2">
          <p className="text-[11px] font-bold text-[#666666] uppercase">
            {t.sidebarAccountLabel}
          </p>
          <p className="text-sm font-bold text-[#224e40] truncate">
            {profile?.name || profile?.email || t.defaultMemberName}
          </p>
        </div>

        {(
          [
            { key: "dashboard", label: t.navDashboard, icon: CheckCircle2 },
            { key: "orders", label: t.navOrders, icon: Package },
            { key: "addresses", label: t.navAddresses, icon: MapPin },
            { key: "profile", label: t.navProfile, icon: User },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`w-full min-h-[40px] px-3 py-2 rounded-none text-[13.5px] font-semibold inline-flex items-center gap-2.5 text-left transition-colors ${
                active
                  ? "bg-[#224e40] text-white"
                  : "text-[#333333] hover:bg-white hover:text-[#224e40]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full min-h-[40px] px-3 py-2 rounded-none text-[13.5px] font-semibold inline-flex items-center gap-2.5 text-[#dd3333] hover:bg-white transition-colors mt-2"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.signOut}</span>
        </button>
      </aside>

      <div className="lg:col-span-9 border border-[#ececec] bg-white p-5 sm:p-6 space-y-5">
        {profileNotice && (
          <div
            role="status"
            className="p-3 bg-[#f8f9f5] border border-[#dce5da] text-[#204b3e] text-[13.5px] font-medium"
          >
            {profileNotice}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <h2 className="text-[17px] font-bold text-[#0a0a0a] uppercase">
              {t.greeting(profile?.name || t.defaultMemberName)}
            </h2>
            <p className="text-[14px] text-[#333333] leading-relaxed">
              {t.dashboardIntroBeforeOrders}
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="font-bold text-[#224e40] underline"
              >
                {t.dashboardRecentOrders(orders.length)}
              </button>
              {t.dashboardMiddle}
              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className="font-bold text-[#224e40] underline"
              >
                {t.dashboardAddressBook}
              </button>
              {t.dashboardAfter}
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-[17px] font-bold text-[#0a0a0a] uppercase">
              {t.orderHistoryHeading(orders.length)}
            </h2>
            {orders.length === 0 ? (
              <div className="bg-[#f8f9f5] border border-[#dce5da] p-8 text-center space-y-3">
                <p className="text-[14px] text-[#555555]">{t.noOrdersText}</p>
                <Link
                  href={paddlesHref}
                  className="inline-flex items-center justify-center min-h-[40px] px-6 rounded-none bg-[#224e40] text-white text-xs font-bold uppercase tracking-wider"
                >
                  {t.shopNowBtn}
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b-2 border-[#ececec] text-xs font-bold uppercase text-[#666666]">
                      <th className="py-3 pr-4 whitespace-nowrap">
                        {t.colOrder}
                      </th>
                      <th className="py-3 pr-4 whitespace-nowrap">
                        {t.colDate}
                      </th>
                      <th className="py-3 pr-4 whitespace-nowrap">
                        {t.colStatus}
                      </th>
                      <th className="py-3 pr-4 whitespace-nowrap">
                        {t.colTotal}
                      </th>
                      <th className="py-3 text-right whitespace-nowrap">
                        {t.colAction}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ececec]">
                    {orders.map((ord) => (
                      <tr key={ord._id || ord.orderCode}>
                        <td className="py-3.5 pr-4 font-mono font-bold text-[#224e40] whitespace-nowrap">
                          #{ord.orderCode}
                        </td>
                        <td className="py-3.5 pr-4 text-[#555555] whitespace-nowrap tabular-nums">
                          {formatDateByLocale(ord.createdAt, locale)}
                        </td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <span className="inline-flex px-2.5 py-0.5 bg-[#f8f9f5] border border-[#dce5da] text-[#204b3e] text-xs font-semibold">
                            {localizeOrderStatus(ord.fulfillmentStatus, locale)}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-bold text-[#0a0a0a] tabular-nums whitespace-nowrap">
                          {formatPriceByCurrency(
                            ord.totalAmount,
                            mounted ? currency : "VND"
                          )}
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <Link
                            href={localizeHref(
                              `/thanh-toan/order-received/${encodeURIComponent(
                                ord.orderCode
                              )}`,
                              locale
                            )}
                            className="inline-flex items-center h-8 px-3.5 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider"
                          >
                            {t.viewOrderBtn}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[17px] font-bold text-[#0a0a0a] uppercase">
                {t.addressesHeading}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddAddress((p) => !p)}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-none bg-[#224e40] text-white text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>{t.addAddressBtn}</span>
              </button>
            </div>

            {showAddAddress && (
              <form
                onSubmit={handleAddAddress}
                className="border border-[#dce5da] bg-[#f8f9f5] p-4 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    aria-label={t.addrNameAria}
                    value={newAddr.fullName}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, fullName: e.target.value })
                    }
                    placeholder={t.addrNamePlaceholder}
                    className={SHARP_INPUT_CLS}
                  />
                  <input
                    type="tel"
                    required
                    aria-label={t.addrPhoneAria}
                    value={newAddr.phone}
                    onChange={(e) =>
                      setNewAddr({
                        ...newAddr,
                        phone: formatPhoneVN(e.target.value),
                      })
                    }
                    placeholder={t.addrPhonePlaceholder}
                    className={`${SHARP_INPUT_CLS} tabular-nums`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    aria-label={t.addrProvinceAria}
                    value={newAddr.province}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, province: e.target.value })
                    }
                    placeholder={t.addrProvincePlaceholder}
                    className={SHARP_INPUT_CLS}
                  />
                  <input
                    type="text"
                    required
                    aria-label={t.addrDistrictAria}
                    value={newAddr.district}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, district: e.target.value })
                    }
                    placeholder={t.addrDistrictPlaceholder}
                    className={SHARP_INPUT_CLS}
                  />
                  <input
                    type="text"
                    required
                    aria-label={t.addrWardAria}
                    value={newAddr.ward}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, ward: e.target.value })
                    }
                    placeholder={t.addrWardPlaceholder}
                    className={SHARP_INPUT_CLS}
                  />
                </div>
                <input
                  type="text"
                  required
                  aria-label={t.addrStreetAria}
                  value={newAddr.addressLine}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, addressLine: e.target.value })
                  }
                  placeholder={t.addrStreetPlaceholder}
                  className={SHARP_INPUT_CLS}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="min-h-[38px] px-4 rounded-none border border-[#dddddd] bg-white text-xs font-bold uppercase"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="min-h-[38px] px-5 rounded-none bg-[#224e40] text-white text-xs font-bold uppercase"
                  >
                    {t.saveAddressBtn}
                  </button>
                </div>
              </form>
            )}

            {!profile?.addresses?.length ? (
              <p className="text-[13.5px] text-[#666666] py-4">
                {t.noAddressesText}
              </p>
            ) : (
              <div className="space-y-3">
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-[#ececec] p-4 flex items-start justify-between gap-3"
                  >
                    <div className="text-[13.5px] space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-[#0a0a0a]">
                          {addr.fullName}
                        </strong>
                        <span className="tabular-nums text-[#555555]">
                          {addr.phone}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-[#f8f9f5] border border-[#dce5da] text-[#204b3e] text-xs font-bold">
                            {t.defaultBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[#555555]">
                        {addr.addressLine}, {addr.ward}, {addr.district},{" "}
                        {addr.province}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label={t.deleteAddressAria}
                      className="w-9 h-9 inline-flex items-center justify-center text-[#888888] hover:text-[#dd3333] shrink-0"
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
            <h2 className="text-[17px] font-bold text-[#0a0a0a] uppercase">
              {t.profileHeading}
            </h2>
            <div>
              <label htmlFor="profile-name" className={LABEL_CLS}>
                {t.profileNameLabel}
              </label>
              <input
                id="profile-name"
                type="text"
                aria-label={t.profileNameLabel}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={SHARP_INPUT_CLS}
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className={LABEL_CLS}>
                {t.profilePhoneLabel}
              </label>
              <input
                id="profile-phone"
                type="tel"
                aria-label={t.profilePhoneLabel}
                value={profilePhone}
                onChange={(e) => setProfilePhone(formatPhoneVN(e.target.value))}
                className={`${SHARP_INPUT_CLS} tabular-nums`}
              />
            </div>
            <div>
              <label htmlFor="profile-email" className={LABEL_CLS}>
                {t.profileEmailLabel}
              </label>
              <input
                id="profile-email"
                type="email"
                disabled
                aria-label={t.profileEmailLabel}
                value={profile?.email || ""}
                className="w-full min-h-[44px] px-3 py-2 rounded-none border border-[#dddddd] bg-[#f5f5f5] text-base sm:text-[14px] text-[#555555]"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider"
            >
              {savingProfile ? t.savingBtn : t.saveChangesBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
