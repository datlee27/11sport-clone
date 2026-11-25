import type { LocaleCode } from "@/lib/format";
import {
  localizeArticleCategoryDescription,
  localizeArticleCategoryName,
  type ShowroomLike,
} from "@/lib/i18n";

export interface BlogCategoryEntry {
  slug: string;
  name: string;
  description: string;
}

const BLOG_CATEGORY_BASE: readonly BlogCategoryEntry[] = [
  {
    slug: "kien-thuc-pickleball",
    name: "Kiến thức Pickleball",
    description:
      "Luật chơi, cách tính điểm, kỹ thuật Dink, Third-Shot Drop và kích thước sân Pickleball chuẩn USAPA.",
  },
  {
    slug: "review-danh-gia",
    name: "Review & Đánh giá",
    description:
      "Đánh giá thực chiến các dòng vợt Pickleball Joola, Selkirk, Kamito, Facolos, CRBN mới nhất.",
  },
  {
    slug: "tu-van-dung-cu-pickleball",
    name: "Tư vấn dụng cụ Pickleball",
    description:
      "Hướng dẫn chọn độ dày lõi 14mm vs 16mm, trọng lượng vợt, giày và phụ kiện theo trình độ.",
  },
  {
    slug: "tin-tuc-cong-dong",
    name: "Tin tức & Cộng đồng",
    description:
      "Tin tức giải đấu PPA Tour, cộng đồng CLB và sự kiện tại hệ thống 3 showroom.",
  },
] as const;

export function getBlogCategories(locale: LocaleCode): BlogCategoryEntry[] {
  return BLOG_CATEGORY_BASE.map((cat) => ({
    slug: cat.slug,
    name: localizeArticleCategoryName(cat.name, locale, cat.slug),
    description: localizeArticleCategoryDescription(
      cat.slug,
      cat.description,
      locale
    ),
  }));
}

export function getBlogCategoryMeta(
  slug: string,
  locale: LocaleCode
): BlogCategoryEntry | null {
  const base = BLOG_CATEGORY_BASE.find((cat) => cat.slug === slug);
  if (!base) return null;
  return {
    slug: base.slug,
    name: localizeArticleCategoryName(base.name, locale, base.slug),
    description: localizeArticleCategoryDescription(
      base.slug,
      base.description,
      locale
    ),
  };
}

export const ARTICLE_SHOWROOMS_BASE: ReadonlyArray<
  Required<Pick<ShowroomLike, "name" | "address" | "phone">>
> = [
  {
    name: "11Sport Quận 10",
    address: "95 Trần Thiện Chánh, Phường 12, Quận 10, TP.HCM",
    phone: "0789 404 331",
  },
  {
    name: "11Sport Phú Nhuận",
    address: "100 Hoa Lan, Phường 2, Phú Nhuận, TP.HCM",
    phone: "0789 404 231",
  },
  {
    name: "11Sport Hà Nội",
    address: "466 Đường Bưởi, Ngọc Hà, Ba Đình, Hà Nội",
    phone: "0913 729 135",
  },
] as const;

