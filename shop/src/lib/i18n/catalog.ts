import { formatPriceByCurrency, type CurrencyCode, type LocaleCode } from "@/lib/format";
import { localizeCategoryName } from "@/lib/i18n";

export interface CatalogPriceRange {
  id: "under-2m" | "2m-4m" | "over-4m";
  min: string;
  max: string;
}

export const CATALOG_PRICE_RANGES: readonly CatalogPriceRange[] = [
  { id: "under-2m", min: "", max: "2000000" },
  { id: "2m-4m", min: "2000000", max: "4000000" },
  { id: "over-4m", min: "4000000", max: "" },
] as const;

export function formatPriceRangeLabel(
  range: CatalogPriceRange,
  locale: LocaleCode,
  currency: CurrencyCode
): string {
  if (currency === "VND") {
    if (locale === "vi") {
      if (range.id === "under-2m") return "Dưới 2 triệu";
      if (range.id === "2m-4m") return "2 – 4 triệu";
      return "Trên 4 triệu";
    }
    if (range.id === "under-2m") return "Under 2,000,000₫";
    if (range.id === "2m-4m") return "2,000,000₫ – 4,000,000₫";
    return "Over 4,000,000₫";
  }

  const minFormatted = range.min
    ? formatPriceByCurrency(Number(range.min), currency)
    : "";
  const maxFormatted = range.max
    ? formatPriceByCurrency(Number(range.max), currency)
    : "";

  if (!minFormatted && maxFormatted) {
    return locale === "en" ? `Under ${maxFormatted}` : `Dưới ${maxFormatted}`;
  }
  if (minFormatted && maxFormatted) {
    return `${minFormatted} – ${maxFormatted}`;
  }
  return locale === "en" ? `Over ${minFormatted}` : `Trên ${minFormatted}`;
}

export function formatActivePriceLabel(
  priceMin: string,
  priceMax: string,
  matchedRange: CatalogPriceRange | undefined,
  locale: LocaleCode,
  currency: CurrencyCode
): string {
  const prefix = CATALOG_I18N[locale].catalog.pricePrefix;
  if (matchedRange) {
    return `${prefix}: ${formatPriceRangeLabel(matchedRange, locale, currency)}`;
  }

  const hasMin = Boolean(priceMin);
  const hasMax = Boolean(priceMax);
  const minVal = hasMin ? formatPriceByCurrency(Number(priceMin), currency) : "";
  const maxVal = hasMax ? formatPriceByCurrency(Number(priceMax), currency) : "";

  if (!hasMin && hasMax) {
    return locale === "en"
      ? `${prefix}: Under ${maxVal}`
      : `${prefix}: Dưới ${maxVal}`;
  }
  if (hasMin && !hasMax) {
    return locale === "en"
      ? `${prefix}: Over ${minVal}`
      : `${prefix}: Từ ${minVal} trở lên`;
  }
  return `${prefix}: ${minVal} – ${maxVal}`;
}

const VI_CATEGORY_SEGMENT_NAMES: Record<string, string> = {
  "vot-pickleball": "Vợt Pickleball",
  "thoi-trang": "Thời trang 11Sport",
  "giay-pickleball": "Giày Pickleball",
  "balo-tui-pickleball": "Túi - Balo",
  "phu-kien-pickleball": "Phụ kiện Pickleball",
  "bong-pickleball": "Bóng Pickleball",
  "combo-pikpro": "Combo Thời trang",
  "combo-11sport": "Combo Thời trang",
  "combo-mipik": "Combo Thời trang",
  "ao-pikpro": "Áo Pickleball",
  "ao-11sport": "Áo Pickleball",
  "ao-mipik": "Áo Pickleball",
  "non-pikpro": "Nón Pickleball",
  "non-11sport": "Nón Pickleball",
  "non-mipik": "Nón Pickleball",
  "tui-pikpro": "Túi Thời trang",
  "tui-11sport": "Túi Thời trang",
  "tui-mipik": "Túi Thời trang",
  "tat-pikpro": "Tất Pickleball",
  "tat-11sport": "Tất Pickleball",
  "tat-mipik": "Tất Pickleball",
  "giay-asics": "Giày Asics",
  "giay-skechers": "Giày Skechers",
  "giay-on": "Giày ON",
  "giay-kaitashi": "Giày Kaitashi",
};

