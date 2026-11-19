# Graph Report - 11sport-IT  (2026-11-18)

## Corpus Check
- 196 files · ~482,298 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 3, .example 3, .css 2)

## Summary
- 2057 nodes · 5193 edges · 101 communities (91 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `360ada8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- productCode.ts
- attendanceTimesheet.ts
- MyAttendanceCalendar.tsx
- ordersCustomers.ts
- PosServiceSection.tsx
- ref_next
- InventoryModule.tsx
- cms/src/lib/api.ts
- Order.ts
- server/package.json
- web/src/lib/api.ts
- cms/package.json
- web/package.json
- runner.ts
- cms/src/lib/barcodeScanner.ts
- web/src/lib/barcodeScanner.ts
- cms/src/components/BarcodeLabelModal.tsx
- web/src/app/page.tsx
- Đặc tả yêu cầu: Hệ thống Chấm công & Quản trị Nhân sự (HRM & Shift Handover)
- createApp
- ref_react
- web/src/lib/barcodeScanner.ts
- compilerOptions
- Repository
- compilerOptions
- ocr.ts
- AttendanceTimesheetModule.tsx
- services
- CameraScannerModal.tsx
- PosTab.tsx
- compilerOptions
- web
- volumes
- server
- 2. Danh sách Endpoints
- Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0
- StockMovement
- importPdfInventory.ts
- 2. Đặc tả Chi tiết Các Màn hình & Wireframe
- shifts.ts
- cms
- environment
- healthcheck
- mongodb
- 2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved)
- pre-commit-graphify.sh
- Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS
- db.ts
- Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`)
- services.ts
- Dự án bán hàng 11 Sport
- Dự án bán hàng 11 Sport
- Design System - 11Sport (POS, Kho & CMS)
- 3. Quy tắc Nghiệp vụ đã chốt (Business Rules)
- promotions.ts
- cms/next.config.mjs
- cms/src/components/MyAttendanceCalendar.tsx
- reports.ts
- Skill GitHub gợi ý cho từng phòng ban
- ordersCustomers.ts
- cms/src/app/api/printers/route.ts
- InventoryTab.tsx
- start-dev.sh
- productCode.ts
- web/src/app/api/printers/route.ts
- types.ts
- ShiftScheduleModule.tsx
- attendance.ts
- 2. Cấu hình Biến môi trường (Environment Variables)
- ReturnExchangeTab.tsx
- cms/src/app/page.tsx
- Dashboard doanh thu — chuẩn hóa chỉ số & trả hàng đơn công nợ
- InventoryModule.tsx
- leaveRequests.ts
- ReturnExchange.ts
- web/src/components/ContractFilePreviewModal.tsx
- staffImportParser.ts
- windowsPrinter.ts
- recodeProducts.ts
- productScheme.ts
- Tiến độ dự án 11 Sport
- holidays.ts
- Baseline kiểm thử server — 2026-11-12
- 2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*
- excel.ts
- Hợp đồng API (API Contract) - 11 Sport (v5.0)
- errors.ts
- Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)
- 2.10 Quản lý Loại Dịch Vụ & Đơn Dịch Vụ (`/service-types`, `/service-orders`)
- StaffModule.tsx
- Migration DB — 11 Sport
- tagMatch.ts
- HrmAttendanceModule.tsx
- orderLock.ts
- Tiến độ dự án 11 Sport

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 65 edges
2. `normalizeToCompactUpperCode()` - 52 edges
3. `apiRequest()` - 40 edges
4. `InventoryModule()` - 37 edges
5. `PosTab()` - 36 edges
6. `createApp()` - 29 edges
7. `apiRequest()` - 29 edges
8. `seedDatabaseIfNeeded()` - 28 edges
9. `generateVariantProductCode()` - 27 edges
10. `connectDatabase()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `4.2 Cảnh báo & Giám sát khuyến nghị (Production/Staging)` --references--> `StockMovement`  [INFERRED]
  docs/devops/deployment-and-runbook.md → cms/src/lib/api.ts
- `3.2 Kế toán Kho & Sổ kho (Stock Movement)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts
- `3.3 Nhập kho (Import Receipt)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts
- `4. Tiêu chí Nghiệm thu (Acceptance Criteria)` --references--> `StockMovement`  [INFERRED]
  docs/requirements/he-thong-pos-kho-v1.md → cms/src/lib/api.ts
- `B. Quản lý Đơn Dịch Vụ (`/service-orders`)` --references--> `status()`  [INFERRED]
  docs/api-contract.md → server/src/migrations/runner.ts

## Import Cycles
- 2-file cycle: `server/src/routes/brands.ts -> server/src/utils/productScheme.ts -> server/src/routes/brands.ts`
- 2-file cycle: `server/src/routes/categories.ts -> server/src/utils/productScheme.ts -> server/src/routes/categories.ts`

## Communities (101 total, 10 thin omitted)

### Community 0 - "productCode.ts"
Cohesion: 0.12
Nodes (32): ensureStandardProductCodesMigrated(), applyMatchedScan(), enrichReceiptRoles(), findRowByKnownBarcode(), inferReceiptActorRole(), inferRole(), isFullItem(), progressOfItems() (+24 more)

### Community 1 - "attendanceTimesheet.ts"
Cohesion: 0.15
Nodes (20): shiftAssignmentRepo, applyManualOffForStaffDate(), attendanceTimesheetRouter, buildTimesheet(), combineDateAndMinutes(), computeAttendanceMetrics(), getLateToleranceMinutes(), getOfficeWorkdays() (+12 more)

### Community 2 - "MyAttendanceCalendar.tsx"
Cohesion: 0.05
Nodes (72): AccountProfileTabProps, AttendanceModal(), Props, addLocalDays(), DAY_NAMES, FridayShiftRegistrationModal(), getNextMondayLocalStr(), pad2() (+64 more)

### Community 3 - "ordersCustomers.ts"
Cohesion: 0.15
Nodes (36): F. `POST /api/v1/products` — luồng mới (khi body có `brandId`), stockMovementRepo, WarehouseFloor, keepCheckerFields(), applyPaidOrderSideEffects(), prepareOrderData(), assertPricePermission(), buildPatchedVariantsForProduct() (+28 more)

### Community 4 - "PosServiceSection.tsx"
Cohesion: 0.16
Nodes (15): addDaysStr(), computeServiceLinePricing(), formatShortDate(), getTodayStr(), PaymentTimingMode, PosServiceSection(), ServiceCartLine, ServiceDiscountMode (+7 more)

### Community 5 - "ref_next"
Cohesion: 0.09
Nodes (14): dynamic, revalidate, metadata, RootLayout(), VersionChecker(), dynamic, revalidate, callWiseQuotes() (+6 more)

### Community 6 - "InventoryModule.tsx"
Cohesion: 0.11
Nodes (39): ROLE_LABEL, StaffActivityModule(), toInputDate(), ViewTab, DailyRevenueTrend, formatVariantLabel(), InventoryReportRow, RevenueByCategory (+31 more)

### Community 7 - "cms/src/lib/api.ts"
Cohesion: 0.04
Nodes (66): AttendanceIpConfigModule(), Props, DEFAULT_WEEKLY_SCHEDULE, getMonthStartStr(), localDateStr(), ShiftHandoverModule(), shiftLabel(), WEEKDAY_LABELS (+58 more)

### Community 8 - "Order.ts"
Cohesion: 0.14
Nodes (13): DebtAdjustmentRecordSchema, DebtPaymentRecordSchema, DiscountType, IDebtAdjustmentRecord, IOrder, ISplitPaymentItem, OrderItemSchema, OrderModel (+5 more)

### Community 9 - "server/package.json"
Cohesion: 0.06
Nodes (41): cors, mongodb-memory-server, tesseract.js, ts-node-dev, @types/cors, @types/express, @types/supertest, dependencies (+33 more)

### Community 10 - "web/src/lib/api.ts"
Cohesion: 0.05
Nodes (54): buildCompactColorTokenFE(), ContractType, CurrentShiftOrdersSummary, DailyHandoverCategoryInfo, DebtAdjustmentRecord, DebtPaymentRecord, DebtStatus, Department (+46 more)

### Community 11 - "cms/package.json"
Cohesion: 0.07
Nodes (36): dependencies, docx-preview@^0.4.1, lucide-react@^0.460.0, mammoth@^1.13.0, next@^14.2.15, react@^18.3.1, react-dom@^18.3.1, devDependencies (+28 more)

### Community 12 - "web/package.json"
Cohesion: 0.07
Nodes (36): dependencies, docx-preview@^0.4.1, lucide-react@^0.460.0, mammoth@^1.13.0, next@^14.2.15, react@^18.3.1, react-dom@^18.3.1, devDependencies (+28 more)

### Community 13 - "runner.ts"
Cohesion: 0.22
Nodes (21): Quy tắc viết migration, getFlag(), getOpt(), main(), acquireLock(), AppliedRecord, connect(), create() (+13 more)

### Community 14 - "cms/src/lib/barcodeScanner.ts"
Cohesion: 0.15
Nodes (27): buildCompactColorTokenFE(), compactColorTokenForBarcode(), estimateCode128Dots(), extractVariantFromText(), generateProductCode(), generateSixDigitsFromSeed(), generateVariantProductCode(), isCompactBarcodeMatchVariant() (+19 more)

### Community 15 - "web/src/lib/barcodeScanner.ts"
Cohesion: 0.22
Nodes (18): compactColorTokenForBarcode(), estimateCode128Dots(), isCompactBarcodeMatchVariant(), toCompactBarcode128(), buildTelexCandidatesFromNormalized(), cleanBarcodeCode(), collapseUnikeyBackspaceStutter(), exactCodeMatch() (+10 more)

### Community 16 - "cms/src/components/BarcodeLabelModal.tsx"
Cohesion: 0.23
Nodes (11): BarcodeLabelModalProps, CODE128_PATTERNS, encodeCode128Bars(), encodeCode128RawPattern(), escapeHtml(), FIXED_LABEL_CONFIG, NormalizedLabelItem, renderCode128PrintSvgFor203Dpi() (+3 more)

### Community 17 - "web/src/app/page.tsx"
Cohesion: 0.13
Nodes (28): getDefaultTabForRole(), getRoleDisplayName(), isAttendanceOnlyRole(), isBlockedFromWebPos(), TABS_CONFIG, WebPosHomePage(), AccountProfileTab(), toIsoDateSlice() (+20 more)

### Community 18 - "Đặc tả yêu cầu: Hệ thống Chấm công & Quản trị Nhân sự (HRM & Shift Handover)"
Cohesion: 0.08
Nodes (25): Holiday, 1. Bối cảnh & Mục tiêu kinh doanh, 2.1 Trong phạm vi (In-Scope - Phase 1), 2.2 Ngoài phạm vi (Out-of-Scope - Phase 2), 2. Phạm vi (Scope), 3.1 Danh sách Tác nhân theo 2 Khối, 3.2 Ma trận Phân quyền Mô-đun CMS (CMS Access Matrix), 3. Tác nhân hệ thống & Phân quyền CMS (Actors & Permissions) (+17 more)

### Community 19 - "createApp"
Cohesion: 0.13
Nodes (34): An toàn DB, supertest, vitest, createApp(), clearDatabase(), connectDatabase(), disconnectDatabase(), getDbMode() (+26 more)

### Community 20 - "ref_react"
Cohesion: 0.12
Nodes (33): BrandForm, BrandModule(), EMPTY_FORM, SubTab, CategoryModule(), DebtManagementModuleProps, ExportExcelButton(), ExportExcelButtonProps (+25 more)

### Community 21 - "web/src/lib/barcodeScanner.ts"
Cohesion: 0.22
Nodes (14): Candidate, detectBarcodeFromCanvas(), expectedOf(), feedback(), isFullRow(), Phase, ResultKind, scannedOf() (+6 more)

### Community 22 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 23 - "Repository"
Cohesion: 0.14
Nodes (6): CollectionRecord, generateObjectId(), matchFilter(), MemoryStore, memoryStore, Repository

### Community 24 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 25 - "ocr.ts"
Cohesion: 0.14
Nodes (23): ALLOWED_MIME, buildTagCodes(), buildThinkingConfig(), callGeminiModel(), callGeminiTable(), callGeminiTag(), DEFAULT_TABLE_MODELS, DEFAULT_TAG_MODELS (+15 more)

### Community 26 - "AttendanceTimesheetModule.tsx"
Cohesion: 0.13
Nodes (26): AttendanceTimesheetModule(), CELL_STYLE, CellDetailModal(), EditTarget, formatMinutes(), hasIssue(), HOURS_24, IssueFilter (+18 more)

### Community 27 - "services"
Cohesion: 0.13
Nodes (14): generateValue, key, sync, value, services, buildCommand, envVars, healthCheckPath (+6 more)

### Community 28 - "CameraScannerModal.tsx"
Cohesion: 0.16
Nodes (18): 1. Tổng quan Phạm vi & Môi trường Kiểm thử, 2. Bảng Ma trận Test Cases chi tiết (AC-01 đến AC-07 & Biên/Lỗi), 3. Kết quả Chạy Kiểm thử Tự động & Kiểm tra Build/Type-check, 4. Kết luận Nghiệm thu, Tài liệu Kịch bản Kiểm thử & Kết quả Nghiệm thu - 11Sport (v1.0), CameraScannerModal(), CameraScannerModalProps, compressImageToDataUrl() (+10 more)

### Community 29 - "PosTab.tsx"
Cohesion: 0.15
Nodes (22): CartItem, cartUnitPrice(), createDraft(), createEmptyDraftData(), DraftOrder, DraftOrderData, generateDraftId(), getCartLineKey() (+14 more)

### Community 30 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+5 more)

### Community 31 - "web"
Cohesion: 0.15
Nodes (13): depends_on, server, condition, web, command, container_name, depends_on, image (+5 more)

### Community 32 - "volumes"
Cohesion: 0.17
Nodes (11): driver, networks, 11sport-net, services, version, volumes, cms_node_modules, mongodb_config (+3 more)

### Community 33 - "server"
Cohesion: 0.17
Nodes (12): mongodb, condition, command, container_name, depends_on, image, networks, ports (+4 more)

### Community 34 - "2. Danh sách Endpoints"
Cohesion: 0.12
Nodes (17): 2.0 Kiểm tra trạng thái hệ thống (`/health`), 2.10 Chương trình Khuyến mãi (`/promotions`) *(v2.7)*, 2.11 Chuẩn hóa Mã Sản Phẩm Viết Liền, Biến Thể (`Size` / `Màu`) & Nhập Kho File PDF/Excel + In Tem Label *(v2.8)*, 2.13 Máy in Tem Mã Vạch Nhiệt & In Trực Tiếp (`/printers`) *(v3.1)*, 2.14 Mã Con Theo Thuộc Tính Biến Thể (`variantCode`) — In Tem & Quét Kiểm Kho / Bán Hàng POS *(v3.2)*, 2.15 Chọn & Hiển Thị 1 Hoặc Nhiều Mã Màu Trực Quan (`colorHexes`) Cho Biến Thể Sản Phẩm *(v3.3)*, 2.16 Chuẩn Hóa In Tem Nhiệt Code 128 Sắc Nét 203 DPI & Rút Gọn Mã Quét Chống Tràn Lề (`toCompactBarcode128`) *(v3.4)*, 2.17 Mua Công Nợ (Mua Trước Trả Sau) Tại Quầy POS & Quản Lý Thu Nợ Trên CMS Dashboard *(v3.5)* (+9 more)

### Community 35 - "Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0"
Cohesion: 0.17
Nodes (11): 1. Kiến trúc Triển khai & Danh sách Cổng (Ports), 3. Hướng dẫn Khởi chạy Hệ thống, 4.1 Điểm kiểm tra (Endpoints), 4.2 Cảnh báo & Giám sát khuyến nghị (Production/Staging), 4. Kiểm tra Sức khỏe Hệ thống (Healthcheck & Giám sát), 6.1 Quy trình Triển khai (CI/CD & Release), 6.2 Quy trình Rollback khi gặp sự cố, 6. Quy trình Triển khai & Rollback Khẩn cấp (+3 more)

### Community 36 - "StockMovement"
Cohesion: 0.22
Nodes (8): StockMovement, 2.3 Kho hàng, Sản phẩm & Sổ kho (`/products`, `/inventory`), 2.4 Nhập kho (`/imports`), 2.5 Bán hàng POS & Khách hàng (`/orders`, `/customers`), 2.6 Trả / Đổi hàng (`/returns`), G. `POST /api/v1/products/:id/variants` & `PATCH /api/v1/products/:id/variants` — thêm / sửa biến thể trên sản phẩm có sẵn, 1. Danh sách Test Cases Chức năng & Tích hợp, Bộ Kịch bản Kiểm thử (Test Cases) — Chuẩn hoá Mã Sản Phẩm CATE+BRAND+VERSION+MÀU+SIZE & Quản lý Thương hiệu (v5.0)

### Community 37 - "importPdfInventory.ts"
Cohesion: 0.15
Nodes (15): dotenv, importReceiptRepo, productRepo, PORT, apiCall(), buildProductName(), FLOOR_1_ITEMS, FLOOR_2_ITEMS (+7 more)

### Community 38 - "2. Đặc tả Chi tiết Các Màn hình & Wireframe"
Cohesion: 0.17
Nodes (11): 1. Kiến trúc Thông tin & Luồng người dùng (User Flows), 2. Đặc tả Chi tiết Các Màn hình & Wireframe, 3. Design Tokens Áp dụng (TailwindCSS), 4. Phiếu Bàn giao Thiết kế (Designer -> Backend & Frontend Dev), Màn hình 1: Mobile / Web Check-in & Chấm công (Dùng chung Showroom & Văn phòng), Màn hình 2: Pop-up Thứ 6 Đăng ký Ca & Lịch bận (Khối Sales), Màn hình 3: Giao diện Kéo - Thả Xếp Ca cho HR (`Drag & Drop Scheduler` trên CMS), Màn hình 4: Màn hình Bàn giao Kho Tầng 1 & Chốt Két (Showroom Sales) (+3 more)

### Community 39 - "shifts.ts"
Cohesion: 0.17
Nodes (19): leaveRequestRepo, addDaysStr(), buildDeterministicPermutation(), computeDailyHandoverCheck(), expireStalePendingHandovers(), finalizeAttendanceCheckoutFromHandover(), getCurrentMondayStr(), getNextMondayStr() (+11 more)

### Community 40 - "cms"
Cohesion: 0.22
Nodes (9): command, container_name, image, networks, ports, restart, volumes, working_dir (+1 more)

### Community 41 - "environment"
Cohesion: 0.31
Nodes (9): environment, CORS_ORIGINS, JWT_SECRET, MONGODB_URI, NEXT_PUBLIC_API_URL, NODE_ENV, PORT, environment (+1 more)

### Community 42 - "healthcheck"
Cohesion: 0.56
Nodes (9): healthcheck, interval, retries, start_period, test, timeout, healthcheck, healthcheck (+1 more)

### Community 43 - "mongodb"
Cohesion: 0.22
Nodes (9): MONGO_INITDB_DATABASE, container_name, environment, image, networks, ports, restart, volumes (+1 more)

### Community 44 - "2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved)"
Cohesion: 0.22
Nodes (8): 1. Thống kê Lỗi theo Mức độ, 2. Danh sách Lỗi đã Phát hiện & Đã Xác minh Sửa lỗi (Resolved), 3. Kiểm thử Phi chức năng & Bảo mật cơ bản, BUG-01: Nút chuyển nhanh vai trò (Quick Login) trên `web/` và `cms/` gửi mật khẩu mặc định chưa khớp với dữ liệu Seed của `server/`, BUG-02: Xử lý dữ liệu phản hồi tại `ImportTab.tsx` khi gọi `POST /api/v1/imports/:id/complete`, BUG-03: Hiển thị mã phiếu Trả/Đổi trong thông báo thành công tại `ReturnExchangeTab.tsx`, BUG-04: Bảng hóa đơn khổ K80 bị tràn ngang do mã sản phẩm dài và dính nền trang khi bấm In PDF, Báo cáo Lỗi (Bug Report) - 11Sport (v1.0)

### Community 46 - "Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS"
Cohesion: 0.25
Nodes (7): 1.1. Môi trường & Base URL, 1.2. Cơ chế Xác thực & Bảo mật (Authentication & Security), 1. Tổng quan về Wise API (Wise Platform / Payouts API), 2. Kiến trúc 5 bước chuẩn của Wise API, 3. Thiết kế UX/UI trên POS (`web/`) — Nút Stash Máy tính Wise, Tài liệu Nghiên cứu & Tích hợp Wise API vào Hệ thống 11Sport POS, Đặc thù kỹ thuật quan trọng với đồng `VND` trên Wise API:

### Community 47 - "db.ts"
Cohesion: 0.04
Nodes (60): mongoose, holidayRepo, AttendanceCheckInType, AttendanceModel, AttendanceSchema, AttendanceStatus, IAttendance, OvertimeStatus (+52 more)

### Community 48 - "Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`)"
Cohesion: 0.29
Nodes (6): 1. Thanh điều hướng & Chuyển vai trò nhanh, 2. Chi tiết luồng màn hình Nhập kho (`web/`), Các Module chính, Phần A: Giao diện `web/` (POS Bán hàng & Kho vận - Port `3000`), Phần B: Giao diện `cms/` (Quản trị - Port `3001`), Đặc tả Giao diện & Luồng màn hình - 11Sport (v1.0)

