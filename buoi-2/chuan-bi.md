# Buổi 2 · Việc cần chuẩn bị

Tài liệu cho giảng viên và trợ giảng. Không đưa vào image của trang tĩnh.

## 1. Chốt trước buổi

- [ ] Chốt số học viên và cách chia cặp (một người dùng máy khỏe ngồi cạnh một người mới).
- [ ] Chốt case: báo giá, dùng bảng giá mẫu 12 dòng.
- [ ] Chốt đích đến: mỗi người in được một tờ báo giá đúng số và có một link.
- [ ] Chốt host: một repo GitHub cho lớp, hoặc tài khoản GitHub của giảng viên.
- [ ] Xác nhận tài khoản Claude của học viên mở được tab Code.

## 2. Máy học viên

Kiểm tra trước buổi, không kiểm tra tại lớp:

- [ ] App Claude đã cài và đăng nhập.
- [ ] Mở được tab Code, không phải tab Chat.
- [ ] Thư mục `bao-gia` đã tải về, gồm `app.html`, `bang-gia.csv`, `CLAUDE.md`.
- [ ] Trình duyệt Chrome/Edge bản mới.
- [ ] Đã thử nhắn Claude một câu trong tab Code.

Không cần Node, npm, Git, Docker, tài khoản Vercel/Neon.

## 3. Host và dự phòng

- [ ] Tạo sẵn repo `bao-gia-demo` (Public) và bật Pages, để chiếu mẫu khi mạng lớp hỏng.
- [ ] Đặt sẵn `mau/app-hoan-chinh.html` trên repo demo để chiếu khi mạng lớp hỏng.
- [ ] Nhắc học viên: repo Pages là public, đừng để tên khách thật trong file HTML.
- [ ] Muốn link gọn (không có `/app.html`) thì đặt tên file trên repo là `index.html`.
      Trên slide dạy tên `app.html` cho khớp file local; nói miệng phần này nếu có người hỏi.
- [ ] Kiểm tra mạng lớp: github.com, `*.github.io` và trang chương trình.
- [ ] Chuẩn bị USB hoặc thư mục chia sẻ chứa bộ file mẫu.
- [ ] Máy in hoặc một máy có driver PDF để chiếu phần in A4.

## 4. Dữ liệu và app mẫu

- [ ] `mau/bang-gia.csv` có 12 dòng, đúng cột bảng giá thật.
- [ ] **Không dùng bảng giá thật** trong file phát cho học viên. Số trong CSV là số mẫu.
- [ ] Mở `mau/app-hoan-chinh.html`, thử: nạp CSV, thêm dòng, xoá dòng, đổi số lượng.
- [ ] Thử một đơn vượt trần (ví dụ 616 triệu với Pre-roll) để thấy dòng cảnh báo.
- [ ] Bấm In PDF, kiểm tra đúng một trang A4.
- [ ] Chạy thử 6 prompt trên một máy sạch, bấm giờ.
- [ ] Chuẩn bị 3–4 bản `app.html` đã dựng dở cho người tụt lại.

## 5. Trong buổi

| Phút | Việc | Ghi chú |
|---|---|---|
| 0–8 | Chiếu app, in thử một tờ | Không giải thích code |
| 8–28 | Cài đặt, chọn thư mục, đổi tiêu đề | Ai xong trước thì làm tiếp |
| 28–42 | Spec ba dòng, hoàn tác | Thu spec trước khi giao việc |
| 42–52 | Ba phần của app | Cắt còn 5 phút nếu chậm |
| 52–95 | Nạp bảng giá, thêm dòng, tính tiền, chiết khấu | Trợ giảng đi từng cặp |
| 105–140 | Bản in, câu hỏi 3 tháng, copy tóm tắt | Phần quyết định app có dùng được |
| 140–152 | Ba câu kiểm số | Học viên tự bấm, không đọc code |
| 152–170 | GitHub Pages, mở thử, kiểm trước khi gửi | Không cắt phần này |
| 170–180 | Việc đáng làm app, 7 ngày | Giao việc cụ thể |

## 6. Câu hỏi nên hỏi trên lớp

- “Báo giá này Excel làm được không? Nếu được thì đừng dựng app.”
- “Ai sở hữu bảng giá? Bao lâu đổi một lần?”
- “Khách đổi khối lượng thì mất bao lâu để ra con số mới?”
- “Nếu bậc nói 11% mà format chỉ cho 10%, ai duyệt?”
- “Bản in này gửi khách được chưa, hay còn phải sửa tay?”
- “Cái này có thay hệ thống giá không?”

## 7. Sau buổi

- [ ] Gửi lại slide, link app mẫu và file CSV.
- [ ] Ghi danh sách lỗi các cặp gặp để sửa file mẫu.
- [ ] Nhắc học viên làm ba báo giá thật trong tuần.
- [ ] Chốt việc tiếp theo: ai muốn đưa app vào quy trình báo giá thật.
