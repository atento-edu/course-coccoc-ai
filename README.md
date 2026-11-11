# Atento × Cốc Cốc — trang chương trình đào tạo

Một trang HTML tĩnh giới thiệu chương trình 2 buổi × 3 giờ cho Cốc Cốc.

## Xem

```bash
cd /home/dw/course-coccoc-ai
python3 -m http.server 8177
# mở http://localhost:8177
```

Mở trực tiếp `index.html` cũng được (font self-host tải bình thường).

## Nội dung

1. Hero + mạch hai buổi
2. Năm nhóm việc cần AI hỗ trợ (vấn đề)
3. Buổi 1 — Vận hành & Office (5 mục, không lộ lịch trình)
4. Buổi 2 — Claude Code: từ bảng tính đến app CRM, deploy lên internet (5 mục + phần đọc trước)

Liên hệ nằm ở footer (mailto).

## Thiết kế

- Màu lấy từ coccoc.com: xanh `#25AF50` / `#14842F`, cam `#F16037`, vàng `#FEEB59`,
  nền `#FAFAF6`, mực `#141814`.
- Chữ: SVN-Poppins (regular / semibold / bold), tải từ coccoc.com, self-host trong
  `assets/fonts/`. Bản quyền Poppins là OFL.
- Không dùng logo Cốc Cốc; thương hiệu chỉ xuất hiện dưới dạng chữ.
- In được: `Cmd/Ctrl + P` → A4, mỗi mục sang trang, nền trắng.

## Lưu ý

- Số người (20–25), vai trò tham gia, và việc thật sẽ dùng trong lớp.
- Công cụ chuẩn của Cốc Cốc: Claude / Claude Code hay Copilot.
- Dữ liệu Buổi 2 là bộ CRM mô phỏng của Buổi 1; không dùng dữ liệu khách thật.
- Social listening không còn là case thực hành vì Facebook chặn truy cập public group.
- Câu về Đỗ Thu Hương (HR Director tại Cốc Cốc) đang lấy từ hồ sơ công khai của
  Atento; cân nhắc cách nói nếu phía Cốc Cốc thấy nhạy cảm.
- Không có before/after hay cam kết tiết kiệm thời gian — giữ nguyên tinh thần này
  khi trả lời câu hỏi.

## Slide Buổi 1

Mở `/buoi-1/` rồi bấm vào phần cần xem. Phần 0 (kiến thức nền) là tài liệu gửi
học viên đọc trước, trên lớp chỉ nhắc lại nhanh. Trong slide: `→` / `←`
hoặc nút ‹ › ở góc dưới để chuyển slide (bấm chuột không chuyển trang, để
bôi đen và copy được chữ), `F` toàn màn hình, `O` danh sách slide,
`B` màn hình đen, `?` phím tắt. Logo Atento × Cốc Cốc ở góc trên và nút ⌂
đưa về trang chủ https://coccoc.atento.vn/. `Ctrl/Cmd + P` in ra PDF, mỗi
slide một trang.

## Demo CRM

Bản demo chạy công khai tại **https://coccoc.atento.vn/crm**. Nút “Demo CRM” nằm ở
header và trong mục Buổi 2 của trang chương trình. Dữ liệu là dữ liệu mô phỏng, không
có thông tin khách thật.

Thành phần:

- `coccoc-ai` — nginx phục vụ trang tĩnh và proxy `/crm` sang app.
- `crm-site-app` — Next.js standalone, build với `basePath=/crm`.
- `crm-site-db` — Postgres, volume `crm-site-db-data`, chỉ mở cổng `127.0.0.1:5434`
  để chạy migration/seed từ máy chủ.

Chạy lại:

```bash
docker compose up -d --build coccoc-ai crm-site-app
```

Migration và seed lần đầu (hoặc khi muốn reset dữ liệu demo):

```bash
set -a; . ./.env; set +a
cd buoi-2/crm-app
export DATABASE_URL="postgresql://crm:${CRM_DB_PASSWORD}@localhost:5434/crm?schema=public"
npx prisma migrate deploy
npm run db:seed
```

Muốn khóa demo bằng mật khẩu: bỏ dấu `#` ở `auth_basic` và `auth_basic_user_file`
trong `nginx.conf`, rồi rebuild `coccoc-ai`. File `crm.htpasswd` đang dùng user `crm`,
mật khẩu `coccoc2026`.

## Slide Buổi 2

