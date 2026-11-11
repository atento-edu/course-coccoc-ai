# Buổi 2 · Claude Code: từ bảng tính đến app CRM

> Bản đang dùng: `00-doc-truoc.html` (7 slide), `01-buoi-hoc.html` (31 slide),
> `02-cheat-sheet.html` (1 trang). File này là kế hoạch chi tiết của bản cũ; giữ lại
> để tham khảo runbook deploy, dữ liệu seed và bốn lát cắt.

## 1. Chốt hướng

- **Case chung:** CRM bán quảng cáo Cốc Cốc, dùng đúng bộ dữ liệu mô phỏng của Buổi 1
  (232 deal, 70 khách hàng, 677 hoạt động, 48 lead).
- **Không dùng social listening làm case thực hành.** Facebook đã chặn truy cập public
  group; phụ thuộc vào đó làm buổi học dễ gãy và đụng ToS. Social listening vẫn nằm
  trong danh sách 5 bài toán, nhưng là bài toán mở, không phải bài build.
- **Sản phẩm cuối buổi:** một đường link chạy được, có database, có phân quyền, có
  việc cần làm hằng ngày, có lịch chạy. Không phải file nằm trên máy giảng viên.

## 2. Câu định vị

> **Excel để phân tích. App để vận hành.**

Buổi 1 dùng AI để đọc, làm sạch và phân tích dữ liệu trên Sheets. Buổi 2 không làm lại
dashboard đó. Buổi 2 đóng gói **quy trình vận hành** thành một sản phẩm mà nhiều người
dùng được, có quy tắc, có nhắc việc, và mở bằng một đường link.

Nếu app chỉ để xem biểu đồ thì Excel/Sheets đã thắng. App phải làm được việc mà file
bảng tính làm không tốt.

## 3. CRM làm được gì mà file Excel không làm được

| Việc | File Excel/Sheets | App CRM |
|---|---|---|
| Nhiều người cùng nhập | Dễ khóa dòng, conflict, sinh ra "bản cuối", "bản cuối 2" | Mỗi người một phiên; dữ liệu về một chỗ, cập nhật ngay |
| Phân quyền | Chia sẻ cả file hoặc cả tab; khó chặn xem dòng của người khác | Sales chỉ thấy lead/deal của mình; manager thấy cả team |
| Kiểm soát nhập | Data validation vẫn bị dán đè, xóa công thức, lệch định dạng | Form bắt buộc, chặn chuyển giai đoạn sai, khóa ngoại, audit log |
| Việc tiếp theo | Người dùng tự lọc, tự nhớ, tự mở file | App đẩy queue "hôm nay gọi ai", đánh dấu quá hạn, deal nguội |
| Lead từ bên ngoài | Dán tay từ email/form | Form hoặc webhook đưa lead vào thẳng, tự chấm điểm và phân công |
| Thông báo | Không tự nhắc nếu không viết Apps Script/Power Automate | Email/Slack/Zalo khi SLA trễ, deal 14 ngày không tương tác |
| Điện thoại | Bảng tính gần như không dùng được khi đang đi gặp khách | Mở link, ghi hoạt động ngay sau cuộc gọi |
| Tích hợp | Điểm cuối; muốn nối phải tự viết script | Nối email, lịch, tổng đài, thanh toán, webhook |
| Báo cáo | Pivot làm lại mỗi kỳ; số liệu lệch nếu quên refresh | Dashboard live theo vai trò; báo cáo tuần chạy theo lịch |
| Lịch sử | Track changes hạn chế, dễ tắt | Audit log: ai đổi gì, khi nào |
| Quy mô | Vài chục nghìn dòng bắt đầu nặng | Database có index, phân trang, truy vấn theo vai trò |
| Phân phối | Gửi file, nhắc phiên bản, cài Excel | Một URL; cập nhật một lần cho tất cả |

