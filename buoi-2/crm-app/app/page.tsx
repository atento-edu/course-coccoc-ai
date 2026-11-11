import Link from "next/link";
import { ArrowRight, CalendarClock, Flame, PhoneCall, TriangleAlert, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { formatDate, formatNumber, formatPercent, formatVnd, daysBetween } from "@/lib/format";
import { OPEN_STAGES, stageMeta } from "@/lib/crm";
import { DATA_AS_OF, demoNow } from "@/lib/clock";
import { Bar, Card, Empty, Kpi, PageHeader, SeeAll } from "@/components/ui";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const now = demoNow();
  const yearStart = new Date("2026-01-01T00:00:00+07:00");
  const staleCutoff = new Date(now.getTime() - 14 * 86_400_000);
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const openWhere = { status: "Đang mở", ...scope };
  const yearWonWhere = { status: "Thành công", actualCloseAt: { gte: yearStart }, ...scope };

  const [
    won,
    open,
    wonCount,
    closedCount,
    activeLeads,
    newLeads,
    staleCount,
    overdueCount,
    lateLeads,
    stages,
    worklist,
    recent,
    monthlyDeals,
    ownerPerf,
    users,
    activitiesThisWeek,
  ] = await Promise.all([
    db.deal.aggregate({ where: yearWonWhere, _sum: { value: true } }),
    db.deal.aggregate({ where: openWhere, _sum: { expectedValue: true }, _count: { _all: true } }),
    db.deal.count({ where: yearWonWhere }),
    db.deal.count({
      where: {
        status: { in: ["Thành công", "Thất bại"] },
        actualCloseAt: { gte: yearStart },
        ...scope,
      },
    }),
    db.lead.count({ where: { status: { notIn: ["Loại", "Chuyển thành deal"] }, ...scope } }),
    db.lead.count({ where: { status: "Mới", ...scope } }),
    db.deal.count({ where: { ...openWhere, lastInteractionAt: { lt: staleCutoff } } }),
    db.deal.count({ where: { ...openWhere, nextStepDueAt: { lt: now } } }),
    db.lead.count({
      where: { status: { notIn: ["Loại", "Chuyển thành deal"] }, slaStatus: { in: ["Trễ SLA", "Quá hạn chưa liên hệ"] }, ...scope },
    }),
    db.deal.groupBy({
      by: ["stage"],
      where: openWhere,
      _sum: { expectedValue: true },
      _count: { _all: true },
    }),
    db.deal.findMany({
      where: {
        ...openWhere,
        OR: [
          { nextStepDueAt: { lt: now } },
          { lastInteractionAt: { lt: staleCutoff } },
          { lastInteractionAt: null },
        ],
      },
      orderBy: [{ nextStepDueAt: "asc" }, { lastInteractionAt: "asc" }],
      take: 7,
      include: { customer: true, owner: true },
    }),
    db.activity.findMany({
      where: seesEverything(user) ? {} : { deal: { ownerId: user.id } },
      orderBy: { date: "desc" },
      take: 6,
      include: { deal: { include: { customer: true } }, owner: true },
    }),
    db.deal.findMany({
      where: yearWonWhere,
      select: { actualCloseAt: true, value: true },
    }),
    db.deal.groupBy({
      by: ["ownerId"],
      where: yearWonWhere,
      _sum: { value: true },
      _count: { _all: true },
    }),
    db.user.findMany({ select: { id: true, name: true, team: true } }),
    db.activity.count({
      where: {
        date: { gte: new Date(now.getTime() - 7 * 86_400_000) },
        ...(seesEverything(user) ? {} : { deal: { ownerId: user.id } }),
      },
    }),
  ]);

  const revenue = Number(won._sum.value ?? 0);
  const pipeline = Number(open._sum.expectedValue ?? 0);
  const winRate = closedCount > 0 ? (wonCount / closedCount) * 100 : 0;
  const maxStage = Math.max(...stages.map((s) => Number(s._sum.expectedValue ?? 0)), 1);

  const monthMap = new Map<number, number>();
  for (const d of monthlyDeals) {
    if (!d.actualCloseAt) continue;
    const m = new Date(d.actualCloseAt).getMonth();
    monthMap.set(m, (monthMap.get(m) ?? 0) + Number(d.value));
  }
  const monthly = Array.from({ length: 12 }, (_, i) => monthMap.get(i) ?? 0);
  const maxMonth = Math.max(...monthly, 1);

  const userName = new Map(users.map((u) => [u.id, u]));
  const topSales = ownerPerf
    .map((p) => ({
      name: userName.get(p.ownerId ?? "")?.name ?? "Chưa gán",
      team: userName.get(p.ownerId ?? "")?.team ?? "",
      revenue: Number(p._sum.value ?? 0),
      deals: p._count._all,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Tổng quan"
        description={`Số liệu chốt ngày ${DATA_AS_OF}. ${seesEverything(user) ? "Bạn đang xem toàn bộ pipeline." : "Bạn đang xem lead và deal của mình."}`}
        actions={
          <>
            <Link href="/leads/new" className="btn btn-primary">
              + Lead mới
            </Link>
            <Link href="/deals/new" className="btn">
              + Deal mới
            </Link>
          </>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Doanh số chốt 2026"
          value={formatVnd(revenue, true)}
          hint={`${wonCount} deal thành công`}
          href="/reports"
          accent="green"
        />
        <Kpi
          label="Pipeline đang mở"
          value={formatVnd(pipeline, true)}
          hint={`${open._count._all} deal · giá trị kỳ vọng`}
          href="/deals"
        />
        <Kpi
          label="Tỷ lệ thắng"
          value={formatPercent(winRate)}
          hint={`${wonCount}/${closedCount} deal đã đóng trong 2026`}
          href="/reports"
        />
        <Kpi
          label="Lead đang chăm"
          value={formatNumber(activeLeads)}
          hint={`${newLeads} lead mới chờ phân công`}
          href="/leads"
          accent="orange"
        />
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <Link href="/deals?view=worklist" className="flex items-center gap-2 rounded-xl border border-orange/25 bg-orange/8 px-3.5 py-2.5 text-[12.5px] text-ink-2 hover:border-orange/50">
          <CalendarClock size={15} className="text-orange" />
          <b className="font-semibold text-ink">{overdueCount}</b> deal quá hạn bước tiếp theo
          <ArrowRight size={13} className="ml-auto text-orange" />
        </Link>
        <Link href="/deals?view=stale" className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12.5px] text-ink-2 hover:border-amber-300">
          <Flame size={15} className="text-amber-600" />
          <b className="font-semibold text-ink">{staleCount}</b> deal nguội hơn 14 ngày
          <ArrowRight size={13} className="ml-auto text-amber-600" />
        </Link>
        <Link href="/leads?sla=late" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-ink-2 hover:border-red-300">
          <TriangleAlert size={15} className="text-red-600" />
          <b className="font-semibold text-ink">{lateLeads}</b> lead trễ SLA
          <ArrowRight size={13} className="ml-auto text-red-600" />
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card
          title="Việc cần làm hôm nay"
          subtitle="Deal quá hạn bước tiếp theo hoặc lâu không tương tác"
          action={<SeeAll href="/deals">Mở pipeline</SeeAll>}
          pad={false}
        >
          {worklist.length === 0 ? (
            <div className="p-4">
              <Empty>Không có deal nào cần chú ý. Tốt.</Empty>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {worklist.map((d) => {
                const stale = daysBetween(d.lastInteractionAt);
                const overdue = d.nextStepDueAt && new Date(d.nextStepDueAt) < now;
                return (
                  <li key={d.id}>
                    <Link href={`/deals/${d.id}`} className="flex items-start gap-3 px-4 py-3 transition hover:bg-brand-soft/40">
                      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-paper-2 text-[11px] font-bold text-ink-2">
                        {stageMeta(d.stage).probability}%
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-[13px] font-semibold">{d.name}</span>
                          {overdue ? (
                            <span className="badge border-orange/25 bg-orange/10 text-orange">Quá hạn</span>
                          ) : stale != null && stale > 14 ? (
                            <span className="badge border-amber-200 bg-amber-50 text-amber-700">{stale} ngày nguội</span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 truncate text-[11.5px] text-muted">
                          {d.customer.name} · {d.owner?.name ?? "Chưa gán"} · {formatVnd(d.value, true)}
                        </div>
                        <div className="mt-1 truncate text-[12px] text-ink-2">
                          {d.nextStep || "Chưa đặt bước tiếp theo"}
                          {d.nextStepDueAt ? <span className="text-muted"> · hạn {formatDate(d.nextStepDueAt)}</span> : null}
                        </div>
                      </div>
                      <span className="mt-1 text-[11px] text-muted">{d.stage}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Pipeline theo giai đoạn" subtitle="Giá trị kỳ vọng của deal đang mở">
          <div className="space-y-3">
            {OPEN_STAGES.map((stage) => {
              const row = stages.find((s) => s.stage === stage.name);
              const value = Number(row?._sum.expectedValue ?? 0);
              return (
                <div key={stage.name}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-ink-2">{stage.name}</span>
                    <span className="text-[11.5px] text-muted">
                      {row?._count._all ?? 0} deal · {formatVnd(value, true)}
                    </span>
                  </div>
                  <Bar value={value} max={maxStage} color={stage.color} />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-paper-2 px-3 py-2 text-[11.5px] text-muted">
            <Users size={14} />
            {activitiesThisWeek} hoạt động trong 7 ngày qua
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card title="Doanh số theo tháng" subtitle="Deal thành công trong năm 2026">
          <div className="flex h-44 items-end gap-1.5 pt-2">
            {monthly.map((value, i) => (
              <div key={i} className="group flex h-full flex-1 flex-col justify-end">
                <div className="mb-1 hidden text-center text-[10px] text-muted group-hover:block">
                  {value > 0 ? formatVnd(value, true) : ""}
                </div>
                <div
                  className="rounded-t-md bg-brand/75 transition group-hover:bg-brand"
                  style={{ height: `${Math.max(value > 0 ? 4 : 1, (value / maxMonth) * 100)}%` }}
                />
                <div className="mt-1 text-center text-[10px] text-muted">T{i + 1}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top sales" subtitle="Doanh số chốt 2026" action={<SeeAll href="/reports">Báo cáo</SeeAll>} pad={false}>
          <ul className="divide-y divide-line">
            {topSales.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2.5 px-4 py-2.5">
                <span className="w-4 text-[11px] font-semibold text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted">
                    {s.deals} deal · {s.team}
                  </div>
                </div>
                <span className="text-[12.5px] font-semibold text-brand-deep">{formatVnd(s.revenue, true)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Hoạt động gần đây" className="mt-4" action={<SeeAll href="/activities">Nhật ký</SeeAll>} pad={false}>
        <ul className="divide-y divide-line">
          {recent.map((a) => (
            <li key={a.id} className="flex items-start gap-3 px-4 py-2.5">
              <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-deep">
                <PhoneCall size={13} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px]">
                  <b className="font-semibold">{a.type}</b> · {a.content}
                </div>
                <div className="truncate text-[11px] text-muted">
                  {a.deal.customer.name} · {a.deal.name} · {a.owner?.name ?? "—"}
                </div>
              </div>
              <span className="whitespace-nowrap text-[11px] text-muted">{formatDate(a.date)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
