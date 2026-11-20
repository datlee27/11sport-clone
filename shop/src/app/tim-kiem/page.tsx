import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { fetchArticles, fetchProducts } from "@/lib/storefront";
import { SearchTabsClient } from "@/components/search/SearchTabsClient";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm kiếm dụng cụ Pickleball, giày thể thao và bài viết tại 11 Sport.",
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = getParam(searchParams.q)?.trim() || "";

  const [productsRes, articlesRes] = await Promise.all([
    fetchProducts({
      q: q || undefined,
      brand: getParam(searchParams.brand),
      priceMin: getParam(searchParams.priceMin),
      priceMax: getParam(searchParams.priceMax),
      color: getParam(searchParams.color),
      size: getParam(searchParams.size),
      inStock: getParam(searchParams.inStock),
      sort: getParam(searchParams.sort) || "featured",
      page: getParam(searchParams.page) || "1",
      limit: 20,
    }),
    fetchArticles({ q: q || undefined, page: 1, limit: 12 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary">Tìm kiếm</span>
      </nav>

      <div className="space-y-2">
        <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
          {q
            ? `Kết quả tìm kiếm cho "${q}" (${productsRes.meta.total} sản phẩm, ${articlesRes.meta.total} bài viết)`
            : "Tìm kiếm sản phẩm & bài viết tại 11 Sport"}
        </h1>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-ink-muted">Gợi ý:</span>
          {["Vợt Pickleball", "Joola", "Giày Asics", "Balo", "Quấn cán"].map(
            (kw) => (
              <Link
                key={kw}
                href={`/tim-kiem?q=${encodeURIComponent(kw)}`}
                className="inline-flex items-center min-h-[36px] px-3 rounded-full bg-surface-subtle border border-surface-border text-xs font-medium text-ink-secondary hover:border-brand-primary hover:text-brand-primary"
              >
                {kw}
              </Link>
            )
          )}
        </div>
      </div>

      <SearchTabsClient
        query={q}
        products={productsRes.data}
        productMeta={productsRes.meta}
        facets={productsRes.facets}
        articles={articlesRes.data}
        articleTotal={articlesRes.meta.total}
      />
    </div>
  );
}
