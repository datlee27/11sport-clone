"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronUp, Copy, MessageCircle, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N, localizeChromeShowroom } from "@/lib/i18n/chrome";
import type { SiteSettingsData } from "@/lib/storefront";

const HIDDEN_WIDGET_PATHS = [
  "/thanh-toan",
  "/en/thanh-toan",
  "/checkout",
  "/en/checkout",
  "/gio-hang",
  "/en/gio-hang",
  "/cart",
  "/en/cart",
];

/**
 * Right Floating Contact Dock:
 * - Hidden on Cart and Checkout routes to never obstruct pricing or order CTA
 * - Collapses to a single expandable FAB below 1280px; keeps compact dock at xl+
 * - Automatically shifts upward when PDP Sticky Bar is visible (`11sport:pdp-sticky`)
 */
export function FloatingContactWidget({
  settings,
}: {
  settings?: SiteSettingsData | null;
}) {
  const pathname = (usePathname() || "/").replace(/\/+$/, "") || "/";
  const locale = useLocale();
  const t = CHROME_I18N[locale].floatingContact;

  const [showTop, setShowTop] = useState(false);
  const [zaloModalOpen, setZaloModalOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [pdpSticky, setPdpSticky] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHiddenRoute = HIDDEN_WIDGET_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const hotline = settings?.hotline || "+84767.707.128";
  const hotlineDigits = hotline.replace(/\D/g, "") || "84767707128";
  const messengerUrl =
    settings?.messengerUrl || "https://m.me/11sport.pickleball";

  const branches =
    settings?.showrooms && settings.showrooms.length > 0
      ? settings.showrooms.map((b) => localizeChromeShowroom(b, locale))
      : t.defaultBranches;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileExpanded(false);
    const syncSticky = () => {
      setPdpSticky(document.documentElement.dataset.pdpSticky === "1");
    };
    syncSticky();
    window.addEventListener("11sport:pdp-sticky", syncSticky);
    return () => {
      window.removeEventListener("11sport:pdp-sticky", syncSticky);
    };
  }, [pathname]);

  useEffect(() => {
    if (!zaloModalOpen && !mobileExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zaloModalOpen) {
          setZaloModalOpen(false);
        } else {
          setMobileExpanded(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zaloModalOpen, mobileExpanded]);

  if (isHiddenRoute) {
    return null;
  }

  const handleCopyConsult = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(t.consultClipboardMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div
        className={`fixed right-3 sm:right-3.5 ${
          pdpSticky ? "bottom-20" : "bottom-5 sm:bottom-6"
        } z-30 flex flex-col items-end xl:items-center gap-2.5 xl:gap-3 transition-[bottom] duration-200`}
      >
        <div
          id="floating-contact-actions"
          className={`${
            mobileExpanded ? "flex" : "hidden xl:flex"
          } flex-col items-center gap-2.5 xl:gap-3`}
        >
          {/* 1. Pulsing Red Hotline Phone */}
          <a
            href={`tel:${hotlineDigits}`}
            aria-label={t.callHotlineAria(hotline)}
            className="relative mipik-pulse-red w-11 h-11 rounded-full bg-[#e60808] text-white shadow-drawer flex items-center justify-center hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#e60808]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current relative z-10"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
            </svg>
          </a>

          {/* 2. Pulsing Blue Messenger */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t.messengerAria}
            className="relative mipik-pulse-blue w-11 h-11 rounded-full bg-[#1877f2] text-white shadow-drawer flex items-center justify-center hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1877f2]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current relative z-10"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.14 2 11.24c0 2.9 1.45 5.49 3.72 7.18V22l3.4-1.87c.91.25 1.88.39 2.88.39 5.52 0 10-4.14 10-9.24S17.52 2 12 2zm1 12.44-2.55-2.72-4.97 2.72 5.47-5.8 2.61 2.72 4.91-2.72-5.47 5.8z" />
            </svg>
          </a>

          {/* 3. Pulsing Blue Zalo */}
          <button
            type="button"
            onClick={() => {
              setMobileExpanded(false);
              setZaloModalOpen(true);
            }}
            aria-label={t.zaloButtonAria}
            className="relative mipik-pulse-blue w-11 h-11 rounded-full bg-[#0068ff] text-white shadow-drawer flex items-center justify-center hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0068ff]"
          >
            <svg
              viewBox="0 0 36 22"
              className="w-7 h-[18px] relative z-10"
              aria-hidden="true"
            >
              <rect x="0" y="1" width="36" height="20" rx="5" fill="#FFFFFF" />
              <text
                x="18"
                y="11.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0068FF"
                fontSize="11.5"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="-0.3"
              >
                Zalo
              </text>
            </svg>
          </button>
        </div>

        {/* Single Expandable Contact FAB on Mobile & Tablet (<1280px) */}
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          aria-expanded={mobileExpanded}
          aria-controls="floating-contact-actions"
          aria-label={
            mobileExpanded ? t.closeQuickContactAria : t.openQuickContactAria
          }
          className="xl:hidden w-11 h-11 rounded-full bg-store-forest hover:bg-store-forest-hover text-white shadow-drawer flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest focus-visible:ring-offset-2"
        >
          {mobileExpanded ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {/* 4. Back to Top */}
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t.backToTopAria}
            className="w-11 h-11 rounded-full border border-[#9ca3af] bg-white/95 text-[#374151] shadow-sm flex items-center justify-center hover:border-store-forest hover:text-store-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
          >
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Store/Overlay/ZaloConsultantModal */}
      {zaloModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.zaloDialogAria}
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZaloModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-store-border-sage shadow-drawer p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-store-border-sage pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-store-forest">
                  {t.zaloDialogTitle}
                </h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  {t.zaloDialogSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZaloModalOpen(false)}
                aria-label={t.closeZaloAria}
                className="w-10 h-10 rounded-full border border-store-border-sage flex items-center justify-center text-ink-secondary hover:bg-store-surface-sage transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2.5">
              {branches.map((b, idx) => {
                const digits = (b.phone || hotline).replace(/\D/g, "");
                return (
                  <a
                    key={idx}
                    href={`https://zalo.me/${digits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-store-surface-sage border border-store-border-sage hover:border-store-forest transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-primary">
                        {b.name}
                      </p>
                      <p className="text-xs text-ink-secondary truncate">
                        {b.address}
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-store-social-blue text-white text-xs font-bold shrink-0">
                      {t.chatZaloPill}
                    </span>
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCopyConsult}
              className="w-full h-11 rounded-full border border-store-border-sage bg-white text-xs font-bold text-ink-secondary hover:border-store-forest hover:text-store-forest inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-forest"
            >
              {copied ? (
                <>
                  <Check
                    className="w-4 h-4 text-store-forest"
                    aria-hidden="true"
                  />
                  <span>{t.copiedConsultLabel}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{t.copyConsultLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
