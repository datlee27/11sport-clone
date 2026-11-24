"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/format";
import type { BannerItem } from "@/types/storefront";

interface HeroSliderProps {
  banners: BannerItem[];
}

/**
 * Full-bleed Hero Slider 1:1 with live mipik.vn:
 * - Desktop ~1425x490 wide banner, Mobile 1:1 square artwork
 * - Hover-reveal circular white outline prev/next arrows
 * - Circular 12px white outline pagination dots (solid white when active)
 */
export function HeroSlider({ banners }: HeroSliderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: banners.length > 1 },
    reducedMotion || banners.length <= 1 ? [] : [autoplayPlugin.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!banners.length) {
    return (
      <section
        aria-label="Khung banner quảng cáo 11Sport"
        className="group relative w-full overflow-hidden bg-store-surface-sage border-b border-[#e2e8e5]"
      >
        <div className="relative w-full aspect-[16/9] sm:aspect-[1425/490] flex flex-col items-center justify-center text-center px-4 bg-[#eef3f0]">
          <div className="w-12 h-12 rounded-full bg-white border border-[#dce5da] flex items-center justify-center text-[#224e40]/60 mb-2 shadow-sm">
            <ImageIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-[#555555]">
            Chưa có dữ liệu
          </p>
        </div>

        {/* Nút mũi tên giả lập khung slider */}
        <div className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/60 text-black/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/60 text-black/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* Chấm phân trang giả lập */}
        <div className="absolute bottom-2 sm:bottom-3.5 inset-x-0 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-black/25" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Banner nổi bật 11Sport"
      className="group relative w-full overflow-hidden bg-store-surface-sage"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, idx) => {
            const slideContent = (
              <div className="relative w-full aspect-[16/9] sm:aspect-[1425/490]">
                {/* Desktop Image */}
                <Image
                  src={resolveMediaUrl(banner.desktopImageUrl)}
                  alt={banner.altText || banner.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="hidden sm:block object-cover"
                />
                {/* Mobile Image: scale theo tỉ lệ màn hình, không bị crop mất chữ */}
                <Image
                  src={resolveMediaUrl(
                    banner.desktopImageUrl || banner.mobileImageUrl
                  )}
                  alt={banner.altText || banner.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="sm:hidden object-cover object-center"
                />
              </div>
            );

            return (
              <div key={banner._id} className="shrink-0 w-full">
                {banner.linkUrl ? (
                  <Link href={banner.linkUrl} className="block">
                    {slideContent}
                  </Link>
                ) : (
                  slideContent
                )}
              </div>
            );
          })}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Banner trước"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/75 bg-black/15 text-white hover:bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity absolute left-4 top-1/2 -translate-y-1/2 z-10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Banner tiếp theo"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/75 bg-black/15 text-white hover:bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 z-10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="absolute bottom-2 sm:bottom-3.5 inset-x-0 flex items-center justify-center gap-2 z-10">
            {banners.map((b, idx) => (
              <button
                key={b._id}
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Xem banner ${idx + 1}`}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white transition-all ${
                  idx === selectedIndex
                    ? "bg-white scale-110"
                    : "bg-transparent opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
