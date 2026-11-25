import type { LocaleCode } from "@/lib/format";
import { localizeShowroom } from "@/lib/i18n";
import type { SiteShowroomData } from "@/lib/storefront";

export interface LocalizedBranch {
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  mapUrl?: string;
  embedUrl?: string;
}

/**
 * Localizes showroom/branch entries from API settings or fallback lists,
 * wrapping `localizeShowroom` with additional prefix handling (`HCM:`, `Chi nhánh`).
 */
export function localizeChromeShowroom<T extends LocalizedBranch>(
  showroom: T,
  locale: LocaleCode
): T {
  if (locale === "vi") return showroom;
  const base = localizeShowroom(showroom, locale);
  const refine = (value: string): string =>
    value
      .replace(/^HCM:\s*/i, "HCMC: ")
      .replace(/^Chi nhánh\s+(.+?)\s*\(Ho Chi Minh City\)$/i, "$1 Showroom (HCMC)")
      .replace(/^Chi nhánh\s+(.+?)\s*\(Hanoi\)$/i, "$1 Showroom (Hanoi)")
      .replace(/^Chi nhánh\s+/i, "Showroom ");

  return {
    ...base,
    name: refine(base.name),
    address: refine(base.address),
  };
}

export const CHROME_I18N = {
  vi: {
    header: {
      openMenuAria: "Mở menu danh mục",
      openSearchAria: "Mở tìm kiếm",
      mainNavAria: "Danh mục chính",
      toggleSubmenuAria: (label: string) => `Mở danh mục con ${label}`,
      viewAllPaddlesFull: "Xem tất cả Vợt Pickleball →",
      viewAllPaddlesShort: "Xem tất cả Vợt →",
      featuredBrandsHeading: "Hãng nổi bật",
      officialBrandsCount: "22 thương hiệu vợt chính hãng",
      searchProductsAria: "Tìm kiếm sản phẩm",
      searchInputAria: "Tìm kiếm sản phẩm và bài viết",
      cartAria: (count: number) => `Giỏ hàng (${count} sản phẩm)`,
      switchCurrencyAria: "Chuyển đổi tiền tệ",
      currencyListboxAria: "Chọn đơn vị tiền tệ",
      submitSearchAria: "Tìm kiếm",
      closeSearchAria: "Đóng tìm kiếm",
      searchingFor: (q: string) => `Đang tìm kiếm “${q}”...`,
      searchPreviewError:
        "Không thể tải gợi ý nhanh. Nhấn Enter để tìm kiếm toàn trang.",
      searchNoMatch: (q: string) =>
        `Không tìm thấy kết quả phù hợp cho “${q}”.`,
      searchNoMatchHint:
        "Thử từ khóa khác như Joola, Selkirk, Kamito, 16mm hoặc xem tất cả kết quả.",
      relatedArticlesHeading: "Bài viết liên quan",
      mobileMenuAria: "Menu danh mục",
      closeMenuAria: "Đóng menu",
    },
    footer: {
      hotlineLabel: "Hotline / WhatsApp",
      moitBadgeAria: "Đã thông báo Bộ Công Thương",
      moitBadgeLine1: "ĐÃ THÔNG BÁO",
      moitBadgeLine2: "BỘ CÔNG THƯƠNG",
      codBadgeTitle: "Thanh toán khi nhận hàng (COD)",
      defaultShowrooms: [
        {
          name: "HCM: 95 Trần Thiện Chánh, Quận 10",
          address: "HCM: 95 Trần Thiện Chánh, Quận 10",
          phone: "+84.789.404.331",
          mapUrl: "https://maps.google.com/?q=10.7756,106.6679",
        },
        {
          name: "HCM: 100 Hoa Lan, Phú Nhuận",
          address: "HCM: 100 Hoa Lan, Phú Nhuận",
          phone: "+84.789.404.231",
          mapUrl: "https://maps.google.com/?q=10.7982,106.6897",
        },
        {
          name: "Hà Nội: 466 Đ. Bưởi, Ngọc Hà",
          address: "Hà Nội: 466 Đ. Bưởi, Ngọc Hà",
          phone: "+84.913.729.135",
          mapUrl: "https://maps.google.com/?q=21.0431,105.8092",
        },
      ] as SiteShowroomData[],
    },
    miniCart: {
      dialogAria: "Giỏ hàng của bạn",
      heading: (count: number) => `GIỎ HÀNG (${count})`,
      closeAria: "Đóng giỏ hàng",
      emptyMessage: "Chưa có sản phẩm nào trong giỏ hàng.",
      returnToShop: "QUAY TRỞ LẠI CỬA HÀNG",
      removeItemAria: (name: string) => `Xóa ${name} khỏi giỏ hàng`,
      decreaseQtyAria: (name: string) => `Giảm số lượng ${name}`,
      increaseQtyAria: (name: string) => `Tăng số lượng ${name}`,
      bulkTier3Label: "Mua từ 3 sản phẩm cùng biến thể",
      bulkTier5Label: "Mua từ 5 sản phẩm cùng biến thể",
      giftBadge: "Quà 11Sport",
      giftFreeSubtitle: "Quà tặng 11Sport: Miễn phí",
      bulkSavingsLabel: "Tiết kiệm Giá Mua Nhiều",
      subtotalLabel: "Tổng số phụ:",
      viewCartCta: "XEM GIỎ HÀNG",
      checkoutCta: "THANH TOÁN",
    },
    floatingContact: {
      defaultBranches: [
        {
          name: "Chi nhánh Quận 10 (TP.HCM)",
          address: "95 Trần Thiện Chánh, Phường 12, Quận 10",
          phone: "0789 404 331",
        },
        {
          name: "Chi nhánh Phú Nhuận (TP.HCM)",
          address: "100 Hoa Lan, Phường 2, Quận Phú Nhuận",
          phone: "0789 404 231",
        },
        {
          name: "Chi nhánh Ngọc Hà (Hà Nội)",
          address: "466 Đường Bưởi, Ngọc Hà, Quận Ba Đình",
          phone: "0913 729 135",
        },
      ] as LocalizedBranch[],
      consultClipboardMessage:
        "Xin chào 11Sport, tôi cần tư vấn chọn vợt Pickleball phù hợp!",
      callHotlineAria: (hotline: string) => `Gọi Hotline ${hotline}`,
      messengerAria: "Chat Facebook Messenger",
      zaloButtonAria: "Chọn cửa hàng tư vấn Zalo",
      closeQuickContactAria: "Đóng kênh liên hệ nhanh",
      openQuickContactAria: "Mở kênh liên hệ nhanh",
      backToTopAria: "Lên đầu trang",
      zaloDialogAria: "Chọn cửa hàng tư vấn",
      zaloDialogTitle: "Chọn cửa hàng tư vấn Zalo",
      zaloDialogSubtitle:
        "Kỹ thuật viên trực tuyến 08:30 – 21:30 tại 3 chi nhánh 11Sport",
      closeZaloAria: "Đóng hộp thoại Zalo",
      chatZaloPill: "Chat Zalo",
      copiedConsultLabel: "Đã sao chép lời nhắn tư vấn!",
      copyConsultLabel: "Sao chép yêu cầu tư vấn nhanh",
    },
    designSystem: {
      guaranteesHomeAria: "Cam kết chính hãng",
      categoryPills: [
        "CHÍNH HÃNG 100%",
        "LỖI LÀ ĐỔI MỚI",
        "FREESHIP TOÀN QUỐC",
      ] as const,
      distributorBannerAria: "Chứng nhận nhà phân phối chính hãng",
      distributorBannerAlt:
        "Chứng nhận đại lý phân phối chính hãng 11Sport: Joola, Selkirk, Kamito, Facolos, CRBN",
      viewAll: "Xem tất cả →",
      breadcrumbAria: "Điều hướng phân cấp",
      prevProductAria: "Sản phẩm trước",
      nextProductAria: "Sản phẩm tiếp theo",
      editorialCalloutDefaultTitle: "Lưu ý chuyên gia 11Sport",
      policyScopeNote:
        "(Áp dụng cho khách hàng mua sắm trực tiếp tại hệ thống 3 showroom và đặt hàng online trên website 11Sport)",
      policyCalloutTitle: "Cam kết bảo vệ quyền lợi khách hàng",
      otherPoliciesAria: "Các chính sách khác tại 11Sport",
    },
    heroSlider: {
      emptyBannerAria: "Khung banner quảng cáo 11Sport",
      heroSectionAria: "Banner nổi bật 11Sport",
      noData: "Chưa có dữ liệu",
      prevBannerAria: "Banner trước",
      nextBannerAria: "Banner tiếp theo",
      viewBannerAria: (index: number) => `Xem banner ${index}`,
    },
    brandCarousel: {
      defaultTitle: "Thương hiệu phân phối chính hãng",
      prevBrandAria: "Thương hiệu trước",
      nextBrandAria: "Thương hiệu tiếp theo",
    },
    articleGrid: {
      defaultTitle: "TIN TỨC & KIẾN THỨC PICKLEBALL",
      readArticle: "Xem bài viết →",
    },
    productCarousel: {
      prevProductAria: "Sản phẩm trước",
      nextProductAria: "Sản phẩm tiếp theo",
      goToGroupAria: (index: number) => `Chuyển đến nhóm sản phẩm ${index}`,
    },
    productCard: {
      hoverImageAlt: (name: string) => `${name} - ảnh tiếp theo`,
      selectColorAria: (color: string, name: string) =>
        `Chọn màu ${color} cho ${name}`,
    },
    home: {
      metaTitle: "11Sport — Hệ Thống Vợt & Phụ Kiện Pickleball Chính Hãng",
      metaDescription:
        "Đại lý phân phối vợt Pickleball Joola, Selkirk, Kamito, Facolos, CRBN, giày Asics, Skechers chính hãng 100% tại 11Sport. Ưu đãi giá sỉ từ 3 sản phẩm, lỗi 1 đổi 1, freeship toàn quốc.",
      srH1:
        "11Sport — Hệ thống phân phối Vợt, Giày & Phụ kiện Pickleball chính hãng",
      fallbackProductsTitle: "SẢN PHẨM",
      fallbackFeaturedTitle: "SẢN PHẨM NỔI BẬT",
      fallbackPaddlesTitle: "VỢT PICKLEBALL",
      fallbackBrandsTitle: "THƯƠNG HIỆU PHÂN PHỐI CHÍNH HÃNG",
      noData: "Chưa có dữ liệu",
    },
    errorPage: {
      badge: "HỆ THỐNG GIÁN ĐOẠN · 11SPORT",
      heading: "Đã xảy ra sự cố khi tải dữ liệu",
      description:
        "Hệ thống không thể tải dữ liệu từ máy chủ hoặc kết nối mạng bị gián đoạn. Bạn vui lòng bấm thử lại hoặc quay về trang chủ.",
      retryCta: "THỬ LẠI",
      homeCta: "VỀ TRANG CHỦ",
    },
    notFoundPage: {
      badge: "LỖI 404 · 11SPORT",
      heading: "Không tìm thấy trang bạn yêu cầu",
      description:
        "Đường dẫn có thể đã thay đổi hoặc sản phẩm hiện không còn kinh doanh tại 11Sport. Vui lòng quay về trang chủ hoặc tìm kiếm mẫu vợt & phụ kiện khác.",
      homeCta: "VỀ TRANG CHỦ",
      searchCta: "TÌM KIẾM SẢN PHẨM",
    },
  },
  en: {
    header: {
      openMenuAria: "Open category menu",
      openSearchAria: "Open search",
      mainNavAria: "Main navigation",
      toggleSubmenuAria: (label: string) => `Toggle ${label} submenu`,
      viewAllPaddlesFull: "View All Pickleball Paddles →",
      viewAllPaddlesShort: "View All Paddles →",
      featuredBrandsHeading: "Featured Brands",
      officialBrandsCount: "22 official pickleball paddle brands",
      searchProductsAria: "Search products",
      searchInputAria: "Search products and articles",
      cartAria: (count: number) =>
        `Shopping Cart (${count} ${count === 1 ? "item" : "items"})`,
      switchCurrencyAria: "Switch currency",
      currencyListboxAria: "Select currency",
      submitSearchAria: "Submit search",
      closeSearchAria: "Close search",
      searchingFor: (q: string) => `Searching for “${q}”...`,
      searchPreviewError:
        "Could not load quick suggestions. Press Enter to view full search results.",
      searchNoMatch: (q: string) => `No matching results for “${q}”.`,
      searchNoMatchHint:
        "Try keywords like Joola, Selkirk, Kamito, 16mm, or view all results.",
      relatedArticlesHeading: "Related Articles",
      mobileMenuAria: "Category menu",
      closeMenuAria: "Close menu",
    },
    footer: {
      hotlineLabel: "Hotline / WhatsApp",
      moitBadgeAria:
        "Registered with Vietnam Ministry of Industry and Trade (MOIT)",
      moitBadgeLine1: "REGISTERED WITH",
      moitBadgeLine2: "MOIT VIETNAM",
      codBadgeTitle: "Cash on Delivery",
      defaultShowrooms: [
        {
          name: "HCMC: 95 Tran Thien Chanh St., District 10",
          address: "HCMC: 95 Tran Thien Chanh St., District 10",
          phone: "+84.789.404.331",
          mapUrl: "https://maps.google.com/?q=10.7756,106.6679",
        },
        {
          name: "HCMC: 100 Hoa Lan St., Phu Nhuan District",
          address: "HCMC: 100 Hoa Lan St., Phu Nhuan District",
          phone: "+84.789.404.231",
          mapUrl: "https://maps.google.com/?q=10.7982,106.6897",
        },
        {
          name: "Hanoi: 466 Buoi St., Ngoc Ha",
          address: "Hanoi: 466 Buoi St., Ngoc Ha",
          phone: "+84.913.729.135",
          mapUrl: "https://maps.google.com/?q=21.0431,105.8092",
        },
      ] as SiteShowroomData[],
    },
    miniCart: {
      dialogAria: "Your shopping cart",
      heading: (count: number) => `CART (${count})`,
      closeAria: "Close cart",
      emptyMessage: "Your cart is currently empty.",
      returnToShop: "RETURN TO SHOP",
      removeItemAria: (name: string) => `Remove ${name} from cart`,
      decreaseQtyAria: (name: string) => `Decrease quantity of ${name}`,
      increaseQtyAria: (name: string) => `Increase quantity of ${name}`,
      bulkTier3Label: "Buy 3+ of the same variant",
      bulkTier5Label: "Buy 5+ of the same variant",
      giftBadge: "11Sport Gift",
      giftFreeSubtitle: "11Sport Free Gift: Free",
      bulkSavingsLabel: "Bulk Savings",
      subtotalLabel: "Subtotal:",
      viewCartCta: "VIEW CART",
      checkoutCta: "CHECKOUT",
    },
    floatingContact: {
      defaultBranches: [
        {
          name: "District 10 Showroom (HCMC)",
          address: "95 Tran Thien Chanh St., Ward 12, District 10",
          phone: "0789 404 331",
        },
        {
          name: "Phu Nhuan Showroom (HCMC)",
          address: "100 Hoa Lan St., Ward 2, Phu Nhuan District",
          phone: "0789 404 231",
        },
        {
          name: "Ngoc Ha Showroom (Hanoi)",
          address: "466 Buoi St., Ngoc Ha, Ba Dinh District",
          phone: "0913 729 135",
        },
      ] as LocalizedBranch[],
      consultClipboardMessage:
        "Hi 11Sport, I would like advice on choosing the right pickleball paddle!",
      callHotlineAria: (hotline: string) => `Call Hotline ${hotline}`,
      messengerAria: "Chat on Facebook Messenger",
      zaloButtonAria: "Choose a showroom for Zalo consultation",
      closeQuickContactAria: "Close quick contact menu",
      openQuickContactAria: "Open quick contact menu",
      backToTopAria: "Back to top",
      zaloDialogAria: "Choose a showroom for consultation",
      zaloDialogTitle: "Choose a Showroom on Zalo",
      zaloDialogSubtitle:
        "Specialists online 08:30 – 21:30 across all 3 11Sport showrooms",
      closeZaloAria: "Close Zalo dialog",
      chatZaloPill: "Chat on Zalo",
      copiedConsultLabel: "Consultation message copied!",
      copyConsultLabel: "Copy quick consultation message",
    },
    designSystem: {
      guaranteesHomeAria: "Official guarantees",
      categoryPills: [
        "100% AUTHENTIC",
        "1-TO-1 REPLACEMENT",
        "FREE SHIPPING",
      ] as const,
      distributorBannerAria: "Official authorized distributor certificates",
      distributorBannerAlt:
        "11Sport official authorized distributor certificates: Joola, Selkirk, Kamito, Facolos, CRBN",
      viewAll: "View All →",
      breadcrumbAria: "Breadcrumb",
      prevProductAria: "Previous product",
      nextProductAria: "Next product",
      editorialCalloutDefaultTitle: "11Sport Specialist Note",
      policyScopeNote:
        "(Applies to in-store purchases across all 3 11Sport showrooms and online orders placed on the 11Sport website)",
      policyCalloutTitle: "Customer Protection Guarantee",
      otherPoliciesAria: "Other 11Sport policies",
    },
    heroSlider: {
      emptyBannerAria: "11Sport promotional banner placeholder",
      heroSectionAria: "11Sport featured banners",
      noData: "No items available",
      prevBannerAria: "Previous banner",
      nextBannerAria: "Next banner",
      viewBannerAria: (index: number) => `View banner ${index}`,
    },
    brandCarousel: {
      defaultTitle: "Official Authorized Brands",
      prevBrandAria: "Previous brand",
      nextBrandAria: "Next brand",
    },
    articleGrid: {
      defaultTitle: "PICKLEBALL NEWS & GUIDES",
      readArticle: "Read Article →",
    },
    productCarousel: {
      prevProductAria: "Previous product",
      nextProductAria: "Next product",
      goToGroupAria: (index: number) => `Go to product group ${index}`,
    },
    productCard: {
      hoverImageAlt: (name: string) => `${name} — alternate view`,
      selectColorAria: (color: string, name: string) =>
        `Select ${color} color for ${name}`,
    },
    home: {
      metaTitle: "11Sport — Authentic Pickleball Paddles, Shoes & Accessories",
      metaDescription:
        "Authorized distributor of 100% authentic Joola, Selkirk, Kamito, Facolos & CRBN pickleball paddles, Asics & Skechers court shoes, and accessories. Bulk pricing from 3+, 1-to-1 replacement, and free nationwide shipping.",
      srH1:
        "11Sport — Authorized Pickleball Paddles, Shoes & Accessories Storefront",
      fallbackProductsTitle: "PRODUCTS",
      fallbackFeaturedTitle: "FEATURED PRODUCTS",
      fallbackPaddlesTitle: "PICKLEBALL PADDLES",
      fallbackBrandsTitle: "OFFICIAL AUTHORIZED BRANDS",
      noData: "No items available",
    },
    errorPage: {
      badge: "SERVICE INTERRUPTED · 11SPORT",
      heading: "We couldn't load this page",
      description:
        "We ran into a temporary server or network issue while loading this content. Please try again or return to the homepage.",
      retryCta: "TRY AGAIN",
      homeCta: "BACK TO HOME",
    },
    notFoundPage: {
      badge: "ERROR 404 · 11SPORT",
      heading: "Page not found",
      description:
        "This link may have changed or the product is no longer available at 11Sport. Return to the homepage or search for other pickleball paddles and accessories.",
      homeCta: "BACK TO HOME",
      searchCta: "SEARCH PRODUCTS",
    },
  },
} as const;
