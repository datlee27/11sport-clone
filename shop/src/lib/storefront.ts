import { ApiError, apiFetch } from "@/lib/api";
import type {
  ArticleDetail,
  ArticleListResponse,
  BrandSummary,
  CategoryDetailResponse,
  HomeDataResponse,
  ProductDetail,
  ProductListItem,
  ProductListResponse,
  ReviewListResponse,
  StaticPageDetail,
} from "@/types/storefront";

export async function fetchHomeData(): Promise<HomeDataResponse | null> {
  try {
    const res = await apiFetch<{ data: HomeDataResponse }>("/public/home", {
      next: { revalidate: 60, tags: ["home"] },
    });
    return res?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchCategoryDetail(
  slug: string
): Promise<{ data: CategoryDetailResponse | null; notFound: boolean }> {
  try {
    const res = await apiFetch<{ data: CategoryDetailResponse | CategoryDetailResponse["category"] }>(
      `/public/categories/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120, tags: ["categories", `category-${slug}`] } }
    );
    const raw = res?.data;
    if (!raw) return { data: null, notFound: true };

    if ("category" in raw && raw.category) {
      return { data: raw, notFound: false };
    }
    return {
      data: { category: raw as CategoryDetailResponse["category"] },
      notFound: false,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { data: null, notFound: true };
    }
    return { data: null, notFound: false };
  }
}

export async function fetchBrandDetail(
  slug: string
): Promise<{ data: BrandSummary | null; notFound: boolean }> {
  try {
    const res = await apiFetch<{ data: BrandSummary }>(
      `/public/brands/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120, tags: ["brands", `brand-${slug}`] } }
    );
    return { data: res?.data ?? null, notFound: !res?.data };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { data: null, notFound: true };
    }
    return { data: null, notFound: false };
  }
}

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  priceMin?: string | number;
  priceMax?: string | number;
  color?: string;
  size?: string;
  inStock?: string | boolean;
  q?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

export async function fetchProducts(
  params: ProductQueryParams
): Promise<ProductListResponse> {
  try {
    const res = await apiFetch<ProductListResponse>("/public/products", {
      params: {
        category: params.category,
        brand: params.brand,
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        color: params.color,
        size: params.size,
        inStock: params.inStock,
        q: params.q,
        sort: params.sort || "featured",
        page: params.page || 1,
        limit: params.limit || 20,
      },
      next: { revalidate: 60, tags: ["products"] },
    });
    return {
      data: res?.data ?? [],
      meta: res?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
      facets: res?.facets,
    };
  } catch {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
      facets: {},
    };
  }
}

export async function fetchProductDetail(
  slug: string
): Promise<{ data: ProductDetail | null; notFound: boolean }> {
  try {
    const res = await apiFetch<{ data: ProductDetail }>(
      `/public/products/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60, tags: ["products", `product-${slug}`] } }
    );
    return { data: res?.data ?? null, notFound: !res?.data };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { data: null, notFound: true };
    }
    return { data: null, notFound: false };
  }
}

export async function fetchRelatedProducts(
  slug: string
): Promise<ProductListItem[]> {
  try {
    const res = await apiFetch<{ data: ProductListItem[] }>(
      `/public/products/${encodeURIComponent(slug)}/related`,
      { next: { revalidate: 120, tags: ["products"] } }
    );
    return res?.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchProductReviews(
  productId: string,
  params?: { rating?: number; hasImages?: boolean; page?: number; limit?: number }
): Promise<ReviewListResponse | null> {
  try {
    return await apiFetch<ReviewListResponse>("/public/reviews", {
      params: {
        productId,
        rating: params?.rating,
        hasImages: params?.hasImages,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
      next: { revalidate: 60, tags: [`reviews-${productId}`] },
    });
  } catch {
    return null;
  }
}

export async function fetchArticles(params?: {
  category?: string;
  q?: string;
  page?: number | string;
  limit?: number;
}): Promise<ArticleListResponse> {
  try {
    const res = await apiFetch<ArticleListResponse>("/public/articles", {
      params: {
        category: params?.category,
        q: params?.q,
        page: params?.page ?? 1,
        limit: params?.limit ?? 12,
      },
      next: { revalidate: 120, tags: ["articles"] },
    });
    return {
      data: res?.data ?? [],
      meta: res?.meta ?? { total: 0, page: 1, limit: 12, totalPages: 1 },
      categories: res?.categories,
    };
  } catch {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 1 },
    };
  }
}

export async function fetchArticleDetail(
  slug: string
): Promise<{ data: ArticleDetail | null; notFound: boolean }> {
  try {
    const res = await apiFetch<{ data: ArticleDetail }>(
      `/public/articles/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120, tags: ["articles", `article-${slug}`] } }
    );
    return { data: res?.data ?? null, notFound: !res?.data };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { data: null, notFound: true };
    }
    return { data: null, notFound: false };
  }
}

export async function fetchStaticPage(
  slug: string
): Promise<{ data: StaticPageDetail | null; notFound: boolean }> {
  try {
    const res = await apiFetch<{ data: StaticPageDetail }>(
      `/public/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: ["pages", `page-${slug}`] } }
    );
    return { data: res?.data ?? null, notFound: !res?.data };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { data: null, notFound: true };
    }
    return { data: null, notFound: false };
  }
}