**Điều ngược lại cũng phải nói:** Excel vẫn thắng ở phân tích khám phá, mô hình ad-hoc,
làm nhanh, không cần bảo trì. Vì vậy không build app để thay Excel. Build app cho phần
lặp lại, nhiều người, có quy tắc.

## 4. Case: CRM Hôm nay (bản đầy đủ)

Đây là **app tham chiếu** giảng viên dựng trước. Mỗi nhóm không build lại toàn bộ; mỗi
nhóm nhận một lát cắt và làm đến cuối (xem mục 8).

### 4.1 Người dùng và quyền

| Vai trò | Thấy gì | Làm gì |
|---|---|---|
| Sales | Lead, deal, khách hàng của mình | Nhập lead, cập nhật deal, ghi hoạt động, dời bước tiếp theo |
| Manager | Toàn bộ team | Xem tải việc, pipeline rủi ro, giao lead, đổi người phụ trách |
| Admin | Toàn bộ | Quản lý người dùng, danh mục, chỉ tiêu |

Bản lớp dùng **chọn người dùng** trong cookie để demo phân quyền. Production mới cần
đăng nhập thật; ghi rõ đây là phần cố tình để ngoài phạm vi.

### 4.2 Thực thể

| Bảng | Khóa | Trường chính | Quan hệ |
|---|---|---|---|
| `customers` | `id` | tên, ngành, phân khúc, ngân sách/năm, tỉnh, agency, sales, người liên hệ, trạng thái | 1 → nhiều deal |
| `leads` | `id` | thời điểm nhận, nguồn, công ty, ngành, ngân sách, agency, liên hệ, nhu cầu, sản phẩm quan tâm, sales, trạng thái, điểm, ưu tiên, SLA | 0..1 → customer; 0..1 → deal |
| `deals` | `id` | tên chiến dịch, khách hàng, sales, nguồn, định dạng, giá trị IO, giai đoạn, xác suất, ngày tạo, ngày chốt dự kiến/thực tế, bước tiếp theo, hạn bước tiếp theo, lý do thất bại | nhiều → 1 customer; 1 → nhiều activity |
| `activities` | `id` | ngày, deal, sales, loại (gọi/email/họp/gửi IO), nội dung | nhiều → 1 deal |
| `users` | `id` | tên, team, quản lý, tải tối đa | 1 → nhiều lead/deal |
| `audit_logs` | `id` | người, hành động, bảng, bản ghi, trước/sau, thời điểm | — |

### 4.3 Màn hình

1. `/` **Tổng quan** — KPI, pipeline, việc cần làm hôm nay, deal rủi ro.
2. `/leads` — danh sách, lọc, tạo/sửa/xóa, giao người, chuyển thành deal.
3. `/leads/[id]` — chi tiết lead, lịch sử, nút "nhận lead", "tạo deal".
4. `/deals` — bảng + kanban theo giai đoạn; kéo/thả hoặc đổi giai đoạn có kiểm tra.
5. `/deals/[id]` — chi tiết deal, hoạt động, bước tiếp theo, audit log.
6. `/customers` — danh sách, tạo/sửa/xóa.
7. `/customers/[id]` — hồ sơ 360: deal, hoạt động, pipeline, doanh số.
8. `/activities` — nhật ký toàn công ty, lọc theo sales/deal/loại.
9. `/reports` — báo cáo tuần, xuất CSV.
10. `/settings/users` — danh sách sales, team, tải việc.

### 4.4 Hành động và tự động hoá

- CRUD đầy đủ cho lead, deal, khách hàng. Hoạt động chỉ thêm/xoá: nhật ký không sửa để giữ lịch sử.
- Chuyển giai đoạn deal: bắt buộc đủ trường, tự tính xác suất, ghi audit.
- Ghi hoạt động: cập nhật `last_interaction_at`, đặt lại hạn bước tiếp theo.
- Chấm điểm lead theo ngân sách + nguồn + phân khúc; xếp ưu tiên; tính SLA.
- Giao lead: round-robin trong sales còn tải, hoặc manager chọn tay.
- Cảnh báo: deal quá hạn bước tiếp theo; deal mở >14 ngày không tương tác; lead trễ SLA.
- Báo cáo sáng 7:00: mỗi sales nhận danh sách việc hôm nay (email hoặc Slack).
- Xuất CSV theo bộ lọc hiện tại.

