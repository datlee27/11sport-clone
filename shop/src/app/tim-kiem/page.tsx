import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  localizeArticleSummary,
  localizeHref,
  localizeProductSummary,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CATALOG_I18N } from "@/lib/i18n/catalog";
import { fetchArticles, fetchProducts } from "@/lib/storefront";
import { SearchTabsClient } from "@/components/search/SearchTabsClient";
import { PageHeroBanner } from "@/components/store/StorefrontDesignSystem";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].search;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/tim-kiem",
    noIndex: true,
    locale,
  });
}

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].search;
  const tc = CATALOG_I18N[locale].common;
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

  const localizedProducts = productsRes.data.map((product) =>
    localizeProductSummary(product, locale)
  );
  const localizedArticles = articlesRes.data.map((article) =>
    localizeArticleSummary(article, locale)
  );

  return (
    <div>
      <PageHeroBanner
        title={t.heroTitle}
        breadcrumbs={[
          { name: tc.home, href: localizeHref("/", locale) },
          { name: q ? t.breadcrumbResults(q) : tc.search },
        ]}
        tone="news"
        locale={locale}
      />

      <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-7 lg:py-9 space-y-6">
        <h2 className="text-[20px] sm:text-[24px] font-bold uppercase tracking-wide text-center text-[#0a0a0a]">
          {q ? t.headingWithQuery(q) : t.headingDefault}
        </h2>

        <SearchTabsClient
          query={q}
          products={localizedProducts}
          productMeta={productsRes.meta}
          facets={productsRes.facets}
          articles={localizedArticles}
          articleTotal={articlesRes.meta.total}
          locale={locale}
        />
      </div>
    </div>
  );
}