### Community 49 - "services.ts"
Cohesion: 0.10
Nodes (20): customerRepo, serviceTypeRepo, IServiceOrder, IServiceOrderItem, IServicePaymentRecord, ServiceDiscountType, ServiceOrderItemSchema, ServiceOrderModel (+12 more)

### Community 50 - "Dự án bán hàng 11 Sport"
Cohesion: 0.29
Nodes (6): Cấu trúc, Dự án bán hàng 11 Sport, graphify, Luồng làm việc & Hệ thống Subagents (11 Sport), Quy tắc chung cho mọi agent, Thư mục tài liệu

### Community 51 - "Dự án bán hàng 11 Sport"
Cohesion: 0.29
Nodes (6): Cấu trúc, Dự án bán hàng 11 Sport, graphify, Luồng làm việc, Quy tắc chung cho mọi agent, Thư mục tài liệu

### Community 52 - "Design System - 11Sport (POS, Kho & CMS)"
Cohesion: 0.33
Nodes (5): 1. Nhận diện Thương hiệu Thể thao (Athletic & High-Contrast POS), 2. Bảng màu (Color Tokens - TailwindCSS), 3. Typography & Định dạng hiển thị, 4. Các Component cốt lõi, Design System - 11Sport (POS, Kho & CMS)

### Community 53 - "3. Quy tắc Nghiệp vụ đã chốt (Business Rules)"
Cohesion: 0.17
Nodes (11): 1. Bối cảnh & Mục tiêu kinh doanh, 2. Vai trò người dùng & Phân quyền (RBAC), 3.1 Danh mục (Category) & Sản phẩm (Product), 3.2 Kế toán Kho & Sổ kho (Stock Movement), 3.3 Nhập kho (Import Receipt), 3.4 Bán hàng (POS Order) & Xuất PDF, 3.5 Trả / Đổi hàng (Return & Exchange), 3. Quy tắc Nghiệp vụ đã chốt (Business Rules) (+3 more)

