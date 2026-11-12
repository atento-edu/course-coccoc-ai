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

Nhưng sản phẩm cuối buổi đổi từ "CRM đầy đủ" thành một việc hẹp hơn, làm nhiều lần
trong tuần:

> **Báo giá — một màn hình.** Chọn format từ bảng giá, ra thành tiền, áp chiết khấu,
> in một tờ A4 gửi khách, và có một link công khai.

| Trên lớp | Để demo / tự học |
|---|---|
| 1 bảng giá 12 dòng từ CSV | Bảng giá đầy đủ, nhiều ngành, nhiều đợt |
| 1 màn hình nhập + bản xem trước | 10 màn hình quản trị giá |
| 1 công thức thành tiền theo đơn vị | Đấu thầu, giá theo gói, giá theo mùa |
| 1 bậc chiết khấu + trần từng format | Luồng duyệt nhiều cấp, lịch sử sửa giá |
| 1 bản in A4 | Template theo khách, đa ngôn ngữ, phụ lục |
| 1 lần deploy | Tên miền riêng, rollback, chi phí |
| 3 quy tắc an toàn | 5 điều không làm, prompt injection |
| 1 vòng lặp 4 bước | 6 kiểu hỏng, 5 loại kiểm thử |

Giảng viên mở **bản CRM đầy đủ** ở 5 phút cuối như "viễn cảnh", không bắt học viên build.

## 6. Lịch 180 phút

| Phút | Phần | Việc | Sản phẩm |
|---|---|---|---|
| 0–8 | Mở đầu | Chiếu app, in thử một tờ | Học viên thấy đích |
| 8–28 | Bắt đầu | Cài đặt, mở tab Code, chọn thư mục, đổi một câu | Máy sẵn sàng |
| 28–42 | Vòng lặp | Viết spec ba dòng, chạy thử, hoàn tác | 1 thay đổi chạy được |
| 42–52 | Bản đồ | 3 phần: trang, dữ liệu, quy tắc | Trả lời được "app gồm gì" |
| 52–95 | Bảng giá | Nạp CSV → thêm dòng → tính tiền → chiết khấu và trần | Ra đúng con số |
| 95–105 | Nghỉ | | |
| 105–140 | Báo giá | Bản in A4, câu hỏi "nếu 3 tháng", copy tóm tắt | Một tờ gửi được |
| 140–152 | Kiểm | 3 câu kiểm số, báo lỗi bằng bằng chứng | Số đúng |
| 152–170 | Lên mạng | GitHub Pages, mở thử, kiểm trước khi gửi | 1 link |
| 170–180 | Chốt | Việc đáng làm app, cheat sheet, 7 ngày | Đường đi tiếp |

Tỷ lệ: **~145 phút làm, ~35 phút giảng**.

## 7. Cấu trúc slide đang dùng: 32 slide

Đã viết thành 2 file: `01-buoi-hoc.html` (32 slide), `02-cheat-sheet.html` (1 trang A4).
Không có phần đọc trước: cài đặt và làm quen dạy ngay đầu buổi 3 giờ.

| Phần | Slide | Nội dung | Sản phẩm |
|---|---|---|---|
| 0. Bắt đầu | 5 | Chat khác Code; một dự án là một thư mục; cài đặt; Claude hỏi trước khi sửa; checklist máy | Máy sẵn sàng |
| 1. Đích đến | 3 | Mở bản hoàn chỉnh; phạm vi; cuối buổi có gì | Thấy đích |
| 2. Vòng lặp | 4 | Bốn bước; đổi một câu; spec ba dòng; hoàn tác | 1 thay đổi chạy được |
| 3. Bản đồ | 4 | Ba phần của app; bảng giá là dữ liệu; máy và mạng | Hiểu app gồm gì |
| 4. Bảng giá | 5 | Nạp CSV; đơn vị và thành tiền; bậc chiết khấu và trần; kiểm số | Ra đúng con số |
| 5. Báo giá | 4 | Bản in A4; câu hỏi “nếu 3 tháng”; copy tóm tắt | Một tờ gửi được |
| 6. Lên mạng | 3 | GitHub Pages; kiểm trước khi gửi; sửa về sau | 1 link |
| 7. Chốt | 3 | Khi cả team cần dùng; việc nào đáng làm app; mang về | Việc sau buổi |

Mỗi phần mở bằng một slide chuyển ý (trừ phần 0 và phần 7) và kết bằng một việc
học viên tự bấm được. Case đổi từ bảng gọi khách sang báo giá vì tần suất và chi phí
sai cao hơn: mỗi rep 3–10 báo giá một tuần, 20–60 phút mỗi lần.

## 8. Cắt gì, giữ gì

**Giữ trên lớp**
- Code khác Chat; cài đặt, quyền, checklist máy ở đầu buổi.
- Vòng lặp: giao việc → xem thay đổi → chạy thử → chốt.
- Spec ba dòng trước khi giao việc; hoàn tác bằng Claude.
- 4 khái niệm: file, app, database, internet.
- Một màn hình, một form, một câu hỏi vận hành.
- Deploy một lần, ba bước.
- Ba quy tắc an toàn: dữ liệu giả, không dán bí mật, không bấm Yes mù.

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
4. **Một ví dụ báo giá từ đầu đến cuối**, một phép so sánh nhà hàng từ đầu đến cuối.
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

Chốt xong thì viết lại thành 2 file: `01-buoi-hoc.html` (32 slide),
`02-cheat-sheet.html` (1 trang). Bản cũ 5 phần đã xoá.
**Đã thực hiện.**

## Nguồn

- Claude Code 101 — https://academy.claude.com/courses/claude-code-101
- Claude Code in Action — https://academy.claude.com/courses/claude-code-in-action
- Claude Code for Beginners (Jared Hebb) — https://course.jaredhebb.com/
- CC for Everyone — https://ccforeveryone.com/
- The AI School — https://the-aischool.com/claude-code-course
- Vibe Coding Academy for PMs — https://www.vibecodingacademy.ai/claude-code-for-pms
- Product School — https://productschool.com/courses/claude-code-certification
- Traversaal Academy — https://traversaal.ai/academy/courses/claude-code-in-practice
