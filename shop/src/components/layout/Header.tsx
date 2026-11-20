"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface NavSubItem {
  label: string;
  href: string;
  badge?: "HOT" | "MỚI";
}

interface NavGroup {
  label: string;
  href: string;
  subcategories?: NavSubItem[];
  brands?: NavSubItem[];
  promo?: {
    title: string;
    subtitle: string;
    href: string;
  };
}

const NAV_ITEMS: NavGroup[] = [
  {
    label: "Vợt Pickleball",
    href: "/danh-muc/vot-pickleball",
    subcategories: [
      { label: "Vợt Carbon T700", href: "/danh-muc/vot-carbon-t700", badge: "HOT" },
      { label: "Vợt cho người mới", href: "/danh-muc/vot-nguoi-moi" },
      { label: "Vợt thi đấu chuyên nghiệp", href: "/danh-muc/vot-chuyen-nghiep" },
      { label: "Bóng Pickleball thi đấu", href: "/danh-muc/bong-pickleball" },
    ],
    brands: [
      { label: "JOOLA", href: "/thuong-hieu/joola", badge: "HOT" },
      { label: "Selkirk", href: "/thuong-hieu/selkirk" },
      { label: "CRBN", href: "/thuong-hieu/crbn" },
      { label: "Six Zero", href: "/thuong-hieu/six-zero", badge: "MỚI" },
    ],
    promo: {
      title: "Bộ sưu tập Vợt 2026",
      subtitle: "Tặng kèm quấn cán chính hãng & giảm thêm 5% khi mua từ 2 cây.",
      href: "/danh-muc/vot-pickleball",
    },
  },
  {
    label: "Giày thể thao",
    href: "/danh-muc/giay-the-thao",
    subcategories: [
      { label: "Giày Pickleball & Tennis", href: "/danh-muc/giay-pickleball", badge: "HOT" },
      { label: "Giày Cầu lông", href: "/danh-muc/giay-cau-long" },
      { label: "Vớ thể thao chuyên dụng", href: "/danh-muc/vo-the-thao" },
    ],
    brands: [
      { label: "ASICS", href: "/thuong-hieu/asics" },
      { label: "Mizuno", href: "/thuong-hieu/mizuno" },
      { label: "Yonex", href: "/thuong-hieu/yonex" },
    ],
    promo: {
      title: "Giày Court bám sân tối đa",
      subtitle: "Hỗ trợ đổi size miễn phí trong 7 ngày tại 3 showroom.",
      href: "/danh-muc/giay-the-thao",
    },
  },
  {
    label: "Thời trang",
    href: "/danh-muc/thoi-trang",
    subcategories: [
      { label: "Áo thể thao nam", href: "/danh-muc/ao-nam" },
      { label: "Áo & Váy thể thao nữ", href: "/danh-muc/thoi-trang-nu", badge: "MỚI" },
      { label: "Quần short thi đấu", href: "/danh-muc/quan-short" },
    ],
    brands: [
      { label: "11 Sport Pro", href: "/thuong-hieu/11-sport" },
      { label: "Kamito", href: "/thuong-hieu/kamito" },
    ],
  },
  {
    label: "Balo & Túi",
    href: "/danh-muc/balo-tui",
    subcategories: [
      { label: "Balo đựng vợt Pickleball", href: "/danh-muc/balo-vot" },
      { label: "Túi thể thao du lịch", href: "/danh-muc/tui-the-thao" },
    ],
  },
  {
    label: "Phụ kiện",
    href: "/danh-muc/phu-kien",
    subcategories: [
      { label: "Quấn cán vợt (Overgrip)", href: "/danh-muc/quan-can" },
      { label: "Bảo vệ viền vợt & Tẩy mặt vợt", href: "/danh-muc/bao-ve-vot" },
      { label: "Nón & Băng trán thể thao", href: "/danh-muc/non-bang-tran" },
    ],
  },
  {
    label: "Tin tức",
    href: "/tin-tuc",
  },
];

