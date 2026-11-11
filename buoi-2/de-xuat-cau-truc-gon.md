# Đề xuất cấu trúc gọn cho Buổi 2

## 1. Kết luận trong một câu

Bản hiện tại là một khoá 2–3 ngày bị nén vào 3 giờ. Muốn gọn và dễ hiểu thì phải
giữ **một app**, **một vòng lặp**, **một kết quả**, và chuyển khoảng 60% nội dung
kỹ thuật sang phần đọc sau.

Không phải viết lại cho hay hơn. Phải bỏ bớt.

## 2. Các khoá Claude Code cho người không chuyên đang cấu trúc thế nào

| Khoá | Đối tượng | Thời lượng | Cấu trúc | Điều đáng học |
|---|---|---|---|---|
| **Claude Code 101** (Anthropic) | Người mới, có nền dev | 1,5 giờ / 12 bài | 4 phần: Code là gì → prompt đầu tiên → workflow hằng ngày → tuỳ biến (CLAUDE.md, subagent, MCP, hooks) | Tuỳ biến để **cuối cùng**. Học viên chỉ cần 1 workflow lặp lại: Explore → Plan → Code → Commit |
| **Claude Code in Action** (Anthropic) | Dev đã dùng Code | 1 giờ / 9 bài | 4 module: điều khiển phiên dài → cấu hình → tự động hoá → kiểm chứng | Rất hẹp, rất sâu. Không cố dạy mọi thứ |
| **Claude Code for Beginners** (Jared Hebb) | Chủ shop, freelancer, dân văn phòng | ~6,5 giờ / 8 module (30–90 phút/module) | Code là gì → cài → phiên thật đầu tiên → 5 mini-project → CLAUDE.md → Git → quyền → capstone website | **Có việc thật từ module 2**; module nào cũng ra một sản phẩm; cuối khoá có cheat sheet + glossary |
| **CC for Everyone** | Người không biết code | 4–5 giờ / 2 module | Nền tảng (3 giờ: file, workspace, subagent, CLAUDE.md) → vibe coding (1–2 giờ: lên kế hoạch, build, GitHub, deploy) | Chỉ **một** app. Học xong module 1 mới build |
| **The AI School – Claude Code Course** | Marketer, chủ shop, freelancer | 6 giờ 15 / 35 bài / 8 module | Nền AI → cài đặt → viết prompt → việc hằng ngày → video → landing page → agent → toolkit | Mỗi module là một món dùng được ngay, không phải lý thuyết |
| **Vibe Coding Academy – Claude Code for PMs** | PM | 3 buổi live × 1,5 giờ / 20 bài | Buổi 1: cài + prototype đầu tiên; buổi 2: skill + MCP; buổi 3: đưa prototype lên production | 4,5 giờ nhưng chỉ có **một** prototype xuyên suốt |
| **Product School – Claude Code for PMs** | PM đã có nghề | 6 buổi live / 12 giờ | Mỗi buổi một artifact: CLAUDE.md → đọc tài liệu khách → kiểm số → đọc codebase → báo cáo → capstone | Buổi nào cũng có sản phẩm nộp được, không có buổi "nghe giảng" |

Nguồn ở cuối file.

## 3. Bảy mẫu chung của các khoá này

1. **Một dự án xuyên suốt.** Không chia 4 nhóm làm 4 app khác nhau.
2. **Một module = một sản phẩm nhỏ**, 30–90 phút. Học xong là có thứ để chỉ.
3. **Thắng lần đầu trong 30–45 phút.** Không ai phải chờ đến cuối buổi mới thấy kết quả.
4. **Cài đặt và nền tảng để học trước**, không chiếm giờ trên lớp.
5. **Khái niệm chỉ dạy khi sắp dùng.** MCP, hook, subagent, phân quyền, cron đều ở cuối hoặc để tự học.
6. **Một vòng lặp duy nhất, nhắc lại ở mọi bước.** Ví dụ: mô tả → build → kiểm → sửa; hoặc Explore → Plan → Code → Commit.
7. **Kết thúc bằng một link công khai + cheat sheet 1 trang.** Không kết thúc bằng slide tổng kết.

## 4. Vì sao bản hiện tại nặng

Số liệu lấy từ chính repo:

- **96 slide**, trong đó **72 slide trên lớp** cho 180 phút. Trừ 60 phút thực hành,
  còn khoảng **1,5 phút/slide**.
