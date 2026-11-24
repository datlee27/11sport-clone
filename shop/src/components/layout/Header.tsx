"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import {
  formatPriceByCurrency,
  resolveMediaUrl,
  type CurrencyCode,
} from "@/lib/format";
import { getLocaleFromPath, localizeHref, STORE_I18N } from "@/lib/i18n";
import type { SiteSettingsData } from "@/lib/storefront";
import type {
  ArticleSummary,
  MenuNode,
  ProductListItem,
} from "@/types/storefront";

const BRANDS_A_K = [
  { label: "CRBN", href: "/vot-pickleball-crbn" },
  { label: "Facolos", href: "/vot-pickleball-facolos" },
  { label: "Franklin", href: "/vot-pickleball-franklin" },
  { label: "Gearbox", href: "/vot-pickleball-gearbox" },
  {
    label: "Honolulu",
    href: "/danh-muc-san-pham/vot-pickleball/vot-pickleball-honolulu",
  },
  { label: "Joola", href: "/vot-pickleball-joola" },
  { label: "Kaitashi", href: "/vot-pickleball-kaitashi" },
  { label: "Kaiwin", href: "/vot-pickleball-kaiwin" },
  { label: "Kamito", href: "/vot-pickleball-kamito" },
  { label: "KBS", href: "/vot-pickleball-kbs" },
];

const BRANDS_L_Z = [
  { label: "Loco", href: "/vot-pickleball-loco" },
  { label: "Luzz", href: "/vot-pickleball-luzz" },
  {
    label: "Proton",
    href: "/danh-muc-san-pham/vot-pickleball/vot-pickleball-proton",
  },
  { label: "RPM", href: "/vot-pickleball-rpm" },
  { label: "Selkirk", href: "/vot-pickleball-selkirk" },
  {
    label: "Six Zero",
    href: "/danh-muc-san-pham/vot-pickleball/vot-pickleball-six-zero",
  },
  { label: "Soxter", href: "/vot-pickleball-soxter" },
  { label: "Sypik", href: "/vot-pickleball-sypik" },
  {
    label: "Thunder",
    href: "/danh-muc-san-pham/vot-pickleball/vot-pickleball-thunder",
  },
  { label: "Vole", href: "/vot-pickleball-vole" },
  { label: "Wika", href: "/vot-pickleball-wika" },
  {
    label: "Zocker",
    href: "/danh-muc-san-pham/vot-pickleball/vot-pickleball-zocker",
  },
];

const FEATURED_BRAND_ORDER = [
  "/vot-pickleball-joola",
  "/vot-pickleball-selkirk",
  "/vot-pickleball-kamito",
  "/vot-pickleball-sypik",
  "/vot-pickleball-facolos",
  "/vot-pickleball-crbn",
];

const FEATURED_BRAND_SET = new Set(FEATURED_BRAND_ORDER);
const ALL_PADDLE_BRANDS = [...BRANDS_A_K, ...BRANDS_L_Z];
const FEATURED_PADDLE_BRANDS = FEATURED_BRAND_ORDER.map((href) =>
  ALL_PADDLE_BRANDS.find((b) => b.href === href)
).filter((b): b is { label: string; href: string } => Boolean(b));
const OTHER_BRANDS_A_K = BRANDS_A_K.filter(
  (b) => !FEATURED_BRAND_SET.has(b.href)
);
const OTHER_BRANDS_L_Z = BRANDS_L_Z.filter(
  (b) => !FEATURED_BRAND_SET.has(b.href)
);

function stripPaddlePrefix(label: string): string {
  return label.replace(/^(Vợt Pickleball|Pickleball Paddle|Paddle)\s+/i, "");
}

interface NavItem {
  label: string;
  href: string;
  isHighlightedMint?: boolean;
  isMegaBrands?: boolean;
  children?: Array<{ label: string; href: string }>;
}

function VietnamFlagSvg({
  sizeClass = "w-full h-full",
}: {
  sizeClass?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={`${sizeClass} block`} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#DA251D" />
      <polygon
        points="12,5.5 13.6,10.2 18.5,10.2 14.5,13.1 16.0,17.8 12,14.9 8.0,17.8 9.5,13.1 5.5,10.2 10.4,10.2"
        fill="#FFCD00"
      />
    </svg>
  );
}

