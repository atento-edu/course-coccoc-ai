# Sổ bài tập — Buổi 1
## Vận hành & Office trên dữ liệu thật

Cặp: ____________________  Nhánh: ☐ Sales  ☐ MKT

Người lái: ________________  Người kiểm: ________________

---

## Trước khi bắt đầu

Ba quy tắc dán lên màn hình:

1. Số nào cũng phải bấm được vào ô nguồn.
2. Thông tin nào cũng phải nằm trong một ô của file, kèm nguồn chính — không để trong chat.
3. Câu nào cũng phải đọc to lên được mà không thấy sai giọng thương hiệu.

Năm thao tác lặp lại với Claude:

1. Tải file lên Project, không dán dữ liệu vào chat.
2. Hỏi chẩn đoán trước, chưa cho sửa.
3. Yêu cầu bảng có cột nguồn.
4. Xem cách tính, không chỉ xem kết quả.
5. Tải kết quả về và kiểm ba dòng ngẫu nhiên.

Khung yêu cầu dùng cho mọi việc:

```text
Vai trò: Bạn là chuyên viên [Sales/MKT] của Cốc Cốc.
Việc: [một mục tiêu, một câu].
Dữ liệu: [file nào, cột nào, kỳ nào, đơn vị gì].
Ràng buộc: [không bịa số; chỉ dùng cột có trong file; không sửa file gốc;
           đơn vị VND; tối đa 150 từ...].
Đầu ra: [bảng 5 dòng / 3 gạch đầu dòng / email / file CSV].

Trước khi làm, hỏi lại nếu thiếu thông tin.
Sau khi làm, liệt kê ba chỗ tôi cần kiểm tra.
```

Luật dữ liệu trong lớp:

- Không đọc to tên, số điện thoại, email.
- Không dán dữ liệu ra ngoài Project của cặp.
- Không chụp màn hình có dữ liệu thật.
- Cuối buổi xoá bản thật khỏi Project nếu chính sách yêu cầu.

---

## Data card

```text
Câu hỏi chính của cặp:
______________________________________________________________

File chính: ____________________  số dòng: ______  kỳ: __________
File phụ: ______________________________________________________

Đã ẩn danh:
☐ tên  ☐ SĐT  ☐ email  ☐ địa chỉ  ☐ ghi chú tự do

Chỉ số sẽ tính:
______________________________________________________________

Ba con số đối chiếu (lấy từ báo cáo cũ):
1. ______________________________ = ____________________
2. ______________________________ = ____________________
3. ______________________________ = ____________________

Đầu ra mong muốn:
______________________________________________________________

Rủi ro của file:
______________________________________________________________
```

Khi số sau khi làm sạch lệch với ba con số trên, tìm một trong ba nguyên nhân: định nghĩa khác, bộ lọc khác, hoặc trùng dòng.

---

## Vòng 1 — Từ file thô đến bảng tính được

**Mục tiêu.** Một file sạch, nối được với file phụ, tính được ba chỉ số, và giải thích được chênh lệch với báo cáo cũ.

### Các bước

- [ ] 1. Đọc data card. Chốt câu hỏi và ba con số đối chiếu.
- [ ] 2. Mở file bằng mắt: đếm dòng, đọc 10 dòng đầu, ghi ba nghi ngờ. Chưa mở Claude.
- [ ] 3. Hỏi Claude chẩn đoán. Chưa cho sửa.
- [ ] 4. Chọn ba lỗi ảnh hưởng đến con số cuối. Nhờ Claude xử lý, bắt giải thích.
- [ ] 5. Nối file phụ. Kiểm số dòng và tổng tiền trước/sau.
- [ ] 6. Tính ba chỉ số. Ghi ba dòng trước/sau và ba việc còn tồn.

### Prompt chẩn đoán

```text
Đây là file [lead / cơ hội] thật đã ẩn danh của Cốc Cốc.
Trước khi sửa, hãy:
1. Mô tả cấu trúc: số dòng, từng cột, kiểu dữ liệu, tỷ lệ thiếu.
2. Liệt kê vấn đề chất lượng dữ liệu, xếp theo mức ảnh hưởng đến
   [chi phí trên lead / giá trị pipeline].
3. Với mỗi vấn đề, đề xuất cách xử lý và hỏi tôi nếu cần quyết định.
Chưa sửa file. Không bịa giá trị. Trả lời bằng bảng.
```

