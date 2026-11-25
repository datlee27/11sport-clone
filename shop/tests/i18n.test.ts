import { describe, expect, it } from "vitest";
import {
  STORE_I18N,
  delocalizePath,
  formatDateByLocale,
  getLocaleFromPath,
  localizeApiMessage,
  localizeArticleDetail,
  localizeArticleSummary,
  localizeBanner,
  localizeBrandDescription,
  localizeBrandSummary,
  localizeBulkTierLabel,
  localizeCategoryDescription,
  localizeCategoryName,
  localizeCategorySummary,
  localizeCouponName,
  localizeGiftTitle,
  localizeHomeSectionTitle,
  localizeHref,
  localizeOrderStatus,
  localizePaymentGateway,
  localizePaymentStatus,
  localizePolicyPage,
  localizeProductDetail,
  localizeProductSummary,
  localizeProgramPage,
  localizeReviewList,
  localizeShowroom,
  localizeStaticPage,
  localizeTopBarText,
  localizeUspItem,
  switchLocalePath,
} from "@/lib/i18n";
import {
  fetchArticleDetail,
  fetchArticles,
  fetchHomeData,
  fetchProductDetail,
  fetchProductReviews,
  fetchProducts,
  fetchSiteSettings,
  getAllBrandsList,
  getAllCategoriesList,
  getAllPolicyPages,
  getAllProgramPages,
} from "@/lib/storefront";

const VI_DIACRITIC_RE =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

const ALLOWED_VI_PROPER_NAMES = [
  "TP. Hồ Chí Minh",
  "Hồ Chí Minh",
  "Hà Nội",
  "Phú Nhuận",
  "Quận 10",
  "Nguyễn Tri Phương",
  "Ngọc Hà",
  "Hoàng Văn Thụ",
  "Bình Thạnh",
  "Tân Bình",
  "Đà Nẵng",
  "Việt Nam",
];

function stripHtmlAndAllowedProperNames(raw: string): string {
  let text = raw.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
  for (const name of ALLOWED_VI_PROPER_NAMES) {
    text = text.replaceAll(name, " ");
  }
  return text.replace(/\s+/g, " ").trim();
}

function findVietnameseLeak(label: string, value: string | undefined | null): string | null {
  if (!value) return null;
  const cleaned = stripHtmlAndAllowedProperNames(value);
  if (VI_DIACRITIC_RE.test(cleaned)) {
    return `${label}: "${cleaned}"`;
  }
  return null;
}

