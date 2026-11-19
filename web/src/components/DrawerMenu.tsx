"use client";

import React, { useEffect } from "react";
import { StaffUser, UserRole } from "@/lib/api";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  Clock,
  UserCog,
  Rocket,
  KeyRound,
  Lock,
} from "lucide-react";

export type TabType =
  | "POS"
  | "SERVICES"
  | "INVENTORY"
  | "CUSTOMER"
  | "RETURN"
  | "INVOICE_HISTORY"
  | "PUSH_PRODUCTS";
export type DrawerPageType = "NONE" | "PROFILE" | "ATTENDANCE";

export interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  roleHint: string;
}

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  currentUser: StaffUser;
  tabs?: TabConfig[];
  activeTab?: TabType;
  onSelectTab?: (tabId: TabType) => void;
  activeDrawerPage: DrawerPageType;
  onOpenProfile: () => void;
  onOpenAttendance: () => void;
  onOpenPushProducts?: () => void;
  onOpenChangePassword?: () => void;
  onLogout: () => void;
  getRoleDisplayName: (role?: UserRole) => string;
  cmsUrl?: string;
  hasAttendanceNoti?: boolean;
}

export default function DrawerMenu({
  isOpen,
  onClose,
  side = "right",
  currentUser,
  tabs = [],
  activeTab,
  onSelectTab,
  activeDrawerPage,
  onOpenProfile,
  onOpenAttendance,
  onOpenPushProducts,
  onOpenChangePassword,
  onLogout,
  getRoleDisplayName,
  cmsUrl = "https://11sport-it-m1ei.vercel.app",
  hasAttendanceNoti = false,
}: DrawerMenuProps) {
  // Đóng drawer khi nhấn phím Escape & khóa cuộn trang nền khi mở
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLeft = side === "left";

  return (
    <div
      className="fixed inset-0 z-50 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={
        isLeft ? "Menu điều hướng 5 tab" : "Menu tiện ích nhân sự & tài khoản"
      }
    >
      {/* Lớp nền mờ */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Nội dung Drawer (trái: 5 tab chức năng, phải: tiện ích nhân sự) */}
      <aside
        className={`fixed top-0 bottom-0 w-80 max-w-[85vw] bg-white text-slate-900 shadow-2xl border-slate-200 flex flex-col z-10 duration-200 ${
          isLeft
            ? "left-0 border-r animate-in slide-in-from-left"
            : "right-0 border-l animate-in slide-in-from-right"
        }`}
      >
        {/* Header của Drawer */}
        <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo-11sport.svg"
              alt="11Sport Logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-sm tracking-tight text-slate-900 truncate">
                {isLeft ? "MENU ĐIỀU HƯỚNG" : "TIỆN ÍCH NHÂN SỰ"}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                11Sport POS & Kho vận
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Đóng menu"
            className="w-9 h-9 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thông tin nhân sự đang đăng nhập (chỉ hiện ở Drawer phải hoặc khi cần) */}
        {!isLeft && (
          <div className="p-4 border-b border-slate-200 bg-slate-50/70">
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500">Đang đăng nhập:</div>
                <div className="font-bold text-sm text-slate-900 truncate">
                  {currentUser.fullName}
                </div>
                {currentUser.username && (
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    @{currentUser.username}
                  </div>
                )}
                <div className="mt-1.5 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                  {getRoleDisplayName(currentUser.role)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nội dung chính của Drawer */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {isLeft ? (
            /* DRAWER TRÁI: HIỂN THỊ CÁC TAB CHỨC NĂNG BÁN HÀNG, DỊCH VỤ & KHO */
            <div className="space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Phân hệ Bán hàng & Kho ({tabs.length} Tab)
              </div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isAllowed =
                  currentUser.role === "CEO" ||
                  currentUser.role === "ADMIN" ||
                  tab.allowedRoles.includes(currentUser.role);
                const isActive =
                  activeDrawerPage === "NONE" && activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={!isAllowed}
                    title={
                      isAllowed
                        ? tab.label
                        : `Chức năng này chỉ dành cho: ${tab.roleHint}`
                    }
                    onClick={() => {
                      if (isAllowed && onSelectTab) {
                        onSelectTab(tab.id);
                        onClose();
                      }
                    }}
                    className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition ${
                      !isAllowed
                        ? "opacity-45 cursor-not-allowed text-slate-400 bg-slate-50"
                        : isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {isAllowed ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <span className="truncate">{tab.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            /* DRAWER PHẢI: TIỆN ÍCH NHÂN SỰ & QUẢN TRỊ */
            <>
              <div className="space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tiện ích nhân sự
                </div>

                {(currentUser.role === "MARKETING" ||
                  currentUser.role === "CEO" ||
                  currentUser.role === "ADMIN") &&
                  onOpenPushProducts && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenPushProducts();
                        onClose();
                      }}
                      className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition ${
                        activeDrawerPage === "NONE" &&
                        activeTab === "PUSH_PRODUCTS"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            activeDrawerPage === "NONE" &&
                            activeTab === "PUSH_PRODUCTS"
                              ? "bg-white/20 text-white"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          <Rocket className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">
                            Các SP Đang Cần Đẩy Mạnh
                          </div>
                          <div
                            className={`text-[10px] font-normal truncate mt-0.5 ${
                              activeDrawerPage === "NONE" &&
                              activeTab === "PUSH_PRODUCTS"
                                ? "text-amber-50"
                                : "text-slate-500"
                            }`}
                          >
                            Quan sát tồn kho cao, bán chậm & đọng vốn
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          activeDrawerPage === "NONE" &&
                          activeTab === "PUSH_PRODUCTS"
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      />
                    </button>
                  )}

                {/* 1. Chấm công: Lịch công tháng của tôi */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenAttendance();
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition ${
                    activeDrawerPage === "ATTENDANCE"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activeDrawerPage === "ATTENDANCE"
                          ? "bg-white/20 text-white"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {hasAttendanceNoti && (
                        <span
                          title="HR đã hoàn thành xếp ca tuần sau"
                          className="absolute -top-1 -right-1 flex h-2.5 w-2.5"
                        >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">Chấm công</span>
                        {hasAttendanceNoti && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black leading-none">
                            Lịch ca mới
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] font-normal truncate mt-0.5 ${
                          activeDrawerPage === "ATTENDANCE"
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        Lịch công tháng, đơn từ & tăng ca
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      activeDrawerPage === "ATTENDANCE"
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                {/* 2. Thông tin tài khoản */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenProfile();
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition ${
                    activeDrawerPage === "PROFILE"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activeDrawerPage === "PROFILE"
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <UserCog className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate">Thông tin tài khoản</div>
                      <div
                        className={`text-[10px] font-normal truncate mt-0.5 ${
                          activeDrawerPage === "PROFILE"
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        Xem hồ sơ & chỉnh sửa thông tin cá nhân
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      activeDrawerPage === "PROFILE"
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                {/* 3. Đổi mật khẩu */}
                {onOpenChangePassword && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenChangePassword();
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate">Đổi mật khẩu</div>
                        <div className="text-[10px] font-normal truncate mt-0.5 text-slate-500">
                          Cập nhật mật khẩu đăng nhập hệ thống
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
                  </button>
                )}
              </div>

              {(currentUser.role === "ADMIN" || currentUser.role === "CEO") && (
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Quản trị hệ thống
                  </div>
                  <a
                    href={cmsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    className="w-full px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 flex items-center justify-between gap-2 transition"
                  >
                    <span>Mở trang Quản trị CMS</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer của Drawer phải: Nút Đăng xuất */}
        {!isLeft && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 pb-safe">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-xs transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