### Prompt xử lý và nối

```text
Chốt xử lý ba vấn đề sau: [...]
Viết cách xử lý (công thức hoặc đoạn Python), giải thích từng bước.
Giữ nguyên cột row_id. Không gộp dòng nếu chưa hỏi.
Sau đó nối với file phụ theo [campaign_code / mã khách hàng]. Trả về:
- số dòng trước và sau
- [tổng chi phí / tổng giá trị pipeline] trước và sau
- mã không khớp ở một trong hai file
- file kết quả để tải
```

### Chỉ số cần tính

| Sales | MKT |
|---|---|
| Giá trị pipeline | Tổng chi |
| Tỷ lệ chốt | Số lead |
| Độ dài chu kỳ | CPL |
| Số deal đứng | CVR |
| Tỷ trọng nguồn | Chi phí trên lead đủ điều kiện |

### Tự kiểm

- [ ] Tổng tiền khớp file gốc, không bị nhân lên sau khi nối.
- [ ] Số dòng hợp lệ không ít hơn số dòng thật.
- [ ] Ba dòng ngẫu nhiên khớp file gốc.
- [ ] Ba con số đối chiếu khớp, hoặc giải thích được vì sao lệch.
- [ ] File có đủ ba sheet: `sach`, `tong_hop`, `ghi_chu`.

### Câu hỏi tự kiểm

- Lỗi nào ảnh hưởng đến số cuối nhiều nhất?
- Nếu bỏ qua lỗi này, ai sẽ bị ảnh hưởng?
- Phép nối này làm mất bao nhiêu dòng? Vì sao?

---

## Vòng 2 — Một trang để ra quyết định

**Mục tiêu.** Một trang có năm chỉ số, ba nhận định, một khuyến nghị, ba cảnh báo. Mọi số truy về ô nguồn.

### Các bước

- [ ] 1. Chọn năm chỉ số. Viết định nghĩa từng chỉ số.
- [ ] 2. Yêu cầu bảng “chỉ số — giá trị — kỳ trước — ô nguồn — cách tính”.
- [ ] 3. Viết ba nhận định theo mẫu “X tăng/giảm Y% vì Z; nên W”.
- [ ] 4. Viết một khuyến nghị có người phụ trách và hạn. Sales chọn 5 deal cần gọi tuần này; MKT chọn một kênh để dồn 20% ngân sách.
- [ ] 5. Nhờ Claude đóng vai CFO phản biện. Sửa lại.
- [ ] 6. Viết ba quy tắc cảnh báo.

### Prompt

```text
Từ file tong_hop, lập bảng 5 chỉ số: [...].
Mỗi dòng gồm: chỉ số, giá trị kỳ này, kỳ trước, % thay đổi, ô nguồn, cách tính.
Chỉ dùng dữ liệu trong file. Thiếu dữ liệu thì ghi "không tính được".
Sau đó viết 3 nhận định theo mẫu:
"X tăng/giảm Y% so với kỳ trước vì Z; nên làm W."
Mỗi nhận định phải dẫn được về một chỉ số trong bảng.
Cuối cùng đóng vai CFO khó tính, phản biện từng nhận định.
```

**Prompt chọn việc.**

```text
Từ bảng và ba nhận định trên:
- Sales: chọn 5 deal cần gọi tuần này. Mỗi deal ghi lý do, hành động, người gọi.
- MKT: chọn 1 kênh để dồn 20% ngân sách. Ghi lý do, số tiền, người quyết.
```

### Cảnh báo theo nhánh

| Sales | MKT |
|---|---|
| Deal không có hoạt động 14 ngày | CPL tăng quá 20% trong tuần |
| Deal đứng một stage quá 30 ngày | Chiến dịch không có lead trong 2 ngày |
| Khoảng cách so với chỉ tiêu tháng | Chi vượt nhịp ngân sách |

### Tự kiểm

