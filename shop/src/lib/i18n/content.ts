import type { LocaleCode } from "@/lib/format";
import type {
  ArticleDetail,
  ArticleSummary,
  BannerItem,
  BrandSummary,
  CategorySummary,
  GiftPromotion,
  ProductDetail,
  ProductListItem,
  ProductSpec,
  ReviewItem,
  ReviewListResponse,
  StaticPageDetail,
  TierPricingRule,
  UspItem,
} from "@/types/storefront";

export interface PolicySectionLike {
  heading: string;
  paragraphs: string[];
}

export interface PolicyPageLike {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: PolicySectionLike[];
  callout: string;
}

export interface ProgramCardLike {
  badge: string;
  title: string;
  description: string;
}

export interface ProgramPageLike {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  variant: "vision-card" | "trade-in-step";
  cards: ProgramCardLike[];
  callout: string;
}

export interface ShowroomLike {
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  mapUrl?: string;
  embedUrl?: string;
}

function normalizeLookupKey(raw: string | null | undefined): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function titleCaseSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (["CRBN", "KBS", "RPM", "ON", "USA", "UV50+"].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/* -------------------------------------------------------------------------- */
/* 1. Categories, Subcategories, Article Categories & Brands                  */
/* -------------------------------------------------------------------------- */

const CATEGORY_NAME_BY_SLUG_EN: Record<string, string> = {
  // Top-level categories
  "vot-pickleball": "Pickleball Paddles",
  "pickleball-paddles": "Pickleball Paddles",
  "thoi-trang": "11Sport Sportswear",
  "mipik-fashion": "11Sport Sportswear",
  "mipik-sportwear": "11Sport Sportswear",
  "giay-pickleball": "Pickleball Shoes",
  "pickleball-shoes": "Pickleball Shoes",
  "balo-tui-pickleball": "Bags & Backpacks",
  "pickleball-backpacks-bags": "Bags & Backpacks",
  "phu-kien-pickleball": "Pickleball Accessories",
  "pickleball-accessories": "Pickleball Accessories",
  "bong-pickleball": "Pickleball Balls",
  "pickleball-balls": "Pickleball Balls",

  // Fashion subcategories
  "combo-pikpro": "Sportswear Combos",
  "combo-11sport": "Sportswear Combos",
  "combo-mipik": "Sportswear Combos",
  "ao-pikpro": "Pickleball Shirts",
  "ao-11sport": "Pickleball Shirts",
  "ao-mipik": "Pickleball Shirts",
  "non-pikpro": "Pickleball Caps",
  "non-11sport": "Pickleball Caps",
  "non-mipik": "Pickleball Caps",
  "tui-pikpro": "Sport & Tote Bags",
  "tui-11sport": "Sport & Tote Bags",
  "tui-mipik": "Sport & Tote Bags",
  "tat-pikpro": "Performance Socks",
  "tat-11sport": "Performance Socks",
  "tat-mipik": "Performance Socks",

  // Shoe subcategories
  "giay-asics": "Asics Shoes",
  "asics-shoes": "Asics Shoes",
  "giay-skechers": "Skechers Shoes",
  "skechers-shoes": "Skechers Shoes",
  "giay-on": "ON Running Shoes",
  "giay-kaitashi": "Kaitashi Shoes",

  // Paddle brand subcategories
  "vot-pickleball-crbn": "CRBN Pickleball Paddles",
  "vot-pickleball-facolos": "Facolos Pickleball Paddles",
  "vot-pickleball-franklin": "Franklin Pickleball Paddles",
  "vot-pickleball-gearbox": "Gearbox Pickleball Paddles",
  "vot-pickleball-honolulu": "Honolulu Pickleball Paddles",
  "vot-pickleball-joola": "Joola Pickleball Paddles",
  "vot-pickleball-kaitashi": "Kaitashi Pickleball Paddles",
  "vot-pickleball-kaiwin": "Kaiwin Pickleball Paddles",
  "vot-pickleball-kamito": "Kamito Pickleball Paddles",
  "vot-pickleball-kbs": "KBS Pickleball Paddles",
  "vot-pickleball-loco": "Loco Pickleball Paddles",
  "vot-pickleball-luzz": "Luzz Pickleball Paddles",
  "vot-pickleball-proton": "Proton Pickleball Paddles",
  "vot-pickleball-rpm": "RPM Pickleball Paddles",
  "vot-pickleball-selkirk": "Selkirk Pickleball Paddles",
  "vot-pickleball-six-zero": "Six Zero Pickleball Paddles",
  "vot-pickleball-soxter": "Soxter Pickleball Paddles",
  "vot-pickleball-sypik": "Sypik Pickleball Paddles",
  "vot-pickleball-thunder": "Thunder Pickleball Paddles",
  "vot-pickleball-vole": "Vole Pickleball Paddles",
  "vot-pickleball-wika": "Wika Pickleball Paddles",
  "vot-pickleball-zocker": "Zocker Pickleball Paddles",

  // Blog categories
  "kien-thuc-pickleball": "Pickleball Techniques",
  "review-danh-gia": "Paddle Reviews",
  "tu-van-dung-cu-pickleball": "Gear Buying Guides",
  "tin-tuc-cong-dong": "News & Community",
};

const CATEGORY_NAME_BY_VI_EN: Record<string, string> = {
  "vợt pickleball": "Pickleball Paddles",
  "thời trang 11sport": "11Sport Sportswear",
  "thời trang": "11Sport Sportswear",
  "giày": "Pickleball Shoes",
  "giày pickleball": "Pickleball Shoes",
  "túi - balo": "Bags & Backpacks",
  "balo": "Bags & Backpacks",
  "balo pickleball": "Bags & Backpacks",
  "phụ kiện": "Accessories",
  "phụ kiện pickleball": "Pickleball Accessories",
  "bóng pickleball": "Pickleball Balls",
  "combo thời trang": "Sportswear Combos",
  "áo pickleball": "Pickleball Shirts",
  "nón pickleball": "Pickleball Caps",
  "túi thời trang": "Sport & Tote Bags",
  "tất pickleball": "Performance Socks",
  "giày asics": "Asics Shoes",
  "giày skechers": "Skechers Shoes",
  "giày on": "ON Running Shoes",
  "giày kaitashi": "Kaitashi Shoes",
  "kiến thức pickleball": "Pickleball Techniques",
  "review & đánh giá": "Paddle Reviews",
  "tư vấn dụng cụ pickleball": "Gear Buying Guides",
  "tin tức & cộng đồng": "News & Community",
  "tin tức": "Blog",
  "sản phẩm": "Products",
  "sản phẩm nổi bật": "Featured Products",
  "tất cả sản phẩm": "All Products",
};

const CATEGORY_DESC_HTML_EN: Record<string, string> = {
  "vot-pickleball":
    "<p>Authorized distributor of over 20 world-leading <strong>Pickleball Paddle</strong> brands at <strong>11Sport</strong>: Joola, Selkirk, Kamito, Facolos, CRBN, Franklin, Sypik, Wika, Six Zero, and Proton. Every paddle includes a free overgrip, edge tape, and paddle cover, plus automatic bulk pricing from 3 units of the same variant.</p>",
  "thoi-trang":
    "<p>Explore the 4-way breathable <strong>11Sport Pickleball Apparel</strong> collection: Match Combos, Dry-Fit Polo Shirts, UV50+ Performance Caps, Canvas Tote Bags, and anti-slip Cushioned Crew Socks.</p>",
  "giay-pickleball":
    "<p>Dedicated <strong>Pickleball Court Shoes</strong> from Asics, Skechers, ON, and Kaitashi engineered for locked-in ankle support, abrasion-resistant rubber outsoles, and superior hard-court traction.</p>",
  "balo-tui-pickleball":
    "<p><strong>Pickleball Backpacks &amp; Tour Bags</strong> from Joola, Selkirk, and CRBN featuring thermal-insulated paddle compartments and ventilated separate shoe storage.</p>",
  "phu-kien-pickleball":
    "<p>Complete <strong>Pickleball Accessories &amp; Gear</strong>: USAPA-approved Franklin X-40 tournament balls, tacky sweat-absorbing overgrips, protective edge tape, and raw carbon face erasers.</p>",
  "bong-pickleball":
    "<p>USAPA-approved 40-hole outdoor <strong>Pickleball Balls</strong> from Franklin X-40, Joola Heleus, and Kamito built for true flight and crack resistance.</p>",
  "combo-pikpro":
    "<p>Complete coordinated <strong>11Sport Match Combos</strong> bundling Dry-Fit polo shirts, UV50+ caps, and performance socks with instant bundle savings.</p>",
  "ao-pikpro":
    "<p>Moisture-wicking <strong>11Sport Pickleball Shirts</strong> crafted with lightweight 4-way stretch microfiber for unrestricted on-court rotation.</p>",
  "non-pikpro":
    "<p>Ultra-light <strong>11Sport Pickleball Caps</strong> with laser-perforated ventilation and UV50+ sun protection for outdoor court sessions.</p>",
  "tui-pikpro":
    "<p>Versatile <strong>11Sport Sport &amp; Tote Bags</strong> built for everyday court gear, paddles, hydration, and post-match essentials.</p>",
  "tat-pikpro":
    "<p>Cushioned <strong>11Sport Performance Socks</strong> featuring targeted arch compression and non-slip heel support for quick lateral cuts.</p>",
  "giay-asics":
    "<p>Authentic <strong>Asics Pickleball &amp; Tennis Shoes</strong> including Court FF 4 and Gel-Resolution X for premier hard-court stability.</p>",
  "giay-skechers":
    "<p>Authentic <strong>Skechers Viper Court Pro</strong> pickleball shoes equipped with Goodyear Gold Compound outsoles and Arch Fit support.</p>",
  "giay-on":
    "<p>Lightweight <strong>ON Running Court Shoes</strong> engineered for responsive cushioning and explosive movement around the Kitchen line.</p>",
  "giay-kaitashi":
    "<p>Durable, comfortable <strong>Kaitashi Pickleball Shoes</strong> designed for dependable grip and all-day court support.</p>",
};

const BRAND_DESC_HTML_EN: Record<string, string> = {
  crbn: "<p>CRBN pickleball paddles engineered with raw Toray T700 carbon fiber faces, USAPA approved for tournament play.</p>",
  facolos: "<p>Authentic tournament-grade Facolos pickleball paddles designed for control, spin, and durability.</p>",
  franklin: "<p>Official brand of the US Open Pickleball Championships X-40 balls and pro-grade paddles.</p>",
  gearbox: "<p>Gearbox Pro Power paddles powered by patented Solid Span Technology (SST) carbon cores.</p>",
  honolulu: "<p>Honolulu Sword &amp; Shield J2K Kevlar and raw carbon hybrid pickleball paddles.</p>",
  joola: "<p>The #1 pickleball paddle brand on the PPA Tour: Joola Perseus, Hyperion, Scorpeus, Magnus Gen 3S &amp; Pro IV.</p>",
  kaitashi: "<p>Reliable Kaitashi pickleball paddles and court shoes built for comfort and durability.</p>",
  kaiwin: "<p>Accessible Kaiwin pickleball paddles tailored for recreational and club players.</p>",
  kamito: "<p>Kamito Alpha &amp; Radiant pickleball paddles equipped with official NFC authenticity verification chips.</p>",
  kbs: "<p>Balanced KBS pickleball paddles engineered for soft touch and reduced wrist vibration.</p>",
  loco: "<p>Loco pickleball paddles with raw T700 carbon grit for enhanced spin generation.</p>",
  luzz: "<p>Aerodynamic Luzz pickleball paddles designed for quick hand speed at the net.</p>",
  proton: "<p>Proton Series pickleball paddles featuring an ultra-durable Nanotac surface for lasting spin.</p>",
  rpm: "<p>RPM Kevlar-faced pickleball paddles delivering high spin rates and crisp control.</p>",
  selkirk: "<p>Premier US-crafted paddles: Selkirk Labs Project Boomstik, Vanguard Power Air, and Luxx Control Air.</p>",
  "six-zero": "<p>Australian-engineered Six Zero Double Black Diamond &amp; Ruby Kevlar pickleball paddles.</p>",
  soxter: "<p>Soxter pickleball paddles crafted for steady control and forgiving sweet spots.</p>",
  sypik: "<p>Sypik Triton Pro pickleball paddles with raw T700 textured carbon faces.</p>",
  thunder: "<p>Power-oriented Thunder pickleball paddles built for aggressive drives and put-aways.</p>",
  vole: "<p>Vole pickleball paddles built for lightning-quick reflexes and crisp volleys at the net.</p>",
  wika: "<p>Wika Fire &amp; Wika Air pickleball paddles co-developed with pro athlete Quang Duong.</p>",
  zocker: "<p>Authentic Zocker pickleball paddles and court footwear engineered for all-court versatility.</p>",
  asics: "<p>Asics Court FF 4 &amp; Gel-Resolution X pickleball and tennis shoes with superior hard-court grip.</p>",
  skechers: "<p>Skechers Viper Court Pro pickleball shoes built with Goodyear performance rubber outsoles.</p>",
};

const ARTICLE_CATEGORY_DESC_EN: Record<string, string> = {
  "kien-thuc-pickleball":
    "Official USAPA rules, doubles scoring, dinking, third-shot drops, and regulation court dimensions.",
  "review-danh-gia":
    "Hands-on court reviews of the latest Joola, Selkirk, Kamito, Facolos, and CRBN pickleball paddles.",
  "tu-van-dung-cu-pickleball":
    "Practical guides on choosing 14mm vs. 16mm cores, paddle weight, court shoes, and accessories for your skill level.",
  "tin-tuc-cong-dong":
    "PPA Tour updates, local club spotlights, and demo events across all three 11Sport showrooms.",
};

export function localizeCategoryName(
  nameOrSlug: string,
  locale: LocaleCode,
  slug?: string
): string {
  if (locale === "vi") return nameOrSlug;

  const cleanSlug = (slug || nameOrSlug)
    .trim()
    .toLowerCase()
    .replace(/___(en|vi)$/, "");
  if (CATEGORY_NAME_BY_SLUG_EN[cleanSlug]) {
    return CATEGORY_NAME_BY_SLUG_EN[cleanSlug]!;
  }

  const normalizedName = normalizeLookupKey(nameOrSlug);
  if (CATEGORY_NAME_BY_VI_EN[normalizedName]) {
    return CATEGORY_NAME_BY_VI_EN[normalizedName]!;
  }

  // Pattern fallbacks for brand-category labels
  const paddleMatch = nameOrSlug.match(/^Vợt\s+Pickleball\s+(.+)$/i);
  if (paddleMatch?.[1]) {
    return `${paddleMatch[1].trim()} Pickleball Paddles`;
  }
  const shoePickleballMatch = nameOrSlug.match(/^Giày\s+Pickleball\s+(.+)$/i);
  if (shoePickleballMatch?.[1]) {
    return `${shoePickleballMatch[1].trim()} Pickleball Shoes`;
  }
  const shoeMatch = nameOrSlug.match(/^Giày\s+(.+)$/i);
  if (shoeMatch?.[1]) {
    return `${shoeMatch[1].trim()} Shoes`;
  }

  if (cleanSlug.startsWith("vot-pickleball-")) {
    const brand = cleanSlug.replace(/^vot-pickleball-/, "");
    return `${titleCaseSlug(brand)} Pickleball Paddles`;
  }
  if (cleanSlug.startsWith("giay-")) {
    const brand = cleanSlug.replace(/^giay-/, "");
    return `${titleCaseSlug(brand)} Shoes`;
  }

  return nameOrSlug;
}

export function localizeCategoryDescription(
  slug: string,
  descriptionHtml: string | undefined,
  locale: LocaleCode
): string | undefined {
  if (locale === "vi") return descriptionHtml;
  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/___(en|vi)$/, "")
    .replace(/-11sport$/, "-pikpro")
    .replace(/-mipik$/, "-pikpro");

  if (CATEGORY_DESC_HTML_EN[cleanSlug]) {
    return CATEGORY_DESC_HTML_EN[cleanSlug];
  }

  const brandKey = cleanSlug
    .replace(/^vot-pickleball-/, "")
    .replace(/^giay-/, "");
  if (BRAND_DESC_HTML_EN[brandKey]) {
    return BRAND_DESC_HTML_EN[brandKey];
  }

  return descriptionHtml;
}

