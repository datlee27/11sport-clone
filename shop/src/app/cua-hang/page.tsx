import { Suspense } from "react";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { localizeHref, localizeProductSummary } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CATALOG_I18N } from "@/lib/i18n/catalog";
import { fetchProducts, getAllBrandsList } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";

interface ShopAllPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export async function generateMetadata({
  searchParams,
}: ShopAllPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.shop;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/cua-hang",
    locale,
    searchParams,
  });
}

export default async function ShopAllPage({ searchParams }: ShopAllPageProps) {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.shop;
  const tc = CATALOG_I18N[locale].common;
  const query = getParam(searchParams.q) || getParam(searchParams.s);

  const productsRes = await fetchProducts({
    category: getParam(searchParams.category),
    brand: getParam(searchParams.brand),
    priceMin: getParam(searchParams.priceMin) || getParam(searchParams.minPrice),
    priceMax: getParam(searchParams.priceMax) || getParam(searchParams.maxPrice),
    color: getParam(searchParams.color),
    size: getParam(searchParams.size) || getParam(searchParams.thickness),
    inStock: getParam(searchParams.inStock),
    q: query,
    sort: getParam(searchParams.sort) || "featured",
    page: getParam(searchParams.page) || "1",
    limit: 20,
  });

  const localizedProducts = productsRes.data.map((product) =>
    localizeProductSummary(product, locale)
  );
  const allBrands = getAllBrandsList();

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-4 lg:py-6 space-y-5">
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: tc.home, path: "/" },
            { name: tc.shop, path: "/cua-hang" },
          ],
          locale
        )}
      />

      <h1 className="sr-only">
        {query ? t.srHeadingSearch(query) : t.srHeadingDefault}
      </h1>

      <Suspense
        fallback={
          <div className="h-96 rounded-xl bg-surface-muted animate-pulse" />
        }
      >
        <CatalogClient
          breadcrumbs={[
            { name: tc.home, href: localizeHref("/", locale) },
            { name: tc.shop },
          ]}
          products={localizedProducts}
          meta={productsRes.meta}
          facets={productsRes.facets}
          hubBrands={allBrands}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