export function Header() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
  };

  const activeGroup = NAV_ITEMS.find(
    (item) => item.label === activeMenu && (item.subcategories?.length || item.brands?.length)
  );

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-primary-hover text-white text-xs h-8 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          <p className="truncate font-medium">
            Freeship toàn quốc đơn từ 500.000₫ • Chính hãng 100%
          </p>
          <a
            href="tel:0900000011"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono font-semibold hover:text-accent-volt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-volt rounded"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hotline: 0900.000.011</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className="sticky top-0 z-40 bg-white border-b border-surface-border"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-[60px] lg:h-[72px] flex items-center justify-between gap-2">
          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 shrink-0 min-h-[44px] px-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-primary text-white font-mono font-bold text-sm tracking-tight">
              11
            </span>
            <span className="font-extrabold text-lg lg:text-xl tracking-tight text-ink-primary">
              11 SPORT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Danh mục chính" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = Boolean(
                item.subcategories?.length || item.brands?.length
              );
              const isOpen = activeMenu === item.label;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => handleMouseEnter(item.label, hasDropdown)}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                      isOpen
                        ? "text-brand-primary bg-brand-tint"
                        : "text-ink-primary hover:text-brand-primary hover:bg-surface-subtle"
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm sản phẩm"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-primary hover:bg-surface-muted hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            <Link
              href="/tai-khoan"
              aria-label="Tài khoản khách hàng"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-primary hover:bg-surface-muted hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Mở giỏ hàng (${totalItems} sản phẩm)`}
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-primary hover:bg-surface-muted hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-hot text-white font-mono text-[11px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Panel */}
        {activeGroup && (
          <div
            onMouseEnter={() => handleMouseEnter(activeGroup.label, true)}
            className="hidden lg:block absolute inset-x-0 top-full bg-white border-b border-surface-border shadow-drawer z-40"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
              {activeGroup.subcategories && (
                <div className="col-span-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                    Danh mục {activeGroup.label}
                  </p>
                  <ul className="space-y-1.5">
                    {activeGroup.subcategories.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-2 py-1.5 text-sm font-medium text-ink-secondary hover:text-brand-primary transition-colors"
                        >
                          <span>{sub.label}</span>
                          {sub.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                sub.badge === "HOT"
                                  ? "bg-accent-hot text-white"
                                  : "bg-accent-volt text-ink-primary"
                              }`}
                            >
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeGroup.brands && (
                <div className="col-span-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                    Thương hiệu nổi bật
                  </p>
                  <ul className="space-y-1.5">
                    {activeGroup.brands.map((brand) => (
                      <li key={brand.href}>
                        <Link
                          href={brand.href}
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-2 py-1.5 text-sm font-medium text-ink-secondary hover:text-brand-primary transition-colors"
                        >
                          <span>{brand.label}</span>
                          {brand.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                brand.badge === "HOT"
                                  ? "bg-accent-hot text-white"
                                  : "bg-accent-volt text-ink-primary"
                              }`}
                            >
                              {brand.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeGroup.promo && (
                <div className="col-span-4">
                  <div className="rounded-xl bg-brand-tint border border-brand-border p-4 h-full flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-brand-primary text-white text-[11px] font-bold mb-2">
                        Ưu đãi 11 Sport
                      </span>
                      <h3 className="text-base font-bold text-ink-primary">
                        {activeGroup.promo.title}
                      </h3>
                      <p className="text-sm text-ink-secondary mt-1">
                        {activeGroup.promo.subtitle}
                      </p>
                    </div>
                    <Link
                      href={activeGroup.promo.href}
                      onClick={() => setActiveMenu(null)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover mt-4"
                    >
                      <span>Khám phá ngay</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng di động"
        >
          <div
            className="fixed inset-0 bg-ink-primary/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[85vw] max-w-[360px] bg-white h-full shadow-drawer flex flex-col z-10">
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-surface-border">
              <span className="font-extrabold text-lg text-ink-primary">
                11 SPORT
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const hasSub = Boolean(item.subcategories?.length);
                const isExpanded = expandedMobileGroup === item.label;
                return (
                  <div
                    key={item.label}
                    className="border-b border-surface-border last:border-b-0 pb-1"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-3 text-base font-semibold text-ink-primary min-h-[44px] flex items-center"
                      >
                        {item.label}
                      </Link>
                      {hasSub && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobileGroup(isExpanded ? null : item.label)
                          }
                          aria-label={`Mở danh mục con ${item.label}`}
                          aria-expanded={isExpanded}
                          className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-muted"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                    {hasSub && isExpanded && (
                      <ul className="pl-3 pb-2 space-y-1">
                        {item.subcategories?.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2.5 text-sm font-medium text-ink-secondary hover:text-brand-primary min-h-[44px]"
                            >
                              <span>{sub.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-border bg-surface-subtle space-y-2">
              <Link
                href="/tai-khoan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border bg-white text-sm font-semibold text-ink-primary hover:bg-surface-muted"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Tài khoản của tôi</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Lightbox */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-sm px-4 pt-12 sm:pt-16"
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm sản phẩm và bài viết"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-drawer overflow-hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 px-4 py-3 border-b border-surface-border"
            >
              <Search className="w-5 h-5 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm vợt Pickleball, giày Asics, thương hiệu Joola..."
                className="flex-1 h-11 text-base text-ink-primary placeholder:text-ink-muted focus:outline-none"
                aria-label="Từ khóa tìm kiếm"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Đóng tìm kiếm"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-secondary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            <div className="p-4 sm:p-6 space-y-4">
              {!debouncedQuery ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                    Từ khóa phổ biến
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Vợt Joola",
                      "Giày Asics",
                      "Vợt Carbon T700",
                      "Bóng Pickleball",
                      "Quấn cán",
                    ].map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
                        }}
                        className="min-h-[44px] px-3.5 rounded-lg bg-surface-subtle border border-surface-border text-sm font-medium text-ink-secondary hover:border-brand-primary hover:text-brand-primary transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-ink-secondary">
                    Nhấn Enter để tìm kiếm kết quả cho{" "}
                    <strong className="text-ink-primary">
                      &ldquo;{debouncedQuery}&rdquo;
                    </strong>
                  </p>
                  <Link
                    href={`/tim-kiem?q=${encodeURIComponent(debouncedQuery)}`}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
                  >
                    <span>
                      Xem tất cả kết quả cho &ldquo;{debouncedQuery}&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