### Community 54 - "promotions.ts"
Cohesion: 0.13
Nodes (20): promotionRepo, IPromotion, IPromotionConditionCategory, IPromotionConditionProduct, IPromotionGiftItem, PromotionConditionCategorySchema, PromotionConditionProductSchema, PromotionConditionType (+12 more)

### Community 56 - "cms/src/components/MyAttendanceCalendar.tsx"
Cohesion: 0.10
Nodes (34): addDaysIso(), AvailableOffDayOption, CreateLeaveModal(), fmtDate(), LEAVE_REASON_MAX, LEAVE_TYPE_META, LeaveFilter, MyLeaveRequestsPanel() (+26 more)

### Community 57 - "reports.ts"
Cohesion: 0.11
Nodes (18): serviceOrderRepo, DebtOrderRow, ProdStat, PushProdStat, reportsRouter, SalesActivity, SalesType, ServiceTypeStat (+10 more)

### Community 58 - "Skill GitHub gợi ý cho từng phòng ban"
Cohesion: 0.50
Nodes (3): Cài đặt (Claude Code), Cách dùng, Skill GitHub gợi ý cho từng phòng ban

### Community 60 - "ordersCustomers.ts"
Cohesion: 0.17
Nodes (15): DebtStatus, IDebtPaymentRecord, getOrderEffectiveShiftAndDate(), getSalesAllowedBillDates(), inferShiftCodeFromTime(), isOrderInSalesCurrentShift(), isSalesOnlyUser(), ORDER_MANAGER_ROLES (+7 more)

