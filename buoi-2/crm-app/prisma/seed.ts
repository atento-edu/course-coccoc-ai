import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Row = Record<string, string>;

function rows(file: string): Row[] {
  const full = path.join(process.cwd(), "data", file);
  return parse(fs.readFileSync(full), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
  });
}

const text = (v: string | undefined) => (v ?? "").trim();
const int = (v: string | undefined) => {
  const t = text(v).replace(/,/g, "");
  return t ? Math.round(Number(t)) : null;
};
const float = (v: string | undefined) => {
  const t = text(v).replace(/,/g, "");
  return t ? Number(t) : null;
};
const percent = (v: string | undefined) => {
  const t = text(v).replace("%", "");
  return t ? Math.round(Number(t)) : 0;
};

// CSV dùng ngày/tháng/năm, giờ Việt Nam (UTC+7). Lưu UTC trong database.
function date(v: string | undefined): Date | null {
  const t = text(v);
  if (!t) return null;
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [, d, mo, y, h = "00", mi = "00"] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h - 7, +mi));
}

function chunks<T>(items: T[], size = 500): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function main() {
  console.log("Đọc CSV...");
  const customerRows = rows("customers.csv");
  const dealRows = rows("deals.csv");
  const leadRows = rows("leads.csv");
  const activityRows = rows("activities.csv");

  console.log(
    `Khách hàng ${customerRows.length}, deal ${dealRows.length}, lead ${leadRows.length}, hoạt động ${activityRows.length}`,
  );

  console.log("Xoá dữ liệu cũ...");
  await prisma.auditLog.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("Tạo người dùng...");
  const teamOf = new Map<string, string>();
  for (const d of dealRows) {
    const name = text(d["Sales phụ trách"]);
    const team = text(d["Team"]);
    if (name && team) teamOf.set(name, team);
  }
  const names = new Set<string>();
  for (const d of dealRows) names.add(text(d["Sales phụ trách"]));
  for (const l of leadRows) names.add(text(l["Sales phụ trách"]));
  for (const c of customerRows) names.add(text(c["Sales phụ trách"]));
  names.delete("");

  const userByName = new Map<string, string>();
  for (const name of [...names].sort()) {
    const user = await prisma.user.create({
      data: {
        name,
        team: teamOf.get(name) ?? null,
        role: "SALES",
        capacity: 20,
      },
    });
    userByName.set(name, user.id);
  }

  const manager = await prisma.user.create({
    data: { name: "Nguyễn Mai Anh", team: "Ban giám đốc", role: "MANAGER", capacity: 99 },
  });
  const admin = await prisma.user.create({
    data: { name: "Quản trị hệ thống", team: "Vận hành", role: "ADMIN", capacity: 99 },
  });
  userByName.set(manager.name, manager.id);
  userByName.set(admin.name, admin.id);

  console.log("Tạo khách hàng...");
  await prisma.customer.createMany({
    data: customerRows.map((c) => ({
      id: text(c["Mã KH"]),
      name: text(c["Tên công ty"]),
      industry: text(c["Ngành"]) || null,
      segment: text(c["Phân khúc"]) || null,
      annualBudget: int(c["Ngân sách QC số/năm (triệu VNĐ)"]),
      city: text(c["Tỉnh/Thành phố"]) || null,
      agency: text(c["Agency"]) || null,
      ownerId: userByName.get(text(c["Sales phụ trách"])) ?? null,
      contactName: text(c["Người liên hệ chính"]) || null,
      contactTitle: text(c["Chức danh"]) || null,
      createdAt: date(c["Ngày tạo"]),
      status: text(c["Trạng thái"]) || null,
    })),
  });

  console.log("Tạo deal...");
  await prisma.deal.createMany({
    data: dealRows.map((d) => ({
      id: text(d["Mã deal"]),
      name: text(d["Tên chiến dịch"]),
      customerId: text(d["Mã KH"]),
      ownerId: userByName.get(text(d["Sales phụ trách"])) ?? null,
      team: text(d["Team"]) || null,
      source: text(d["Nguồn lead"]) || null,
      format: text(d["Định dạng"]) || null,
      value: text(d["Giá trị IO (VNĐ)"]).replace(/,/g, "") || "0",
      stage: text(d["Giai đoạn"]),
      status: text(d["Trạng thái"]) || null,
      probability: percent(d["Xác suất thành công"]),
      expectedValue: text(d["Giá trị kỳ vọng (VNĐ)"]).replace(/,/g, "") || "0",
      createdAt: date(d["Ngày tạo"]),
      expectedCloseAt: date(d["Ngày chốt dự kiến"]),
      actualCloseAt: date(d["Ngày chốt thực tế"]),
      campaignEndAt: date(d["Ngày kết thúc chiến dịch"]),
      lostReason: text(d["Lý do thất bại"]) || null,
      nextStep: text(d["Bước tiếp theo"]) || null,
      nextStepDueAt: date(d["Hạn bước tiếp theo"]),
      reminder: text(d["Nhắc việc"]) || null,
      lastInteractionAt: date(d["Tương tác cuối"]),
    })),
  });

  console.log("Tạo lead...");
  await prisma.lead.createMany({
    data: leadRows.map((l) => ({
      id: text(l["Mã lead"]),
      receivedAt: date(l["Thời điểm nhận"]),
      source: text(l["Nguồn lead"]) || null,
      company: text(l["Công ty"]),
      industry: text(l["Ngành"]) || null,
      annualBudget: int(l["Ngân sách QC số/năm (triệu VNĐ)"]),
      agency: text(l["Agency"]) || null,
      contactName: text(l["Người liên hệ"]) || null,
      contactTitle: text(l["Chức danh"]) || null,
      email: text(l["Email"]) || null,
      phone: text(l["Số điện thoại"]) || null,
      need: text(l["Nhu cầu"]) || null,
      productInterest: text(l["Sản phẩm quan tâm"]) || null,
      ownerId: userByName.get(text(l["Sales phụ trách"])) ?? null,
      assignedAt: date(l["Thời điểm giao"]),
      firstContactAt: date(l["Thời điểm liên hệ đầu tiên"]),
      status: text(l["Trạng thái lead"]) || null,
      note: text(l["Ghi chú"]) || null,
      segment: text(l["Phân khúc"]) || null,
      buyingChannel: text(l["Kênh mua"]) || null,
      customerId: text(l["Mã KH hiện có"]) || null,
      duplicateOf: text(l["Trùng lead"]) || null,
      score: int(l["Điểm"]),
      priority: text(l["Mức ưu tiên"]) || null,
      slaHours: int(l["SLA (giờ)"]),
      responseHours: float(l["Giờ phản hồi"]),
      slaStatus: text(l["Tình trạng SLA"]) || null,
      suggestedOwner: text(l["Sales gợi ý"]) || null,
      assignmentWarning: text(l["Cảnh báo phân công"]) || null,
    })),
  });

  console.log("Tạo hoạt động...");
  for (const batch of chunks(activityRows)) {
    await prisma.activity.createMany({
      data: batch.map((a) => ({
        id: text(a["Mã HĐ"]),
        date: date(a["Ngày"]) ?? new Date(),
        dealId: text(a["Mã deal"]),
        ownerId: userByName.get(text(a["Sales phụ trách"])) ?? null,
        type: text(a["Loại hoạt động"]),
        content: text(a["Nội dung"]),
      })),
    });
  }

  // Lead mới nhất: gán cho người phụ trách nếu có, nếu chưa thì để trống cho màn hình phân công.
  const counts = {
    users: await prisma.user.count(),
    customers: await prisma.customer.count(),
    deals: await prisma.deal.count(),
    leads: await prisma.lead.count(),
    activities: await prisma.activity.count(),
  };
  console.log("Xong:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
