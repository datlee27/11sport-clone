import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";
import type { ArticleSummary } from "@/types/storefront";

interface ArticleGridSectionProps {
  articles: ArticleSummary[];
  title?: string;
}

export function ArticleGridSection({
  articles,
  title = "Tin tức & Hướng dẫn chọn đồ",
}: ArticleGridSectionProps) {
  if (!articles.length) return null;

  return (
    <section aria-label={title} className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl lg:text-[26px] font-bold text-ink-primary">
          {title}
        </h2>
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover min-h-[44px]"
        >
          <span>Xem thêm</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.slice(0, 3).map((article) => (
          <article
            key={article._id}
            className="group rounded-xl border border-surface-border bg-white shadow-card hover:shadow-card-hover transition-shadow overflow-hidden flex flex-col"
          >
            <Link
              href={`/tin-tuc/${article.slug}`}
              className="relative aspect-[16/9] bg-surface-muted overflow-hidden block"
            >
              {article.thumbnailUrl ? (
                <Image
                  src={article.thumbnailUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-ink-muted">
                  11 SPORT BLOG
                </div>
              )}
            </Link>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
                {article.category?.name && (
                  <span className="px-2 py-0.5 rounded bg-brand-tint text-brand-primary font-semibold">
                    {article.category.name}
                  </span>
                )}
                {article.publishedAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-ink-primary group-hover:text-brand-primary line-clamp-2 leading-snug">
                <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
              </h3>

              {article.excerpt && (
                <p className="mt-2 text-sm text-ink-secondary line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
