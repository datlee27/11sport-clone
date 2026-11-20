"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerItem } from "@/types/storefront";

interface HeroSliderProps {
  banners: BannerItem[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
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
      <section className="w-full bg-brand-primary-hover text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 sm:py-14 lg:py-16 flex flex-col justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-md bg-accent-volt text-ink-primary text-xs font-bold uppercase tracking-wider">
              11 Sport Official Store
            </span>
            <p className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-tight">
              Dụng cụ Pickleball &amp; Thể thao Chính hãng tại Việt Nam
            </p>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Khám phá vợt Pickleball Carbon T700, giày sân cứng Asics và phụ kiện
              thi đấu chuyên nghiệp với chính sách đổi trả 7 ngày.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/danh-muc/vot-pickleball"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-accent-volt text-ink-primary font-bold text-sm hover:opacity-95 transition-opacity"
            >
              Khám phá Vợt Pickleball
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Hệ thống 3 Showroom
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Banner nổi bật 11 Sport"
      className="relative w-full overflow-hidden bg-surface-muted"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, idx) => {
            const slideContent = (
              <div className="relative w-full aspect-square sm:aspect-[16/6] lg:aspect-[1440/495]">
                {/* Desktop Image */}
                <Image
                  src={banner.desktopImageUrl}
                  alt={banner.altText || banner.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="hidden sm:block object-cover"
                />
                {/* Mobile Image */}
                <Image
                  src={banner.mobileImageUrl || banner.desktopImageUrl}
                  alt={banner.altText || banner.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="sm:hidden object-cover"
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
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/90 text-ink-primary shadow-md hover:bg-white absolute left-3 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Banner tiếp theo"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/90 text-ink-primary shadow-md hover:bg-white absolute right-3 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-10">
            {banners.map((b, idx) => (
              <button
                key={b._id}
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Xem banner ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "w-7 bg-accent-volt"
                    : "w-2.5 bg-white/75 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
