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

export const metadata: Metadata = buildMetadata({
  title: "Hệ thống Cửa hàng & Liên hệ 11 Sport",
  description:
    "Địa chỉ 3 showroom 11 Sport tại TP.HCM và Hà Nội. Hotline tư vấn 0900.000.011, mở cửa 08:30 - 21:30 hàng ngày.",
  path: "/lien-he",
});

const SHOWROOMS = [
  {
    name: "11 Sport Quận 1 (Flagship)",
    streetAddress: "112 Nguyễn Trãi, P. Bến Thành",
    addressLocality: "Quận 1",
    addressRegion: "TP. Hồ Chí Minh",
    phone: "0900.000.011",
    hours: "08:30 - 21:30 (Thứ 2 - CN)",
    mapUrl: "https://maps.google.com/?q=112+Nguyen+Trai+Quan+1+TPHCM",
  },
  {
    name: "11 Sport TP. Thủ Đức",
    streetAddress: "45 Song Hành, P. An Phú",
    addressLocality: "TP. Thủ Đức",
    addressRegion: "TP. Hồ Chí Minh",
    phone: "0900.000.012",
    hours: "08:30 - 21:30 (Thứ 2 - CN)",
    mapUrl: "https://maps.google.com/?q=45+Song+Hanh+An+Phu+Thu+Duc",
  },
  {
    name: "11 Sport Hà Nội",
    streetAddress: "88 Thái Hà, P. Trung Liệt",
    addressLocality: "Quận Đống Đa",
    addressRegion: "Hà Nội",
    phone: "0900.000.013",
    hours: "08:30 - 21:30 (Thứ 2 - CN)",
    mapUrl: "https://maps.google.com/?q=88+Thai+Ha+Dong+Da+Ha+Noi",
  },
];

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Liên hệ & Showroom", path: "/lien-he" },
  ];

  const localBusinessJsonLds = SHOWROOMS.map((branch) =>
    buildLocalBusinessJsonLd({
      name: branch.name,
      streetAddress: branch.streetAddress,
      addressLocality: branch.addressLocality,
      addressRegion: branch.addressRegion,
      telephone: branch.phone,
    })
  );

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
          Hệ thống Cửa hàng &amp; Liên hệ 11 Sport
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary max-w-2xl">
          Ghé thăm trực tiếp 3 showroom 11 Sport để trải nghiệm cầm vợt, thử
          giày và nhận tư vấn kỹ thuật từ đội ngũ chuyên viên.
        </p>
      </div>

      {/* 3 Showroom Cards */}
      <section
        aria-label="Danh sách chi nhánh 11 Sport"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {SHOWROOMS.map((branch) => (
          <div
            key={branch.name}
            className="rounded-2xl border border-surface-border bg-white p-5 shadow-card flex flex-col justify-between gap-4"
          >
            <div className="space-y-2.5">
              <h2 className="text-base font-bold text-ink-primary">
                {branch.name}
              </h2>
              <p className="flex items-start gap-2 text-sm text-ink-secondary">
                <MapPin
                  className="w-4 h-4 text-brand-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  {branch.streetAddress}, {branch.addressLocality},{" "}
                  {branch.addressRegion}
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-ink-secondary">
                <Clock
                  className="w-4 h-4 text-brand-primary shrink-0"
                  aria-hidden="true"
                />
                <span>{branch.hours}</span>
              </p>
              <a
                href={`tel:${branch.phone.replace(/\./g, "")}`}
                className="inline-flex items-center gap-2 font-mono text-sm font-bold text-brand-primary hover:underline min-h-[36px]"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{branch.phone}</span>
              </a>
            </div>

            <a
              href={branch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-tint text-sm font-semibold transition-colors"
            >
              <span>Chỉ đường Google Maps</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        ))}
      </section>

      {/* Map & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-surface-border overflow-hidden bg-surface-muted aspect-[16/10]">
          <iframe
            title="Bản đồ Showroom 11 Sport Quận 1"
            src="https://www.google.com/maps?q=112+Nguyen+Trai+Quan+1+TPHCM&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="lg:col-span-5">
          <QuickConsultForm
            title="Gửi tin nhắn liên hệ 11 Sport"
            subtitle="Để lại thông tin, bộ phận CSKH sẽ phản hồi trong 15 phút."
            sourceUrl="/lien-he"
          />
        </div>
      </div>
    </div>
  );
}