export function localizeCategorySummary<T extends CategorySummary>(
  category: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return category;
  const name = localizeCategoryName(category.name, locale, category.slug);
  const descriptionHtml = localizeCategoryDescription(
    category.slug,
    category.descriptionHtml,
    locale
  );
  return {
    ...category,
    name,
    ...(descriptionHtml !== undefined ? { descriptionHtml } : {}),
    ...(category.subCategories
      ? {
          subCategories: category.subCategories.map((sub) =>
            localizeCategorySummary(sub, locale)
          ),
        }
      : {}),
  };
}

export function localizeBrandDescription(
  slug: string,
  descriptionHtml: string | undefined,
  locale: LocaleCode
): string | undefined {
  if (locale === "vi") return descriptionHtml;
  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/^vot-pickleball-/, "")
    .replace(/^giay-/, "");
  return BRAND_DESC_HTML_EN[cleanSlug] || descriptionHtml;
}

export function localizeCountryName(country: string, locale: LocaleCode): string {
  if (locale === "vi") return country;
  if (normalizeLookupKey(country) === "việt nam") return "Vietnam";
  return country;
}

export function localizeBrandSummary<
  T extends BrandSummary & { country?: string }
>(brand: T, locale: LocaleCode): T {
  if (locale === "vi") return brand;
  return {
    ...brand,
    descriptionHtml: localizeBrandDescription(
      brand.slug,
      brand.descriptionHtml,
      locale
    ),
    ...(brand.country
      ? { country: localizeCountryName(brand.country, locale) }
      : {}),
  };
}

export function localizeArticleCategoryName(
  nameOrSlug: string,
  locale: LocaleCode,
  slug?: string
): string {
  return localizeCategoryName(nameOrSlug, locale, slug);
}

export function localizeArticleCategoryDescription(
  slug: string,
  fallbackDescription: string,
  locale: LocaleCode
): string {
  if (locale === "vi") return fallbackDescription;
  return ARTICLE_CATEGORY_DESC_EN[slug] || fallbackDescription;
}

/* -------------------------------------------------------------------------- */
/* 2. USP / Guarantees, Banners & Showrooms                                   */
/* -------------------------------------------------------------------------- */

const USP_BY_ICON_EN: Record<string, { title: string; description: string }> = {
  gift: {
    title: "Free Overgrip, Edge Tape & Paddle Cover",
    description: "Includes a complete authentic paddle protection accessory kit",
  },
  shield: {
    title: "Official Warranty",
    description: "1-to-1 replacement for defects per manufacturer standards",
  },
  check: {
    title: "100% Authentic",
    description: "NFC / QR authenticity verification — 200% refund if counterfeit",
  },
  truck: {
    title: "Free Nationwide Shipping",
    description: "Fast nationwide delivery with open-box inspection before payment",
  },
};

export function localizeUspItem<
  T extends Pick<UspItem, "icon" | "title"> & { description?: string }
