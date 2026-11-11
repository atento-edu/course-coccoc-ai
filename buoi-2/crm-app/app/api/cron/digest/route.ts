import { db } from "@/lib/db";
import { formatVnd } from "@/lib/format";
import { demoNow } from "@/lib/clock";

export const instant = false;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = demoNow();
  const staleCutoff = new Date(now.getTime() - 14 * 86_400_000);

  const [users, deals, leads] = await Promise.all([
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true } }),
    db.deal.findMany({
      where: { status: "Đang mở" },
      select: {
        id: true,
        name: true,
        ownerId: true,
        value: true,
        nextStep: true,
        nextStepDueAt: true,
        lastInteractionAt: true,
        customer: { select: { name: true } },
      },
    }),
    db.lead.findMany({
      where: { status: { notIn: ["Loại", "Chuyển thành deal"] } },
      select: { id: true, company: true, ownerId: true, slaStatus: true, priority: true },
    }),
  ]);

  const digest = users.map((u) => {
    const own = deals.filter((d) => d.ownerId === u.id);
    const overdue = own.filter((d) => d.nextStepDueAt && new Date(d.nextStepDueAt) < now);
    const stale = own.filter((d) => !d.lastInteractionAt || new Date(d.lastInteractionAt) < staleCutoff);
    const lateLeads = leads.filter((l) => l.ownerId === u.id && ["Trễ SLA", "Quá hạn chưa liên hệ"].includes(l.slaStatus ?? ""));
    return {
      user: u.name,
      team: u.team,
      overdue: overdue.map((d) => ({ id: d.id, deal: d.name, customer: d.customer.name, nextStep: d.nextStep })),
      stale: stale.map((d) => ({ id: d.id, deal: d.name, customer: d.customer.name, value: formatVnd(d.value, true) })),
      lateLeads: lateLeads.map((l) => ({ id: l.id, company: l.company, priority: l.priority })),
      summary: { overdue: overdue.length, stale: stale.length, lateLeads: lateLeads.length },
    };
  });

  return Response.json({
    generatedAt: now.toISOString(),
    note: "Bản mô phỏng. Production: gửi email/Slack thay vì trả JSON.",
    totals: digest.reduce(
      (acc, d) => ({
        overdue: acc.overdue + d.summary.overdue,
        stale: acc.stale + d.summary.stale,
        lateLeads: acc.lateLeads + d.summary.lateLeads,
      }),
      { overdue: 0, stale: 0, lateLeads: 0 },
    ),
    digest,
  });
}