### 4.5 Ngoài phạm vi (ghi rõ trong spec)

- Đăng nhập thật, SSO, phân quyền theo phòng ban.
- Đồng bộ email/lịch hai chiều.
- Ứng dụng mobile native.
- AI chạy trong app (chỉ dùng Claude Code lúc build, không gọi API lúc chạy).
- Multi-tenant, thanh toán, hóa đơn.

## 5. Cấu trúc buổi (180 phút)

Phần 0 (24 slide) gửi học viên đọc trước, không chiếm thời gian trên lớp.

| Phút | Phần | Nội dung | Sản phẩm cuối phần |
|---|---|---|---|
| 0–10 | Mở đầu | Demo: điền form lead trên điện thoại → lead xuất hiện trên dashboard, được chấm điểm và giao cho sales. Chốt đích đến: một đường link. | Học viên thấy app trước khi học cách làm |
| 10–30 | 1. Kiểm tra máy và vào việc | Phần 0 gửi đọc trước; trên lớp kiểm tra máy, nhắc vòng lặp 4 bước, demo đầu tiên | Mỗi máy chạy được repo mẫu ở `localhost` |
| 30–55 | 2. Kiến trúc một website | Frontend/backend/database/API; schema CRM; request đi qua những đâu; **deploy bộ khung lên Vercel ngay** | Một URL trống nhưng đã chạy trên internet |
| 55–75 | 3. Chọn lát cắt và viết spec | 4 lát cắt; spec 1 trang; tiêu chí đúng; prompt giao việc | Mỗi nhóm có spec được nhóm khác đọc hiểu |
| 75–130 | 4. Xây dựng và kiểm thử | Schema → seed → list → detail → form → action → filter; kiểm dữ liệu biên; đọc lỗi | Lát cắt chạy được trên máy, có 5 test case |
| 130–170 | 5. Đưa app lên internet | GitHub → Vercel + Postgres; biến môi trường; migrate; seed; mật khẩu; tên miền; cron; rollback | Link công khai, có dữ liệu, có báo cáo theo lịch |
| 170–180 | Tổng kết | Nhóm khác dùng thử, ghi 3 lỗi; bài tập sau buổi | Danh sách lỗi và việc tiếp theo |

Nếu có 3h15, cộng 10 phút nghỉ và 5 phút demo cuối. Không cắt phần deploy.

## 6. Deploy là xương sống, không phải phần đuôi

Bản demo tham chiếu của giảng viên chạy tại `https://coccoc.atento.vn/crm`: nginx
proxy `/crm` sang container Next.js, database Postgres trong Docker. Học viên vẫn
deploy bản của mình bằng Vercel + Neon, hoặc dùng cùng cơ chế nếu có server riêng.
Điểm chung của cả hai cách: có URL, có database, có biến môi trường, có bảo vệ.

### 6.1 Deploy sớm ở Phần 2

Ngay sau khi hiểu kiến trúc, deploy bộ khung lên Vercel. Chưa cần database đúng, chưa
cần feature. Mục đích:

- Học viên thấy "app của mình đã ở trên internet" từ phút 50, không phải đợi cuối buổi.
- Phát hiện sớm lỗi tài khoản, quyền GitHub, biến môi trường.
- Mỗi lần thêm feature là một lần deploy lại; deploy thành thói quen, không phải sự kiện.

### 6.2 Runbook deploy cuối buổi

