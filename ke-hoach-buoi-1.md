# Buổi 1 — Vận hành & Office

Bản 2 · 20–25 người · đa phần Sales và MKT · Claude · dữ liệu thật.

## 0. Ba thay đổi so với bản đầu

1. **Dữ liệu thật phải qua phòng khám trước buổi.** Không kiểm tra file trong lớp. Mỗi cặp có một data card và ba con số đối chiếu lấy từ báo cáo cũ.
2. **Buổi tách nhánh ở vòng 3–4.** Sales làm hồ sơ tài khoản và chuỗi liên hệ; MKT làm hồ sơ đối thủ và bộ nội dung. Hai nhánh dùng cùng một quy trình, khác đầu ra.
3. **Mỗi cặp ra khỏi lớp với một Claude Project đã cấu hình**, không chỉ bốn file. Đây là thứ giúp họ làm lại vào tuần sau mà không cần hỏi lại.

Bản đồ với đề xuất 5 phần: vòng 1 là xử lý dữ liệu; vòng 2 là phân tích và báo cáo; vòng 3 là nghiên cứu và làm giàu; vòng 4 gộp điều phối lead với nội dung, vì với sales và mkt hai việc này luôn đi liền.

## 1. Đầu ra

| | Sales | MKT |
|---|---|---|
| Vòng 1 | File sạch, bảng pipeline, chi phí trên lead | File sạch, bảng theo kênh, CPL, CVR |
| Vòng 2 | Một trang pipeline, 5 deal cần gọi, 3 cảnh báo | Một trang kênh, 1 đề xuất dồn ngân sách, 3 cảnh báo |
| Vòng 3 | 3 tài khoản đã làm giàu, mỗi dòng một hồ sơ | 2 đối thủ, 3 khoảng trống nội dung |
| Vòng 4 | 15 lead đã chấm, 3 tin nhắn theo nhóm | 1 brief, 3 đầu ra đa kênh |
| Chung | 1 Project Claude, bộ prompt đã lưu, 1 thẻ việc tuần | Như bên trái |

## 2. Diễn tiến buổi

1. Mở: bốn đầu ra, luật dữ liệu, chia cặp cùng nhánh, kiểm Project.
2. Khởi động: đọc data card, chọn nhánh, ghi ba câu hỏi.
3. Vòng 1 — làm sạch, nối, tính.
4. Vòng 2 — một trang quyết định.
5. Nghỉ.
6. Vòng 3 — làm giàu hồ sơ và chốt góc tiếp cận.
7. Vòng 4 — đầu ra dùng được.
8. Chốt: thẻ việc, đóng gói Project, chia sẻ.

Lời mở:

```text
Hôm nay không có phần lý thuyết. Bốn vòng, mỗi vòng một file thật, ra một đầu ra dùng được.
Đi theo cặp, đổi vai sau mỗi vòng. Ba luật: không đọc to tên/SĐT, không dán dữ liệu ra ngoài
Project, cuối buổi xoá bản thật nếu chính sách yêu cầu.
Ai xong sớm thì giúp cặp bên cạnh kiểm, không làm bài tiếp.
```

## 3. Dữ liệu thật: chuẩn bị trước buổi
Đây là phần quyết định buổi học có chạy được hay không. Làm chậm ở đây để nhanh trong lớp.

### 3.1 Mỗi cặp mang gì

Một file chính và một file phụ, đúng việc họ đang làm:

- Sales: export cơ hội/deal từ CRM, kèm file mục tiêu hoặc danh sách 10 tài khoản.
- MKT: export lead theo chiến dịch, kèm file chi phí quảng cáo; hoặc export hiệu suất kênh ba tháng.
- File chính là dữ liệu ở mức lead hoặc deal, không phải bảng tổng hợp theo chiến dịch.
- File chính tối thiểu 200 dòng, hoặc toàn bộ dữ liệu 3–12 tháng nếu ít hơn; cần có cột ngày, một cột mã khách hàng hoặc mã chiến dịch, một cột số tiền.
- Lưu bản mang đi dưới dạng CSV UTF-8 hoặc XLSX chỉ có giá trị, không giữ công thức, sheet ẩn, hoặc định dạng trang trí.

