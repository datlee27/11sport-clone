import type { LocaleCode } from "@/lib/format";

export type { LocaleCode };
export * from "./i18n/content";

export function getLocaleFromPath(pathname: string): LocaleCode {
  const pathOnly = pathname.split(/[?#]/)[0] || "/";
  return pathOnly === "/en" || pathOnly.startsWith("/en/") ? "en" : "vi";
}

function splitHrefParts(href: string): {
  pathname: string;
  suffix: string;
} {
  const match = href.match(/^([^?#]*)(.*)$/);
  const rawPath = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const pathname =
    rawPath.length > 1 && rawPath.endsWith("/")
      ? rawPath.slice(0, -1)
      : rawPath || "/";
  return { pathname, suffix };
}

const VI_TO_EN_EXACT: Record<string, string> = {
  "/": "/en",
  "/lien-he": "/en/contact",
  "/gio-hang": "/en/cart",
  "/thanh-toan": "/en/checkout",
  "/checkout": "/en/checkout",
  "/order-success": "/en/order-success",
  "/cua-hang": "/en/shop",
  "/tim-kiem": "/en/search",
  "/tai-khoan": "/en/my-account",
  "/tai-khoan/lost-password": "/en/my-account/lost-password",
  "/tin-tuc": "/en/category/blogs",
  "/tin-tuc/kien-thuc-pickleball": "/en/category/blogs/technique",
  "/tin-tuc/review-danh-gia": "/en/category/blogs/review",
  "/tin-tuc/tu-van-dung-cu-pickleball": "/en/category/blogs/buying-guide",
  "/tin-tuc/tin-tuc-cong-dong": "/en/category/blogs/community",
};

const EN_TO_VI_EXACT: Record<string, string> = {
  "/en": "/",
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

export function localizeHref(href: string, locale: LocaleCode): string {
  if (!href || !href.startsWith("/") || locale === "vi") return href;

  const { pathname, suffix } = splitHrefParts(href);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return `${pathname}${suffix}`;
  }

  if (VI_TO_EN_EXACT[pathname]) {
    return `${VI_TO_EN_EXACT[pathname]}${suffix}`;
  }
  if (pathname.startsWith("/thuong-hieu/")) {
    return `${pathname.replace("/thuong-hieu/", "/en/brand/")}${suffix}`;
  }
  if (pathname.startsWith("/thanh-toan/order-received/")) {
    return `${pathname.replace(
      "/thanh-toan/order-received/",
      "/en/checkout/order-received/"
    )}${suffix}`;
  }
  if (pathname.startsWith("/tai-khoan/")) {
    return `${pathname.replace("/tai-khoan/", "/en/my-account/")}${suffix}`;
  }
  return `/en${pathname}${suffix}`;
}

/**
 * Strips `/en` prefix and reverses English storefront route aliases back to the
 * canonical Vietnamese route path, preserving any query string or hash.
 */
export function delocalizePath(pathname: string): string {
  if (!pathname || !pathname.startsWith("/")) return pathname || "/";

  const { pathname: cleanPath, suffix } = splitHrefParts(pathname);

  if (EN_TO_VI_EXACT[cleanPath]) {
    return `${EN_TO_VI_EXACT[cleanPath]}${suffix}`;
  }
  if (cleanPath.startsWith("/en/checkout/order-received/")) {
    return `${cleanPath.replace(
      "/en/checkout/order-received/",
      "/thanh-toan/order-received/"
    )}${suffix}`;
  }
  if (cleanPath.startsWith("/en/my-account/")) {
    return `${cleanPath.replace("/en/my-account/", "/tai-khoan/")}${suffix}`;
  }
  if (cleanPath.startsWith("/en/category/blogs/")) {
    return `${cleanPath.replace("/en/category/blogs/", "/tin-tuc/")}${suffix}`;
  }
  if (cleanPath.startsWith("/en/brand/")) {
    return `${cleanPath.replace("/en/brand/", "/thuong-hieu/")}${suffix}`;
  }
  if (cleanPath.startsWith("/en/product/")) {
    return `${cleanPath.replace("/en/product/", "/san-pham/")}${suffix}`;
  }
  if (cleanPath.startsWith("/en/product-category/")) {
    return `${cleanPath.replace(
      "/en/product-category/",
      "/danh-muc-san-pham/"
    )}${suffix}`;
  }
  if (cleanPath.startsWith("/en/category/")) {
    return `${cleanPath.replace("/en/category/", "/danh-muc/")}${suffix}`;
  }
  if (cleanPath === "/en" || cleanPath.startsWith("/en/")) {
    const stripped = cleanPath.replace(/^\/en(?=\/|$)/, "") || "/";
    return `${stripped}${suffix}`;
  }

  return `${cleanPath}${suffix}`;
}

/**
 * Converts any current route (VI or EN, including query/hash) to its matching
 * equivalent in `targetLocale`.
 */
export function switchLocalePath(
  pathname: string,
  targetLocale: LocaleCode
): string {
  const canonicalVi = delocalizePath(pathname);
  return targetLocale === "en"
    ? localizeHref(canonicalVi, "en")
    : canonicalVi;
}

/**
 * Locale-aware date formatter using `Intl.DateTimeFormat` (`vi-VN` vs `en-US`).
 */
export function formatDateByLocale(
  dateInput: string | number | Date | null | undefined,
  locale: LocaleCode = "vi",
  options?: Intl.DateTimeFormatOptions
): string {
  if (dateInput === null || dateInput === undefined || dateInput === "") {
    return "";
  }
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const intlLocale = locale === "en" ? "en-US" : "vi-VN";
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

export const STORE_I18N = {
  vi: {
    nav: {
      paddles: "Vợt Pickleball",
      fashion: "Thời trang 11Sport",
      shoes: "Giày",
      bags: "Balo",
      accessories: "Phụ kiện",
      blog: "Tin tức",
      contact: "Liên hệ",
      megaPaddlePrefix: "Vợt Pickleball",
      subCombo: "Combo Thời trang",
      subShirt: "Áo Pickleball",
      subCap: "Nón Pickleball",
      subBag: "Túi Thời trang",
      subSock: "Tất Pickleball",
      subShoesAsics: "Giày Asics",
      subShoesSkechers: "Giày Skechers",
      subShoesOn: "Giày ON",
      subShoesKaitashi: "Giày Kaitashi",
      subBlogReview: "Review & Đánh giá",
      subBlogKnowledge: "Kiến thức Pickleball",
      subBlogAdvice: "Tư vấn dụng cụ Pickleball",
      subBlogCommunity: "Tin tức & Cộng đồng",
      searchPlaceholder: "Tìm kiếm...",
      allResultsPrefix: "Xem tất cả kết quả cho",
      accountAndOrders: "Tài khoản & Đơn hàng",
    },
    home: {
      paddles: "VỢT PICKLEBALL",
      fashion: "THỜI TRANG 11SPORT",
      shoes: "GIÀY",
      bags: "TÚI - BALO",
      accessories: "PHỤ KIỆN",
      brands: "THƯƠNG HIỆU PHÂN PHỐI CHÍNH HÃNG",
      guarantees: [
        "Tặng quấn cán, dán viền, bao vợt",
        "Bảo hành chính hãng",
        "100% hàng chính hãng",
        "Miễn phí vận chuyển",
      ],
    },
    product: {
      addToCart: "THÊM VÀO GIỎ HÀNG",
      selectOption: "CHỌN",
      outOfStock: "Tạm hết hàng",
      newBadge: "Mới",
      freeGiftBadge: "TẶNG ÁO",
    },
    common: {
      home: "Trang chủ",
      shop: "Cửa hàng",
      cart: "Giỏ hàng",
      checkout: "Thanh toán",
      account: "Tài khoản",
      blog: "Tin tức",
      contact: "Liên hệ",
      search: "Tìm kiếm",
      viewAll: "Xem tất cả →",
      backToShop: "Quay trở lại cửa hàng",
      continueShopping: "Tiếp tục mua sắm",
      noData: "Chưa có dữ liệu",
      loading: "Đang tải...",
      retry: "Thử lại",
    },
    footer: {
      productsHeading: "SẢN PHẨM",
      infoHeading: "THÔNG TIN",
      blogHeading: "BLOG",
      products: [
        { label: "Vợt Pickleball", href: "/vot-pickleball" },
        { label: "Balo Pickleball", href: "/balo-tui-pickleball" },
        { label: "Giày Pickleball", href: "/giay-pickleball" },
        { label: "Bóng Pickleball", href: "/bong-pickleball" },
        { label: "Phụ kiện Pickleball", href: "/phu-kien-pickleball" },
        { label: "Thời trang 11Sport", href: "/danh-muc-san-pham/thoi-trang" },
      ],
      info: [
        { label: "Chính sách vận chuyển", href: "/chinh-sach-van-chuyen" },
        { label: "Chính sách đổi mới sản phẩm", href: "/hoan-tien_tra-ve" },
        { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
        { label: "Quy định sử dụng", href: "/quy-dinh-su-dung" },
        { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi" },
        { label: "Về 11Sport", href: "/ve-chung-toi" },
        { label: "Tài khoản", href: "/tai-khoan" },
        { label: "Blog", href: "/tin-tuc" },
      ],
      blog: [
        { label: "Kiến thức Pickleball", href: "/tin-tuc/kien-thuc-pickleball" },
        { label: "Review & Đánh giá", href: "/tin-tuc/review-danh-gia" },
        { label: "Tin tức & Cộng đồng", href: "/tin-tuc/tin-tuc-cong-dong" },
        {
          label: "Tư vấn dụng cụ Pickleball",
          href: "/tin-tuc/tu-van-dung-cu-pickleball",
        },
      ],
    },
  },
  en: {
    nav: {
      paddles: "Paddles",
      fashion: "11Sport Sportswear",
      shoes: "Shoes",
      bags: "Bags",
      accessories: "Accessories",
      blog: "Blog",
      contact: "Contact",
      megaPaddlePrefix: "Paddle",
      subCombo: "Sportswear Combos",
      subShirt: "Pickleball Shirts",
      subCap: "Pickleball Caps",
      subBag: "Sport & Tote Bags",
      subSock: "Performance Socks",
      subShoesAsics: "Asics Shoes",
      subShoesSkechers: "Skechers Shoes",
      subShoesOn: "ON Running Shoes",
      subShoesKaitashi: "Kaitashi Shoes",
      subBlogReview: "Paddle Reviews",
      subBlogKnowledge: "Pickleball Techniques",
      subBlogAdvice: "Gear Buying Guides",
      subBlogCommunity: "News & Community",
      searchPlaceholder: "Search...",
      allResultsPrefix: "View all results for",
      accountAndOrders: "My Account & Orders",
    },
    home: {
      paddles: "PICKLEBALL PADDLES",
      fashion: "11SPORT EXCLUSIVE COLLECTION",
      shoes: "SHOES",
      bags: "BAGS & BACKPACKS",
      accessories: "ACCESSORIES",
      brands: "OFFICIAL AUTHORIZED BRANDS",
      guarantees: [
        "Free Overgrip, Edge Tape & Paddle Cover",
        "Official Warranty",
        "100% Authentic",
        "Free Nationwide Shipping",
      ],
    },
    product: {
      addToCart: "ADD TO CART",
      selectOption: "SELECT",
      outOfStock: "Out of Stock",
      newBadge: "New",
      freeGiftBadge: "FREE SHIRT",
    },
    common: {
      home: "Home",
      shop: "Shop",
      cart: "Cart",
      checkout: "Checkout",
      account: "My Account",
      blog: "Blog",
      contact: "Contact",
      search: "Search",
      viewAll: "View All →",
      backToShop: "Return to Shop",
      continueShopping: "Continue Shopping",
      noData: "No items available",
      loading: "Loading...",
      retry: "Try again",
    },
    footer: {
      productsHeading: "PRODUCTS",
      infoHeading: "INFORMATION",
      blogHeading: "BLOG",
      products: [
        { label: "Pickleball Paddles", href: "/vot-pickleball" },
        { label: "Bags & Backpacks", href: "/balo-tui-pickleball" },
        { label: "Pickleball Shoes", href: "/giay-pickleball" },
        { label: "Pickleball Balls", href: "/bong-pickleball" },
        { label: "Pickleball Accessories", href: "/phu-kien-pickleball" },
        { label: "11Sport Sportswear", href: "/danh-muc-san-pham/thoi-trang" },
      ],
      info: [
        { label: "Shipping Policy", href: "/chinh-sach-van-chuyen" },
        { label: "Warranty & Returns", href: "/hoan-tien_tra-ve" },
        { label: "Privacy Policy", href: "/chinh-sach-bao-mat" },
        { label: "Terms of Use", href: "/quy-dinh-su-dung" },
        { label: "Paddle Trade-In", href: "/thu-cu-doi-moi" },
        { label: "About 11Sport", href: "/ve-chung-toi" },
        { label: "My Account", href: "/tai-khoan" },
        { label: "Blog", href: "/tin-tuc" },
      ],
      blog: [
        { label: "Pickleball Techniques", href: "/tin-tuc/kien-thuc-pickleball" },
        { label: "Paddle Reviews", href: "/tin-tuc/review-danh-gia" },
        { label: "News & Community", href: "/tin-tuc/tin-tuc-cong-dong" },
        {
          label: "Gear Buying Guides",
          href: "/tin-tuc/tu-van-dung-cu-pickleball",
        },
      ],
    },
  },
} as const;
