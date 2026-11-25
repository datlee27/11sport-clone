import { headers } from "next/headers";
import type { LocaleCode } from "@/lib/format";

/**
 * Reads the active storefront locale (`"vi"` | `"en"`) on the server from
 * middleware-injected request headers (`x-locale` / `x-pathname`).
 * Safe to call outside an active request scope (falls back to `"vi"`).
 */
export function getServerLocale(): LocaleCode {
  try {
    const reqHeaders = headers();
    const headerLocale = reqHeaders.get("x-locale");
    if (headerLocale === "en") return "en";
    if (headerLocale === "vi") return "vi";
    const pathname = reqHeaders.get("x-pathname") || "";
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      return "en";
    }
    return "vi";
  } catch {
    return "vi";
  }
}

/**
 * Reads the original public request pathname (including `/en/...` prefix)
 * injected by middleware into `x-pathname`.
 */
export function getServerPathname(): string {
  try {
    const reqHeaders = headers();
    return reqHeaders.get("x-pathname") || "/";
  } catch {
    return "/";
  }
}