export const EDITORIAL_I18N = {
  vi: {
    common: {
      home: "Trang chủ",
      blog: "Tin tức",
      contact: "Liên hệ",
      breadcrumbAria: "Đường dẫn",
    },
    blogList: {
      metaTitle: "Tin Tức & Kiến Thức Pickleball Chính Hãng",
      metaDescription:
        "Hướng dẫn chọn vợt Pickleball 14mm vs 16mm, luật chơi USAPA, review vợt Joola Perseus, Selkirk Boomstik và tin tức giải đấu.",
      heroTitle: "TIN TỨC",
      allCategories: "Tất cả",
      allArticles: "Tất cả bài viết",
      emptyTitle: "Chưa có bài viết nào trong chuyên mục này.",
      emptyAction: "Xem tất cả bài viết",
      paginationAria: "Phân trang bài viết",
      prevPageAria: "Trang trước",
      nextPageAria: "Trang tiếp theo",
      pageLabel: (page: number, totalPages: number) =>
        `Trang ${page} / ${totalPages}`,
    },
    blogCategory: {
      metaTitle: (catName: string) =>
        `${catName} — Tin Tức & Cẩm Nang Pickleball`,
      articleFallbackTitle: "Bài viết Pickleball",
    },
    article: {
      cardFallbackBadge: "11SPORT BLOG",
      updatedFallback: "CẬP NHẬT MỚI",
      publishedBy: (formattedDate: string, author: string) =>
        `ĐĂNG VÀO ${formattedDate.toUpperCase()} BỞI ${author.toUpperCase()}`,
      calloutBody:
        "Người mới chuyển từ cầu lông hoặc tennis sang Pickleball nên ưu tiên thử trực tiếp lõi 16mm tại 3 showroom Quận 10, Phú Nhuận và Hà Nội để kiểm soát bóng ổn định và giảm rung chấn cổ tay.",
      showroomHeading: "Trải nghiệm & test vợt thực tế tại hệ thống 11Sport",
      authorLabel: (author: string) => `TÁC GIẢ · ${author}`,
      backToBlog: "Quay lại Tin tức",
    },
    toc: {
      title: "Mục lục bài viết",
      navAria: "Mục lục bài viết",
    },
    consultForm: {
      titleHorizontal: "ĐĂNG KÝ TƯ VẤN",
      titleSidebar: "GỬI CÂU HỎI TƯ VẤN",
      nameLabel: "Họ và tên",
      namePlaceholder: "Họ và tên *",
      phoneLabel: "Số điện thoại",
      phonePlaceholder: "Số điện thoại *",
      emailLabel: "Email",
      emailPlaceholder: "Email",
      addressLabel: "Địa chỉ liên hệ",
      addressPlaceholder: "Địa chỉ liên hệ",
      messageLabelHorizontal: "Nội dung tư vấn",
      messagePlaceholderHorizontal:
        "Nội dung cần tư vấn (chọn vợt 14mm/16mm, đặt lịch thử vợt...) *",
      messageLabelSidebar: "Nội dung",
      messagePlaceholderSidebar: "Nội dung *",
      addressPrefix: "Địa chỉ",
      submitHorizontal: "GỬI LIÊN HỆ",
      submitSidebar: "GỬI CÂU HỎI",
      submitting: "ĐANG GỬI...",
      validationRequired:
        "Vui lòng nhập đầy đủ họ tên, số điện thoại và nội dung cần tư vấn.",
      successFallback:
        "Đã nhận câu hỏi! Tư vấn viên 11Sport sẽ liên hệ lại sớm.",
      errorFallback:
        "Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc gọi Hotline 0909 888 128.",
    },
    contact: {
      metaTitle: "Hệ Thống 3 Chi Nhánh Showroom & Liên Hệ",
      metaDescription:
        "Địa chỉ hệ thống 3 showroom Quận 10, Phú Nhuận (TP.HCM) và Ngọc Hà (Hà Nội). Trải nghiệm cầm thử vợt Joola, Selkirk, Kamito chính hãng.",
      addressRegion: "Việt Nam",
      heading: (siteName: string) =>
        `LIÊN HỆ ${siteName.toUpperCase()} PICKLEBALL`,
      addressLabel: "Địa chỉ:",
      hotlineLabel: "Hotline:",
      hoursLabel: "Giờ mở cửa:",
      openInMaps: "Xem trên Google Maps",
      showroomPhotoAlt: (siteName: string) =>
        `Showroom ${siteName} Pickleball`,
      mapSectionAria: "Bản đồ showroom",
      mapTabFallback: (idx: number) => `CHI NHÁNH ${idx + 1}`,
      mapIframeTitle: (branchName?: string) =>
        `Bản đồ ${branchName || "Showroom"}`,
      tabLocationLabels: (siteName: string) => [
        `${siteName.toUpperCase()} QUẬN 10`,
        `${siteName.toUpperCase()} PHÚ NHUẬN`,
        `${siteName.toUpperCase()} HÀ NỘI`,
      ],
      socialAria: (network: string, siteName: string) =>
        `${network} ${siteName}`,
      consultFormTitle: "ĐĂNG KÝ TƯ VẤN",
    },
    rootSlug: {
      categoryMetaTitle: (catName: string) => `${catName} Chính Hãng`,
      categoryMetaDesc: (catName: string) =>
        `Đại lý phân phối ${catName} chính hãng 100%, lỗi 1 đổi 1, freeship toàn quốc.`,
      categoryH1: (catName: string) =>
        `${catName} Chính Hãng — Hệ Thống Cửa Hàng 11Sport`,
      brandGroupTitle: (brandName: string, isShoes: boolean) =>
        isShoes ? `Giày ${brandName}` : `Vợt Pickleball ${brandName}`,
      categorySeoTitle: (catName: string) =>
        `Hướng dẫn chọn mua ${catName} chính hãng`,
      brandMetaTitle: (brandName: string, isShoeBrand: boolean) =>
        isShoeBrand
          ? `Giày Pickleball ${brandName} Chính Hãng`
          : `Vợt & Dụng cụ Pickleball ${brandName} Chính Hãng`,
      brandMetaDesc: (brandName: string) =>
        `Mua sản phẩm ${brandName} chính hãng 100% có tem NFC/QR xác thực, tặng quấn cán, dán viền, bao vợt và ưu đãi giá sỉ từ 3 sản phẩm.`,
      parentCategory: (isShoeBrand: boolean) =>
        isShoeBrand
          ? { name: "Giày Pickleball", path: "/giay-pickleball" }
          : { name: "Vợt Pickleball", path: "/vot-pickleball" },
      brandArchiveLabel: (brandName: string, isShoeBrand: boolean) =>
        isShoeBrand
          ? `Giày Pickleball ${brandName}`
          : `Vợt Pickleball ${brandName}`,
      brandH1: (brandArchiveLabel: string) =>
        `${brandArchiveLabel} Chính Hãng — 11Sport`,
      brandSeoTitle: (brandName: string) =>
        `Về thương hiệu ${brandName} chính hãng`,
      productMetaTitle: (prodName: string) => `${prodName} Chính Hãng`,
      productMetaDesc: (prodName: string) =>
        `Mua ${prodName} chính hãng 100%, giá mua nhiều từ 3 sản phẩm cùng biến thể, freeship toàn quốc.`,
      productJsonLdDescFallback: (prodName: string) =>
        `${prodName} chính hãng 100%.`,
      productBrandBreadcrumb: (brandName: string) =>
        `Vợt Pickleball ${brandName}`,
      programSectionHeading: (slug: string) =>
        slug === "ve-chung-toi"
          ? "TẦM NHÌN - SỨ MỆNH - MỤC TIÊU"
          : "QUY TRÌNH 3 BƯỚC THU CŨ ĐỔI MỚI VỢT PICKLEBALL",
      programPrimaryCta: (slug: string) =>
        slug === "ve-chung-toi" ? "Hồ sơ năng lực" : "Đăng ký định giá vợt",
      programSecondaryCta: "Liên hệ tư vấn",
      programPhotoAlt: (title: string) => `Showroom 11Sport - ${title}`,
      programCalloutTitle: "Cam kết hệ thống 11Sport",
    },
  },
  en: {
    common: {
      home: "Home",
      blog: "Blog",
      contact: "Contact",
      breadcrumbAria: "Breadcrumb",
    },
    blogList: {
      metaTitle: "Pickleball Blog, Rules & Paddle Reviews",
      metaDescription:
        "Guides to choosing 14mm vs. 16mm pickleball paddles, official USAPA rules, Joola Perseus & Selkirk Boomstik reviews, and tournament news.",
      heroTitle: "BLOG",
      allCategories: "All",
      allArticles: "All Articles",
      emptyTitle: "No articles published in this category yet.",
      emptyAction: "Browse all articles",
      paginationAria: "Article pagination",
      prevPageAria: "Previous page",
      nextPageAria: "Next page",
      pageLabel: (page: number, totalPages: number) =>
        `Page ${page} of ${totalPages}`,
    },
    blogCategory: {
      metaTitle: (catName: string) => `${catName} — Pickleball Blog & Guides`,
      articleFallbackTitle: "Pickleball Article",
    },
    article: {
      cardFallbackBadge: "11SPORT BLOG",
      updatedFallback: "RECENTLY UPDATED",
      publishedBy: (formattedDate: string, author: string) =>
        `PUBLISHED ON ${formattedDate.toUpperCase()} BY ${author.toUpperCase()}`,
      calloutBody:
        "Players transitioning from badminton or tennis to Pickleball should demo a 16mm core in person at our District 10, Phu Nhuan, or Hanoi showrooms for steadier ball control and less wrist vibration.",
      showroomHeading: "Demo & test paddles in person at 11Sport Showrooms",
      authorLabel: (author: string) => `AUTHOR · ${author}`,
      backToBlog: "Back to Blog",
    },
    toc: {
      title: "Table of Contents",
      navAria: "Table of Contents",
    },
    consultForm: {
      titleHorizontal: "REQUEST A CONSULTATION",
      titleSidebar: "ASK OUR SPECIALISTS",
      nameLabel: "Full name",
      namePlaceholder: "Full name *",
      phoneLabel: "Phone number",
      phonePlaceholder: "Phone number (e.g. 0909 888 128) *",
      emailLabel: "Email",
      emailPlaceholder: "Email (optional)",
      addressLabel: "Contact address",
      addressPlaceholder: "City or address (optional)",
      messageLabelHorizontal: "Consultation details",
      messagePlaceholderHorizontal:
        "How can we help? (14mm vs. 16mm paddle advice, showroom demo booking...) *",
      messageLabelSidebar: "Message",
      messagePlaceholderSidebar: "Your question *",
      addressPrefix: "Address",
      submitHorizontal: "SEND MESSAGE",
      submitSidebar: "SEND QUESTION",
      submitting: "SENDING...",
      validationRequired:
        "Please fill in your full name, phone number, and message before sending.",
      successFallback:
        "Message received! An 11Sport specialist will reach out to you shortly.",
      errorFallback:
        "Unable to send your request right now. Please try again or call our Hotline at 0909 888 128.",
    },
    contact: {
      metaTitle: "Contact Us & 3 Showrooms in HCMC & Hanoi",
      metaDescription:
        "Visit our 3 showrooms in District 10, Phu Nhuan (Ho Chi Minh City), and Ngoc Ha (Hanoi). Demo authentic Joola, Selkirk, and Kamito pickleball paddles in person.",
      addressRegion: "Vietnam",
      heading: (siteName: string) =>
        `CONTACT ${siteName.toUpperCase()} PICKLEBALL`,
      addressLabel: "Address:",
      hotlineLabel: "Hotline:",
      hoursLabel: "Opening Hours:",
      openInMaps: "Open in Google Maps",
      showroomPhotoAlt: (siteName: string) =>
        `${siteName} Pickleball Showroom`,
      mapSectionAria: "Showroom locations map",
      mapTabFallback: (idx: number) => `BRANCH ${idx + 1}`,
      mapIframeTitle: (branchName?: string) =>
        `Map of ${branchName || "Showroom"}`,
      tabLocationLabels: (siteName: string) => [
        `${siteName.toUpperCase()} DISTRICT 10`,
        `${siteName.toUpperCase()} PHU NHUAN`,
        `${siteName.toUpperCase()} HANOI`,
      ],
      socialAria: (network: string, siteName: string) =>
        `${siteName} on ${network}`,
      consultFormTitle: "REQUEST A CONSULTATION",
    },
    rootSlug: {
      categoryMetaTitle: (catName: string) => `Authentic ${catName}`,
      categoryMetaDesc: (catName: string) =>
        `Authorized distributor of 100% authentic ${catName} with 1-to-1 replacement and free nationwide shipping.`,
      categoryH1: (catName: string) =>
        `Authentic ${catName} — 11Sport Official Store`,
      brandGroupTitle: (brandName: string, isShoes: boolean) =>
        isShoes
          ? `${brandName} Pickleball Shoes`
          : `${brandName} Pickleball Paddles`,
      categorySeoTitle: (catName: string) =>
        `Buying Guide: Authentic ${catName}`,
      brandMetaTitle: (brandName: string, isShoeBrand: boolean) =>
        isShoeBrand
          ? `Authentic ${brandName} Pickleball Shoes`
          : `Authentic ${brandName} Pickleball Paddles & Gear`,
      brandMetaDesc: (brandName: string) =>
        `Shop 100% authentic ${brandName} gear with NFC/QR verification, free overgrip, edge tape & paddle cover, and bulk pricing from 3+ units.`,
      parentCategory: (isShoeBrand: boolean) =>
        isShoeBrand
          ? { name: "Pickleball Shoes", path: "/giay-pickleball" }
          : { name: "Pickleball Paddles", path: "/vot-pickleball" },
      brandArchiveLabel: (brandName: string, isShoeBrand: boolean) =>
        isShoeBrand
          ? `${brandName} Pickleball Shoes`
          : `${brandName} Pickleball Paddles`,
      brandH1: (brandArchiveLabel: string) =>
        `Authentic ${brandArchiveLabel} — 11Sport`,
      brandSeoTitle: (brandName: string) => `About Authentic ${brandName}`,
      productMetaTitle: (prodName: string) => `${prodName} — 100% Authentic`,
      productMetaDesc: (prodName: string) =>
        `Shop 100% authentic ${prodName} with bulk pricing from 3+ of the same variant and free nationwide shipping.`,
      productJsonLdDescFallback: (prodName: string) =>
        `100% authentic ${prodName}.`,
      productBrandBreadcrumb: (brandName: string) =>
        `${brandName} Pickleball Paddles`,
      programSectionHeading: (slug: string) =>
        slug === "ve-chung-toi"
          ? "VISION – MISSION – GOALS"
          : "3-STEP PICKLEBALL PADDLE TRADE-IN PROCESS",
      programPrimaryCta: (slug: string) =>
        slug === "ve-chung-toi"
          ? "Company Profile"
          : "Request Paddle Valuation",
      programSecondaryCta: "Contact a Specialist",
      programPhotoAlt: (title: string) => `11Sport Showroom — ${title}`,
      programCalloutTitle: "The 11Sport Guarantee",
    },
  },
} as const;
