// Bộ dữ liệu CRM mô phỏng được chốt ngày 31/10/2026 (xem tab Hướng dẫn của Google Sheet).
// App dùng mốc này làm "hôm nay" để cảnh báo quá hạn và deal nguội khớp với số liệu Buổi 1.
export const DATA_AS_OF = "31/10/2026";
export const DEMO_TODAY = new Date("2026-10-31T16:59:59.000Z");

export function demoNow(): Date {
  return new Date(DEMO_TODAY);
}
