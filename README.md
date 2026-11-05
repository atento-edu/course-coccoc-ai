# Atento × Cốc Cốc — trang chương trình đào tạo

Một trang HTML tĩnh giới thiệu chương trình 2 buổi × 3 giờ cho Cốc Cốc.

## Xem

```bash
cd /home/dw/coccoc
python3 -m http.server 8177
# mở http://localhost:8177
```

Mở trực tiếp `index.html` cũng được (font self-host tải bình thường).

## Nội dung

1. Hero + mạch hai buổi
2. Năm nhóm việc cần AI hỗ trợ (vấn đề)
3. Buổi 1 — Vận hành & Office (5 mục, không lộ lịch trình)
4. Buổi 2 — Claude Code: từ chat đến app, case mẫu social listening (5 mục, không lộ lịch trình)

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
- Quyền dữ liệu: Facebook Graph API của page Cốc Cốc sở hữu, hay chỉ file export.
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
assets/media/CocCoc_Gioi_thieu_v5_90s.mp4  # video minh hoạ Phần 5 (Claude làm), nhúng trong slide
assets/media/flow-claude.mp4  # clip ghép Flow + Claude, nhúng trong slide 17
assets/media/voice-*.mp3      # audio mẫu VieNeu-TTS, nhúng trong slide 19
assets/media/story-*.jpg      # storyboard 7 cảnh, nhúng trong slide 3
```
