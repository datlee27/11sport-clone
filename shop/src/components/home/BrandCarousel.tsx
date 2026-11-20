"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BrandSummary } from "@/types/storefront";

interface BrandCarouselProps {
  brands: BrandSummary[];
  title?: string;
}

export function BrandCarousel({
  brands,
  title = "Thương hiệu đối tác chính hãng",
}: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
    containScroll: "trimSnaps",
  });

  if (!brands.length) return null;

  return (
    <section aria-label={title} className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl lg:text-[26px] font-bold text-ink-primary">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Thương hiệu trước"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-surface-border bg-white text-ink-primary hover:border-brand-primary hover:text-brand-primary"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Thương hiệu tiếp theo"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-surface-border bg-white text-ink-primary hover:border-brand-primary hover:text-brand-primary"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="pl-3 sm:pl-4 shrink-0 basis-1/2 sm:basis-1/4 lg:basis-1/6"
            >
              <Link
                href={`/thuong-hieu/${brand.slug}`}
                className="h-24 rounded-xl border border-surface-border bg-white hover:border-brand-primary hover:shadow-card transition-all flex items-center justify-center p-4"
              >
                {brand.logoUrl ? (
                  <div className="relative w-full h-12">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-extrabold uppercase tracking-wider text-ink-primary">
                    {brand.name}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