### 3.2 Ẩn danh trước khi mang đi

Bỏ năm cột trước khi mang lên lớp: tên, số điện thoại, email, địa chỉ, ghi chú tự do. Giữ mã khách hàng, mã chiến dịch, ngày, số tiền, trạng thái. Nếu cần đọc tên trong báo cáo, thay bằng `KH-001`.

Checklist:

- [ ] Đã xoá năm cột định danh.
- [ ] Đã kiểm 10 dòng đầu và 10 dòng cuối.
- [ ] Tên file có đuôi `_anon`.
- [ ] Bản gốc để riêng, không mang đi.
- [ ] Chỉ upload vào workspace của công ty, không dùng tài khoản cá nhân.

### 3.3 Phòng khám dữ liệu

Trước buổi 7 ngày, thu file qua một form. Trước buổi 5 ngày, giảng viên mở từng file và gắn nhãn:

- **Xanh:** đủ 200 dòng hoặc trọn kỳ, có ngày, có mã khách hàng/chiến dịch, có số tiền, không còn thông tin định danh. Dùng nguyên.
- **Vàng:** thiếu một cột hoặc quá ít dòng. Bổ sung từ file phụ, hoặc gộp thêm kỳ.
- **Đỏ:** không có mã/ngày, file lỗi, hoặc chưa ẩn danh. Giảng viên cắt 300–500 dòng từ chính file đó, bỏ cột định danh, gửi lại bản rút gọn.

Khi mở mỗi file, kiểm năm thứ và ghi luôn vào data card: số dòng, cột ngày, cột mã, cột tiền, còn thông tin định danh không. Nếu thiếu một trong bốn thứ đầu, xếp vàng hoặc đỏ.

Trước buổi 3 ngày, gọi một cuộc ngắn với các cặp vàng và đỏ. Cặp xanh nhận xác nhận qua email. Trước buổi 2 ngày, gửi lại data card đã điền.

### 3.4 Data card và ba con số đối chiếu

Mỗi cặp điền một trang. Ba con số lấy từ báo cáo hoặc dashboard họ đang dùng, ví dụ tổng lead tháng 9, CPL, tỷ lệ chốt. Đây là mốc để biết file sau khi làm sạch có còn đúng không.

```text
CẶP: ____            NHÁNH: Sales / MKT
Câu hỏi chính: ________________________________
File chính: __________  số dòng: ____  kỳ: ____
File phụ: _____________________________________
Đã ẩn danh: ☐ tên ☐ SĐT ☐ email ☐ địa chỉ ☐ ghi chú
Chỉ số sẽ tính: _______________________________
Ba con số đối chiếu:
  1. ______________ = ________
  2. ______________ = ________
  3. ______________ = ________
Đầu ra: _______________________________________
Rủi ro: _______________________________________
```

Khi lệch số, học viên phải tìm được nguyên nhân: định nghĩa khác, bộ lọc khác, hay trùng dòng. Đây là bài học đắt nhất của vòng 1. Giảng viên kiểm ba con số này có khớp dashboard không; nếu không, nhờ cặp gửi định nghĩa hoặc ảnh chụp màn hình trước buổi.

### 3.5 Khi file không dùng được

Không có file thật thì dùng bản rút gọn từ dữ liệu của chính phòng ban đó, không dùng bộ dữ liệu giả. Cặp không mang file sẽ ghép với cặp có file và làm nhiệm vụ kiểm. Không để ai ngồi nhìn.

### 3.6 Claude: workspace, Project, quyền

- Mỗi cặp một Project, tên `B1 — Cặp 03 — Sales`.
- Project instructions:

