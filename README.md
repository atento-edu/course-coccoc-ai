# Atento × Cốc Cốc — trang đề xuất đào tạo

Một trang HTML tĩnh để pitch chương trình 2 buổi × 3 giờ cho Cốc Cốc.

## Xem

```bash
cd /home/dw/coccoc
python3 -m http.server 8177
# mở http://localhost:8177
```

Mở trực tiếp `index.html` cũng được (font self-host tải bình thường).

## Nội dung

1. Hero + mạch hai buổi
2. Bốn câu hỏi (vấn đề)
3. Buổi 1 — Vận hành & Office (8 phần, không lộ lịch trình)
4. Buổi 2 — Claude Code: từ chat đến app, case mẫu social listening, 5 mẫu app để nhóm chọn (8 phần, không lộ lịch trình)
5. Bảng phủ 5 nhóm nhu cầu

Đã bỏ theo yêu cầu: Kết quả, Giới hạn, Cách học, Vì sao Atento, Bước tiếp theo.
Liên hệ nằm ở nút "Đặt lịch 30 phút" và footer (mailto).

## Thiết kế

- Màu lấy từ coccoc.com: xanh `#25AF50` / `#14842F`, cam `#F16037`, vàng `#FEEB59`,
  nền `#FAFAF6`, mực `#141814`.
- Chữ: SVN-Poppins (regular / semibold / bold), tải từ coccoc.com, self-host trong
  `assets/fonts/`. Bản quyền Poppins là OFL.
- Không dùng logo Cốc Cốc; thương hiệu chỉ xuất hiện dưới dạng chữ.
- In được: `Cmd/Ctrl + P` → A4, mỗi mục sang trang, nền trắng.

## Trước khi pitch, kiểm lại

- Số người (20–25), vai trò tham gia, và việc thật sẽ dùng trong lớp.
- Công cụ chuẩn của Cốc Cốc: Claude / Claude Code hay Copilot.
- Quyền dữ liệu: Facebook Graph API của page Cốc Cốc sở hữu, hay chỉ file export.
- Câu về Đỗ Thu Hương (HR Director tại Cốc Cốc) đang lấy từ hồ sơ công khai của
  Atento; cân nhắc cách nói nếu phía Cốc Cốc thấy nhạy cảm.
- Không có before/after hay cam kết tiết kiệm thời gian — giữ nguyên tinh thần này
  khi trả lời câu hỏi tại buổi pitch.

## Cấu trúc

```
index.html            # toàn bộ trang (CSS + JS inline)
assets/fonts/*.woff2  # SVN-Poppins
```
