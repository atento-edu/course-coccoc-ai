# Buổi 2 · Việc cần chuẩn bị

Tài liệu cho giảng viên và trợ giảng. Không đưa vào image của trang tĩnh.

## 1. Chốt trước buổi

- [ ] Chốt số học viên, chia 4 nhóm, mỗi nhóm có một người dùng máy khỏe.
- [ ] Chốt case: CRM bán quảng cáo Cốc Cốc, cùng bộ dữ liệu Buổi 1. Không dùng
      social listening vì Facebook chặn public group và dễ đụng ToS.
- [ ] Chốt đích đến: mỗi nhóm có một đường link công khai, có mật khẩu, có dữ liệu.
- [ ] Xác nhận Cốc Cốc cho phép dùng Vercel/Neon hay cần môi trường nội bộ.

## 2. Máy học viên

Kiểm tra trước buổi, không kiểm tra tại lớp:

- [ ] Node 20 trở lên, npm chạy được.
- [ ] Git và tài khoản GitHub đăng nhập sẵn.
- [ ] Docker chạy được (dùng cho Postgres local).
- [ ] Claude Code đã cài và đăng nhập; thử `claude --version`.
- [ ] Mở được terminal tại thư mục dự án, chạy `npm install` không lỗi quyền.
- [ ] Trình duyệt Chrome/Edge bản mới; có DevTools.

## 3. Tài khoản và repo

- [ ] Tạo 4 repo GitHub từ template `buoi-2/crm-app/`, mời nhóm làm cộng tác viên.
- [ ] Tạo 4 project Neon (Postgres), mỗi nhóm một project, lấy connection string.
- [ ] Tạo 4 project Vercel, nối với repo, set biến môi trường.
- [ ] Tạo sẵn một app đã deploy để chiếu dự phòng nếu mạng lớp hỏng.
- [ ] Kiểm tra mạng lớp: GitHub, Vercel, Neon, npm registry không bị chặn.

## 4. Dữ liệu và app mẫu

- [ ] 4 file CSV nằm trong `crm-app/data/`: customers, deals, leads, activities.
- [ ] Chạy thử từ máy sạch:
  ```bash
  cd buoi-2/crm-app
  docker compose up -d
  npm install
  npm run db:push
  npm run db:seed
  npm run dev
  ```
- [ ] Đăng nhập thử cả ba vai trò: Quản lý, Quản trị, Sales.
- [ ] Thử tạo lead, giao sales, chuyển thành deal, ghi hoạt động, chuyển giai đoạn.
- [ ] Thử cron: `curl -H "Authorization: Bearer $CRON_SECRET" .../api/cron/digest`.
- [ ] Chụp lại màn hình nếu cần; ảnh mẫu đã có trong `buoi-2/img/`.

## 5. Trong buổi

| Phút | Việc | Ghi chú |
|---|---|---|
| 0–10 | Demo lead từ điện thoại → dashboard | Chiếu app đã deploy, không chạy local |
| 10–30 | Phần 1: kiểm tra máy và vào việc | Mỗi máy phải chạy được repo mẫu |
| 30–55 | Phần 2: kiến trúc + deploy bộ khung | Deploy ngay, chưa cần DB đúng |
| 55–75 | Phần 3: chốt lát cắt + spec | Thu spec trước khi code |
| 75–130 | Phần 4: build + test | Trợ giảng đi từng nhóm |
| 130–170 | Phần 5: deploy thật + cron + bảo vệ | Dùng runbook trong `crm-app/README.md` |
| 170–180 | Nhóm khác dùng thử, ghi lỗi | Mỗi nhóm ghi 3 lỗi |

## 6. Câu hỏi nên hỏi trên lớp

- “Việc này Excel làm được không? Nếu được thì đừng build app.”
- “Dữ liệu này vào app bằng cách nào? Ai nhập? Có kiểm tra gì?”
- “Nếu sales A mở link của sales B thì chuyện gì xảy ra?”
- “Deploy xong, làm sao biết app còn sống?”
- “Nếu bản mới hỏng, rollback bằng cách nào?”
- “Dữ liệu thật có được đưa lên bản demo không?”

## 7. Sau buổi

- [ ] Gửi lại slide, link app mẫu, repo template và runbook deploy.
- [ ] Ghi danh sách lỗi các nhóm gặp để sửa template.
- [ ] Nhắc học viên tắt project Vercel/Neon không dùng để tránh phí.
- [ ] Chốt việc tiếp theo: nhóm nào muốn đưa lát cắt vào công việc thật.