### Community 61 - "cms/src/app/api/printers/route.ts"
Cohesion: 0.23
Nodes (13): CODE128_PATTERNS, compactColorTokenForBarcode(), dynamic, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, GET(), isThermalPrinter() (+5 more)

### Community 67 - "InventoryTab.tsx"
Cohesion: 0.10
Nodes (41): BarcodeLabelItem, BarcodeLabelModal(), BarcodeLabelModalProps, CODE128_PATTERNS, encodeCode128Bars(), encodeCode128RawPattern(), escapeHtml(), FIXED_LABEL_CONFIG (+33 more)

### Community 69 - "productCode.ts"
Cohesion: 0.11
Nodes (36): buildRecodePlan(), brandTerms(), buildBrandSeedList(), EXTRA_ALIASES, findBrandExact(), findTermIndex(), knownBrandCandidates(), matchBrandInText() (+28 more)

### Community 70 - "web/src/app/api/printers/route.ts"
Cohesion: 0.27
Nodes (13): CODE128_PATTERNS, compactColorTokenForBarcode(), dynamic, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, GET(), isThermalPrinter() (+5 more)

### Community 71 - "types.ts"
Cohesion: 0.17
Nodes (6): migration, migration, migration, toObjectId(), Migration, MigrationContext

### Community 72 - "ShiftScheduleModule.tsx"
Cohesion: 0.18
Nodes (16): addDays(), DAY_NAMES, DragPayload, isStaffInRow(), keyOf(), mondayOf(), pad(), ROWS (+8 more)

