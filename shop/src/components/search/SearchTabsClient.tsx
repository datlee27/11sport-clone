"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, ShoppingBag } from "lucide-react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { ArticleGridCard } from "@/components/blog/ArticleViews";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import type { LocaleCode } from "@/lib/format";
import {
  localizeArticleSummary,
  localizeHref,
  localizeProductSummary,
} from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CATALOG_I18N } from "@/lib/i18n/catalog";
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
  locale?: LocaleCode;
}

export function SearchTabsClient({
  query,
  products,
  productMeta,
  facets,
  articles,
  articleTotal,
  locale: localeProp,
}: SearchTabsClientProps) {
  const detectedLocale = useLocale();
  const locale = localeProp ?? detectedLocale;
  const t = CATALOG_I18N[locale].search;

  const localizedProducts = useMemo(
    () => products.map((product) => localizeProductSummary(product, locale)),
    [products, locale]
  );

  const localizedArticles = useMemo(
    () => articles.map((article) => localizeArticleSummary(article, locale)),
    [articles, locale]
  );

  const [activeTab, setActiveTab] = useState<"products" | "articles">(
    products.length === 0 && articles.length > 0 ? "articles" : "products"
  );

  return (
    <div className="space-y-6">
      {/* Sharp Tabs */}
      <div
        role="tablist"
        aria-label={t.tabsAriaLabel}
        className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-[#ececec] pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          className={`inline-flex items-center gap-2 h-9 px-5 rounded-none border text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "products"
              ? "bg-[#224e40] border-[#224e40] text-white"
              : "bg-white border-[#dddddd] text-[#555555] hover:border-[#224e40] hover:text-[#224e40]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>{t.productsTab(productMeta.total)}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "articles"}
          onClick={() => setActiveTab("articles")}
          className={`inline-flex items-center gap-2 h-9 px-5 rounded-none border text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "articles"
              ? "bg-[#224e40] border-[#224e40] text-white"
              : "bg-white border-[#dddddd] text-[#555555] hover:border-[#224e40] hover:text-[#224e40]"
          }`}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>{t.articlesTab(articleTotal)}</span>
        </button>
      </div>

      {activeTab === "products" ? (
        <Suspense
          fallback={<div className="h-96 bg-[#f8f9f5] animate-pulse" />}
        >
          <CatalogClient
            products={localizedProducts}
            meta={productMeta}
            facets={facets}
            locale={locale}
          />
        </Suspense>
      ) : localizedArticles.length === 0 ? (
        <div className="border border-[#dce5da] bg-[#f8f9f5] py-14 px-4 text-center space-y-3">
          <p className="text-[16px] font-bold text-[#204b3e]">
            {t.noArticlesHeading(query)}
          </p>
          <p className="text-[14px] text-[#555555]">{t.noArticlesBody}</p>
          <Link
            href={localizeHref("/tin-tuc", locale)}
            className="inline-flex items-center justify-center h-[39px] px-6 rounded-none bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider"
          >
            {t.viewAllArticles}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {localizedArticles.map((article) => (
              <ArticleGridCard
                key={article._id}
                article={article}
                locale={locale}
              />
            ))}
          </div>

          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <QuickConsultForm
              variant="sidebar"
              sourceUrl={localizeHref("/tim-kiem", locale)}
              locale={locale}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
