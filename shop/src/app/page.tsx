import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { resolveMediaUrl } from "@/lib/format";
import { fetchHomeData } from "@/lib/storefront";
import { MotionReveal } from "@/components/common/MotionReveal";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import { HeroSlider } from "@/components/home/HeroSlider";
import { UspStrip } from "@/components/home/UspStrip";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import { ArticleGridSection } from "@/components/home/ArticleGridSection";
import type { HomeSectionItem } from "@/types/storefront";

export const metadata = buildMetadata({
  title: "11 Sport — Dụng cụ Pickleball & Thể thao Chính hãng",
  description:
    "Mua vợt Pickleball Joola, Selkirk, CRBN, giày Asics, Mizuno và phụ kiện thể thao chính hãng tại 11 Sport. Freeship đơn từ 500k, đổi trả 7 ngày.",
  path: "/",
});

export default async function HomePage() {
  const homeData = await fetchHomeData();

  const banners = (homeData?.banners ?? []).filter(
    (b) => resolveMediaUrl(b.desktopImageUrl) !== ""
  );
  const heroBanners = banners.filter((b) => b.position === "HERO");
  const inlineBanners = banners.filter((b) => b.position !== "HERO");
  const flashSale = homeData?.flashSale ?? null;
  const categoryBlocks = homeData?.categoryBlocks ?? [];
  const featuredProducts = homeData?.featuredProducts ?? [];
  const brands = homeData?.brands ?? [];
  const articles = homeData?.articles ?? [];
  const uspItems = homeData?.usp ?? [];

  const sections: HomeSectionItem[] =
    homeData?.homeSections && homeData.homeSections.length > 0
      ? [...homeData.homeSections].sort((a, b) => a.sortOrder - b.sortOrder)
      : [
          { _id: "hero", type: "HERO", sortOrder: 1 },
          { _id: "usp", type: "USP", sortOrder: 2 },
          { _id: "flash-sale", type: "FLASH_SALE", sortOrder: 3 },
          {
            _id: "featured",
            type: "CATEGORY_CAROUSEL",
            title: "Sản phẩm nổi bật",
            viewAllUrl: "/tim-kiem",
            sortOrder: 4,
          },
          { _id: "brands", type: "BRANDS", sortOrder: 5 },
          { _id: "blog", type: "BLOG", sortOrder: 6 },
        ];

  let categoryBlockIndex = 0;
  let inlineBannerIndex = 0;

  return (
    <>
      {/* Duy nhất 1 thẻ <h1> trên trang chủ */}
      <h1 className="sr-only">
        11 Sport — Hệ thống bán lẻ dụng cụ Pickleball &amp; Thể thao chính hãng
      </h1>
      <div className="pb-10 lg:pb-12 space-y-10 lg:space-y-12">
        {sections.map((section) => {
        switch (section.type) {
          case "HERO":
            return <HeroSlider key={section._id} banners={heroBanners} />;

          case "USP":
            return (
              <div key={section._id} className="max-w-7xl mx-auto px-4 lg:px-6">
                <MotionReveal>
                  <UspStrip items={uspItems} />
                </MotionReveal>
              </div>
            );

          case "FLASH_SALE":
            return (
              <div key={section._id} className="max-w-7xl mx-auto px-4 lg:px-6">
                <MotionReveal>
                  <FlashSaleSection flashSale={flashSale} />
                </MotionReveal>
              </div>
            );

          case "CATEGORY_GRID":
          case "CATEGORY_CAROUSEL": {
            const block = categoryBlocks[categoryBlockIndex];
            const products = block?.products?.length
              ? block.products
              : categoryBlockIndex === 0
              ? featuredProducts
              : [];
            categoryBlockIndex += 1;

            if (!products.length) return null;

            const title =
              section.title || block?.category?.name || "Sản phẩm nổi bật";
            const viewAllUrl =
              section.viewAllUrl ||
              (block?.category?.slug
                ? `/danh-muc/${block.category.slug}`
                : "/tim-kiem");

            return (
              <div key={section._id} className="max-w-7xl mx-auto px-4 lg:px-6">
                <MotionReveal className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl lg:text-[26px] font-bold text-ink-primary">
                        {title}
                      </h2>
                      {section.subtitle && (
                        <p className="text-sm text-ink-muted mt-0.5">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    <Link
                      href={viewAllUrl}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover min-h-[44px] shrink-0"
                    >
                      <span>Xem tất cả</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>

                  {section.type === "CATEGORY_GRID" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                      {products.slice(0, 10).map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <ProductCarousel products={products} showDots />
                  )}
                </MotionReveal>
              </div>
            );
          }

          case "CUSTOM_BANNER": {
            const banner = inlineBanners[inlineBannerIndex];
            inlineBannerIndex += 1;
            if (!banner) return null;

            const imgNode = (
              <div className="relative w-full aspect-[21/9] sm:aspect-[1440/360] overflow-hidden bg-surface-muted">
                <Image
                  src={resolveMediaUrl(banner.desktopImageUrl)}
                  alt={banner.altText || banner.title}
                  fill
                  sizes="100vw"
                  className="hidden sm:block object-cover"
                />
                <Image
                  src={resolveMediaUrl(banner.mobileImageUrl || banner.desktopImageUrl)}
                  alt={banner.altText || banner.title}
                  fill
                  sizes="100vw"
                  className="sm:hidden object-cover"
                />
              </div>
            );

            return (
              <MotionReveal key={section._id}>
                {banner.linkUrl ? (
                  <Link href={banner.linkUrl} className="block">
                    {imgNode}
                  </Link>
                ) : (
                  imgNode
                )}
              </MotionReveal>
            );
          }

          case "BRANDS":
            return (
              <div key={section._id} className="max-w-7xl mx-auto px-4 lg:px-6">
                <MotionReveal>
                  <BrandCarousel
                    brands={brands}
                    title={section.title || "Thương hiệu đối tác chính hãng"}
                  />
                </MotionReveal>
              </div>
            );

          case "BLOG":
            return (
              <div key={section._id} className="max-w-7xl mx-auto px-4 lg:px-6">
                <MotionReveal>
                  <ArticleGridSection
                    articles={articles}
                    title={section.title || "Tin tức & Hướng dẫn chọn đồ"}
                  />
                </MotionReveal>
              </div>
            );

          default:
            return null;
        }
      })}
      </div>
    </>
  );
}
