import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { getServerLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).checkout;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/thanh-toan",
    noIndex: true,
    locale,
  });
}

export default function CheckoutPage() {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).checkout;

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-6 lg:py-8">
      <h1 className="sr-only">{t.srHeading}</h1>
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto h-96 bg-[#f8f9f5] animate-pulse" />
        }
      >
        <CheckoutClient />
      </Suspense>
    </div>
  );
}
