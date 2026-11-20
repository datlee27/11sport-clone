import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"
).replace(/\/+$/, "");

export const SITE_NAME = "11 Sport";
export const DEFAULT_DESCRIPTION =
  "Hệ thống bán lẻ dụng cụ Pickleball, Cầu lông, Tennis và phụ kiện thể thao chính hãng tại Việt Nam.";

export interface BuildMetadataInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og-default.jpg",
  type = "website",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/11sport.vn",
      "https://zalo.me/11sport",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-900-000-011",
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: "Vietnamese",
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export interface ProductJsonLdInput {
  name: string;
  description: string;
  slug: string;
  sku: string;
  brandName: string;
  images: string[];
  price: number;
  inStock: boolean;
  ratingValue?: number;
  reviewCount?: number;
}

export function buildProductJsonLd(input: ProductJsonLdInput) {
  const url = `${SITE_URL}/san-pham/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: input.images.map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`
    ),
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "VND",
      price: input.price,
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(input.reviewCount && input.reviewCount > 0 && input.ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.ratingValue,
            reviewCount: input.reviewCount,
          },
        }
      : {}),
  };
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  slug: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const url = `${SITE_URL}/tin-tuc/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image.startsWith("http") ? input.image : `${SITE_URL}${input.image}`,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    author: {
      "@type": "Person",
      name: input.authorName || "Ban biên tập 11 Sport",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export interface LocalBusinessInput {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  telephone: string;
  openingHours?: string;
}

export function buildLocalBusinessJsonLd(branch: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    name: branch.name,
    url: SITE_URL,
    telephone: branch.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.streetAddress,
      addressLocality: branch.addressLocality,
      addressRegion: branch.addressRegion,
      addressCountry: "VN",
    },
    openingHours: branch.openingHours || "Mo-Su 08:30-21:30",
  };
}
