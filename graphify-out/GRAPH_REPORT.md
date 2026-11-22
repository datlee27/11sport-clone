# Graph Report - 11sport-IT  (2026-11-22)

## Corpus Check
- 294 files · ~572,465 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 5, .example 4, .css 3)

## Summary
- 2790 nodes · 7016 edges · 123 communities (111 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1dfc782f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_lucide_react
- cms/src/lib/api.ts
- apiRequest
- ordersCustomers.ts
- web/src/lib/api.ts
- seed.ts
- StaffModule.tsx
- web/src/app/page.tsx
- web/src/components/MyAttendanceCalendar.tsx
- db.ts
- seedWebStorefront.ts
- tin-tuc/[slug]/page.tsx
- exports.ts
- productsInventory.ts
- shop/package.json
- ProductDetailClient.tsx
- web-models.test.ts
- InventoryModule.tsx
- ApiError
- imports.ts
- types/storefront.ts
- PosTab.tsx
- cms/package.json
- cms/src/components/MyAttendanceCalendar.tsx
- 2. Wireframe & Spec Storefront (`shop/`)
- middleware/auth.ts
- web/package.json
- productCode.ts
- InventoryTab.tsx
- ProductCatalogModule.tsx
- shop/src/app/page.tsx
- seo.ts
- recodeProducts.ts
- server/package.json
- runner.ts
- publicStorefront.ts
- web/src/components/HeaderAttendanceBar.tsx
- AttendanceTimesheetModule.tsx
- services.ts
- danh-muc/[slug]/page.tsx
- ref_next
- reports.ts
- ocr.ts
- 5. Đặc tả Component cốt lõi (`shop/`)
- Đặc tả yêu cầu: Hệ thống Chấm công & Quản trị Nhân sự (HRM & Shift Handover)
- shifts.ts
- attendance.ts
- attendanceTimesheet.ts
- promotions.ts
- normalizeToCompactUpperCode
- Đặc tả Yêu cầu Nghiệp vụ: Website Bán hàng 11 Sport (`shop/`) & CMS Quản lý Website (`cms/`)
- customerAuth.ts
- Hướng dẫn Hạ tầng & Triển khai Storefront (`shop/`) - 11 Sport
- CameraScannerModal.tsx
- app.ts
- leaveRequests.ts
- staffImportParser.ts
- cms/src/components/BarcodeLabelModal.tsx
- compilerOptions
- Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0
- Repository
- compilerOptions
- web/src/components/BarcodeLabelModal.tsx
- compilerOptions
- excel.ts
- 2. Danh sách Endpoints
- windowsPrinter.ts
- PosServiceSection.tsx
- TagCheckScannerModal.tsx
- cms/src/app/api/printers/route.ts
- 3.1 Public Storefront API (`/api/v1/public/*`)
- 11Sport — Hệ thống Quản lý Bán hàng (POS), Kho vận & Quản trị (CMS)
- holidays.ts
- services
- web
- compilerOptions
- web/src/app/api/printers/route.ts
- StaffUser
- volumes
- environment
- StockMovement
- server
- 2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*
- 2. Đặc tả Chi tiết Các Màn hình & Wireframe
- 3. Quy tắc Nghiệp vụ đã chốt (Business Rules)
- Baseline kiểm thử server — 2026-11-12
- 2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved)
- scripts
- ocr-speed.test.ts
- 2. Danh sách Test Case chi tiết (`AC-01` .. `AC-08`)
- healthcheck
- ImportReceipt.ts
- Dashboard doanh thu — chuẩn hóa chỉ số & trả hàng đơn công nợ
- cms
- mongodb
- shop
- Kế hoạch: Website bán hàng tham chiếu mipik.vn (Next.js, SEO) + CMS Quản trị Web
- recode-products.test.ts
- importPdfInventory.ts
- DrawerMenu.tsx
- Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS
- Attendance.ts
- middleware.ts
- Dự án bán hàng 11 Sport
- Dự án bán hàng 11 Sport
- next
- Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`)
- Design System - 11Sport (POS, Kho & CMS)
- Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)
- WebBanner.ts
- Migration DB — 11 Sport
- Skill GitHub gợi ý cho từng phòng ban
- .eslintrc.json
- pre-commit-graphify.sh
- 20261113000002-backfill-order-debt-fields.ts
- start-dev.sh

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 75 edges
2. `apiRequest()` - 65 edges
3. `normalizeToCompactUpperCode()` - 52 edges
4. `InventoryModule()` - 37 edges
5. `mongoose` - 36 edges
6. `PosTab()` - 36 edges
7. `createApp()` - 32 edges
8. `formatVND()` - 31 edges
9. `connectDatabase()` - 30 edges
10. `apiRequest()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `D. Giỏ hàng, Checkout, Thanh toán PayOS/VietQR & Tra cứu đơn` --references--> `StockMovement`  [INFERRED]
  docs/api-contract.md → cms/src/lib/api.ts
- `4.2 Cảnh báo & Giám sát khuyến nghị (Production/Staging)` --references--> `StockMovement`  [INFERRED]
  docs/devops/deployment-and-runbook.md → cms/src/lib/api.ts
