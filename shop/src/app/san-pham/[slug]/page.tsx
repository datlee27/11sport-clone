import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";
import {
  fetchProductDetail,
  fetchProductReviews,
  fetchRelatedProducts,
} from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { ProductDetail } from "@/types/storefront";

interface ProductPageProps {
  params: { slug: string };
}

function buildFallbackProduct(slug: string): ProductDetail {
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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
      "Thông tin sản phẩm đang được đồng bộ từ hệ thống 11 Sport.",
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { data: product } = await fetchProductDetail(params.slug);
  if (!product) {
    return buildMetadata({
      title: "Chi tiết sản phẩm",
      path: `/san-pham/${params.slug}`,
    });
  }

  return buildMetadata({
    title: product.seo?.title || `${product.name} Chính Hãng`,
    description:
      product.seo?.description ||
      product.shortDescription ||
      `Mua ${product.name} chính hãng tại 11 Sport. Bảo hành đầy đủ, đổi trả 7 ngày.`,
    path: `/san-pham/${params.slug}`,
    image:
      product.seo?.ogImage ||
      product.thumbnailUrl ||
      product.images?.[0]?.url,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { data: fetchedProduct, notFound: isNotFound } =
    await fetchProductDetail(params.slug);

  if (isNotFound) {
    notFound();
  }

  const product = fetchedProduct || buildFallbackProduct(params.slug);

  const [relatedProducts, reviewsData] = fetchedProduct
    ? await Promise.all([
        fetchRelatedProducts(params.slug),
        fetchProductReviews(fetchedProduct._id, { page: 1, limit: 10 }),
      ])
    : [[], null];

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            path: `/danh-muc/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, path: `/san-pham/${params.slug}` },
  ];

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description:
      product.shortDescription ||
      `${product.name} chính hãng phân phối tại 11 Sport.`,
    slug: product.slug,
    sku: product.code,
    brandName: product.brand?.name || "11 Sport",
    images:
      product.images?.map((i) => i.url) ||
      (product.thumbnailUrl ? [product.thumbnailUrl] : []),
    price: product.sellingPrice,
    inStock: product.inStock,
    ratingValue: product.ratingAvg,
    reviewCount: product.ratingCount,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <JsonLd data={[buildBreadcrumbJsonLd(breadcrumbs), productJsonLd]} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <Link
              href={`/danh-muc/${product.category.slug}`}
              className="hover:text-brand-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary truncate">
          {product.name}
        </span>
      </nav>

      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        initialReviews={reviewsData}
      />
    </div>
  );
}
