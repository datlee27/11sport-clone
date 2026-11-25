"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import type { LocaleCode } from "@/lib/format";
import { getLocaleFromPath, localizeHref } from "@/lib/i18n";

/**
 * Client hook resolving the active storefront locale (`"vi"` | `"en"`)
 * directly from the current Next.js pathname.
 */
export function useLocale(): LocaleCode {
  const pathname = usePathname() || "/";
  return getLocaleFromPath(pathname);
}

/**
 * Convenience client hook returning a memoized `href -> localizedHref` helper
 * bound to the active locale.
 */
export function useLocalizedHref(): (href: string) => string {
  const locale = useLocale();
  return useCallback((href: string) => localizeHref(href, locale), [locale]);
}
