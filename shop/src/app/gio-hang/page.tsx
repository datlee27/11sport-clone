import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { getServerLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).cart;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/gio-hang",
    noIndex: true,
    locale,
  });
}

export default function CartPage() {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).cart;

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-10">
      <h1 className="sr-only">{t.srHeading}</h1>
      <CartPageClient />
    </div>
  );
}
