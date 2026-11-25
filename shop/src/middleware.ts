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

const EN_ROUTE_ALIASES: Record<string, string> = {
  "/en/contact": "/lien-he",
  "/en/cart": "/gio-hang",
  "/en/checkout": "/thanh-toan",
  "/en/order-success": "/order-success",
  "/en/shop": "/cua-hang",
  "/en/search": "/tim-kiem",
  "/en/my-account": "/tai-khoan",
  "/en/my-account/lost-password": "/tai-khoan/lost-password",
  "/en/category/blogs": "/tin-tuc",
  "/en/blogs": "/tin-tuc",
  "/en/blog": "/tin-tuc",
  "/en/category/blogs/technique": "/tin-tuc/kien-thuc-pickleball",
  "/en/category/blogs/techniques": "/tin-tuc/kien-thuc-pickleball",
  "/en/category/blogs/guides": "/tin-tuc/kien-thuc-pickleball",
  "/en/category/blogs/review": "/tin-tuc/review-danh-gia",
  "/en/category/blogs/reviews": "/tin-tuc/review-danh-gia",
  "/en/category/blogs/paddle-reviews": "/tin-tuc/review-danh-gia",
  "/en/category/blogs/buying-guide": "/tin-tuc/tu-van-dung-cu-pickleball",
  "/en/category/blogs/gear-buying-guides": "/tin-tuc/tu-van-dung-cu-pickleball",
  "/en/category/blogs/guide": "/tin-tuc/tu-van-dung-cu-pickleball",
  "/en/category/blogs/community": "/tin-tuc/tin-tuc-cong-dong",
  "/en/category/blogs/news": "/tin-tuc/tin-tuc-cong-dong",
  "/en/about-us": "/ve-chung-toi",
  "/en/trade-in": "/thu-cu-doi-moi",
  "/en/shipping-policy": "/chinh-sach-van-chuyen",
  "/en/warranty-returns": "/hoan-tien_tra-ve",
  "/en/return-policy": "/hoan-tien_tra-ve",
  "/en/privacy-policy": "/chinh-sach-bao-mat",
  "/en/terms-of-use": "/quy-dinh-su-dung",
};

const EN_PREFIX_ALIASES: Array<[prefix: string, targetPrefix: string]> = [
  ["/en/checkout/order-received/", "/thanh-toan/order-received/"],
  ["/en/my-account/", "/tai-khoan/"],
  ["/en/category/blogs/", "/tin-tuc/"],
  ["/en/brand/", "/thuong-hieu/"],
  ["/en/product/", "/san-pham/"],
  ["/en/product-category/", "/danh-muc-san-pham/"],
  ["/en/category/", "/danh-muc/"],
];

function rewriteWithLocale(
  request: NextRequest,
  targetPathname: string,
  originalPathname: string,
  locale: "vi" | "en"
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = targetPathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", originalPathname);
  const response = NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
  response.headers.set("x-locale", locale);
  return response;
}

async function getRedirects(): Promise<RedirectRule[]> {
  if ((process.env.NEXT_PUBLIC_DATA_SOURCE || "mock") === "mock") {
    return [];
  }
  const now = Date.now();
  if (now < cacheExpiresAt) {
    return cachedRedirects;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);

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

  // 0. Standard 308 storefront alias redirects
  if (pathname === "/cart") {
    return NextResponse.redirect(new URL("/gio-hang", request.url), 308);
  }
  if (pathname === "/shop") {
    return NextResponse.redirect(new URL("/cua-hang", request.url), 308);
  }
  if (pathname === "/tra-cuu-don-hang") {
    return NextResponse.redirect(
      new URL("/tai-khoan?tab=lookup", request.url),
      308
    );
  }
  if (pathname === "/en/tra-cuu-don-hang" || pathname === "/en/track-order") {
    return NextResponse.redirect(
      new URL("/en/my-account?tab=lookup", request.url),
      308
    );
  }
  if (pathname === "/my-account") {
    return rewriteWithLocale(request, "/tai-khoan", pathname, "vi");
  }

  // 1. Handle direct English alias mappings (/en/cart, /en/checkout, /en/search, /en/my-account, /en/category/blogs/*, ...)
  if (EN_ROUTE_ALIASES[pathname]) {
    return rewriteWithLocale(
      request,
      EN_ROUTE_ALIASES[pathname]!,
      pathname,
      "en"
    );
  }

  // 2. Handle English prefix route aliases (/en/checkout/order-received/*, /en/my-account/*, /en/category/blogs/*, /en/brand/*, ...)
  for (const [enPrefix, viPrefix] of EN_PREFIX_ALIASES) {
    if (pathname.startsWith(enPrefix)) {
      const rest = pathname.slice(enPrefix.length);
      return rewriteWithLocale(request, `${viPrefix}${rest}`, pathname, "en");
    }
  }

  // 3. Handle general /en and /en/* bilingual prefix via internal rewrite
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const stripped = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    return rewriteWithLocale(request, stripped, pathname, "en");
  }

  // 4. Check CMS dynamic redirects when in API mode
  const redirects = await getRedirects();
  const match = redirects.find((r) => r.fromPath === pathname);
  if (match) {
    const targetUrl = match.toPath.startsWith("http")
      ? match.toPath
      : new URL(match.toPath, request.url);
    const status = match.statusCode === 302 ? 302 : 301;
    return NextResponse.redirect(targetUrl, status);
  }

  // 5. Default VI request — attach x-locale & x-pathname headers for server helpers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", "vi");
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-locale", "vi");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|images/).*)",
  ],
};