```text
Bạn là trợ lý phân tích dữ liệu cho nhóm Sales/MKT tại Cốc Cốc.
Trả lời tiếng Việt, ngắn, ưu tiên bảng.
Không bịa số. Mỗi số phải chỉ được ô hoặc cột nguồn.
Nếu thiếu dữ liệu, ghi "không tính được" và hỏi lại.
Không sửa file gốc, không thêm dòng.
```

- Upload đúng hai file. Mỗi vòng mở một chat mới, đặt tên `V1 — làm sạch`, `V2 — báo cáo`.
- Cuối buổi lưu các prompt đã dùng vào `prompts.md`, ghim Project để tuần sau mở lại.
- Yêu cầu seat: 1 seat mỗi cặp, tức 10–12 seat cho 20–25 người. Ít hơn thì phải giảm số cặp hoặc ghép ba người một máy; không nên ghép bốn người một tài khoản vì sẽ mất phần tay làm.
- Dùng workspace của công ty, kiểm cài đặt chia sẻ và lưu trữ trước khi upload. Project để riêng tư, không bật link công khai.

## 4. Nội dung bốn vòng

### Vòng 1 — Từ file thô đến bảng tính được

**Học được.** Nhìn dữ liệu trước khi hỏi AI. AI đề xuất cách xử lý, người quyết định. Mọi phép nối phải có bảng kiểm trước và sau.

**Câu hỏi dẫn.** “Con số nào sẽ sai nếu bỏ qua lỗi này?”

**Các bước.**

1. Làm mẫu: chiếu một file lộn xộn, cả lớp chỉ chỗ có thể làm sai số.
2. Mở file bằng mắt: đếm dòng, đọc 10 dòng đầu, ghi ba nghi ngờ.
3. Hỏi Claude chẩn đoán, chưa sửa.
4. Chọn ba lỗi ảnh hưởng số cuối, xử lý có giải thích.
5. Nối file phụ, kiểm số dòng và tổng tiền trước/sau.
6. Tính ba chỉ số chính.
7. Kiểm chéo: đổi bài, đối chiếu ba con số.
8. Chốt: số phải truy về ô.

**Prompt chẩn đoán.**

```text
Đây là file [lead / cơ hội] thật đã ẩn danh của Cốc Cốc.
Trước khi sửa, hãy:
1. Mô tả cấu trúc: số dòng, từng cột, kiểu dữ liệu, tỷ lệ thiếu.
2. Liệt kê vấn đề chất lượng dữ liệu, xếp theo mức ảnh hưởng đến
   [chi phí trên lead / giá trị pipeline].
3. Với mỗi vấn đề, đề xuất cách xử lý và hỏi tôi nếu cần quyết định.
Chưa sửa file. Không bịa giá trị. Trả lời bằng bảng.
```

**Prompt xử lý và nối.**

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

**Đầu ra.** `01-du-lieu-sach.xlsx`: sheet `sach`, `tong_hop`, `ghi_chu` (ba dòng trước/sau và ba việc còn tồn).

**Chỉ số theo nhánh.**

| Sales | MKT |
|---|---|
| Giá trị pipeline, tỷ lệ chốt, độ dài chu kỳ, số deal đứng, tỷ trọng nguồn | Tổng chi, số lead, CPL, CVR, chi phí trên lead đủ điều kiện |

**Kiểm.** Tổng tiền khớp file gốc. Số dòng hợp lệ không ít hơn số dòng thật. Ba dòng ngẫu nhiên khớp. Ba con số đối chiếu lệch thì giải thích được.

**Lỗi thường gặp.** Claude tự thêm dòng, đổi đơn vị, gộp trùng quá tay, nối làm rơi dòng, hoặc nối một-nhiều làm tổng chi phí bị nhân lên. Cách chặn: giữ `row_id`, yêu cầu bảng kiểm trước/sau, không chấp nhận số không có cột nguồn.

**Dừng đúng chỗ.** Không cố làm sạch mọi thứ: chọn ba lỗi ảnh hưởng số cuối rồi chuyển sang kiểm chéo, phần còn tồn ghi vào `ghi_chu`.

