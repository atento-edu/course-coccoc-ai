# Buổi 1 · Phần 0: Kiến thức nền về AI

Slide: `phan-0-ly-thuyet.html`, 28 slide. Gửi học viên đọc trước buổi, mất khoảng 15 phút. Trên lớp chỉ nhắc lại nhanh bảng tra ở slide cuối, không giảng lại. Connector, Skill và Lịch chạy sẽ được dùng lại ở phần thực hành.

## Cấu trúc

Mỗi phần có hai slide: một slide nền xanh nêu ý chính, và một slide ví dụ (phần 0 có thêm một slide về tư duy).

| Phần | Ý chính | Ví dụ minh hoạ |
|---|---|---|
| 0. Kỹ năng | Làm ra bản nháp bằng AI giờ rất rẻ; điều quan trọng là tư duy dùng AI chứ không phải biết nhiều tool | Bốn thói quen của người dùng AI giỏi; cùng một báo cáo kênh, trước và sau khi người hiểu việc góp ý |
| 1. Context Window | Claude chỉ biết những gì đang nằm trên bàn (context window) | Lời dặn "không ghi tên khách" bị quên sau 37 tin nhắn |
| 2. Token | Claude không nhớ gì giữa hai cuộc hội thoại | Mỗi tin gửi lại toàn bộ phần trước; ví dụ dán file 5.000 dòng |
| 3. Model | Model mạnh hơn thì chậm hơn và tốn hơn | Bảng chọn model theo việc |
| 4. Hallucination | Câu đúng và câu bịa nghe tự tin như nhau | Vì sao AI bịa: nó đoán chữ tiếp theo chứ không tra cứu; AI bịa người phụ trách marketing; đoán chữ thì sao suy luận được; bốn cách để Claude bớt bịa (đưa dữ liệu vào, đừng gợi sẵn đáp án, cho nghĩ từng bước, bắt chứng minh), mỗi cách có câu hỏi nên tránh và câu nên dùng |
| 5. Giao việc | Giao như cho nhân viên giỏi mới vào làm | Giao sơ sài và giao đủ năm phần |
| 6. Skill | Skill là sổ tay quy trình, viết một lần dùng mãi | File SKILL.md của skill báo cáo kênh; ba cách có skill |
| 7. Connector (MCP) | Connector cho Claude với tay tới Drive, Gmail, Lịch, Sheets | Cùng câu hỏi về email, có và không có connector; ba điều cần biết (quyền, chiếm bàn, đọc thì nhẹ ghi thì duyệt, kèm cảnh báo prompt injection) |
| 8. Lịch chạy (scheduled) | Việc lặp lại thì hẹn giờ cho Claude tự chạy | Hẹn giờ sơ sài và đủ ý (mỗi lần chạy là chat mới); bảng Project, Connector, Skill, Lịch chạy |
| 9. Dữ liệu | File nào Claude đọc, file đó rời khỏi máy | Một dòng dữ liệu trước và sau khi ẩn danh |

## Việc cần làm trước khi gửi

- [ ] Slide 4: thay số minh hoạ trong ví dụ báo cáo bằng số thật của Cốc Cốc nếu có.
- [ ] Slide 10: kiểm tra workspace Claude của Cốc Cốc có những model nào và có bật được chế độ nghĩ kỹ (extended thinking) không. Sửa tên model trong bảng nếu cần.
- [ ] Slide 13: nếu muốn có ví dụ thật, hỏi Claude về một công ty mình biết chắc người phụ trách (không bật web search), rồi chụp lại kết quả.
- [ ] Slide 27: bổ sung theo chính sách dữ liệu của Cốc Cốc. Kiểm tra xem workspace công ty đã tắt dùng dữ liệu để huấn luyện mô hình theo mặc định chưa.
- [ ] Slide 18 đến 25 (Skill, Connector, Lịch chạy): kiểm tra workspace Cốc Cốc đã bật Connectors, Skills và tác vụ hẹn giờ chưa, và tên menu trên giao diện có khớp slide không. Xác nhận lịch chạy có cần máy hoặc ứng dụng đang mở không, rồi bổ sung vào slide 24 nếu có.
- [ ] Slide 22 (ba điều cần biết khi bật connector): nếu IT của Cốc Cốc giới hạn connector nào được dùng thì ghi danh sách đó.
- [ ] Gửi link `/buoi-1/phan-0-ly-thuyet.html`, hoặc bản PDF in bằng `Ctrl/Cmd + P` (mỗi slide một trang).

## Trên lớp

Mở slide cuối "Gặp chuyện này thì làm gì" và hỏi nhanh xem ai chưa đọc. Khi học viên gặp sự cố ở vòng thực hành, chỉ về dòng tương ứng trên slide này.
