"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ChevronDown, MapPin, Phone, ShieldCheck } from "lucide-react";

interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "products",
    title: "Sản phẩm nổi bật",
    links: [
      { label: "Vợt Pickleball chính hãng", href: "/danh-muc/vot-pickleball" },
      { label: "Giày Pickleball & Tennis", href: "/danh-muc/giay-the-thao" },
      { label: "Thời trang thi đấu", href: "/danh-muc/thoi-trang" },
      { label: "Balo & Túi đựng vợt", href: "/danh-muc/balo-tui" },
      { label: "Phụ kiện & Quấn cán", href: "/danh-muc/phu-kien" },
    ],
  },
  {
    id: "policies",
    title: "Chính sách khách hàng",
    links: [
      { label: "Chính sách bảo hành chính hãng", href: "/chinh-sach-bao-hanh" },
      { label: "Đổi trả miễn phí trong 7 ngày", href: "/chinh-sach-doi-tra" },
      { label: "Vận chuyển & Kiểm tra hàng", href: "/chinh-sach-van-chuyen" },
      { label: "Bảo mật thông tin khách hàng", href: "/chinh-sach-bao-mat" },
      { label: "Hướng dẫn thanh toán VietQR", href: "/huong-dan-thanh-toan" },
    ],
  },
  {
    id: "about",
    title: "Kết nối 11 Sport",
    links: [
      { label: "Giới thiệu 11 Sport", href: "/gioi-thieu" },
      { label: "Tin tức & Hướng dẫn chọn đồ", href: "/tin-tuc" },
      { label: "Hệ thống 3 Showroom", href: "/lien-he" },
      { label: "Tra cứu đơn hàng", href: "/tai-khoan" },
    ],
  },
];

const SHOWROOMS = [
  {
    name: "Chi nhánh Quận 1 (Flagship)",
    address: "112 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM",
    phone: "0900.000.011",
  },
  {
    name: "Chi nhánh Thủ Đức",
    address: "45 Song Hành, P. An Phú, TP. Thủ Đức, TP.HCM",
    phone: "0900.000.012",
  },
  {
    name: "Chi nhánh Hà Nội",
    address: "88 Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội",
    phone: "0900.000.013",
  },
];

export function Footer() {
  const [openCol, setOpenCol] = useState<string | null>("showrooms");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-surface-subtle border-t border-surface-border mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Showrooms */}
          <div className="border-b border-surface-border md:border-b-0 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() =>
                setOpenCol(openCol === "showrooms" ? null : "showrooms")
              }
              aria-expanded={openCol === "showrooms"}
              className="w-full md:pointer-events-none flex items-center justify-between min-h-[44px] md:min-h-0 text-left"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                Hệ thống Showroom 11 Sport
              </span>
              <ChevronDown
                className={`w-5 h-5 text-ink-secondary md:hidden transition-transform ${
                  openCol === "showrooms" ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              className={`mt-3 space-y-3 ${
                openCol === "showrooms" ? "block" : "hidden md:block"
              }`}
            >
              {SHOWROOMS.map((branch) => (
                <div key={branch.name} className="text-sm text-ink-secondary">
                  <p className="font-semibold text-ink-primary">{branch.name}</p>
                  <p className="flex items-start gap-1.5 mt-0.5">
                    <MapPin
                      className="w-4 h-4 text-brand-primary shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{branch.address}</span>
                  </p>
                  <a
                    href={`tel:${branch.phone.replace(/\./g, "")}`}
                    className="inline-flex items-center gap-1.5 mt-0.5 font-mono text-xs font-semibold text-brand-primary hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{branch.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Columns 2-4 */}
          {FOOTER_COLUMNS.map((col) => {
            const isOpen = openCol === col.id;
            return (
              <div
                key={col.id}
                className="border-b border-surface-border md:border-b-0 pb-4 md:pb-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenCol(isOpen ? null : col.id)}
                  aria-expanded={isOpen}
                  className="w-full md:pointer-events-none flex items-center justify-between min-h-[44px] md:min-h-0 text-left"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                    {col.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-ink-secondary md:hidden transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <ul
                  className={`mt-3 space-y-2 ${
                    isOpen ? "block" : "hidden md:block"
                  }`}
                >
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center min-h-[36px] md:min-h-0 text-sm text-ink-secondary hover:text-brand-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted text-center sm:text-left">
            <ShieldCheck
              className="w-4 h-4 text-brand-primary shrink-0"
              aria-hidden="true"
            />
            <span>
              © {new Date().getFullYear()} 11 Sport. Đại lý phân phối dụng cụ thể
              thao chính hãng tại Việt Nam.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Quay về đầu trang"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg border border-surface-border bg-white text-sm font-semibold text-ink-primary hover:border-brand-primary hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
            <span>Lên đầu trang</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