### Vòng 2 — Một trang để ra quyết định

**Học được.** Chỉ số phải có định nghĩa. Nhận định phải có mốc so sánh. Khuyến nghị phải có người và hạn.

**Câu hỏi dẫn.** “Nếu chỉ giữ một số, em giữ số nào? Vì sao?”

**Các bước.**

1. Làm mẫu: từ một bảng, viết một câu nhận định và chỉ vào ô nguồn.
2. Chốt năm chỉ số và định nghĩa từng chỉ số.
3. Yêu cầu bảng “chỉ số — giá trị — kỳ trước — ô nguồn — cách tính”.
4. Viết ba nhận định, một khuyến nghị; Sales chọn 5 deal cần gọi, MKT chọn kênh dồn ngân sách.
5. Nhờ Claude đóng vai CFO phản biện, sửa lại.
6. Viết ba quy tắc cảnh báo, kiểm chéo.
7. Chốt mẫu một trang.

**Prompt.**

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

**Đầu ra.** `02-bao-cao-1-trang.md`: bảng số, ba nhận định, một khuyến nghị có người phụ trách và hạn, danh sách 5 deal hoặc đề xuất dồn ngân sách, ba quy tắc cảnh báo.

**Cảnh báo theo nhánh.**

| Sales | MKT |
|---|---|
| Deal không có hoạt động 14 ngày; deal đứng một stage quá 30 ngày; khoảng cách so với chỉ tiêu tháng | CPL tăng quá 20% trong tuần; chiến dịch không có lead trong 2 ngày; chi vượt nhịp ngân sách |

**Kiểm.** Mỗi số bấm được về ô. Mỗi nhận định có mốc so sánh. Khuyến nghị có một động từ, một người, một hạn. Danh sách 5 deal hoặc đề xuất dồn ngân sách có lý do lấy từ số. Sau khi CFO phản biện, không còn câu “cần tối ưu chiến dịch”.

**Lỗi thường gặp.** Chọn chỉ số đẹp nhưng không liên quan quyết định; nhận định không có baseline; khuyến nghị chung chung. Cách chặn: mỗi nhận định phải trả lời “vậy thì làm gì”.

**Dừng đúng chỗ.** Chốt bảng số và ba nhận định trước; phần cảnh báo viết sau, không quay lại sửa chỉ số.

### Vòng 3 — Làm giàu hồ sơ và chốt góc tiếp cận

**Học được.** Research theo lô, ép về schema, gắn thẳng vào file sạch, rồi biến hồ sơ thành một câu mở đầu dùng được. Hồ sơ đúng nhưng không dùng được vẫn là số 0.

**Câu hỏi dẫn.** “Thông tin này vào cột nào, và nó đổi việc em làm tuần này thế nào?”

**Nhánh Sales.** Chọn 3 tài khoản từ file sạch; viết hai tiêu chí chọn trước khi research. Mỗi tài khoản điền tám trường: ngành, quy mô, người phụ trách, kênh đang dùng, tín hiệu mua, ngân sách ước tính, hook, rủi ro. Mỗi ô tối đa 10 từ, một dữ kiện, không viết câu. Ngân sách ghi cơ sở ước tính. Hook dưới 25 từ, trích một tín hiệu cụ thể.

**Nhánh MKT.** Chọn 2 đối thủ và 1 nhóm khách. Mỗi đối thủ điền: định vị, thông điệp chính, kênh, giá hoặc khuyến mãi đang chạy, tín hiệu ba tháng gần nhất, khoảng trống nội dung. Nhóm khách chỉ cần kênh, tín hiệu, khoảng trống. Sau đó chỉ ra 3 khoảng trống Cốc Cốc có thể chiếm, mỗi cái một câu.

**Các bước.**