function UsFlagSvg({ sizeClass = "w-full h-full" }: { sizeClass?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${sizeClass} block`} aria-hidden="true">
      <defs>
        <clipPath id="headerUsFlagCircle">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#headerUsFlagCircle)">
        <rect width="24" height="24" fill="#FFFFFF" />
        <path
          d="M0 3.5h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0z"
          fill="#B80411"
        />
        <rect width="12" height="12" fill="#1B4F9C" />
        <circle cx="3.5" cy="3.5" r="1" fill="#FFFFFF" />
        <circle cx="7.5" cy="3.5" r="1" fill="#FFFFFF" />
        <circle cx="5.5" cy="6.2" r="1" fill="#FFFFFF" />
        <circle cx="3.5" cy="9" r="1" fill="#FFFFFF" />
        <circle cx="7.5" cy="9" r="1" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

function PhpFlagSvg({ sizeClass = "w-full h-full" }: { sizeClass?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${sizeClass} block`} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#CE1126" />
      <path d="M0 0h24v12H0z" fill="#0038A8" />
      <polygon points="0,0 12,12 0,24" fill="#FFFFFF" />
      <circle cx="4.5" cy="12" r="2.2" fill="#FCD116" />
    </svg>
  );
}

const CURRENCY_OPTIONS: Array<{
  code: CurrencyCode;
  label: string;
}> = [
  { code: "VND", label: "VND, ₫" },
  { code: "PHP", label: "PHP, ₱" },
  { code: "USD", label: "USD, $" },
];

function CurrencyFlag({ code }: { code: CurrencyCode }) {
  if (code === "PHP") return <PhpFlagSvg />;
  if (code === "USD") return <UsFlagSvg />;
  return <VietnamFlagSvg />;
}

/**
 * Global Header 1:1 with live mipik.vn (Desktop 70px & Mobile 70px).
 * - Dark forest green #224e40, container max 1290px
 * - Desktop: Wordmark | 7 nav items | Search box (46x46), Cart, VI/EN circular flags, 3-currency dropdown
 * - Supports dynamic BE `/public/menu` items (falling back cleanly to localized STORE_NAV)
 */