>(item: T, locale: LocaleCode): T {
  if (locale === "vi") return item;

  const iconKey = item.icon?.trim().toLowerCase() || "";
  if (iconKey && USP_BY_ICON_EN[iconKey]) {
    const mapped = USP_BY_ICON_EN[iconKey]!;
    return {
      ...item,
      title: mapped.title,
      ...(item.description !== undefined
        ? { description: mapped.description }
        : {}),
    };
  }

  const titleNorm = normalizeLookupKey(item.title);
  if (titleNorm.includes("quấn cán") || titleNorm.includes("bao vợt")) {
    return {
      ...item,
      title: USP_BY_ICON_EN.gift!.title,
      ...(item.description !== undefined
        ? { description: USP_BY_ICON_EN.gift!.description }
        : {}),
    };
  }
  if (titleNorm.includes("bảo hành") || titleNorm.includes("đổi mới")) {
    return {
      ...item,
      title: USP_BY_ICON_EN.shield!.title,
      ...(item.description !== undefined
        ? { description: USP_BY_ICON_EN.shield!.description }
        : {}),
    };
  }
  if (titleNorm.includes("chính hãng") || titleNorm.includes("100%")) {
    return {
      ...item,
      title: USP_BY_ICON_EN.check!.title,
      ...(item.description !== undefined
        ? { description: USP_BY_ICON_EN.check!.description }
        : {}),
    };
  }
  if (titleNorm.includes("vận chuyển") || titleNorm.includes("freeship")) {
    return {
      ...item,
      title: USP_BY_ICON_EN.truck!.title,
      ...(item.description !== undefined
        ? { description: USP_BY_ICON_EN.truck!.description }
        : {}),
    };
  }

  return item;
}

const BANNER_TRANSLATIONS_EN: Record<
  string,
  { title: string; altText: string }
> = {
  "banner-1": {
    title: "11SPORT PICKLEBALL · AUTHENTIC PADDLES & BULK PRICING FROM 3+",
    altText:
      "11Sport Pickleball — Authentic Joola, Selkirk, Facolos & CRBN Paddles",
  },
  "banner-2": {
    title: "PADDLE TRADE-IN · UPGRADE TO PRO PADDLES AT 11SPORT",
    altText:
      "11Sport Paddle Trade-In — 3 Showrooms in HCMC & Hanoi · 1-to-1 Replacement",
  },
};

export function localizeBanner<T extends BannerItem>(
  banner: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return banner;
  const matched = BANNER_TRANSLATIONS_EN[banner._id];
  if (matched) {
    return {
      ...banner,
      title: matched.title,
      altText: matched.altText,
    };
  }
  return banner;
}

export function localizeTopBarText(
  text: string | undefined,
  locale: LocaleCode
): string {
  if (locale === "vi") {
    return (
      text ||
      "CHÍNH HÃNG 100% • LỖI LÀ ĐỔI MỚI • FREESHIP TOÀN QUỐC • TẶNG QUẤN CÁN, DÁN VIỀN, BAO VỢT"
    );
  }
  return "100% AUTHENTIC • 1-TO-1 REPLACEMENT • FREE NATIONWIDE SHIPPING • FREE OVERGRIP, EDGE TAPE & PADDLE COVER";
}

export function localizeHomeSectionTitle(
  rawTitle: string,
  locale: LocaleCode
): string {
  if (locale === "vi") return rawTitle;
  const upper = rawTitle.trim().toUpperCase();
  if (upper.includes("VỢT") || upper.includes("PADDLE")) {
    return "PICKLEBALL PADDLES";
  }
  if (upper.includes("THỜI TRANG") || upper.includes("FASHION") || upper.includes("SPORTSWEAR")) {
    return "11SPORT EXCLUSIVE COLLECTION";
  }
  if (upper.includes("GIÀY") || upper.includes("SHOE")) {
    return "SHOES";
  }
  if (upper.includes("BALO") || upper.includes("TÚI") || upper.includes("BAG")) {
    return "BAGS & BACKPACKS";
  }
  if (upper.includes("PHỤ KIỆN") || upper.includes("GEAR") || upper.includes("ACCESSOR")) {
    return "ACCESSORIES";
  }
  if (upper.includes("THƯƠNG HIỆU") || upper.includes("BRAND")) {
    return "OFFICIAL AUTHORIZED BRANDS";
  }
  if (upper.includes("TIN TỨC") || upper.includes("KIẾN THỨC") || upper.includes("BLOG")) {
    return "PICKLEBALL NEWS & GUIDES";
  }
  if (upper.includes("SẢN PHẨM NỔI BẬT")) {
    return "FEATURED PRODUCTS";
  }
  return rawTitle;
}

export function localizeAddressLabel(
  label: string | undefined,
  locale: LocaleCode
): string {
  if (!label) return "";
  if (locale === "vi") return label;
  const map: Record<string, string> = {
    "nhà riêng": "Home",
    "nhà": "Home",
    "văn phòng": "Office",
    "công ty": "Work",
    "mặc định": "Default",
  };
  return map[normalizeLookupKey(label)] || label;
}

