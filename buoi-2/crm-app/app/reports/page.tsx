import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { formatNumber, formatPercent, formatVnd } from "@/lib/format";
import { Bar, Card, Empty, PageHeader } from "@/components/ui";

export const instant = false;

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const yearStart = new Date("2026-01-01T00:00:00+07:00");
  const yearEnd = new Date("2027-01-01T00:00:00+07:00");
  const scope = seesEverything(user) ? {} : { ownerId: user.id };

  const [deals, open, leads, users] = await Promise.all([
    db.deal.findMany({
      where: { actualCloseAt: { gte: yearStart, lt: yearEnd }, ...scope },
      select: {
        id: true,
        name: true,
        value: true,
        expectedValue: true,
        status: true,
        source: true,
        format: true,
        lostReason: true,
        actualCloseAt: true,
        createdAt: true,
        ownerId: true,
        customer: { select: { industry: true, segment: true } },
      },
    }),
    db.deal.findMany({
      where: { status: "Đang mở", ...scope },
      select: { value: true, expectedValue: true, stage: true },
    }),
    db.lead.findMany({ where: scope, select: { status: true, source: true } }),
    db.user.findMany({ select: { id: true, name: true, team: true } }),
  ]);

  const won = deals.filter((d) => d.status === "Thành công");
  const lost = deals.filter((d) => d.status === "Thất bại");
  const revenue = won.reduce((s, d) => s + Number(d.value), 0);
  const pipeline = open.reduce((s, d) => s + Number(d.expectedValue), 0);
  const winRate = won.length + lost.length > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;
  const avgDeal = won.length > 0 ? revenue / won.length : 0;
  const convertedLeads = leads.filter((l) => l.status === "Chuyển thành deal").length;
  const conversion = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

  const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
  const monthly = monthNames.map((label, i) => {
    const rows = won.filter((d) => d.actualCloseAt && new Date(d.actualCloseAt).getMonth() === i);
    return { label, revenue: rows.reduce((s, d) => s + Number(d.value), 0), count: rows.length };
  });
  const maxMonth = Math.max(...monthly.map((m) => m.revenue), 1);

  const bySales = users
    .map((u) => {
      const rows = won.filter((d) => d.ownerId === u.id);
      return {
        id: u.id,
        name: u.name,
        team: u.team,
        revenue: rows.reduce((s, d) => s + Number(d.value), 0),
        count: rows.length,
      };
    })
    .filter((x) => x.count > 0 || x.team)
    .sort((a, b) => b.revenue - a.revenue);

  function group<T extends string>(rows: typeof deals, key: (d: (typeof deals)[number]) => T | null) {
    const map = new Map<string, { revenue: number; count: number }>();
    for (const d of rows) {
      const k = key(d) ?? "Khác";
      const cur = map.get(k) ?? { revenue: 0, count: 0 };
      map.set(k, { revenue: cur.revenue + Number(d.value), count: cur.count + 1 });
    }
    return [...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  }

  const bySource = group(won, (d) => d.source);
  const byFormat = group(won, (d) => d.format);
  const byIndustry = group(won, (d) => d.customer.industry);
  const lostReasons = [...lost.reduce((m, d) => { const k = d.lostReason ?? "Khác"; m.set(k, (m.get(k) ?? 0) + 1); return m; }, new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(...bySource.map(([, v]) => v.revenue), 1);

  return (
    <>
      <PageHeader
        title="Báo cáo"
        description="Số liệu năm 2026, tính trực tiếp từ deal và hoạt động. Xuất CSV để đối chiếu với Google Sheet."
        actions={<a href="/api/export/deals" className="btn"><Download size={14} /> Xuất CSV deal</a>}
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Doanh số chốt", value: formatVnd(revenue, true), hint: `${won.length} deal` },
          { label: "Pipeline mở", value: formatVnd(pipeline, true), hint: `${open.length} deal` },
          { label: "Tỷ lệ thắng", value: formatPercent(winRate), hint: `${won.length} thắng / ${lost.length} thua` },
          { label: "Deal trung bình", value: formatVnd(avgDeal, true), hint: "trên deal thành công" },
          { label: "Lead → deal", value: formatPercent(conversion), hint: `${convertedLeads}/${leads.length} lead` },
        ].map((k) => (
          <div key={k.label} className="card px-4 py-3">
            <div className="kpi-label">{k.label}</div>
            <div className="mt-1 text-[22px] font-semibold leading-none">{k.value}</div>
            <div className="mt-1 text-[11px] text-muted">{k.hint}</div>
          </div>
        ))}
      </div>

      <Card title="Doanh số theo tháng" subtitle={`Năm 2026 · ${formatVnd(revenue, true)}`} className="mb-4">
        <div className="flex h-56 items-end gap-2 pt-2">
          {monthly.map((m) => (
            <div key={m.label} className="group flex h-full flex-1 flex-col justify-end">
              <div className="mb-1 text-center text-[10px] text-muted">{m.revenue > 0 ? formatVnd(m.revenue, true) : ""}</div>
              <div className="rounded-t-md bg-brand/75 transition group-hover:bg-brand" style={{ height: `${Math.max(m.revenue > 0 ? 4 : 1, (m.revenue / maxMonth) * 100)}%` }} />
              <div className="mt-1 text-center text-[10.5px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Theo sales" subtitle="Doanh số chốt 2026" pad={false}>
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[480px]">
              <thead><tr><th>Sales</th><th>Team</th><th>Deal</th><th>Doanh số</th><th>Tỷ trọng</th></tr></thead>
              <tbody>
                {bySales.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium">{s.name}</td>
                    <td className="text-muted">{s.team ?? "—"}</td>
                    <td>{s.count}</td>
                    <td className="whitespace-nowrap font-medium text-brand-deep">{formatVnd(s.revenue, true)}</td>
                    <td className="w-32"><Bar value={s.revenue} max={revenue || 1} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Theo nguồn lead" subtitle="Doanh số chốt 2026" pad={false}>
          <div className="space-y-2.5 p-4">
            {bySource.length === 0 ? <Empty>Chưa có dữ liệu.</Empty> : bySource.map(([name, v]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between gap-2 text-[12px]"><span>{name}</span><span className="text-muted">{v.count} deal · {formatVnd(v.revenue, true)}</span></div>
                <Bar value={v.revenue} max={maxSource} color="#F16037" />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Theo định dạng" subtitle="Doanh số chốt 2026" pad={false}>
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[420px]">
              <thead><tr><th>Định dạng</th><th>Deal</th><th>Doanh số</th><th>Tỷ trọng</th></tr></thead>
              <tbody>
                {byFormat.map(([name, v]) => (
                  <tr key={name}>
                    <td>{name}</td><td>{v.count}</td>
                    <td className="whitespace-nowrap font-medium">{formatVnd(v.revenue, true)}</td>
                    <td className="w-32"><Bar value={v.revenue} max={revenue || 1} color="#14842F" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Theo ngành" subtitle="Doanh số chốt 2026" pad={false}>
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[420px]">
              <thead><tr><th>Ngành</th><th>Deal</th><th>Doanh số</th><th>Tỷ trọng</th></tr></thead>
              <tbody>
                {byIndustry.map(([name, v]) => (
                  <tr key={name}>
                    <td>{name}</td><td>{v.count}</td>
                    <td className="whitespace-nowrap font-medium">{formatVnd(v.revenue, true)}</td>
                    <td className="w-32"><Bar value={v.revenue} max={revenue || 1} color="#60A5FA" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Lý do thất bại" subtitle={`${lost.length} deal thất bại trong 2026`} className="xl:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lostReasons.length === 0 ? <Empty>Chưa có deal thất bại.</Empty> : lostReasons.map(([reason, count]) => (
              <div key={reason} className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2.5">
                <span className="text-[12.5px]">{reason}</span>
                <span className="badge border-red-200 bg-red-50 text-red-700">{formatNumber(count)} deal</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-muted">Tổng doanh số đã mất: {formatVnd(lost.reduce((s, d) => s + Number(d.value), 0), true)}.</p>
        </Card>
      </div>

      <p className="mt-4 text-[11.5px] text-muted">
        Số liệu tính từ database, không đọc Google Sheet lúc chạy. Muốn đối chiếu, mở Sheet Buổi 1 và lọc cùng kỳ. Chênh lệch thường do thời điểm chốt số và bộ lọc trạng thái.
      </p>
    </>
  );
}
