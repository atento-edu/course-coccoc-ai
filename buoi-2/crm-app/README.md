# CRM Cốc Cốc — app mẫu Buổi 2

App CRM bán quảng cáo dùng bộ dữ liệu mô phỏng của Buổi 1: lead, deal, khách hàng,
hoạt động, báo cáo, phân quyền theo vai trò, cron báo cáo sáng và deploy lên internet.

## Chạy trên máy

```bash
# 1. Postgres
docker compose up -d

# 2. Cài package
npm install

# 3. Tạo schema + dữ liệu mẫu
npm run db:push
npm run db:seed

# 4. Chạy
npm run dev
# http://localhost:3000
```

Copy `.env.example` thành `.env` nếu chưa có. `DATABASE_URL` mặc định trỏ vào
Postgres ở cổng `5433` (tránh đụng Postgres khác trên máy).

## Tài khoản demo

Không có đăng nhập thật. Góc trái có ô đổi người dùng:

- **Nguyễn Mai Anh** — Quản lý, thấy toàn bộ.
- **Quản trị hệ thống** — Quản trị, thấy toàn bộ.
- Các tên còn lại — Sales, chỉ thấy lead/deal/khách hàng của mình.

Thử đổi sang một sales rồi mở `/deals`: số deal sẽ giảm. Đây là phần phân quyền
theo dòng (row-level) mà file Excel/Sheets khó làm.

## Dữ liệu

`data/*.csv` lấy từ Google Sheet CRM của Buổi 1, dữ liệu hư cấu, chốt ngày
31/10/2026. Seed đọc CSV, chuẩn hoá ngày `dd/mm/yyyy`, số có dấu phẩy, bỏ cột tự
tính, tạo người dùng từ cột Sales + Team.

App dùng mốc `31/10/2026` làm "hôm nay" (`lib/clock.ts`) để cảnh báo quá hạn khớp
với số liệu trong Sheet. Đây là quy ước của bản mô phỏng, không phải ngày thật.

## Cấu trúc

```
app/
  page.tsx                  Dashboard
  leads/                    Danh sách, tạo, sửa, chi tiết, chuyển thành deal
  deals/                    Bảng + kanban, chi tiết, hoạt động, chuyển giai đoạn
  customers/                Danh sách, hồ sơ 360
  activities/               Nhật ký toàn công ty
  reports/                  Báo cáo năm, theo sales/nguồn/định dạng/ngành
  settings/users/           Người dùng và tải việc
  api/cron/digest/          Báo cáo sáng (JSON, bảo vệ bằng CRON_SECRET)
  api/export/deals/         Xuất CSV
  api/health/               Kiểm tra app + database
app/actions/                Server actions: create/update/delete, audit log
lib/                        Prisma client, auth, format, scoring, clock
prisma/schema.prisma        Schema
prisma/seed.ts              Seed từ CSV
proxy.ts                    Basic Auth cho bản deploy
vercel.json                 Cron 7:00 sáng (00:00 UTC)
```

## Deploy lên internet

1. **GitHub.** Tạo repo, push code. Kiểm tra `.env` không bị commit.
2. **Postgres.** Tạo project Neon (hoặc Supabase), lấy connection string có
   `sslmode=require`.
3. **Vercel.** Import repo, chọn Next.js. Đặt biến môi trường:
   - `DATABASE_URL` — connection string production.
   - `APP_PASSWORD` — mật khẩu chung cho bản demo.
   - `CRON_SECRET` — chuỗi bí mật cho cron.
4. **Migration.** Từ máy, trỏ `DATABASE_URL` vào DB production rồi chạy:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
   (Lần đầu có thể dùng `prisma db push` nếu chưa tạo migration.)
5. **Deploy.** Push lên GitHub hoặc `vercel --prod`. Mở link, làm smoke test.
6. **Cron.** `vercel.json` đã đặt lịch 00:00 UTC = 07:00 giờ Việt Nam. Vercel tự
   gửi header `Authorization: Bearer $CRON_SECRET`. Thử bằng curl:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/cron/digest
   ```
7. **Bảo vệ.** `proxy.ts` bật Basic Auth khi `NODE_ENV=production` và có
   `APP_PASSWORD`. `robots.ts` chặn index. Chỉ dùng dữ liệu hư cấu.
   Lưu ý: proxy chạy ở Edge runtime, biến môi trường được inline lúc build. Khi
   self-host bằng Docker, nên khóa ở nginx (`auth_basic`) thay vì dựa vào biến
   runtime; repo khóa học đang làm vậy và để demo công khai vì dữ liệu hư cấu.

### Gắn vào site có sẵn dưới `/crm`

Nếu đã có một site nginx và muốn app nằm cùng domain (ví dụ
`https://coccoc.atento.vn/crm`), không cần Vercel:

1. Build với `NEXT_PUBLIC_BASE_PATH=/crm`. Dockerfile đã nhận build arg này.
2. Chạy app trong Docker cùng network với nginx, ví dụ service `crm-site-app`.
3. Thêm vào nginx:
   ```nginx
   location ^~ /crm {
       resolver 127.0.0.11 valid=10s ipv6=off;
       set $crm_upstream http://crm-site-app:3000;
       proxy_pass $crm_upstream;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
4. Trỏ `DATABASE_URL` vào Postgres trong cùng network.
5. Chạy `npx prisma migrate deploy` và `npm run db:seed` một lần.

Lưu ý: dùng `location ^~ /crm` để các location regex `.js`, `.css`, `.html` của
site tĩnh không bắt mất asset của Next.js. Nếu site có CSP `form-action 'none'`,
phải override cho `/crm` thành `form-action 'self'`, nếu không form sẽ bị chặn.

Repo khóa học đang chạy đúng mô hình này; xem `docker-compose.yml` và `nginx.conf`
ở thư mục gốc.

### Smoke test sau deploy

- [ ] Mở link bằng điện thoại, thấy dashboard.
- [ ] Tạo lead mới; lead xuất hiện trong danh sách.
- [ ] Giao lead cho sales; trạng thái đổi.
- [ ] Chuyển lead thành deal; deal mở đúng khách hàng.
- [ ] Ghi hoạt động; tương tác cuối đổi.
- [ ] Chuyển giai đoạn; xác suất và giá trị kỳ vọng đổi; audit có dòng mới.
- [ ] Mở báo cáo; xuất CSV.
- [ ] Gọi `/api/health` thấy `ok: true`.
- [ ] Gọi cron bằng curl thấy JSON.
- [ ] Đổi sang sales khác; chỉ thấy dữ liệu của người đó.

## Lỗi thường gặp

- `Can't reach database server`: chưa chạy `docker compose up -d` hoặc sai cổng.
- `Chưa có người dùng`: chưa `npm run db:seed`.
- Vercel build lỗi Prisma: kiểm tra `postinstall` có `prisma generate` và
  `DATABASE_URL` đã đặt cho môi trường Preview/Production.
- Cron 401: `CRON_SECRET` trên Vercel khác với lúc gọi curl.
- Ngày lệch múi giờ: mọi hiển thị dùng `Asia/Ho_Chi_Minh`; đừng đổi sang giờ máy.
