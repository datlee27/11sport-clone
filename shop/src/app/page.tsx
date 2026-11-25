import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PackageOpen } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { resolveMediaUrl } from "@/lib/format";
import {
  localizeBanner,
  localizeCategorySummary,
  localizeHomeSectionTitle,
  localizeHref,
  localizeProductSummary,
  localizeUspItem,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { CHROME_I18N } from "@/lib/i18n/chrome";
import { fetchHomeData } from "@/lib/storefront";
import { MotionReveal } from "@/components/common/MotionReveal";
import { ProductCard } from "@/components/common/ProductCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import {
  BoxedSectionTitle,
  DistributorBanner,
  GuaranteePillsHome,
} from "@/components/store/StorefrontDesignSystem";
import type { HomeSectionItem } from "@/types/storefront";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const copy = CHROME_I18N[locale].home;
  return buildMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/",
    locale,
  });
}

export default async function HomePage() {
  const locale = getServerLocale();
  const copy = CHROME_I18N[locale].home;
  const homeData = await fetchHomeData();

  const banners = (homeData?.banners ?? [])
    .filter((b) => resolveMediaUrl(b.desktopImageUrl) !== "")
    .map((b) => localizeBanner(b, locale));
  const heroBanners = banners.filter((b) => b.position === "HERO");
  const inlineBanners = banners.filter((b) => b.position !== "HERO");
  const categoryBlocks = (homeData?.categoryBlocks ?? []).map((cb) => ({
    ...cb,
    category: cb.category
      ? localizeCategorySummary(cb.category, locale)
      : cb.category,
    products: (cb.products ?? []).map((p) => localizeProductSummary(p, locale)),
  }));
  const featuredProducts = (homeData?.featuredProducts ?? []).map((p) =>
    localizeProductSummary(p, locale)
  );
  const brands = homeData?.brands ?? [];
  const uspItems = (homeData?.usp ?? []).map((item) =>
    localizeUspItem(item, locale)
  );

  const defaultCategorySections: HomeSectionItem[] =
    categoryBlocks.length > 0
      ? categoryBlocks.map((cb, idx) => ({
          _id: `cat-${cb.category?.slug || idx}`,
          type: "CATEGORY_GRID" as const,
          title:
            cb.category?.name?.toUpperCase() || copy.fallbackProductsTitle,
          viewAllUrl: cb.category?.slug ? `/${cb.category.slug}` : "/cua-hang",
          sortOrder: idx === 0 ? 2 : 4 + idx,
        }))
      : [
          {
            _id: "featured",
            type: "CATEGORY_GRID" as const,
            title: copy.fallbackPaddlesTitle,
            viewAllUrl: "/vot-pickleball",
            sortOrder: 2,
          },
        ];

  const sections: HomeSectionItem[] =
    homeData?.homeSections && homeData.homeSections.length > 0
      ? [...homeData.homeSections].sort((a, b) => a.sortOrder - b.sortOrder)
      : [
          { _id: "hero", type: "HERO", sortOrder: 1 },
          ...defaultCategorySections,
          { _id: "usp", type: "USP", sortOrder: 3 },
          { _id: "brands", type: "BRANDS", sortOrder: 99 },
        ].sort((a, b) => a.sortOrder - b.sortOrder);

  let categoryBlockIndex = 0;
  let inlineBannerIndex = 0;

  return (
    <>
      {/* Duy nhất 1 thẻ <h1> trên trang chủ */}
      <h1 className="sr-only">{copy.srH1}</h1>

      <div className="bg-white">
        {sections.map((section) => {
          switch (section.type) {
            case "HERO":
              return (
                <HeroSlider
                  key={section._id}
                  banners={heroBanners}
                  locale={locale}
                />
              );

            case "USP":
              return (
                <div key={section._id} className="mt-2">
                  <GuaranteePillsHome items={uspItems} locale={locale} />
                  <div className="mt-[3px]">
                    <DistributorBanner locale={locale} />
                  </div>
                </div>
              );

            case "FLASH_SALE":
            case "BLOG":
              return null;

            case "CATEGORY_GRID":
            case "CATEGORY_CAROUSEL": {
              const block = categoryBlocks[categoryBlockIndex];
              const isFirstGrid = categoryBlockIndex === 0;
              const products = block?.products?.length
                ? block.products
                : isFirstGrid
                ? featuredProducts
                : [];
              categoryBlockIndex += 1;

              // Khi không có sản phẩm nào:
              // - Chỉ hiển thị 1 thông báo rỗng duy nhất ở mục đầu tiên (không lặp lại)
              // - Bỏ hoàn toàn ô tiêu đề danh mục, chỉ hiển thị khung thông báo
              if (!products.length) {
                if (!isFirstGrid) return null;

                return (
                  <section
                    key={section._id}
                    className="max-w-container mx-auto px-3 sm:px-4 lg:px-5 pt-7 lg:pt-9 pb-2"
                  >
                    <MotionReveal className="space-y-5" immediate>
                      <div className="rounded-[8px] border border-dashed border-[#dce5da] bg-[#fbfcfb] py-12 px-4 text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#dce5da] flex items-center justify-center text-[#224e40]/60">
                          <PackageOpen className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium text-[#555555]">
                          {copy.noData}
                        </p>
                      </div>
                    </MotionReveal>
                  </section>
                );
              }

              // Khi có sản phẩm: Hiển thị đầy đủ tiêu đề hộp và lưới sản phẩm
              const rawTitle =
                section.title ||
                block?.category?.name ||
                copy.fallbackFeaturedTitle;
              const title = localizeHomeSectionTitle(rawTitle, locale);
              const displayedProducts = products.slice(0, 25);
              const desktopGridColsClass =
                displayedProducts.length <= 3
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
                  : displayedProducts.length === 4
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

              return (
                <section
                  key={section._id}
                  className="max-w-container mx-auto px-3 sm:px-4 lg:px-5 pt-7 lg:pt-9 pb-2"
                >
                  <MotionReveal className="space-y-5" immediate={isFirstGrid}>
                    <BoxedSectionTitle title={title} />

                    <div
                      className={`grid ${desktopGridColsClass} gap-2.5 sm:gap-3.5`}
                    >
                      {displayedProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          density="home"
                          locale={locale}
                        />
                      ))}
                    </div>
                  </MotionReveal>
                </section>
              );
            }

            case "CUSTOM_BANNER": {
              const banner = inlineBanners[inlineBannerIndex];
              inlineBannerIndex += 1;
              if (!banner) return null;

              const altLabel = banner.altText || banner.title;
              const imgNode = (
                <div className="relative w-full aspect-[16/9] sm:aspect-[1440/360] overflow-hidden bg-surface-muted my-6">
                  <Image
                    src={resolveMediaUrl(banner.desktopImageUrl)}
                    alt={altLabel}
                    fill
                    sizes="100vw"
                    className="hidden sm:block object-cover"
                  />
                  <Image
                    src={resolveMediaUrl(
                      banner.desktopImageUrl || banner.mobileImageUrl
                    )}
                    alt={altLabel}
                    fill
                    sizes="100vw"
                    className="sm:hidden object-cover"
                  />
                </div>
              );

              return (
                <MotionReveal key={section._id}>
                  {banner.linkUrl ? (
                    <Link
                      href={localizeHref(banner.linkUrl, locale)}
                      className="block"
                    >
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
                <BrandCarousel
                  key={section._id}
                  brands={brands}
                  locale={locale}
                  title={localizeHomeSectionTitle(
                    section.title || copy.fallbackBrandsTitle,
                    locale
                  )}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
