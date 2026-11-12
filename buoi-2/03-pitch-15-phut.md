# Pitch 15 phút · Báo giá

> Deck: `03-bao-gia-15-phut.html` (10 slide). Dùng cho cả pitch 15 phút và
> buổi học 30–45 phút. Phần thực hành của buổi học vẫn là 15 phút cho mỗi người.

## 1. Hai nhịp, một deck

| Nhịp | Mở | Claude Code | Làm app | Kiến trúc | Chốt |
|---|---|---|---|---|---|
| Pitch 15' | 2' | 3' | 6' (demo nén) | 3' | 1' |
| Lớp 30–45' | 5' | 8' | 15' (mỗi người tự làm) | 6' | 3' + buffer |

Pitch thì giảng viên demo. Lớp thì học viên làm, giảng viên đi từng cặp.

## 2. Trước khi vào (5 phút)

- [ ] Mở sẵn 4 tab: app hoàn chỉnh, `/crm`, repo Pages mẫu, Claude Code với thư mục trống.
- [ ] Dán sẵn 2 prompt ra file nháp. Không gõ trước mặt khách.
- [ ] Một tờ báo giá in sẵn để chuyền tay.
- [ ] Ảnh chụp 4 bước GitHub Pages + link dự phòng, phòng khi mạng lớp hỏng.
- [ ] Điện thoại mở sẵn link app mẫu để chiếu "mở ở đâu cũng được".

## 3. Nhịp 15 phút

| Phút | Slide | Việc | Câu chốt |
|---|---|---|---|
| 0–2 | 1–2 | Chiếu 3 app, chốt hôm nay làm cái thứ nhất | “Ba thứ, ba mức độ.” |
| 2–5 | 3–5 | Chat vs Code, 4 tính năng, 4 dòng giao việc | “Khác biệt là quyền ghi file.” |
| 5–11 | 6–8 | Demo prompt 1, prompt 2, deploy | “Từ trang trắng đến link trong 6 phút.” |
| 11–14 | 9 | FE/BE/DB, khi nào cần | “Một file là FE; cả team cần bốn tầng.” |
| 14–15 | 10 | Chốt, việc tiếp theo | “Đo bằng báo giá làm được.” |

## 4. Demo 6 phút

1. Mở thư mục `bao-gia-demo` trắng, chỉ có `index.html` trống.
2. Prompt 1 → chạy → mở trình duyệt.
3. Prompt 2 → bấm Tính → đối chiếu một dòng bằng máy tính.
4. GitHub: tạo repo → upload → bật Pages → nhận link. Mở link trên điện thoại.
5. Nếu mạng hỏng: chiếu link dự phòng và nói rõ “bước này đã chạy”.

Không sửa CSS, không thêm dòng hàng, không đổi màu trong lúc demo. Mỗi lần một việc.

## 5. Nhịp 30–45 phút

| Phút | Việc | Sản phẩm |
|---|---|---|
| 0–5 | Mở 3 app, chốt đích | Thấy đích |
| 5–13 | Chat vs Code, 4 tính năng, 4 dòng giao việc | Hiểu cách giao việc |
| 13–28 | Mỗi người dựng trang + tính tiền | Một trang chạy được |
| 28–31 | Nghỉ | |
| 31–41 | GitHub Pages, mở link, kiểm trên điện thoại | Một link |
| 41–45 | Kiến trúc FE/BE/DB, chốt, việc 7 ngày | Hiểu mình đang ở đâu |

Nếu lớp chậm: bỏ bước deploy cá nhân, cả lớp dùng chung một repo mẫu. Không cắt
phần kiến trúc.

## 6. Cắt gì khi trễ

- Bỏ prompt 2, dùng số tĩnh đã chuẩn bị.
- Bỏ deploy live, chiếu link có sẵn.
- Không cắt slide 9 (kiến trúc) và câu “khi nào cần BE/DB”.
- Không thêm CSV, chiết khấu, bản in A4 vào suất 15 phút.

## 7. Câu hỏi nên chờ

- “Cái này có thay hệ thống giá không?” — Không. Nó là bản nháp để gửi khách.
- “Ai bảo trì?” — Một file, sửa bằng Claude; không server, không database.
- “Dữ liệu khách nằm ở đâu?” — Repo public, chỉ dùng dữ liệu mẫu. Bản thật cần BE + DB.
- “Sao không dùng Excel?” — Excel để phân tích. App để in và gửi.
- “Học xong ai làm được?” — Người làm báo giá, không cần biết lập trình.

## 8. Sau pitch

- Gửi link deck, app mẫu và repo mẫu.
- Đề nghị pilot 5 sales, một việc thật, bảy ngày.
- Ghi lại hai chỗ khách hỏi nhiều nhất để sửa slide 3–5.
