import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchStaticPage } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
  params: { staticSlug: string };
}

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: StaticPageProps): Promise<Metadata> {
  const { data: page } = await fetchStaticPage(params.staticSlug);
  const title = page?.seo?.title || page?.title || formatSlugTitle(params.staticSlug);
  const description =
    page?.seo?.description || `${title} — Thông tin chính thức từ 11 Sport.`;

  return buildMetadata({
    title,
    description,
    path: `/${params.staticSlug}`,
    image: page?.seo?.ogImage,
  });
}

export default async function StaticContentPage({ params }: StaticPageProps) {
  const { data: page, notFound: isNotFound } = await fetchStaticPage(
    params.staticSlug
  );

  if (isNotFound) {
    notFound();
  }

  const title = page?.title || formatSlugTitle(params.staticSlug);
  const contentHtml =
    page?.contentHtml ||
    "<p>Nội dung trang đang được cập nhật từ hệ thống 11 Sport.</p>";

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: title, path: `/${params.staticSlug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary truncate">{title}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
        {title}
      </h1>

      <article
        className="rounded-2xl border border-surface-border bg-white p-5 sm:p-8 prose prose-slate max-w-none text-base text-ink-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
