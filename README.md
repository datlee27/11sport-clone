# 11Sport — Hệ thống Quản lý Bán hàng (POS), Kho vận & Quản trị (CMS)

Hệ thống quản lý bán hàng tại quầy (POS), kiểm kho bằng OCR, chấm công nhân sự theo IP và quản trị vận hành cho cửa hàng **11Sport**.

---

## Kiến trúc & Cấu trúc thư mục

Dự án gồm 3 ứng dụng chính kết nối với cơ sở dữ liệu MongoDB:

| Thành phần | Thư mục | Công nghệ chính | Port mặc định | Mô tả |
| --- | --- | --- | --- | --- |
| **Backend API** | `server/` | Node.js, Express, TypeScript, Mongoose | `4000` | REST API `/api/v1`, nghiệp vụ đơn hàng, kho, OCR, chấm công, báo cáo |
| **POS & Kho vận** | `web/` | Next.js 14, React 18, Tailwind CSS | `3000` | Giao diện bán hàng tại quầy, kiểm kho, hóa đơn PDF, chấm công |
| **Quản trị CMS** | `cms/` | Next.js 14, React 18, Tailwind CSS | `3001` | Trang quản trị danh mục, tồn kho, đơn hàng, công nợ, khuyến mãi, nhân sự |
| **Database** | Docker / Local | MongoDB 7.0 | `27017` | Lưu trữ dữ liệu (tự fallback `mongodb-memory-server` khi dev nếu chưa bật DB) |

### Cấu trúc thư mục gốc

```text
11sport-IT/
├── server/                       # Backend Express + TypeScript (Port 4000)
│   └── src/
│       ├── config/               # Kết nối DB & cấu hình hệ thống
│       ├── middleware/           # Auth & xử lý lỗi
│       ├── migrations/           # Bộ migration MongoDB tự viết (CLI)
│       ├── models/               # Mongoose schemas
│       ├── routes/               # API routers (/api/v1/*)
│       ├── scripts/              # Seed dữ liệu dev & import tồn kho
│       └── utils/                # Tiện ích (OCR, in ấn, thời gian, ...)
├── web/                          # Frontend POS & Kho vận - Next.js (Port 3000)
├── cms/                          # Frontend Quản trị CMS - Next.js (Port 3001)
├── docs/                         # Tài liệu dự án (BA, Design, API Contract, DevOps, Test)
├── scripts/                      # Script hỗ trợ (pre-commit-graphify.sh)
├── docker-compose.yml            # Khởi chạy MongoDB + server + web + cms bằng Docker
├── render.yaml                   # Cấu hình deploy server lên Render
├── start-dev.sh                  # Script chạy nhanh local (macOS / Linux)
├── start-dev.ps1                 # Script chạy nhanh local (Windows PowerShell)
└── KetNoiMayInTem-11Sport.bat    # Công cụ cấu hình máy in tem 2 cột 70x20mm (Windows)
```

---

## Tính năng chính

- **POS & Bán hàng (`web/`)**:
  - Tạo đơn hàng tại quầy, quản lý khách hàng, áp dụng khuyến mãi và dịch vụ đi kèm.
  - Xử lý trả/đổi hàng, giao ca và theo dõi hóa đơn theo ca.
  - Xuất hóa đơn PDF (K80/A4), in tem mã vạch sản phẩm.
  - Máy tính quy đổi tỷ giá & chuyển tiền nhanh tích hợp Wise API.
- **Kho vận & Kiểm hàng OCR (`web/` & `server/`)**:
  - Quản lý nhập hàng, tồn kho và biến động sổ kho.
  - Quét kiểm hàng / đọc tem tag qua Camera, ảnh hoặc PDF (ưu tiên Gemini Vision khi có `GEMINI_API_KEY`, tự động fallback `tesseract.js`).
- **Nhân sự & Chấm công (`web/`, `cms/`, `server/`)**:
  - Chấm công theo IP mạng Wi-Fi / DDNS của từng cơ sở (cố định múi giờ `Asia/Ho_Chi_Minh`).
  - Đăng ký ca làm việc, quản lý bảng công, đơn xin nghỉ phép và ngày lễ.
- **Quản trị CMS (`cms/`)**:
  - Bảng điều khiển doanh thu, báo cáo và xuất Excel.
  - Quản lý danh mục, sản phẩm, tồn kho, đơn hàng/trả hàng, công nợ, khuyến mãi, dịch vụ và hoạt động nhân viên.

---

## Yêu cầu hệ thống

