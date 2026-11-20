"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ArticleTocProps {
  headings: TocHeading[];
}

export function ArticleToc({ headings }: ArticleTocProps) {
  const [open, setOpen] = useState(true);

  if (!headings.length) return null;

  return (
    <nav
      aria-label="Mục lục bài viết"
      className="rounded-xl border border-surface-border bg-surface-subtle p-4"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 min-h-[40px] text-left font-bold text-sm text-ink-primary"
      >
        <span className="inline-flex items-center gap-2">
          <List className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          <span>Mục lục bài viết</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className="mt-3 space-y-1.5 border-t border-surface-border pt-3">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${h.id}`}
                className="block py-1 text-sm text-ink-secondary hover:text-brand-primary transition-colors"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