1. Làm mẫu: một hồ sơ tốt và một hồ sơ “đúng mà vô dụng” — ô nào cũng một đoạn văn, hook dùng cho tài khoản nào cũng được.
2. Chọn mục tiêu từ file sạch, viết hai tiêu chí chọn.
3. Hỏi một lần cho cả lô, cùng một schema, mỗi ô tối đa 10 từ.
4. Cắt ô dài, bỏ trường không ai dùng, chuẩn hoá giá trị.
5. Viết hook kèm một câu mở đầu cuộc gọi (Sales) hoặc một góc nội dung kèm CTA (MKT).
6. Ghép vào file sạch: thêm cột, giữ nguyên số dòng, kiểm trước và sau.
7. Chốt ba quy tắc.

**Prompt Sales.**

```text
Từ danh sách 3 tài khoản sau, điền bảng 8 trường cho mỗi tài khoản:
ngành, quy mô, người phụ trách, kênh đang dùng, tín hiệu mua,
ngân sách ước tính, hook dưới 25 từ, rủi ro.
Quy tắc: mỗi ô tối đa 10 từ, chỉ một dữ kiện, không viết câu.
Cột cuối ghi nguồn chính.
Xuất bảng dán được vào Excel, mỗi dòng một tài khoản.
```

**Prompt MKT.**

```text
Tôi cần phân tích 2 đối thủ [...] và 1 nhóm khách [...] cho [sản phẩm].
Với mỗi đối thủ: định vị, thông điệp chính, kênh, giá/khuyến mãi đang chạy,
tín hiệu 3 tháng gần nhất, khoảng trống nội dung.
Mỗi ô tối đa 10 từ, chỉ một dữ kiện.
Sau đó chỉ ra 3 khoảng trống Cốc Cốc có thể chiếm, mỗi cái một câu.
```

**Đầu ra.** Sales: file sạch của vòng 1 thêm tám cột, mỗi dòng một tài khoản. MKT: `03-doi-thu.xlsx` gồm bảng đối thủ và ba khoảng trống.

**Kiểm.** Số dòng không đổi sau khi ghép. Mỗi ô một dữ kiện, không có đoạn văn. Hook dưới 25 từ và trích được một tín hiệu. Trường nào không có thì ghi “không rõ”, không để trống.

**Lỗi thường gặp.** Hồ sơ đúng nhưng vô dụng: ô dài, hook chung chung, kết quả nằm trong chat không vào file. Cách chặn: giới hạn 10 từ mỗi ô và bắt buộc ghép vào file qua mã khách hàng.

**Một câu về trách nhiệm.** Không cần duyệt lại từng ô. Nhưng thông tin nào dẫn tới báo giá hoặc đổi giá thì người gọi xác nhận, không phải AI.

### Vòng 4 — Đầu ra dùng được

**Học được.** Chốt tiêu chí trước, cho AI làm sau. Mỗi tin một lý do, một hành động. Checklist thương hiệu chạy trước khi gửi.

**Câu hỏi dẫn.** “Tin này có gửi được cho 100 người khác nhau không? Nếu có, nó chưa đủ riêng.”

**Nhánh Sales.** Chọn 15 lead từ file sạch. Viết bốn tiêu chí và trọng số ra giấy trước khi cho Claude chấm. Phân nhóm A/B/C, tự sửa ba ca sai. Viết ba tin dưới 80 từ: Zalo cho A, email cho B, kịch bản gọi 30 giây cho C. Mỗi tin một lý do lấy từ hồ sơ và một lời kêu gọi hành động.

**Nhánh MKT.** Lấy một brief thật. Viết ba đầu ra: bài đăng 120–150 từ, email 150 từ với tiêu đề dưới 9 từ, kịch bản video 30 giây gồm 5 cảnh. Mỗi đầu ra một CTA, theo quy chuẩn thương hiệu. Chạy checklist sáu điểm.

**Các bước.**

1. Làm mẫu: chấm ba lead, nói rõ vì sao; hoặc sửa một câu generic.
2. Chốt tiêu chí/trọng số hoặc brief/ràng buộc, viết ra giấy.
3. Claude làm bản nháp.
4. Tự sửa ba chỗ sai hoặc chung chung.
5. Chạy checklist, đọc to một tin.
6. Chốt bản cuối, lưu.
7. Chốt: một lý do, một CTA.