- **Node.js** (khuyến nghị v20+) và **npm**
- **MongoDB 7.0+** hoặc **Docker** (tùy chọn khi phát triển local vì `server` hỗ trợ fallback sang `mongodb-memory-server`)

---

## Hướng dẫn chạy Local (Development)

### Cách 1: Chạy nhanh bằng script có sẵn (Khuyên dùng)

**macOS / Linux:**
```bash
./start-dev.sh
```

**Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

Script sẽ tự động kiểm tra Node.js, tạo file `.env` / `.env.local` (nếu chưa có), kiểm tra MongoDB ở cổng `27017` và khởi chạy đồng thời cả 3 dịch vụ:
- **Server API**: `http://localhost:4000/api/v1` (Health check: `http://localhost:4000/api/v1/health`)
- **Web POS & Kho**: `http://localhost:3000`
- **CMS Quản trị**: `http://localhost:3001`

### Cách 2: Chạy bằng Docker Compose

```bash
docker compose up -d
```

Kiểm tra trạng thái và log:
```bash
docker compose ps
docker compose logs -f server web cms
```

### Cách 3: Cài đặt & chạy thủ công từng dịch vụ

Mở 3 terminal riêng biệt:

```bash
# 1. Backend API (Port 4000)
cd server
cp .env.example .env
npm install
npm run dev

# 2. Web POS & Kho (Port 3000)
cd web
npm install
npm run dev

# 3. CMS Quản trị (Port 3001)
cd cms
npm install
npm run dev
```

---

## Biến môi trường

> Không commit file `.env` hoặc thông tin bí mật lên Git.

### Backend (`server/.env` — tham khảo `server/.env.example`)
- `PORT`: Cổng chạy server (mặc định `4000`).
- `TZ`: Múi giờ hệ thống (`Asia/Ho_Chi_Minh`, bắt buộc để chấm công đúng ngày/giờ).
- `MONGODB_URI`: Chuỗi kết nối MongoDB (ví dụ `mongodb://127.0.0.1:27017/11sport`).
- `JWT_SECRET`: Khóa bí mật ký token xác thực.
- `CORS_ORIGINS`: Danh sách domain frontend được phép gọi API (phân cách bằng dấu phẩy).
- `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_TAG_MODELS`: Cấu hình OCR qua Gemini Vision (nếu để trống sẽ dùng `tesseract.js`).
- `WISE_API_TOKEN`, `WISE_API_BASE_URL`, `WISE_PROFILE_ID`: Cấu hình Wise API (để trống sẽ dùng Wise Live Public Quote API).
- `ATTENDANCE_*`: Cấu hình kiểm tra IP/DDNS mạng Wi-Fi cho các cơ sở chấm công.

### Frontend (`web/.env.local` và `cms/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

---

## Các lệnh thường dùng

### Backend (`server/`)
| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy server chế độ development (hot-reload) |
| `npm run build` | Biên dịch TypeScript sang `dist/` |
| `npm start` | Chạy bản build production (`dist/index.js`) |
| `npm run lint` | Kiểm tra kiểu TypeScript (`tsc --noEmit`) |
| `npm test` | Chạy unit/integration test với Vitest |
| `npm run seed:dev` | Import tồn kho & tạo dữ liệu mẫu cho dev |
| `npm run migrate -- status` | Kiểm tra trạng thái DB migration |
| `npm run migrate -- up --dry-run` | Xem trước migration (không ghi DB) |
| `npm run migrate -- up` | Chạy các migration đang chờ |

### Frontend (`web/` và `cms/`)
| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy dev server (`web`: `3000`, `cms`: `3001`) |
| `npm run build` | Build production Next.js |
| `npm start` | Khởi động bản build production |
| `npm run lint` | Kiểm tra lint với `next lint` |

---

## Công cụ & Tài liệu liên quan

- **Hợp đồng API**: [`docs/api-contract.md`](docs/api-contract.md)
- **Trạng thái dự án**: [`docs/status.md`](docs/status.md)
- **Tài liệu triển khai & vận hành**: [`docs/devops/deployment-and-runbook.md`](docs/devops/deployment-and-runbook.md)
- **Hướng dẫn DB Migration**: [`docs/devops/migrations.md`](docs/devops/migrations.md)
- **Tài liệu yêu cầu / Thiết kế / Kiểm thử**: `docs/requirements/`, `docs/design/`, `docs/test/`
- **Cấu hình máy in tem (Windows)**: Chạy [`KetNoiMayInTem-11Sport.bat`](KetNoiMayInTem-11Sport.bat) để tự động thiết lập máy in tem 2 cột `70x20mm`.