export function localizeShowroom<T extends ShowroomLike>(
  showroom: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return showroom;

  const translateBranchText = (value: string): string =>
    value
      .replace(/Quận 10/gi, "District 10")
      .replace(/Quận Phú Nhuận/gi, "Phu Nhuan District")
      .replace(/Phú Nhuận/gi, "Phu Nhuan")
      .replace(/Quận Ba Đình/gi, "Ba Dinh District")
      .replace(/Ba Đình/gi, "Ba Dinh")
      .replace(/Phường 12/gi, "Ward 12")
      .replace(/Phường 2/gi, "Ward 2")
      .replace(/Ngọc Hà/gi, "Ngoc Ha")
      .replace(/TP\.?\s*HCM/gi, "Ho Chi Minh City")
      .replace(/Hà Nội/gi, "Hanoi")
      .replace(/Đường Bưởi/gi, "Buoi St.")
      .replace(/Đ\.\s*Bưởi/gi, "Buoi St.")
      .replace(/Trần Thiện Chánh/gi, "Tran Thien Chanh St.")
      .replace(/Hoa Lan/gi, "Hoa Lan St.")
      .replace(/\(T2\s*-\s*CN\)/gi, "(Mon - Sun)")
      .replace(/QUẬN 10/g, "DISTRICT 10")
      .replace(/PHÚ NHUẬN/g, "PHU NHUAN")
      .replace(/HÀ NỘI/g, "HANOI");

  return {
    ...showroom,
    name: translateBranchText(showroom.name),
    address: translateBranchText(showroom.address),
    ...(showroom.hours ? { hours: translateBranchText(showroom.hours) } : {}),
    ...(showroom.embedUrl
      ? { embedUrl: translateBranchText(showroom.embedUrl) }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* 3. Products, Specs, Variants, Bulk Tiers, Gifts & Reviews                  */
/* -------------------------------------------------------------------------- */

interface ProductTranslationEntry {
  name: string;
  shortDescription: string;
  descriptionHtml: string;
}

const PRODUCT_TRANSLATIONS_BY_SLUG_EN: Record<string, ProductTranslationEntry> =
  {
    "joola-perseus-power-fx": {
      name: "Joola Perseus Power FX 16mm Pickleball Paddle",
      shortDescription:
        "Ben Johns' signature pro paddle with a Full-Foam EPP core for explosive pop, Charged Carbon face for maximum spin, and NFC authenticity chip.",
      descriptionHtml:
        "<h2>Detailed Review: Joola Perseus Power FX Pickleball Paddle</h2><p>The Joola Perseus Power FX features an elongated silhouette (16.5 in length, 5.5 in handle) engineered for heavy baseline drives and confident two-handed backhands.</p><h3>Propulsion Core &amp; Charged Carbon Surface</h3><p>Its Propulsion Core paired with perimeter foam injection expands the sweet spot by 18%, noticeably reducing wrist vibration when blocking high-speed volleys at the net.</p>",
    },
    "vot-pickleball-selkirk-boomstik-st": {
      name: "Selkirk Labs Project Boomstik ST Pickleball Paddle",
      shortDescription:
        "Selkirk Labs Project Boomstik experimental paddle built with a Florek Carbon Fiber face and Air Dynamic Throat for faster hand speed.",
      descriptionHtml:
        "<h2>Selkirk Labs Project Boomstik ST — American Engineering at Its Peak</h2><p>Its aerodynamic open-throat geometry boosts head speed by 15% during rapid-fire hands battles at the Kitchen line.</p>",
    },
    "vot-pickleball-kamito-alpha": {
      name: "Kamito Alpha Pro Carbon T700 Pickleball Paddle",
      shortDescription:
        "Kamito Alpha pickleball paddle with smartphone-scannable NFC chip and durable raw T700 carbon texture—easy to dial in for all-court play.",
      descriptionHtml:
        "<h2>Kamito Alpha Pickleball Paddle — Balanced Control &amp; Pop</h2><p>Co-developed with top Vietnamese athletes for an effortless balance of touch and power.</p>",
    },
    "vot-pickleball-facolos-pro-elite": {
      name: "Facolos Pro Elite Series 16mm Pickleball Paddle",
      shortDescription:
        "USAPA-approved Facolos Pro Elite built with Thermoformed Unibody construction for stability and crisp feedback.",
      descriptionHtml:
        "<p>Facolos' flagship paddle featuring full-perimeter foam edges for comprehensive vibration dampening.</p>",
    },
    "vot-pickleball-crbn-1x-power": {
      name: "CRBN 1X Power Series 16mm Pickleball Paddle",
      shortDescription:
        "Renowned US power and spin paddle crafted with raw Toray T700 carbon fiber.",
      descriptionHtml:
        "<p>The CRBN 1X Power sets the benchmark for modern aggressive pickleball play.</p>",
    },
    "vot-pickleball-joola-hyperion-3s": {
      name: "Joola Ben Johns Hyperion 3S 16mm Pickleball Paddle",
      shortDescription:
        "Aero-Curve head shape reduces air drag while the 16mm Propulsion Core delivers tour-level control.",
      descriptionHtml:
        "<p>The Joola Hyperion 3S pairs effortless put-away power with rock-solid stability.</p>",
    },
    "vot-pickleball-joola-kosmos-16mm": {
      name: "Joola Kosmos Pro Carbon 16mm Pickleball Paddle",
      shortDescription:
        "Deep-textured Charged Carbon face with a balanced swing weight for nimble net play.",
      descriptionHtml:
        "<p>The Joola Kosmos 16mm delivers a generous sweet spot and silky-smooth resets.</p>",
    },
    "vot-pickleball-selkirk-omni-calypso": {
      name: "Selkirk Boomstik Omni Calypso Pickleball Paddle",
      shortDescription:
        "Standout Calypso edition of the Selkirk Boomstik Omni with a high-spin raw carbon face.",
      descriptionHtml:
        "<p>The Omni profile widens the hitting zone for reliable defense and rapid counterattacks.</p>",
    },
    "vot-pickleball-selkirk-boomstik-canyon": {
      name: "Selkirk Boomstik Canyon Limited Pickleball Paddle",
      shortDescription:
        "Limited-edition Canyon release handcrafted in the USA with explosive rebound power.",
      descriptionHtml:
        "<p>The Selkirk Boomstik Canyon is a premier choice for aggressive power players.</p>",
    },
    "ao-mipik-phoi-soc": {
      name: "11Sport Striped Dry-Fit Pickleball Polo Shirt",
      shortDescription:
        "Ultra-light Poly-Spandex tournament pickleball polo with rapid moisture-wicking ventilation.",
      descriptionHtml:
        "<p>Athletic cut tailored for unrestricted torso rotation during pickleball rallies.</p>",
    },
    "combo-mipik-5": {
      name: "11Sport Pro Match Apparel Combo (Polo + Cap + Socks)",
      shortDescription:
        "Complete coordinated on-court pickleball outfit—save 21% as a bundle.",
      descriptionHtml:
        "<p>Includes 1 Dry-Fit Polo Shirt, 1 UV50+ Performance Cap, and 1 pair of cushioned crew socks.</p>",
    },
    "non-pickleball-pikpro": {
      name: "11Sport Ultra-Light UV50+ Pickleball Cap",
      shortDescription:
        "Laser-perforated breathable sports cap with an absorbent inner sweatband.",
      descriptionHtml:
        "<p>Shields your eyes and face under harsh outdoor sun during long court sessions.</p>",
    },
    "asics-court-ff-4-nam": {
      name: "Asics Court FF 4 Men's Pickleball Shoes",
      shortDescription:
        "Asics' flagship court shoe featuring a snug MONO-SOCK fit, TWISTRUSS lateral stability, and FlyteFoam cushioning.",
      descriptionHtml:
        "<p>The Asics Court FF 4 is the #1 choice on the PPA Tour thanks to unmatched hard-court traction.</p>",
    },
    "giay-pickleball-skechers-viper-court-pro": {
      name: "Skechers Viper Court Pro 2.0 Pickleball Shoes",
      shortDescription:
        "Purpose-built pickleball shoes featuring a Goodyear rubber outsole and supportive Arch Fit insole.",
      descriptionHtml:
        "<p>The Goodyear Gold Compound outsole supports abrupt stops and sharp lateral cuts with confidence.</p>",
    },
    "balo-pickleball-joola-vision-ii": {
      name: "Joola Vision II Deluxe Pickleball Backpack",
      shortDescription:
        "Holds up to 4 pickleball paddles with a ventilated shoe compartment and integrated fence hook.",
      descriptionHtml:
        "<p>Water-resistant Joola Vision II backpack shields your paddles from heat and court dust.</p>",
    },
    "tui-pickleball-selkirk-team-tour": {
      name: "Selkirk Core Line Team Tour Pickleball Bag",
      shortDescription:
        "Pro-grade tour bag built with durable Polyfiber shell and thermal-lined paddle compartment.",
      descriptionHtml:
        "<p>Designed to pro standards for the Selkirk Pro Team.</p>",
    },
    "bong-pickleball-franklin-x40-hop-12": {
      name: "Franklin X-40 Outdoor USAPA Pickleball Balls (12-Pack)",
      shortDescription:
        "Official 40-hole outdoor tournament balls of the US Open Pickleball Championships.",
      descriptionHtml:
        "<p>One-piece rotational-molded construction delivers true flight and crack resistance.</p>",
    },
    "bo-quan-can-dan-vien-vot-pickleball": {
      name: "11Sport 3-Pack Pickleball Overgrip & Edge Tape Kit",
      shortDescription:
        "Superior sweat absorption and reliable edge-guard protection against court scrapes.",
      descriptionHtml:
        "<p>Essential maintenance kit for every pickleball player.</p>",
    },
  };

export function localizeProductName(
  name: string,
  locale: LocaleCode,
  slug?: string
): string {
  if (locale === "vi" || !name) return name;

  if (slug && PRODUCT_TRANSLATIONS_BY_SLUG_EN[slug]) {
    return PRODUCT_TRANSLATIONS_BY_SLUG_EN[slug]!.name;
  }

  let result = name.trim();

  // Exact structural pattern translations for dynamic API products
  const rules: Array<[RegExp, string]> = [
    [/^Hộp\s+(\d+)\s+Quả\s+Bóng\s+Pickleball\s+(.+)$/i, "$2 Pickleball Balls ($1-Pack)"],
    [/^Bộ\s+(\d+)\s+Cuộn\s+Quấn\s+Cán\s*&\s*Băng\s+Dán\s+Viền\s+Vợt\s+Pickleball\s+(.+)$/i, "$2 $1-Pack Overgrip & Edge Tape Kit"],
    [/^Bộ\s+(\d+)\s+Quấn\s+Cán\s+(.+)$/i, "$2 Overgrip ($1-Pack)"],
    [/^Quấn\s+cán\s+vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Overgrip"],
    [/^Quấn\s+cán\s+(.+)$/i, "$1 Overgrip"],
    [/^Băng\s+dán\s+viền\s+vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Edge Tape"],
    [/^Băng\s+dán\s+viền\s+(.+)$/i, "$1 Edge Tape"],
    [/^Vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Paddle"],
    [/^Giày\s+Pickleball\s+(.+?)\s+Nam(?:\s+Chính\s+Hãng)?$/i, "$1 Men's Pickleball Shoes"],
    [/^Giày\s+Pickleball\s+(.+?)\s+Nữ(?:\s+Chính\s+Hãng)?$/i, "$1 Women's Pickleball Shoes"],
    [/^Giày\s+Pickleball\s+(.+)$/i, "$1 Pickleball Shoes"],
    [/^Giày\s+(.+)$/i, "$1 Shoes"],
    [/^Balo\s+Đựng\s+Vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Backpack"],
    [/^Balo\s+Pickleball\s+(.+)$/i, "$1 Pickleball Backpack"],
    [/^Balo\s+(.+)$/i, "$1 Backpack"],
    [/^Túi\s+Đựng\s+Vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Bag"],
    [/^Túi\s+Đựng\s+Vợt\s+(.+)$/i, "$1 Pickleball Bag"],
    [/^Túi\s+Pickleball\s+(.+)$/i, "$1 Pickleball Bag"],
    [/^Túi\s+Thời\s+trang\s+(.+)$/i, "$1 Sport Tote Bag"],
    [/^Túi\s+(.+)$/i, "$1 Bag"],
    [/^Áo\s+Polo\s+Pickleball\s+(.+)$/i, "$1 Pickleball Polo Shirt"],
    [/^Áo\s+Pickleball\s+(.+)$/i, "$1 Pickleball Shirt"],
    [/^Áo\s+Polo\s+(.+)$/i, "$1 Polo Shirt"],
    [/^Áo\s+(.+)$/i, "$1 Shirt"],
    [/^Nón\s+Thể\s+Thao\s+Pickleball\s+(.+)$/i, "$1 Pickleball Cap"],
    [/^Nón\s+Pickleball\s+(.+)$/i, "$1 Pickleball Cap"],
    [/^Nón\s+(.+)$/i, "$1 Cap"],
    [/^Tất\s+Pickleball\s+(.+)$/i, "$1 Pickleball Socks"],
    [/^Tất\s+(.+)$/i, "$1 Socks"],
    [/^Bóng\s+Pickleball\s+(.+)$/i, "$1 Pickleball Balls"],
    [/^Combo\s+Thời\s+trang\s+Thi\s+đấu\s+(.+)$/i, "$1 Match Apparel Combo"],
    [/^Combo\s+Thời\s+trang\s+(.+)$/i, "$1 Sportswear Combo"],
    [/^Bao\s+vợt\s+Pickleball\s+(.+)$/i, "$1 Pickleball Paddle Cover"],
    [/^Bao\s+vợt\s+(.+)$/i, "$1 Paddle Cover"],
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      break;
    }
  }

  return result
    .replace(/\s+Chính\s+Hãng\b/gi, "")
    .replace(/Phối\s+Sọc/gi, "Striped")
    .replace(/\(Áo\s*\+\s*Nón\s*\+\s*Tất\)/gi, "(Polo + Cap + Socks)")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const SPEC_LABEL_MAP_EN: Record<string, string> = {
  "trọng lượng trung bình": "Average Weight",
  "trọng lượng": "Weight",
  "độ dày lõi": "Core Thickness",
  "độ dày": "Thickness",
  "độ dày quấn cán": "Overgrip Thickness",
  "chất liệu bề mặt": "Surface Material",
  "mặt vợt": "Paddle Face",
  "chất liệu": "Material",
  "chiều dài vợt × chiều rộng": "Dimensions (L × W)",
  "chiều dài vợt x chiều rộng": "Dimensions (L × W)",
  "chiều dài vợt": "Paddle Length",
  "chiều rộng vợt": "Paddle Width",
  "chiều dài cán cầm": "Handle Length",
  "chiều dài cán": "Handle Length",
  "chu vi cán": "Grip Circumference",
  "chu vi": "Circumference",
  "chứng nhận thi đấu": "Tournament Approval",
  "chứng nhận": "Certification",
  "xuất xứ": "Origin",
  "xác thực": "Authenticity",
  "công nghệ": "Technology",
  "thành phần": "Includes",
  "đế ngoài": "Outsole",
  "đệm giữa": "Midsole",
  "sức chứa": "Capacity",
  "số lỗ": "Hole Count",
  "bảo hành": "Warranty",
  "thương hiệu": "Brand",
  "màu sắc": "Color",
  "kích thước": "Dimensions",
};

export function localizeSpecLabel(label: string, locale: LocaleCode): string {
  if (locale === "vi") return label;
  return SPEC_LABEL_MAP_EN[normalizeLookupKey(label)] || label;
}

export function localizeSpecValue(value: string, locale: LocaleCode): string {
  if (locale === "vi") return value;
  return value
    .replace(/\(Hỗ trợ Backhand 2 tay\)/gi, "(Two-Handed Backhand Ready)")
    .replace(/\(Có chip NFC\)/gi, "(With NFC Chip)")
    .replace(/Chip NFC chính hãng Kamito/gi, "Authentic Kamito NFC Chip")
    .replace(/Chip NFC chính hãng/gi, "Authentic NFC Chip")
    .replace(/1 Áo \+ 1 Nón \+ 1 Đôi Tất/gi, "1 Polo Shirt + 1 Cap + 1 Pair of Socks")
    .replace(/\(Có khóa chỉnh\)/gi, "(Adjustable Strap)")
    .replace(
      /4 vợt \+ 1 đôi giày \+ quần áo & bóng/gi,
      "4 paddles + 1 pair of shoes + apparel & balls"
    )
    .replace(/40 lỗ khoan chính xác/gi, "40 precision-drilled holes")
    .replace(/Việt Nam/gi, "Vietnam")
    .replace(/Chính hãng/gi, "Authentic");
}

export function localizeProductSpec(
  spec: ProductSpec,
  locale: LocaleCode
): ProductSpec {
  if (locale === "vi") return spec;
  return {
    label: localizeSpecLabel(spec.label, locale),
    value: localizeSpecValue(spec.value, locale),
  };
}

const COLOR_MAP_EN: Record<string, string> = {
  "đỏ": "Red",
  "đỏ đô": "Crimson Red",
  "xanh dương": "Blue",
  "xanh navy": "Navy Blue",
  "xanh biển": "Ocean Blue",
  "xanh lá": "Green",
  "xanh rêu": "Forest Green",
  "xanh ngọc": "Mint Teal",
  "đen": "Black",
  "trắng": "White",
  "trắng kem": "Cream White",
  "vàng": "Yellow",
  "cam": "Orange",
  "tím": "Purple",
  "hồng": "Pink",
  "xám": "Gray",
  "bạc": "Silver",
  "nâu": "Brown",
  "kem": "Cream",
  "be": "Beige",
  "mặc định": "Default",
};

export function localizeColorName(
  color: string | undefined,
  locale: LocaleCode
): string {
  if (!color) return "";
  if (locale === "vi") return color;
  return COLOR_MAP_EN[normalizeLookupKey(color)] || color;
}

const SIZE_MAP_EN: Record<string, string> = {
  "tất cả": "All",
  "tiêu chuẩn": "Standard",
  "mặc định": "Default",
  "tự do": "One Size",
  "freesize": "One Size",
};

export function localizeSizeLabel(
  size: string | undefined,
  locale: LocaleCode
): string {
  if (!size) return "";
  if (locale === "vi") return size;
  return SIZE_MAP_EN[normalizeLookupKey(size)] || size;
}

export function localizeImageAlt(
  alt: string | undefined,
  fallbackName: string,
  locale: LocaleCode
): string {
  if (locale === "vi") return alt || fallbackName;
  if (!alt) return fallbackName;
  return alt
    .replace(/\s*-\s*Góc cạnh/gi, " — Side View")
    .replace(/\s*-\s*Mặt vợt Carbon/gi, " — Carbon Face")
    .replace(/\s*-\s*Chi tiết viền/gi, " — Edge Detail")
    .replace(/\s*-\s*Chi tiết/gi, " — Detail")
    .replace(/\s*-\s*Phối đồ/gi, " — Styled Look")
    .replace(/\s*-\s*Đế Goodyear/gi, " — Goodyear Outsole")
    .replace(/\s*-\s*Ngăn đựng vợt/gi, " — Paddle Compartment")
    .replace(/\s*-\s*Sức chứa vợt/gi, " — Paddle Storage")
    .replace(/\s*-\s*Hộp 12 quả/gi, " — 12-Ball Box")
    .replace(/^Áo Polo 11Sport Phối Sọc(?=\s*—|$)/i, "11Sport Striped Polo Shirt")
    .replace(/^Combo Thời trang 11Sport(?=\s*—|$)/i, "11Sport Apparel Combo")
    .replace(/^Nón Pickleball 11Sport(?=\s*—|$)/i, "11Sport Pickleball Cap")
    .replace(/^Asics Court FF 4 Nam(?=\s*—|$)/i, "Asics Court FF 4 Men's")
    .replace(/^Balo Joola Vision II(?=\s*—|$)/i, "Joola Vision II Backpack")
    .replace(/^Túi Selkirk Team Tour(?=\s*—|$)/i, "Selkirk Team Tour Bag")
    .replace(/^Bóng Franklin X-40(?=\s*—|$)/i, "Franklin X-40 Pickleball Balls")
    .replace(/^Quấn cán và dán viền vợt(?=\s*—|$)/i, "Pickleball Overgrip & Edge Tape")
    .replace(/^Bộ 3 cuộn quấn cán 11Sport(?=\s*—|$)/i, "11Sport 3-Pack Overgrip");
}

export function localizeBulkTierLabel(
  labelOrRule:
    | string
    | (Pick<TierPricingRule, "minQty" | "label"> & { unitPrice?: number }),
  locale: LocaleCode
): string {
  const rawLabel =
    typeof labelOrRule === "string"
      ? labelOrRule
      : labelOrRule.label ||
        (locale === "en"
          ? `Buy ${labelOrRule.minQty}+ of the same variant`
          : `Mua từ ${labelOrRule.minQty} sản phẩm cùng biến thể`);

  if (locale === "vi") return rawLabel;

  const trimmed = rawLabel.trim();
  const fullMatch = trimmed.match(
    /^Mua\s+từ\s+(\d+)\s+(?:sản\s+phẩm|SP)(?:\s+cùng\s+biến\s+thể)?\s*(?:→|->)\s*(.+?)(?:\s*\/\s*sp)?$/i
  );
  if (fullMatch) {
    return `Buy ${fullMatch[1]}+ of the same variant → ${fullMatch[2]!.trim()} / unit`;
  }

  const shortMatch = trimmed.match(
    /^Mua\s+từ\s+(\d+)\s+(?:sản\s+phẩm|SP)(?:\s+cùng\s+biến\s+thể)?$/i
  );
  if (shortMatch) {
    return `Buy ${shortMatch[1]}+ of the same variant`;
  }

  return trimmed
    .replace(/Mua\s+từ\s+(\d+)\s+sản\s+phẩm\s+cùng\s+biến\s+thể/gi, "Buy $1+ of the same variant")
    .replace(/Mua\s+từ\s+(\d+)\s+sản\s+phẩm/gi, "Buy $1+ items")
    .replace(/\/\s*sp\b/gi, "/ unit");
}

export function localizeGiftProductName(
  name: string | undefined,
  locale: LocaleCode
): string {
  if (!name) return "";
  if (locale === "vi") return name;

  const norm = normalizeLookupKey(name);
  if (norm === "áo polo 11sport dry-fit") return "11Sport Dry-Fit Polo Shirt";
  if (norm === "2 áo polo + 1 túi 11sport tour") {
    return "2 Polo Shirts + 1 11Sport Tour Bag";
  }
  if (norm === "quấn cán 11sport") return "11Sport Overgrip";
  if (norm === "quà tặng 11sport") return "11Sport Free Gift";
  if (norm === "1 áo") return "1 Free Shirt";
  if (norm === "2 áo + 1 túi") return "2 Free Shirts + 1 Tour Bag";

  return name
    .replace(/(\d+)\s*Áo\s+Polo/gi, "$1 Polo Shirts")
    .replace(/Áo\s+Polo/gi, "Polo Shirt")
    .replace(/Túi\s+11Sport\s+Tour/gi, "11Sport Tour Bag")
    .replace(/(\d+)\s*áo\s*\+\s*(\d+)\s*túi/gi, "$1 Shirts + $2 Bag")
    .replace(/(\d+)\s*áo\b/gi, "$1 Shirt")
    .replace(/Quấn\s+cán/gi, "Overgrip")
    .replace(/Dán\s+viền/gi, "Edge Tape")
    .replace(/Bao\s+vợt/gi, "Paddle Cover")
    .replace(/Quà\s+tặng/gi, "Free Gift");
}

export function localizeGiftTitle(rawTitle: string, locale: LocaleCode): string {
  if (locale === "vi" || !rawTitle) return rawTitle;

  const trimmed = rawTitle.trim();
  const exactMap: Record<string, string> = {
    "mua 5 sản phẩm → 1 áo": "Buy 5+ items → 1 Free Shirt",
    "mua 10 sản phẩm → 2 áo + 1 túi": "Buy 10+ items → 2 Free Shirts + 1 Bag",
    "mua 5 sản phẩm → tặng 1 áo 11sport dry-fit":
      "Buy 5+ items → Free 11Sport Dry-Fit Shirt",
    "mua 10 sản phẩm → tặng 2 áo + 1 túi 11sport tour":
      "Buy 10+ items → Free 2 Shirts + 1 11Sport Tour Bag",
  };
  const exact = exactMap[normalizeLookupKey(trimmed)];
  if (exact) return exact;

  const arrowMatch = trimmed.match(
    /^Mua\s+(\d+)\s*(?:sản\s+phẩm|SP)\s*(?:→|->)\s*(?:Tặng\s+)?(.+)$/i
  );
  if (arrowMatch) {
    return `Buy ${arrowMatch[1]}+ items → Free ${localizeGiftProductName(
      arrowMatch[2]!.trim(),
      locale
    )}`;
  }

  const buyGiveMatch = trimmed.match(/^Mua\s+(\d+)\s+tặng\s+(.+)$/i);
  if (buyGiveMatch) {
    return `Buy ${buyGiveMatch[1]}+ items → Free ${localizeGiftProductName(
      buyGiveMatch[2]!.trim(),
      locale
    )}`;
  }

  return localizeGiftProductName(trimmed, locale);
}

export function localizeGiftDescription(
  description: string | undefined,
  locale: LocaleCode
): string | undefined {
  if (!description || locale === "vi") return description;

  const norm = normalizeLookupKey(description);
  if (
    norm === "tặng 01 áo polo 11sport dry-fit chính hãng trị giá 350.000₫"
  ) {
    return "Free authentic 11Sport Dry-Fit Polo Shirt (worth 350.000₫)";
  }
  if (
    norm === "tặng 02 áo polo + 01 túi 11sport tour trị giá 1.150.000₫"
  ) {
    return "Free 2 Polo Shirts + 1 11Sport Tour Bag (worth 1.150.000₫)";
  }

  return description
    .replace(/^Tặng\s+0?(\d+)\s+/i, "Free $1 ")
    .replace(/trị\s+giá/gi, "worth")
    .replace(/chính\s+hãng/gi, "authentic")
    .replace(/Áo\s+Polo/gi, "Polo Shirt")
    .replace(/túi\s+11Sport\s+Tour/gi, "11Sport Tour Bag");
}

export function localizeGiftPromotion<T extends GiftPromotion>(
  promo: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return promo;
  return {
    ...promo,
    ...(promo.title ? { title: localizeGiftTitle(promo.title, locale) } : {}),
    ...(promo.name ? { name: localizeGiftTitle(promo.name, locale) } : {}),
    ...(promo.description
      ? { description: localizeGiftDescription(promo.description, locale) }
      : {}),
    ...(promo.giftProductName
      ? {
          giftProductName: localizeGiftProductName(
            promo.giftProductName,
            locale
          ),
        }
      : {}),
    ...(promo.gifts
      ? {
          gifts: promo.gifts.map((g) => ({
            ...g,
            productName: localizeGiftProductName(g.productName, locale),
          })),
        }
      : {}),
  };
}

export function localizeProductBadge(badge: string, locale: LocaleCode): string {
  if (locale === "vi") return badge;
  const map: Record<string, string> = {
    "mới": "New",
    "tặng áo": "FREE SHIRT",
    "tạm hết hàng": "Out of stock",
    "hết hàng": "Out of stock",
    "còn hàng": "In stock",
    "bán chạy": "Best Seller",
    "chính hãng": "Authentic",
    "nổi bật": "Featured",
  };
  return map[normalizeLookupKey(badge)] || badge;
}

export function localizeProductSummary<T extends ProductListItem>(
  product: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return product;

  const localizedName = localizeProductName(product.name, locale, product.slug);

  return {
    ...product,
    name: localizedName,
    ...(product.category
      ? {
          category: {
            ...product.category,
            name: localizeCategoryName(
              product.category.name,
              locale,
              product.category.slug
            ),
          },
        }
      : {}),
    ...(product.images
      ? {
          images: product.images.map((img) => ({
            ...img,
            alt: localizeImageAlt(img.alt, localizedName, locale),
          })),
        }
      : {}),
    ...(product.colors
      ? {
          colors: product.colors.map((c) => ({
            ...c,
            color: localizeColorName(c.color, locale),
          })),
        }
      : {}),
  };
}

export function localizeProductDetail<T extends ProductDetail>(
  product: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return product;

  const base = localizeProductSummary(product, locale);
  const translated = PRODUCT_TRANSLATIONS_BY_SLUG_EN[product.slug];

  return {
    ...base,
    shortDescription: translated?.shortDescription || product.shortDescription,
    descriptionHtml: translated?.descriptionHtml || product.descriptionHtml,
    ...(product.specs
      ? {
          specs: product.specs.map((spec) => localizeProductSpec(spec, locale)),
        }
      : {}),
    variants: (product.variants ?? []).map((variant) => ({
      ...variant,
      ...(variant.color
        ? { color: localizeColorName(variant.color, locale) }
        : {}),
      ...(variant.size
        ? { size: localizeSizeLabel(variant.size, locale) }
        : {}),
    })),
    ...(product.promotions
      ? {
          promotions: {
            ...(product.promotions.tierPricing
              ? {
                  tierPricing: product.promotions.tierPricing.map((tier) => ({
                    ...tier,
                    label: localizeBulkTierLabel(tier, locale),
                  })),
                }
              : {}),
            ...(product.promotions.giftPromotions
              ? {
                  giftPromotions: product.promotions.giftPromotions.map((gift) =>
                    localizeGiftPromotion(gift, locale)
                  ),
                }
              : {}),
          },
        }
      : {}),
    ...(product.seo
      ? {
          seo: {
            ...product.seo,
            title: base.name,
            description:
              translated?.shortDescription || product.seo.description,
          },
        }
      : {}),
  };
}

const REVIEW_TRANSLATIONS_BY_ID_EN: Record<
  string,
  { customerName: string; comment: string }
> = {
  "rev-1": {
    customerName: "Hoang Bach (District 10)",
    comment:
      "100% authentic paddle—the NFC tag scanned straight to the manufacturer's site. Ordered 3 with club teammates for the bulk discount and received the full free overgrip, edge tape, and paddle cover kit.",
  },
  "rev-2": {
    customerName: "Thanh Tam (Phu Nhuan)",
    comment:
      "The 16mm core feels remarkably plush with pinpoint control at the Kitchen line. The showroom staff were knowledgeable and super helpful.",
  },
};

export function localizeReviewItem<T extends ReviewItem>(
  review: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return review;
  const matched = REVIEW_TRANSLATIONS_BY_ID_EN[review._id];
  if (matched) {
    return {
      ...review,
      customerName: matched.customerName,
      comment: matched.comment,
    };
  }
  return review;
}

export function localizeReviewList(
  reviews: ReviewListResponse | null | undefined,
  locale: LocaleCode
): ReviewListResponse | null {
  if (!reviews) return null;
  if (locale === "vi") return reviews;
  return {
    ...reviews,
    data: reviews.data.map((item) => localizeReviewItem(item, locale)),
  };
}

/* -------------------------------------------------------------------------- */
/* 4. Articles (Summary & Full Detail)                                        */
/* -------------------------------------------------------------------------- */

interface ArticleTranslationEntry {
  title: string;
  excerpt: string;
  authorName: string;
  categoryName: string;
  contentHtml: string;
}

const ARTICLE_TRANSLATIONS_BY_SLUG_EN: Record<string, ArticleTranslationEntry> =
  {
    "luat-choi-pickleball": {
      title: "Official USAPA Pickleball Rules & Scoring Guide for Beginners",
      excerpt:
        "A complete guide to the underhand cross-court serve, the Two-Bounce Rule, the Non-Volley Zone (Kitchen), and calling doubles scores.",
      authorName: "11Sport Technical Team",
      categoryName: "Pickleball Techniques",
      contentHtml: `
      <h2>1. Underhand Cross-Court Serve Rule</h2>
      <p>In pickleball, every serve must be struck underhand with paddle contact below waist level, sending the ball diagonally into the opposite service box (clearing the Non-Volley Zone line).</p>
      <h2>2. The Two-Bounce Rule</h2>
      <p>After the serve, the receiving team must let the ball bounce once before returning it. The serving team must then also let the return bounce once before either side can begin volleying out of the air.</p>
      <h2>3. The Non-Volley Zone (7-Foot / 2.13m Kitchen)</h2>
      <p>Players may not stand inside the Kitchen—or step on the Kitchen line—while hitting a volley in the air, and momentum after a volley cannot carry a player into the Non-Volley Zone.</p>
      <h2>4. How to Call the Three-Number Doubles Score</h2>
      <p>Doubles scores are always called using three numbers: <strong>Serving Team Score – Receiving Team Score – Server Number (1 or 2)</strong>. For example: <code>4 - 2 - 1</code>. Standard games are played to 11 points, win by 2.</p>
    `,
    },
    "vot-pickleball-cho-nguoi-moi": {
      title:
        "Beginner's Guide to Choosing a Pickleball Paddle: 14mm or 16mm?",
      excerpt:
        "Breaking down 14mm (Power) vs. 16mm (Control) core thickness, ideal paddle weight, handle length, and the 5 most forgiving paddles of 2026.",
      authorName: "11Sport Technical Team",
      categoryName: "Gear Buying Guides",
      contentHtml: `
      <h2>1. Core Thickness: 16mm (Control) vs. 14mm (Power)</h2>
      <p>Players transitioning from badminton or tennis should start with a <strong>16mm core</strong> for superior dwell time and shock absorption, making soft dinks and consistent third-shot drops into the Kitchen far easier to master.</p>
      <h2>2. Choosing Ideal Weight &amp; Handle Length</h2>
      <p>A midweight paddle between <strong>7.8 oz – 8.1 oz (220g – 230g)</strong> keeps your hands fast at the net without causing wrist fatigue. If you hit a two-handed backhand, choose an elongated <strong>5.5-inch</strong> handle.</p>
    `,
    },
    "review-vot-pickleball-selkirk-boomstik-st": {
      title:
        "On-Court Review: Selkirk Labs Boomstik ST vs. Joola Perseus Power FX",
      excerpt:
        "Head-to-head court playtest comparing two flagship pro paddles on hand speed, raw carbon spin RPM, and defensive stability.",
      authorName: "Coach Minh Quan",
      categoryName: "Paddle Reviews",
      contentHtml: `
      <h2>1. Ball Feel &amp; Swing Speed</h2>
      <p>The Selkirk Boomstik ST stands out with its open Air Dynamic Throat for razor-sharp volley reflexes at the net, whereas the Joola Perseus Power FX delivers a solid, planted impact feel and explosive baseline pop.</p>
      <h2>2. Which Paddle Matches Your Play Style?</h2>
      <p>Pick the Selkirk Boomstik if you thrive in rapid-fire net exchanges and want lasting face durability. Choose the Joola Perseus Power FX 16mm if your game is built around heavy topspin drives and powerful two-handed backhands.</p>
    `,
    },
    "cach-chon-vot-pickleball-joola": {
      title:
        "Test Pro Pickleball Paddles at All 3 11Sport Showrooms in HCMC & Hanoi",
      excerpt:
        "Visit our District 10, Phu Nhuan, and Ngoc Ha (Hanoi) showrooms to demo Joola, Selkirk, and Kamito paddles with in-store swing-weight checks.",
      authorName: "11Sport Editorial Team",
      categoryName: "News & Community",
      contentHtml: `
      <h2>1. Hands-On Paddle Demos &amp; Instant NFC Verification</h2>
      <p>Visitors at all three 11Sport showrooms can test 14mm and 16mm demo paddles side by side, scan official NFC authenticity chips at the counter, and receive personalized grip-size fitting from our specialists.</p>
    `,
    },
  };

export function localizeAuthorName(
  authorName: string | undefined,
  locale: LocaleCode
): string {
  if (!authorName) {
    return locale === "en" ? "11Sport Editorial Team" : "Ban Chuyên Môn 11Sport";
  }
  if (locale === "vi") return authorName;

  const map: Record<string, string> = {
    "ban chuyên môn 11sport": "11Sport Technical Team",
    "ban biên tập 11sport": "11Sport Editorial Team",
    "hlv minh quân": "Coach Minh Quan",
  };
  return map[normalizeLookupKey(authorName)] || authorName;
}

export function localizeArticleSummary<T extends ArticleSummary>(
  article: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return article;
  const matched = ARTICLE_TRANSLATIONS_BY_SLUG_EN[article.slug];

  return {
    ...article,
    title: matched?.title || article.title,
    excerpt: matched?.excerpt || article.excerpt,
    ...(article.category
      ? {
          category: {
            ...article.category,
            name:
              matched?.categoryName ||
              localizeArticleCategoryName(
                article.category.name,
                locale,
                article.category.slug
              ),
          },
        }
      : {}),
  };
}

export function localizeArticleDetail<T extends ArticleDetail>(
  article: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return article;
  const base = localizeArticleSummary(article, locale);
  const matched = ARTICLE_TRANSLATIONS_BY_SLUG_EN[article.slug];

  return {
    ...base,
    authorName:
      matched?.authorName || localizeAuthorName(article.authorName, locale),
    contentHtml: matched?.contentHtml || article.contentHtml,
    ...(article.relatedProducts
      ? {
          relatedProducts: article.relatedProducts.map((p) =>
            localizeProductSummary(p, locale)
          ),
        }
      : {}),
    ...(article.seo
      ? {
          seo: {
            ...article.seo,
            title: base.title,
            description: base.excerpt || article.seo.description,
          },
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* 5. Policy, Program & Static Pages                                          */
/* -------------------------------------------------------------------------- */

const POLICY_PAGES_EN: Record<
  string,
  Pick<PolicyPageLike, "title" | "summary" | "sections" | "callout">
> = {
  "chinh-sach-van-chuyen": {
    title: "Shipping & Delivery Policy",
    summary:
      "Free nationwide shipping across Vietnam, 2-hour express delivery in Ho Chi Minh City & Hanoi, and open-box inspection before payment.",
    sections: [
      {
        heading: "1. In-Store Pickup & Purchase at Our 3 Showrooms",
        paragraphs: [
          "Customers visiting our District 10, Phu Nhuan (Ho Chi Minh City), and Ngoc Ha (Hanoi) showrooms can scan official NFC/QR authenticity tags, weigh individual paddles on precision scales, and collect the full complimentary accessory kit (overgrip, edge tape, and paddle cover) at the counter.",
        ],
      },
      {
        heading: "2. Online Website Orders",
        paragraphs: [
          "Every order qualifies for free nationwide shipping. Enjoy 2–4 hour express courier delivery within inner Ho Chi Minh City & Hanoi, and 1–3 business day express delivery to all other provinces nationwide.",
        ],
      },
      {
        heading: "3. Club & Wholesale Orders (Bulk Tier Pricing)",
        paragraphs: [
          "Ordering 3+ or 5+ units of the same product variant automatically applies Bulk Tier Pricing at checkout and unlocks free gifts at 5+ total items (1 free polo shirt) or 10+ total items (2 free polo shirts + 1 tour bag).",
        ],
      },
    ],
    callout:
      "Every parcel supports open-box visual inspection and NFC authenticity scanning before completing Cash on Delivery (COD) payment.",
  },
  "hoan-tien_tra-ve": {
    title: "Warranty, Replacement & Refund Policy",
    summary:
      "Guaranteed 1-to-1 brand-new replacement for verified manufacturing defects under official brand warranty standards.",
    sections: [
      {
        heading: "1. Eligible Replacement & Return Cases",
        paragraphs: [
          "Items with verified manufacturing defects (crushed honeycomb/EPP core, abnormal carbon face delamination, or faulty NFC chip) or orders delivered with the wrong model or core thickness.",
        ],
      },
      {
        heading: "2. Fast 24-Hour Replacement Process",
        paragraphs: [
          "Send photos or a short video via our branch Zalo channel or bring the item directly to any showroom. Our technicians verify the claim and provide a 100% brand-new replacement with free two-way shipping.",
        ],
      },
    ],
    callout:
      "200% money-back guarantee if any product purchased from 11Sport is ever found to be non-authentic.",
  },
  "chinh-sach-bao-mat": {
    title: "Customer Privacy Policy",
    summary:
      "Strict protection for your personal details, phone number, shipping address, and electronic warranty records.",
    sections: [
      {
        heading: "1. Purpose of Information Collection",
        paragraphs: [
          "Your full name, phone number, email address, and shipping address are used solely for order fulfillment, official e-warranty activation, and product consultation.",
        ],
      },
      {
        heading: "2. Zero Third-Party Data Sharing Commitment",
        paragraphs: [
          "11Sport never sells or discloses customer information to third parties, except to authorized delivery couriers strictly for fulfilling your shipment.",
        ],
      },
    ],
    callout:
      "You can update or request deletion of your personal data at any time from the My Account page.",
  },
  "quy-dinh-su-dung": {
    title: "Terms of Use",
    summary:
      "Guidelines covering retail pricing, per-variant bulk discounts, cart gift thresholds, and member benefits.",
    sections: [
      {
        heading: "1. Bulk Tier Pricing & Free Gift Rules",
        paragraphs: [
          "Bulk Tier Pricing (3+ or 5+ units) applies per identical product variant (same model, color, and core thickness). Cart Free Gifts (5+ or 10+ total items) are calculated across your entire cart and award the highest unlocked tier (non-stacking).",
        ],
      },
    ],
    callout:
      "All bulk discounts and unlocked free gifts are calculated automatically and displayed transparently in your Cart and at Checkout.",
  },
};

const PROGRAM_PAGES_EN: Record<
  string,
  Pick<ProgramPageLike, "title" | "subtitle" | "cards" | "callout">
> = {
  "ve-chung-toi": {
    title: "ABOUT US · AUTHORIZED PICKLEBALL SPECIALIST",
    subtitle:
      "Company profile, Vision – Mission – Goals, and our four core pillars delivering tournament-grade pickleball equipment across Ho Chi Minh City & Hanoi.",
    cards: [
      {
        badge: "VISION",
        title: "Vietnam's Premier Pickleball Retail & Advisory Network",
        description:
          "Building a professional pickleball equipment ecosystem anchored by 3 flagship showrooms in District 10, Phu Nhuan, and Hanoi.",
      },
      {
        badge: "MISSION",
        title: "100% Authorized Authentic Equipment",
        description:
          "Direct distribution from 20+ leading international and Vietnamese brands: Joola, Selkirk, Kamito, Facolos, CRBN, Asics, and Skechers.",
      },
      {
        badge: "GOAL",
        title: "1-to-1 Replacement & Long-Term Club Partnerships",
        description:
          "Delivering transparent bulk tier pricing, practical complimentary gifts, and rapid 1-to-1 after-sales warranty support.",
      },
    ],
    callout:
      "Visit any of our 3 showrooms to get hands-on experience with 200+ authentic pickleball paddles, court shoes, and accessories.",
  },
  "thu-cu-doi-moi": {
    title: "PADDLE TRADE-IN · UPGRADE TO YOUR NEXT PRO PADDLE",
    subtitle:
      "Trade in your pre-owned authentic pickleball paddle for instant credit toward the latest Joola Gen 3S, Selkirk Labs Boomstik, or CRBN releases.",
    cards: [
      {
        badge: "STEP 1",
        title: "Transparent 15-Minute Inspection & Valuation",
        description:
          "Bring your paddle to any of our 3 showrooms or send photos/video via Zalo. Technicians inspect the carbon surface, edge guard, and core for the best trade-in value.",
      },
      {
        badge: "STEP 2",
        title: "Demo & Compare Your New Paddle In-Store",
        description:
          "Test 14mm (Power) and 16mm (Control) cores side by side to match your swing mechanics and on-court strategy.",
      },
      {
        badge: "STEP 3",
        title: "Pay the Difference & Receive Full Complimentary Gifts",
        description:
          "Apply your trade-in credit directly toward your new paddle while still receiving a free overgrip, edge tape, paddle cover, and full official warranty.",
      },
    ],
    callout:
      "Applies to all authentic pickleball paddles (with verifiable NFC/serial numbers) free of structural core crushing or handle breaks.",
  },
};

export function localizePolicyPage<T extends PolicyPageLike>(
  policy: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return policy;
  const matched = POLICY_PAGES_EN[policy.slug];
  if (!matched) return policy;
  return {
    ...policy,
    title: matched.title,
    summary: matched.summary,
    sections: matched.sections,
    callout: matched.callout,
  };
}

export function localizeProgramPage<T extends ProgramPageLike>(
  program: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return program;
  const matched = PROGRAM_PAGES_EN[program.slug];
  if (!matched) return program;
  return {
    ...program,
    title: matched.title,
    subtitle: matched.subtitle,
    cards: matched.cards,
    callout: matched.callout,
  };
}

export function localizeStaticPage<T extends StaticPageDetail>(
  page: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return page;
  const pol = POLICY_PAGES_EN[page.slug];
  if (pol) {
    const html = pol.sections
      .map(
        (s) =>
          `<h2>${s.heading}</h2>${s.paragraphs.map((p) => `<p>${p}</p>`).join("")}`
      )
      .join("");
    return {
      ...page,
      title: pol.title,
      contentHtml: html,
      seo: {
        ...page.seo,
        title: pol.title,
        description: pol.summary,
      },
    };
  }
  const prog = PROGRAM_PAGES_EN[page.slug];
  if (prog) {
    const html = prog.cards
      .map((c) => `<h2>${c.badge} · ${c.title}</h2><p>${c.description}</p>`)
      .join("");
    return {
      ...page,
      title: prog.title,
      contentHtml: html,
      seo: {
        ...page.seo,
        title: prog.title,
        description: prog.subtitle,
      },
    };
  }
  return page;
}

/* -------------------------------------------------------------------------- */
/* 6. Order, Payment, Fulfillment Statuses & Gateways                         */
/* -------------------------------------------------------------------------- */

const ORDER_STATUS_MAP: Record<string, { vi: string; en: string }> = {
  PENDING: { vi: "Chờ xác nhận", en: "Pending" },
  CONFIRMED: { vi: "Đã xác nhận", en: "Confirmed" },
  PROCESSING: { vi: "Đang chuẩn bị hàng", en: "Processing" },
  PACKING: { vi: "Đang đóng gói", en: "Packing" },
  SHIPPING: { vi: "Đang giao hàng", en: "In Transit" },
  SHIPPED: { vi: "Đang giao hàng", en: "Shipped" },
  DELIVERED: { vi: "Đã giao hàng", en: "Delivered" },
  COMPLETED: { vi: "Hoàn thành", en: "Completed" },
  CANCELLED: { vi: "Đã hủy", en: "Cancelled" },
  CANCELED: { vi: "Đã hủy", en: "Cancelled" },
  RETURNED: { vi: "Đã hoàn trả", en: "Returned" },
  REFUNDED: { vi: "Đã hoàn tiền", en: "Refunded" },
};

const PAYMENT_STATUS_MAP: Record<string, { vi: string; en: string }> = {
  PAID: { vi: "Đã thanh toán", en: "Paid" },
  UNPAID: { vi: "Chưa thanh toán", en: "Unpaid" },
  PENDING: { vi: "Chờ thanh toán", en: "Pending Payment" },
  EXPIRED: { vi: "Hết hạn", en: "Expired" },
  FAILED: { vi: "Thanh toán thất bại", en: "Payment Failed" },
  CANCELLED: { vi: "Đã hủy", en: "Cancelled" },
  CANCELED: { vi: "Đã hủy", en: "Cancelled" },
  REFUNDED: { vi: "Đã hoàn tiền", en: "Refunded" },
};

const PAYMENT_GATEWAY_MAP: Record<string, { vi: string; en: string }> = {
  COD: {
    vi: "Thanh toán khi nhận hàng (COD)",
    en: "Cash on Delivery (COD)",
  },
  PAYOS: {
    vi: "Chuyển khoản VietQR / PayOS",
    en: "VietQR / PayOS Bank Transfer",
  },
  VIETQR: {
    vi: "Chuyển khoản VietQR",
    en: "VietQR Bank Transfer",
  },
  BANK_TRANSFER: {
    vi: "Chuyển khoản ngân hàng",
    en: "Bank Transfer",
  },
};

export function localizeOrderStatus(
  status: string | null | undefined,
  locale: LocaleCode
): string {
  const key = String(status || "")
    .trim()
    .toUpperCase();
  if (!key) return "";
  return ORDER_STATUS_MAP[key]?.[locale] || String(status);
}

export function localizePaymentStatus(
  status: string | null | undefined,
  locale: LocaleCode
): string {
  const key = String(status || "")
    .trim()
    .toUpperCase();
  if (!key) return "";
  return PAYMENT_STATUS_MAP[key]?.[locale] || String(status);
}

export function localizePaymentGateway(
  gateway: string | null | undefined,
  locale: LocaleCode
): string {
  const key = String(gateway || "")
    .trim()
    .toUpperCase();
  if (!key) return "";
  return PAYMENT_GATEWAY_MAP[key]?.[locale] || String(gateway);
}

/* -------------------------------------------------------------------------- */
/* 7. Common Backend / Mock API Messages & Coupons                            */
/* -------------------------------------------------------------------------- */

export function localizeCouponName(
  name: string | null | undefined,
  locale: LocaleCode
): string {
  if (!name) return "";
  if (locale === "vi") return name;

  const exact: Record<string, string> = {
    "giảm 100.000₫ đơn hàng": "100,000₫ off your order",
    "ưu đãi pikpro 100.000₫": "PikPro 100,000₫ Discount",
    "ưu đãi vip 200.000₫": "VIP 200,000₫ Discount",
  };
  const found = exact[normalizeLookupKey(name)];
  if (found) return found;

  return name
    .replace(/^Giảm\s+(.+?)\s+đơn\s+hàng$/i, "$1 off your order")
    .replace(/^Ưu\s+đãi\s+/i, "Promo: ");
}

export function localizeApiMessage(
  msg: string | null | undefined,
  locale: LocaleCode
): string {
  const raw = String(msg || "").trim();
  if (!raw || locale === "vi") return raw;

  const exactMap: Record<string, string> = {
    "không tìm thấy danh mục sản phẩm.": "Product category not found.",
    "không tìm thấy thương hiệu.": "Brand not found.",
    "không tìm thấy sản phẩm.": "Product not found.",
    "không tìm thấy bài viết.": "Article not found.",
    "không tìm thấy trang tĩnh.": "Page not found.",
    "đánh giá của bạn đã được ghi nhận và đang chờ duyệt.":
      "Your review has been submitted and is pending moderation.",
    "cảm ơn bạn đã liên hệ. đội ngũ hlv & kỹ thuật viên 11sport sẽ phản hồi trong thời gian sớm nhất.":
      "Thank you for reaching out. Our 11Sport coaches and specialists will reply shortly.",
    "không tìm thấy đơn hàng khớp với mã đơn và số điện thoại.":
      "No order found matching that order code and phone number.",
    "mã otp 6 số đã được gửi tới email của bạn (demo otp: 123456).":
      "A 6-digit OTP code has been sent to your email (Demo OTP: 123456).",
    "mã otp không chính xác hoặc đã hết hạn. vui lòng thử lại.":
      "The OTP code is invalid or has expired. Please try again.",
    "chưa có sản phẩm nào trong giỏ hàng.": "Your cart is currently empty.",
    "giỏ hàng trống.": "Your cart is empty.",
    "sản phẩm đã hết hàng.": "This item is currently out of stock.",
    "không đủ tồn kho.": "Requested quantity exceeds available stock.",
    "phiên đăng nhập đã hết hạn.": "Your session has expired. Please sign in again.",
    "số điện thoại không hợp lệ.":
      "Please enter a valid Vietnamese phone number (10–11 digits starting with 0).",
    "email hoặc số điện thoại không hợp lệ.":
      "Please enter a valid email address or phone number.",
    "không thể tạo link thanh toán payos.":
      "Unable to create a PayOS payment link. Please try again or choose Cash on Delivery.",
    "không thể tạo link thanh toán payos":
      "Unable to create a PayOS payment link. Please try again or choose Cash on Delivery.",
    "lỗi máy chủ khi tạo link payos":
      "Server error while creating the PayOS payment link. Please try again or choose Cash on Delivery.",
  };

  const lower = normalizeLookupKey(raw);
  if (exactMap[lower]) return exactMap[lower]!;

  // Dynamic patterns
  const couponInvalid = raw.match(
    /^Mã\s+ưu\s+đãi\s+"([^"]+)"\s+không\s+hợp\s+lệ\s+hoặc\s+đã\s+hết\s+hạn\.?$/i
  );
  if (couponInvalid) {
    return `Promo code "${couponInvalid[1]}" is invalid or has expired.`;
  }

  const reqFailed = raw.match(/^Yêu\s+cầu\s+thất\s+bại\s*\((\d+)\)\.?$/i);
  if (reqFailed) {
    return `Request failed (${reqFailed[1]}). Please try again.`;
  }

  const otpSentWithCode = raw.match(
    /^Mã\s+OTP\s+6\s+số\s+đã\s+được\s+gửi.*?\(Demo\s+OTP:\s*(\d+)\)\.?$/i
  );
  if (otpSentWithCode) {
    return `A 6-digit OTP code has been sent (Demo OTP: ${otpSentWithCode[1]}).`;
  }

  if (/^Mã\s+OTP\s+6\s+số\s+đã\s+được\s+gửi/i.test(raw)) {
    return "A 6-digit OTP code has been sent. Please check your email or SMS.";
  }

  if (/^Mã\s+OTP\s+không\s+chính\s+xác/i.test(raw)) {
    return "The OTP code is invalid or has expired. Please try again.";
  }

  const unmocked = raw.match(/^Mock\s+API\s+endpoint\s+chưa\s+được\s+định\s+nghĩa:\s*(.+)$/i);
  if (unmocked) {
    return `API endpoint is not available: ${unmocked[1]}`;
  }

  if (/payos/i.test(raw) && /(không thể|thất bại|lỗi)/i.test(raw)) {
    return "Unable to connect to PayOS right now. Please try again or choose Cash on Delivery.";
  }

  if (/tồn kho|hết hàng/i.test(raw)) {
    return "Some items are out of stock or exceed available inventory.";
  }

  return raw;
}
