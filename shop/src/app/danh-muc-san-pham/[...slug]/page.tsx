import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  resolveNestedCategoryRedirect,
} from "@/lib/seo";
import {
  localizeCategoryDescription,
  localizeCategoryName,
  localizeCategorySummary,
  localizeHref,
  localizeProductSummary,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import {
  CATALOG_I18N,
  formatCategorySegmentLabel,
} from "@/lib/i18n/catalog";
import { fetchCategoryDetail, fetchProducts } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SeoDescriptionBox } from "@/components/catalog/SeoDescriptionBox";

interface NestedCategoryPageProps {
  params: { slug: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export async function generateMetadata({
  params,
  searchParams,
}: NestedCategoryPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const tCat = CATALOG_I18N[locale].pages.category;
  const tNested = CATALOG_I18N[locale].pages.nestedCategory;

  const segments = params.slug || [];
  const leafSlug = segments[segments.length - 1] || "thoi-trang";
  const { data } = await fetchCategoryDetail(leafSlug);
  const category = data?.category;

  const categoryName = category?.name
    ? localizeCategoryName(category.name, locale, category.slug || leafSlug)
    : undefined;
  const title = categoryName
    ? tCat.metaTitle(categoryName)
    : tNested.fallbackTitle;
  const description =
    locale === "vi"
      ? category?.seo?.description || tNested.metaDescription(title)
      : tNested.metaDescription(categoryName || tNested.fallbackTitle);

  return buildMetadata({
    title,
    description,
    path: `/danh-muc-san-pham/${segments.join("/")}`,
    locale,
    searchParams,
  });
}

export default async function NestedCategoryPage({
  params,
  searchParams,
}: NestedCategoryPageProps) {
  const locale = getServerLocale();
  const tCat = CATALOG_I18N[locale].pages.category;
  const tc = CATALOG_I18N[locale].common;

  const segments = params.slug || [];
  const singleSegTopCategories = new Set([
    "vot-pickleball",
    "giay-pickleball",
    "balo-tui-pickleball",
    "phu-kien-pickleball",
    "bong-pickleball",
  ]);

  if (segments.length === 1 && singleSegTopCategories.has(segments[0] || "")) {
    const redirectTarget = resolveNestedCategoryRedirect(segments, locale);
    if (redirectTarget) {
      permanentRedirect(redirectTarget);
    }
  }

  const leafSlug = segments[segments.length - 1] || "thoi-trang";
  const [catResult, productsRes] = await Promise.all([
    fetchCategoryDetail(leafSlug),
    fetchProducts({
      category: leafSlug,
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
  const categoryName = category?.name
    ? localizeCategoryName(category.name, locale, category.slug || leafSlug)
    : formatCategorySegmentLabel(leafSlug, locale);
  const rawSubCategories =
    catResult.data?.subCategories || category?.subCategories || [];
  const subCategories = rawSubCategories.map((sub) =>
    localizeCategorySummary(sub, locale)
  );
  const descriptionHtml = localizeCategoryDescription(
    category?.slug || leafSlug,
    category?.descriptionHtml,
    locale
  );
  const localizedProducts = productsRes.data.map((product) =>
    localizeProductSummary(product, locale)
  );

  const breadcrumbs = [
    { name: tc.home, path: "/" },
    ...segments.map((seg, i) => ({
      name:
        i === segments.length - 1
          ? categoryName
          : formatCategorySegmentLabel(seg, locale),
      path: `/danh-muc-san-pham/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-4 lg:py-6 space-y-5">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs, locale)} />

      <h1 className="sr-only">{tCat.srHeading(categoryName)}</h1>

      <Suspense
        fallback={
          <div className="h-96 rounded-xl bg-surface-muted animate-pulse" />
        }
      >
        <CatalogClient
          breadcrumbs={breadcrumbs.map((b, i) => ({
            name: b.name,
            href:
              i < breadcrumbs.length - 1
                ? localizeHref(b.path, locale)
                : undefined,
          }))}
          products={localizedProducts}
          meta={productsRes.meta}
          facets={productsRes.facets}
          subCategories={subCategories}
          locale={locale}
        />
      </Suspense>

      <SeoDescriptionBox
        html={descriptionHtml}
        title={tCat.seoBoxTitle(categoryName)}
        locale={locale}
      />
    </div>
  );
}
