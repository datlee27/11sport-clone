"use client";

import Link from "next/link";
import { localizeHref, STORE_I18N } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { CHROME_I18N, localizeChromeShowroom } from "@/lib/i18n/chrome";
import type { SiteSettingsData } from "@/lib/storefront";

function GoldHeadingDivider() {
  return (
    <div className="relative w-full mt-2 mb-3 h-[3px] flex items-center">
      <div className="w-11 h-[3px] bg-store-gold-divider shrink-0 relative z-10" />
      <div className="flex-1 h-[1px] bg-white/20" />
    </div>
  );
}

/**
 * Global Footer 1:1 with live mipik.vn:
 * - Dark green #224E40 top section, flush beneath BrandCarousel
 * - 4 columns with left gold bar + full hairline title underline
 * - Bulleted showroom & product links with thin 1px white/10 dividers
 * - Circular monochrome SVG social buttons (Facebook, Instagram, TikTok) + Bộ Công Thương badge
 * - Charcoal #525252 bottom strip with copyright & COD / MasterCard / Visa SVG badges
 */
export function Footer({ settings }: { settings?: SiteSettingsData | null }) {
  const locale = useLocale();
  const t = STORE_I18N[locale].footer;
  const chrome = CHROME_I18N[locale].footer;

  const siteName = settings?.siteName || "11Sport";
  const showrooms =
    settings?.showrooms && settings.showrooms.length > 0
      ? settings.showrooms.map((branch) =>
          localizeChromeShowroom(branch, locale)
        )
      : chrome.defaultShowrooms;
  const hotline = settings?.hotline || "+84767.707.128";
  const facebookHref = settings?.facebookUrl || "https://facebook.com/11sport.vn";
  const instagramHref =
    settings?.instagramUrl || "https://instagram.com/11sport.vn";
  const tiktokHref = settings?.tiktokUrl || "https://tiktok.com/@11sport.vn";

  return (
    <footer className="mt-0 text-white border-t border-white">
      {/* Top #224E40 Forest Green Section */}
      <div className="bg-store-forest py-8 lg:py-10">
        <div className="max-w-container mx-auto px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand Branches, Social SVG Icons & Bộ Công Thương */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {siteName.toUpperCase()} PICKLEBALL
            </h2>
            <GoldHeadingDivider />

            <ul className="divide-y divide-white/10 text-[13px] leading-relaxed">
              {showrooms.map((branch, idx) => (
                <li key={idx} className="py-2 flex items-start gap-2">
                  <span className="text-white/80 select-none mt-0.5">•</span>
                  <div>
                    {branch.mapUrl ? (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/95 hover:text-store-gold-divider transition-colors block"
                      >
                        {branch.address || branch.name}
                      </a>
                    ) : (
                      <p className="text-white/95">
                        {branch.address || branch.name}
                      </p>
                    )}
                    {branch.phone && (
                      <a
                        href={`tel:${branch.phone.replace(/\D/g, "")}`}
                        className="mt-1.5 inline-block py-1 text-white/90 hover:text-store-gold-divider transition-colors"
                      >
                        ({branch.phone})
                      </a>
                    )}
                  </div>
                </li>
              ))}
              <li className="py-2 flex items-start gap-2">
                <span className="text-white/80 select-none">•</span>
                <a
                  href={`tel:${hotline.replace(/\D/g, "")}`}
                  className="text-white/95 hover:text-store-gold-divider transition-colors"
                >
                  {chrome.hotlineLabel}: {hotline}
                </a>
              </li>
            </ul>

            {/* 3 Circular Social SVG Buttons (Facebook, Instagram, TikTok) */}
            <div className="mt-3 flex items-center gap-1.5">
              <a
                href={facebookHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/75 hover:bg-white text-store-forest flex items-center justify-center transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                </svg>
              </a>
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/75 hover:bg-white text-store-forest flex items-center justify-center transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" x="4" y="4" rx="4" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="16.5" cy="7.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a
                href={tiktokHref}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-white/75 hover:bg-white text-store-forest flex items-center justify-center transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.05.86.13V9.4a6.34 6.34 0 0 0-1-.08A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
            </div>

            {/* Bộ Công Thương Verified Badge */}
            <div className="mt-3">
              <svg
                role="img"
                aria-label={chrome.moitBadgeAria}
                viewBox="0 0 162 44"
                className="w-[162px] h-[44px] block"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="161"
                  height="43"
                  rx="5.5"
                  fill="#0072BC"
                  stroke="rgba(255,255,255,0.28)"
                />
                <circle
                  cx="21"
                  cy="22"
                  r="10"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                />
                <path
                  d="m16.5 22.5 3 3 5.5-6"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="38"
                  y="17.5"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="700"
                  letterSpacing="0.8"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {chrome.moitBadgeLine1}
                </text>
                <text
                  x="38"
                  y="30.5"
                  fill="#FFFFFF"
                  fontSize="10.2"
                  fontWeight="800"
                  letterSpacing="-0.2"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {chrome.moitBadgeLine2}
                </text>
              </svg>
            </div>
          </div>

          {/* Column 2: SẢN PHẨM / PRODUCTS */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.productsHeading}
            </h2>
            <GoldHeadingDivider />
            <ul className="divide-y divide-white/10 text-[13px]">
              {t.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(link.href, locale)}
                    className="flex items-center gap-2 py-2 text-white/95 hover:text-store-gold-divider transition-colors"
                  >
                    <span className="text-white/80 select-none">•</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: THÔNG TIN / INFORMATION */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.infoHeading}
            </h2>
            <GoldHeadingDivider />
            <ul className="divide-y divide-white/10 text-[13px]">
              {t.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(link.href, locale)}
                    className="block py-2 text-white/95 hover:text-store-gold-divider transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: BLOG / BLOGS */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.blogHeading}
            </h2>
            <GoldHeadingDivider />
            <ul className="divide-y divide-white/10 text-[13px]">
              {t.blog.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(link.href, locale)}
                    className="block py-2 text-white/95 hover:text-store-gold-divider transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Charcoal Strip (#525252) */}
      <div className="bg-[#525252] py-4">
        <div className="max-w-container mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/85">
          <p className="text-center sm:text-left">
            Copyright {new Date().getFullYear()} ©{" "}
            <strong className="text-white font-bold">www.11sport.vn</strong> -
            Design &amp; SEO by{" "}
            <strong className="text-white font-bold">{siteName}</strong>
          </p>

          {/* 3 Monochrome Payment Method Badges (COD, MasterCard, Visa) */}
          <div className="flex items-center gap-1.5">
            <div
              title={chrome.codBadgeTitle}
              className="w-[50px] h-[31px] rounded bg-white/10 border border-white/15 flex items-center justify-center"
            >
              <svg
                role="img"
                aria-label={chrome.codBadgeTitle}
                viewBox="0 0 50 31"
                className="w-[50px] h-[31px] block"
              >
                <text
                  x="25"
                  y="13"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.88)"
                  fontSize="7.2"
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  CASH ON
                </text>
                <text
                  x="25"
                  y="22.5"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.88)"
                  fontSize="7.2"
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  DELIVERY
                </text>
              </svg>
            </div>
            <div
              title="MasterCard"
              className="w-[50px] h-[31px] rounded bg-white/10 border border-white/15 flex items-center justify-center"
            >
              <svg
                role="img"
                viewBox="0 0 36 22"
                className="w-8 h-5"
                aria-label="MasterCard"
              >
                <circle cx="14" cy="11" r="7" fill="rgba(255,255,255,0.65)" />
                <circle cx="22" cy="11" r="7" fill="rgba(255,255,255,0.45)" />
              </svg>
            </div>
            <div
              title="VISA"
              className="w-[50px] h-[31px] rounded bg-white/10 border border-white/15 flex items-center justify-center text-[11px] font-black italic tracking-tight text-white/85"
            >
              VISA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
