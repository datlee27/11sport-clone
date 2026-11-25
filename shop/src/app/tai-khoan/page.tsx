import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";
import { getCommerceI18n } from "@/lib/i18n/commerce";
import { getServerLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).account;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/tai-khoan",
    noIndex: true,
    locale,
  });
}

export default function AccountPage() {
  const locale = getServerLocale();
  const t = getCommerceI18n(locale).account;

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-10">
      <h1 className="sr-only">{t.srHeading}</h1>
      <Suspense fallback={<div className="h-64 bg-[#f8f9f5] animate-pulse" />}>
        <AccountClient />
      </Suspense>
    </div>
  );
}
