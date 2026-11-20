"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, FileText, ShoppingBag } from "lucide-react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import type {
  ArticleSummary,
  ProductFacets,
  ProductListItem,
} from "@/types/storefront";

interface SearchTabsClientProps {
  query: string;
  products: ProductListItem[];
  productMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  facets?: ProductFacets;
  articles: ArticleSummary[];
  articleTotal: number;
}

export function SearchTabsClient({
  query,
  products,
  productMeta,
  facets,
  articles,
  articleTotal,
}: SearchTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"products" | "articles">(
    "products"
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Loại kết quả tìm kiếm"
        className="flex items-center gap-2 border-b border-surface-border pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "products"
              ? "bg-brand-primary text-white"
              : "bg-surface-subtle text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>Sản phẩm ({productMeta.total})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "articles"}
          onClick={() => setActiveTab("articles")}
          className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "articles"
              ? "bg-brand-primary text-white"
              : "bg-surface-subtle text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>Bài viết &amp; Hướng dẫn ({articleTotal})</span>
        </button>
      </div>

      {activeTab === "products" ? (
        <Suspense
          fallback={
            <div className="h-96 rounded-xl bg-surface-muted animate-pulse" />
          }
        >
          <CatalogClient
            products={products}
            meta={productMeta}
            facets={facets}
          />
        </Suspense>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-subtle py-14 px-4 text-center">
          <p className="text-base font-bold text-ink-primary">
            Không tìm thấy bài viết nào{" "}
            {query ? `cho từ khóa "${query}"` : ""}
          </p>
          <p className="text-sm text-ink-muted mt-1">
            Bạn có thể xem toàn bộ tin tức &amp; hướng dẫn chọn đồ tại chuyên mục
            Tin tức.
          </p>
          <Link
            href="/tin-tuc"
            className="mt-4 inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-brand-primary text-white text-sm font-semibold"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article) => (
            <article
              key={article._id}
              className="group rounded-xl border border-surface-border bg-white shadow-card hover:shadow-card-hover transition-shadow overflow-hidden flex flex-col"
            >
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="relative aspect-[16/9] bg-surface-muted overflow-hidden block"
              >
                {article.thumbnailUrl ? (
                  <Image
                    src={article.thumbnailUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-ink-muted">
                    11 SPORT BLOG
                  </div>
                )}
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                {article.publishedAt && (
                  <p className="inline-flex items-center gap-1 text-xs text-ink-muted mb-1.5">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
                <h2 className="text-base font-bold text-ink-primary group-hover:text-brand-primary line-clamp-2">
                  <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
                </h2>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-ink-secondary line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