1. **Đưa code lên GitHub.** Tạo repo, commit, push. Kiểm tra `.env` không bị commit.
2. **Tạo Postgres.** Neon (hoặc Supabase), lấy connection string có `sslmode=require`.
3. **Import repo vào Vercel.** Chọn framework Next.js; set `DATABASE_URL`,
   `APP_PASSWORD`, `CRON_SECRET`.
4. **Chạy migration.** Từ máy: `npx prisma migrate deploy` trỏ vào DB production.
5. **Seed một lần.** `npm run db:seed` với dữ liệu mô phỏng; không seed dữ liệu thật.
6. **Deploy.** Push hoặc `vercel --prod`; mở link; kiểm tra 7 bước smoke test.
7. **Gắn bảo vệ.** Middleware mật khẩu chung; `noindex`; banner "dữ liệu mô phỏng".
8. **Bật lịch.** Vercel Cron gọi `/api/cron/digest` lúc 7:00; kiểm tra log lần chạy đầu.
9. **Gắn tên miền.** `*.vercel.app` trước; tên miền riêng sau nếu có.
10. **Rollback.** Vercel → Deployments → chọn bản trước → Promote.

### 6.3 Smoke test sau deploy

- [ ] Mở link bằng điện thoại, thấy dashboard.
- [ ] Tạo một lead mới; lead xuất hiện trong danh sách.
- [ ] Chấm điểm và giao đúng sales theo tải.
- [ ] Chuyển deal sang giai đoạn tiếp; xác suất đổi; audit có dòng mới.
- [ ] Ghi một hoạt động; `last_interaction_at` đổi; cờ quá hạn biến mất.
- [ ] Mở báo cáo tuần; số liệu khớp với Google Sheet cùng bộ lọc.
- [ ] Đăng xuất/đăng nhập lại; dữ liệu còn nguyên.

### 6.4 Bảo vệ bản demo

- Chỉ dùng dữ liệu hư cấu; không đưa dữ liệu khách thật lên.
- Mật khẩu chung đủ dài; không đặt trong repo.
- `robots.txt` chặn index; banner "Dữ liệu mô phỏng".
- Giới hạn dung lượng và rate limit ở API ghi.
- Backup: bật nhánh/branch của Neon hoặc `pg_dump` trước khi seed lại.

## 7. Stack

**Next.js (App Router, TypeScript) + Tailwind + Prisma + PostgreSQL.**

- Local: Postgres 16 qua Docker Compose.
- Production: Vercel + Neon (Postgres).
- Deploy: GitHub → Vercel; migration bằng Prisma; cron bằng Vercel Cron.
- Auth lớp học: chọn người dùng + mật khẩu chung; không dựng auth thật.

Lý do không dùng Flask/SQLite:

- Next.js gom frontend và backend vào một repo, một lệnh chạy, một lần deploy; Claude
  Code rất quen stack này.
- Postgres giống nhau ở local và production; SQLite trên Vercel không giữ được dữ liệu.
- Prisma cho nhìn thấy schema bằng một file đọc được, phù hợp người không chuyên.
- Vercel + Neon có free tier, deploy bằng GitHub, rollback một nút.

### 7.1 Cấu trúc repo mẫu

```
crm-app/
  app/
    page.tsx                 # dashboard
    leads/                   # list, detail, form
    deals/                   # list, kanban, detail
    customers/               # list, detail
    activities/
    reports/
    api/cron/digest/route.ts
  components/
  lib/
    db.ts                    # Prisma client
    auth.ts                  # user hiện tại, quyền
    scoring.ts               # chấm điểm lead, SLA
  prisma/
    schema.prisma
    seed.ts
  data/                      # 4 file CSV từ Buổi 1
  docker-compose.yml         # Postgres local
  .env.example
```

### 7.2 Dữ liệu seed