### Community 73 - "attendance.ts"
Cohesion: 0.17
Nodes (20): attendanceConfigRepo, attendanceRepo, shiftHandoverRepo, AttendanceConfig, attendanceRouter, _dnsCache, extractClientIp(), fetchCurrentPublicWanIp() (+12 more)

### Community 74 - "2. Cấu hình Biến môi trường (Environment Variables)"
Cohesion: 0.50
Nodes (4): 2.1 `server/.env.example`, 2.2 `web/.env.example` (POS & Kho - Port 3000), 2.3 `cms/.env.example` (Quản trị - Port 3001), 2. Cấu hình Biến môi trường (Environment Variables)

### Community 75 - "ReturnExchangeTab.tsx"
Cohesion: 0.13
Nodes (34): CustomerTab(), CustomerTabProps, InvoicePdfModal(), InvoicePdfModalProps, buildFallbackPushProducts(), MarketingPushProductsTab(), parseLocalDateBound(), PushProductRow (+26 more)

### Community 76 - "cms/src/app/page.tsx"
Cohesion: 0.11
Nodes (41): CMS_MENU_ITEMS, CmsDashboardPage(), CmsModuleType, ROLE_ALLOWED_MODULES, AccountProfileModule(), AccountProfileModuleProps, getRoleDisplayName(), toIsoDateSlice() (+33 more)

