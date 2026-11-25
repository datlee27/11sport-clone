import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import {
  localizeBrandDescription,
  localizeHref,
  localizeProductSummary,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CATALOG_I18N, formatSlugTitle } from "@/lib/i18n/catalog";
import { fetchBrandDetail, fetchProducts } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SeoDescriptionBox } from "@/components/catalog/SeoDescriptionBox";

interface BrandPageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export async function generateMetadata({
  params,
  searchParams,
}: BrandPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.brand;

  const { data: brand } = await fetchBrandDetail(params.slug);
  const brandName = brand?.name || formatSlugTitle(params.slug);
  const title =
    locale === "vi"
      ? brand?.seo?.title || t.metaTitle(brandName)
      : t.metaTitle(brandName);
  const description =
    locale === "vi"
      ? brand?.seo?.description || t.metaDescription(brandName)
      : t.metaDescription(brandName);

  return buildMetadata({
    title,
    description,
    path: `/thuong-hieu/${params.slug}`,
    image: brand?.seo?.ogImage || brand?.logoUrl,
    locale,
    searchParams,
  });
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.brand;
  const tc = CATALOG_I18N[locale].common;

  const [brandResult, productsRes] = await Promise.all([
    fetchBrandDetail(params.slug),
    fetchProducts({
      brand: params.slug,
      priceMin: getParam(searchParams.priceMin),
      priceMax: getParam(searchParams.priceMax),
      color: getParam(searchParams.color),
      size: getParam(searchParams.size),
      inStock: getParam(searchParams.inStock),
      sort: getParam(searchParams.sort) || "featured",
      page: getParam(searchParams.page) || "1",
      limit: 20,
    }),
  ]);

  if (brandResult.notFound) {
    notFound();
  }

  const brand = brandResult.data;
  const brandName = brand?.name || formatSlugTitle(params.slug);
  const descriptionHtml = localizeBrandDescription(
    brand?.slug || params.slug,
    brand?.descriptionHtml,
    locale
  );
  const localizedProducts = productsRes.data.map((product) =>
    localizeProductSummary(product, locale)
  );

  const breadcrumbs = [
    { name: tc.home, path: "/" },
    { name: t.breadcrumbBrand(brandName), path: `/thuong-hieu/${params.slug}` },
  ];

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-4 lg:py-6 space-y-5">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs, locale)} />

      <h1 className="sr-only">{t.srHeading(brandName)}</h1>

      <Suspense
        fallback={
          <div className="h-96 rounded-xl bg-store-surface-sage animate-pulse" />
        }
      >
        <CatalogClient
          breadcrumbs={[
            { name: tc.home, href: localizeHref("/", locale) },
            { name: brandName },
          ]}
          products={localizedProducts}
          meta={productsRes.meta}
          facets={productsRes.facets}
          hideBrandFilter
          locale={locale}
        />
      </Suspense>

      <SeoDescriptionBox
        html={descriptionHtml}
        title={t.seoBoxTitle(brandName)}
        locale={locale}
      />
    </div>
  );
}
