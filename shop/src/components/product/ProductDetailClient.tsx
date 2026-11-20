"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Gift,
  Minus,
  PhoneCall,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { calcDiscountPercent, formatVND } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import type {
  ProductDetail,
  ProductListItem,
  ReviewListResponse,
} from "@/types/storefront";

interface ProductDetailClientProps {
  product: ProductDetail;
  relatedProducts: ProductListItem[];
  initialReviews: ReviewListResponse | null;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  initialReviews,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  // Unique colors & sizes
  const colorOptions = useMemo(() => {
    const map = new Map<
      string,
      { color: string; hex: string; imageUrl?: string }
    >();
    for (const v of variants) {
      if (v.color && !map.has(v.color)) {
        map.set(v.color, {
          color: v.color,
          hex: v.colorHexes?.[0] || "#334155",
          imageUrl: v.imageUrl,
        });
      }
    }
    return Array.from(map.values());
  }, [variants]);

  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const v of variants) {
      if (v.size) set.add(v.size);
    }
    return Array.from(set);
  }, [variants]);

  const firstInStockVariant =
    variants.find((v) => v.inStock) || variants[0] || null;

  const [selectedColor, setSelectedColor] = useState<string>(
    firstInStockVariant?.color || colorOptions[0]?.color || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    firstInStockVariant?.size || sizeOptions[0] || ""
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Gallery images
  const galleryImages = useMemo(() => {
    const urls: string[] = [];
    if (product.thumbnailUrl) urls.push(product.thumbnailUrl);
    for (const img of product.images ?? []) {
      if (img.url && !urls.includes(img.url)) urls.push(img.url);
    }
    for (const v of variants) {
      if (v.imageUrl && !urls.includes(v.imageUrl)) urls.push(v.imageUrl);
    }
    return urls;
  }, [product.thumbnailUrl, product.images, variants]);

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [descExpanded, setDescExpanded] = useState<boolean>(false);

  // Reviews state
  const [reviewsData, setReviewsData] = useState<ReviewListResponse | null>(
    initialReviews
  );
  const [starFilter, setStarFilter] = useState<number | "ALL" | "IMAGE">("ALL");
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find(
        (v) =>
          (!selectedColor || v.color === selectedColor) &&
          (!selectedSize || v.size === selectedSize)
      ) ||
      variants.find((v) => v.color === selectedColor) ||
      variants[0]
    );
  }, [variants, selectedColor, selectedSize]);

  const handleSelectColor = (color: string, variantImageUrl?: string) => {
    setSelectedColor(color);
    if (variantImageUrl) {
      const idx = galleryImages.indexOf(variantImageUrl);
      if (idx >= 0) setActiveImageIdx(idx);
    }
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const activePrice =
    selectedVariant?.effectiveSellingPrice ?? product.sellingPrice;
  const activeComparePrice =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const discountPercent = calcDiscountPercent(activePrice, activeComparePrice);
  const activeStock = selectedVariant
    ? selectedVariant.stockAvailable
    : product.stockAvailable ?? 0;
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const activeSku = selectedVariant?.variantCode || product.code;
  const activeImage =
    galleryImages[activeImageIdx] ||
    selectedVariant?.imageUrl ||
    product.thumbnailUrl ||
    "";

  const handleAddToCart = (redirectCheckout = false) => {
    if (!isInStock) return;
    addItem({
      variantId: selectedVariant?.variantKey || product._id,
      productId: product._id,
      slug: product.slug,
      name: product.name,
      brandName: product.brand?.name || "11 Sport",
      sku: activeSku,
      imageUrl: activeImage,
      colorName: selectedVariant?.color || selectedColor || undefined,
      sizeName: selectedVariant?.size || selectedSize || undefined,
      price: activePrice,
      compareAtPrice: activeComparePrice,
      quantity,
      maxStock: activeStock || undefined,
    });
    if (redirectCheckout) {
      router.push("/checkout");
    }
  };

  const handleFilterReviews = async (filter: number | "ALL" | "IMAGE") => {
    setStarFilter(filter);
    try {
      const res = await apiFetch<ReviewListResponse>("/public/reviews", {
        params: {
          productId: product._id,
          rating: typeof filter === "number" ? filter : undefined,
          hasImages: filter === "IMAGE" ? true : undefined,
          page: 1,
          limit: 10,
        },
      });
      setReviewsData(res);
    } catch {
      // Keep current list on error
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewFeedback({
        type: "error",
        text: "Vui lòng nhập nội dung đánh giá.",
      });
      return;
    }
    setReviewSubmitting(true);
    setReviewFeedback(null);
    try {
      const res = await apiFetch<{ message?: string }>("/public/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          rating: reviewRating,
          customerName: reviewName.trim() || "Khách hàng 11 Sport",
          comment: reviewComment.trim(),
        }),
      });
      setReviewFeedback({
        type: "success",
        text:
          res?.message ||
          "Đánh giá của bạn đã được ghi nhận và đang chờ duyệt.",
      });
      setReviewComment("");
      setReviewName("");
      setShowReviewForm(false);
    } catch {
      setReviewFeedback({
        type: "error",
        text: "Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const tierPricing = product.promotions?.tierPricing ?? [];
  const giftPromotions = product.promotions?.giftPromotions ?? [];
  const hasPromotions = tierPricing.length > 0 || giftPromotions.length > 0;

  return (
    <div className="space-y-10 pb-24 md:pb-0">
      {/* Top 2-Column Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left: Gallery (50% -> 6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-square rounded-2xl bg-surface-muted border border-surface-border overflow-hidden group">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-ink-muted">
                11 SPORT
              </div>
            )}

            {galleryImages.length > 0 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Phóng to ảnh sản phẩm"
                className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white/90 text-ink-primary shadow-md hover:bg-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ZoomIn className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {galleryImages.length > 1 && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-ink-primary/75 text-white font-mono text-xs font-semibold">
                {activeImageIdx + 1}/{galleryImages.length}
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`Xem ảnh ${idx + 1}`}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-surface-muted ${
                    idx === activeImageIdx
                      ? "border-brand-primary"
                      : "border-surface-border hover:border-ink-muted"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} - ảnh ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (50% -> 6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Brand & Rating */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {product.brand && (
              <Link
                href={`/thuong-hieu/${product.brand.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline"
              >
                Thương hiệu: {product.brand.name}
              </Link>
            )}

            {typeof product.ratingCount === "number" &&
              product.ratingCount > 0 && (
                <a
                  href="#danh-gia"
                  className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-brand-primary"
                >
                  <Star
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="font-mono font-bold">
                    {(product.ratingAvg ?? 5).toFixed(1)}
                  </span>
                  <span className="text-ink-muted">
                    ({product.ratingCount} đánh giá)
                  </span>
                </a>
              )}
          </div>

          {/* Single H1 */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[34px] font-extrabold text-ink-primary leading-tight">
            {product.name}
          </h1>

          {/* SKU & Stock Status */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="text-ink-muted">
              SKU:{" "}
              <strong className="font-mono text-ink-primary">{activeSku}</strong>
            </span>
            <span className="text-surface-border">|</span>
            {isInStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-semantic-success-bg text-semantic-success-text font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                {activeStock > 0
                  ? `Còn ${activeStock} sản phẩm`
                  : "Còn hàng"}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-semantic-danger-bg text-semantic-danger-text font-semibold text-xs">
                Tạm hết hàng
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span
              className={`font-mono font-bold text-2xl sm:text-3xl ${
                discountPercent > 0 ? "text-accent-hot" : "text-ink-primary"
              }`}
            >
              {formatVND(activePrice)}
            </span>
            {discountPercent > 0 && activeComparePrice && (
              <>
                <span className="font-mono text-base line-through text-ink-muted">
                  {formatVND(activeComparePrice)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-accent-hot text-white font-mono text-xs font-bold">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Promotions Box */}
          {hasPromotions && (
            <div className="rounded-xl bg-brand-tint border border-brand-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                <Gift className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Ưu đãi mua nhiều &amp; Quà tặng</span>
              </div>
              <ul className="space-y-1 text-sm text-ink-secondary">
                {tierPricing.map((rule, idx) => (
                  <li key={idx}>
                    •{" "}
                    {rule.label ||
                      `Mua từ ${rule.minQty} sản phẩm ${
                        rule.discountPercent
                          ? `giảm thêm ${rule.discountPercent}%`
                          : rule.discountAmount
                          ? `giảm ${formatVND(rule.discountAmount)}`
                          : ""
                      }`}
                  </li>
                ))}
                {giftPromotions.map((gift, idx) => (
                  <li key={gift._id || idx}>
                    • {gift.title}
                    {gift.giftProductName ? `: ${gift.giftProductName}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Swatches */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink-secondary">
                Màu sắc:{" "}
                <strong className="text-ink-primary">{selectedColor}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((col) => {
                  const isSelected = col.color === selectedColor;
                  return (
                    <button
                      key={col.color}
                      type="button"
                      onClick={() => handleSelectColor(col.color, col.imageUrl)}
                      aria-label={`Chọn màu ${col.color}`}
                      aria-pressed={isSelected}
                      className={`min-w-[44px] min-h-[44px] px-3 rounded-lg border inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-brand-primary bg-brand-tint text-brand-primary font-semibold"
                          : "border-surface-border bg-white text-ink-primary hover:border-brand-primary"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-surface-border shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Chips */}
          {sizeOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink-secondary">
                Kích thước / Phiên bản:{" "}
                <strong className="text-ink-primary">{selectedSize}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => {
                  const matchingVariant = variants.find(
                    (v) =>
                      v.size === size &&
                      (!selectedColor || v.color === selectedColor)
                  );
                  const available = matchingVariant
                    ? matchingVariant.inStock
                    : true;
                  const isSelected = size === selectedSize;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={isSelected}
                      className={`min-w-[48px] min-h-[44px] px-3.5 rounded-lg border font-mono text-sm font-semibold transition-colors ${
                        !available
                          ? "border-surface-border bg-surface-muted text-ink-muted opacity-50 line-through cursor-not-allowed"
                          : isSelected
                          ? "border-brand-primary bg-brand-tint text-brand-primary"
                          : "border-surface-border bg-white text-ink-primary hover:border-brand-primary"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Desktop CTAs */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-secondary">
                Số lượng:
              </span>
              <div className="inline-flex items-center border border-surface-border rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                  className="w-11 h-11 inline-flex items-center justify-center text-ink-primary hover:bg-surface-muted rounded-l-lg"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-12 text-center font-mono text-base font-bold text-ink-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      activeStock > 0 ? Math.min(activeStock, q + 1) : q + 1
                    )
                  }
                  aria-label="Tăng số lượng"
                  className="w-11 h-11 inline-flex items-center justify-center text-ink-primary hover:bg-surface-muted rounded-r-lg"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!isInStock}
                onClick={() => handleAddToCart(false)}
                className="min-h-[48px] px-5 rounded-lg border-2 border-brand-primary text-brand-primary hover:bg-brand-tint font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>{isInStock ? "THÊM VÀO GIỎ" : "TẠM HẾT HÀNG"}</span>
              </button>

              <button
                type="button"
                disabled={!isInStock}
                onClick={() => handleAddToCart(true)}
                className="min-h-[48px] px-5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInStock ? "MUA NGAY" : "TẠM HẾT HÀNG"}
              </button>
            </div>
          </div>

          {/* 4-row Quick Policy Table */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle divide-y divide-surface-border text-sm">
            <div className="p-3 flex items-center gap-3">
              <ShieldCheck
                className="w-5 h-5 text-brand-primary shrink-0"
                aria-hidden="true"
              />
              <span className="text-ink-secondary">
                <strong className="text-ink-primary">Chính hãng 100%:</strong>{" "}
                Đầy đủ tem bảo hành nhà phân phối
              </span>
            </div>
            <div className="p-3 flex items-center gap-3">
              <RefreshCw
                className="w-5 h-5 text-brand-primary shrink-0"
                aria-hidden="true"
              />
              <span className="text-ink-secondary">
                <strong className="text-ink-primary">Đổi trả 7 ngày:</strong>{" "}
                Hỗ trợ đổi size / mẫu nguyên tem mác
              </span>
            </div>
            <div className="p-3 flex items-center gap-3">
              <Truck
                className="w-5 h-5 text-brand-primary shrink-0"
                aria-hidden="true"
              />
              <span className="text-ink-secondary">
                <strong className="text-ink-primary">Freeship toàn quốc:</strong>{" "}
                Miễn phí giao hàng cho đơn từ 500.000₫
              </span>
            </div>
            <div className="p-3 flex items-center gap-3">
              <PhoneCall
                className="w-5 h-5 text-brand-primary shrink-0"
                aria-hidden="true"
              />
              <span className="text-ink-secondary">
                <strong className="text-ink-primary">Tư vấn kỹ thuật:</strong>{" "}
                Hotline{" "}
                <a
                  href="tel:0900000011"
                  className="font-mono font-bold text-brand-primary hover:underline"
                >
                  0900.000.011
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <section className="lg:col-span-7 rounded-2xl border border-surface-border bg-white p-5 sm:p-6 space-y-4">
          <h2 className="text-xl font-bold text-ink-primary">
            Mô tả chi tiết sản phẩm
          </h2>
          {product.descriptionHtml ? (
            <>
              <div
                className={`relative overflow-hidden ${
                  descExpanded ? "max-h-none" : "max-h-[260px]"
                }`}
              >
                <div
                  className="prose prose-slate max-w-none text-sm sm:text-base text-ink-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
                {!descExpanded && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent"
                  />
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setDescExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-lg border border-surface-border bg-surface-subtle hover:border-brand-primary text-sm font-semibold text-ink-primary"
                >
                  <span>{descExpanded ? "Thu gọn" : "Xem thêm"}</span>
                  {descExpanded ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-secondary leading-relaxed">
              {product.shortDescription ||
                `${product.name} được phân phối chính hãng tại hệ thống 11 Sport.`}
            </p>
          )}
        </section>

        <section className="lg:col-span-5 rounded-2xl border border-surface-border bg-white p-5 sm:p-6 space-y-4">
          <h2 className="text-xl font-bold text-ink-primary">
            Thông số kỹ thuật
          </h2>
          {product.specs && product.specs.length > 0 ? (
            <dl className="divide-y divide-surface-border text-sm">
              {product.specs.map((spec, idx) => (
                <div
                  key={`${spec.label}-${idx}`}
                  className="py-2.5 flex items-start justify-between gap-4"
                >
                  <dt className="text-ink-muted font-medium">{spec.label}</dt>
                  <dd className="text-ink-primary font-semibold text-right">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-ink-muted">
              Đang cập nhật thông số kỹ thuật chi tiết.
            </p>
          )}
        </section>
      </div>

      {/* Reviews Section */}
      <section
        id="danh-gia"
        className="rounded-2xl border border-surface-border bg-white p-5 sm:p-6 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">
              Đánh giá sản phẩm
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Điểm trung bình:{" "}
              <strong className="font-mono text-ink-primary">
                {(
                  reviewsData?.summary?.ratingAvg ??
                  product.ratingAvg ??
                  5
                ).toFixed(1)}
                /5 ★
              </strong>{" "}
              (
              {reviewsData?.summary?.ratingCount ?? product.ratingCount ?? 0}{" "}
              đánh giá)
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="min-h-[44px] px-5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors"
          >
            Viết đánh giá
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "ALL", label: "Tất cả" },
              { key: 5, label: "5 ★" },
              { key: 4, label: "4 ★" },
              { key: 3, label: "3 ★" },
              { key: 2, label: "2 ★" },
              { key: 1, label: "1 ★" },
              { key: "IMAGE", label: "Có hình ảnh" },
            ] as const
          ).map((tab) => {
            const active = starFilter === tab.key;
            return (
              <button
                key={String(tab.key)}
                type="button"
                onClick={() => handleFilterReviews(tab.key)}
                className={`min-h-[44px] px-3.5 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? "border-brand-primary bg-brand-tint text-brand-primary"
                    : "border-surface-border bg-white text-ink-secondary hover:border-brand-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {reviewFeedback && (
          <div
            role="status"
            className={`p-3.5 rounded-lg text-sm font-medium ${
              reviewFeedback.type === "success"
                ? "bg-semantic-success-bg text-semantic-success-text"
                : "bg-semantic-danger-bg text-semantic-danger-text"
            }`}
          >
            {reviewFeedback.text}
          </div>
        )}

        {/* Write Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-ink-primary">
                Chọn số sao:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`Đánh giá ${star} sao`}
                    className="w-11 h-11 inline-flex items-center justify-center rounded-lg hover:bg-white"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-ink-muted"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Tên của bạn (tuỳ chọn)"
                className="h-11 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              className="w-full p-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-primary"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="min-h-[44px] px-4 rounded-lg border border-surface-border bg-white text-sm font-semibold text-ink-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="min-h-[44px] px-5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold disabled:opacity-50"
              >
                {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        )}

        {/* Review List */}
        {!reviewsData || reviewsData.data.length === 0 ? (
          <p className="text-sm text-ink-muted py-4">
            Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!
          </p>
        ) : (
          <ul className="divide-y divide-surface-border">
            {reviewsData.data.map((rev) => (
              <li key={rev._id} className="py-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink-primary">
                      {rev.customerName}
                    </span>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-semantic-success-bg text-semantic-success-text text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink-muted">
                    {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-surface-border"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="text-sm text-ink-secondary leading-relaxed">
                  {rev.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl lg:text-[26px] font-bold text-ink-primary">
            Sản phẩm tương tự
          </h2>
          <ProductCarousel products={relatedProducts} />
        </section>
      )}

      {/* Sticky Mobile CTA Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-surface-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-sticky grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!isInStock}
          onClick={() => handleAddToCart(false)}
          className="min-h-[48px] rounded-lg border-2 border-brand-primary text-brand-primary font-bold text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>{isInStock ? "Thêm vào giỏ" : "Hết hàng"}</span>
        </button>
        <button
          type="button"
          disabled={!isInStock}
          onClick={() => handleAddToCart(true)}
          className="min-h-[48px] rounded-lg bg-brand-primary text-white font-bold text-sm inline-flex items-center justify-center disabled:opacity-50"
        >
          {isInStock ? "Mua ngay" : "Tạm hết hàng"}
        </button>
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-ink-primary/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Phóng to ảnh sản phẩm"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng phóng to ảnh"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-ink-primary flex items-center justify-center shadow-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setActiveImageIdx(
                  (i) => (i - 1 + galleryImages.length) % galleryImages.length
                )
              }
              aria-label="Ảnh trước"
              className="absolute left-4 w-11 h-11 rounded-full bg-white text-ink-primary flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          <div className="relative w-full max-w-3xl aspect-square rounded-2xl overflow-hidden bg-white">
            <Image
              src={galleryImages[activeImageIdx]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>

          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setActiveImageIdx((i) => (i + 1) % galleryImages.length)
              }
              aria-label="Ảnh tiếp theo"
              className="absolute right-4 w-11 h-11 rounded-full bg-white text-ink-primary flex items-center justify-center shadow-md"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
