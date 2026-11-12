# Buổi 2 · Báo giá

> Bài giảng: ba file slide `phan-0-claude-code.html`, `phan-1-build-apps.html`, `phan-2-kien-truc.html` (37 slide).
> File mẫu: `mau/app.html`, `mau/app-hoan-chinh.html`, `mau/bang-gia.csv`.
> Bản CRM đầy đủ trong `crm-app/` chỉ để tham khảo ở cuối buổi.

## 1. Ý chính

Sales không học lập trình. Họ giao việc để có một công cụ dùng mỗi tuần.

Sản phẩm cuối buổi: một file `app.html` đọc bảng giá, ra tờ báo giá in được, một
link mở ở đâu cũng được, và một vòng lặp bốn bước đủ để tuần sau tự sửa.

Vì sao chọn báo giá thay vì bảng gọi khách: mỗi rep làm 3–10 báo giá một tuần,
mỗi báo giá 20–60 phút, sửa lại 2–3 lần khi khách đổi khối lượng. Đây là việc lặp
lại, có số, sai thì mất tiền hoặc mất uy tín. Bảng gọi khách chỉ tiết kiệm 10–15
phút mỗi ngày và chỉ có ích với người đã có kỷ luật.

## 2. Đổi gì so với bản trước

| Bản cũ | Bản đang dùng |
|---|---|
| Next.js + Prisma + Postgres + Vercel/Neon | Một file HTML + CSV + `@media print` |
| Cài Node, Docker, Git, tạo 3 tài khoản | Chỉ cài Claude Code |
| CRM 10 màn hình, 6 bảng | Một màn hình: chọn format, ra tờ báo giá |
| Deploy 10 bước, migration, cron | Upload lên GitHub, bật Pages, 4 bước |
| Case bảng gọi khách | Case báo giá |
| 96 slide | 37 slide, ba phần |

Lý do bỏ stack nặng: thời gian cài đặt và bảo trì, không phải bảo mật. Sales không
có 40 phút để sửa lỗi npm trên máy công ty, và không ai bảo trì app Next.js sau buổi.

## 3. App học viên dựng

**Báo giá**

- Nạp bảng giá từ file CSV (mã, tên, vị trí, đơn vị, đơn giá, trần chiết khấu).
- Chọn format, nhập số lượng, ra thành tiền theo đơn vị (CPM/CPC/CPT/gói).
- Chiết khấu theo bậc trên tạm tính; mỗi dòng không vượt trần của format đó.
- VAT 10% trên tiền sau chiết khấu.
- Bản xem trước và bản in A4 một trang, có số báo giá, điều khoản, chỗ ký.
- Copy tóm tắt để dán vào email hoặc Zalo.

App không thay hệ thống giá, không gửi email, không đồng bộ CRM. Nó tính đúng và
in ra tờ giấy mà khách nhìn thấy.

## 4. Vì sao một file HTML

| Tiêu chí | Một file HTML | Next.js + DB |
|---|---|---|
| Cài đặt | Không | Node, npm, Docker, Git |
| Chạy | Double-click | `npm install`, `npm run dev` |
| Deploy | Upload một file lên GitHub Pages | GitHub → Vercel → DB → migrate |
| Sửa sau buổi | Nhắn Claude, tải file mới | Build lại, deploy lại |
| In A4 | Có, bằng CSS | Có, nhưng nặng hơn |
| Nhiều người dùng chung, phân quyền | Không | Có |

Đánh đổi: không có bảng giá dùng chung, không phân quyền, không lịch sử báo giá.
Đó là việc của sales ops, và là nội dung của slide “Khi cả team cần dùng”.

## 5. Lịch 180 phút: ba phần

| Phút | Phần | Việc | Sản phẩm |
|---|---|---|---|
| 0–30 | **Phần 0 · Lý thuyết: Claude Code** | Chat khác Code, bốn nhịp làm việc, thư mục dự án, `CLAUDE.md`, quyền sửa file, cài đặt, vòng lặp bốn bước, đổi một dòng tiêu đề, spec ba dòng, sai thì nhắn lại | Máy sẵn sàng, 1 thay đổi chạy được |
| 30–140 | **Phần 1 · Build apps** | | |
| 30–35 | 1A Build HTML app | Chiếu app hoàn chỉnh, chốt đích đến | Thấy đích |
| 35–75 | 1A Build HTML app | Nạp CSV → thêm dòng → tính tiền → chiết khấu và trần → kiểm số | Ra đúng con số |
| 75–85 | Nghỉ | | |
| 85–115 | 1A Build HTML app | Bản in A4, câu hỏi “nếu 3 tháng”, copy tóm tắt | Một tờ gửi được |
| 115–140 | 1B Publish lên Internet | GitHub Pages, kiểm trước khi gửi, lần sau sửa thế nào | 1 link |
| 140–170 | **Phần 2 · Advanced: kiến trúc website** | Mở link thì chuyện gì xảy ra (tên miền, DNS, hosting, trình duyệt); HTML/CSS/JS; trang, dữ liệu, quy tắc; bốn tầng FE/API/BE/DB; khi nào một file không còn đủ; thực hành hỏi Claude về app của mình | Hiểu app nằm ở đâu |
| 170–180 | Chốt | Việc nào đáng làm app, 7 ngày | Việc tiếp theo |

