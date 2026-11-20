"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, MessageCircle, Phone, X } from "lucide-react";
import type { SiteSettingsData } from "@/lib/storefront";

export function FloatingContactWidget({ settings }: { settings?: SiteSettingsData | null }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const hotline = settings?.hotline || "0900 000 011";
  const hotlineDigits = hotline.replace(/\D/g, "") || "0900000011";
  const zaloUrl = settings?.zaloUrl || "https://zalo.me/11sport";
  const messengerUrl = settings?.messengerUrl || "https://m.me/11sport.vn";

  // Né Sticky Mobile CTA Bar trên trang PDP (/san-pham/*) và Checkout (/checkout)
  const hasStickyBar =
    pathname?.startsWith("/san-pham/") || pathname?.startsWith("/checkout");

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Widget */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-30 flex-col items-end gap-2.5">
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            className="w-12 h-12 rounded-full bg-white border border-surface-border text-ink-primary shadow-card-hover hover:border-brand-primary hover:text-brand-primary flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Zalo"
          className="w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-card-hover flex items-center justify-center font-bold text-xs hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Zalo
        </a>

        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Messenger"
          className="w-12 h-12 rounded-full bg-[#0084FF] text-white shadow-card-hover flex items-center justify-center hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
        </a>

        <div className="relative group/phone flex items-center justify-end">
          <a
            href={`tel:${hotlineDigits}`}
            className="pointer-events-none group-hover/phone:pointer-events-auto group-focus-within/phone:pointer-events-auto absolute right-14 whitespace-nowrap px-3.5 py-2 rounded-full bg-brand-primary text-white font-mono text-xs font-bold shadow-card-hover opacity-0 translate-x-2 group-hover/phone:opacity-100 group-hover/phone:translate-x-0 group-focus-within/phone:opacity-100 group-focus-within/phone:translate-x-0 transition-all duration-200"
          >
            {hotline}
          </a>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-brand-primary/30 animate-ping motion-reduce:hidden"
            />
            <a
              href={`tel:${hotlineDigits}`}
              aria-label={`Gọi Hotline ${hotline}`}
              className="relative w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white shadow-card-hover flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Widget: Thu gọn 1 nút tròn, tự né Sticky CTA Bar */}
      <div
        className={`md:hidden fixed right-4 z-30 flex flex-col items-end gap-2 ${
          hasStickyBar ? "bottom-[88px]" : "bottom-5"
        }`}
      >
        {mobileMenuOpen && (
          <div className="flex flex-col items-end gap-2 mb-1">
            <a
              href={`tel:${hotlineDigits}`}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-brand-primary text-white text-sm font-semibold shadow-card-hover"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono">{hotline}</span>
            </a>
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-[#0068FF] text-white text-sm font-semibold shadow-card-hover"
            >
              <span>Chat Zalo</span>
            </a>
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-[#0084FF] text-white text-sm font-semibold shadow-card-hover"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Messenger</span>
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={
            mobileMenuOpen ? "Đóng menu liên hệ nhanh" : "Mở menu liên hệ nhanh"
          }
          aria-expanded={mobileMenuOpen}
          className="w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white shadow-card-hover flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