describe("i18n Routing Helpers (getLocaleFromPath, localizeHref, delocalizePath, switchLocalePath)", () => {
  it("detects locale accurately from pathnames including query strings and hashes", () => {
    expect(getLocaleFromPath("/")).toBe("vi");
    expect(getLocaleFromPath("/cua-hang?brand=joola")).toBe("vi");
    expect(getLocaleFromPath("/english-news")).toBe("vi");
    expect(getLocaleFromPath("/en")).toBe("en");
    expect(getLocaleFromPath("/en/")).toBe("en");
    expect(getLocaleFromPath("/en/shop?page=2#top")).toBe("en");
    expect(getLocaleFromPath("/en/joola-perseus-power-fx")).toBe("en");
  });

  it("localizes canonical Vietnamese routes to English equivalents while preserving query strings and hashes", () => {
    const cases: Array<[string, string]> = [
      ["/", "/en"],
      ["/lien-he", "/en/contact"],
      ["/lien-he?branch=hanoi#map", "/en/contact?branch=hanoi#map"],
      ["/gio-hang", "/en/cart"],
      ["/thanh-toan", "/en/checkout"],
      ["/thanh-toan?cancelled=1", "/en/checkout?cancelled=1"],
      ["/checkout", "/en/checkout"],
      ["/order-success?order=ONL-1", "/en/order-success?order=ONL-1"],
      ["/cua-hang", "/en/shop"],
      ["/cua-hang?brand=joola&page=2#results", "/en/shop?brand=joola&page=2#results"],
      ["/tim-kiem?q=joola", "/en/search?q=joola"],
      ["/tai-khoan", "/en/my-account"],
      ["/tai-khoan?tab=lookup", "/en/my-account?tab=lookup"],
      ["/tai-khoan/lost-password", "/en/my-account/lost-password"],
      ["/tai-khoan/orders", "/en/my-account/orders"],
      ["/thanh-toan/order-received/ONL-20261120-0188", "/en/checkout/order-received/ONL-20261120-0188"],
      ["/tin-tuc", "/en/category/blogs"],
      ["/tin-tuc/kien-thuc-pickleball", "/en/category/blogs/technique"],
      ["/tin-tuc/review-danh-gia", "/en/category/blogs/review"],
      ["/tin-tuc/tu-van-dung-cu-pickleball", "/en/category/blogs/buying-guide"],
      ["/tin-tuc/tin-tuc-cong-dong", "/en/category/blogs/community"],
      ["/thuong-hieu/joola", "/en/brand/joola"],
      ["/vot-pickleball", "/en/vot-pickleball"],
      ["/joola-perseus-power-fx#specs", "/en/joola-perseus-power-fx#specs"],
    ];

    for (const [viHref, expectedEn] of cases) {
      expect(localizeHref(viHref, "en"), `localizeHref(${viHref}, "en")`).toBe(expectedEn);
      expect(localizeHref(viHref, "vi"), `localizeHref(${viHref}, "vi")`).toBe(viHref);
      // Idempotent when already localized
      expect(localizeHref(expectedEn, "en"), `idempotent ${expectedEn}`).toBe(expectedEn);
    }

    // External URLs & special schemes remain untouched
    expect(localizeHref("https://example.com/test", "en")).toBe("https://example.com/test");
    expect(localizeHref("tel:0901234567", "en")).toBe("tel:0901234567");
    expect(localizeHref("#section-1", "en")).toBe("#section-1");
  });

  it("delocalizes English aliases and prefixed routes back to canonical Vietnamese routes", () => {
    const cases: Array<[string, string]> = [
      ["/en", "/"],
      ["/en/", "/"],
      ["/en/contact", "/lien-he"],
      ["/en/contact?branch=hn#map", "/lien-he?branch=hn#map"],
      ["/en/cart", "/gio-hang"],
      ["/en/checkout", "/thanh-toan"],
      ["/en/checkout?cancelled=1", "/thanh-toan?cancelled=1"],
      ["/en/order-success?order=ONL-1", "/order-success?order=ONL-1"],
      ["/en/shop", "/cua-hang"],
      ["/en/shop?brand=joola&page=2", "/cua-hang?brand=joola&page=2"],
      ["/en/search?q=joola", "/tim-kiem?q=joola"],
      ["/en/my-account?tab=lookup", "/tai-khoan?tab=lookup"],
      ["/en/my-account/lost-password", "/tai-khoan/lost-password"],
      ["/en/my-account/orders", "/tai-khoan/orders"],
      ["/en/checkout/order-received/ONL-188", "/thanh-toan/order-received/ONL-188"],
      ["/en/category/blogs", "/tin-tuc"],
      ["/en/category/blogs/technique", "/tin-tuc/kien-thuc-pickleball"],
      ["/en/category/blogs/review", "/tin-tuc/review-danh-gia"],
      ["/en/category/blogs/buying-guide", "/tin-tuc/tu-van-dung-cu-pickleball"],
      ["/en/category/blogs/community", "/tin-tuc/tin-tuc-cong-dong"],
      ["/en/brand/joola", "/thuong-hieu/joola"],
      ["/en/product/joola-perseus-power-fx", "/san-pham/joola-perseus-power-fx"],
      ["/en/product-category/thoi-trang/ao-pikpro", "/danh-muc-san-pham/thoi-trang/ao-pikpro"],
      ["/en/category/vot-pickleball", "/danh-muc/vot-pickleball"],
      ["/en/about-us", "/ve-chung-toi"],
      ["/en/trade-in", "/thu-cu-doi-moi"],
      ["/en/shipping-policy", "/chinh-sach-van-chuyen"],
      ["/en/warranty-returns", "/hoan-tien_tra-ve"],
      ["/en/privacy-policy", "/chinh-sach-bao-mat"],
      ["/en/terms-of-use", "/quy-dinh-su-dung"],
      ["/en/vot-pickleball", "/vot-pickleball"],
      ["/en/luat-choi-pickleball#sec-2", "/luat-choi-pickleball#sec-2"],
    ];

    for (const [enPath, expectedVi] of cases) {
      expect(delocalizePath(enPath), `delocalizePath(${enPath})`).toBe(expectedVi);
    }

    // Already VI paths pass through cleanly
    expect(delocalizePath("/lien-he?x=1")).toBe("/lien-he?x=1");
    expect(delocalizePath("/")).toBe("/");
  });

  it("round-trips VI <-> EN paths cleanly via switchLocalePath", () => {
    const pairs: Array<[string, string]> = [
      ["/", "/en"],
      ["/lien-he?branch=q10", "/en/contact?branch=q10"],
      ["/cua-hang?brand=selkirk", "/en/shop?brand=selkirk"],
      ["/gio-hang", "/en/cart"],
      ["/thanh-toan?cancelled=1", "/en/checkout?cancelled=1"],
      ["/tai-khoan?tab=lookup", "/en/my-account?tab=lookup"],
      ["/tai-khoan/lost-password", "/en/my-account/lost-password"],
      ["/tin-tuc", "/en/category/blogs"],
      ["/tin-tuc/review-danh-gia", "/en/category/blogs/review"],
      ["/thuong-hieu/joola", "/en/brand/joola"],
      ["/joola-perseus-power-fx", "/en/joola-perseus-power-fx"],
      ["/tim-kiem?q=joola", "/en/search?q=joola"],
    ];

    for (const [viPath, enPath] of pairs) {
      expect(switchLocalePath(viPath, "en")).toBe(enPath);
      expect(switchLocalePath(enPath, "vi")).toBe(viPath);
      expect(switchLocalePath(enPath, "en")).toBe(enPath);
      expect(switchLocalePath(viPath, "vi")).toBe(viPath);
    }
  });
});

