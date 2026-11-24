"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { BreadcrumbBar } from "@/components/store/StorefrontDesignSystem";
import { formatPriceByCurrency } from "@/lib/format";
import { getLocaleFromPath, localizeHref } from "@/lib/i18n";
import { useCurrencyStore } from "@/store/currencyStore";
import type {
  BrandSummary,
  CategorySummary,
  ProductFacets,
  ProductListItem,
} from "@/types/storefront";

interface CatalogClientProps {
  products: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  facets?: ProductFacets;
  subCategories?: CategorySummary[];
  hubBrands?: BrandSummary[];
  hideBrandFilter?: boolean;
  breadcrumbs?: Array<{ name: string; href?: string }>;
  showSortToolbar?: boolean;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Sắp xếp theo mức độ phổ biến" },
  { value: "bestseller", label: "Sắp xếp theo xếp hạng trung bình" },
  { value: "newest", label: "Sắp xếp theo mới nhất" },
  { value: "price_asc", label: "Sắp xếp theo giá: thấp đến cao" },
  { value: "price_desc", label: "Sắp xếp theo giá: cao đến thấp" },
];

const PRICE_RANGES = [
  { id: "under-2m", label: "Dưới 2 triệu", min: "", max: "2000000" },
  { id: "2m-4m", label: "2 – 4 triệu", min: "2000000", max: "4000000" },
  { id: "over-4m", label: "Trên 4 triệu", min: "4000000", max: "" },
] as const;

const COLOR_DOT_HEX: Record<string, string> = {
  "blaze red": "#B80411",
  "mint green": "#428771",
  "midnight navy": "#1B4F9C",
  "tour gold": "#B26000",
  "forest green": "#224E40",
  "crimson carbon": "#D92D20",
  "regal gold": "#B26000",
  "midnight black": "#0A0A0A",
};

type DesktopFilterKey = "brand" | "price" | "size" | "color" | null;

/**
 * Full-width Product Archive Grid with Pickleball Horizontal Filter Bar (md+)
 * & Mobile Filter Sheet (<md), zero 260px left sidebar.
 */