### Community 77 - "Dashboard doanh thu — chuẩn hóa chỉ số & trả hàng đơn công nợ"
Cohesion: 0.17
Nodes (11): 10. Phiếu bàn giao → backend-dev, 1. Hiện trạng đã xác minh trong code, 2. Công thức chuẩn, 3. Ví dụ số (một đơn đủ các yếu tố), 4. User story, 5. Đặc tả sửa POST `/returns` & `/returns/calculate` với đơn công nợ, 6. Tiêu chí nghiệm thu (Given/When/Then), 7. Trường hợp biên (+3 more)

### Community 78 - "InventoryModule.tsx"
Cohesion: 0.11
Nodes (48): BarcodeLabelItem, BarcodeLabelModal(), ColorInputWithPicker(), ColorSwatchBadge(), getColorBoxBorderStyle(), inferColorHexesFromText(), normalizeTextForColorMatch(), resolveVariantColorHexes() (+40 more)

### Community 79 - "leaveRequests.ts"
Cohesion: 0.17
Nodes (22): addDaysToDateStr(), ADVANCE_NOTICE_DAYS_REQUIRED, assertAdvanceNoticeForLeaveRequest(), assertPaidLeaveQuota(), computePaidLeaveBalanceForStaff(), diffCalendarDays(), diffMonthsInclusive(), getConsecutivePaidLeaveCluster() (+14 more)