describe("formatDateByLocale", () => {
  it("formats valid dates using vi-VN and en-US locales and handles empty/invalid inputs safely", () => {
    const iso = "2026-11-20T09:30:00.000Z";
    const viLong = formatDateByLocale(iso, "vi", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    const enLong = formatDateByLocale(iso, "en", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

    expect(viLong).toContain("2026");
    expect(enLong).toContain("November");
    expect(enLong).toContain("20");
    expect(enLong).toContain("2026");
    expect(VI_DIACRITIC_RE.test(enLong)).toBe(false);

    expect(formatDateByLocale(new Date(iso), "en", { timeZone: "UTC" })).toContain("2026");
    expect(formatDateByLocale(Date.parse(iso), "en", { timeZone: "UTC" })).toContain("2026");
    expect(formatDateByLocale(null, "en")).toBe("");
    expect(formatDateByLocale(undefined, "en")).toBe("");
    expect(formatDateByLocale("", "en")).toBe("");
    expect(formatDateByLocale("not-a-date", "en")).toBe("");
  });
});

describe("Comprehensive English Localization Coverage (Zero Leaked Vietnamese Diacritics)", () => {
  it("keeps STORE_I18N.en dictionary free of Vietnamese diacritics and aligned with glossary", () => {
    expect(STORE_I18N.en.nav.fashion).toBe("11Sport Sportswear");
    expect(STORE_I18N.en.nav.accessories).toBe("Accessories");
    expect(STORE_I18N.en.home.paddles).toBe("PICKLEBALL PADDLES");

    const leaks: string[] = [];
    const walk = (node: unknown, pathKey: string) => {
      if (typeof node === "string") {
        const leak = findVietnameseLeak(pathKey, node);
        if (leak) leaks.push(leak);
      } else if (Array.isArray(node)) {
        node.forEach((item, i) => walk(item, `${pathKey}[${i}]`));
      } else if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          walk(v, `${pathKey}.${k}`);
        }
      }
    };
    walk(STORE_I18N.en, "STORE_I18N.en");
    expect(leaks).toEqual([]);
  });

  it("localizes ALL mock categories & brands cleanly into English with zero leaked Vietnamese prose", () => {
    const leaks: string[] = [];

    const categories = getAllCategoriesList();
    expect(categories.length).toBeGreaterThanOrEqual(5);
    const allCats = [
      ...categories,
      ...categories.flatMap((c) => c.subCategories ?? []),
    ];
    for (const cat of allCats) {
      const enCat = localizeCategorySummary(cat, "en");
      const enDesc = localizeCategoryDescription(cat.slug, cat.descriptionHtml, "en");
      const checks = [
        findVietnameseLeak(`category[${cat.slug}].name`, enCat.name),
        findVietnameseLeak(`category[${cat.slug}].descriptionHtml`, enDesc),
        findVietnameseLeak(
          `localizeCategoryName(${cat.slug})`,
          localizeCategoryName(cat.name, "en", cat.slug)
        ),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }

    const brands = getAllBrandsList();
    expect(brands.length).toBeGreaterThanOrEqual(20);
    for (const brand of brands) {
      const enBrand = localizeBrandSummary(brand, "en");
      const enDesc = localizeBrandDescription(brand.slug, brand.descriptionHtml, "en");
      const checks = [
        findVietnameseLeak(`brand[${brand.slug}].name`, enBrand.name),
        findVietnameseLeak(`brand[${brand.slug}].country`, enBrand.country),
        findVietnameseLeak(`brand[${brand.slug}].descriptionHtml`, enDesc),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }

    expect(leaks).toEqual([]);
  });

  it("localizes ALL mock products (summaries, full details, specs, variants, bulk tiers, gifts, reviews) cleanly into English", async () => {
    process.env.NEXT_PUBLIC_DATA_SOURCE = "mock";
    const listRes = await fetchProducts({ limit: 100 });
    expect(listRes.data.length).toBeGreaterThan(10);

    const leaks: string[] = [];

    for (const item of listRes.data) {
      const enSummary = localizeProductSummary(item, "en");
      const sChecks = [
        findVietnameseLeak(`productSummary[${item.slug}].name`, enSummary.name),
        findVietnameseLeak(`productSummary[${item.slug}].category.name`, enSummary.category?.name),
        ...(enSummary.colors ?? []).map((c, idx) =>
          findVietnameseLeak(`productSummary[${item.slug}].colors[${idx}]`, c.color)
        ),
        ...(enSummary.images ?? []).map((img, idx) =>
          findVietnameseLeak(`productSummary[${item.slug}].images[${idx}].alt`, img.alt)
        ),
      ];
      for (const hit of sChecks) if (hit) leaks.push(hit);

      const detailRes = await fetchProductDetail(item.slug);
      expect(detailRes.data, `Expected mock product detail for ${item.slug}`).not.toBeNull();
      if (!detailRes.data) continue;

      const enDetail = localizeProductDetail(detailRes.data, "en");
      const dChecks = [
        findVietnameseLeak(`productDetail[${item.slug}].name`, enDetail.name),
        findVietnameseLeak(
          `productDetail[${item.slug}].shortDescription`,
          enDetail.shortDescription
        ),
        findVietnameseLeak(
          `productDetail[${item.slug}].descriptionHtml`,
          enDetail.descriptionHtml
        ),
        findVietnameseLeak(`productDetail[${item.slug}].seo.title`, enDetail.seo?.title),
        findVietnameseLeak(
          `productDetail[${item.slug}].seo.description`,
          enDetail.seo?.description
        ),
        ...(enDetail.specs ?? []).flatMap((sp, idx) => [
          findVietnameseLeak(`productDetail[${item.slug}].specs[${idx}].label`, sp.label),
          findVietnameseLeak(`productDetail[${item.slug}].specs[${idx}].value`, sp.value),
        ]),
        ...(enDetail.variants ?? []).flatMap((v, idx) => [
          findVietnameseLeak(`productDetail[${item.slug}].variants[${idx}].color`, v.color),
          findVietnameseLeak(`productDetail[${item.slug}].variants[${idx}].size`, v.size),
        ]),
        ...(enDetail.promotions?.tierPricing ?? []).map((t, idx) =>
          findVietnameseLeak(`productDetail[${item.slug}].tierPricing[${idx}].label`, t.label)
        ),
        ...(enDetail.promotions?.giftPromotions ?? []).flatMap((g, idx) => [
          findVietnameseLeak(`productDetail[${item.slug}].gifts[${idx}].title`, g.title),
          findVietnameseLeak(`productDetail[${item.slug}].gifts[${idx}].name`, g.name),
          findVietnameseLeak(
            `productDetail[${item.slug}].gifts[${idx}].description`,
            g.description
          ),
          findVietnameseLeak(
            `productDetail[${item.slug}].gifts[${idx}].giftProductName`,
            g.giftProductName
          ),
        ]),
      ];
      for (const hit of dChecks) if (hit) leaks.push(hit);
    }

    const reviews = await fetchProductReviews("prod-joola-perseus-power-fx");
    const enReviews = localizeReviewList(reviews, "en");
    expect(enReviews?.data.length).toBeGreaterThan(0);
    for (const r of enReviews?.data ?? []) {
      const hit1 = findVietnameseLeak(`review[${r._id}].customerName`, r.customerName);
      const hit2 = findVietnameseLeak(`review[${r._id}].comment`, r.comment);
      if (hit1) leaks.push(hit1);
      if (hit2) leaks.push(hit2);
    }

    expect(leaks).toEqual([]);
  });

  it("localizes ALL mock articles, policies, programs, home blocks, showrooms, statuses, and API messages cleanly into English", async () => {
    process.env.NEXT_PUBLIC_DATA_SOURCE = "mock";
    const leaks: string[] = [];

    // Articles
    const articlesRes = await fetchArticles({ limit: 50 });
    expect(articlesRes.data.length).toBeGreaterThanOrEqual(4);
    for (const art of articlesRes.data) {
      const enSum = localizeArticleSummary(art, "en");
      const detailRes = await fetchArticleDetail(art.slug);
      expect(detailRes.data).not.toBeNull();
      const enDet = detailRes.data ? localizeArticleDetail(detailRes.data, "en") : null;

      const checks = [
        findVietnameseLeak(`articleSummary[${art.slug}].title`, enSum.title),
        findVietnameseLeak(`articleSummary[${art.slug}].excerpt`, enSum.excerpt),
        findVietnameseLeak(`articleSummary[${art.slug}].category`, enSum.category?.name),
        findVietnameseLeak(`articleDetail[${art.slug}].title`, enDet?.title),
        findVietnameseLeak(`articleDetail[${art.slug}].excerpt`, enDet?.excerpt),
        findVietnameseLeak(`articleDetail[${art.slug}].authorName`, enDet?.authorName),
        findVietnameseLeak(`articleDetail[${art.slug}].contentHtml`, enDet?.contentHtml),
        findVietnameseLeak(`articleDetail[${art.slug}].seo.title`, enDet?.seo?.title),
        findVietnameseLeak(`articleDetail[${art.slug}].seo.description`, enDet?.seo?.description),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }

    // Policies
    const policies = getAllPolicyPages();
    expect(policies.length).toBeGreaterThanOrEqual(4);
    for (const pol of policies) {
      const enPol = localizePolicyPage(pol, "en");
      const checks = [
        findVietnameseLeak(`policy[${pol.slug}].title`, enPol.title),
        findVietnameseLeak(`policy[${pol.slug}].summary`, enPol.summary),
        findVietnameseLeak(`policy[${pol.slug}].callout`, enPol.callout),
        ...enPol.sections.flatMap((sec, i) => [
          findVietnameseLeak(`policy[${pol.slug}].sections[${i}].heading`, sec.heading),
          ...sec.paragraphs.map((p, j) =>
            findVietnameseLeak(`policy[${pol.slug}].sections[${i}].p[${j}]`, p)
          ),
        ]),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);

      const enStatic = localizeStaticPage(
        {
          _id: pol._id,
          slug: pol.slug,
          title: pol.title,
          contentHtml: "<p>VI</p>",
          seo: { title: pol.title, description: pol.summary },
        },
        "en"
      );
      const sHit = findVietnameseLeak(`staticPolicy[${pol.slug}].contentHtml`, enStatic.contentHtml);
      if (sHit) leaks.push(sHit);
    }

    // Programs
    const programs = getAllProgramPages();
    expect(programs.length).toBeGreaterThanOrEqual(2);
    for (const prog of programs) {
      const enProg = localizeProgramPage(prog, "en");
      const checks = [
        findVietnameseLeak(`program[${prog.slug}].title`, enProg.title),
        findVietnameseLeak(`program[${prog.slug}].subtitle`, enProg.subtitle),
        findVietnameseLeak(`program[${prog.slug}].callout`, enProg.callout),
        ...enProg.cards.flatMap((c, i) => [
          findVietnameseLeak(`program[${prog.slug}].cards[${i}].badge`, c.badge),
          findVietnameseLeak(`program[${prog.slug}].cards[${i}].title`, c.title),
          findVietnameseLeak(`program[${prog.slug}].cards[${i}].description`, c.description),
        ]),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }

    // Home data & Site Settings
    const [home, settings] = await Promise.all([fetchHomeData(), fetchSiteSettings()]);
    for (const banner of home?.banners ?? []) {
      const enBanner = localizeBanner(banner, "en");
      const checks = [
        findVietnameseLeak(`banner[${banner._id}].title`, enBanner.title),
        findVietnameseLeak(`banner[${banner._id}].altText`, enBanner.altText),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }
    for (const usp of home?.usp ?? []) {
      const enUsp = localizeUspItem(usp, "en");
      const checks = [
        findVietnameseLeak(`usp[${usp.icon ?? "default"}].title`, enUsp.title),
        findVietnameseLeak(`usp[${usp.icon ?? "default"}].description`, enUsp.description),
      ];
      for (const hit of checks) if (hit) leaks.push(hit);
    }
    for (const block of home?.categoryBlocks ?? []) {
      const enTitle = localizeHomeSectionTitle(block.category.name, "en");
      const hit = findVietnameseLeak(`homeBlock[${block.category.slug}]`, enTitle);
      if (hit) leaks.push(hit);
    }
    const topBarHit = findVietnameseLeak(
      "siteSettings.topBarText",
      localizeTopBarText(settings?.topBarText, "en")
    );
    if (topBarHit) leaks.push(topBarHit);
    for (const sr of settings?.showrooms ?? []) {
      const enSr = localizeShowroom(sr, "en");
      const h1 = findVietnameseLeak(`showroom.name`, enSr.name);
      const h2 = findVietnameseLeak(`showroom.address`, enSr.address);
      const h3 = findVietnameseLeak(`showroom.hours`, enSr.hours);
      if (h1) leaks.push(h1);
      if (h2) leaks.push(h2);
      if (h3) leaks.push(h3);
    }

    // Statuses, Gateways, Coupons, Tiers, Gifts, API messages
    expect(localizeOrderStatus("PENDING", "en")).toBe("Pending");
    expect(localizeOrderStatus("SHIPPING", "en")).toBe("In Transit");
    expect(localizeOrderStatus("DELIVERED", "en")).toBe("Delivered");
    expect(localizeOrderStatus("DELIVERED", "vi")).toBe("Đã giao hàng");
    expect(localizePaymentStatus("PAID", "en")).toBe("Paid");
    expect(localizePaymentStatus("UNPAID", "en")).toBe("Unpaid");
    expect(localizePaymentGateway("COD", "en")).toBe("Cash on Delivery (COD)");
    expect(localizePaymentGateway("PAYOS", "en")).toBe("VietQR / PayOS Bank Transfer");
    expect(localizeBulkTierLabel("Mua từ 3 sản phẩm cùng biến thể → 5.000.000₫ / sp", "en")).toContain(
      "Buy 3+ of the same variant"
    );
    expect(localizeGiftTitle("Mua 5 sản phẩm → 1 áo", "en")).toContain("1 Free Shirt");
    expect(localizeCouponName("Giảm 100.000₫ đơn hàng", "en")).toBe("100,000₫ off your order");
    expect(
      localizeApiMessage('Mã ưu đãi "INVALID" không hợp lệ hoặc đã hết hạn.', "en")
    ).toBe('Promo code "INVALID" is invalid or has expired.');
    expect(
      localizeApiMessage("Không tìm thấy đơn hàng khớp với mã đơn và số điện thoại.", "en")
    ).toBe("No order found matching that order code and phone number.");

    expect(leaks).toEqual([]);
  });
});