- **24 slide đọc trước** — bản thân nó đã là một khoá con.
- **4 nhóm × 4 lát cắt khác nhau**: giảng viên phải chạy 4 đường hỗ trợ, mỗi học viên
  chỉ hiểu 1/4, không ai thấy tổng thể.
- **10 màn hình, 6 bảng, 3 vai trò, 10 bước deploy, 7 bước smoke test, 5 loại kiểm thử,
  6 kiểu hỏng** trong 3 giờ.
- **Deploy 2 lần** (Phần 2 và Phần 5), cộng migration, seed, biến môi trường, cron,
  tên miền, rollback.
- Hứa một sản phẩm "production" (đăng nhập, phân quyền, audit, lịch chạy) — người
  không chuyên cần 2–3 ngày để làm được.

Vấn đề không phải nội dung dở. Nội dung tốt nhưng **quá nhiều thứ đúng** cho một buổi.

## 5. Đề xuất: một app, một màn hình, một link

Giữ câu định vị cũ: **Excel để phân tích. App để vận hành.**

Nhưng sản phẩm cuối buổi đổi từ "CRM đầy đủ" thành:

> **CRM Hôm nay — bản 1 màn hình.** Một danh sách khách, một form cập nhật,
> một câu trả lời cho "hôm nay gọi ai", một link công khai.

| Trên lớp | Để demo / tự học |
|---|---|
| 1 bảng khách lấy từ CSV Buổi 1 | 6 bảng, quan hệ phức tạp |
| 1 màn hình danh sách + tìm/lọc | 10 màn hình |
| 1 form thêm/cập nhật | Kanban, báo cáo, audit log |
| 1 trạng thái + 1 ngày gọi cuối | Đăng nhập, phân quyền theo dòng |
| 1 câu "hôm nay gọi ai" | Cron 7:00, email, Zalo |
| 1 lần deploy | Tên miền riêng, rollback, chi phí |
| 3 quy tắc an toàn | 5 điều không làm, prompt injection |
| 1 vòng lặp 4 bước | 6 kiểu hỏng, 5 loại kiểm thử |

Giảng viên mở **bản CRM đầy đủ** ở 5 phút cuối như "viễn cảnh", không bắt học viên build.

## 6. Lịch 180 phút

| Phút | Phần | Việc | Sản phẩm |
|---|---|---|---|
| 0–8 | Đích đến | Demo: mở link, thêm khách, thấy "hôm nay gọi ai" | Học viên thấy đích |
| 8–28 | Thắng lần đầu | Mở repo, sửa một câu, xem diff, hoàn tác, commit | 1 thay đổi + 1 commit |
| 28–40 | Bản đồ | 4 khái niệm: file, app, database, internet; vòng lặp 4 bước | Trả lời được "app gồm gì" |
| 40–85 | Build 1 | CSV → bảng → danh sách khách + tìm/lọc | Trang danh sách chạy |
| 85–95 | Nghỉ | | |
| 95–135 | Build 2 | Form cập nhật + trạng thái + "hôm nay gọi ai" | Một vòng vận hành |
| 135–153 | Kiểm thử | 5 câu test, sửa một lỗi cố ý, commit | App đúng |
| 153–173 | Deploy | Template → Vercel, dán link, smoke test 3 mục | 1 URL |
| 173–180 | Chốt | 2 nhóm demo, cheat sheet, việc sau buổi | Đường đi tiếp |

Tỷ lệ: **~140 phút làm, ~40 phút giảng**. Hiện tại đang ngược lại.

## 7. Cấu trúc slide mới: 38 slide (thay vì 96)

Đã viết thành 3 file: `00-doc-truoc.html` (7 slide), `01-buoi-hoc.html` (31 slide),
`02-cheat-sheet.html` (1 trang A4).

| Phần | Slide | Nội dung | Sản phẩm |
|---|---|---|---|
| Đọc trước | 7 | Code khác Chat; một dự án là một thư mục; cài đặt; ba lệnh; vòng lặp; checklist | Máy sẵn sàng |
| 1. Đích đến | 3 | Câu định vị; demo; "bạn sẽ có gì" | Thấy đích |
| 2. Thắng lần đầu | 5 | Vòng lặp 4 bước; sửa 1 câu; đọc diff; undo; commit | 1 commit |
| 3. Bản đồ | 6 | Bốn chỗ của app; một lần bấm Lưu; một bảng khách; Excel chính là database; máy vs internet | Hiểu 4 khái niệm |
| 4. Build 1 | 5 | CSV → database; danh sách; tìm/lọc; kiểm; commit | Danh sách chạy |
| 5. Build 2 | 4 | Form; "hôm nay gọi ai"; thử một vòng | Một vòng vận hành |
| 6. Kiểm thử + deploy | 5 | 4 câu test; báo lỗi; deploy 3 bước; smoke test; bảo vệ demo | 1 link |
| 7. Chốt | 2 | Bản đầy đủ để làm gì tiếp; mang về | Việc sau buổi |

