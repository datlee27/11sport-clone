import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { fetchArticleDetail, fetchArticles } from "@/lib/storefront";
import {
  localizeArticleDetail,
  localizeArticleSummary,
  localizeHref,
} from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";
import {
  EDITORIAL_I18N,
  getBlogCategories,
  getBlogCategoryMeta,
} from "@/lib/i18n/editorial";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import {
  ArticleDetailBody,
  ArticleGridCard,
} from "@/components/blog/ArticleViews";
import { PageHeroBanner } from "@/components/store/StorefrontDesignSystem";

interface ArticleOrCategorySlugProps {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ArticleOrCategorySlugProps): Promise<Metadata> {
  const locale = getServerLocale();
  const tCat = EDITORIAL_I18N[locale].blogCategory;

  const catMeta = getBlogCategoryMeta(params.slug, locale);
  if (catMeta) {
    return buildMetadata({
      title: tCat.metaTitle(catMeta.name),
      description: catMeta.description,
      path: `/tin-tuc/${params.slug}`,
      locale,
      searchParams,
    });
  }

  const { data: rawArticle } = await fetchArticleDetail(params.slug);
  if (!rawArticle) {
    return buildMetadata({
      title: tCat.articleFallbackTitle,
      path: `/tin-tuc/${params.slug}`,
      locale,
    });
  }

  const article = localizeArticleDetail(rawArticle, locale);
  return buildMetadata({
    title: article.seo?.title || article.title,
    description:
      article.seo?.description || article.excerpt || article.title,
    path: `/${article.slug}`,
    image: article.seo?.ogImage || article.thumbnailUrl,
    type: "article",
    locale,
  });
}

export default async function NewsCategoryOrArticlePage({
  params,
}: ArticleOrCategorySlugProps) {
  const locale = getServerLocale();
  const tc = EDITORIAL_I18N[locale].common;
  const tList = EDITORIAL_I18N[locale].blogList;
  const catMeta = getBlogCategoryMeta(params.slug, locale);

  // 1. BLOG CATEGORY HUB
  if (catMeta) {
    const articlesRes = await fetchArticles({
      category: params.slug,
      limit: 12,
    });
    const localizedArticles = articlesRes.data.map((post) =>
      localizeArticleSummary(post, locale)
    );
    const allCategories = getBlogCategories(locale);

    const breadcrumbs = [
      { name: tc.home, href: localizeHref("/", locale) },
      { name: tc.blog, href: localizeHref("/tin-tuc", locale) },
      { name: catMeta.name },
    ];

    return (
      <div>
        <JsonLd
          data={buildBreadcrumbJsonLd(
            [
              { name: tc.home, path: "/" },
              { name: tc.blog, path: "/tin-tuc" },
              { name: catMeta.name, path: `/tin-tuc/${params.slug}` },
            ],
            locale
          )}
        />

        <PageHeroBanner
          title={catMeta.name}
          breadcrumbs={breadcrumbs}
          tone="news"
        />

        <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#ececec] pb-3.5">
              <Link
                href={localizeHref("/tin-tuc", locale)}
                className="min-h-[32px] px-3.5 py-1 rounded-none border border-[#dddddd] bg-white text-xs font-bold uppercase tracking-wider text-[#555555] hover:border-[#224e40] hover:text-[#224e40] inline-flex items-center"
              >
                {tList.allArticles}
              </Link>
              {allCategories.map((info) => (
                <Link
                  key={info.slug}
                  href={localizeHref(`/tin-tuc/${info.slug}`, locale)}
                  className={`min-h-[32px] px-3.5 py-1 rounded-none border text-xs font-bold uppercase tracking-wider inline-flex items-center transition-colors ${
                    info.slug === params.slug
                      ? "border-[#224e40] bg-[#224e40] text-white"
                      : "border-[#dddddd] bg-white text-[#555555] hover:border-[#224e40] hover:text-[#224e40]"
                  }`}
                >
                  {info.name}
                </Link>
              ))}
            </div>

            {localizedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {localizedArticles.map((post) => (
                  <ArticleGridCard
                    key={post._id}
                    article={post}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[#e5e5e5] bg-[#f8f9f5] p-8 text-center space-y-3">
                <p className="text-sm text-[#555555]">{tList.emptyTitle}</p>
                <Link
                  href={localizeHref("/tin-tuc", locale)}
                  className="inline-flex items-center justify-center min-h-[40px] px-5 bg-[#224e40] hover:bg-[#193b30] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {tList.emptyAction}
                </Link>
              </div>
            )}
          </div>

          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <QuickConsultForm
              variant="sidebar"
              sourceUrl={localizeHref(`/tin-tuc/${params.slug}`, locale)}
              locale={locale}
            />
          </aside>
        </div>
      </div>
    );
  }

  // 2. BLOG ARTICLE DETAIL (/tin-tuc/[post-slug])
  const { data: rawArticle, notFound: isNotFound } = await fetchArticleDetail(
    params.slug
  );
  if (isNotFound || !rawArticle) {
    notFound();
  }

  const article = localizeArticleDetail(rawArticle, locale);

  const breadcrumbs = [
    { name: tc.home, path: "/" },
    { name: tc.blog, path: "/tin-tuc" },
    ...(article.category
      ? [
          {
            name: article.category.name,
            path: `/tin-tuc/${article.category.slug}`,
          },
        ]
      : []),
    { name: article.title, path: `/tin-tuc/${params.slug}` },
  ];

  return (
    <div>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd(breadcrumbs, locale),
          buildArticleJsonLd({
            title: article.title,
            description: article.excerpt || article.title,
            slug: article.slug,
            image: article.thumbnailUrl || "/images/mock/news-cover-1.svg",
            publishedAt: article.publishedAt || new Date().toISOString(),
            updatedAt: article.updatedAt,
            authorName: article.authorName,
            locale,
          }),
        ]}
      />

      <ArticleDetailBody
        article={article}
        sourceUrl={`/tin-tuc/${article.slug}`}
        locale={locale}
      />
    </div>
  );
}
