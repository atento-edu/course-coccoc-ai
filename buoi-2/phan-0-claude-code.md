# Buổi 2 · Phần 0: Làm quen Claude Code

Slide: `phan-0-claude-code.html`, 24 slide. Gửi học viên đọc trước buổi, mất khoảng
15 phút. Trên lớp chỉ dành 5 phút kiểm tra máy và nhắc vòng lặp 4 bước, không giảng
lại. Phần cài đặt, quyền và hoàn tác được dùng lại liên tục ở Phần 4.

## Cấu trúc

Mỗi phần có một slide nền xanh nêu ý chính, rồi một hoặc hai slide ví dụ.

| Phần | Ý chính | Ví dụ minh hoạ |
|---|---|---|
| 0. Chat vs Code | Cùng model, nhưng Code có tay: đọc, sửa file và chạy lệnh | Một app hai tab; một dự án là một thư mục |
| 1. Cài đặt | Cài trong 5 phút: tải app Claude, mở tab Code | Bốn bước cài; năm lệnh terminal đủ dùng |
| 2. Vòng lặp | Giao việc → đọc diff → chạy thử → chốt, vòng ngắn | Bốn bước; giao sơ sài và giao đủ ý; `CLAUDE.md` |
| 3. Đọc diff | Diff là bản ghi những gì đã đổi, đọc trước khi đồng ý | Một diff thật trong `lib/scoring.ts`; ba câu hỏi khi đọc |
| 4. Quyền | Quyền là phanh, mỗi lần đồng ý là nhận trách nhiệm | Bảng tự động / hỏi / chặn cho 6 loại việc |
| 5. Hoàn tác | Không commit thì không có mốc quay về | Bốn lệnh git; commit nhỏ trước mỗi vòng; nhánh thử |
| 6. Lỗi thường gặp | Agent hỏng, nhưng hỏng rất tự tin | Sáu kiểu hỏng: sửa tràn lan, bịa API, sửa mãi không xong, làm hỏng thứ đang chạy, báo “đã xong”, thêm thư viện |
| 7. An toàn | Máy bạn là môi trường thật | Năm điều không làm: dữ liệu thật, `.env`, lệnh lạ, duyệt mù, prompt injection |
| 8. Trước buổi | Đến lớp với máy đã sẵn sàng | Checklist 7 mục kèm lệnh kiểm tra |

Slide cuối là bảng tra “Gặp chuyện này thì làm gì”, dùng khi học viên gặp sự cố ở
Phần 4.

## Việc cần làm trước khi gửi

- [ ] Kiểm tra lại lệnh cài với tài liệu Claude Code hiện hành. Bản này theo
      code.claude.com/docs/en/setup (11/2026): app Claude có tab Code, không cần Node;
      CLI cài bằng `curl -fsSL https://claude.ai/install.sh | bash` (Windows:
      `irm https://claude.ai/install.ps1 | iex`), không dùng npm toàn cục.
- [ ] Xác nhận workspace Cốc Cốc đã bật Claude Code chưa, dùng tài khoản nào (Pro/Max
      hay Team), và tab Code đã mở được bằng tài khoản đó chưa. Bản free không có Code.
- [ ] Kiểm tra tên gọi trong giao diện quyền: tự đồng ý sửa file, danh sách từ chối,
      checkpoint. Sửa lại slide 15 và ghi chú slide 17 nếu bản hiện tại khác.
- [ ] Nếu lớp dùng Windows: bổ sung một dòng về PowerShell/Git Bash, `Ctrl+C`, Docker
      Desktop cần WSL. Có thể thêm vào slide 7.
- [ ] Kiểm tra repo mẫu đã có `CLAUDE.md` (hoặc `AGENTS.md`; repo hiện có `AGENTS.md`
      do Next.js sinh) và `.gitignore` chặn `.env` chưa. Nếu chưa, thêm trước buổi.
- [ ] Chạy thử toàn bộ checklist trên một máy sạch, bấm giờ. Mục nào quá 5 phút thì
      tách thành việc chuẩn bị trước.
- [ ] Chụp màn hình thật hộp thoại quyền và một diff trong Claude Code để thay phần
      minh hoạ bằng chữ, nếu có thời gian.
- [ ] Gửi link `/buoi-2/phan-0-claude-code.html`, hoặc bản PDF in bằng `Ctrl/Cmd + P`
      (mỗi slide một trang).

## Trên lớp

- Phút 10–15: mở slide checklist, hỏi ai chưa chạy được `npm run dev`. Ai xong rồi
  thì sang repo mẫu, không chờ. Máy chưa cài được thì hẹn hỗ trợ riêng sau buổi,
  không sửa máy cho cả lớp xem.
- Khi học viên gặp sự cố ở Phần 4, chỉ về đúng dòng trong bảng cuối: sửa lan → đọc
  diff; app không chạy → hoàn tác; “đã xong” → bắt chạy thử.
- Nhắc lại một câu trước khi vào Phần 1: **commit trước mỗi vòng, không bật tự đồng ý
  ở buổi học.**
