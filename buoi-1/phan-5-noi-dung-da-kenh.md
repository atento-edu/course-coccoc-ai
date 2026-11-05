# Buổi 1 · Phần 5: Video ngắn đúng chất Cốc Cốc

Slide: `phan-5-noi-dung-da-kenh.html`, 21 slide, cùng khung với Phần 0. Công cụ gồm Claude, Google Flow và VieNeu-TTS. Mỗi người tự làm bài trên máy của mình.

## Cấu trúc

| Mục | Ý chính | Slide |
|---|---|---|
| 1. Demo | Mở bằng hai video: một do Claude làm, một do Flow vẽ | 2–4: demo Claude (90 giây), demo Flow (8 giây) |
| 2. Claude và Flow | Hai loại khác nhau ở đâu, việc nào dùng loại nào | 5–10: so sánh hai loại, use cases video ngắn, việc nào dùng loại nào, ba cách làm video với Claude (Claude Motion, HyperFrames, Remotion), thư viện phong cách MotionVideo |
| 3. Đúng chất Cốc Cốc | Đưa brand guidelines cho AI một lần, video nào cũng dùng chung | 11–15: bộ thương hiệu, phong cách "Cốc Cốc" bên Claude, đoạn phong cách bên Flow, kiểm thương hiệu |
| 4. Làm một video | Chốt kế hoạch trước khi dựng | 16–18: năm bước, ghép Flow với Claude, clip kết quả Flow + Claude |
| 5. Giọng đọc | Nhờ Claude dùng VieNeu-TTS đọc lời tiếng Việt | 19–20: ba giọng mẫu nghe thử, prompt cho Claude Code |
| Cuối | | 21: nguồn |

## Việc cần làm trước buổi

- [ ] **Chốt cách dùng Claude để làm video.** Hỏi Cốc Cốc đang dùng gói nào.
  - Team hoặc Enterprise: dùng được Claude Motion ngay trong app (bản beta). Với Enterprise, quản trị viên phải bật trong Organization settings › Artifacts.
  - Dùng Claude Code (gói Pro trở lên), chọn một trong hai skill và cài sẵn trên máy học viên:
    - HyperFrames của HeyGen: `npx skills add heygen-com/hyperframes`. Giấy phép Apache 2.0, công ty dùng miễn phí. Lần đầu tải một bản Chrome chạy ngầm (khoảng 700 MB). Tắt telemetry bằng `npx hyperframes telemetry disable`.
    - Remotion: `npx skills add remotion-dev/skills`. Miễn phí cho cá nhân và công ty tối đa 3 người; công ty cỡ Cốc Cốc phải mua Company License (remotion.dev/license) trước khi dùng cho việc thật.
- [ ] **Google Flow.** Mỗi học viên cần tài khoản Google có quyền dùng Flow và đủ credit. Mỗi lần tạo clip đều trừ credit, kể cả clip hỏng.
- [ ] **MotionVideo.** Mở motionvideo.xyz/en, chọn sẵn 2–3 mẫu gần với video Cốc Cốc (giao diện, biểu đồ, chữ động) để chiếu ở slide 10. Xem trước không cần tài khoản.
- [ ] **Nhận brand guidelines thật từ Cốc Cốc:** logo (bản màu, bản trắng), mã màu, font, linh vật, ảnh được phép dùng, quy tắc xưng hô và từ cấm, 4–5 video hoặc bài đăng cũ. Slide 11 chỉ nêu các mục, chưa có mã màu thật.
- [ ] **Làm sẵn phong cách "Cốc Cốc"** bên Claude và đoạn phong cách cho Flow từ guideline thật, để chiếu ở mục 2.
- [ ] **VieNeu-TTS.** Cài thử trên một máy học viên (`pip install vieneu`). Ba giọng mẫu có sẵn ở slide 20; nghe rồi chọn một giọng và điền tên vào prompt. Nghe thử chữ "Cốc Cốc", con số và từ tiếng Anh. Model v3 Turbo ghi giấy phép Apache 2.0 trên Hugging Face (kiểm ngày 4/11/2026); codec và bộ chuyển âm đi kèm có giấy phép riêng, cần đọc trước khi dùng cho quảng cáo.
- [ ] **Video demo:**
  - Claude: `assets/media/CocCoc_Gioi_thieu_v5_90s.mp4` (32 MB, 1920×1080, 90 giây), slide 3. Số liệu trong video (30 triệu người dùng, 15.000+ thương hiệu…) cần đối chiếu với nguồn của Cốc Cốc trước khi chiếu.
  - Flow: `assets/media/flow-demo.mp4` (1,4 MB, 720×1280, 8 giây), slide 4. Prompt trên slide là prompt mẫu cho cảnh này, không phải nguyên văn prompt đã chạy. Clip có tiếng nền nhỏ; nghe lại trước buổi.
  - Ghép Flow + Claude: `assets/media/flow-claude.mp4` (1,3 MB, 720×1280, 8 giây), slide 18. Clip mẫu do Claude thêm logo, chữ và CTA lên nền Flow; không có lời đọc.
