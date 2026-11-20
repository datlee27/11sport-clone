import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

interface SitemapEntry {
  slug: string;
  updatedAt?: string;
}

interface SitemapDataResponse {
  categories?: SitemapEntry[];
  brands?: SitemapEntry[];
  products?: SitemapEntry[];
  articles?: SitemapEntry[];
  pages?: SitemapEntry[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tin-tuc`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lien-he`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await apiFetch<{ data: SitemapDataResponse }>(
      "/public/sitemap-data",
      {
        next: { revalidate: 300, tags: ["sitemap"] },
      }
    );
    const data = res?.data;

    if (data) {
      for (const cat of data.categories ?? []) {
        dynamicRoutes.push({
          url: `${SITE_URL}/danh-muc/${cat.slug}`,
          lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
          changeFrequency: "daily",
          priority: 0.9,
        });
      }

      for (const brand of data.brands ?? []) {
        dynamicRoutes.push({
          url: `${SITE_URL}/thuong-hieu/${brand.slug}`,
          lastModified: brand.updatedAt ? new Date(brand.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      for (const prod of data.products ?? []) {
        dynamicRoutes.push({
          url: `${SITE_URL}/san-pham/${prod.slug}`,
          lastModified: prod.updatedAt ? new Date(prod.updatedAt) : now,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }

      for (const article of data.articles ?? []) {
        dynamicRoutes.push({
          url: `${SITE_URL}/tin-tuc/${article.slug}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      for (const page of data.pages ?? []) {
        dynamicRoutes.push({
          url: `${SITE_URL}/${page.slug}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Fallback an toàn về staticRoutes khi backend chưa chạy
  }

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...staticRoutes, ...dynamicRoutes]) {
    if (!deduped.has(entry.url)) {
      deduped.set(entry.url, entry);
    }
  }

  return Array.from(deduped.values());
}
