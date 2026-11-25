import type { Metadata } from "next";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { localizeHref, localizeShowroom } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { EDITORIAL_I18N } from "@/lib/i18n/editorial";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import { ContactBranchesClient } from "@/components/contact/ContactBranchesClient";
import { fetchSiteSettings } from "@/lib/storefront";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const t = EDITORIAL_I18N[locale].contact;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/lien-he",
    locale,
  });
}

export default async function ContactPage() {
  const locale = getServerLocale();
  const t = EDITORIAL_I18N[locale].contact;
  const tc = EDITORIAL_I18N[locale].common;

  const settings = await fetchSiteSettings();
  const siteName = settings?.siteName || "11Sport";
  const defaultHotline = settings?.hotline || "0909 888 128";
  const showrooms = settings?.showrooms ?? [];
  const localizedShowrooms = showrooms.map((branch) =>
    localizeShowroom(branch, locale)
  );

  const breadcrumbs = [
    { name: tc.home, path: "/" },
    { name: tc.contact, path: "/lien-he" },
  ];

  const localBusinessJsonLds = localizedShowrooms.map((branch) => ({
    ...buildLocalBusinessJsonLd({
      name: branch.name || siteName,
      streetAddress: branch.address || "",
      addressLocality: "",
      addressRegion: t.addressRegion,
      telephone: branch.phone || defaultHotline,
    }),
  }));

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 lg:py-10 space-y-10">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd(breadcrumbs, locale),
          ...localBusinessJsonLds,
        ]}
      />

      <ContactBranchesClient
        siteName={siteName}
        showrooms={showrooms}
        locale={locale}
      />

      <QuickConsultForm
        variant="horizontal"
        title={t.consultFormTitle}
        sourceUrl={localizeHref("/lien-he", locale)}
        locale={locale}
      />
    </div>
  );
}
