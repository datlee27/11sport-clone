"use client";

import React, { useState, useCallback } from "react";
import { apiRequest, StaffUser } from "@/lib/api";
import WebDashboardTab from "./web/WebDashboardTab";
import WebHomeSectionsTab from "./web/WebHomeSectionsTab";
import WebBannersTab from "./web/WebBannersTab";
import WebMenusTab from "./web/WebMenusTab";
import WebCatalogTab from "./web/WebCatalogTab";
import WebContentTab from "./web/WebContentTab";
import WebPromotionsTab from "./web/WebPromotionsTab";
import WebReviewsTab from "./web/WebReviewsTab";
import WebSeoRedirectTab from "./web/WebSeoRedirectTab";
import WebSettingsTab from "./web/WebSettingsTab";
import WebOrdersTab from "./web/WebOrdersTab";
import WebAuditLogsTab from "./web/WebAuditLogsTab";
import {
  BarChart3,
  LayoutTemplate,
  Image as ImageIcon,
  FolderTree,
  Package,
  FileText,
  Tag,
  MessageSquare,
  SearchCheck,
  Settings,
  ShoppingBag,
  History,
  RefreshCw,
  Globe,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type WebSubTabId =
  | "dashboard"
  | "home-sections"
  | "banners"
  | "menus"
  | "catalog"
  | "content"
  | "promotions"
  | "reviews"
  | "seo-redirect"
  | "settings"
  | "orders"
  | "audit-logs";

interface SubTabDef {
  id: WebSubTabId;
  label: string;
  group: "OVERVIEW" | "CONTENT" | "SYSTEM";
  icon: React.ComponentType<{ className?: string }>;
}

const SUB_TABS: SubTabDef[] = [
  { id: "dashboard", label: "Dashboard CEO", group: "OVERVIEW", icon: BarChart3 },
  { id: "orders", label: "Đơn hàng Online", group: "OVERVIEW", icon: ShoppingBag },
  { id: "audit-logs", label: "Nhật ký thao tác", group: "OVERVIEW", icon: History },

  { id: "home-sections", label: "Bố cục trang chủ", group: "CONTENT", icon: LayoutTemplate },
  { id: "banners", label: "Banner & Slider", group: "CONTENT", icon: ImageIcon },
  { id: "menus", label: "Mega Menu", group: "CONTENT", icon: FolderTree },
  { id: "catalog", label: "SP, DM & Thương hiệu", group: "CONTENT", icon: Package },
  { id: "content", label: "Bài viết & Trang tĩnh", group: "CONTENT", icon: FileText },
  { id: "reviews", label: "Duyệt Đánh giá", group: "CONTENT", icon: MessageSquare },

  { id: "promotions", label: "Khuyến mãi Online", group: "SYSTEM", icon: Tag },
  { id: "seo-redirect", label: "SEO & 301 Redirect", group: "SYSTEM", icon: SearchCheck },
  { id: "settings", label: "Cài đặt Site", group: "SYSTEM", icon: Settings },
];

const GROUP_LABELS: Record<SubTabDef["group"], string> = {
  OVERVIEW: "Tổng quan & Báo cáo",
  CONTENT: "Giao diện & Nội dung",
  SYSTEM: "Tăng trưởng & Hệ thống",
};

export default function WebManagementModule({ currentUser }: { currentUser: StaffUser }) {
  const [activeTab, setActiveTab] = useState<WebSubTabId>("dashboard");
  const [revalidating, setRevalidating] = useState(false);
  const [revalMsg, setRevalMsg] = useState<{ type: "ok" | "warn"; text: string } | null>(null);

  const isAllowed = currentUser.role === "ADMIN" || currentUser.role === "CEO";

  const handleRevalidate = useCallback(async () => {
    setRevalidating(true);
    setRevalMsg(null);
    try {
      const res = await apiRequest<{
        serverCacheCleared: boolean;
        shopNotified: boolean;
        shopError?: string;
      }>("/cms/web/revalidate", {
        method: "POST",
        body: JSON.stringify({ paths: ["/", "/tin-tuc"], tags: ["home", "menu"] }),
      });
      if (res.data?.shopNotified) {
        setRevalMsg({ type: "ok", text: "Đã làm mới cache & đồng bộ lên Website shop/!" });
      } else {
        setRevalMsg({
          type: "ok",
          text: res.data?.shopError
            ? `Đã xóa cache Server (${res.data.shopError})`
            : "Đã xóa cache Server thành công!",
        });
      }
    } catch (e: any) {
      setRevalMsg({ type: "warn", text: e?.message || "Không thể làm mới cache Website" });
    } finally {
      setRevalidating(false);
    }
  }, []);

  if (!isAllowed) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 shrink-0" />
        <div>
          <h1 className="font-extrabold text-base">Không có quyền truy cập</h1>
          <p className="text-xs mt-0.5">
            Phân hệ Quản lý Website chỉ dành cho vai trò ADMIN và CEO.
          </p>
        </div>
      </div>
    );
  }

  const activeDef = SUB_TABS.find((t) => t.id === activeTab) || SUB_TABS[0];

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900">
                Quản lý Website — {activeDef.label}
              </h1>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-600 text-white font-bold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Điều phối toàn bộ giao diện, sản phẩm, nội dung SEO và đơn hàng Online của 11 Sport.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRevalidate}
          disabled={revalidating}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${revalidating ? "animate-spin" : ""}`} />
          <span>{revalidating ? "Đang đồng bộ..." : "Làm mới Cache Website (Revalidate)"}</span>
        </button>
      </div>

      {revalMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            revalMsg.type === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          {revalMsg.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{revalMsg.text}</span>
        </div>
      )}

      {/* Mobile Sub-tab Selector */}
      <div className="lg:hidden">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
          Chọn chức năng Website
        </label>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as WebSubTabId)}
          className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900"
        >
          {SUB_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main 2-column Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 space-y-4 sticky top-20">
          {(["OVERVIEW", "CONTENT", "SYSTEM"] as SubTabDef["group"][]).map((grp) => (
            <div key={grp} className="space-y-1">
              <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {GROUP_LABELS[grp]}
              </div>
              {SUB_TABS.filter((t) => t.group === grp).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                      active
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-teal-600"}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <section className="flex-1 min-w-0 w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
          {activeTab === "dashboard" && (
            <WebDashboardTab onJumpTab={(id) => setActiveTab(id as WebSubTabId)} />
          )}
          {activeTab === "home-sections" && (
            <WebHomeSectionsTab onRevalidate={handleRevalidate} />
          )}
          {activeTab === "banners" && <WebBannersTab />}
          {activeTab === "menus" && <WebMenusTab />}
          {activeTab === "catalog" && <WebCatalogTab />}
          {activeTab === "content" && <WebContentTab />}
          {activeTab === "promotions" && <WebPromotionsTab />}
          {activeTab === "reviews" && <WebReviewsTab />}
          {activeTab === "seo-redirect" && <WebSeoRedirectTab role={currentUser.role} />}
          {activeTab === "settings" && <WebSettingsTab role={currentUser.role} />}
          {activeTab === "orders" && <WebOrdersTab />}
          {activeTab === "audit-logs" && <WebAuditLogsTab />}
        </section>
      </div>
    </div>
  );
}
