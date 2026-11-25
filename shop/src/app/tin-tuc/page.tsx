import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchArticles } from "@/lib/storefront";
import {
  localizeArticleCategoryName,
  localizeArticleSummary,
  localizeHref,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import { EDITORIAL_I18N, getBlogCategories } from "@/lib/i18n/editorial";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import { ArticleGridCard } from "@/components/blog/ArticleViews";
import { PageHeroBanner } from "@/components/store/StorefrontDesignSystem";

interface BlogListPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  searchParams,
}: BlogListPageProps): Promise<Metadata> {
  const locale = getServerLocale();
  const t = EDITORIAL_I18N[locale].blogList;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/tin-tuc",
    locale,
    searchParams,
  });
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export default async function BlogListPage({
  searchParams,
}: BlogListPageProps) {
  const locale = getServerLocale();
  const t = EDITORIAL_I18N[locale].blogList;
  const tc = EDITORIAL_I18N[locale].common;

  const category = getParam(searchParams.category) || "";
  const page = Number(getParam(searchParams.page) || "1") || 1;

  const articlesRes = await fetchArticles({
    category: category || undefined,
    page,
    limit: 12,
  });

  const categories =
    articlesRes.categories && articlesRes.categories.length > 0
      ? [
          { name: t.allCategories, slug: "" },
          ...articlesRes.categories.map((cat) => ({
            slug: cat.slug,
            name: localizeArticleCategoryName(cat.name, locale, cat.slug),
          })),
        ]
      : [
          { name: t.allCategories, slug: "" },
          ...getBlogCategories(locale).map((cat) => ({
            slug: cat.slug,
            name: cat.name,
          })),
        ];

  const localizedArticles = articlesRes.data.map((article) =>
    localizeArticleSummary(article, locale)
  );

  const breadcrumbs = [
    { name: tc.home, href: localizeHref("/", locale) },
    { name: tc.blog },
  ];

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    query.set("page", String(targetPage));
    if (category) query.set("category", category);
    return localizeHref(`/tin-tuc?${query.toString()}`, locale);
  };

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: tc.home, path: "/" },
            { name: tc.blog, path: "/tin-tuc" },
          ],
          locale
        )}
      />

      <PageHeroBanner
        title={t.heroTitle}
        breadcrumbs={breadcrumbs}
        tone="news"
      />

      <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Clean Horizontal Category Links */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#ececec] pb-3.5">
            {categories.map((cat) => {
              const active = category === cat.slug;
              const rawHref = cat.slug
                ? `/tin-tuc/${encodeURIComponent(cat.slug)}`
                : "/tin-tuc";
              const href = localizeHref(rawHref, locale);
              return (
                <Link
                  key={cat.slug || "all"}
                  href={href}
                  className={`inline-flex items-center min-h-[32px] px-3.5 py-1 rounded-none border text-xs font-bold uppercase tracking-wider transition-colors ${
                    active
                      ? "border-[#224e40] bg-[#224e40] text-white"
                      : "border-[#dddddd] bg-white text-[#555555] hover:border-[#224e40] hover:text-[#224e40]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* 3-Col Clean Editorial Grid (1:1 mipik.vn) */}
          {localizedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {localizedArticles.map((article) => (
                <ArticleGridCard
                  key={article._id}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#e5e5e5] bg-[#f8f9f5] p-8 text-center space-y-3">
              <p className="text-sm text-[#555555]">{t.emptyTitle}</p>
              <Link
                href={localizeHref("/tin-tuc", locale)}
                className="inline-flex items-center justify-center min-h-[40px] px-5 bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {t.emptyAction}
              </Link>
            </div>
          )}

          {/* Pagination */}
          {articlesRes.meta.totalPages > 1 && (
            <nav
              aria-label={t.paginationAria}
              className="pt-4 flex items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={buildPageHref(page - 1)}
                  aria-label={t.prevPageAria}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#dddddd] bg-white text-[#0a0a0a] hover:border-[#224e40]"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              <span className="text-sm font-semibold px-3 text-[#0a0a0a] tabular-nums">
                {t.pageLabel(page, articlesRes.meta.totalPages)}
              </span>
              {page < articlesRes.meta.totalPages && (
                <Link
                  href={buildPageHref(page + 1)}
                  aria-label={t.nextPageAria}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#dddddd] bg-white text-[#0a0a0a] hover:border-[#224e40]"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </nav>
          )}
        </div>

        <aside className="lg:col-span-3 lg:sticky lg:top-24">
          <QuickConsultForm
            variant="sidebar"
            sourceUrl={localizeHref("/tin-tuc", locale)}
            locale={locale}
          />
        </aside>
      </div>
    </div>
  );
}
