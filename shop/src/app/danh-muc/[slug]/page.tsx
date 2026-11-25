import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import {
  localizeCategoryDescription,
  localizeCategoryName,
  localizeCategorySummary,
  localizeHref,
  localizeProductSummary,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CATALOG_I18N, formatSlugTitle } from "@/lib/i18n/catalog";
import { fetchCategoryDetail, fetchProducts } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SeoDescriptionBox } from "@/components/catalog/SeoDescriptionBox";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.category;
  const { data } = await fetchCategoryDetail(params.slug);
  const category = data?.category;

  const rawCategoryName = category?.name || formatSlugTitle(params.slug);
  const categoryName = localizeCategoryName(
    rawCategoryName,
    locale,
    category?.slug || params.slug
  );

  const title =
    locale === "vi"
      ? category?.seo?.title || t.metaTitle(categoryName)
      : t.metaTitle(categoryName);
  const description =
    locale === "vi"
      ? category?.seo?.description || t.metaDescription(categoryName)
      : t.metaDescription(categoryName);

  return buildMetadata({
    title,
    description,
    path: `/danh-muc/${params.slug}`,
    image: category?.seo?.ogImage || category?.imageUrl,
    locale,
    searchParams,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.category;
  const tc = CATALOG_I18N[locale].common;

  const [catResult, productsRes] = await Promise.all([
    fetchCategoryDetail(params.slug),
    fetchProducts({
      category: params.slug,
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
  ]);

  if (catResult.notFound) {
    notFound();
  }

  const category = catResult.data?.category;
  const rawCategoryName = category?.name || formatSlugTitle(params.slug);
  const categoryName = localizeCategoryName(
    rawCategoryName,
    locale,
    category?.slug || params.slug
  );
  const rawSubCategories =
    catResult.data?.subCategories || category?.subCategories || [];
  const subCategories = rawSubCategories.map((sub) =>
    localizeCategorySummary(sub, locale)
  );
  const hubBrands = catResult.data?.brands || [];
  const descriptionHtml = localizeCategoryDescription(
    category?.slug || params.slug,
    category?.descriptionHtml,
    locale
  );
  const localizedProducts = productsRes.data.map((product) =>
    localizeProductSummary(product, locale)
  );

  const breadcrumbs = [
    { name: tc.home, path: "/" },
    { name: categoryName, path: `/danh-muc/${params.slug}` },
  ];

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-4 lg:py-6 space-y-5">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs, locale)} />

      <h1 className="sr-only">{t.srHeading(categoryName)}</h1>

      <Suspense
        fallback={
          <div className="h-96 rounded-xl bg-surface-muted animate-pulse" />
        }
      >
        <CatalogClient
          breadcrumbs={[
            { name: tc.home, href: localizeHref("/", locale) },
            { name: categoryName },
          ]}
          products={localizedProducts}
          meta={productsRes.meta}
          facets={productsRes.facets}
          subCategories={subCategories}
          hubBrands={hubBrands}
          locale={locale}
        />
      </Suspense>

      <SeoDescriptionBox
        html={descriptionHtml}
        title={t.seoBoxTitle(categoryName)}
        locale={locale}
      />
    </div>
  );
}