### Community 80 - "ReturnExchange.ts"
Cohesion: 0.20
Nodes (10): PaymentMethod, ExchangeItemSchema, IExchangeItem, IReturnExchange, IReturnItem, ReturnCondition, ReturnExchangeModel, ReturnExchangeSchema (+2 more)

### Community 81 - "web/src/components/ContractFilePreviewModal.tsx"
Cohesion: 0.40
Nodes (4): preparePreview(), dataUrlToArrayBuffer(), preparePreview(), dataUrlToArrayBuffer()

### Community 82 - "staffImportParser.ts"
Cohesion: 0.08
Nodes (39): attachUserContext(), errorHandler(), Express, Request, ContractType, IStaff, StaffDepartment, StaffModel (+31 more)

### Community 83 - "windowsPrinter.ts"
Cohesion: 0.20
Nodes (15): printersRouter, CODE128_PATTERNS, DirectPrintPayload, encodeCode128BPattern(), encodeCode128RawPattern(), execFileAsync, isThermalPrinter(), LabelPrintItem (+7 more)

### Community 84 - "recodeProducts.ts"
Cohesion: 0.10
Nodes (28): RFC-4180, ApplyOptions, applyRecode(), ApplyReport, assertLocalMongoUri(), backupDatabase(), bumpVersion(), CODE_FIELDS (+20 more)

### Community 85 - "productScheme.ts"
Cohesion: 0.10
Nodes (43): brandRepo, categoryRepo, assertUniqueName(), brandUsage(), cleanAliases(), countProductsByBrand(), ensureSystemBrand(), requireBrandManager() (+35 more)

### Community 86 - "Tiến độ dự án 11 Sport"
Cohesion: 0.32
Nodes (8): LeaveRequest, ShiftAssignment, 2.13 Quản trị Nhân sự, Chấm công & Xếp ca HRM (`/attendance`, `/leave-requests`, `/shifts`, `/holidays`) *(v4.0)*, A. Chấm công (`/attendance`), B. Đơn từ & Phê duyệt WFH / Nghỉ phép (`/leave-requests`), C. Xếp ca & Bàn giao Kho Tầng 1 (`/shifts`), D. Cấu hình Ngày Lễ (`/holidays`), E. Kiểm tra Phiên bản Build trên Web & CMS (`GET /api/version`)

### Community 87 - "holidays.ts"
Cohesion: 0.30
Nodes (13): convertSolar2Lunar(), externalHolidayCache, fetchNagerVietnamHolidays(), getLeapMonthOffset(), getLunarMonth11(), getMergedHolidayMap(), getNewMoonDay(), getSunLongitude() (+5 more)

### Community 88 - "Baseline kiểm thử server — 2026-11-12"
Cohesion: 0.17
Nodes (11): 1. Thực hiện đề xuất an toàn DB & cập nhật 4 file test theo chuẩn mã v3.2, 2. Đối chiếu nghiệm thu 16 tiêu chí `AC-01`..`AC-16` (`docs/requirements/doanh-thu-dashboard.md`), 3. Kết quả chạy toàn bộ Test Suite (`server`), 4. Phiếu bàn giao (QA-03), Baseline kiểm thử server — 2026-11-12, Báo cáo Nghiệm thu QA-03 (Sau khi chủ xác nhận quy chuẩn mã v3.2 & kiểm thử AC-01..AC-16), Kết quả tổng, Nguyên nhân gốc — MỘT nguyên nhân chung (+3 more)

