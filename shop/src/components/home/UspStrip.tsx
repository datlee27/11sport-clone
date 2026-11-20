import { Award, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import type { UspItem } from "@/types/storefront";

interface UspStripProps {
  items?: UspItem[];
}

const DEFAULT_USPS: UspItem[] = [
  {
    icon: "shield-check",
    title: "Chính hãng 100%",
    description: "Đại lý ủy quyền Joola, Selkirk, Asics",
  },
  {
    icon: "refresh-cw",
    title: "Đổi trả 7 ngày",
    description: "Hỗ trợ đổi size giày & vợt nguyên tem",
  },
  {
    icon: "truck",
    title: "Giao nhanh 24h",
    description: "Freeship toàn quốc đơn từ 500.000₫",
  },
  {
    icon: "award",
    title: "Tư vấn chuyên sâu",
    description: "Đội ngũ HLV & kỹ thuật viên 11 Sport",
  },
];

function renderIcon(iconName?: string) {
  switch (iconName) {
    case "refresh-cw":
      return <RefreshCw className="w-5 h-5" aria-hidden="true" />;
    case "truck":
      return <Truck className="w-5 h-5" aria-hidden="true" />;
    case "award":
      return <Award className="w-5 h-5" aria-hidden="true" />;
    default:
      return <ShieldCheck className="w-5 h-5" aria-hidden="true" />;
  }
}

export function UspStrip({ items }: UspStripProps) {
  const list = items && items.length > 0 ? items : DEFAULT_USPS;

  return (
    <section aria-label="Cam kết dịch vụ 11 Sport">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {list.map((item, idx) => (
          <div
            key={`${item.title}-${idx}`}
            className="rounded-xl border border-surface-border bg-white p-4 shadow-card flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
              {renderIcon(item.icon)}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink-primary">
                {item.title}
              </h2>
              <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