- [ ] Mỗi số bấm được về ô.
- [ ] Mỗi nhận định có mốc so sánh.
- [ ] Khuyến nghị có một động từ, một người, một hạn.
- [ ] 5 deal hoặc đề xuất dồn ngân sách có lý do lấy từ số.
- [ ] Ba cảnh báo có ngưỡng và tần suất kiểm.
- [ ] Sau khi CFO phản biện, không còn câu “cần tối ưu chiến dịch”.

### Câu hỏi tự kiểm

- Nếu chỉ giữ một số, giữ số nào? Vì sao?
- Người đọc sẽ ra quyết định gì sau khi đọc trang này?
- Khuyến nghị này ai làm, làm khi nào?

---

## Vòng 3 — Làm giàu hồ sơ và chốt góc tiếp cận

**Mục tiêu.** Một bảng hồ sơ đủ chặt để ghép vào file sạch, và một câu mở đầu dùng được ngay.

### Nhánh Sales

Chọn 3 tài khoản từ file sạch, viết hai tiêu chí chọn trước. Mỗi tài khoản điền tám trường, mỗi ô tối đa 10 từ, một dữ kiện.

| Trường | Nội dung |
|---|---|
| Ngành | |
| Quy mô | |
| Người phụ trách | |
| Kênh đang dùng | |
| Tín hiệu mua | |
| Ngân sách ước tính | |
| Hook dưới 25 từ | |
| Rủi ro | |

**Prompt.**

```text
Từ danh sách 3 tài khoản sau, điền bảng 8 trường cho mỗi tài khoản:
ngành, quy mô, người phụ trách, kênh đang dùng, tín hiệu mua,
ngân sách ước tính, hook dưới 25 từ, rủi ro.
Quy tắc: mỗi ô tối đa 10 từ, chỉ một dữ kiện, không viết câu.
Cột cuối ghi nguồn chính.
Xuất bảng dán được vào Excel, mỗi dòng một tài khoản.
```

### Nhánh MKT

Chọn 2 đối thủ và 1 nhóm khách. Mỗi đối thủ điền đủ bảng; nhóm khách chỉ cần kênh, tín hiệu, khoảng trống.

| Trường | Đối thủ 1 | Đối thủ 2 | Nhóm khách |
|---|---|---|---|
| Định vị | | | |
| Thông điệp chính | | | |
| Kênh | | | |
| Giá/khuyến mãi | | | |
| Tín hiệu 3 tháng | | | |
| Khoảng trống nội dung | | | |

Sau đó viết 3 khoảng trống Cốc Cốc có thể chiếm, mỗi khoảng trống một câu.

**Prompt.**

```text
Tôi cần phân tích 2 đối thủ [...] và 1 nhóm khách [...] cho [sản phẩm].
Với mỗi đối thủ: định vị, thông điệp chính, kênh, giá/khuyến mãi đang chạy,
tín hiệu 3 tháng gần nhất, khoảng trống nội dung.
Mỗi ô tối đa 10 từ, chỉ một dữ kiện.
Sau đó chỉ ra 3 khoảng trống Cốc Cốc có thể chiếm, mỗi cái một câu.
```

### Ghép vào file

- [ ] Thêm tám cột vào file sạch, không đổi số dòng.
- [ ] Điền mã khách hàng cho từng dòng mới.
- [ ] Kiểm số dòng trước và sau khi ghép.

### Tự kiểm

- [ ] Số dòng không đổi sau khi ghép.
- [ ] Mỗi ô một dữ kiện, không có đoạn văn.
- [ ] Không có ô trống: ghi “không rõ” nếu thiếu.
- [ ] Hook dưới 25 từ, trích một tín hiệu cụ thể.
- [ ] Có một câu mở đầu cuộc gọi (Sales) hoặc một góc nội dung kèm CTA (MKT).

### Câu hỏi tự kiểm

- Thông tin này vào cột nào?
- Nó đổi việc em làm tuần này thế nào?
- Hook này có dùng được cho một tài khoản khác không? Nếu có, nó chưa đủ riêng.

---

## Vòng 4 — Đầu ra dùng được

