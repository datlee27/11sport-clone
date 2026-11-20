"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiRequest, UserRole } from "@/lib/api";
import { WebShowroomItem, WebSiteSettingData } from "@/lib/webApi";
import {
  AdminOnlyBadge,
  ImageUploadField,
  TabFeedbackBanner,
  TabLoadingState,
} from "./WebShared";
import { Lock, Save } from "lucide-react";

const DEFAULT_SHOWROOMS: WebShowroomItem[] = [
  { name: "Showroom 1", address: "", hotline: "", hours: "08:30 - 21:30" },
  { name: "Showroom 2", address: "", hotline: "", hours: "08:30 - 21:30" },
  { name: "Showroom 3", address: "", hotline: "", hours: "08:30 - 21:30" },
];

export default function WebSettingsTab({ role }: { role: UserRole }) {
  const isAdmin = role === "ADMIN";
  const [form, setForm] = useState<WebSiteSettingData>({
    siteName: "11 Sport",
    showrooms: DEFAULT_SHOWROOMS,
    onlineStockMode: "FLOOR_1",
  });
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingTech, setSavingTech] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<WebSiteSettingData>("/cms/web/settings");
      const d = res.data || {};
      setForm({
        ...d,
        showrooms:
          Array.isArray(d.showrooms) && d.showrooms.length > 0
            ? d.showrooms
            : DEFAULT_SHOWROOMS,
        onlineStockMode: d.onlineStockMode || "FLOOR_1",
      });
    } catch (e: any) {
      setError(e?.message || "Không tải được cấu hình Website");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateShowroom = (idx: number, field: keyof WebShowroomItem, value: string) => {
    setForm((prev) => {
      const list = [...(prev.showrooms || DEFAULT_SHOWROOMS)];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, showrooms: list };
    });
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    setError("");
    setSuccess("");
    try {
      // Chỉ gửi các trường hiển thị chung (không chạm technical fields để CEO lưu bình thường)
      await apiRequest("/cms/web/settings", {
        method: "PUT",
        body: JSON.stringify({
          siteName: form.siteName,
          logoUrl: form.logoUrl,
          hotline: form.hotline,
          email: form.email,
          zaloUrl: form.zaloUrl,
          messengerUrl: form.messengerUrl,
          freeShipThreshold: Number(form.freeShipThreshold || 0),
          defaultShippingFee: Number(form.defaultShippingFee || 0),
          showrooms: form.showrooms,
          footerAbout: form.footerAbout,
        }),
      });
      setSuccess("Đã lưu thông tin chung Website!");
      await loadSettings();
    } catch (err: any) {
      setError(err?.message || "Lưu thông tin chung thất bại");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveTechnical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSavingTech(true);
    setError("");
    setSuccess("");
    try {
      await apiRequest("/cms/web/settings", {
        method: "PUT",
        body: JSON.stringify({
          onlineStockMode: form.onlineStockMode,
          ga4Id: form.ga4Id,
          gtmId: form.gtmId,
          payosClientId: form.payosClientId,
          payosApiKey: form.payosApiKey,
          payosChecksumKey: form.payosChecksumKey,
          webhookSecret: form.webhookSecret,
          revalidateSecret: form.revalidateSecret,
        }),
      });
      setSuccess("Đã lưu cấu hình kỹ thuật & thanh toán!");
      await loadSettings();
    } catch (err: any) {
      setError(err?.message || "Lưu cấu hình kỹ thuật thất bại");
    } finally {
      setSavingTech(false);
    }
  };

  if (loading) return <TabLoadingState />;

  return (
    <div className="space-y-6">
      <TabFeedbackBanner
        error={error}
        success={success}
        onClear={() => {
          setError("");
          setSuccess("");
        }}
      />

      {/* Phần 1: Thông tin chung & 3 Showroom */}
      <form
        onSubmit={handleSaveGeneral}
        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Thông tin hiển thị, Liên hệ &amp; 3 Showroom
            </h3>
            <p className="text-xs text-slate-500">
              ADMIN và CEO đều có thể cập nhật thông tin thương hiệu, hotline và phí vận chuyển.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingGeneral}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{savingGeneral ? "Đang lưu..." : "Lưu thông tin chung"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Website</label>
            <input
              type="text"
              value={form.siteName || ""}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotline chính</label>
            <input
              type="text"
              value={form.hotline || ""}
              onChange={(e) => setForm({ ...form, hotline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email CSKH</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Zalo OA URL</label>
            <input
              type="text"
              value={form.zaloUrl || ""}
              onChange={(e) => setForm({ ...form, zaloUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Messenger URL</label>
            <input
              type="text"
              value={form.messengerUrl || ""}
              onChange={(e) => setForm({ ...form, messengerUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phí ship (₫)</label>
              <input
                type="number"
                value={form.defaultShippingFee || 0}
                onChange={(e) => setForm({ ...form, defaultShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Freeship từ (₫)</label>
              <input
                type="number"
                value={form.freeShipThreshold || 0}
                onChange={(e) => setForm({ ...form, freeShipThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <ImageUploadField
          label="Logo Website"
          value={form.logoUrl || ""}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
        />

        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-extrabold text-slate-800 uppercase">Hệ thống 3 Showroom</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(form.showrooms || DEFAULT_SHOWROOMS).slice(0, 3).map((sr, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <input
                  type="text"
                  value={sr.name}
                  onChange={(e) => updateShowroom(idx, "name", e.target.value)}
                  placeholder={`Showroom ${idx + 1}`}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  value={sr.address}
                  onChange={(e) => updateShowroom(idx, "address", e.target.value)}
                  placeholder="Địa chỉ chi nhánh..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sr.hotline}
                    onChange={(e) => updateShowroom(idx, "hotline", e.target.value)}
                    placeholder="Hotline"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={sr.hours || ""}
                    onChange={(e) => updateShowroom(idx, "hours", e.target.value)}
                    placeholder="Giờ mở cửa"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Phần 2: Cấu hình kỹ thuật (ADMIN ONLY) */}
      <form
        onSubmit={handleSaveTechnical}
        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900">
              Cấu hình Kỹ thuật, Kho Online &amp; PayOS Keys
            </h3>
            {!isAdmin && <AdminOnlyBadge text="Chỉ ADMIN được sửa cấu hình kỹ thuật" />}
          </div>
          <button
            type="submit"
            disabled={!isAdmin || savingTech}
            title={!isAdmin ? "Chỉ ADMIN được sửa cấu hình kỹ thuật" : "Lưu cấu hình kỹ thuật"}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isAdmin
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {!isAdmin ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savingTech ? "Đang lưu..." : "Lưu cấu hình kỹ thuật"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chế độ kho Online</label>
            <select
              disabled={!isAdmin}
              value={form.onlineStockMode || "FLOOR_1"}
              onChange={(e) => setForm({ ...form, onlineStockMode: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm disabled:bg-slate-100 disabled:text-slate-500"
            >
              <option value="FLOOR_1">FLOOR_1 (Chỉ bán tồn kho Tầng 1)</option>
              <option value="ALL">ALL (Gộp Tầng 1 + Tầng 2)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Analytics 4 (GA4 ID)</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.ga4Id || ""}
              onChange={(e) => setForm({ ...form, ga4Id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Tag Manager (GTM ID)</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.gtmId || ""}
              onChange={(e) => setForm({ ...form, gtmId: e.target.value })}
              placeholder="GTM-XXXXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PayOS Client ID</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.payosClientId || ""}
              onChange={(e) => setForm({ ...form, payosClientId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PayOS API Key</label>
            <input
              type="password"
              disabled={!isAdmin}
              value={form.payosApiKey || ""}
              onChange={(e) => setForm({ ...form, payosApiKey: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PayOS Checksum Key</label>
            <input
              type="password"
              disabled={!isAdmin}
              value={form.payosChecksumKey || ""}
              onChange={(e) => setForm({ ...form, payosChecksumKey: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Webhook Secret</label>
            <input
              type="password"
              disabled={!isAdmin}
              value={form.webhookSecret || ""}
              onChange={(e) => setForm({ ...form, webhookSecret: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Revalidate Secret</label>
            <input
              type="password"
              disabled={!isAdmin}
              value={form.revalidateSecret || ""}
              onChange={(e) => setForm({ ...form, revalidateSecret: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm disabled:bg-slate-100"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
