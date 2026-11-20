import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, ChevronRight, User } from "lucide-react";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { fetchArticleDetail } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleToc, type TocHeading } from "@/components/blog/ArticleToc";
import { QuickConsultForm } from "@/components/blog/QuickConsultForm";
import { ProductCard } from "@/components/common/ProductCard";

interface ArticleDetailPageProps {
  params: { slug: string };
}

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseHeadingsAndInjectIds(html: string): {
  processedHtml: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  let idx = 0;

  const processedHtml = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, levelStr: string, attrs: string, innerHtml: string) => {
      const level = Number(levelStr) as 2 | 3;
      const plainText = innerHtml.replace(/<[^>]+>/g, "").trim();
      const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : `muc-${++idx}`;

      if (plainText) {
        headings.push({ id, text: plainText, level });
      }

      if (idMatch) {
        return `<h${level}${attrs}>${innerHtml}</h${level}>`;
      }
      return `<h${level} id="${id}"${attrs}>${innerHtml}</h${level}>`;
    }
  );

  return { processedHtml, headings };
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { data: article } = await fetchArticleDetail(params.slug);
  if (!article) {
    return buildMetadata({
      title: formatSlugTitle(params.slug),
      path: `/tin-tuc/${params.slug}`,
      type: "article",
    });
  }

  return buildMetadata({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    path: `/tin-tuc/${params.slug}`,
    image: article.seo?.ogImage || article.thumbnailUrl,
    type: "article",
  });
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { data: article, notFound: isNotFound } = await fetchArticleDetail(
    params.slug
  );

  if (isNotFound) {
    notFound();
  }

  const title = article?.title || formatSlugTitle(params.slug);
  const rawHtml =
    article?.contentHtml ||
    "<p>Nội dung bài viết đang được cập nhật từ hệ thống 11 Sport.</p>";
  const { processedHtml, headings } = parseHeadingsAndInjectIds(rawHtml);

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
    { name: title, path: `/tin-tuc/${params.slug}` },
  ];

  const articleJsonLd = buildArticleJsonLd({
    title,
    description: article?.excerpt || title,
    slug: params.slug,
    image: article?.thumbnailUrl || "/og-default.jpg",
    publishedAt: article?.publishedAt || new Date().toISOString(),
    updatedAt: article?.updatedAt,
    authorName: article?.authorName,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <JsonLd data={[buildBreadcrumbJsonLd(breadcrumbs), articleJsonLd]} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <Link href="/tin-tuc" className="hover:text-brand-primary">
          Tin tức
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary truncate">{title}</span>
      </nav>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Main Article */}
        <article className="lg:col-span-8 space-y-6 max-w-[740px]">
          <header className="space-y-3">
            {article?.category?.name && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-brand-tint text-brand-primary text-xs font-bold">
                {article.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{article?.authorName || "Ban biên tập 11 Sport"}</span>
              </span>
              {article?.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                </span>
              )}
            </div>
          </header>

          {article?.thumbnailUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-muted border border-surface-border">
              <Image
                src={article.thumbnailUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 740px"
                className="object-cover"
              />
            </div>
          )}

          {/* Auto Table of Contents */}
          <ArticleToc headings={headings} />

          {/* Article Body */}
          <div
            className="prose prose-slate max-w-none text-base text-ink-secondary leading-relaxed prose-headings:text-ink-primary prose-a:text-brand-primary"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </article>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <QuickConsultForm sourceUrl={`/tin-tuc/${params.slug}`} />

          {article?.relatedProducts && article.relatedProducts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-ink-primary">
                Sản phẩm nhắc đến trong bài
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {article.relatedProducts.slice(0, 3).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
