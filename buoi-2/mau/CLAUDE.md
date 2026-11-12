# Luật làm việc cho dự án báo giá

Đọc file này trước khi sửa bất cứ thứ gì.

## Dự án là gì

Một app báo giá cho sales quảng cáo Cốc Cốc. Một file `app.html` duy nhất, mở
bằng trình duyệt, không build, không server, không database.

## Cấu trúc

- `app.html` — toàn bộ app: HTML, CSS, JavaScript trong cùng một file.
- `bang-gia.csv` — bảng giá do tài chính sở hữu. App chỉ đọc.
- `CLAUDE.md` — file này.

## Luật

1. **Không sửa `bang-gia.csv`.** Nếu cần dữ liệu mẫu, thêm vào code, không sửa file giá.
2. **Một file.** Không tách CSS, JavaScript, không thêm thư viện, không thêm bước build.
3. **Tiếng Việt.** Nhãn, thông báo lỗi, nội dung bản in dùng tiếng Việt có dấu.
4. **Tiền là số nguyên đồng.** Tính bằng đồng, không dùng đơn vị triệu trong code.
   Hiển thị thì mới định dạng: `180.000.000`, không viết `180 triệu`.
5. **Không làm tròn khi tính.** Chỉ làm tròn lúc hiển thị.
6. **VAT 10%, tính trên tiền sau chiết khấu.** Không tính trên tạm tính.
7. **Chiết khấu mỗi dòng = mức nhỏ hơn giữa bậc và trần của format đó.**
   Bậc: dưới 100 triệu 0%, 100–300 triệu 5%, 300–500 triệu 8%, 500 triệu–1 tỷ 11%,
   trên 1 tỷ 14%.
8. **Bản in là A4 dọc, một trang.** Dùng `@media print`. Ẩn nút và bảng nhập,
   chỉ giữ tờ báo giá.
9. **Không đổi bố cục bản in** khi không được yêu cầu. Khách nhìn thấy tờ giấy đó.
10. **Sửa ít một.** Mỗi lần một việc. Xong thì nói rõ đã đổi file nào, dòng nào.

## Khi không chắc

Hỏi lại. Không tự thêm trường, không tự đổi công thức, không tự đổi đơn vị tính
(CPM tính theo 1.000 lượt hiển thị, CPC theo click, CPT theo ngày, gói theo số gói).