- [ ] **Storyboard slide 3:** `assets/media/story-1.jpg` … `story-7.jpg`. Bấm từng ảnh để nhảy tới cảnh tương ứng trong video 90 giây.
- [ ] **Audio mẫu slide 20:** `assets/media/voice-ngoc-huyen.mp3`, `voice-thuy-dung.mp3`, `voice-hai-dang.mp3`. Cùng một câu: “Cốc Cốc có hơn ba mươi triệu người dùng. Tải Cốc Cốc trên iOS và Android.”
- [ ] Hai bản copy trùng `Flow.mp4` và `CocCoc_Gioi_thieu_v5_90s.mp4` ở thư mục gốc repo đã xoá; video gốc nằm trong `assets/media/`.

## Trên lớp

Mở thẳng bằng hai demo, để học viên thấy kết quả trước. Ở slide 3, bấm các ảnh cảnh để nhảy nhanh khi phân tích bảy cảnh. Qua slide 7, cho mỗi nhóm chọn một nhóm việc sát với mình rồi lấy đó làm đề bài cho phần thực hành. Qua slide 10, chiếu 2–3 mẫu MotionVideo và hỏi mẫu nào gần chất Cốc Cốc, mẫu nào chỉ để học chuyển động. Dừng lâu nhất ở mục 2: cho xem cùng một video có và không có phong cách "Cốc Cốc". Ở slide 18, chiếu clip ghép để cả nhóm thấy kết quả trước khi làm. Ở slide 20, cho nghe ba giọng mẫu rồi so sánh. Khi học viên làm bài, hỏi: "Cảnh này nên dựng bằng Claude hay Flow, vì sao?" và "Video này nhìn có biết ngay là của Cốc Cốc không?".

## Nguồn đã kiểm (4/11/2026)

- HyperFrames: github.com/heygen-com/hyperframes (Apache 2.0). Remotion: remotion.dev/docs/ai/skills, giấy phép ở remotion.dev/license.
- Claude Motion: support.claude.com/en/articles/17454997. Bản beta, gói Team và Enterprise, xuất ra MP4, tính vào hạn mức.
- Google Flow Help Center, support.google.com/flow: các chế độ tạo từ câu mô tả, khung đầu và khung cuối, ảnh tham chiếu (gõ `@`); Scenebuilder để ghép clip.
- VieNeu-TTS: github.com/pnnbao97/VieNeu-TTS. Chạy trên CPU, 25 giọng mẫu sẵn có (bản v3 Turbo), bắt chước giọng từ file 3–8 giây, xuất 48 kHz.
- MotionVideo: motionvideo.xyz/en. Thư viện video motion do AI làm, kèm prompt, kỹ thuật chuyển động (Moves), skill và MCP; xem trước không cần tài khoản.