Mở `/buoi-2/`. Ba file:

- `00-doc-truoc.html` — 7 slide gửi học viên đọc trước: Code khác Chat,
  một dự án là một thư mục, cài đặt, ba lệnh terminal, vòng lặp bốn bước, checklist.
- `01-buoi-hoc.html` — 31 slide trên lớp. Một app xuyên suốt: CRM Hôm nay bản một
  màn hình. Bảy phần: đích đến, vòng lặp, bản đồ app, build danh sách, build form,
  kiểm thử và deploy, chốt.
- `02-cheat-sheet.html` — một trang A4: bốn bước, ba lệnh, năm prompt, bốn lỗi và
  ba điều không làm.

Bản cũ 5 phần nằm trong `buoi-2/phan-*.html`, vẫn mở được từ mục "Bản cũ" ở
`/buoi-2/`, để đối chiếu. Thiết kế của bản gọn: một ý mỗi slide, tối đa ba dòng,
một ví dụ CRM từ đầu đến cuối, phần lớn thời gian là thực hành.

App mẫu nằm trong `buoi-2/crm-app/` (Next.js + Prisma + Postgres) và đang chạy tại
`/crm`. Đọc `buoi-2/crm-app/README.md` để chạy local, deploy Vercel + Neon hoặc gắn
vào site có sẵn. Mã nguồn app bị loại khỏi Docker image của trang tĩnh.

## Cấu trúc

```
index.html                    # trang đề xuất (CSS + JS inline)
assets/fonts/*.woff2          # SVN-Poppins
assets/logos/                 # logo Atento (atento.vn) và Cốc Cốc (coccoc.com)
assets/media/                 # video, poster, audio mẫu và storyboard Phần 5 (dùng chung cho slide)
buoi-1/index.html             # mục lục tài liệu giảng Buổi 1 (/buoi-1/)
buoi-1/phan-0-ly-thuyet.html  # slide Phần 0: kiến thức nền AI, gửi đọc trước
buoi-1/phan-0-ly-thuyet.md    # việc giảng viên cần làm trước buổi (không đưa vào image)
buoi-1/phan-5-noi-dung-da-kenh.html  # slide Phần 5: nội dung đa kênh, video với Claude và Google Flow
buoi-1/phan-5-noi-dung-da-kenh.md    # cấu trúc, việc trước buổi, nguồn đã kiểm (không đưa vào image)
buoi-2/index.html             # mục lục tài liệu giảng Buổi 2 (/buoi-2/)
buoi-2/de-xuat-cau-truc-gon.md # lý do cắt gọn, so sánh với các khoá non-tech
buoi-2/ke-hoach.md            # kế hoạch buổi, case CRM, timing, deploy runbook
buoi-2/chuan-bi.md            # việc cần chuẩn bị cho giảng viên và trợ giảng
buoi-2/slide.css              # khung slide dùng chung
buoi-2/slide.js               # điều hướng slide dùng chung
buoi-2/00-doc-truoc.html      # đọc trước: 7 slide làm quen Claude Code
buoi-2/01-buoi-hoc.html       # 31 slide trên lớp: một app, một buổi
buoi-2/02-cheat-sheet.html    # một trang A4 in ra cho học viên
buoi-2/phan-0-claude-code.html       # bản cũ: đọc trước 24 slide
buoi-2/phan-0-claude-code.md         # cấu trúc, việc trước buổi (không đưa vào image)
buoi-2/phan-1-claude-code.html       # bản cũ
buoi-2/phan-2-kien-truc.html         # bản cũ
buoi-2/phan-3-spec.html              # bản cũ
buoi-2/phan-4-build.html             # bản cũ
buoi-2/phan-5-deploy.html            # bản cũ
buoi-2/img/*.png              # ảnh app mẫu dùng trong slide
buoi-2/crm-app/               # app mẫu Next.js + Prisma + Postgres (không copy vào image)
crm.htpasswd                  # mật khẩu tuỳ chọn cho /crm (user crm)
assets/media/CocCoc_Gioi_thieu_v5_90s.mp4  # video minh hoạ Phần 5 (Claude làm), nhúng trong slide
assets/media/flow-claude.mp4  # clip ghép Flow + Claude, nhúng trong slide 17
assets/media/voice-*.mp3      # audio mẫu VieNeu-TTS, nhúng trong slide 19
assets/media/story-*.jpg      # storyboard 7 cảnh, nhúng trong slide 3
```
