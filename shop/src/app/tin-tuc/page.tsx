import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchArticles } from "@/lib/storefront";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Tin tức & Kiến thức Thể thao 11 Sport",
  description:
    "Hướng dẫn chọn vợt Pickleball, kỹ thuật thi đấu, đánh giá giày sân cứng và tin tức khuyến mãi từ 11 Sport.",
  path: "/tin-tuc",
});

interface BlogListPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

const DEFAULT_CATEGORIES = [
  { name: "Tất cả", slug: "" },
  { name: "Hướng dẫn chọn vợt", slug: "huong-dan-chon-vot" },
  { name: "Kỹ thuật chơi", slug: "ky-thuat-choi" },
  { name: "Tin khuyến mãi", slug: "tin-khuyen-mai" },
];

export default async function BlogListPage({
  searchParams,
}: BlogListPageProps) {
  const category = getParam(searchParams.category) || "";
  const page = Number(getParam(searchParams.page) || "1") || 1;

  const articlesRes = await fetchArticles({
    category: category || undefined,
    page,
    limit: 12,
  });

  const categories =
    articlesRes.categories && articlesRes.categories.length > 0
      ? [{ name: "Tất cả", slug: "" }, ...articlesRes.categories]
      : DEFAULT_CATEGORIES;

  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-brand-primary">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-ink-primary">Tin tức</span>
      </nav>

      <h1 className="text-2xl lg:text-[34px] font-extrabold text-ink-primary leading-tight">
        Tin tức &amp; Kiến thức Thể thao 11 Sport
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = category === cat.slug;
          const href = cat.slug
            ? `/tin-tuc?category=${encodeURIComponent(cat.slug)}`
            : "/tin-tuc";
          return (
            <Link
              key={cat.slug || "all"}
              href={href}
              className={`inline-flex items-center min-h-[44px] px-4 rounded-lg border text-sm font-semibold transition-colors ${
                active
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-surface-border bg-white text-ink-secondary hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Article Grid */}
      {articlesRes.data.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-subtle py-16 px-4 text-center">
          <p className="text-base font-bold text-ink-primary">
            Chưa có bài viết nào trong chuyên mục này
          </p>
          <p className="text-sm text-ink-muted mt-1">
            Nội dung kiến thức thể thao đang được đội ngũ 11 Sport cập nhật.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articlesRes.data.map((article) => (
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

                <h2 className="text-base font-bold text-ink-primary group-hover:text-brand-primary line-clamp-2 leading-snug">
                  <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
                </h2>

                {article.excerpt && (
                  <p className="mt-2 text-sm text-ink-secondary line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {articlesRes.meta.totalPages > 1 && (
        <nav
          aria-label="Phân trang bài viết"
          className="pt-4 flex items-center justify-center gap-2"
        >
          {page > 1 && (
            <Link
              href={`/tin-tuc?${new URLSearchParams({
                ...(category ? { category } : {}),
                page: String(page - 1),
              }).toString()}`}
              aria-label="Trang trước"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-surface-border bg-white text-ink-primary hover:border-brand-primary"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
          <span className="font-mono text-sm font-semibold px-3 text-ink-primary">
            Trang {page} / {articlesRes.meta.totalPages}
          </span>
          {page < articlesRes.meta.totalPages && (
            <Link
              href={`/tin-tuc?${new URLSearchParams({
                ...(category ? { category } : {}),
                page: String(page + 1),
              }).toString()}`}
              aria-label="Trang tiếp theo"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-surface-border bg-white text-ink-primary hover:border-brand-primary"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
