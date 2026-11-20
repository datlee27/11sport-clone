"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { WebHomeSectionItem } from "@/lib/webApi";
import { TabEmptyState, TabFeedbackBanner, TabLoadingState } from "./WebShared";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Save,
  Settings2,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

const SECTION_TYPES = [
  { value: "HERO_SLIDER", label: "Hero Slider" },
  { value: "USP_BAR", label: "4 USP Cam kết" },
  { value: "FLASH_SALE", label: "Flash Sale" },
  { value: "CATEGORY_PRODUCTS", label: "Khối Sản phẩm theo Danh mục" },
  { value: "MID_BANNER", label: "Banner xen kẽ Full-Width" },
  { value: "BRAND_SHOWCASE", label: "Thương hiệu đối tác" },
  { value: "BLOG_LATEST", label: "Tin tức & Hướng dẫn" },
];

export default function WebHomeSectionsTab({
  onRevalidate,
}: {
  onRevalidate: () => Promise<void>;
}) {
  const [sections, setSections] = useState<WebHomeSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WebHomeSectionItem | null>(null);
  const [type, setType] = useState("CATEGORY_PRODUCTS");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [viewAllUrl, setViewAllUrl] = useState("");
  const [configText, setConfigText] = useState("{}");
  const [isActive, setIsActive] = useState(true);

  const loadSections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<WebHomeSectionItem[]>("/cms/web/home-sections");
      setSections(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setError(e?.message || "Không tải được danh sách khối trang chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [picked] = next.splice(idx, 1);
    next.splice(target, 0, picked);
    setSections(next.map((s, i) => ({ ...s, sortOrder: i + 1 })));
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null);
      return;
    }
    const next = [...sections];
    const [picked] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, picked);
    setSections(next.map((s, i) => ({ ...s, sortOrder: i + 1 })));
    setDragIdx(null);
  };

  const toggleActive = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleSaveOrderAndSync = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = sections.map((s, idx) => ({
        id: s._id,
        sortOrder: idx + 1,
        isActive: s.isActive,
      }));
      const res = await apiRequest<WebHomeSectionItem[]>("/cms/web/home-sections/reorder", {
        method: "PUT",
        body: JSON.stringify({ sections: payload }),
      });
      setSections(Array.isArray(res.data) ? res.data : sections);
      await onRevalidate();
      setSuccess("Đã lưu bố cục trang chủ & đồng bộ Website!");
    } catch (e: any) {
      setError(e?.message || "Lưu bố cục thất bại");
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setType("CATEGORY_PRODUCTS");
    setTitle("");
    setSubtitle("");
    setViewAllUrl("");
    setConfigText('{\n  "layout": "GRID",\n  "limit": 10\n}');
    setIsActive(true);
    setShowModal(true);
  };

  const openEdit = (sec: WebHomeSectionItem) => {
    setEditing(sec);
    setType(sec.type);
    setTitle(sec.title);
    setSubtitle(sec.subtitle || "");
    setViewAllUrl(sec.viewAllUrl || "");
    setConfigText(JSON.stringify(sec.configJson || {}, null, 2));
    setIsActive(sec.isActive);
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let parsedConfig: Record<string, any> = {};
    try {
      parsedConfig = configText.trim() ? JSON.parse(configText) : {};
    } catch {
      setError("JSON cấu hình không hợp lệ, vui lòng kiểm tra lại cú pháp.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await apiRequest(`/cms/web/home-sections/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify({
            type,
            title,
            subtitle,
            viewAllUrl,
            configJson: parsedConfig,
            isActive,
          }),
        });
        setSuccess(`Đã cập nhật khối "${title}"`);
      } else {
        await apiRequest("/cms/web/home-sections", {
          method: "POST",
          body: JSON.stringify({
            type,
            title,
            subtitle,
            viewAllUrl,
            configJson: parsedConfig,
            isActive,
            sortOrder: sections.length + 1,
          }),
        });
        setSuccess(`Đã thêm khối "${title}"`);
      }
      setShowModal(false);
      await loadSections();
    } catch (err: any) {
      setError(err?.message || "Không thể lưu khối trang chủ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sec: WebHomeSectionItem) => {
    if (!confirm(`Xóa khối "${sec.title}" khỏi trang chủ?`)) return;
    setError("");
    try {
      await apiRequest(`/cms/web/home-sections/${sec._id}`, { method: "DELETE" });
      setSuccess(`Đã xóa khối "${sec.title}"`);
      await loadSections();
    } catch (e: any) {
      setError(e?.message || "Không thể xóa khối");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">
            Sắp xếp các khối hiển thị trên Trang chủ (`shop/`)
          </h3>
          <p className="text-xs text-slate-500">
            Kéo thả hoặc bấm mũi tên để đổi thứ tự, bật/tắt hiển thị rồi bấm &quot;Lưu &amp; Đồng bộ Website&quot;.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openCreate}
            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khối mới</span>
          </button>
          <button
            type="button"
            onClick={handleSaveOrderAndSync}
            disabled={saving || sections.length === 0}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Lưu &amp; Đồng bộ Website</span>
          </button>
        </div>
      </div>

      <TabFeedbackBanner
        error={error}
        success={success}
        onClear={() => {
          setError("");
          setSuccess("");
        }}
      />

      {loading ? (
        <TabLoadingState />
      ) : sections.length === 0 ? (
        <TabEmptyState
          title="Chưa có khối trang chủ nào"
          desc="Bấm 'Thêm khối mới' để khởi tạo Hero Slider, Flash Sale, Khối danh mục..."
        />
      ) : (
        <div className="space-y-2">
          {sections.map((sec, idx) => (
            <div
              key={sec._id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className={`p-3.5 rounded-2xl border bg-white flex flex-wrap items-center justify-between gap-3 transition ${
                dragIdx === idx ? "border-teal-500 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="cursor-grab text-slate-400 hover:text-slate-600" title="Kéo để sắp xếp">
                  <GripVertical className="w-5 h-5" />
                </span>
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 truncate">{sec.title}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {sec.type}
                    </span>
                  </div>
                  {sec.subtitle && <p className="text-xs text-slate-500 truncate">{sec.subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(sec._id)}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold border transition ${
                    sec.isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                >
                  {sec.isActive ? "Đang bật" : "Đang ẩn"}
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                  title="Lên"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === sections.length - 1}
                  title="Xuống"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(sec)}
                  title="Cấu hình khối"
                  className="p-2 rounded-xl border border-slate-200 text-teal-700 hover:bg-teal-50"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sec)}
                  title="Xóa khối"
                  className="p-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-teal-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="font-extrabold text-sm">
                {editing ? `Cấu hình khối: ${editing.title}` : "Thêm khối trang chủ mới"}
              </h4>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-teal-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitModal} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Loại khối *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} ({t.value})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu đề hiển thị *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Vợt Pickleball Chính Hãng"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Link &quot;Xem tất cả&quot;</label>
                <input
                  type="text"
                  value={viewAllUrl}
                  onChange={(e) => setViewAllUrl(e.target.value)}
                  placeholder="/danh-muc/vot-pickleball"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cấu hình JSON</label>
                <textarea
                  rows={5}
                  value={configText}
                  onChange={(e) => setConfigText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:border-teal-600 focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-teal-600"
                />
                <span>Hiển thị khối này trên trang chủ</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                >
                  {saving ? "Đang lưu..." : "Lưu khối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
