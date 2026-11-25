"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { LocaleCode } from "@/lib/format";
import { localizeShowroom } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/client";
import { EDITORIAL_I18N } from "@/lib/i18n/editorial";
import type { SiteShowroomData } from "@/lib/storefront";

/**
 * 1:1 mipik.vn Contact Layout (`Store/Contact/BranchList` 3:4908):
 * - Top 50:50 split: Branch bullets + 3 forest gradient SVG social circles (FB/IG/TikTok) left + sharp 11Sport showroom photo right
 * - Full-width 3-tab Flatsome Map switcher (11SPORT QUẬN 10 | 11SPORT PHÚ NHUẬN | 11SPORT HÀ NỘI) + 450px iframe
 */
export function ContactBranchesClient({
  siteName = "11Sport",
  showrooms,
  locale,
}: {
  siteName?: string;
  showrooms: SiteShowroomData[];
  locale?: LocaleCode;
}) {
  const clientLocale = useLocale();
  const activeLocale = locale ?? clientLocale;
  const t = EDITORIAL_I18N[activeLocale].contact;

  const [activeIdx, setActiveIdx] = useState(0);
  const localizedShowrooms = showrooms.map((branch) =>
    localizeShowroom(branch, activeLocale)
  );
  const rawActiveBranch = showrooms[activeIdx] || showrooms[0];
  const activeBranch = localizedShowrooms[activeIdx] || localizedShowrooms[0];

  const tabLabels = t.tabLocationLabels(siteName);
  const mapQuery = encodeURIComponent(
    rawActiveBranch?.address || "95 Trần Thiện Chánh, Quận 10, TP.HCM"
  );
  const externalMapHref =
    rawActiveBranch?.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="space-y-8">
      {/* Top 50:50 Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-5 min-w-0">
          <h1 className="text-[24px] sm:text-[28px] font-bold uppercase tracking-wide text-[#0a0a0a]">
            {t.heading(siteName)}
          </h1>

          <div className="space-y-4 text-[14px] text-[#333333]">
            {localizedShowrooms.map((branch, idx) => {
              const digits = (branch.phone || "0909888128").replace(/\D/g, "");
              return (
                <div key={idx} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className="font-bold text-[#0a0a0a] hover:text-[#224e40] text-left"
                  >
                    {branch.name}:
                  </button>
                  <ul className="pl-5 list-disc space-y-0.5 text-[#333333]">
                    <li>
                      <span className="font-medium">{t.addressLabel}</span>{" "}
                      {branch.address}
                    </li>
                    {branch.phone && (
                      <li>
                        <span className="font-medium">{t.hotlineLabel}</span>{" "}
                        <a
                          href={`tel:${digits}`}
                          className="text-[#224e40] font-semibold hover:underline tabular-nums"
                        >
                          {branch.phone}
                        </a>
                      </li>
                    )}
                    {branch.hours && (
                      <li>
                        <span className="font-medium">{t.hoursLabel}</span>{" "}
                        {branch.hours}
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* 3 Forest Gradient Social Circles (FB / IG / TikTok) */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label={t.socialAria("Facebook", siteName)}
              className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#224e40_0%,#5c7c70_100%)] text-white inline-flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.3l.7-3H13V9.5c0-.3.2-.5.5-.5z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label={t.socialAria("Instagram", siteName)}
              className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#224e40_0%,#5c7c70_100%)] text-white inline-flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label={t.socialAria("TikTok", siteName)}
              className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#224e40_0%,#5c7c70_100%)] text-white inline-flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M16.5 3h-3v11.2a2.7 2.7 0 1 1-1.9-2.6V8.5a5.8 5.8 0 1 0 4.9 5.7V8.4a6.4 6.4 0 0 0 3.5 1.1V6.6a3.6 3.6 0 0 1-3.5-3.6z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden bg-[#f3f5f4]">
          <Image
            src="/mock/hero-11sport-desktop-1.jpg"
            alt={t.showroomPhotoAlt(siteName)}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Full-Width 3-Tab Flatsome Map Switcher */}
      <section aria-label={t.mapSectionAria}>
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[#dddddd]">
          <div className="flex flex-wrap" role="tablist" aria-label={t.mapSectionAria}>
            {localizedShowrooms.slice(0, 3).map((branch, idx) => {
              const active = idx === activeIdx;
              const label =
                tabLabels[idx] || branch.embedUrl || t.mapTabFallback(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 sm:px-5 min-h-[42px] py-2 text-[12px] sm:text-[13px] font-bold uppercase tracking-wide transition-colors border-t-2 ${
                    active
                      ? "bg-white border-t-[#224e40] border-x border-[#dddddd] -mb-px text-[#0a0a0a]"
                      : "bg-[#f5f5f5] border-t-transparent border-x border-transparent text-[#666666] hover:text-[#0a0a0a]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <a
            href={externalMapHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 pb-2.5 text-[12.5px] font-semibold text-[#224e40] hover:underline"
          >
            <span>{t.openInMaps}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div className="w-full h-[450px] border border-t-0 border-[#dddddd] bg-[#f3f5f4]">
          <iframe
            title={t.mapIframeTitle(activeBranch?.name)}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