Mỗi phần mở bằng "Sau 20 phút, bạn có: …" và kết bằng checklist 3 ô.

## 8. Cắt gì, giữ gì

**Giữ trên lớp**
- Vòng lặp: giao việc → xem thay đổi → chạy thử → chốt.
- Đọc diff trước khi đồng ý; hoàn tác bằng commit.
- 4 khái niệm: file, app, database, internet.
- Một màn hình, một form, một câu hỏi vận hành.
- Deploy một lần, ba bước.
- Ba quy tắc an toàn: dữ liệu giả, không dán bí mật, không bấm Yes mù.

**Chuyển sang đọc trước**
- Cài đặt, quyền, checklist máy.
- Code khác Chat ở đâu.
- 3 lệnh terminal đủ dùng.

**Chuyển sang tài liệu tự học (1 trang PDF, không lên lớp)**
- CLAUDE.md, skill, MCP, subagent, hook.
- Git nhánh, rollback, migration, seed.
- Đăng nhập, phân quyền, audit log, cron, tên miền.
- 6 kiểu hỏng, 5 loại kiểm thử, 10 bước deploy.

**Bỏ hẳn khỏi buổi**
- 4 lát cắt cho 4 nhóm.
- Deploy lần đầu ở Phần 2.
- Bảng so sánh 12 dòng Excel vs App (giữ 3 dòng mạnh nhất).
- Danh sách 5 điều không làm (gộp còn 3).

## 9. Quy tắc viết để dễ hiểu

1. **Tiêu đề là một câu nói thường**, không phải danh từ kỹ thuật.
   "Một lần bấm Lưu đi qua đâu" tốt hơn "Luồng request/response".
2. **Mỗi slide một ý**, tối đa 3 dòng, một hình hoặc một sơ đồ.
3. **Từ kỹ thuật xuất hiện một lần**, in đậm, kèm một câu giải thích và chữ
   "(không cần nhớ)".
4. **Một ví dụ CRM từ đầu đến cuối**, một phép so sánh nhà hàng từ đầu đến cuối.
   Không đổi metaphor giữa chừng.
5. **Một con số cho mỗi thứ**: 4 bước, 3 câu hỏi, 3 quy tắc, 1 link. Bỏ các bộ
   "5 loại / 6 kiểu / 7 bước / 10 mục".
6. **Lệnh chỉ để copy**, một dòng, không giải thích từng cờ.
7. **Cuối mỗi phần có checklist 3 ô** để học viên tự biết mình đã xong.

## 10. Cần chốt trước khi viết lại

1. Có được đổi lời hứa từ "app production" xuống "app 1 màn hình + link" không?
2. Mỗi người một app, hay mỗi nhóm một app? (Đề xuất: mỗi người, ngồi cặp.)
3. Có bỏ 4 nhóm/lát cắt không? (Đề xuất: bỏ; nhóm chỉ để hỗ trợ nhau.)
4. Deploy bằng template dựng sẵn + tài khoản tạo trước được không? (Đề xuất: có.)

Chốt xong thì viết lại thành 3 file: `00-doc-truoc.html` (7 slide),
`01-buoi-hoc.html` (31 slide), `02-cheat-sheet.html` (1 trang). Bản cũ giữ nguyên
trong thư mục để đối chiếu. **Đã thực hiện.**

## Nguồn

- Claude Code 101 — https://academy.claude.com/courses/claude-code-101
- Claude Code in Action — https://academy.claude.com/courses/claude-code-in-action
- Claude Code for Beginners (Jared Hebb) — https://course.jaredhebb.com/
- CC for Everyone — https://ccforeveryone.com/
- The AI School — https://the-aischool.com/claude-code-course
- Vibe Coding Academy for PMs — https://www.vibecodingacademy.ai/claude-code-for-pms
- Product School — https://productschool.com/courses/claude-code-certification
- Traversaal Academy — https://traversaal.ai/academy/courses/claude-code-in-practice
