import { NextRequest, NextResponse } from "next/server";

interface RedirectRule {
  fromPath: string;
  toPath: string;
  statusCode?: number;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

const CACHE_TTL_MS = 60_000;
const ERROR_RETRY_TTL_MS = 10_000;

let cachedRedirects: RedirectRule[] = [];
let cacheExpiresAt = 0;

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (trimmed.length > 1 && trimmed.endsWith("/")) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
}

async function getRedirects(): Promise<RedirectRule[]> {
  const now = Date.now();
  if (now < cacheExpiresAt) {
    return cachedRedirects;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${API_BASE_URL}/public/redirects`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      cacheExpiresAt = now + ERROR_RETRY_TTL_MS;
      return cachedRedirects;
    }

    const json = (await res.json()) as { data?: RedirectRule[] };
    if (Array.isArray(json?.data)) {
      cachedRedirects = json.data
        .filter((r) => typeof r.fromPath === "string" && typeof r.toPath === "string")
        .map((r) => ({
          fromPath: normalizePath(r.fromPath),
          toPath: r.toPath,
          statusCode: r.statusCode,
        }));
      cacheExpiresAt = now + CACHE_TTL_MS;
    }
  } catch {
    cacheExpiresAt = now + ERROR_RETRY_TTL_MS;
  } finally {
    clearTimeout(timeout);
  }

  return cachedRedirects;
}

export async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  const redirects = await getRedirects();

  const match = redirects.find((r) => r.fromPath === pathname);
  if (match) {
    const targetUrl = match.toPath.startsWith("http")
      ? match.toPath
      : new URL(match.toPath, request.url);
    const status = match.statusCode === 302 ? 302 : 301;
    return NextResponse.redirect(targetUrl, status);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
