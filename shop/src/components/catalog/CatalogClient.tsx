"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { formatVND } from "@/lib/format";
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
}

const PRICE_PRESETS = [
  { label: "Dưới 1 triệu", min: "", max: "1000000" },
  { label: "1 triệu - 3 triệu", min: "1000000", max: "3000000" },
  { label: "Trên 3 triệu", min: "3000000", max: "" },
];

export function CatalogClient({
  products,
  meta,
  facets,
  subCategories = [],
  hubBrands = [],
  hideBrandFilter = false,
}: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentBrand = searchParams.get("brand") || "";
  const currentPriceMin = searchParams.get("priceMin") || "";
  const currentPriceMax = searchParams.get("priceMax") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentSort = searchParams.get("sort") || "featured";

  const [priceMinInput, setPriceMinInput] = useState(currentPriceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(currentPriceMax);

  useEffect(() => {
    setPriceMinInput(currentPriceMin);
    setPriceMaxInput(currentPriceMax);
  }, [currentPriceMin, currentPriceMax]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const updateQuery = (updates: Record<string, string | null>, resetPage = true) => {
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
    router.push(pathname, { scroll: false });
  };

  const selectedBrands = currentBrand ? currentBrand.split(",").filter(Boolean) : [];
  const toggleBrand = (slug: string) => {
    const exists = selectedBrands.includes(slug);
    const updated = exists
      ? selectedBrands.filter((b) => b !== slug)
      : [...selectedBrands, slug];
    updateQuery({ brand: updated.length ? updated.join(",") : null });
  };

  // Active chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (currentPriceMin || currentPriceMax) {
    const minText = currentPriceMin ? formatVND(Number(currentPriceMin)) : "0₫";
    const maxText = currentPriceMax
      ? formatVND(Number(currentPriceMax))
      : "Trở lên";
    activeChips.push({
      key: "price",
      label: `Giá: ${minText} - ${maxText}`,
      onRemove: () => updateQuery({ priceMin: null, priceMax: null }),
    });
  }
  for (const b of selectedBrands) {
    activeChips.push({
      key: `brand-${b}`,
      label: `Hãng: ${b}`,
      onRemove: () => toggleBrand(b),
    });
  }
  if (currentColor) {
    activeChips.push({
      key: "color",
      label: `Màu: ${currentColor}`,
      onRemove: () => updateQuery({ color: null }),
    });
  }
  if (currentSize) {
    activeChips.push({
      key: "size",
      label: `Size: ${currentSize}`,
      onRemove: () => updateQuery({ size: null }),
    });
  }
  if (currentInStock) {
    activeChips.push({
      key: "inStock",
      label: "Chỉ hiện còn hàng",
      onRemove: () => updateQuery({ inStock: null }),
    });
  }

  const filterPanelContent = (
    <div className="space-y-6">
      {/* Khoảng giá */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-ink-primary">Khoảng giá</h3>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active =
              currentPriceMin === preset.min && currentPriceMax === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  updateQuery({
                    priceMin: preset.min || null,
                    priceMax: preset.max || null,
                  })
                }
                className={`min-h-[36px] px-2.5 rounded-lg text-xs font-medium border transition-colors ${
                  active
                    ? "border-brand-primary bg-brand-tint text-brand-primary font-semibold"
                    : "border-surface-border bg-white text-ink-secondary hover:border-brand-primary"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateQuery({
              priceMin: priceMinInput.trim() || null,
              priceMax: priceMaxInput.trim() || null,
            });
          }}
          className="space-y-2 pt-1"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              step={50000}
              value={priceMinInput}
              onChange={(e) => setPriceMinInput(e.target.value)}
              placeholder="Từ (₫)"
              aria-label="Giá tối thiểu"
              className="w-full h-10 px-2.5 rounded-lg border border-surface-border text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <input
              type="number"
              min={0}
              step={50000}
              value={priceMaxInput}
              onChange={(e) => setPriceMaxInput(e.target.value)}
              placeholder="Đến (₫)"
              aria-label="Giá tối đa"
              className="w-full h-10 px-2.5 rounded-lg border border-surface-border text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[40px] rounded-lg bg-surface-muted hover:bg-brand-tint hover:text-brand-primary text-xs font-semibold text-ink-primary transition-colors"
          >
            Áp dụng khoảng giá
          </button>
        </form>
      </div>

      {/* Thương hiệu */}
      {!hideBrandFilter && facets?.brands && facets.brands.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-surface-border">
          <h3 className="text-sm font-bold text-ink-primary">Thương hiệu</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {facets.brands.map((brand) => {
              const checked = selectedBrands.includes(brand.slug);
              return (
                <label
                  key={brand.slug}
                  className="flex items-center justify-between gap-2 min-h-[36px] cursor-pointer text-sm text-ink-secondary hover:text-ink-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(brand.slug)}
                      className="w-4 h-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{brand.name}</span>
                  </span>
                  <span className="font-mono text-xs text-ink-muted">
                    ({brand.count})
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Màu sắc */}
      {facets?.colors && facets.colors.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-surface-border">
          <h3 className="text-sm font-bold text-ink-primary">Màu sắc</h3>
          <div className="flex flex-wrap gap-1.5">
            {facets.colors.map((color) => {
              const active = currentColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateQuery({ color: active ? null : color })}
                  className={`min-h-[36px] px-3 rounded-lg border text-xs font-medium transition-colors ${
                    active
                      ? "border-brand-primary bg-brand-tint text-brand-primary font-semibold"
                      : "border-surface-border bg-white text-ink-secondary hover:border-brand-primary"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {facets?.sizes && facets.sizes.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-surface-border">
          <h3 className="text-sm font-bold text-ink-primary">Kích thước / Size</h3>
          <div className="flex flex-wrap gap-1.5">
            {facets.sizes.map((size) => {
              const active = currentSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateQuery({ size: active ? null : size })}
                  className={`min-w-[44px] min-h-[36px] px-2.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                    active
                      ? "border-brand-primary bg-brand-tint text-brand-primary font-bold"
                      : "border-surface-border bg-white text-ink-secondary hover:border-brand-primary"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tình trạng */}
      <div className="pt-4 border-t border-surface-border">
        <label className="flex items-center gap-2.5 min-h-[44px] cursor-pointer text-sm font-medium text-ink-primary">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) =>
              updateQuery({ inStock: e.target.checked ? "true" : null })
            }
            className="w-4 h-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
          />
          <span>Chỉ hiện sản phẩm còn hàng</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Brand Hub / Sub-categories */}
      {(subCategories.length > 0 || hubBrands.length > 0) && (
        <section
          aria-label="Danh mục con và thương hiệu nổi bật"
          className="space-y-3"
        >
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subCategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/danh-muc/${sub.slug}`}
                  className="inline-flex items-center min-h-[44px] px-4 rounded-xl border border-surface-border bg-white hover:border-brand-primary hover:text-brand-primary text-sm font-semibold text-ink-primary transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {hubBrands.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {hubBrands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/thuong-hieu/${brand.slug}`}
                  className="h-16 rounded-xl border border-surface-border bg-white hover:border-brand-primary p-3 flex items-center justify-center transition-colors"
                >
                  {brand.logoUrl ? (
                    <div className="relative w-full h-9">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold uppercase text-ink-primary">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mobile Filter + Sort Sticky Bar */}
      <div className="lg:hidden sticky top-[60px] z-20 -mx-4 px-4 py-2.5 bg-white/95 backdrop-blur border-y border-surface-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-lg border border-surface-border bg-white text-sm font-semibold text-ink-primary"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>
            Bộ lọc{activeChips.length > 0 ? ` (${activeChips.length})` : ""}
          </span>
        </button>

        <select
          aria-label="Sắp xếp sản phẩm"
          value={currentSort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="min-h-[44px] px-3 rounded-lg border border-surface-border bg-white text-sm font-medium text-ink-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="featured">Sắp xếp: Nổi bật</option>
          <option value="newest">Mới nhất</option>
          <option value="bestseller">Bán chạy</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* Main Content Layout: Desktop Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Bộ lọc sản phẩm"
          className="hidden lg:block w-[260px] shrink-0 rounded-xl border border-surface-border bg-white p-4"
        >
          {filterPanelContent}
        </aside>

        {/* Product Column */}
        <div className="flex-1 w-full space-y-4">
          {/* Desktop Toolbar + Active Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full bg-brand-tint border border-brand-border text-xs font-semibold text-brand-primary hover:bg-emerald-100"
                >
                  <span>{chip.label}</span>
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ))}
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-accent-hot hover:underline min-h-[36px] px-2"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <label
                htmlFor="desktop-sort"
                className="text-xs font-medium text-ink-muted"
              >
                Sắp xếp:
              </label>
              <select
                id="desktop-sort"
                value={currentSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="h-10 px-3 rounded-lg border border-surface-border bg-white text-sm font-medium text-ink-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="featured">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="bestseller">Bán chạy</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {products.length === 0 ? (
            <div className="rounded-2xl border border-surface-border bg-surface-subtle py-16 px-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-white border border-surface-border flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-ink-muted" aria-hidden="true" />
              </div>
              <p className="text-base font-bold text-ink-primary">
                Không tìm thấy sản phẩm phù hợp với bộ lọc
              </p>
              <p className="text-sm text-ink-muted mt-1">
                Vui lòng thử bỏ bớt tiêu chí lọc hoặc tìm kiếm danh mục khác.
              </p>
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <nav
              aria-label="Phân trang sản phẩm"
              className="pt-6 flex items-center justify-center gap-1.5"
            >
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() =>
                  updateQuery({ page: String(meta.page - 1) }, false)
                }
                aria-label="Trang trước"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-surface-border bg-white text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary"
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
                    className={`min-w-[44px] h-11 px-3 rounded-lg font-mono text-sm font-semibold border transition-colors ${
                      pageNum === meta.page
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-surface-border bg-white text-ink-primary hover:border-brand-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() =>
                  updateQuery({ page: String(meta.page + 1) }, false)
                }
                aria-label="Trang tiếp theo"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-surface-border bg-white text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Bộ lọc sản phẩm"
        >
          <div
            className="fixed inset-0 bg-ink-primary/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[85vw] max-w-[360px] bg-white h-full shadow-drawer flex flex-col">
            <div className="px-4 h-14 border-b border-surface-border flex items-center justify-between">
              <span className="text-base font-bold text-ink-primary">
                Bộ lọc sản phẩm
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Đóng bộ lọc"
                className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-muted"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">{filterPanelContent}</div>

            <div className="p-4 border-t border-surface-border grid grid-cols-2 gap-3 bg-white">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setDrawerOpen(false);
                }}
                className="min-h-[44px] rounded-lg border border-surface-border text-sm font-semibold text-ink-primary"
              >
                Xóa lọc
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="min-h-[44px] rounded-lg bg-brand-primary text-white text-sm font-semibold"
              >
                Xem {meta.total} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
