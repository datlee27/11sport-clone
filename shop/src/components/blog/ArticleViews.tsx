import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { resolveMediaUrl, type LocaleCode } from "@/lib/format";
import { injectHeadingIds } from "@/lib/articleHtml";
import {
  formatDateByLocale,
  localizeArticleDetail,
  localizeArticleSummary,
  localizeAuthorName,
  localizeHref,
  localizeShowroom,
} from "@/lib/i18n";
import { ARTICLE_SHOWROOMS_BASE, EDITORIAL_I18N } from "@/lib/i18n/editorial";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import { EditorialCallout } from "@/components/store/StorefrontDesignSystem";
import type { ArticleDetail, ArticleSummary } from "@/types/storefront";

/**
 * 1:1 mipik.vn 3-col post grid card:
 * 16:9 sharp thumbnail (no overlay pill/date) -> centered title -> short divider -> centered excerpt.
 */
export function ArticleGridCard({
  article,
  locale = "vi",
}: {
  article: ArticleSummary;
  locale?: LocaleCode;
}) {
  const localized = localizeArticleSummary(article, locale);
  const t = EDITORIAL_I18N[locale].article;
  const thumb = resolveMediaUrl(localized.thumbnailUrl);
  const articleHref = localizeHref(`/${localized.slug}`, locale);

  return (
    <article className="group flex flex-col text-center">
      <Link
        href={articleHref}
        className="relative aspect-[16/9] w-full bg-[#f3f5f4] overflow-hidden block rounded-none"
      >
        {thumb ? (
          <Image
            src={thumb}
            alt={localized.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#777777]">
            {t.cardFallbackBadge}
          </div>
        )}
      </Link>

      <div className="pt-3.5 px-1 flex-1 flex flex-col items-center">
        <h2 className="text-[15px] font-semibold text-[#1e2c26] group-hover:text-[#224e40] line-clamp-2 leading-snug">
          <Link href={articleHref}>{localized.title}</Link>
        </h2>
        <span
          aria-hidden="true"
          className="block w-8 h-[2px] bg-[#dddddd] mx-auto my-2.5"
        />
        {localized.excerpt && (
          <p className="text-[13px] text-[#555555] line-clamp-3 leading-relaxed">
            {localized.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * 1:1 mipik.vn Article Detail layout (no blue hero banner):
 * 9:3 grid inside max-w-container -> centered breadcrumb + H1 + meta + 10px hero photo + FixedTOC + prose + sidebar consult form.
 */
export function ArticleDetailBody({
  article,
  sourceUrl,
  locale = "vi",
}: {
  article: ArticleDetail;
  sourceUrl: string;
  locale?: LocaleCode;
}) {
  const localized = localizeArticleDetail(article, locale);
  const t = EDITORIAL_I18N[locale].article;
  const tc = EDITORIAL_I18N[locale].common;
  const thumb = resolveMediaUrl(localized.thumbnailUrl);
  const formattedDate =
    (localized.publishedAt &&
      formatDateByLocale(localized.publishedAt, locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })) ||
    t.updatedFallback;
  const authorDisplay = localizeAuthorName(localized.authorName, locale);
  const localizedShowrooms = ARTICLE_SHOWROOMS_BASE.map((branch) =>
    localizeShowroom(branch, locale)
  );
  const blogHref = localizeHref("/tin-tuc", locale);

  return (
    <div className="max-w-container mx-auto px-3.5 sm:px-4 lg:px-5 py-7 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <article className="lg:col-span-9 space-y-6 min-w-0">
        {/* Centered Breadcrumb + Dark Forest H1 + Uppercase Meta */}
        <header className="space-y-2.5 text-center">
          <nav
            aria-label={tc.breadcrumbAria}
            className="flex flex-wrap items-center justify-center gap-1.5 text-[12px] text-[#777777]"
          >
            <Link
              href={localizeHref("/", locale)}
              className="hover:text-[#224e40]"
            >
              {tc.home}
            </Link>
            <span aria-hidden="true">»</span>
            <Link href={blogHref} className="hover:text-[#224e40]">
              {tc.blog}
            </Link>
            {localized.category && (
              <>
                <span aria-hidden="true">»</span>
                <Link
                  href={localizeHref(
                    `/tin-tuc/${localized.category.slug}`,
                    locale
                  )}
                  className="hover:text-[#224e40]"
                >
                  {localized.category.name}
                </Link>
              </>
            )}
          </nav>

          <h1 className="text-[24px] sm:text-[31px] font-bold text-[#224e40] leading-tight">
            {localized.title}
          </h1>

          <p className="text-[11.5px] uppercase tracking-wider text-[#666666]">
            {t.publishedBy(formattedDate, authorDisplay)}
          </p>
        </header>

        {/* Rounded Featured Cover */}
        {thumb && (
          <div className="relative aspect-[16/7] w-full rounded-[10px] overflow-hidden bg-[#f3f5f4]">
            <Image
              src={thumb}
              alt={localized.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 72vw"
              className="object-cover"
            />
          </div>
        )}

        {/* FixedTOC Accordion */}
        <ArticleToc contentHtml={localized.contentHtml} locale={locale} />

        {/* Article Body Prose */}
        <div
          className="prose prose-slate max-w-none prose-headings:text-[#1e2c26] prose-headings:font-bold prose-a:text-[#224e40] prose-img:rounded-[8px] text-[#333333] leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{
            __html: injectHeadingIds(localized.contentHtml),
          }}
        />

        <EditorialCallout locale={locale}>{t.calloutBody}</EditorialCallout>

        {/* Showroom CTA Block (1:1 mipik.vn end-of-article branch card) */}
        <section className="border border-[#dce5da] bg-[#f8f9f5] p-5 space-y-2.5 text-[13.5px]">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-[#204b3e]">
            {t.showroomHeading}
          </h2>
          <ul className="space-y-1 text-[#333333]">
            {localizedShowrooms.map((branch) => {
              const digits = branch.phone.replace(/\D/g, "");
              return (
                <li key={branch.name}>
                  <strong>{branch.name}:</strong> {branch.address} ·{" "}
                  <a
                    href={`tel:${digits}`}
                    className="font-bold text-[#224e40] hover:underline tabular-nums"
                  >
                    {branch.phone}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#dce5da]">
            <p className="text-xs uppercase tracking-wider text-[#666666]">
              {t.authorLabel(authorDisplay)}
            </p>
            <Link
              href={blogHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#224e40] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.backToBlog}</span>
            </Link>
          </div>
        </section>
      </article>

      <aside className="lg:col-span-3 lg:sticky lg:top-24">
        <QuickConsultForm
          variant="sidebar"
          sourceUrl={localizeHref(sourceUrl, locale)}
          locale={locale}
        />
      </aside>
    </div>
  );
}