**Prompt Sales.**

```text
Chấm 15 lead sau theo 4 tiêu chí và trọng số đã chốt: [...].
Mỗi lead trả về: điểm từng tiêu chí, tổng, nhóm A/B/C, lý do 1 dòng.
Không dùng thông tin ngoài file. Không tự thêm lead.
Sau đó viết 3 tin dưới 80 từ:
- A: Zalo, lý do lấy từ hồ sơ, 1 CTA
- B: email, tiêu đề dưới 9 từ
- C: kịch bản gọi 30 giây
```

**Prompt MKT.**

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

**Đầu ra.** `04-dau-ra.md` gồm bảng lead và ba tin, hoặc ba đầu ra nội dung.

**Kiểm Sales.** Nhóm A không quá 20%. Mỗi tin có lý do lấy từ dữ liệu, không phải câu khen chung. Mỗi tin một CTA. Đọc to không thấy sai giọng.

**Kiểm MKT.** Qua sáu điểm checklist. Không có câu hứa tuyệt đối. Đọc to một bài, cả cặp nghe xem có giống Cốc Cốc không.

**Lỗi thường gặp.** Chấm A chiếm 70% vì tiêu chí lỏng; tin nhắn giống quảng cáo hàng loạt; nội dung dài, nhiều CTA. Cách chặn: chốt tỷ lệ phân bổ trước khi chấm, và chỉ cho một CTA.

**Dừng đúng chỗ.** Checklist và đọc to là bước cuối; đã đọc to thì không sửa thêm.

## 5. Ba quy tắc, dán lên tường

1. Số nào cũng phải bấm được vào ô nguồn.
2. Thông tin nào cũng phải nằm trong một ô của file, kèm nguồn chính — không để trong chat.
3. Câu nào cũng phải đọc to lên được mà không thấy sai giọng thương hiệu.

Khung yêu cầu năm dòng dùng xuyên suốt: vai trò, việc, dữ liệu, ràng buộc, đầu ra. Thêm hai câu bắt buộc: “hỏi lại nếu thiếu” và “liệt kê ba chỗ tôi cần kiểm”.

## 6. Chốt buổi

1. Thẻ một việc một tuần: việc, tần suất, người nhận, bước đầu làm thứ Hai.
2. Đóng gói Project: đổi tên, lưu các prompt vào `prompts.md`, ghim chat.
3. Hai cặp chia sẻ: một điều làm được, một lần AI sai và cách phát hiện.
4. Nhắc việc sau buổi: kiểm lại sau 48 giờ và sau một tuần; xoá dữ liệu thật nếu chính sách yêu cầu.

## 7. Vật liệu và vai trò

**Vật liệu.**

- Sổ bài tập in sẵn, mỗi cặp một bản.
- Data card in sẵn, điền trước.
- Checklist một trang: ba quy tắc kiểm, sáu điểm thương hiệu, tiêu chí chấm lead.
- Thẻ một việc một tuần.
- Project mẫu đã cấu hình để chiếu.
- Bộ đáp án của giảng viên, không phát.
- Không dùng slide. Chỉ một màn hình chiếu prompt, mốc giờ và kết quả mẫu.

**Vai trò.**

- Giảng viên chính giữ giờ và làm mẫu.
- Coach 1 phụ trách nhánh Sales, coach 2 phụ trách nhánh MKT.
- Coach không đưa đáp án, chỉ hỏi: “Kết quả đúng trông như thế nào?” và “Em kiểm bằng cách nào?”.
- Một người bấm giờ, chiếu đồng hồ đếm ngược.

## 8. Rủi ro

