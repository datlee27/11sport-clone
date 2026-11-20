"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SeoDescriptionBoxProps {
  html?: string;
  title?: string;
}

export function SeoDescriptionBox({ html, title }: SeoDescriptionBoxProps) {
  const [expanded, setExpanded] = useState(false);

  if (!html) return null;

  return (
    <section
      aria-label={title || "Thông tin chi tiết"}
      className="rounded-2xl border border-surface-border bg-white p-5 sm:p-6"
    >
      <div
        className={`relative overflow-hidden transition-all ${
          expanded ? "max-h-none" : "max-h-[220px]"
        }`}
      >
        <div
          className="prose prose-slate max-w-none text-sm sm:text-base text-ink-secondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-lg border border-surface-border bg-surface-subtle hover:border-brand-primary hover:text-brand-primary text-sm font-semibold text-ink-primary transition-colors"
        >
          <span>{expanded ? "Thu gọn" : "Xem thêm"}</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
