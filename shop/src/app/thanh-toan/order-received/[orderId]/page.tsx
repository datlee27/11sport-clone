import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessClient } from "@/components/checkout/OrderSuccessClient";
import { BreadcrumbBar } from "@/components/store/StorefrontDesignSystem";
import { localizeHref } from "@/lib/i18n";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { getServerLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

interface OrderReceivedProps {
  params: { orderId: string };
}

export async function generateMetadata({
  params,
}: OrderReceivedProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).orderSuccess;
  const orderCode = decodeURIComponent(params.orderId || "");

  return buildMetadata({
    title: orderCode
      ? `${t.receivedMetaTitle} #${orderCode}`
      : t.receivedMetaTitle,
    description: t.receivedMetaDesc,
    path: orderCode
      ? `/thanh-toan/order-received/${encodeURIComponent(orderCode)}`
      : "/thanh-toan/order-received",
    noIndex: true,
    locale,
  });
}

export default function OrderReceivedByIdPage({ params }: OrderReceivedProps) {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).orderSuccess;
  const orderCode = decodeURIComponent(params.orderId || "ONL-20261123-0001");

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-12 space-y-6">
      <BreadcrumbBar
        locale={locale}
        items={[
          { name: t.homeCrumb, href: localizeHref("/", locale) },
          { name: t.checkoutCrumb, href: localizeHref("/thanh-toan", locale) },
          { name: t.orderCrumb(orderCode) },
        ]}
      />

      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto h-72 bg-[#f8f9f5] animate-pulse" />
        }
      >
        <OrderSuccessClient initialOrderCode={orderCode} />
      </Suspense>
    </div>
  );
}