export function CatalogClient({
  products,
  meta,
  facets,
  subCategories,
  hubBrands,
  hideBrandFilter = false,
  breadcrumbs,
  showSortToolbar = true,
}: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);
  const searchParams = useSearchParams();
  const currency = useCurrencyStore((s) => s.currency);

  const [mounted, setMounted] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<DesktopFilterKey>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const currentBrand = searchParams.get("brand") || "";
  const currentPriceMin = searchParams.get("priceMin") || "";
  const currentPriceMax = searchParams.get("priceMax") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentSort = searchParams.get("sort") || "featured";

  const [draftBrand, setDraftBrand] = useState(currentBrand);
  const [draftPriceMin, setDraftPriceMin] = useState(currentPriceMin);
  const [draftPriceMax, setDraftPriceMax] = useState(currentPriceMax);
  const [draftSize, setDraftSize] = useState(currentSize);
  const [draftColor, setDraftColor] = useState(currentColor);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileDrawerOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setSortOpen(false);
      }
      if (filterBarRef.current && !filterBarRef.current.contains(target)) {
        setOpenFilter(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSortOpen(false);
        setOpenFilter(null);
        setMobileDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeCurrency = mounted ? currency : "VND";

  const brandOptions = useMemo(() => {
    if (hideBrandFilter) return [];
    const facetBrands = facets?.brands ?? [];
    const countBySlug = new Map(
      facetBrands.map((b) => [b.slug.toLowerCase(), b.count])
    );
    if (hubBrands && hubBrands.length > 0) {
      return hubBrands.map((b) => ({
        name: b.name,
        slug: b.slug,
        count: countBySlug.get(b.slug.toLowerCase()),
      }));
    }
    return facetBrands.map((b) => ({
      name: b.name,
      slug: b.slug,
      count: b.count,
    }));
  }, [hideBrandFilter, facets?.brands, hubBrands]);

  const sizeOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ value: string; label: string }> = [];
    for (const raw of facets?.sizes ?? []) {
      const mmMatch = raw.match(/^(\d+mm)\b/i);
      const value = mmMatch ? mmMatch[1]! : raw;
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      list.push({ value, label: raw });
    }
    return list;
  }, [facets?.sizes]);

  const colorOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const raw of facets?.colors ?? []) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      list.push(trimmed);
    }
    return list;
  }, [facets?.colors]);

  const updateQuery = (
    updates: Record<string, string | null>,
    resetPage = true
  ) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    }
    if (resetPage) {
      next.delete("page");
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("brand");
    next.delete("priceMin");
    next.delete("priceMax");
    next.delete("size");
    next.delete("color");
    next.delete("inStock");
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const openMobileDrawer = () => {
    setDraftBrand(currentBrand);
    setDraftPriceMin(currentPriceMin);
    setDraftPriceMax(currentPriceMax);
    setDraftSize(currentSize);
    setDraftColor(currentColor);
    setMobileDrawerOpen(true);
  };

  const applyMobileDraft = () => {
    updateQuery({
      brand: draftBrand || null,
      priceMin: draftPriceMin || null,
      priceMax: draftPriceMax || null,
      size: draftSize || null,
      color: draftColor || null,
    });
    setMobileDrawerOpen(false);
  };

  const clearMobileDraft = () => {
    setDraftBrand("");
    setDraftPriceMin("");
    setDraftPriceMax("");
    setDraftSize("");
    setDraftColor("");
  };

  const activeBrandOption = brandOptions.find(
    (b) => b.slug.toLowerCase() === currentBrand.toLowerCase()
  );
  const matchedPriceRange = PRICE_RANGES.find(
    (r) => r.min === currentPriceMin && r.max === currentPriceMax
  );
  const isSizeSelected = (val: string, label: string, target: string) => {
    if (!target) return false;
    const norm = target.toLowerCase();
    return norm === val.toLowerCase() || norm === label.toLowerCase();
  };

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (currentBrand) {
    activeChips.push({
      key: "brand",
      label: `Thương hiệu: ${activeBrandOption?.name || currentBrand}`,
      onRemove: () => updateQuery({ brand: null }),
    });
  }
  if (currentPriceMin || currentPriceMax) {
    const priceLabel =
      matchedPriceRange && activeCurrency === "VND"
        ? `Giá: ${matchedPriceRange.label}`
        : `Giá: ${
            currentPriceMin
              ? formatPriceByCurrency(Number(currentPriceMin), activeCurrency)
              : formatPriceByCurrency(0, activeCurrency)
          } – ${
            currentPriceMax
              ? formatPriceByCurrency(Number(currentPriceMax), activeCurrency)
              : "Trở lên"
          }`;
    activeChips.push({
      key: "price",
      label: priceLabel,
      onRemove: () => updateQuery({ priceMin: null, priceMax: null }),
    });
  }
  if (currentSize) {
    activeChips.push({
      key: "size",
      label: `Phiên bản: ${currentSize}`,
      onRemove: () => updateQuery({ size: null }),
    });
  }
  if (currentColor) {
    activeChips.push({
      key: "color",
      label: `Màu: ${currentColor}`,
      onRemove: () => updateQuery({ color: null }),
    });
  }
  if (currentInStock) {
    activeChips.push({
      key: "inStock",
      label: "Chỉ hiện còn hàng",
      onRemove: () => updateQuery({ inStock: null }),
    });
  }

  const activeFilterCount = activeChips.length;

  const countLabel =
    meta.totalPages <= 1
      ? `Hiển thị tất cả ${meta.total} kết quả`
      : `Hiển thị ${products.length} / ${meta.total} kết quả`;

  const currentSortOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  const sortControls = showSortToolbar ? (
    <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
      <span className="text-[13px] sm:text-[13.5px] text-ink-secondary">
        {countLabel}
      </span>
      <div
        ref={sortDropdownRef}
        className="relative inline-block text-left w-full sm:w-auto max-w-full"
      >
        <button
          type="button"
          onClick={() => {
            setSortOpen((o) => !o);
            setOpenFilter(null);
          }}
          aria-haspopup="listbox"
          aria-expanded={sortOpen}
          aria-label="Sắp xếp sản phẩm"
          className="min-h-[40px] w-full sm:w-auto sm:min-w-[240px] max-w-full px-3.5 bg-white border border-[#d9d9d9] hover:border-store-forest text-[13.5px] font-medium text-ink-primary flex items-center justify-between gap-2 transition-colors focus:outline-none focus:border-store-forest cursor-pointer shadow-sm rounded-none"
        >
          <span className="truncate">{currentSortOption.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-ink-muted transition-transform duration-200 shrink-0 ${
              sortOpen ? "rotate-180 text-store-forest" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {sortOpen && (
          <ul
            role="listbox"
            aria-label="Tùy chọn sắp xếp"
            className="absolute right-0 top-full mt-1 w-full sm:min-w-[250px] max-w-full bg-white border border-store-border-sage shadow-drawer py-1 z-30 animate-in fade-in-50 zoom-in-95 duration-150"
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.value === currentSort;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      updateQuery({ sort: opt.value });
                      setSortOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left text-[13px] transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-store-surface-sage text-store-forest font-bold"
                        : "text-ink-primary hover:bg-[#f4f7f5] hover:text-store-forest"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-store-forest shrink-0 ml-2"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Unified Single-Row Top Toolbar */}
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <BreadcrumbBar items={breadcrumbs} rightSlot={sortControls} />
      ) : sortControls ? (
        <div className="flex justify-end">{sortControls}</div>
      ) : null}

      {/* Subcategories Strip (when provided by Category Hub) */}
      {subCategories && subCategories.length > 0 && (
        <nav
          aria-label="Danh mục con"
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap"
        >
          {subCategories.map((sub) => {
            const href = localizeHref(`/danh-muc/${sub.slug}`, locale);
            const isActive = pathname.endsWith(`/${sub.slug}`);
            return (
              <Link
                key={sub._id}
                href={href}
                className={`inline-flex items-center min-h-[36px] px-3 rounded-full border text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? "bg-store-forest border-store-forest text-white font-semibold"
                    : "bg-white border-store-border-sage text-ink-secondary hover:border-store-forest hover:text-store-forest"
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Mobile (<md) Compact Filter Trigger Bar */}
      <div className="flex items-center justify-between gap-2 md:hidden">
        <button
          type="button"
          onClick={openMobileDrawer}
          aria-expanded={mobileDrawerOpen}
          aria-controls="mobile-catalog-filter-drawer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[6px] border border-store-forest bg-white text-store-forest text-[13px] font-semibold hover:bg-store-surface-sage transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-store-forest text-white text-[11px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="min-h-[44px] px-2.5 text-xs font-semibold text-store-price-sale hover:underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Desktop (md+) Compact Horizontal Filter Bar */}
      <div
        ref={filterBarRef}
        className="hidden md:flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[8px] border border-store-border-sage bg-store-surface-sage"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-store-forest mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Bộ lọc
          </span>

          {/* 1. Brand Filter */}
          {brandOptions.length > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openFilter === "brand"}
                onClick={() =>
                  setOpenFilter((prev) => (prev === "brand" ? null : "brand"))
                }
                className={`inline-flex items-center gap-2 min-h-[38px] px-3 rounded-[6px] border text-[13px] transition-colors cursor-pointer ${
                  currentBrand
                    ? "bg-white border-store-forest text-store-forest font-semibold"
                    : "bg-white border-store-border-sage text-ink-primary font-medium hover:border-store-forest"
                }`}
              >
                <span>
                  {currentBrand
                    ? `Thương hiệu: ${activeBrandOption?.name || currentBrand}`
                    : "Thương hiệu"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openFilter === "brand" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openFilter === "brand" && (
                <div
                  role="listbox"
                  aria-label="Lọc theo thương hiệu"
                  className="absolute left-0 top-full mt-1.5 w-[320px] max-w-[calc(100vw-2rem)] max-h-[300px] overflow-y-auto bg-white border border-store-border-sage rounded-[8px] shadow-drawer p-2 z-30"
                >
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      role="option"
                      aria-selected={!currentBrand}
                      onClick={() => {
                        updateQuery({ brand: null });
                        setOpenFilter(null);
                      }}
                      className={`col-span-2 px-2.5 py-2 rounded-[6px] text-left text-xs transition-colors flex items-center justify-between ${
                        !currentBrand
                          ? "bg-store-forest text-white font-bold"
                          : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                      }`}
                    >
                      <span>Tất cả thương hiệu</span>
                      {!currentBrand && (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    {brandOptions.map((brand) => {
                      const isSelected =
                        brand.slug.toLowerCase() === currentBrand.toLowerCase();
                      return (
                        <button
                          key={brand.slug}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            updateQuery({
                              brand: isSelected ? null : brand.slug,
                            });
                            setOpenFilter(null);
                          }}
                          className={`px-2.5 py-2 rounded-[6px] text-left text-xs transition-colors flex items-center justify-between gap-1 ${
                            isSelected
                              ? "bg-store-forest text-white font-bold"
                              : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                          }`}
                        >
                          <span className="truncate">{brand.name}</span>
                          {typeof brand.count === "number" && (
                            <span
                              className={`text-[11px] shrink-0 ${
                                isSelected ? "text-white/90" : "text-ink-muted"
                              }`}
                            >
                              ({brand.count})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Price Range Filter */}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openFilter === "price"}
              onClick={() =>
                setOpenFilter((prev) => (prev === "price" ? null : "price"))
              }
              className={`inline-flex items-center gap-2 min-h-[38px] px-3 rounded-[6px] border text-[13px] transition-colors cursor-pointer ${
                currentPriceMin || currentPriceMax
                  ? "bg-white border-store-forest text-store-forest font-semibold"
                  : "bg-white border-store-border-sage text-ink-primary font-medium hover:border-store-forest"
              }`}
            >
              <span>
                {matchedPriceRange
                  ? `Giá: ${matchedPriceRange.label}`
                  : currentPriceMin || currentPriceMax
                  ? "Đã lọc theo giá"
                  : "Khoảng giá"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openFilter === "price" ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {openFilter === "price" && (
              <div
                role="listbox"
                aria-label="Lọc theo khoảng giá"
                className="absolute left-0 top-full mt-1.5 w-[220px] bg-white border border-store-border-sage rounded-[8px] shadow-drawer p-1.5 z-30 space-y-1"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={!currentPriceMin && !currentPriceMax}
                  onClick={() => {
                    updateQuery({ priceMin: null, priceMax: null });
                    setOpenFilter(null);
                  }}
                  className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-colors ${
                    !currentPriceMin && !currentPriceMax
                      ? "bg-store-forest text-white font-bold"
                      : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                  }`}
                >
                  <span>Tất cả mức giá</span>
                  {!currentPriceMin && !currentPriceMax && (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
                {PRICE_RANGES.map((range) => {
                  const isSelected =
                    currentPriceMin === range.min &&
                    currentPriceMax === range.max;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        updateQuery(
                          isSelected
                            ? { priceMin: null, priceMax: null }
                            : {
                                priceMin: range.min || null,
                                priceMax: range.max || null,
                              }
                        );
                        setOpenFilter(null);
                      }}
                      className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-store-forest text-white font-bold"
                          : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Thickness / Version Filter */}
          {sizeOptions.length > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openFilter === "size"}
                onClick={() =>
                  setOpenFilter((prev) => (prev === "size" ? null : "size"))
                }
                className={`inline-flex items-center gap-2 min-h-[38px] px-3 rounded-[6px] border text-[13px] transition-colors cursor-pointer ${
                  currentSize
                    ? "bg-white border-store-forest text-store-forest font-semibold"
                    : "bg-white border-store-border-sage text-ink-primary font-medium hover:border-store-forest"
                }`}
              >
                <span>
                  {currentSize
                    ? `Phiên bản: ${currentSize}`
                    : "Độ dày / Phiên bản"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openFilter === "size" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openFilter === "size" && (
                <div
                  role="listbox"
                  aria-label="Lọc theo độ dày và phiên bản"
                  className="absolute left-0 top-full mt-1.5 w-[240px] max-h-[280px] overflow-y-auto bg-white border border-store-border-sage rounded-[8px] shadow-drawer p-1.5 z-30 space-y-1"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!currentSize}
                    onClick={() => {
                      updateQuery({ size: null });
                      setOpenFilter(null);
                    }}
                    className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-colors ${
                      !currentSize
                        ? "bg-store-forest text-white font-bold"
                        : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                    }`}
                  >
                    <span>Tất cả phiên bản</span>
                    {!currentSize && (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                  {sizeOptions.map((opt) => {
                    const isSelected = isSizeSelected(
                      opt.value,
                      opt.label,
                      currentSize
                    );
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          updateQuery({ size: isSelected ? null : opt.value });
                          setOpenFilter(null);
                        }}
                        className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-store-forest text-white font-bold"
                            : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. Color Filter */}
          {colorOptions.length > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openFilter === "color"}
                onClick={() =>
                  setOpenFilter((prev) => (prev === "color" ? null : "color"))
                }
                className={`inline-flex items-center gap-2 min-h-[38px] px-3 rounded-[6px] border text-[13px] transition-colors cursor-pointer ${
                  currentColor
                    ? "bg-white border-store-forest text-store-forest font-semibold"
                    : "bg-white border-store-border-sage text-ink-primary font-medium hover:border-store-forest"
                }`}
              >
                <span>{currentColor ? `Màu: ${currentColor}` : "Màu sắc"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openFilter === "color" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openFilter === "color" && (
                <div
                  role="listbox"
                  aria-label="Lọc theo màu sắc"
                  className="absolute right-0 lg:left-0 lg:right-auto top-full mt-1.5 w-[220px] max-h-[280px] overflow-y-auto bg-white border border-store-border-sage rounded-[8px] shadow-drawer p-1.5 z-30 space-y-1"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!currentColor}
                    onClick={() => {
                      updateQuery({ color: null });
                      setOpenFilter(null);
                    }}
                    className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-colors ${
                      !currentColor
                        ? "bg-store-forest text-white font-bold"
                        : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                    }`}
                  >
                    <span>Tất cả màu sắc</span>
                    {!currentColor && (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                  {colorOptions.map((col) => {
                    const isSelected =
                      col.toLowerCase() === currentColor.toLowerCase();
                    const dotHex = COLOR_DOT_HEX[col.toLowerCase()];
                    return (
                      <button
                        key={col}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          updateQuery({ color: isSelected ? null : col });
                          setOpenFilter(null);
                        }}
                        className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                          isSelected
                            ? "bg-store-forest text-white font-bold"
                            : "text-ink-primary hover:bg-store-surface-sage hover:text-store-forest"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 truncate">
                          {dotHex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: dotHex }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate">{col}</span>
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="min-h-[36px] px-2.5 text-xs font-semibold text-store-price-sale hover:underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Active URL Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full bg-store-surface-sage border border-store-mint-border text-xs font-semibold text-store-forest hover:bg-store-mint-bg transition-colors"
            >
              <span>{chip.label}</span>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-store-price-sale hover:underline px-2.5 min-h-[36px]"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Full-Width 4-Col Desktop / 2-Col Mobile Product Grid */}
      {products.length === 0 ? (
        <div className="rounded-[8px] border border-[#eeeeee] bg-store-surface-sage py-16 px-4 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-white border border-store-border-sage flex items-center justify-center">
            <Search className="w-5 h-5 text-ink-muted" aria-hidden="true" />
          </div>
          <p className="text-base font-bold text-ink-primary">
            Không tìm thấy sản phẩm phù hợp
          </p>
          <p className="text-sm text-ink-muted">
            Vui lòng thử điều chỉnh bộ lọc hoặc quay về danh mục Vợt Pickleball
            11Sport.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center justify-center min-h-[40px] px-5 rounded-[4px] border border-store-forest bg-white text-store-forest text-xs font-bold uppercase tracking-wider hover:bg-store-mint-bg transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
            <Link
              href="/vot-pickleball"
              className="inline-flex items-center justify-center min-h-[40px] px-5 rounded-[4px] bg-store-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-store-forest-hover transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              density="category"
            />
          ))}
        </div>
      )}

      {/* Flatsome Circular Pagination (only when > 1 page) */}
      {meta.totalPages > 1 && (
        <nav
          aria-label="Phân trang sản phẩm"
          className="pt-4 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => updateQuery({ page: String(meta.page - 1) }, false)}
            aria-label="Trang trước"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#d9d9d9] bg-white text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-store-forest hover:bg-store-forest hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, meta.page - 3),
              Math.min(meta.totalPages, meta.page + 2)
            )
            .map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => updateQuery({ page: String(pageNum) }, false)}
                aria-current={pageNum === meta.page ? "page" : undefined}
                className={`inline-flex items-center justify-center min-w-[40px] h-10 px-2 rounded-full text-sm font-bold border-2 transition-colors ${
                  pageNum === meta.page
                    ? "border-store-forest bg-store-forest text-white"
                    : "border-[#d9d9d9] bg-white text-ink-primary hover:border-store-forest hover:bg-store-forest hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

          <button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => updateQuery({ page: String(meta.page + 1) }, false)}
            aria-label="Trang tiếp theo"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#d9d9d9] bg-white text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-store-forest hover:bg-store-forest hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </nav>
      )}

      {/* Mobile (<md) Filter Drawer / Sheet */}
      {mobileDrawerOpen && (
        <div
          id="mobile-catalog-filter-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Bộ lọc sản phẩm"
          className="fixed inset-0 z-50 md:hidden flex justify-end"
        >
          <div
            aria-hidden="true"
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-[360px] h-full bg-white flex flex-col shadow-drawer">
            <div className="px-4 py-3 border-b border-store-border-sage flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-ink-primary">
                Bộ lọc sản phẩm
              </h2>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Đóng bộ lọc"
                className="inline-flex items-center justify-center w-11 h-11 rounded-[6px] text-ink-primary hover:bg-store-surface-sage transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Brand Section */}
              {brandOptions.length > 0 && (
                <section className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-store-forest">
                    Thương hiệu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {brandOptions.map((brand) => {
                      const isSelected =
                        brand.slug.toLowerCase() === draftBrand.toLowerCase();
                      return (
                        <button
                          key={brand.slug}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setDraftBrand(isSelected ? "" : brand.slug)
                          }
                          className={`min-h-[38px] px-3 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-store-forest border-store-forest text-white font-semibold"
                              : "bg-white border-store-border-sage text-ink-primary hover:border-store-forest"
                          }`}
                        >
                          {brand.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Price Section */}
              <section className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-store-forest">
                  Khoảng giá
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => {
                    const isSelected =
                      draftPriceMin === range.min && draftPriceMax === range.max;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          if (isSelected) {
                            setDraftPriceMin("");
                            setDraftPriceMax("");
                          } else {
                            setDraftPriceMin(range.min);
                            setDraftPriceMax(range.max);
                          }
                        }}
                        className={`min-h-[40px] px-3 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-store-forest border-store-forest text-white font-semibold"
                            : "bg-white border-store-border-sage text-ink-primary hover:border-store-forest"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Size / Thickness Section */}
              {sizeOptions.length > 0 && (
                <section className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-store-forest">
                    Độ dày / Phiên bản
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((opt) => {
                      const isSelected = isSizeSelected(
                        opt.value,
                        opt.label,
                        draftSize
                      );
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setDraftSize(isSelected ? "" : opt.value)
                          }
                          className={`min-h-[40px] px-3 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-store-forest border-store-forest text-white font-semibold"
                              : "bg-white border-store-border-sage text-ink-primary hover:border-store-forest"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Color Section */}
              {colorOptions.length > 0 && (
                <section className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-store-forest">
                    Màu sắc
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((col) => {
                      const isSelected =
                        col.toLowerCase() === draftColor.toLowerCase();
                      const dotHex = COLOR_DOT_HEX[col.toLowerCase()];
                      return (
                        <button
                          key={col}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setDraftColor(isSelected ? "" : col)}
                          className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[6px] border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-store-forest border-store-forest text-white font-semibold"
                              : "bg-white border-store-border-sage text-ink-primary hover:border-store-forest"
                          }`}
                        >
                          {dotHex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: dotHex }}
                              aria-hidden="true"
                            />
                          )}
                          <span>{col}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <div className="p-4 border-t border-store-border-sage bg-white flex items-center gap-2.5">
              <button
                type="button"
                onClick={clearMobileDraft}
                className="min-h-[44px] flex-1 rounded-[6px] border border-store-border-sage bg-white text-ink-primary text-sm font-semibold hover:bg-store-surface-sage transition-colors"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={applyMobileDraft}
                className="min-h-[44px] flex-1 rounded-[6px] bg-store-forest hover:bg-store-forest-hover text-white text-sm font-bold transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
