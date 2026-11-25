"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LocaleCode } from "@/lib/format";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N } from "@/lib/i18n/chrome";
import { ProductCard } from "@/components/common/ProductCard";
import type { ProductListItem } from "@/types/storefront";

interface ProductCarouselProps {
  products: ProductListItem[];
  showDots?: boolean;
  locale?: LocaleCode;
}

export function ProductCarousel({
  products,
  showDots = false,
  locale,
}: ProductCarouselProps) {
  const routeLocale = useLocale();
  const activeLocale = locale ?? routeLocale;
  const t = CHROME_I18N[activeLocale].productCarousel;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!products.length) return null;

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="pl-3 sm:pl-4 shrink-0 basis-[62%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={product} locale={activeLocale} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Buttons */}
      {canScrollPrev && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label={t.prevProductAria}
          className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 border border-store-border-sage text-ink-primary shadow-md hover:border-store-forest hover:text-store-forest absolute left-2 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {canScrollNext && (
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label={t.nextProductAria}
          className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 border border-store-border-sage text-ink-primary shadow-md hover:border-store-forest hover:text-store-forest absolute right-2 top-1/2 -translate-y-1/2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Dots */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={t.goToGroupAria(idx + 1)}
              className={`h-2 rounded-full transition-all ${
                idx === selectedIndex
                  ? "w-6 bg-store-forest"
                  : "w-2 bg-store-border-sage hover:bg-store-forest/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
