"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { localizeHref } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { getCommerceI18n } from "@/lib/i18n/commerce";

/**
 * 1:1 mipik.vn Password Reset Page (`/tai-khoan/lost-password` & `/en/my-account/lost-password`)
 */
export default function LostPasswordPage() {
  const locale = useLocale();
  const t = getCommerceI18n(locale).lostPassword;
  const accountHref = localizeHref("/tai-khoan", locale);

  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-10 space-y-5">
      <h1 className="text-[20px] sm:text-[22px] font-bold uppercase tracking-wide text-[#0a0a0a] border-b border-[#ececec] pb-3">
        {t.heading}
      </h1>

      {submitted ? (
        <div className="max-w-2xl space-y-4">
          <div
            role="status"
            className="p-4 rounded-none bg-[#f8f9f5] border border-[#dce5da] text-[#204b3e] flex items-start gap-2.5 text-[14px]"
          >
            <CheckCircle2
              className="w-5 h-5 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              {t.successPrefix} <strong>{identifier}</strong>
              {t.successSuffix}
            </span>
          </div>
          <Link
            href={accountHref}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            {t.backToLoginBtn}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <p className="text-[14px] text-[#333333] leading-relaxed">
            {t.instructions}
          </p>

          <div>
            <label
              htmlFor="reset-identifier"
              className="block text-[13px] font-bold text-[#222222] mb-1.5"
            >
              {t.identifierLabel} <span className="text-[#dd3333]">*</span>
            </label>
            <input
              id="reset-identifier"
              type="text"
              required
              aria-label={t.identifierLabel}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t.identifierPlaceholder}
              className="w-full min-h-[44px] px-3 py-2 rounded-none border border-[#dddddd] bg-white text-base sm:text-[14px] text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#224e40]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
            >
              {t.submitBtn}
            </button>

            <Link
              href={accountHref}
              className="text-[13.5px] font-medium text-[#224e40] hover:underline"
            >
              {t.backToLoginLink}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
