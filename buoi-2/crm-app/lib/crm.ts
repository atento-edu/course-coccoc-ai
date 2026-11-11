export const STAGES = [
  { name: "Tiếp cận", probability: 10, color: "#94A3B8" },
  { name: "Nhận brief", probability: 20, color: "#60A5FA" },
  { name: "Gửi đề xuất", probability: 40, color: "#F59E0B" },
  { name: "Đàm phán", probability: 60, color: "#F16037" },
  { name: "Chờ ký IO", probability: 80, color: "#25AF50" },
  { name: "Thành công", probability: 100, color: "#14842F" },
  { name: "Thất bại", probability: 0, color: "#DC2626" },
] as const;

export const OPEN_STAGES = STAGES.filter((s) => s.name !== "Thành công" && s.name !== "Thất bại");

export const LEAD_STATUSES = [
  "Mới",
  "Đã phân công",
  "Đang chăm sóc",
  "Đủ điều kiện",
  "Chuyển thành deal",
  "Loại",
] as const;

export const LEAD_SOURCES = [
  "Agency đối tác",
  "Giới thiệu",
  "Gọi lạnh",
  "Hotline",
  "Form website",
  "Sự kiện",
  "Khách hiện hữu",
  "Quảng cáo",
  "Khác",
] as const;

export const PRIORITIES = ["Cao", "Trung bình", "Thấp"] as const;

export const INDUSTRIES = [
  "FMCG",
  "Bất động sản",
  "Du lịch - Hàng không",
  "Giáo dục",
  "Tài chính - Ngân hàng",
  "Thương mại điện tử",
  "Ô tô - Xe máy",
  "Dược phẩm - Sức khỏe",
  "Công nghệ",
  "Khác",
] as const;

export const SEGMENTS = ["Key Account", "Mid-market", "SME"] as const;

export const BUYING_CHANNELS = ["Qua agency", "Trực tiếp"] as const;

export const FORMATS = [
  "Search Ads",
  "Shopping Ads",
  "Native In-feed",
  "Mobile Native",
  "Banner Tab mới",
  "Video Pre-roll",
  "Khác",
] as const;

export const ACTIVITY_TYPES = ["Gọi điện", "Email", "Họp", "Gửi media plan", "Gửi IO", "Ghi chú"] as const;

export const LOST_REASONS = [
  "Giá CPM/CPC cao",
  "Ngân sách bị cắt",
  "Chọn đối thủ",
  "Không phù hợp KPI",
  "Dự án tạm hoãn",
  "Khác",
] as const;

export const LEAD_STATUS_COLORS: Record<string, string> = {
  "Mới": "bg-blue-50 text-blue-700 border-blue-200",
  "Đã phân công": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Đang chăm sóc": "bg-amber-50 text-amber-700 border-amber-200",
  "Đủ điều kiện": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Chuyển thành deal": "bg-green-50 text-green-800 border-green-200",
  "Loại": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export const PRIORITY_COLORS: Record<string, string> = {
  "Cao": "bg-red-50 text-red-700 border-red-200",
  "Trung bình": "bg-amber-50 text-amber-700 border-amber-200",
  "Thấp": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function stageMeta(stage: string) {
  return STAGES.find((s) => s.name === stage) ?? STAGES[0];
}

export function scoreLead(input: {
  annualBudget?: number | null;
  source?: string | null;
  segment?: string | null;
}): { score: number; priority: "Cao" | "Trung bình" | "Thấp"; slaHours: number } {
  let score = 0;
  const budget = input.annualBudget ?? 0;
  if (budget >= 5000) score += 3;
  else if (budget >= 1000) score += 2;
  else if (budget >= 300) score += 1;

  if (["Giới thiệu", "Agency đối tác", "Khách hiện hữu"].includes(input.source ?? "")) score += 2;
  else if (["Form website", "Hotline", "Sự kiện"].includes(input.source ?? "")) score += 1;

  if (input.segment === "Key Account") score += 2;
  else if (input.segment === "Mid-market") score += 1;

  const priority = score >= 5 ? "Cao" : score >= 3 ? "Trung bình" : "Thấp";
  return { score: Math.min(score, 7), priority, slaHours: priority === "Cao" ? 4 : priority === "Trung bình" ? 24 : 48 };
}

export function expectedValue(value: number, stage: string): number {
  return Math.round((value * stageMeta(stage).probability) / 100);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
