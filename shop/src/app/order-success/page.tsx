import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessClient } from "@/components/checkout/OrderSuccessClient";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { getServerLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).orderSuccess;
  return buildMetadata({
    title: t.statusMetaTitle,
    description: t.statusMetaDesc,
    path: "/order-success",
    noIndex: true,
    locale,
  });
}

export default function OrderSuccessPage() {
  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-12">
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto h-72 bg-[#f8f9f5] animate-pulse" />
        }
      >
        <OrderSuccessClient />
      </Suspense>
    </div>
  );
}
