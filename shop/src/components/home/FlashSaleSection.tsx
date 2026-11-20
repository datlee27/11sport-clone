"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import type { FlashSaleData } from "@/types/storefront";

interface FlashSaleSectionProps {
  flashSale?: FlashSaleData | null;
}

function getTimeLeft(endAt: string) {
  const diff = Math.max(0, new Date(endAt).getTime() - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return {
    expired: diff === 0,
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    expired: !flashSale?.endAt,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!flashSale?.endAt) return;
    setTimeLeft(getTimeLeft(flashSale.endAt));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(flashSale.endAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSale?.endAt]);

  if (!flashSale || !flashSale.products?.length || timeLeft.expired) {
    return null;
  }

  return (
    <section
      aria-label={flashSale.title || "Flash Sale"}
      className="rounded-2xl border border-accent-hot/20 bg-accent-hot-tint/40 p-4 sm:p-6 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 text-accent-hot">
            <Zap className="w-6 h-6 fill-accent-hot" aria-hidden="true" />
            <h2 className="text-xl lg:text-[26px] font-extrabold tracking-tight uppercase">
              {flashSale.title || "Flash Sale"}
            </h2>
          </div>

          <div
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-secondary"
            aria-label="Thời gian còn lại"
          >
            <span>Kết thúc sau:</span>
            <span className="inline-flex items-center gap-1 font-mono font-bold text-white">
              <span className="px-2 py-1 rounded-md bg-accent-hot min-w-[32px] text-center">
                {timeLeft.hours}
              </span>
              <span className="text-accent-hot">:</span>
              <span className="px-2 py-1 rounded-md bg-accent-hot min-w-[32px] text-center">
                {timeLeft.minutes}
              </span>
              <span className="text-accent-hot">:</span>
              <span className="px-2 py-1 rounded-md bg-accent-hot min-w-[32px] text-center">
                {timeLeft.seconds}
              </span>
            </span>
          </div>
        </div>

        <Link
          href="/tim-kiem?sort=featured"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover min-h-[44px]"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <ProductCarousel products={flashSale.products} />
    </section>
  );
}
