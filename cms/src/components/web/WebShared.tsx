"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Lock, Upload, X } from "lucide-react";
import { extractWebImageUrl, resolveWebMediaUrl, uploadWebImageFile } from "@/lib/webApi";

export function SeoCharacterBar({
  label,
  value,
  min,
  max,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  onChange: (val: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const len = value.length;
  const pct = Math.min(100, Math.round((len / max) * 100));
  const status = len === 0 ? "empty" : len < min ? "short" : len <= max ? "good" : "over";

  const barColor =
    status === "good"
      ? "bg-emerald-500"
      : status === "over"
        ? "bg-red-500"
        : "bg-slate-400";

  const badgeClass =
    status === "good"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : status === "over"
        ? "text-red-700 bg-red-50 border-red-200"
        : "text-slate-600 bg-slate-100 border-slate-200";

  const statusText =
    status === "good"
      ? "Đạt chuẩn"
      : status === "over"
        ? `Vượt quá ${len - max} ký tự`
        : status === "short"
          ? `Nên thêm ${min - len} ký tự`
          : `Khuyến nghị ${min}–${max} ký tự`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-700 uppercase">{label}</label>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
          {len} / {max} ký tự · {statusText}
        </span>
      </div>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
        />
      )}
      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full transition-all duration-200 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const url = await uploadWebImageFile(file);
      onChange(url);
    } catch (error: any) {
      setErr(error?.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dán URL ảnh hoặc tải ảnh lên..."
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:outline-none"
        />
        <label className="min-h-[40px] px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? "Đang tải..." : "Tải ảnh"}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFile} className="hidden" />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Xóa ảnh"
            className="min-h-[40px] px-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
      {extractWebImageUrl(value) && (
        <div className="mt-1.5 inline-flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
          <img
            src={resolveWebMediaUrl(value)}
            alt={label}
            className="h-14 w-24 object-cover rounded-lg bg-white"
          />
          <span className="text-[11px] font-mono text-slate-500 max-w-[200px] truncate">
            {extractWebImageUrl(value)}
          </span>
        </div>
      )}
    </div>
  );
}

export function TabFeedbackBanner({
  error,
  success,
  onClear,
}: {
  error?: string;
  success?: string;
  onClear?: () => void;
}) {
  if (!error && !success) return null;
  return (
    <div className="space-y-2">
      {error && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {onClear && (
            <button type="button" onClick={onClear} className="p-1 hover:bg-red-100 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          {onClear && (
            <button type="button" onClick={onClear} className="p-1 hover:bg-emerald-100 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function TabLoadingState({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

export function TabEmptyState({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) {
  return (
    <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
      <ImagePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
      <p className="text-sm font-bold text-slate-700">{title}</p>
      {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
    </div>
  );
}

export function AdminOnlyBadge({ text = "Chỉ ADMIN được sửa cấu hình kỹ thuật" }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
      <Lock className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </span>
  );
}