| Rủi ro | Phương án |
|---|---|
| Thiếu seat Claude | Chốt 10–12 seat trước; ít hơn thì giảm số cặp, không ghép bốn người một máy |
| File thật còn thông tin định danh | Data clinic gắn nhãn đỏ, cắt bản rút gọn từ chính file đó |
| File mỗi cặp một kiểu | Ba nhãn xanh/vàng/đỏ; bài tập viết theo thao tác, không theo cột cố định |
| Claude trả số sai | Quy tắc số phải truy về ô; đối chiếu ba con số; kiểm ba dòng ngẫu nhiên |
| Claude không bật web search | Tìm bằng trình duyệt, dán URL vào prompt; Claude chỉ tổng hợp và kiểm nguồn |
| Cháy giờ vì dữ liệu bẩn | Chốt trước việc tối thiểu của mỗi vòng; xong phần tối thiểu thì chuyển vòng, ghi phần còn tồn |
| Wifi yếu | File tải sẵn; một điện thoại phát 4G dự phòng |
| Trình độ không đều | Ghép mạnh–yếu; vai trò người lái và người kiểm đổi mỗi vòng |
| Lộ dữ liệu khi chia sẻ | Không đọc to tên/SĐT; không chụp màn hình có dữ liệu thật; chỉ chia sẻ đầu ra tổng hợp |

## 9. Trước buổi

| Mốc | Việc |
|---|---|
| T-7 | Gửi form thu file, data card, ba con số; danh sách cần Cốc Cốc gửi kèm |
| T-5 | Mở từng file, gắn nhãn xanh/vàng/đỏ |
| T-3 | Gọi ngắn với cặp vàng/đỏ; xác nhận seat và workspace |
| T-2 | Gửi data card đã điền, prompt khung, sổ bài tập bản điện tử |
| T-1 | In tài liệu, kiểm Project mẫu, kiểm máy chiếu, wifi, tài khoản dự phòng |

Cốc Cốc cần gửi trước T-7:

- Quy chuẩn thương hiệu một trang: xưng hô, từ cấm, quy tắc CTA.
- Danh sách 10 tài khoản mục tiêu cho nhánh Sales.
- Một brief thật, năm bài đăng cũ, số liệu ba tháng cho nhánh MKT.
- Ba con số chuẩn từ dashboard của mỗi nhóm.
- Xác nhận chính sách dữ liệu và workspace được dùng.

### Thư mời và form

Gửi trước T-7, nội dung ngắn:

```text
Tiêu đề: Buổi 1 — mang một file thật, ra một việc dùng được

Chào anh/chị,

Buổi 1 diễn ra ngày ___ tại ___. Cả buổi làm trên dữ liệu thật, nên trước buổi cần chuẩn bị:

1. Một file chính (lead/deal, 3–12 tháng) và một file phụ (chi phí, mục tiêu, hoặc danh sách tài khoản).
2. Bỏ 5 cột: tên, SĐT, email, địa chỉ, ghi chú tự do. Giữ mã, ngày, số tiền.
3. Ba con số từ báo cáo cũ: tổng lead/deal, CPL hoặc giá trị pipeline, tỷ lệ chốt.
4. Điền form trước ngày ___ (T-7).

Đi theo cặp. Mỗi cặp một máy và một tài khoản Claude. Chưa có tài khoản thì ghi trong form.
```

Form gồm bảy câu:

1. Tên cặp, nhánh Sales/MKT, ai lái, ai kiểm.
2. File chính: tên, số dòng, kỳ, các cột chính.
3. File phụ: tên và nội dung.
4. Câu hỏi chính của cặp.
5. Ba con số đối chiếu.
6. Đã bỏ năm cột định danh chưa?
7. Cần hỗ trợ gì trước buổi?

## 10. Giả định

- Có 10–12 seat Claude, workspace của công ty.
- File thật được phép ẩn danh và mang vào lớp.
- Có hai coach, phòng kê bàn theo cặp, có điện và wifi.
- Học viên đã từng dùng chat AI ít nhất một lần; không cần biết code.

Nếu một trong bốn giả định sai, phần bị ảnh hưởng nhiều nhất là vòng 1 và vòng 3. Kiểm tra trước T-5 để kịp đổi hình thức.
