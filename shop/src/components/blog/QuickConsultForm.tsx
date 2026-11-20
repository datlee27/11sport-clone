"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface QuickConsultFormProps {
  title?: string;
  subtitle?: string;
  sourceUrl?: string;
}

export function QuickConsultForm({
  title = "Gửi câu hỏi tư vấn",
  subtitle = "Đội ngũ HLV & kỹ thuật viên 11 Sport sẽ liên hệ hỗ trợ bạn.",
  sourceUrl,
}: QuickConsultFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await apiFetch<{ message?: string }>("/public/contact", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
          sourceUrl:
            sourceUrl ||
            (typeof window !== "undefined" ? window.location.pathname : undefined),
        }),
      });
      setFeedback({
        type: "success",
        text:
          res?.message ||
          "Cảm ơn bạn đã liên hệ. 11 Sport sẽ phản hồi trong thời gian sớm nhất.",
      });
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      setFeedback({
        type: "error",
        text: "Không thể gửi yêu cầu lúc này. Vui lòng gọi Hotline 0900.000.011.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5 space-y-4">
      <div>
        <h2 className="text-base font-bold text-ink-primary">{title}</h2>
        <p className="text-xs text-ink-muted mt-1">{subtitle}</p>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-3 rounded-lg text-xs font-medium ${
            feedback.type === "success"
              ? "bg-semantic-success-bg text-semantic-success-text"
              : "bg-semantic-danger-bg text-semantic-danger-text"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="consult-name" className="sr-only">
            Họ và tên
          </label>
          <input
            id="consult-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên *"
            className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label htmlFor="consult-phone" className="sr-only">
            Số điện thoại
          </label>
          <input
            id="consult-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại *"
            className="w-full h-11 px-3 rounded-lg border border-surface-border font-mono text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label htmlFor="consult-email" className="sr-only">
            Email (tuỳ chọn)
          </label>
          <input
            id="consult-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (tuỳ chọn)"
            className="w-full h-11 px-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label htmlFor="consult-message" className="sr-only">
            Nội dung cần tư vấn
          </label>
          <textarea
            id="consult-message"
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bạn cần tư vấn chọn vợt, giày hay size? *"
            className="w-full p-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-[48px] rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>{submitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}</span>
        </button>
      </form>
    </div>
  );
}