**Mục tiêu.** Một đầu ra gửi được ngay, đúng người, đúng giọng, có một hành động.

### Nhánh Sales

- [ ] 1. Chọn 15 lead từ file sạch.
- [ ] 2. Viết bốn tiêu chí và trọng số ra giấy trước khi cho Claude chấm.
- [ ] 3. Chấm A/B/C kèm lý do một dòng.
- [ ] 4. Tự sửa ba ca sai, ghi lại vì sao sai.
- [ ] 5. Viết ba tin dưới 80 từ: Zalo cho A, email cho B, kịch bản gọi cho C.
- [ ] 6. Chạy checklist, đọc to một tin.

**Prompt chấm lead.**

```text
Chấm 15 lead sau theo 4 tiêu chí và trọng số đã chốt: [...].
Mỗi lead trả về: điểm từng tiêu chí, tổng, nhóm A/B/C, lý do 1 dòng.
Không dùng thông tin ngoài file. Không tự thêm lead.
Sau đó viết 3 tin dưới 80 từ:
- A: Zalo, lý do lấy từ hồ sơ, 1 CTA
- B: email, tiêu đề dưới 9 từ
- C: kịch bản gọi 30 giây
```

### Nhánh MKT

- [ ] 1. Chọn một brief thật.
- [ ] 2. Ghi ra ba ràng buộc: giọng, từ cấm, một CTA.
- [ ] 3. Viết bài đăng 120–150 từ.
- [ ] 4. Viết email 150 từ, tiêu đề dưới 9 từ.
- [ ] 5. Viết kịch bản video 30 giây, 5 cảnh.
- [ ] 6. Chạy checklist sáu điểm, đọc to một bài.

**Prompt nội dung.**

```text
Từ brief sau: [...], viết 3 đầu ra:
1. Bài đăng Facebook 120-150 từ
2. Email 150 từ, tiêu đề dưới 9 từ
3. Kịch bản video 30 giây, 5 cảnh
Ràng buộc: [quy chuẩn thương hiệu], từ cấm [...], 1 CTA mỗi đầu ra,
không hứa hẹn tuyệt đối.
Trước khi viết, hỏi lại nếu brief thiếu.
```

**Prompt kiểm thương hiệu.**

```text
Đóng vai trưởng nhóm thương hiệu. Chấm 3 đầu ra theo checklist:
xưng hô, từ cấm, một CTA, không hứa tuyệt đối, độ dài, giọng đọc.
Chỉ ra từng lỗi và sửa lại.
```

### Checklist sáu điểm

- [ ] 1. Xưng hô đúng quy định.
- [ ] 2. Không có từ cấm.
- [ ] 3. Đúng một CTA.
- [ ] 4. Không hứa tuyệt đối: “tốt nhất”, “số 1”, “100%”.
- [ ] 5. Độ dài trong giới hạn.
- [ ] 6. Đọc to không thấy sai giọng.

### Tự kiểm

- [ ] Nhóm A không quá 20% (Sales).
- [ ] Mỗi tin có lý do lấy từ dữ liệu, không phải câu khen chung.
- [ ] Mỗi đầu ra một CTA.
- [ ] Qua sáu điểm checklist.
- [ ] Đọc to một tin hoặc một bài, cặp bên cạnh nghe và nhận xét.

### Câu hỏi tự kiểm

- Tin này có gửi được cho 100 người khác nhau không? Nếu có, nó chưa đủ riêng.
- Người nhận biết phải làm gì sau khi đọc không?
- Câu nào là câu AI viết mà em sẽ không dám gửi? Vì sao?

---

## Thẻ một việc một tuần

```text
Việc sẽ làm lại: ______________________________________________

Tần suất hiện tại: ____________________________________________

Người nhận kết quả: ___________________________________________

Bước đầu tiên, làm vào thứ Hai:
______________________________________________________________

File hoặc Project sẽ dùng:
______________________________________________________________

Cách biết là thành công:
______________________________________________________________
```

---

## Ghi chú của cặp

**Điều làm được ngay:**

______________________________________________________________

**Một lần Claude sai, và cách phát hiện:**

______________________________________________________________

**Câu hỏi mang về:**

______________________________________________________________