Lấy 4 file CSV từ Google Sheet CRM của Buổi 1: `Deals`, `Lead mới`, `Khách hàng`,
`Hoạt động`. Seed script đọc CSV, chuẩn hoá ngày `dd/mm/yyyy`, số có dấu phẩy, bỏ cột
tự tính, tạo `users` từ cột Sales + Team. Giữ nguyên số liệu để đối chiếu với Sheet.

## 8. Bốn lát cắt cho bốn nhóm

Mỗi nhóm làm một lát cắt đến cuối, gồm: màn hình, một thao tác ghi, một tự động hoá,
một lần deploy. Cả bốn lát cắt ghép lại thành app tham chiếu.

| Nhóm | Lát cắt | Màn hình | Thao tác ghi | Tự động hoá | Bài học chính |
|---|---|---|---|---|---|
| A | Lead inbox | Form công khai + danh sách lead | Tạo lead, giao sales | Chấm điểm, SLA, round-robin | Dữ liệu vào từ ngoài; validation |
| B | Pipeline | Kanban + chi tiết deal | Đổi giai đoạn, đặt bước tiếp theo | Cảnh báo quá hạn/nguội | Quy trình có ràng buộc; audit |
| C | Customer 360 | Danh sách + hồ sơ khách | Thêm hoạt động | Cập nhật tương tác cuối | Quan hệ dữ liệu; lịch sử |
| D | Manager view | Dashboard + báo cáo tuần | Giao lead, đổi người phụ trách | Cron 7:00 gửi digest | Phân quyền; tổng hợp; lịch chạy |

## 9. Việc trước buổi

- [ ] Chốt danh sách học viên, chia 4 nhóm, mỗi nhóm có một người dùng máy tốt.
- [ ] Kiểm tra từng máy: Node 22 LTS, Git, Docker, app Claude đã đăng nhập và mở
      được tab Code.
- [ ] Tạo sẵn 4 repo GitHub từ template, 4 project Neon, 4 project Vercel; mời nhóm.
- [ ] Chạy thử app tham chiếu từ đầu đến cuối trên một máy sạch, bấm giờ.
- [ ] Chuẩn bị sẵn 4 file CSV và script seed; thử seed trên Postgres trống.
- [ ] In runbook deploy 1 trang cho mỗi nhóm.
- [ ] Chuẩn bị demo mở đầu: form lead trên điện thoại → dashboard.
- [ ] Kiểm tra mạng lớp: GitHub, Vercel, Neon, npm registry không bị chặn.
- [ ] Chuẩn bị phương án dự phòng: một app đã deploy sẵn để chiếu nếu mạng hỏng.

## 10. Rủi ro và phương án

| Rủi ro | Phương án |
|---|---|
| Cài đặt môi trường quá lâu | Có repo template + Docker; trợ giảng; kiểm tra máy trước buổi |
| Deploy live thất bại vì mạng/tài khoản | Tài khoản tạo trước; app dự phòng đã deploy; runbook in giấy |
| Nhóm ôm quá nhiều feature | Chốt lát cắt ở Phần 3; spec ghi rõ "không làm gì" |
| Claude Code sửa hỏng | Commit trước mỗi vòng; `git diff`; hoàn tác; deploy bản trước |
| Dữ liệu thật bị đưa lên | Chỉ dùng CSV mô phỏng; banner; kiểm tra trước khi deploy |
| Hết giờ ở Phần 4 | Deploy sớm ở Phần 2; phần 5 có checklist, không phụ thuộc feature cuối |

## 11. Liên kết với Buổi 1

- Cùng bộ dữ liệu CRM, cùng câu hỏi: doanh số, pipeline, lead nào cần gọi.
- Buổi 1 trả lời bằng phân tích trên Sheets; Buổi 2 trả lời bằng app có hành động.
- Kỹ năng Buổi 1 dùng lại: viết prompt, kiểm chứng số, đọc bảng, phát hiện bất thường.
- Kỹ năng mới của Buổi 2: giao việc cho coding agent, đọc diff, kiểm thử, deploy, bảo vệ
  dữ liệu.
