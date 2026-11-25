import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { LocaleCode } from "@/lib/format";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";
import {
  localizeCategoryName,
  localizeHref,
  localizeProductDetail,
  localizeProductSummary,
  localizeReviewList,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CATALOG_I18N, formatSlugTitle } from "@/lib/i18n/catalog";
import {
  fetchProductDetail,
  fetchProductReviews,
  fetchRelatedProducts,
} from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { BreadcrumbBar } from "@/components/store/StorefrontDesignSystem";
import type { ProductDetail } from "@/types/storefront";

interface ProductPageProps {
  params: { slug: string };
}

function buildFallbackProduct(slug: string, locale: LocaleCode): ProductDetail {
  const title = formatSlugTitle(slug);
  return {
    _id: slug,
    code: "11S-DEMO",
    name: title,
    slug,
    sellingPrice: 0,
    inStock: false,
    stockAvailable: 0,
    variants: [],
    shortDescription:
      CATALOG_I18N[locale].pages.product.fallbackShortDescription,
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.product;
  const { data: fetchedProduct } = await fetchProductDetail(params.slug);
  if (!fetchedProduct) {
    return buildMetadata({
      title: t.notFoundMetaTitle,
      path: `/${params.slug}`,
      locale,
    });
  }

  const product = localizeProductDetail(fetchedProduct, locale);
  const title =
    locale === "vi"
      ? product.seo?.title || t.metaTitle(product.name)
      : t.metaTitle(product.name);
  const description =
    locale === "vi"
      ? product.seo?.description ||
        product.shortDescription ||
        t.metaDescription(product.name)
      : product.shortDescription || t.metaDescription(product.name);

  return buildMetadata({
    title,
    description,
    path: `/${product.slug}`,
    image:
      product.seo?.ogImage ||
      product.thumbnailUrl ||
      product.images?.[0]?.url,
    locale,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const locale = getServerLocale();
  const t = CATALOG_I18N[locale].pages.product;
  const tc = CATALOG_I18N[locale].common;

  const { data: fetchedProduct, notFound: isNotFound } =
    await fetchProductDetail(params.slug);

  if (isNotFound) {
    notFound();
  }

  const rawProduct = fetchedProduct || buildFallbackProduct(params.slug, locale);
  const product = localizeProductDetail(rawProduct, locale);

  const [relatedProducts, reviewsData] = fetchedProduct
    ? await Promise.all([
        fetchRelatedProducts(params.slug),
        fetchProductReviews(fetchedProduct._id, { page: 1, limit: 10 }),
      ])
    : [[], null];

  const localizedRelated = relatedProducts.map((item) =>
    localizeProductSummary(item, locale)
  );
  const localizedReviews = localizeReviewList(reviewsData, locale);

  const brandBreadcrumb =
    product.brand && product.category?.slug === "vot-pickleball"
      ? {
          name: t.brandPaddleBreadcrumb(product.brand.name),
          path: `/vot-pickleball-${product.brand.slug}`,
        }
      : product.brand && product.category?.slug === "giay-pickleball"
      ? {
          name: t.brandShoeBreadcrumb(product.brand.name),
          path: `/thuong-hieu/${product.brand.slug}`,
        }
      : product.brand
      ? {
          name: product.brand.name,
          path: `/thuong-hieu/${product.brand.slug}`,
        }
      : null;

  const visibleBreadcrumbs = [
    { name: tc.home, path: "/" },
    ...(product.category
      ? [
          {
            name: localizeCategoryName(
              product.category.name,
              locale,
              product.category.slug
            ),
            path: `/${product.category.slug}`,
          },
        ]
      : []),
    ...(brandBreadcrumb ? [brandBreadcrumb] : []),
  ];

  const jsonLdBreadcrumbs = [
    ...visibleBreadcrumbs,
    { name: product.name, path: `/san-pham/${params.slug}` },
  ];

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description:
      product.shortDescription || t.jsonLdFallbackDesc(product.name),
    slug: product.slug,
    sku: product.code,
    brandName: product.brand?.name || "11Sport",
    images:
      product.images?.map((i) => i.url) ||
      (product.thumbnailUrl ? [product.thumbnailUrl] : []),
    price: product.sellingPrice,
    inStock: product.inStock,
    ratingValue: product.ratingAvg,
    reviewCount: product.ratingCount,
    locale,
  });

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-4 lg:py-6 space-y-4">
      <JsonLd
        data={[buildBreadcrumbJsonLd(jsonLdBreadcrumbs, locale), productJsonLd]}
      />

      <BreadcrumbBar
        items={visibleBreadcrumbs.map((b) => ({
          name: b.name,
          href: localizeHref(b.path, locale),
        }))}
        prevNextHref={{
          prev: localizeHref(
            localizedRelated[0]
              ? `/${localizedRelated[0].slug}`
              : "/vot-pickleball",
            locale
          ),
          next: localizeHref(
            localizedRelated[1]
              ? `/${localizedRelated[1].slug}`
              : "/vot-pickleball",
            locale
          ),
        }}
        locale={locale}
      />

      <ProductDetailClient
        product={product}
        relatedProducts={localizedRelated}
        initialReviews={localizedReviews}
        locale={locale}
      />
    </div>
  );
}
