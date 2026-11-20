import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchBrandDetail, fetchProducts } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SeoDescriptionBox } from "@/components/catalog/SeoDescriptionBox";

interface BrandPageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(
  val: string | string[] | undefined
): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { data: brand } = await fetchBrandDetail(params.slug);
  const brandName = brand?.name || formatSlugTitle(params.slug);
  const title = brand?.seo?.title || `Thương hiệu ${brandName} Chính Hãng`;
  const description =
    brand?.seo?.description ||
    `Sản phẩm ${brandName} chính hãng tại 11 Sport. Bảo hành uy tín, giao nhanh toàn quốc.`;

  return buildMetadata({
    title,
    description,
    path: `/thuong-hieu/${params.slug}`,
    image: brand?.seo?.ogImage || brand?.logoUrl,
  });
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
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

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: `Thương hiệu ${brandName}`, path: `/thuong-hieu/${params.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary truncate">
          {brandName}
        </span>
      </nav>

      {/* Single H1 */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
          {brandName} Chính Hãng
        </h1>
        <span className="font-mono text-sm text-ink-muted">
          ({productsRes.meta.total} sản phẩm)
        </span>
      </div>

      <Suspense
        fallback={
          <div className="h-96 rounded-xl bg-surface-muted animate-pulse" />
        }
      >
        <CatalogClient
          products={productsRes.data}
          meta={productsRes.meta}
          facets={productsRes.facets}
          hideBrandFilter
        />
      </Suspense>

      <SeoDescriptionBox
        html={brand?.descriptionHtml}
        title={`Giới thiệu thương hiệu ${brandName}`}
      />
    </div>
  );
}