Phần 2 không code thêm. Học viên dùng chính `app.html` vừa làm để hiểu kiến trúc.

Buffer nằm trong Phần 2. Nếu Phần 1 chậm, cắt Phần 2 xuống 20 phút (giữ slide “Khi
mở link”, “Bốn tầng”, “Khi nào một file không còn đủ”); không cắt phần bản in, phần
kiểm số và phần publish.

## 6. Spec mẫu

```
Việc: đọc bang-gia.csv, hiện danh sách format và tính thành tiền theo số lượng.
Xong khi: chọn hai format, thấy tạm tính, chiết khấu, VAT, tổng; số khớp máy tính.
Không đụng: file CSV và phần in.
```

## 7. Sáu prompt

1. **Đổi một câu** — đổi tiêu đề, có kết quả đầu tiên trong 2 phút.
2. **Nạp bảng giá** — nút chọn file, đọc bằng `FileReader`, hiện bảng.
3. **Thêm dòng hàng** — chọn format, nhập số lượng, tính theo đơn vị.
4. **Chiết khấu và trần** — bậc trên tạm tính, trần từng dòng, cảnh báo khi vượt.
5. **Bản in A4** — bản xem trước, `@media print`, một trang.
6. **Copy tóm tắt** — tên khách, từng dòng, tổng.

Mỗi prompt một việc. Không gộp. Không giải thích code.

## 8. Công thức dạy trên lớp

```
CPM:  đơn giá × số lượng ÷ 1.000
CPC:  đơn giá × số lượng
CPT:  đơn giá × số ngày
Gói:  đơn giá × số gói

Bậc: dưới 100 triệu 0% · 100–300 triệu 5% · 300–500 triệu 8%
      500 triệu–1 tỷ 11% · trên 1 tỷ 14%
Chiết khấu mỗi dòng: min(bậc, trần của format)
VAT 10%: tính trên tiền sau chiết khấu
```

Điểm dạy quan trọng nhất: bậc và trần có thể nói hai mức khác nhau. App phải lấy
mức thấp hơn và nói ra. Đây là lỗi hay gặp nhất khi báo giá bằng Excel.

## 9. Chuẩn bị

**Máy học viên** (kiểm tra trước một tuần):

- [ ] App Claude đã cài, đăng nhập, mở được tab Code.
- [ ] Thư mục `bao-gia` đã tải về (file bắt đầu + CSV + CLAUDE.md).
- [ ] Trình duyệt Chrome/Edge bản mới.
- [ ] Đã thử nhắn Claude một câu trong tab Code.

Không cần Node, npm, Git, Docker, tài khoản Vercel/Neon.

**Giảng viên:**

- [ ] Mở thử `mau/app-hoan-chinh.html`, in ra A4, đếm trang: phải đúng một.
- [ ] Chuẩn bị một bảng giá giả nhưng giống thật (12 dòng đã có sẵn).
- [ ] **Không dùng bảng giá thật của công ty** trong thư mục phát cho học viên.
- [ ] Chuẩn bị 3–4 bản `app.html` đã dựng dở để phát cho người tụt lại.
- [ ] Chạy thử toàn bộ 6 prompt trên một máy Windows sạch, bấm giờ.

**Dữ liệu:**

- [ ] `bang-gia.csv` 12 dòng, đúng cột bảng giá thật.
- [ ] Nếu dùng số thật: chỉ dùng trong buổi nội bộ, không đưa lên host công khai.
- [ ] Không dành thời gian trên lớp cho chủ đề bảo mật dữ liệu.

## 10. Không dạy

Git nhánh, Prisma, migration, Docker, auth/SSO, cron, subagent, MCP, hook, test
framework, API key, rollback, đấu thầu giá. Đưa vào một trang “việc tiếp theo” nếu
có người hỏi.

## 11. Đo thành công

- ≥ 80% học viên in được một tờ báo giá đúng số ngay trong buổi.
- ≥ 50% dùng app cho một báo giá thật trong 7 ngày.
- Mỗi người nêu được một việc khác đáng làm app (báo cáo cuối chiến dịch, radar
  gia hạn).
- Không có buổi học nào kết thúc mà học viên còn đang cài đặt.

## 12. Việc tiếp theo

1. Chạy thử bộ slide + 6 prompt trên một máy Windows sạch.
2. Xin ý kiến người sở hữu bảng giá trước khi dạy bằng số thật.
3. Pilot với 5 sales, sửa hai điểm vướng nhất.
4. Chốt có mở rộng thành 2 buổi (buổi 2: app thứ hai theo việc của từng người) không.
