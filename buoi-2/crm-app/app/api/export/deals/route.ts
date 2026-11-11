import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";

export const instant = false;

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };

  const deals = await db.deal.findMany({
    where: scope,
    orderBy: { createdAt: "desc" },
    include: { customer: true, owner: true },
  });

  const header = [
    "Mã deal",
    "Tên chiến dịch",
    "Khách hàng",
    "Ngành",
    "Phân khúc",
    "Sales",
    "Team",
    "Nguồn",
    "Định dạng",
    "Giá trị IO",
    "Giai đoạn",
    "Trạng thái",
    "Xác suất",
    "Giá trị kỳ vọng",
    "Ngày tạo",
    "Chốt dự kiến",
    "Chốt thực tế",
    "Bước tiếp theo",
    "Hạn bước tiếp theo",
    "Tương tác cuối",
  ];

  const lines = [header.map(csvCell).join(",")];
  for (const d of deals) {
    lines.push(
      [
        d.id,
        d.name,
        d.customer.name,
        d.customer.industry,
        d.customer.segment,
        d.owner?.name,
        d.team,
        d.source,
        d.format,
        d.value.toString(),
        d.stage,
        d.status,
        d.probability,
        d.expectedValue.toString(),
        d.createdAt?.toISOString(),
        d.expectedCloseAt?.toISOString(),
        d.actualCloseAt?.toISOString(),
        d.nextStep,
        d.nextStepDueAt?.toISOString(),
        d.lastInteractionAt?.toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  return new Response("\uFEFF" + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="deal-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