export function Header({
  settings,
  menuItems,
}: {
  settings?: SiteSettingsData | null;
  menuItems?: MenuNode[];
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);
  const isEn = locale === "en";
  const t = STORE_I18N[locale].nav;

  const rawBrand = settings?.siteName || "11Sport";
  const wordmark = rawBrand.toLowerCase();
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(
    null
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchSettledQuery, setSearchSettledQuery] = useState("");
  const [searchFailed, setSearchFailed] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: ProductListItem[];
    articles: ArticleSummary[];
  }>({ products: [], articles: [] });

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const activeCurrency: CurrencyCode = mounted ? currency : "VND";

  const cleanBasePath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const viTarget = cleanBasePath;
  const enTarget = cleanBasePath === "/" ? "/en" : `/en${cleanBasePath}`;

  const navItems = useMemo<NavItem[]>(() => {
    if (!isEn && menuItems && menuItems.length > 0) {
      return [...menuItems]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => ({
          label: m.label,
          href: localizeHref(m.url, locale),
          isHighlightedMint:
            Boolean(m.badge) ||
            m.url.includes("thoi-trang") ||
            m.url.includes("fashion"),
          isMegaBrands:
            m.url === "/vot-pickleball" || (m.children?.length ?? 0) > 8,
          children: (m.children ?? [])
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((c) => ({
              label: c.label,
              href: localizeHref(c.url, locale),
            })),
        }));
    }

    const defaults: NavItem[] = [
      {
        label: t.paddles,
        href: localizeHref("/vot-pickleball", locale),
        isMegaBrands: true,
      },
      {
        label: t.fashion,
        href: localizeHref("/danh-muc-san-pham/thoi-trang", locale),
        isHighlightedMint: true,
        children: [
          {
            label: t.subCombo,
            href: localizeHref("/danh-muc-san-pham/thoi-trang/combo-11sport", locale),
          },
          {
            label: t.subShirt,
            href: localizeHref("/danh-muc-san-pham/thoi-trang/ao-11sport", locale),
          },
          {
            label: t.subCap,
            href: localizeHref("/danh-muc-san-pham/thoi-trang/non-11sport", locale),
          },
          {
            label: t.subBag,
            href: localizeHref("/danh-muc-san-pham/thoi-trang/tui-11sport", locale),
          },
          {
            label: t.subSock,
            href: localizeHref("/danh-muc-san-pham/thoi-trang/tat-11sport", locale),
          },
        ],
      },
      {
        label: t.shoes,
        href: localizeHref("/giay-pickleball", locale),
        children: [
          { label: t.subShoesAsics, href: localizeHref("/giay-asics", locale) },
          {
            label: t.subShoesSkechers,
            href: localizeHref("/giay-skechers", locale),
          },
          {
            label: t.subShoesOn,
            href: localizeHref(
              "/danh-muc-san-pham/giay-pickleball/giay-on",
              locale
            ),
          },
          {
            label: t.subShoesKaitashi,
            href: localizeHref(
              "/danh-muc-san-pham/giay-pickleball/giay-kaitashi",
              locale
            ),
          },
        ],
      },
      {
        label: t.bags,
        href: localizeHref("/balo-tui-pickleball", locale),
      },
      {
        label: t.accessories,
        href: localizeHref("/phu-kien-pickleball", locale),
      },
      {
        label: t.blog,
        href: localizeHref("/tin-tuc", locale),
        children: [
          {
            label: t.subBlogReview,
            href: localizeHref("/tin-tuc/review-danh-gia", locale),
          },
          {
            label: t.subBlogKnowledge,
            href: localizeHref("/tin-tuc/kien-thuc-pickleball", locale),
          },
          {
            label: t.subBlogAdvice,
            href: localizeHref("/tin-tuc/tu-van-dung-cu-pickleball", locale),
          },
          {
            label: t.subBlogCommunity,
            href: localizeHref("/tin-tuc/tin-tuc-cong-dong", locale),
          },
        ],
      },
      {
        label: t.contact,
        href: localizeHref("/lien-he", locale),
      },
    ];

    return defaults;
  }, [isEn, locale, menuItems, t]);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults({ products: [], articles: [] });
      setIsSearching(false);
      setSearchSettledQuery("");
      setSearchFailed(false);
      return;
    }
    const controller = new AbortController();
    setIsSearching(true);
    setSearchFailed(false);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-preview?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        if (res.ok) {
          const json = await res.json();
          setSearchResults({
            products: json.products ?? [],
            articles: json.articles ?? [],
          });
          setSearchSettledQuery(q);
          setSearchFailed(false);
        } else {
          setSearchResults({ products: [], articles: [] });
          setSearchSettledQuery(q);
          setSearchFailed(true);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSearchResults({ products: [], articles: [] });
        setSearchSettledQuery(q);
        setSearchFailed(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setCurrencyOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(e.target as Node)
      ) {
        setCurrencyOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const handleMouseEnter = (label: string, hasDropdown: boolean) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(hasDropdown ? label : null);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(
      localizeHref(`/tim-kiem?q=${encodeURIComponent(q)}`, locale)
    );
  };

  const currentCurrencyMeta =
    CURRENCY_OPTIONS.find((opt) => opt.code === activeCurrency) ||
    CURRENCY_OPTIONS[0]!;

  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLowerCase();
  const isSearchPreviewPending =
    Boolean(trimmedSearchQuery) &&
    (isSearching || searchSettledQuery !== normalizedSearchQuery);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 text-white ${
          scrolled ? "bg-store-forest-dark shadow-md" : "bg-store-forest"
        }`}
      >
        <div className="max-w-container mx-auto px-2.5 sm:px-3.5 lg:px-4 xl:px-5 h-[70px] flex items-center justify-between gap-1.5 sm:gap-2 xl:gap-3">
          {/* Mobile Left: Hamburger + Search bordered icon buttons */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={isEn ? "Open category menu" : "Mở menu danh mục"}
              className="w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-md border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Menu className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={isEn ? "Open search" : "Mở tìm kiếm"}
              className="w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-md border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Search className="w-[17px] h-[17px]" aria-hidden="true" />
            </button>
          </div>

          {/* Brand Wordmark (left on desktop, centered on mobile) */}
          <Link
            href={isEn ? "/en" : "/"}
            className="text-[22px] sm:text-[26px] lg:text-[23px] xl:text-[28px] font-extrabold tracking-tight text-white shrink-0 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            {wordmark}
          </Link>

          {/* Desktop 7-Item Navigation */}
          <nav
            aria-label={isEn ? "Main navigation" : "Danh mục chính"}
            className="hidden lg:flex items-center lg:gap-2 xl:gap-5 shrink-0"
          >
            {navItems.map((item) => {
              const hasDropdown = Boolean(
                item.isMegaBrands || (item.children && item.children.length > 0)
              );
              const isOpen = activeMenu === item.label;

              return (
                <div
                  key={item.label}
                  className="relative shrink-0"
                  onMouseEnter={() =>
                    handleMouseEnter(item.label, hasDropdown)
                  }
                  onMouseLeave={handleMouseLeave}
                  onFocus={(e) => {
                    if (
                      !e.currentTarget.contains(e.relatedTarget as Node | null)
                    ) {
                      handleMouseEnter(item.label, hasDropdown);
                    }
                  }}
                  onBlur={(e) => {
                    if (
                      !e.currentTarget.contains(e.relatedTarget as Node | null)
                    ) {
                      setActiveMenu((prev) =>
                        prev === item.label ? null : prev
                      );
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && isOpen) {
                      e.stopPropagation();
                      setActiveMenu(null);
                      const trigger =
                        e.currentTarget.querySelector<HTMLElement>(
                          "button[aria-expanded], a"
                        );
                      trigger?.focus();
                    }
                  }}
                >
                  {item.isHighlightedMint ? (
                    <div className="mipik-mint-pill inline-flex items-center gap-0.5 h-8 lg:px-2.5 xl:px-[13px] rounded-full bg-store-mint-bg border border-store-mint-border text-store-mint-ink lg:text-[12px] xl:text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0">
                      <Link
                        href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:underline"
                      >
                        {item.label}
                      </Link>
                      {hasDropdown && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                          aria-label={
                            isEn
                              ? `Toggle ${item.label} submenu`
                              : `Mở danh mục con ${item.label}`
                          }
                          onClick={() =>
                            setActiveMenu(isOpen ? null : item.label)
                          }
                          className="inline-flex items-center justify-center w-5 h-6 -mr-1 rounded-full hover:bg-store-mint-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
                        >
                          <ChevronDown
                            className={`w-3 h-3 text-store-mint-ink shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0">
                      <Link
                        href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center py-2 lg:text-[12px] xl:text-[13px] font-medium uppercase tracking-wide text-white/95 hover:text-store-cream transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
                      >
                        {item.label}
                      </Link>
                      {hasDropdown && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                          aria-label={
                            isEn
                              ? `Toggle ${item.label} submenu`
                              : `Mở danh mục con ${item.label}`
                          }
                          onClick={() =>
                            setActiveMenu(isOpen ? null : item.label)
                          }
                          className="inline-flex items-center justify-center w-5 h-7 rounded hover:bg-white/10 text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <ChevronDown
                            className={`w-3 h-3 opacity-80 shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                  )}

                  {/* MegaMenu 2-column (Featured Brands + A-K / L-Z, compact & keyboard accessible) */}
                  {isOpen && item.isMegaBrands && (
                    <div className="absolute left-0 top-full pt-2 z-50">
                      {item.children && item.children.length > 0 ? (
                        <div className="w-[460px] rounded-md bg-white border border-store-border-sage shadow-drawer p-5 space-y-4 text-ink-primary">
                          <div className="grid grid-cols-2 gap-6">
                            {[
                              item.children.slice(
                                0,
                                Math.ceil(item.children.length / 2)
                              ),
                              item.children.slice(
                                Math.ceil(item.children.length / 2)
                              ),
                            ].map((col, colIdx) => (
                              <ul key={colIdx} className="space-y-1">
                                {col.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={() => setActiveMenu(null)}
                                      className="block py-1 text-sm font-medium text-ink-secondary hover:text-store-forest hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:text-store-forest focus-visible:underline"
                                    >
                                      {stripPaddlePrefix(child.label)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-store-border-sage">
                            <Link
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className="inline-flex items-center text-xs font-bold uppercase tracking-wide text-store-forest hover:underline"
                            >
                              {isEn
                                ? "View all Paddles →"
                                : "Xem tất cả Vợt Pickleball →"}
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[490px] rounded-md bg-white border border-store-border-sage shadow-drawer p-5 space-y-4 text-ink-primary">
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-store-forest border-b border-store-border-sage pb-1.5 mb-2.5">
                              {isEn ? "Featured Brands" : "Hãng nổi bật"}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {FEATURED_PADDLE_BRANDS.map((b) => (
                                <Link
                                  key={b.href}
                                  href={localizeHref(b.href, locale)}
                                  onClick={() => setActiveMenu(null)}
                                  className="px-3 py-1.5 rounded-md bg-store-surface-sage border border-store-border-sage text-sm font-bold text-store-forest hover:bg-store-forest hover:text-white transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
                                >
                                  {b.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wider text-store-forest border-b border-store-border-sage pb-1.5 mb-2">
                                A–K
                              </p>
                              <ul className="space-y-1">
                                {OTHER_BRANDS_A_K.map((b) => (
                                  <li key={b.href}>
                                    <Link
                                      href={localizeHref(b.href, locale)}
                                      onClick={() => setActiveMenu(null)}
                                      className="block py-1 text-sm font-medium text-ink-secondary hover:text-store-forest hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:text-store-forest focus-visible:underline"
                                    >
                                      {b.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wider text-store-forest border-b border-store-border-sage pb-1.5 mb-2">
                                L–Z
                              </p>
                              <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                                {OTHER_BRANDS_L_Z.map((b) => (
                                  <li key={b.href}>
                                    <Link
                                      href={localizeHref(b.href, locale)}
                                      onClick={() => setActiveMenu(null)}
                                      className="block py-1 text-sm font-medium text-ink-secondary hover:text-store-forest hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:text-store-forest focus-visible:underline"
                                    >
                                      {b.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-store-border-sage flex items-center justify-between">
                            <span className="text-xs text-ink-muted">
                              {isEn
                                ? "22 official pickleball paddle brands"
                                : "22 thương hiệu vợt chính hãng"}
                            </span>
                            <Link
                              href={localizeHref("/vot-pickleball", locale)}
                              onClick={() => setActiveMenu(null)}
                              className="inline-flex items-center text-xs font-bold uppercase tracking-wide text-store-forest hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest rounded"
                            >
                              {isEn
                                ? "View all Paddles →"
                                : "Xem tất cả Vợt →"}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Single-column Submenu Dropdown */}
                  {isOpen && !item.isMegaBrands && item.children && (
                    <div className="absolute left-0 top-full pt-2 z-50">
                      <ul className="w-60 rounded-md bg-white border border-store-border-sage shadow-drawer py-1.5 text-ink-primary">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setActiveMenu(null)}
                              className="block px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-store-surface-sage hover:text-store-forest focus-visible:outline-none focus-visible:bg-store-surface-sage focus-visible:text-store-forest"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Utility Actions (Search box -> Cart -> VI flag -> EN flag -> 3-Currency dropdown) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-2 xl:gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={isEn ? "Search products" : "Tìm kiếm sản phẩm"}
              className="hidden lg:inline-flex lg:w-9 lg:h-9 xl:w-[46px] xl:h-[46px] rounded-[10px] border border-white/25 bg-transparent hover:bg-white/10 items-center justify-center text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Search
                className="lg:w-[18px] lg:h-[18px] xl:w-[22px] xl:h-[22px]"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={
                isEn ? `Cart (${totalItems})` : `Giỏ hàng (${totalItems} sản phẩm)`
              }
              className="relative inline-flex items-center justify-center w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 lg:w-10 lg:h-10 rounded-md text-white hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ShoppingCart className="w-[22px] h-[22px]" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-store-mint-bg text-store-mint-ink font-mono text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1.5 lg:gap-1.5 xl:gap-3">
              <a
                href={viTarget}
                aria-label="Tiếng Việt"
                aria-current={!isEn ? "page" : undefined}
                className={`w-6 h-6 lg:w-6 lg:h-6 xl:w-[26px] xl:h-[26px] rounded-full overflow-hidden flex items-center justify-center shrink-0 ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  !isEn
                    ? "ring-white"
                    : "ring-white/40 opacity-85 hover:opacity-100"
                }`}
              >
                <VietnamFlagSvg />
              </a>
              <a
                href={enTarget}
                aria-label="English"
                aria-current={isEn ? "page" : undefined}
                className={`w-6 h-6 lg:w-6 lg:h-6 xl:w-[26px] xl:h-[26px] rounded-full overflow-hidden flex items-center justify-center shrink-0 ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isEn
                    ? "ring-white"
                    : "ring-white/40 opacity-85 hover:opacity-100"
                }`}
              >
                <UsFlagSvg />
              </a>
            </div>

            {/* White 3-Currency Dropdown Pill (Desktop only, matching live mipik.vn) */}
            <div
              ref={currencyDropdownRef}
              className="relative hidden lg:block shrink-0"
            >
              <button
                type="button"
                onClick={() => setCurrencyOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={currencyOpen}
                aria-label={isEn ? "Switch currency" : "Chuyển đổi tiền tệ"}
                className="inline-flex items-center lg:gap-1 xl:gap-1.5 h-7 lg:px-1.5 xl:px-2 rounded-full bg-white text-ink-primary text-[11px] font-bold shadow-sm whitespace-nowrap shrink-0 hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <CurrencyFlag code={activeCurrency} />
                </span>
                <span>{currentCurrencyMeta.label}</span>
                <ChevronDown
                  className="w-3 h-3 text-ink-muted shrink-0"
                  aria-hidden="true"
                />
              </button>

              {currencyOpen && (
                <ul
                  role="listbox"
                  aria-label="Chọn đơn vị tiền tệ"
                  className="absolute right-0 top-full mt-1.5 w-28 rounded-md bg-white border border-store-border-sage shadow-drawer py-1 z-50"
                >
                  {CURRENCY_OPTIONS.map((opt) => {
                    const selected = opt.code === activeCurrency;
                    return (
                      <li key={opt.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            setCurrency(opt.code);
                            setCurrencyOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 flex items-center gap-2 text-left text-[11.5px] font-semibold transition-colors ${
                            selected
                              ? "bg-store-surface-sage text-store-forest font-bold"
                              : "text-ink-primary hover:bg-[#f4f7f5]"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                            <CurrencyFlag code={opt.code} />
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Centered Search Lightbox Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? "Search products" : "Tìm kiếm sản phẩm"}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-lg bg-white border border-store-border-sage shadow-drawer p-3 sm:p-5 space-y-3 sm:space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 min-w-0 h-11 sm:h-12 px-3.5 sm:px-4 rounded-md border border-store-border-sage text-base text-ink-primary focus:outline-none focus:border-store-forest focus:ring-2 focus:ring-store-forest/20"
              />
              <button
                type="submit"
                aria-label={isEn ? "Submit search" : "Tìm kiếm"}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-md bg-store-forest text-white flex items-center justify-center hover:bg-store-forest-hover transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-2"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label={isEn ? "Close search" : "Đóng tìm kiếm"}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-md border border-store-border-sage flex items-center justify-center text-ink-secondary hover:bg-store-surface-sage shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            {trimmedSearchQuery ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {isSearchPreviewPending ? (
                  <div
                    role="status"
                    className="py-6 text-center text-sm font-medium text-ink-secondary"
                  >
                    {isEn
                      ? `Searching for “${trimmedSearchQuery}”...`
                      : `Đang tìm kiếm “${trimmedSearchQuery}”...`}
                  </div>
                ) : searchFailed ? (
                  <div
                    role="status"
                    className="py-5 px-3 rounded-md bg-store-surface-sage text-center text-sm text-ink-secondary"
                  >
                    {isEn
                      ? "Could not load quick suggestions. Press Enter to view full search results."
                      : "Không thể tải gợi ý nhanh. Nhấn Enter để tìm kiếm toàn trang."}
                  </div>
                ) : searchResults.products.length === 0 &&
                  searchResults.articles.length === 0 ? (
                  <div
                    role="status"
                    className="py-5 px-3 rounded-md bg-store-surface-sage text-center space-y-1"
                  >
                    <p className="text-sm font-semibold text-ink-primary">
                      {isEn
                        ? `No matching results for “${trimmedSearchQuery}”.`
                        : `Không tìm thấy sản phẩm phù hợp cho “${trimmedSearchQuery}”.`}
                    </p>
                    <p className="text-xs text-ink-secondary">
                      {isEn
                        ? "Try keywords like Joola, Selkirk, Kamito, 16mm or browse all products."
                        : "Thử từ khóa khác như Joola, Selkirk, Kamito, 16mm hoặc xem tất cả kết quả."}
                    </p>
                  </div>
                ) : (
                  <>
                    {searchResults.products.length > 0 && (
                      <div className="divide-y divide-store-border-sage">
                        {searchResults.products.map((p) => (
                          <Link
                            key={p._id}
                            href={localizeHref(`/${p.slug}`, locale)}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between gap-3 py-2.5 px-2 hover:bg-store-surface-sage rounded"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-10 h-10 rounded border border-store-border-card bg-white shrink-0 overflow-hidden">
                                {resolveMediaUrl(p.thumbnailUrl) && (
                                  <Image
                                    src={resolveMediaUrl(p.thumbnailUrl)}
                                    alt={p.name}
                                    fill
                                    sizes="40px"
                                    className="object-contain p-0.5"
                                  />
                                )}
                              </div>
                              <span className="text-sm font-medium text-ink-primary truncate">
                                {p.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-store-forest shrink-0 tabular-nums">
                              {formatPriceByCurrency(
                                p.sellingPrice,
                                activeCurrency
                              )}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.articles.length > 0 && (
                      <div className="pt-2 border-t border-store-border-sage space-y-1">
                        <p className="px-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
                          {isEn ? "Related Articles" : "Bài viết liên quan"}
                        </p>
                        {searchResults.articles.slice(0, 3).map((a) => (
                          <Link
                            key={a._id}
                            href={localizeHref(`/${a.slug}`, locale)}
                            onClick={() => setSearchOpen(false)}
                            className="block py-2 px-2 text-sm font-medium text-ink-secondary hover:bg-store-surface-sage hover:text-store-forest rounded truncate"
                          >
                            {a.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <Link
                  href={localizeHref(
                    `/tim-kiem?q=${encodeURIComponent(trimmedSearchQuery)}`,
                    locale
                  )}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-center min-h-[42px] px-3 py-2.5 rounded bg-store-surface-sage text-xs font-bold text-store-forest hover:underline"
                >
                  {t.allResultsPrefix} &ldquo;{trimmedSearchQuery}&rdquo; →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? "Category menu" : "Menu danh mục"}
          className="fixed inset-0 z-50 bg-black/50 lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[300px] max-w-[85vw] h-full bg-white p-5 overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-store-border-sage pb-3">
                <span className="text-xl font-extrabold text-store-forest lowercase">
                  {wordmark}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={isEn ? "Close menu" : "Đóng menu"}
                  className="w-11 h-11 rounded-full border border-store-border-sage flex items-center justify-center text-ink-secondary hover:bg-store-surface-sage transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full h-11 pl-9 pr-3 rounded-full bg-store-form-bg border border-store-border-sage text-base sm:text-sm text-ink-primary focus:outline-none focus:border-store-forest"
                />
              </form>

              <ul className="divide-y divide-store-border-sage">
                {navItems.map((item) => {
                  const subList = item.isMegaBrands
                    ? ALL_PADDLE_BRANDS.map((b) => ({
                        label: b.label,
                        href: localizeHref(b.href, locale),
                      }))
                    : item.children;
                  const isExpanded = expandedMobileGroup === item.label;

                  return (
                    <li key={item.label} className="py-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`min-h-[40px] inline-flex items-center text-sm font-bold ${
                            item.isHighlightedMint
                              ? "px-3 py-1 rounded-full bg-store-mint-bg text-store-mint-ink"
                              : "text-ink-primary"
                          }`}
                        >
                          {item.label}
                        </Link>
                        {subList && subList.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMobileGroup(
                                isExpanded ? null : item.label
                              )
                            }
                            aria-expanded={isExpanded}
                            aria-label={
                              isEn
                                ? `Toggle ${item.label} submenu`
                                : `Mở danh mục con ${item.label}`
                            }
                            className="w-10 h-10 flex items-center justify-center rounded-md text-ink-muted hover:bg-store-surface-sage hover:text-store-forest shrink-0"
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>
                      {isExpanded && subList && (
                        <ul className="mt-1.5 mb-1 pl-3 space-y-1 border-l border-store-border-sage">
                          {subList.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center min-h-[36px] py-1 text-[13px] font-medium text-ink-secondary hover:text-store-forest"
                              >
                                {item.isMegaBrands
                                  ? stripPaddlePrefix(sub.label)
                                  : sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-4 border-t border-store-border-sage space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1">
                {CURRENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setCurrency(opt.code)}
                    className={`flex-1 min-h-[40px] py-1.5 rounded text-xs font-bold border ${
                      activeCurrency === opt.code
                        ? "bg-store-forest text-white border-store-forest"
                        : "bg-white text-ink-primary border-store-border-sage"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <Link
                href={localizeHref("/tai-khoan", locale)}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-full bg-store-forest hover:bg-store-forest-hover text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{t.accountAndOrders}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
