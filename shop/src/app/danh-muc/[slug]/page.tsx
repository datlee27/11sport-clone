import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchCategoryDetail, fetchProducts } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SeoDescriptionBox } from "@/components/catalog/SeoDescriptionBox";

interface CategoryPageProps {
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
}: CategoryPageProps): Promise<Metadata> {
  const { data } = await fetchCategoryDetail(params.slug);
  const category = data?.category;
  const title =
    category?.seo?.title ||
    (category?.name
      ? `${category.name} Chính Hãng`
      : `${formatSlugTitle(params.slug)} Chính Hãng`);
  const description =
    category?.seo?.description ||
    `Mua ${category?.name || formatSlugTitle(params.slug)} chính hãng tại 11 Sport. Giá tốt, bảo hành đầy đủ, freeship đơn từ 500k.`;

  return buildMetadata({
    title,
    description,
    path: `/danh-muc/${params.slug}`,
    image: category?.seo?.ogImage || category?.imageUrl,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
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
  const categoryName = category?.name || formatSlugTitle(params.slug);
  const subCategories =
    catResult.data?.subCategories || category?.subCategories || [];
  const hubBrands = catResult.data?.brands || [];

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: categoryName, path: `/danh-muc/${params.slug}` },
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
          {categoryName}
        </span>
      </nav>

      {/* Single H1 */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
          {categoryName}
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
          subCategories={subCategories}
          hubBrands={hubBrands}
        />
      </Suspense>

      <SeoDescriptionBox
        html={category?.descriptionHtml}
        title={`Thông tin về ${categoryName}`}
      />
    </div>
  );
}
