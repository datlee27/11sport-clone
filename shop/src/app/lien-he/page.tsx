import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import { fetchSiteSettings } from "@/lib/storefront";

export const metadata: Metadata = buildMetadata({
  title: "Hệ thống Cửa hàng & Liên hệ 11 Sport",
  description:
    "Địa chỉ hệ thống showroom 11 Sport chính hãng. Liên hệ hotline tư vấn và hỗ trợ khách hàng.",
  path: "/lien-he",
});

const FALLBACK_SHOWROOMS = [
  {
    name: "11 Sport Showroom",
    address: "24 Tố Hữu, P. Hoà Cường, TP. Đà Nẵng",
    phone: "0900 000 011",
    hours: "08:30 - 21:30",
    mapUrl: "",
    embedUrl: "",
  },
];

export default async function ContactPage() {
  const settings = await fetchSiteSettings();
  const siteName = settings?.siteName || "11 Sport";
  const defaultHotline = settings?.hotline || "0900 000 011";
  const showrooms =
    settings?.showrooms && settings.showrooms.length > 0
      ? settings.showrooms
      : FALLBACK_SHOWROOMS;

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Liên hệ & Showroom", path: "/lien-he" },
  ];

  const localBusinessJsonLds = showrooms.map((branch) => ({
    ...buildLocalBusinessJsonLd({
      name: branch.name || siteName,
      streetAddress: branch.address || "",
      addressLocality: "",
      addressRegion: "Việt Nam",
      telephone: branch.phone || defaultHotline,
    }),
  }));

  const primaryShowroom = showrooms[0];
  const primaryMapEmbed =
    primaryShowroom?.embedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(
      primaryShowroom?.address || siteName
    )}&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8">
      <JsonLd data={[buildBreadcrumbJsonLd(breadcrumbs), ...localBusinessJsonLds]} />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary">
          Hệ thống Showroom &amp; Liên hệ
        </span>
      </nav>

      <div className="space-y-2">
        <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
          Hệ thống Cửa hàng &amp; Liên hệ {siteName}
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary max-w-2xl">
          Ghé thăm trực tiếp showroom để trải nghiệm
          cầm vợt, thử giày và nhận tư vấn kỹ thuật từ đội ngũ chuyên viên.
        </p>
      </div>

      {/* Showroom Cards */}
      <section
        aria-label="Danh sách chi nhánh"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {showrooms.map((branch, idx) => {
          const phone = branch.phone || defaultHotline;
          const phoneDigits = phone.replace(/\D/g, "") || "0900000011";
          const mapHref =
            branch.mapUrl ||
            `https://maps.google.com/?q=${encodeURIComponent(branch.address || branch.name)}`;

          return (
            <div
              key={`${branch.name}-${idx}`}
              className="rounded-2xl border border-surface-border bg-white p-5 shadow-card flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <h2 className="text-base font-bold text-ink-primary">
                  {branch.name}
                </h2>
                {branch.address && (
                  <p className="flex items-start gap-2 text-sm text-ink-secondary">
                    <MapPin
                      className="w-4 h-4 text-brand-primary shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{branch.address}</span>
                  </p>
                )}
                {branch.hours && (
                  <p className="flex items-center gap-2 text-sm text-ink-secondary">
                    <Clock
                      className="w-4 h-4 text-brand-primary shrink-0"
                      aria-hidden="true"
                    />
                    <span>{branch.hours}</span>
                  </p>
                )}
                {phone && (
                  <a
                    href={`tel:${phoneDigits}`}
                    className="inline-flex items-center gap-2 font-mono text-sm font-bold text-brand-primary hover:underline min-h-[36px]"
                  >
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>

              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-tint text-sm font-semibold transition-colors"
              >
                <span>Chỉ đường Google Maps</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          );
        })}
      </section>

      {/* Map & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-surface-border overflow-hidden bg-surface-muted aspect-[16/10]">
          <iframe
            title={`Bản đồ ${primaryShowroom?.name || siteName}`}
            src={primaryMapEmbed}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="lg:col-span-5">
          <QuickConsultForm
            title={`Gửi tin nhắn liên hệ ${siteName}`}
            subtitle="Để lại thông tin, bộ phận CSKH sẽ phản hồi trong 15 phút."
            sourceUrl="/lien-he"
          />
        </div>
      </div>
    </div>
  );
}