### Community 89 - "2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*"
Cohesion: 0.18
Nodes (11): 2.19 Chuẩn hoá Mã Sản Phẩm `CATE + BRAND + VERSION + MÀU + SIZE`, Thương hiệu (`/brands`) & Giá theo biến thể *(v5.0)*, A. Quy tắc mã, B. Thương hiệu (`/brands`), C. Category — trường mới, D. Product — trường mới (response `GET /products`, `POST/PATCH /products`), E. `POST /api/v1/products/preview-code` (xem trước mã, không ghi DB), H. `PATCH /api/v1/products/:id` — trường mới, I. `GET /api/v1/products/lookup?code=<mã quét>` (+3 more)

### Community 90 - "excel.ts"
Cohesion: 0.20
Nodes (16): CellValue, cellXml(), colLetter(), ColumnFormat, crc32(), CRC_TABLE, createXlsx(), escapeXml() (+8 more)

### Community 92 - "errors.ts"
Cohesion: 0.29
Nodes (6): express, fetchWiseQuoteRaw(), getWiseConfig(), SUPPORTED_CURRENCIES, WiseCurrencyInfo, wiseRouter

### Community 93 - "Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)"
Cohesion: 0.33
Nodes (5): 1. Vấn đề, 2. Quy tắc đã chốt, 3. Chuyển đổi dữ liệu cũ (CHỈ DB LOCAL), 4. Tiêu chí nghiệm thu, Chuẩn hoá mã sản phẩm: CATEGORY + BRAND + VERSION + MÀU + SIZE (v1)

### Community 94 - "2.10 Quản lý Loại Dịch Vụ & Đơn Dịch Vụ (`/service-types`, `/service-orders`)"
Cohesion: 0.67
Nodes (3): 2.10 Quản lý Loại Dịch Vụ & Đơn Dịch Vụ (`/service-types`, `/service-orders`), A. Danh mục Loại Dịch Vụ (`/service-types`), B. Quản lý Đơn Dịch Vụ (`/service-orders`)

### Community 95 - "StaffModule.tsx"
Cohesion: 0.18
Nodes (13): ContractFilePreviewModal(), ContractFilePreviewModalProps, EditableImportRow, formatMoneyInput(), parseMoneyInput(), StaffModule(), toIsoDateSlice(), CONTRACT_TYPE_OPTIONS (+5 more)

### Community 96 - "Migration DB — 11 Sport"
Cohesion: 0.33
Nodes (5): Cơ chế an toàn, Lệnh, Migration DB — 11 Sport, Migration hiện có, Quy trình deploy (bắt buộc)

### Community 97 - "tagMatch.ts"
Cohesion: 0.22
Nodes (16): compactColorTokenForBarcode(), estimateCode128Dots(), isCompactBarcodeMatchVariant(), normalizeToUpperCode(), toCompactBarcode128(), collapseUnikeyBackspaceStutter(), getBarcodeCandidatesServer(), isScannedCodeMatchServer() (+8 more)

### Community 98 - "HrmAttendanceModule.tsx"
Cohesion: 0.36
Nodes (9): HrmAttendanceModule(), SubTab, createHolidayApi(), deleteHolidayApi(), fetchHolidays(), fetchLeaveRequests(), fetchShiftSchedule(), reviewLeaveRequestApi() (+1 more)

### Community 99 - "orderLock.ts"
Cohesion: 0.50
Nodes (3): deepCloneSnapshot(), orderLocks, withOrderLock()

### Community 100 - "Tiến độ dự án 11 Sport"
Cohesion: 0.25
Nodes (7): downloadStaffImportTemplate(), 5.1 Sao lưu (Backup), 5.2 Khôi phục (Restore), 5. Sao lưu & Khôi phục Cơ sở dữ liệu (MongoDB Backup & Restore), Tiến độ dự án 11 Sport, TagCheckScannerModalProps, ImportReceipt

## Knowledge Gaps
- **2 isolated node(s):** `PATH`, `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 683 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StockMovement` connect `StockMovement` to `Tài liệu Triển khai & Vận hành (Deployment & Runbook) - 11Sport v1.0`, `Tiến độ dự án 11 Sport`, `InventoryModule.tsx`, `cms/src/lib/api.ts`, `InventoryModule.tsx`, `3. Quy tắc Nghiệp vụ đã chốt (Business Rules)`, `CameraScannerModal.tsx`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **What connects `PATH`, `RFC-4180` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `productCode.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12375533428165007 - nodes in this community are weakly interconnected._
- **Why does `2.6 Trả / Đổi hàng (`/returns`)` connect `StockMovement` to `2. Danh sách Endpoints`, `ordersCustomers.ts`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `attendanceTimesheet.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._
- **Why does `executeUnpackSetToRetail()` connect `ordersCustomers.ts` to `StockMovement`, `productScheme.ts`, `ordersCustomers.ts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `MyAttendanceCalendar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054612054612054615 - nodes in this community are weakly interconnected._