- `3.2 Kế toán Kho & Sổ kho (Stock Movement)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts
- `3.3 Nhập kho (Import Receipt)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts
- `4. Tiêu chí Nghiệm thu (Acceptance Criteria)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts

## Import Cycles
- 2-file cycle: `server/src/routes/brands.ts -> server/src/utils/productScheme.ts -> server/src/routes/brands.ts`
- 2-file cycle: `server/src/routes/categories.ts -> server/src/utils/productScheme.ts -> server/src/routes/categories.ts`

## Communities (123 total, 12 thin omitted)

### Community 0 - "ref_lucide_react"
Cohesion: 0.05
Nodes (84): inter, metadata, RootLayout(), preparePreview(), ContractFilePreviewModalProps, dataUrlToArrayBuffer(), VersionChecker(), WebAuditLogsTab() (+76 more)

### Community 1 - "cms/src/lib/api.ts"
Cohesion: 0.04
Nodes (72): DEFAULT_WEEKLY_SCHEDULE, getMonthStartStr(), localDateStr(), ShiftHandoverModule(), shiftLabel(), WEEKDAY_LABELS, buildCompactColorTokenFE(), confirmShiftHandoverApi() (+64 more)

### Community 2 - "apiRequest"
Cohesion: 0.08
Nodes (61): CMS_MENU_ITEMS, CmsDashboardPage(), CmsModuleType, ROLE_ALLOWED_MODULES, AccountProfileModule(), getRoleDisplayName(), toIsoDateSlice(), DebtManagementModule() (+53 more)

### Community 3 - "ordersCustomers.ts"
Cohesion: 0.05
Nodes (50): 1. Hiện trạng đã xác minh trong code, requireRoles(), DebtAdjustmentRecordSchema, DebtPaymentRecordSchema, DebtStatus, DiscountType, IDebtAdjustmentRecord, IDebtPaymentRecord (+42 more)

### Community 4 - "web/src/lib/api.ts"
Cohesion: 0.05
Nodes (55): buildCompactColorTokenFE(), ContractType, CurrentShiftOrdersSummary, DailyHandoverCategoryInfo, DebtAdjustmentRecord, DebtPaymentRecord, DebtStatus, Department (+47 more)

### Community 5 - "seed.ts"
Cohesion: 0.14
Nodes (30): An toàn DB, supertest, vitest, createApp(), clearDatabase(), connectDatabase(), disconnectDatabase(), getDbMode() (+22 more)

### Community 6 - "StaffModule.tsx"
Cohesion: 0.07
Nodes (47): ContractFilePreviewModal(), HrmAttendanceModule(), SubTab, addDays(), DAY_NAMES, DragPayload, isStaffInRow(), keyOf() (+39 more)

### Community 7 - "web/src/app/page.tsx"
Cohesion: 0.12
Nodes (43): getDefaultTabForRole(), getRoleDisplayName(), isAttendanceOnlyRole(), isBlockedFromWebPos(), TABS_CONFIG, WebPosHomePage(), AccountProfileTab(), toIsoDateSlice() (+35 more)

### Community 8 - "web/src/components/MyAttendanceCalendar.tsx"
Cohesion: 0.08
Nodes (47): addLocalDays(), DAY_NAMES, FridayShiftRegistrationModal(), getNextMondayLocalStr(), pad2(), Props, toLocalDateStr(), CONTRACT_LABEL (+39 more)

### Community 9 - "db.ts"
Cohesion: 0.06
Nodes (40): brandRepo, webArticleCategoryRepo, webArticleRepo, webAuditLogRepo, webBannerRepo, webHomeSectionRepo, webMenuRepo, webRedirectRepo (+32 more)

### Community 10 - "seedWebStorefront.ts"
Cohesion: 0.06
Nodes (40): BrandModel, BrandSchema, BrandStatus, IBrand, CategoryModel, CategorySchema, CategoryStatus, ICategory (+32 more)

### Community 11 - "tin-tuc/[slug]/page.tsx"
Cohesion: 0.09
Nodes (39): ContactPage(), FALLBACK_SHOWROOMS, metadata, buildFallbackProduct(), generateMetadata(), ProductPage(), ProductPageProps, formatSlugTitle() (+31 more)

### Community 12 - "exports.ts"
Cohesion: 0.11
Nodes (43): ROLE_LABEL, StaffActivityModule(), toInputDate(), ViewTab, DailyRevenueTrend, formatVariantLabel(), RevenueByCategory, SalesActivity (+35 more)

### Community 13 - "productsInventory.ts"
Cohesion: 0.14
Nodes (40): F. `POST /api/v1/products` — luồng mới (khi body có `brandId`), WarehouseFloor, keepCheckerFields(), applyPaidOrderSideEffects(), prepareOrderData(), assertPricePermission(), buildPatchedVariantsForProduct(), canEditSellingPrice() (+32 more)

### Community 14 - "shop/package.json"
Cohesion: 0.06
Nodes (43): embla-carousel-autoplay, eslint, eslint-config-next, framer-motion, zustand, dependencies, embla-carousel-autoplay@^8.3.0, embla-carousel-react@^8.3.0 (+35 more)

### Community 15 - "ProductDetailClient.tsx"
Cohesion: 0.11
Nodes (30): CheckoutPage(), metadata, CartPage(), metadata, AccountPage(), metadata, AccountClient(), CartPageClient() (+22 more)

### Community 16 - "web-models.test.ts"
Cohesion: 0.06
Nodes (33): mongoose, customerRepo, CustomerAddressSchema, CustomerModel, CustomerSchema, ICustomer, ICustomerAddress, CustomerOtpModel (+25 more)

### Community 17 - "InventoryModule.tsx"
Cohesion: 0.11
Nodes (38): ColorInputWithPicker(), ColorSwatchBadge(), getColorBoxBorderStyle(), inferColorHexesFromText(), normalizeTextForColorMatch(), resolveVariantColorHexes(), sanitizeHexList(), SPORT_COLOR_PALETTE (+30 more)

### Community 18 - "ApiError"
Cohesion: 0.10
Nodes (33): express, categoryRepo, assertUniqueName(), brandUsage(), cleanAliases(), countProductsByBrand(), ensureSystemBrand(), requireBrandManager() (+25 more)

### Community 19 - "imports.ts"
Cohesion: 0.12
Nodes (31): ensureStandardProductCodesMigrated(), applyMatchedScan(), enrichReceiptRoles(), importLockQueues, inferReceiptActorRole(), inferRole(), isFullItem(), normalizeImportItems() (+23 more)

### Community 20 - "types/storefront.ts"
Cohesion: 0.09
Nodes (35): CatalogClientProps, PRICE_PRESETS, ProductCardProps, ProductCarouselProps, ArticleGridSectionProps, BrandCarouselProps, ProductDetailClientProps, SearchTabsClientProps (+27 more)

### Community 21 - "PosTab.tsx"
Cohesion: 0.11
Nodes (36): CartItem, cartUnitPrice(), createDraft(), createEmptyDraftData(), DraftOrder, DraftOrderData, generateDraftId(), getCartLineKey() (+28 more)

### Community 22 - "cms/package.json"
Cohesion: 0.07
Nodes (36): dependencies, docx-preview@^0.4.1, lucide-react@^0.460.0, mammoth@^1.13.0, next@^14.2.15, react@^18.3.1, react-dom@^18.3.1, devDependencies (+28 more)

### Community 23 - "cms/src/components/MyAttendanceCalendar.tsx"
Cohesion: 0.09
Nodes (35): addDaysIso(), AvailableOffDayOption, CreateLeaveModal(), fmtDate(), LEAVE_REASON_MAX, LEAVE_TYPE_META, LeaveFilter, MyLeaveRequestsPanel() (+27 more)

### Community 24 - "2. Wireframe & Spec Storefront (`shop/`)"
Cohesion: 0.05
Nodes (36): 1.1 Luồng Mua hàng (Guest & Member) + Thanh toán QR 15 phút, 1.2 Luồng Tìm kiếm & Lọc danh mục, 1.3 Luồng Duyệt nội dung CEO / ADMIN trên CMS & Revalidate, 1. User Flow chính, 2.1 Trang chủ (`/`), 2.2 Danh mục cha (Brand Hub) & Danh mục con (`/danh-muc/[slug]`, `/thuong-hieu/[slug]`), 2.3 Chi tiết sản phẩm — PDP (`/san-pham/[slug]`), 2.4 Giỏ hàng (`/gio-hang`), Mini-Cart Drawer, Checkout (`/checkout`) & Order Success (+28 more)

### Community 25 - "middleware/auth.ts"
Cohesion: 0.09
Nodes (30): Phiếu bàn giao, attachUserContext(), errorHandler(), Express, invalidateStaffAuthCache(), Request, resolveActiveStaffCached(), staffCache (+22 more)

### Community 26 - "web/package.json"
Cohesion: 0.07
Nodes (36): dependencies, docx-preview@^0.4.1, lucide-react@^0.460.0, mammoth@^1.13.0, next@^14.2.15, react@^18.3.1, react-dom@^18.3.1, devDependencies (+28 more)

### Community 27 - "productCode.ts"
Cohesion: 0.11
Nodes (34): brandTerms(), buildBrandSeedList(), EXTRA_ALIASES, findBrandExact(), findTermIndex(), knownBrandCandidates(), matchBrandInText(), proposeVersion() (+26 more)

### Community 28 - "InventoryTab.tsx"
Cohesion: 0.13
Nodes (33): ColorInputWithPicker(), ColorSwatchBadge(), getColorBoxBorderStyle(), inferColorHexesFromText(), normalizeTextForColorMatch(), resolveVariantColorHexes(), sanitizeHexList(), SPORT_COLOR_PALETTE (+25 more)

### Community 29 - "ProductCatalogModule.tsx"
Cohesion: 0.17
Nodes (27): BrandForm, BrandModule(), EMPTY_FORM, CategoryBrandModule(), SubTab, CategoryModule(), ExportExcelButton(), ExportExcelButtonProps (+19 more)

### Community 30 - "shop/src/app/page.tsx"
Cohesion: 0.14
Nodes (23): embla-carousel-react, HomePage(), metadata, MotionReveal(), MotionRevealProps, ProductCard(), ProductCarousel(), ArticleGridSection() (+15 more)

### Community 31 - "seo.ts"
Cohesion: 0.09
Nodes (23): beVietnamPro, jetbrainsMono, metadata, RootLayout(), SitemapDataResponse, SitemapEntry, FloatingContactWidget(), Footer() (+15 more)

### Community 32 - "recodeProducts.ts"
Cohesion: 0.12
Nodes (29): RFC-4180, ApplyOptions, applyRecode(), ApplyReport, assertLocalMongoUri(), backupDatabase(), buildRecodePlan(), bumpVersion() (+21 more)

### Community 33 - "server/package.json"
Cohesion: 0.09
Nodes (30): cors, dotenv, mongodb-memory-server, tesseract.js, ts-node-dev, @types/cors, @types/express, @types/supertest (+22 more)

### Community 34 - "runner.ts"
Cohesion: 0.16
Nodes (25): Quy tắc viết migration, getFlag(), getOpt(), main(), acquireLock(), AppliedRecord, connect(), create() (+17 more)

### Community 35 - "publicStorefront.ts"
Cohesion: 0.12
Nodes (27): customerOtpRepo, promotionRepo, IProduct, IProductVariant, OnlineStockMode, matchesSearchQuery(), normalizeSearchText(), publicStorefrontRouter (+19 more)

### Community 36 - "web/src/components/HeaderAttendanceBar.tsx"
Cohesion: 0.17
Nodes (25): AccountProfileTabProps, AttendanceModal(), Props, HeaderAttendanceBar(), localDateStr(), Props, Props, formatMoneyInput() (+17 more)

### Community 37 - "AttendanceTimesheetModule.tsx"
Cohesion: 0.13
Nodes (26): AttendanceTimesheetModule(), CELL_STYLE, CellDetailModal(), EditTarget, formatMinutes(), hasIssue(), HOURS_24, IssueFilter (+18 more)

### Community 38 - "services.ts"
Cohesion: 0.10
Nodes (21): serviceTypeRepo, IServiceOrder, IServiceOrderItem, IServicePaymentRecord, ServiceDiscountType, ServiceOrderItemSchema, ServiceOrderModel, ServiceOrderSchema (+13 more)

### Community 39 - "danh-muc/[slug]/page.tsx"
Cohesion: 0.15
Nodes (22): CategoryPage(), CategoryPageProps, formatSlugTitle(), generateMetadata(), getParam(), BrandPage(), BrandPageProps, formatSlugTitle() (+14 more)

### Community 40 - "ref_next"
Cohesion: 0.10
Nodes (13): dynamic, revalidate, RevalidatePayload, metadata, OrderSuccessPage(), formatCountdown(), OrderSuccessClient(), StoredOrder (+5 more)

### Community 41 - "reports.ts"
Cohesion: 0.11
Nodes (18): serviceOrderRepo, DebtOrderRow, ProdStat, PushProdStat, reportsRouter, SalesActivity, SalesType, ServiceTypeStat (+10 more)

### Community 42 - "ocr.ts"
Cohesion: 0.14
Nodes (24): ALLOWED_MIME, buildTagCodes(), buildThinkingConfig(), callGeminiModel(), callGeminiTable(), callGeminiTag(), DEFAULT_TABLE_MODELS, DEFAULT_TAG_MODELS (+16 more)

### Community 43 - "5. Đặc tả Component cốt lõi (`shop/`)"
Cohesion: 0.08
Nodes (23): 1. Triết lý & Định hướng Thương hiệu (`shop/`), 2.1 Bảng màu chính & Kiểm định WCAG AA, 2.2 Neutral & Surfaces, 2.3 Semantic & Trạng thái, 2. Color Tokens (TailwindCSS & CSS Variables), 3. Typography & Định dạng hiển thị, 4.1 Breakpoints & Container, 4.2 Spacing & Radius (+15 more)

### Community 44 - "Đặc tả yêu cầu: Hệ thống Chấm công & Quản trị Nhân sự (HRM & Shift Handover)"
Cohesion: 0.08
Nodes (23): 1. Bối cảnh & Mục tiêu kinh doanh, 2.1 Trong phạm vi (In-Scope - Phase 1), 2.2 Ngoài phạm vi (Out-of-Scope - Phase 2), 2. Phạm vi (Scope), 3.1 Danh sách Tác nhân theo 2 Khối, 3.2 Ma trận Phân quyền Mô-đun CMS (CMS Access Matrix), 3. Tác nhân hệ thống & Phân quyền CMS (Actors & Permissions), 4.1 Cấu hình Ca & Tính Giờ Công (+15 more)

### Community 45 - "shifts.ts"
Cohesion: 0.14
Nodes (22): ADVANCE_NOTICE_DAYS_REQUIRED, SALES_MAX_OFF_PER_WEEK_SHIFT_REG, SALES_MAX_PAID_LEAVE_PER_WEEK_SHIFT_REG, SALES_MAX_UNPAID_OFF_PER_WEEK_SHIFT_REG, addDaysStr(), buildDeterministicPermutation(), computeDailyHandoverCheck(), expireStalePendingHandovers() (+14 more)

### Community 46 - "attendance.ts"
Cohesion: 0.17
Nodes (20): attendanceConfigRepo, shiftAssignmentRepo, shiftHandoverRepo, AttendanceConfig, attendanceRouter, _dnsCache, extractClientIp(), fetchCurrentPublicWanIp() (+12 more)

### Community 47 - "attendanceTimesheet.ts"
Cohesion: 0.14
Nodes (21): attendanceRepo, leaveRequestRepo, applyManualOffForStaffDate(), attendanceTimesheetRouter, buildTimesheet(), combineDateAndMinutes(), computeAttendanceMetrics(), getLateToleranceMinutes() (+13 more)

### Community 48 - "promotions.ts"
Cohesion: 0.12
Nodes (21): IPromotion, IPromotionConditionCategory, IPromotionConditionProduct, IPromotionGiftItem, IPromotionTierPricing, PromotionChannel, PromotionConditionCategorySchema, PromotionConditionProductSchema (+13 more)

### Community 49 - "normalizeToCompactUpperCode"
Cohesion: 0.19
Nodes (21): findRowByKnownBarcode(), Issue, main(), checkLine(), compactColorTokenForBarcode(), isCompactBarcodeMatchVariant(), normalizeToCompactUpperCode(), resolveBrandInfo() (+13 more)

### Community 50 - "Đặc tả Yêu cầu Nghiệp vụ: Website Bán hàng 11 Sport (`shop/`) & CMS Quản lý Website (`cms/`)"
Cohesion: 0.10
Nodes (20): 10.1 Rủi ro kỹ thuật & nghiệp vụ, 10.2 Điểm cần xác nhận thêm khi vào giai đoạn Design / Backend, 10. Rủi ro & Câu hỏi còn mở, 1.1 Bối cảnh hiện trạng, 1.2 Mục tiêu kinh doanh (MVP), 1. Bối cảnh & Mục tiêu kinh doanh, 2.1 Trong phạm vi MVP (In-Scope), 2.2 Ngoài phạm vi MVP (Out-of-Scope — Giai đoạn 2+) (+12 more)

### Community 51 - "customerAuth.ts"
Cohesion: 0.14
Nodes (19): isTestRuntime(), attachCustomerContext(), base64UrlDecode(), base64UrlEncode(), CustomerTokenPayload, dispatchCustomerOtp(), Express, generateOtpCode() (+11 more)

### Community 52 - "Hướng dẫn Hạ tầng & Triển khai Storefront (`shop/`) - 11 Sport"
Cohesion: 0.10
Nodes (19): 1. Kiến trúc & Cổng dịch vụ, 2.1 `server/` (Backend API), 2.2 `shop/` (Storefront khách hàng), 2.3 `cms/` (Trang quản trị), 2. Danh sách Biến môi trường bắt buộc, 3.1 Chạy với Docker Compose, 3.2 Chạy không dùng Docker (Local Node.js), 3. Hướng dẫn chạy Local (+11 more)

### Community 53 - "CameraScannerModal.tsx"
Cohesion: 0.16
Nodes (18): 1. Tổng quan Phạm vi & Môi trường Kiểm thử, 2. Bảng Ma trận Test Cases chi tiết (AC-01 đến AC-07 & Biên/Lỗi), 3. Kết quả Chạy Kiểm thử Tự động & Kiểm tra Build/Type-check, 4. Kết luận Nghiệm thu, Tài liệu Kịch bản Kiểm thử & Kết quả Nghiệm thu - 11Sport (v1.0), CameraScannerModal(), CameraScannerModalProps, compressImageToDataUrl() (+10 more)

### Community 54 - "app.ts"
Cohesion: 0.13
Nodes (15): requireAuth(), createRateLimiter(), getRequestIpKey(), RateBucket, RateLimitOptions, securityHeaders(), brandsRouter, categoriesRouter (+7 more)

### Community 55 - "leaveRequests.ts"
Cohesion: 0.23
Nodes (18): addDaysToDateStr(), assertAdvanceNoticeForLeaveRequest(), assertPaidLeaveQuota(), computePaidLeaveBalanceForStaff(), diffCalendarDays(), diffMonthsInclusive(), getConsecutivePaidLeaveCluster(), getMondayOfDateStr() (+10 more)

### Community 56 - "staffImportParser.ts"
Cohesion: 0.21
Nodes (18): parseCsvTextToMatrix(), ColumnKey, inferContractType(), inferRoleAndDepartment(), matchSubHeaderKey(), matchTopHeaderKey(), normalizeCitizenIdCell(), normalizeGenderCell() (+10 more)

### Community 57 - "cms/src/components/BarcodeLabelModal.tsx"
Cohesion: 0.18
Nodes (17): BarcodeLabelItem, BarcodeLabelModal(), BarcodeLabelModalProps, CODE128_PATTERNS, encodeCode128Bars(), encodeCode128RawPattern(), escapeHtml(), FIXED_LABEL_CONFIG (+9 more)

### Community 58 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 59 - "Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0"
Cohesion: 0.11
Nodes (18): 1. Kiến trúc Triển khai & Danh sách Cổng (Ports), 2.1 `server/.env.example`, 2.2 `web/.env.example` (POS & Kho - Port 3000), 2.3 `cms/.env.example` (Quản trị - Port 3001), 2. Cấu hình Biến môi trường (Environment Variables), 3. Hướng dẫn Khởi chạy Hệ thống, 4.1 Điểm kiểm tra (Endpoints), 4.2 Cảnh báo & Giám sát khuyến nghị (Production/Staging) (+10 more)

### Community 60 - "Repository"
Cohesion: 0.14
Nodes (6): CollectionRecord, generateObjectId(), matchFilter(), MemoryStore, memoryStore, Repository

### Community 61 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 62 - "web/src/components/BarcodeLabelModal.tsx"
Cohesion: 0.18
Nodes (17): BarcodeLabelItem, BarcodeLabelModal(), BarcodeLabelModalProps, CODE128_PATTERNS, encodeCode128Bars(), encodeCode128RawPattern(), escapeHtml(), FIXED_LABEL_CONFIG (+9 more)

### Community 63 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 64 - "excel.ts"
Cohesion: 0.20
Nodes (16): CellValue, cellXml(), colLetter(), ColumnFormat, crc32(), CRC_TABLE, createXlsx(), escapeXml() (+8 more)

### Community 65 - "2. Danh sách Endpoints"
Cohesion: 0.12
Nodes (17): 2.0 Kiểm tra trạng thái hệ thống (`/health`), 2.10 Chương trình Khuyến mãi (`/promotions`) *(v2.7)*, 2.10 Quản lý Loại Dịch Vụ & Đơn Dịch Vụ (`/service-types`, `/service-orders`), 2.11 Chuẩn hóa Mã Sản Phẩm Viết Liền, Biến Thể (`Size` / `Màu`) & Nhập Kho File PDF/Excel + In Tem Label *(v2.8)*, 2.13 Máy in Tem Mã Vạch Nhiệt & In Trực Tiếp (`/printers`) *(v3.1)*, 2.14 Mã Con Theo Thuộc Tính Biến Thể (`variantCode`) — In Tem & Quét Kiểm Kho / Bán Hàng POS *(v3.2)*, 2.16 Chuẩn Hóa In Tem Nhiệt Code 128 Sắc Nét 203 DPI & Rút Gọn Mã Quét Chống Tràn Lề (`toCompactBarcode128`) *(v3.4)*, 2.17 Mua Công Nợ (Mua Trước Trả Sau) Tại Quầy POS & Quản Lý Thu Nợ Trên CMS Dashboard *(v3.5)* (+9 more)

### Community 66 - "windowsPrinter.ts"
Cohesion: 0.20
Nodes (15): printersRouter, CODE128_PATTERNS, DirectPrintPayload, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, isThermalPrinter(), LabelPrintItem (+7 more)

### Community 67 - "PosServiceSection.tsx"
Cohesion: 0.15
Nodes (16): addDaysToDateStr(), computeServiceLinePricing(), diffDaysStr(), formatShortDate(), getTodayStr(), PaymentTimingMode, PosServiceSection(), ServiceCartLine (+8 more)

### Community 68 - "TagCheckScannerModal.tsx"
Cohesion: 0.19
Nodes (16): Candidate, detectBarcodeFromCanvas(), expectedOf(), feedback(), isFullRow(), Phase, ResultKind, scannedOf() (+8 more)

### Community 69 - "cms/src/app/api/printers/route.ts"
Cohesion: 0.23
Nodes (13): CODE128_PATTERNS, compactColorTokenForBarcode(), dynamic, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, GET(), isThermalPrinter() (+5 more)

### Community 70 - "3.1 Public Storefront API (`/api/v1/public/*`)"
Cohesion: 0.12
Nodes (11): 1. Quy ước chung, 3.1 Public Storefront API (`/api/v1/public/*`), 3.2 Customer Authentication & Account (`/api/v1/public/customers/*`), 3.3 CMS Web Management (`/api/v1/cms/web/*`), 3. Hợp đồng API Website Bán Hàng (`shop/`) & CMS Quản Lý Website (`cms/`) *(v6.0)*, A. Trang chủ, Menu & Cấu hình Site, B. Danh mục, Thương hiệu & Sản phẩm, C. Blog, Trang tĩnh, Đánh giá & Liên hệ (+3 more)

### Community 71 - "11Sport — Hệ thống Quản lý Bán hàng (POS), Kho vận & Quản trị (CMS)"
Cohesion: 0.12
Nodes (16): 11Sport — Hệ thống Quản lý Bán hàng (POS), Kho vận & Quản trị (CMS), Backend (`server/`), Backend (`server/.env` — tham khảo `server/.env.example`), Biến môi trường, Các lệnh thường dùng, Cách 1: Chạy nhanh bằng script có sẵn (Khuyên dùng), Cách 2: Chạy bằng Docker Compose, Cách 3: Cài đặt & chạy thủ công từng dịch vụ (+8 more)

### Community 72 - "holidays.ts"
Cohesion: 0.28
Nodes (14): holidayRepo, convertSolar2Lunar(), externalHolidayCache, fetchNagerVietnamHolidays(), getLeapMonthOffset(), getLunarMonth11(), getMergedHolidayMap(), getNewMoonDay() (+6 more)

### Community 73 - "services"
Cohesion: 0.13
Nodes (14): generateValue, key, sync, value, services, buildCommand, envVars, healthCheckPath (+6 more)

### Community 74 - "web"
Cohesion: 0.14
Nodes (14): depends_on, server, condition, web, depends_on, command, container_name, depends_on (+6 more)

### Community 75 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+5 more)

### Community 76 - "web/src/app/api/printers/route.ts"
Cohesion: 0.27
Nodes (13): CODE128_PATTERNS, compactColorTokenForBarcode(), dynamic, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, GET(), isThermalPrinter() (+5 more)

### Community 77 - "StaffUser"
Cohesion: 0.22
Nodes (11): AccountProfileModuleProps, AttendanceIpConfigModule(), Props, HeaderAttendanceBar(), localDateStr(), Props, AttendanceConfig, AttendanceRecord (+3 more)

### Community 78 - "volumes"
Cohesion: 0.15
Nodes (12): driver, networks, 11sport-net, services, version, volumes, cms_node_modules, mongodb_config (+4 more)

### Community 79 - "environment"
Cohesion: 0.23
Nodes (13): environment, CORS_ORIGINS, JWT_SECRET, MONGODB_URI, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL, NODE_ENV, PORT (+5 more)

### Community 80 - "StockMovement"
Cohesion: 0.18
Nodes (11): StockMovement, 2.3 Kho hàng, Sản phẩm & Sổ kho (`/products`, `/inventory`), 2.4 Nhập kho (`/imports`), 2.5 Bán hàng POS & Khách hàng (`/orders`, `/customers`), 2.6 Trả / Đổi hàng (`/returns`), 5.1 Luồng chính: Đặt hàng Online & Thanh toán QR (PayOS/VietQR), 5.2 Luồng thay thế, 5.3 Luồng lỗi & Xử lý ngoại lệ (+3 more)

### Community 81 - "server"
Cohesion: 0.17
Nodes (12): mongodb, condition, command, container_name, depends_on, image, networks, ports (+4 more)

### Community 82 - "2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*"
Cohesion: 0.17
Nodes (12): 2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*, A. Quy tắc mã, B. Thương hiệu (`/brands`), C. Category — trường mới, D. Product — trường mới (response `GET /products`, `POST/PATCH /products`), E. `POST /api/v1/products/preview-code` (xem trước mã, không ghi DB), G. `POST /api/v1/products/:id/variants` & `PATCH /api/v1/products/:id/variants` — thêm / sửa biến thể trên sản phẩm có sẵn, H. `PATCH /api/v1/products/:id` — trường mới (+4 more)

### Community 83 - "2. Đặc tả Chi tiết Các Màn hình & Wireframe"
Cohesion: 0.17
Nodes (11): 1. Kiến trúc Thông tin & Luồng người dùng (User Flows), 2. Đặc tả Chi tiết Các Màn hình & Wireframe, 3. Design Tokens Áp dụng (TailwindCSS), 4. Phiếu Bàn giao Thiết kế (Designer -> Backend & Frontend Dev), Màn hình 1: Mobile / Web Check-in & Chấm công (Dùng chung Showroom & Văn phòng), Màn hình 2: Pop-up Thứ 6 Đăng ký Ca & Lịch bận (Khối Sales), Màn hình 3: Giao diện Kéo - Thả Xếp Ca cho HR (`Drag & Drop Scheduler` trên CMS), Màn hình 4: Màn hình Bàn giao Kho Tầng 1 & Chốt Két (Showroom Sales) (+3 more)

### Community 84 - "3. Quy tắc Nghiệp vụ đã chốt (Business Rules)"
Cohesion: 0.17
Nodes (11): 1. Bối cảnh & Mục tiêu kinh doanh, 2. Vai trò người dùng & Phân quyền (RBAC), 3.1 Danh mục (Category) & Sản phẩm (Product), 3.2 Kế toán Kho & Sổ kho (Stock Movement), 3.3 Nhập kho (Import Receipt), 3.4 Bán hàng (POS Order) & Xuất PDF, 3.5 Trả / Đổi hàng (Return & Exchange), 3. Quy tắc Nghiệp vụ đã chốt (Business Rules) (+3 more)

### Community 85 - "Baseline kiểm thử server — 2026-11-12"
Cohesion: 0.17
Nodes (11): 1. Thực hiện đề xuất an toàn DB & cập nhật 4 file test theo chuẩn mã v3.2, 2. Đối chiếu nghiệm thu 16 tiêu chí `AC-01`..`AC-16` (`docs/requirements/doanh-thu-dashboard.md`), 3. Kết quả chạy toàn bộ Test Suite (`server`), 4. Phiếu bàn giao (QA-03), Baseline kiểm thử server — 2026-11-12, Báo cáo Nghiệm thu QA-03 (Sau khi chủ xác nhận quy chuẩn mã v3.2 & kiểm thử AC-01..AC-16), Kết quả tổng, Nguyên nhân gốc — MỘT nguyên nhân chung (+3 more)

### Community 86 - "2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved)"
Cohesion: 0.17
Nodes (11): 1. Thống kê Lỗi theo Mức độ, 2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved), 3. Kiểm thử Phi chức năng & Bảo mật cơ bản, 4. Danh sách Lỗi Đợt kiểm thử WEB-24 (Đã Xử lý & Xác minh Hồi quy), BUG-01: Nút chuyển nhanh vai trò (Quick Login) trên `web/` và `cms/` gửi mật khẩu mặc định chưa khớp với dữ liệu Seed của `server/`, BUG-02: Xử lý dữ liệu phản hồi tại `ImportTab.tsx` khi gọi `POST /api/v1/imports/:id/complete`, BUG-03: Hiển thị mã phiếu Trả/Đổi trong thông báo thành công tại `ReturnExchangeTab.tsx`, BUG-04: Bảng hóa đơn khổ K80 bị tràn ngang do mã sản phẩm dài và dính nền trang khi bấm In PDF (+3 more)

### Community 87 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, lint, migrate, migrate:prod, recode:products, seed:accounts (+4 more)

### Community 88 - "ocr-speed.test.ts"
Cohesion: 0.30
Nodes (9): bootstrap(), PORT, releaseExpiredQrOrders(), assertSecurityEnvironment(), pingKeepAliveOnce(), resolveKeepAliveHealthUrl(), resolveKeepAliveIntervalMs(), startKeepAlive() (+1 more)

### Community 89 - "2. Danh sách Test Case chi tiết (`AC-01` .. `AC-08`)"
Cohesion: 0.18
Nodes (10): 1. Tóm tắt Kết quả Thực thi (Execution Summary), 2. Danh sách Test Case chi tiết (`AC-01` .. `AC-08`), Bộ Test Case & Kết quả Kiểm thử: Website Bán hàng 11 Sport (`shop/`), Backend (`server/`) & CMS (`cms/`), Nhóm 1: SEO & HTML Structure (`AC-01`, `BR-06`), Nhóm 2: 301 Redirect & Sitemap (`AC-02`, `BR-06`), Nhóm 3: Đồng bộ & Trừ kho Atomic POS vs Online (`AC-03`, `BR-01`, `BR-02`, `BR-03`), Nhóm 4: Checkout QR & Webhook Idempotency (`AC-04`, `BR-05`), Nhóm 5: Hết hạn giữ chỗ đơn QR 15 phút (`AC-05`) (+2 more)

### Community 90 - "healthcheck"
Cohesion: 0.56
Nodes (10): healthcheck, interval, retries, start_period, test, timeout, healthcheck, healthcheck (+2 more)

### Community 91 - "ImportReceipt.ts"
Cohesion: 0.20
Nodes (9): 2.15 Chọn & Hiển Thị 1 Hoặc Nhiều Mã Màu Trực Quan (`colorHexes`) Cho Biến Thể Sản Phẩm *(v3.3)*, IImportReceipt, IImportReceiptItem, ImportReceiptItemSchema, ImportReceiptModel, ImportReceiptSchema, ImportReceiptStatus, IScanCount (+1 more)

### Community 92 - "Dashboard doanh thu — chuẩn hóa chỉ số & trả hàng đơn công nợ"
Cohesion: 0.20
Nodes (9): 10. Phiếu bàn giao → backend-dev, 2. Công thức chuẩn, 3. Ví dụ số (một đơn đủ các yếu tố), 4. User story, 5. Đặc tả sửa POST `/returns` & `/returns/calculate` với đơn công nợ, 6. Tiêu chí nghiệm thu (Given/When/Then), 7. Trường hợp biên, 9. Điểm mâu thuẫn / cần PM hỏi chủ (+1 more)

### Community 93 - "cms"
Cohesion: 0.22
Nodes (9): command, container_name, image, networks, ports, restart, volumes, working_dir (+1 more)

### Community 94 - "mongodb"
Cohesion: 0.22
Nodes (9): MONGO_INITDB_DATABASE, container_name, environment, image, networks, ports, restart, volumes (+1 more)

### Community 95 - "shop"
Cohesion: 0.22
Nodes (9): shop, command, container_name, image, networks, ports, restart, volumes (+1 more)

### Community 96 - "Kế hoạch: Website bán hàng tham chiếu mipik.vn (Next.js, SEO) + CMS Quản trị Web"
Cohesion: 0.22
Nodes (8): 1. Hiện trạng repo (đã đọc code), 2. Phân tích mipik.vn – những điểm cần bám theo, 3. Kiến trúc đề xuất, 4. CMS: tab mới "Quản lý Website" (quyền ADMIN, CEO), 5. Lộ trình (theo luồng pm → ba → designer → backend → frontend → tester), 6. Rủi ro, 7. Câu hỏi cần chốt, Kế hoạch: Website bán hàng tham chiếu mipik.vn (Next.js, SEO) + CMS Quản trị Web

### Community 98 - "importPdfInventory.ts"
Cohesion: 0.28
Nodes (7): importReceiptRepo, apiCall(), buildProductName(), FLOOR_1_ITEMS, FLOOR_2_ITEMS, main(), PdfItemRow

### Community 99 - "DrawerMenu.tsx"
Cohesion: 0.33
Nodes (7): DrawerMenuProps, DrawerPageType, TabConfig, TabType, applyTheme(), ThemeToggle(), UserRole

### Community 100 - "Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS"
Cohesion: 0.25
Nodes (7): 1.1. Môi trường & Base URL, 1.2. Cơ chế Xác thực & Bảo mật (Authentication & Security), 1. Tổng quan về Wise API (Wise Platform / Payouts API), 2. Kiến trúc 5 bước chuẩn của Wise API, 3. Thiết kế UX/UI trên POS (`web/`) — Nút Stash Máy tính Wise, Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS, Đặc thù kỹ thuật quan trọng với đồng `VND` trên Wise API:

### Community 101 - "Attendance.ts"
Cohesion: 0.25
Nodes (7): AttendanceCheckInType, AttendanceModel, AttendanceSchema, AttendanceStatus, IAttendance, OvertimeStatus, ShiftCode

### Community 102 - "middleware.ts"
Cohesion: 0.36
Nodes (7): API_BASE_URL, cachedRedirects, config, getRedirects(), middleware(), normalizePath(), RedirectRule

### Community 103 - "Dự án bán hàng 11 Sport"
Cohesion: 0.29
Nodes (6): Cấu trúc, Dự án bán hàng 11 Sport, graphify, Luồng làm việc & Hệ thống Subagents (11 Sport), Quy tắc chung cho mọi agent, Thư mục tài liệu

### Community 104 - "Dự án bán hàng 11 Sport"
Cohesion: 0.29
Nodes (6): Cấu trúc, Dự án bán hàng 11 Sport, graphify, Luồng làm việc, Quy tắc chung cho mọi agent, Thư mục tài liệu

### Community 105 - "next"
Cohesion: 0.29
Nodes (3): nextConfig, nextConfig, nextConfig

### Community 106 - "Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`)"
Cohesion: 0.29
Nodes (6): 1. Thanh điều hướng & Chuyển vai trò nhanh, 2. Chi tiết luồng màn hình Nhập kho (`web/`), Các Module chính, Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`), Phần B: Giao diện `cms/` (Quản trị - Port `3001`), Đặc tả Giao diện & Luồng màn hình - 11Sport (v1.0)

### Community 107 - "Design System - 11Sport (POS, Kho & CMS)"
Cohesion: 0.33
Nodes (5): 1. Nhận diện Thương hiệu Thể thao (Athletic & High-Contrast POS), 2. Bảng màu (Color Tokens - TailwindCSS — White & Clean Dual-App), 3. Typography & Định dạng hiển thị, 4. Các Component cốt lõi, Design System - 11Sport (POS, Kho & CMS)

### Community 108 - "Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)"
Cohesion: 0.33
Nodes (5): 1. Vấn đề, 2. Quy tắc đã chốt, 3. Chuyển đổi dữ liệu cũ (CHỈ DB LOCAL), 4. Tiêu chí nghiệm thu, Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)

### Community 109 - "WebBanner.ts"
Cohesion: 0.33
Nodes (5): IWebBanner, WebBannerModel, WebBannerPosition, WebBannerSchema, WebBannerStatus

### Community 110 - "Migration DB — 11 Sport"
Cohesion: 0.40
Nodes (5): Cơ chế an toàn, Lệnh, Migration DB — 11 Sport, Migration hiện có, Quy trình deploy (bắt buộc)

### Community 112 - "Skill GitHub gợi ý cho từng phòng ban"
Cohesion: 0.50
Nodes (3): Cài đặt (Claude Code), Cách dùng, Skill GitHub gợi ý cho từng phòng ban

## Knowledge Gaps
- **3 isolated node(s):** `PATH`, `RFC-4180`, `next/core-web-vitals`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 974 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StockMovement` connect `StockMovement` to `cms/src/lib/api.ts`, `3.1 Public Storefront API (`/api/v1/public/*`)`, `StaffModule.tsx`, `exports.ts`, `InventoryModule.tsx`, `2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*`, `Đặc tả Yêu cầu Nghiệp vụ: Website Bán hàng 11 Sport (`shop/`) & CMS Quản lý Website (`cms/`)`, `3. Quy tắc Nghiệp vụ đã chốt (Business Rules)`, `CameraScannerModal.tsx`, `2. Danh sách Test Case chi tiết (`AC-01` .. `AC-08`)`, `Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **What connects `PATH`, `RFC-4180`, `next/core-web-vitals` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_lucide_react` be split into smaller, more focused modules?**
  _Cohesion score 0.05170004657661854 - nodes in this community are weakly interconnected._
- **Why does `executeUnpackSetToRetail()` connect `productsInventory.ts` to `StockMovement`, `ApiError`, `ordersCustomers.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `cms/src/lib/api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.042624042624042624 - nodes in this community are weakly interconnected._
- **Why does `G. `POST /api/v1/products/:id/variants` & `PATCH /api/v1/products/:id/variants` — thêm / sửa biến thể trên sản phẩm có sẵn` connect `2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*` to `StockMovement`, `productsInventory.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `apiRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.08128772635814889 - nodes in this community are weakly interconnected._