export function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCategorySegmentLabel(
  slug: string,
  locale: LocaleCode
): string {
  const clean = slug.trim().toLowerCase();
  if (locale === "en") {
    return localizeCategoryName(formatSlugTitle(clean), "en", clean);
  }
  return VI_CATEGORY_SEGMENT_NAMES[clean] || formatSlugTitle(clean);
}

export const CATALOG_I18N = {
  vi: {
    common: {
      home: "Trang chủ",
      shop: "Cửa hàng",
      search: "Tìm kiếm",
      showMore: "Xem thêm",
      showLess: "Thu gọn",
      clearFilters: "Xóa bộ lọc",
      filters: "Bộ lọc",
      apply: "Áp dụng",
      clear: "Xóa",
    },
    catalog: {
      sortOptions: [
        { value: "featured", label: "Sắp xếp theo mức độ phổ biến" },
        { value: "bestseller", label: "Sắp xếp theo xếp hạng trung bình" },
        { value: "newest", label: "Sắp xếp theo mới nhất" },
        { value: "price_asc", label: "Sắp xếp theo giá: thấp đến cao" },
        { value: "price_desc", label: "Sắp xếp theo giá: cao đến thấp" },
      ],
      sortAriaLabel: "Sắp xếp sản phẩm",
      sortListboxAriaLabel: "Tùy chọn sắp xếp",
      subcategoriesAriaLabel: "Danh mục con",
      brandFilter: "Thương hiệu",
      brandPrefix: "Thương hiệu",
      brandListboxAriaLabel: "Lọc theo thương hiệu",
      allBrands: "Tất cả thương hiệu",
      priceFilter: "Khoảng giá",
      priceFiltered: "Đã lọc theo giá",
      pricePrefix: "Giá",
      priceListboxAriaLabel: "Lọc theo khoảng giá",
      allPrices: "Tất cả mức giá",
      sizeFilter: "Độ dày / Phiên bản",
      sizePrefix: "Phiên bản",
      sizeListboxAriaLabel: "Lọc theo độ dày và phiên bản",
      allSizes: "Tất cả phiên bản",
      colorFilter: "Màu sắc",
      colorPrefix: "Màu",
      colorListboxAriaLabel: "Lọc theo màu sắc",
      allColors: "Tất cả màu sắc",
      inStockOnlyChip: "Chỉ hiện còn hàng",
      removeFilterAriaLabel: (label: string) => `Xóa bộ lọc ${label}`,
      countLabel: (shown: number, total: number, totalPages: number) =>
        totalPages <= 1
          ? `Hiển thị tất cả ${total} kết quả`
          : `Hiển thị ${shown} / ${total} kết quả`,
      emptyTitle: "Không tìm thấy sản phẩm phù hợp",
      emptyDescription:
        "Vui lòng thử điều chỉnh bộ lọc hoặc quay về danh mục Vợt Pickleball 11Sport.",
      viewAllProducts: "Xem tất cả sản phẩm",
      paginationAriaLabel: "Phân trang sản phẩm",
      prevPageAriaLabel: "Trang trước",
      nextPageAriaLabel: "Trang tiếp theo",
      pageAriaLabel: (pageNum: number) => `Trang ${pageNum}`,
      mobileDrawerTitle: "Bộ lọc sản phẩm",
      mobileDrawerCloseAriaLabel: "Đóng bộ lọc",
    },
    seoBox: {
      defaultAriaLabel: "Thông tin chi tiết",
      showMore: "Xem thêm",
      showLess: "Thu gọn",
    },
    pdp: {
      defaultGiftReward: "Quà tặng 11Sport",
      giftBuyFallback: (minQuantity: number, giftName: string) =>
        `Mua ${minQuantity} sản phẩm → ${giftName}`,
      everyPaddleEyebrow: "Mỗi cây vợt",
      everyPaddleReward: "Tặng quấn cán, dán viền, bao vợt",
      selectVariantWarning:
        "Vui lòng chọn màu sắc / phân loại sản phẩm trước khi thêm vào giỏ.",
      additionalInfo: {
        brand: "Thương hiệu",
        category: "Danh mục",
        color: "Màu sắc",
        versionSize: "Độ dày / Phiên bản",
        sku: "Mã sản phẩm",
      },
      policyRows: [
        {
          label: "Quà tặng của 11Sport",
          value:
            "Tặng kèm phụ kiện chính hãng & ưu đãi quà tặng trực tiếp tại giỏ hàng.",
        },
        {
          label: "Phí giao hàng",
          value: "Miễn phí giao hàng toàn quốc (Freeship 100%).",
        },
        {
          label: "Bảo hành",
          value:
            "Bảo hành chính hãng theo tiêu chuẩn nhà sản xuất. Lỗi kỹ thuật đổi mới.",
        },
        {
          label: "Hình thức thanh toán",
          value:
            "Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng / VietQR.",
        },
      ],
      zoomProductAriaLabel: (name: string) => `Phóng to ảnh ${name}`,
      zoomButtonAriaLabel: "Phóng to hình ảnh sản phẩm",
      freeGiftBadge: "TẶNG ÁO",
      newBadge: "Mới",
      prevImageAriaLabel: "Ảnh trước",
      nextImageAriaLabel: "Ảnh tiếp theo",
      viewPhotoAriaLabel: (index: number, name: string) =>
        `Xem ảnh ${index} của ${name}`,
      photoAlt: (name: string, index: number) => `${name} - ảnh ${index}`,
      exclusiveOffersTitle: "✧ ƯU ĐÃI ĐỘC QUYỀN",
      bulkPricingHeading: "GIÁ MUA NHIỀU",
      bulkFromQty: (minQty: number) => `Từ ${minQty} sản phẩm`,
      perUnit: "/ sản phẩm",
      freeGiftsHeading: "QUÀ TẶNG KÈM THEO",
      offersAutoApplied: "Ưu đãi tự động áp dụng trong giỏ hàng",
      viewFreeGifts: "Xem quà tặng ↗",
      colorLabel: "Màu sắc:",
      notSelected: "Chưa chọn",
      clearSelection: "XÓA",
      selectColorAriaLabel: (color: string) => `Chọn màu ${color}`,
      versionLabel: "Phiên bản:",
      coreThicknessHint:
        "14mm: Thiên công, phản xạ nhanh · 16mm: Kiểm soát, êm tay",
      inStockWithCount: (count: number) => `Còn hàng (${count})`,
      outOfStock: "Tạm hết hàng",
      decreaseQtyAriaLabel: "Giảm số lượng",
      qtyAriaLabel: "Số lượng",
      increaseQtyAriaLabel: "Tăng số lượng",
      addToCartUpper: "THÊM VÀO GIỎ HÀNG",
      outOfStockUpper: "TẠM HẾT HÀNG",
      stickyAddShort: "THÊM GIỎ",
      stickyOutOfStockShort: "HẾT HÀNG",
      stickyDecreaseQtyAriaLabel: "Giảm số lượng thanh cố định",
      stickyIncreaseQtyAriaLabel: "Tăng số lượng thanh cố định",
      descriptionHeading: "MÔ TẢ",
      fallbackDescription: (name: string) =>
        `${name} chính hãng phân phối tại 11Sport với đầy đủ chế độ bảo hành từ nhà sản xuất.`,
      specsHeading: "Thông số kỹ thuật",
      additionalInfoHeading: "THÔNG TIN BỔ SUNG",
      relatedProductsHeading: "SẢN PHẨM TƯƠNG TỰ",
      lightbox: {
        zoomOutAria: "Thu nhỏ ảnh",
        zoomInAria: "Phóng to ảnh",
        zoomOutTitle: "Thu nhỏ (2x → 1x)",
        zoomInTitle: "Phóng to (2x)",
        exitFullscreen: "Thoát toàn màn hình",
        fullscreen: "Toàn màn hình",
        closeAria: "Đóng xem ảnh",
        closeTitle: "Đóng (Esc)",
        prevAria: "Ảnh trước trong trình xem",
        nextAria: "Ảnh tiếp theo trong trình xem",
      },
    },
    search: {
      metaTitle: "Tìm kiếm sản phẩm",
      metaDescription:
        "Tìm kiếm dụng cụ Pickleball, giày thể thao và bài viết tại 11Sport.",
      heroTitle: "TÌM KIẾM",
      breadcrumbResults: (q: string) => `Kết quả cho "${q}"`,
      headingWithQuery: (q: string) => `KẾT QUẢ TÌM KIẾM CHO: ${q.toUpperCase()}`,
      headingDefault: "TÌM KIẾM SẢN PHẨM & BÀI VIẾT TẠI 11SPORT",
      tabsAriaLabel: "Loại kết quả tìm kiếm",
      productsTab: (count: number) => `Sản phẩm (${count})`,
      articlesTab: (count: number) => `Bài viết (${count})`,
      noArticlesHeading: (q: string) =>
        q
          ? `Không tìm thấy bài viết nào cho từ khóa "${q}"`
          : "Không tìm thấy bài viết nào",
      noArticlesBody:
        "Bạn có thể xem toàn bộ tin tức & hướng dẫn chọn đồ tại chuyên mục Tin tức 11Sport.",
      viewAllArticles: "XEM TẤT CẢ BÀI VIẾT",
    },
    pages: {
      shop: {
        metaTitle: "Cửa Hàng Vợt, Giày & Phụ Kiện Pickleball Chính Hãng",
        metaDescription:
          "Danh mục toàn bộ sản phẩm Vợt Pickleball Joola, Selkirk, Kamito, Facolos, CRBN, Giày Asics, Skechers và phụ kiện chính hãng 100%.",
        srHeadingDefault: "Tất Cả Sản Phẩm Pickleball Chính Hãng — 11Sport",
        srHeadingSearch: (q: string) => `Kết quả tìm kiếm: "${q}"`,
      },
      category: {
        metaTitle: (name: string) => `${name} Chính Hãng`,
        metaDescription: (name: string) =>
          `Mua ${name} chính hãng. Giá tốt, lỗi 1 đổi 1, freeship toàn quốc.`,
        srHeading: (name: string) => `${name} Chính Hãng — 11Sport`,
        seoBoxTitle: (name: string) => `Thông tin về ${name}`,
      },
      nestedCategory: {
        fallbackTitle: "Danh Mục Sản Phẩm Pickleball",
        metaDescription: (title: string) =>
          `Khám phá ${title} chính hãng 100%, lỗi 1 đổi 1, freeship toàn quốc.`,
      },
      brand: {
        metaTitle: (brandName: string) => `Thương hiệu ${brandName} Chính Hãng`,
        metaDescription: (brandName: string) =>
          `Sản phẩm ${brandName} chính hãng. Bảo hành uy tín, lỗi 1 đổi 1, freeship toàn quốc.`,
        breadcrumbBrand: (brandName: string) => `Thương hiệu ${brandName}`,
        srHeading: (brandName: string) => `${brandName} Chính Hãng — 11Sport`,
        seoBoxTitle: (brandName: string) =>
          `Giới thiệu thương hiệu ${brandName}`,
      },
      product: {
        notFoundMetaTitle: "Chi tiết sản phẩm",
        fallbackShortDescription:
          "Thông tin sản phẩm đang được đồng bộ từ hệ thống 11Sport.",
        metaTitle: (name: string) => `${name} Chính Hãng`,
        metaDescription: (name: string) =>
          `Mua ${name} chính hãng tại 11Sport. Bảo hành đầy đủ, lỗi 1 đổi 1, freeship toàn quốc.`,
        jsonLdFallbackDesc: (name: string) =>
          `${name} chính hãng phân phối tại 11Sport.`,
        brandPaddleBreadcrumb: (brandName: string) =>
          `Vợt Pickleball ${brandName}`,
        brandShoeBreadcrumb: (brandName: string) =>
          `Giày Pickleball ${brandName}`,
      },
    },
  },
  en: {
    common: {
      home: "Home",
      shop: "Shop",
      search: "Search",
      showMore: "Show More",
      showLess: "Show Less",
      clearFilters: "Clear Filters",
      filters: "Filters",
      apply: "Apply",
      clear: "Clear",
    },
    catalog: {
      sortOptions: [
        { value: "featured", label: "Sort by Popularity" },
        { value: "bestseller", label: "Sort by Average Rating" },
        { value: "newest", label: "Sort by Latest" },
        { value: "price_asc", label: "Sort by Price: Low to High" },
        { value: "price_desc", label: "Sort by Price: High to Low" },
      ],
      sortAriaLabel: "Sort products",
      sortListboxAriaLabel: "Sort options",
      subcategoriesAriaLabel: "Subcategories",
      brandFilter: "Brand",
      brandPrefix: "Brand",
      brandListboxAriaLabel: "Filter by brand",
      allBrands: "All Brands",
      priceFilter: "Price Range",
      priceFiltered: "Price Filtered",
      pricePrefix: "Price",
      priceListboxAriaLabel: "Filter by price range",
      allPrices: "All Prices",
      sizeFilter: "Core Thickness / Size",
      sizePrefix: "Version / Size",
      sizeListboxAriaLabel: "Filter by core thickness and size",
      allSizes: "All Versions & Sizes",
      colorFilter: "Color",
      colorPrefix: "Color",
      colorListboxAriaLabel: "Filter by color",
      allColors: "All Colors",
      inStockOnlyChip: "In Stock Only",
      removeFilterAriaLabel: (label: string) => `Remove filter: ${label}`,
      countLabel: (shown: number, total: number, totalPages: number) => {
        if (totalPages <= 1) {
          if (total === 0) return "Showing 0 results";
          if (total === 1) return "Showing 1 result";
          return `Showing all ${total} results`;
        }
        return `Showing ${shown} of ${total} ${total === 1 ? "result" : "results"}`;
      },
      emptyTitle: "No matching products found",
      emptyDescription:
        "Try adjusting or clearing your filters, or browse all 11Sport Pickleball Paddles.",
      viewAllProducts: "View All Products",
      paginationAriaLabel: "Product pagination",
      prevPageAriaLabel: "Previous page",
      nextPageAriaLabel: "Next page",
      pageAriaLabel: (pageNum: number) => `Page ${pageNum}`,
      mobileDrawerTitle: "Product Filters",
      mobileDrawerCloseAriaLabel: "Close filters",
    },
    seoBox: {
      defaultAriaLabel: "Detailed Information",
      showMore: "Show More",
      showLess: "Show Less",
    },
    pdp: {
      defaultGiftReward: "11Sport Free Gift",
      giftBuyFallback: (minQuantity: number, giftName: string) =>
        `Buy ${minQuantity}+ items → ${giftName}`,
      everyPaddleEyebrow: "Every paddle",
      everyPaddleReward: "Free Overgrip, Edge Tape & Paddle Cover",
      selectVariantWarning:
        "Please select a color and version / size before adding to cart.",
      additionalInfo: {
        brand: "Brand",
        category: "Category",
        color: "Color",
        versionSize: "Core Thickness / Size",
        sku: "SKU",
      },
      policyRows: [
        {
          label: "11Sport Free Gifts",
          value:
            "Includes authentic bonus accessories & automatic free gifts applied directly in your cart.",
        },
        {
          label: "Shipping",
          value: "Free Nationwide Shipping (100% free delivery).",
        },
        {
          label: "Official Warranty",
          value:
            "Official manufacturer warranty with 1-to-1 replacement for verified manufacturing defects.",
        },
        {
          label: "Payment Methods",
          value: "Cash on Delivery (COD), Bank Transfer / VietQR.",
        },
      ],
      zoomProductAriaLabel: (name: string) => `Zoom image of ${name}`,
      zoomButtonAriaLabel: "Zoom product image",
      freeGiftBadge: "FREE SHIRT",
      newBadge: "New",
      prevImageAriaLabel: "Previous image",
      nextImageAriaLabel: "Next image",
      viewPhotoAriaLabel: (index: number, name: string) =>
        `View image ${index} of ${name}`,
      photoAlt: (name: string, index: number) => `${name} — photo ${index}`,
      exclusiveOffersTitle: "✧ EXCLUSIVE OFFERS",
      bulkPricingHeading: "BULK PRICING",
      bulkFromQty: (minQty: number) => `Buy ${minQty}+ items`,
      perUnit: "/ unit",
      freeGiftsHeading: "FREE GIFTS",
      offersAutoApplied: "Offers are applied automatically in your cart",
      viewFreeGifts: "View Free Gifts ↗",
      colorLabel: "Color:",
      notSelected: "Not selected",
      clearSelection: "CLEAR",
      selectColorAriaLabel: (color: string) => `Select color ${color}`,
      versionLabel: "Version / Size:",
      coreThicknessHint:
        "14mm (Power): Fast pop & quick hands · 16mm (Control): Plush feel & stability",
      inStockWithCount: (count: number) => `In Stock (${count})`,
      outOfStock: "Out of Stock",
      decreaseQtyAriaLabel: "Decrease quantity",
      qtyAriaLabel: "Quantity",
      increaseQtyAriaLabel: "Increase quantity",
      addToCartUpper: "ADD TO CART",
      outOfStockUpper: "OUT OF STOCK",
      stickyAddShort: "ADD",
      stickyOutOfStockShort: "SOLD OUT",
      stickyDecreaseQtyAriaLabel: "Decrease quantity",
      stickyIncreaseQtyAriaLabel: "Increase quantity",
      descriptionHeading: "DESCRIPTION",
      fallbackDescription: (name: string) =>
        `100% authentic ${name} distributed by 11Sport with full official manufacturer warranty.`,
      specsHeading: "Specifications",
      additionalInfoHeading: "ADDITIONAL INFORMATION",
      relatedProductsHeading: "RELATED PRODUCTS",
      lightbox: {
        zoomOutAria: "Zoom out",
        zoomInAria: "Zoom in",
        zoomOutTitle: "Zoom out (2x → 1x)",
        zoomInTitle: "Zoom in (2x)",
        exitFullscreen: "Exit fullscreen",
        fullscreen: "Fullscreen",
        closeAria: "Close image viewer",
        closeTitle: "Close (Esc)",
        prevAria: "Previous image",
        nextAria: "Next image",
      },
    },
    search: {
      metaTitle: "Search Products & Articles",
      metaDescription:
        "Search authentic pickleball paddles, court shoes, accessories, and guides at 11Sport.",
      heroTitle: "SEARCH",
      breadcrumbResults: (q: string) => `Results for "${q}"`,
      headingWithQuery: (q: string) => `SEARCH RESULTS FOR: ${q.toUpperCase()}`,
      headingDefault: "SEARCH PRODUCTS & ARTICLES AT 11SPORT",
      tabsAriaLabel: "Search result categories",
      productsTab: (count: number) => `Products (${count})`,
      articlesTab: (count: number) => `Articles (${count})`,
      noArticlesHeading: (q: string) =>
        q ? `No articles found for "${q}"` : "No articles found",
      noArticlesBody:
        "Browse all pickleball guides, paddle reviews, and news on the 11Sport Blog.",
      viewAllArticles: "VIEW ALL ARTICLES",
    },
    pages: {
      shop: {
        metaTitle: "Shop Authentic Pickleball Paddles, Shoes & Accessories",
        metaDescription:
          "Browse 100% authentic Joola, Selkirk, Kamito, Facolos & CRBN pickleball paddles, Asics & Skechers court shoes, and accessories at 11Sport.",
        srHeadingDefault: "All Authentic Pickleball Products — 11Sport",
        srHeadingSearch: (q: string) => `Search Results: "${q}"`,
      },
      category: {
        metaTitle: (name: string) => `Authentic ${name}`,
        metaDescription: (name: string) =>
          `Shop 100% authentic ${name} at 11Sport. Official warranty, 1-to-1 replacement, and free nationwide shipping.`,
        srHeading: (name: string) => `Authentic ${name} — 11Sport`,
        seoBoxTitle: (name: string) => `About ${name}`,
      },
      nestedCategory: {
        fallbackTitle: "Pickleball Product Categories",
        metaDescription: (title: string) =>
          `Explore 100% authentic ${title} at 11Sport with 1-to-1 replacement and free nationwide shipping.`,
      },
      brand: {
        metaTitle: (brandName: string) => `Authentic ${brandName} Gear`,
        metaDescription: (brandName: string) =>
          `Shop 100% authentic ${brandName} products at 11Sport. Official warranty, 1-to-1 replacement, and free nationwide shipping.`,
        breadcrumbBrand: (brandName: string) => `${brandName} Brand`,
        srHeading: (brandName: string) => `Authentic ${brandName} — 11Sport`,
        seoBoxTitle: (brandName: string) => `About ${brandName}`,
      },
      product: {
        notFoundMetaTitle: "Product Details",
        fallbackShortDescription:
          "Product details are currently syncing from the 11Sport catalog.",
        metaTitle: (name: string) => `${name} — 100% Authentic`,
        metaDescription: (name: string) =>
          `Shop 100% authentic ${name} at 11Sport. Official warranty, 1-to-1 replacement, and free nationwide shipping.`,
        jsonLdFallbackDesc: (name: string) =>
          `100% authentic ${name} distributed by 11Sport.`,
        brandPaddleBreadcrumb: (brandName: string) =>
          `${brandName} Pickleball Paddles`,
        brandShoeBreadcrumb: (brandName: string) =>
          `${brandName} Pickleball Shoes`,
      },
    },
  },
} as const;
